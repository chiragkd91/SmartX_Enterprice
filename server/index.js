/**
 * SmartBizFlow HR Portal - Backend Server
 * Express.js server with authentication, API routes, and database integration
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dbService from './database.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
dbService.initialize().catch(console.error);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF and document files are allowed!'));
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Authorization middleware
const authorize = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // For now, allow all authenticated users
    // In production, implement proper permission checking
    next();
  };
};

// Audit logging middleware
const auditLog = (action, table) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
      // Log the action after response is sent
      dbService.logAudit({
        userId: req.user?.id,
        action,
        table,
        recordId: req.params.id || req.body.id,
        oldValues: req.method === 'PUT' || req.method === 'DELETE' ? JSON.stringify(req.body) : null,
        newValues: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : null,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }).catch(console.error);
      
      originalSend.call(this, data);
    };
    next();
  };
};

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await dbService.getUserByEmail(email);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password route
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Get user from database
    const user = await dbService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidCurrentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update user password in database
    await dbService.updateUserPassword(userId, hashedNewPassword);

    // Log the password change
    await dbService.logAudit({
      userId,
      action: 'CHANGE_PASSWORD',
      table: 'users',
      recordId: userId,
      oldValues: null,
      newValues: null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Employee routes
app.get('/api/employees', authenticateToken, authorize(['employees.view']), async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const employees = await dbService.getEmployees(parseInt(limit), parseInt(offset));
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/employees/:id', authenticateToken, authorize(['employees.view']), async (req, res) => {
  try {
    const employee = await dbService.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/employees', authenticateToken, authorize(['employees.create']), auditLog('CREATE', 'employees'), async (req, res) => {
  try {
    const employee = await dbService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Attendance routes
app.get('/api/attendance', authenticateToken, authorize(['attendance.view']), async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const attendance = await dbService.getAttendance(
      employeeId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/attendance/check-in', authenticateToken, authorize(['attendance.create']), async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    
    const attendance = await dbService.createAttendance({
      employeeId,
      date: now,
      checkIn: now,
      status: 'PRESENT'
    });
    
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/attendance/check-out', authenticateToken, authorize(['attendance.update']), async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    
    // Find today's attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await dbService.getAttendance(employeeId, today, today);
    if (attendance.length === 0) {
      return res.status(404).json({ error: 'No attendance record found for today' });
    }
    
    const record = attendance[0];
    record.checkOut = now;
    record.totalHours = (now.getTime() - new Date(record.checkIn).getTime()) / (1000 * 60 * 60);
    
    // Update the record (simplified for JSON database)
    res.json(record);
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leave routes
app.get('/api/leaves', authenticateToken, authorize(['leaves.view']), async (req, res) => {
  try {
    const { employeeId } = req.query;
    const leaves = await dbService.getLeaves(employeeId);
    res.json(leaves);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/leaves', authenticateToken, authorize(['leaves.create']), auditLog('CREATE', 'leaves'), async (req, res) => {
  try {
    const leave = await dbService.createLeave(req.body);
    res.status(201).json(leave);
  } catch (error) {
    console.error('Create leave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/leaves/:id/approve', authenticateToken, authorize(['leaves.approve']), auditLog('APPROVE', 'leaves'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    // In a real implementation, you would update the leave record
    res.json({ message: 'Leave request updated successfully' });
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Training routes
app.get('/api/training/courses', authenticateToken, authorize(['training.view']), async (req, res) => {
  try {
    const courses = await dbService.getTrainingCourses();
    res.json(courses);
  } catch (error) {
    console.error('Get training courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/training/enroll', authenticateToken, authorize(['training.enroll']), async (req, res) => {
  try {
    const { employeeId, courseId } = req.body;
    // In a real implementation, you would create an enrollment record
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard routes
app.get('/api/dashboard/stats', authenticateToken, authorize(['dashboard.view']), async (req, res) => {
  try {
    const stats = await dbService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload route
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CRM Routes
app.get('/api/crm/customers', authenticateToken, authorize(['crm.view']), async (req, res) => {
  try {
    const { limit = 50, offset = 0, search, segment, status } = req.query;
    const customers = await dbService.getCustomers({
      limit: parseInt(limit),
      offset: parseInt(offset),
      search,
      segment,
      status
    });
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/crm/customers/:id', authenticateToken, authorize(['crm.view']), async (req, res) => {
  try {
    const customer = await dbService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/crm/customers', authenticateToken, authorize(['crm.create']), auditLog('CREATE', 'customers'), async (req, res) => {
  try {
    const customer = await dbService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/crm/customers/:id', authenticateToken, authorize(['crm.update']), auditLog('UPDATE', 'customers'), async (req, res) => {
  try {
    const customer = await dbService.updateCustomer(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/crm/customers/:id', authenticateToken, authorize(['crm.delete']), auditLog('DELETE', 'customers'), async (req, res) => {
  try {
    const success = await dbService.deleteCustomer(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ERP Financial Management Routes
app.get('/api/erp/financial/accounts', authenticateToken, authorize(['finance.view']), async (req, res) => {
  try {
    const { type, status } = req.query;
    const accounts = await dbService.getChartOfAccounts({ type, status });
    res.json(accounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/erp/financial/accounts', authenticateToken, authorize(['finance.create']), auditLog('CREATE', 'chart_of_accounts'), async (req, res) => {
  try {
    const account = await dbService.createChartOfAccount(req.body);
    res.status(201).json(account);
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/erp/financial/journal-entries', authenticateToken, authorize(['finance.view']), async (req, res) => {
  try {
    const { limit = 50, offset = 0, status, startDate, endDate } = req.query;
    const entries = await dbService.getJournalEntries({
      limit: parseInt(limit),
      offset: parseInt(offset),
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });
    res.json(entries);
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/erp/financial/journal-entries', authenticateToken, authorize(['finance.create']), auditLog('CREATE', 'journal_entries'), async (req, res) => {
  try {
    const entry = await dbService.createJournalEntry(req.body);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/erp/financial/cost-centers', authenticateToken, authorize(['finance.view']), async (req, res) => {
  try {
    const costCenters = await dbService.getCostCenters();
    res.json(costCenters);
  } catch (error) {
    console.error('Get cost centers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/erp/financial/budgets', authenticateToken, authorize(['finance.view']), async (req, res) => {
  try {
    const { period, status } = req.query;
    const budgets = await dbService.getBudgets({ period, status });
    res.json(budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// IT Asset Management Routes
app.get('/api/it-assets/assets', authenticateToken, authorize(['assets.view']), async (req, res) => {
  try {
    const { limit = 50, offset = 0, category, status, assignedTo } = req.query;
    const assets = await dbService.getAssets({
      limit: parseInt(limit),
      offset: parseInt(offset),
      category,
      status,
      assignedTo
    });
    res.json(assets);
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/it-assets/assets/:id', authenticateToken, authorize(['assets.view']), async (req, res) => {
  try {
    const asset = await dbService.getAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    console.error('Get asset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/it-assets/assets', authenticateToken, authorize(['assets.create']), auditLog('CREATE', 'assets'), async (req, res) => {
  try {
    const asset = await dbService.createAsset(req.body);
    res.status(201).json(asset);
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/it-assets/assets/:id', authenticateToken, authorize(['assets.update']), auditLog('UPDATE', 'assets'), async (req, res) => {
  try {
    const asset = await dbService.updateAsset(req.params.id, req.body);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/it-assets/support-tickets', authenticateToken, authorize(['support.view']), async (req, res) => {
  try {
    const { limit = 50, offset = 0, status, priority, assignedTo } = req.query;
    const tickets = await dbService.getSupportTickets({
      limit: parseInt(limit),
      offset: parseInt(offset),
      status,
      priority,
      assignedTo
    });
    res.json(tickets);
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/it-assets/support-tickets', authenticateToken, authorize(['support.create']), auditLog('CREATE', 'support_tickets'), async (req, res) => {
  try {
    const ticket = await dbService.createSupportTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Create support ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/it-assets/support-tickets/:id', authenticateToken, authorize(['support.update']), auditLog('UPDATE', 'support_tickets'), async (req, res) => {
  try {
    const ticket = await dbService.updateSupportTicket(req.params.id, req.body);
    if (!ticket) {
      return res.status(404).json({ error: 'Support ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    console.error('Update support ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GST Routes
app.get('/api/gst/returns', authenticateToken, authorize(['gst.view']), async (req, res) => {
  try {
    const { limit = 50, offset = 0, returnType, status, period } = req.query;
    const returns = await dbService.getGSTReturns({
      limit: parseInt(limit),
      offset: parseInt(offset),
      returnType,
      status,
      period
    });
    res.json(returns);
  } catch (error) {
    console.error('Get GST returns error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/gst/returns/:id', authenticateToken, authorize(['gst.view']), async (req, res) => {
  try {
    const gstReturn = await dbService.getGSTReturnById(req.params.id);
    if (!gstReturn) {
      return res.status(404).json({ error: 'GST Return not found' });
    }
    res.json(gstReturn);
  } catch (error) {
    console.error('Get GST return error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/gst/returns', authenticateToken, authorize(['gst.create']), auditLog('CREATE', 'gst_returns'), async (req, res) => {
  try {
    const gstReturn = await dbService.createGSTReturn(req.body);
    res.status(201).json(gstReturn);
  } catch (error) {
    console.error('Create GST return error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/gst/returns/:id', authenticateToken, authorize(['gst.update']), auditLog('UPDATE', 'gst_returns'), async (req, res) => {
  try {
    const gstReturn = await dbService.updateGSTReturn(req.params.id, req.body);
    if (!gstReturn) {
      return res.status(404).json({ error: 'GST Return not found' });
    }
    res.json(gstReturn);
  } catch (error) {
    console.error('Update GST return error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/gst/invoices', authenticateToken, authorize(['gst.view']), async (req, res) => {
  try {
    const { limit = 50, offset = 0, returnType, status, startDate, endDate } = req.query;
    const invoices = await dbService.getGSTInvoices({
      limit: parseInt(limit),
      offset: parseInt(offset),
      returnType,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });
    res.json(invoices);
  } catch (error) {
    console.error('Get GST invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/gst/invoices', authenticateToken, authorize(['gst.create']), auditLog('CREATE', 'gst_invoices'), async (req, res) => {
  try {
    const invoice = await dbService.createGSTInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create GST invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Business Intelligence Routes
app.get('/api/analytics/dashboard', authenticateToken, authorize(['analytics.view']), async (req, res) => {
  try {
    const analytics = await dbService.getDashboardAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/analytics/crm', authenticateToken, authorize(['analytics.view']), async (req, res) => {
  try {
    const { period, segment } = req.query;
    const analytics = await dbService.getCRMAnalytics({ period, segment });
    res.json(analytics);
  } catch (error) {
    console.error('Get CRM analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/analytics/financial', authenticateToken, authorize(['analytics.view']), async (req, res) => {
  try {
    const { period, accountType } = req.query;
    const analytics = await dbService.getFinancialAnalytics({ period, accountType });
    res.json(analytics);
  } catch (error) {
    console.error('Get financial analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/analytics/hr', authenticateToken, authorize(['analytics.view']), async (req, res) => {
  try {
    const { period, department } = req.query;
    const analytics = await dbService.getHRAnalytics({ period, department });
    res.json(analytics);
  } catch (error) {
    console.error('Get HR analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search functionality
app.get('/api/search', authenticateToken, async (req, res) => {
  try {
    const { q, type, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const results = await dbService.search({
      query: q,
      type,
      limit: parseInt(limit)
    });
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export functionality
app.get('/api/export/:type', authenticateToken, authorize(['export']), async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'csv', filters } = req.query;
    
    const data = await dbService.exportData({
      type,
      format,
      filters: filters ? JSON.parse(filters) : {}
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(data);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HR Portal Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await dbService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await dbService.close();
  process.exit(0);
}); 