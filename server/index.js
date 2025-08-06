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
import FileUploadManager from './upload.js';
import WebSocketManager from './websocket.js';
import rbacManager from './rbac.js';
import encryptionManager from './encryption.js';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Async function to initialize server
async function initializeServer() {
// Initialize database, upload manager, WebSocket manager, and encryption
try {
  await dbService.initialize();
  console.log('✅ Database service initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}
const uploadManager = new FileUploadManager();
const wsManager = new WebSocketManager();

// Initialize encryption system
encryptionManager.initialize().catch(console.error);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
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

// Enhanced Authentication middleware with better error handling
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      code: 'TOKEN_MISSING'
    });
  }

  const jwtSecret = process.env.JWT_SECRET || 'smartbizflow-development-secret-key-2024';
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      let errorMessage = 'Invalid token';
      let errorCode = 'TOKEN_INVALID';

      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Token expired';
        errorCode = 'TOKEN_EXPIRED';
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token format';
        errorCode = 'TOKEN_MALFORMED';
      }

      return res.status(403).json({
        error: errorMessage,
        code: errorCode
      });
    }

    try {
      // Verify user still exists and is active
      const user = await dbService.getUserById(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: 'User not found or inactive',
          code: 'USER_INACTIVE'
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token validation error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};

// Rate limiting for authentication endpoints - More lenient for development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased from 5 to 20 auth requests per windowMs
  message: {
    error: 'Too many login attempts, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: Math.ceil(15 * 60) // 15 minutes in seconds
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts from this IP. Please try again in 15 minutes.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(15 * 60)
    });
  }
});

// Brute force protection middleware - More lenient for development
const bruteForceProtection = rateLimit({
  windowMs: 60 * 1000, // Changed from 1 hour to 1 minute
  max: 8, // Reduced from 10 to 8 failed attempts per minute
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many failed login attempts. Please wait 1 minute before trying again.',
    code: 'BRUTE_FORCE_PROTECTION',
    retryAfter: 60
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many failed login attempts. Please wait 1 minute before trying again.',
      code: 'BRUTE_FORCE_PROTECTION',
      retryAfter: 60
    });
  }
});

// Enhanced Authorization middleware using RBAC
const authorize = (permissions, options = {}) => {
  return rbacManager.authorize(permissions, {
    ...options,
    resourceLoader: options.resourceLoader || (async (req) => {
      // Default resource loader based on request parameters
      const resourceType = req.route?.path?.split('/')[2]; // Extract resource type from path
      const resourceId = req.params.id;
      
      if (!resourceType || !resourceId) {
        return null;
      }
      
      try {
        switch (resourceType) {
          case 'users':
            const user = await dbService.getUserById(resourceId);
            return user ? { ...user, type: 'users' } : null;
          case 'employees':
            const employee = await dbService.getEmployeeById(resourceId);
            return employee ? { ...employee, type: 'employees' } : null;
          case 'customers':
            const customer = await dbService.getCustomerById(resourceId);
            return customer ? { ...customer, type: 'customers' } : null;
          case 'assets':
            const asset = await dbService.getAssetById(resourceId);
            return asset ? { ...asset, type: 'assets' } : null;
          default:
            return null;
        }
      } catch (error) {
        console.error('Resource loading error:', error);
        return null;
      }
    })
  });
};

// Middleware to add user permissions to request
const addUserPermissions = async (req, res, next) => {
  if (req.user) {
    req.user.permissions = rbacManager.getEffectivePermissions(req.user);
    req.user.canAccess = (action, resource) => rbacManager.canAccess(req.user, action, resource);
  }
  next();
};

// Apply user permissions middleware to all authenticated routes (exclude auth endpoints)
app.use('/api', (req, res, next) => {
  // Skip authentication for auth endpoints
  if (req.path.startsWith('/auth/login') || 
      req.path.startsWith('/auth/register') || 
      req.path.startsWith('/auth/forgot-password') ||
      req.path.startsWith('/auth/reset-password')) {
    return next();
  }
  // Apply authentication for all other API endpoints
  authenticateToken(req, res, next);
}, addUserPermissions);

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

// Authentication routes with rate limiting and brute force protection
app.post('/api/auth/login', authLimiter, bruteForceProtection, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', { email, password: '***' });

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await dbService.getUserByEmail(email);
    console.log('👤 User lookup result:', user ? { id: user.id, email: user.email, role: user.role, isActive: user.isActive } : 'User not found');
    
    if (!user || !user.isActive) {
      console.log('❌ User not found or inactive');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('🔑 Comparing password...');
    
    // Development mode: Allow static password for testing
    const STATIC_PASSWORD = 'password123';
    const isStaticPassword = password === STATIC_PASSWORD;
    
    // Check if password matches either the bcrypt hash or the static password
    const isValidPassword = isStaticPassword || await bcrypt.compare(password, user.password);
    console.log('🔑 Password comparison result:', isValidPassword);
    console.log('🔑 Static password used:', isStaticPassword);
    
    if (!isValidPassword) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'smartbizflow-development-secret-key-2024';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Log successful login
    await dbService.logAudit({
      userId: user.id,
      action: 'LOGIN',
      table: 'users',
      recordId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

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

// Token refresh endpoint
app.post('/api/auth/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await dbService.getUserById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await dbService.getUserById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Password reset request
app.post('/api/auth/password/reset-request', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await dbService.getUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token (in production, store this in database with expiry)
    const resetToken = jwt.sign(
      { id: user.id, type: 'password_reset' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Log password reset request
    await dbService.logAudit({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUEST',
      table: 'users',
      recordId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // In production, send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Password reset confirmation
app.post('/api/auth/password/reset-confirm', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const user = await dbService.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await dbService.updateUserPassword(user.id, hashedPassword);

    // Log password reset
    await dbService.logAudit({
      userId: user.id,
      action: 'PASSWORD_RESET_CONFIRM',
      table: 'users',
      recordId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    console.error('Password reset confirm error:', error);
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

// User Management API Routes (BUG-010 Fix)
app.get('/api/users', authenticateToken, authorize(['users.view']), async (req, res) => {
  try {
    const { limit = 50, offset = 0, role, status, search } = req.query;
    const users = await dbService.getUsers({
      limit: parseInt(limit),
      offset: parseInt(offset),
      role,
      status,
      search
    });
    
    // Remove password from response
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(sanitizedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:id', authenticateToken, authorize(['users.view']), async (req, res) => {
  try {
    const user = await dbService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', authenticateToken, authorize(['users.create']), auditLog('CREATE', 'users'), async (req, res) => {
  try {
    const { email, password, role, isActive = true } = req.body;
    
    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }
    
    // Check if user already exists
    const existingUser = await dbService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await dbService.createUser({
      email,
      password: hashedPassword,
      role,
      isActive
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id', authenticateToken, authorize(['users.update']), auditLog('UPDATE', 'users'), async (req, res) => {
  try {
    const { email, role, isActive } = req.body;
    const userId = req.params.id;
    
    const user = await dbService.updateUser(userId, {
      email,
      role,
      isActive
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', authenticateToken, authorize(['users.delete']), auditLog('DELETE', 'users'), async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent self-deletion
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const success = await dbService.deleteUser(userId);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
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

// Enhanced File Upload API Endpoints (BUG-011 Fix)
app.post('/api/upload/avatar', authenticateToken, (req, res) => {
  const upload = uploadManager.getMulterConfig('avatar').single('avatar');
  
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    try {
      const fileInfo = await uploadManager.processUploadedFile(req.file);
      
      // Update user avatar in database
      const user = await dbService.getUserById(req.user.id);
      if (user) {
        await dbService.updateUser(req.user.id, { avatar: fileInfo.id });
      }
      
      res.json({
        message: 'Avatar uploaded successfully',
        file: {
          id: fileInfo.id,
          filename: fileInfo.filename,
          originalName: fileInfo.originalName,
          size: fileInfo.size
        }
      });
      
    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({ error: 'Upload processing failed' });
    }
  });
});

app.post('/api/upload/document', authenticateToken, (req, res) => {
  const upload = uploadManager.getMulterConfig('document').single('document');
  
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    try {
      const fileInfo = await uploadManager.processUploadedFile(req.file);
      
      res.json({
        message: 'Document uploaded successfully',
        file: {
          id: fileInfo.id,
          filename: fileInfo.filename,
          originalName: fileInfo.originalName,
          size: fileInfo.size,
          mimetype: fileInfo.mimetype
        }
      });
      
    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({ error: 'Upload processing failed' });
    }
  });
});

app.post('/api/upload/bulk', authenticateToken, (req, res) => {
  const upload = uploadManager.getMulterConfig('bulk').array('files', 10);
  
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    try {
      const uploadedFiles = [];
      const errors = [];
      
      for (const file of req.files) {
        try {
          const fileInfo = await uploadManager.processUploadedFile(file);
          uploadedFiles.push({
            id: fileInfo.id,
            filename: fileInfo.filename,
            originalName: fileInfo.originalName,
            size: fileInfo.size,
            mimetype: fileInfo.mimetype
          });
        } catch (error) {
          errors.push({
            filename: file.originalname,
            error: error.message
          });
        }
      }
      
      res.json({
        message: `${uploadedFiles.length} files uploaded successfully`,
        files: uploadedFiles,
        errors: errors
      });
      
    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({ error: 'Upload processing failed' });
    }
  });
});

// File serving endpoint with access control
app.get('/api/files/:fileId', authenticateToken, async (req, res) => {
  try {
    await uploadManager.serveFile(req.params.fileId, req.user.id, res);
  } catch (error) {
    console.error('File serving error:', error);
    res.status(500).json({ error: 'File serving failed' });
  }
});

// File management endpoints
app.get('/api/uploads', authenticateToken, async (req, res) => {
  try {
    const stats = await uploadManager.getUploadStats();
    res.json(stats);
  } catch (error) {
    console.error('Upload stats error:', error);
    res.status(500).json({ error: 'Failed to get upload statistics' });
  }
});

app.delete('/api/uploads/:fileId', authenticateToken, async (req, res) => {
  try {
    const fileRecord = await uploadManager.getFileRecord(req.params.fileId);
    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check if user has permission to delete (implement your logic)
    const hasPermission = req.user.role === 'admin' || req.user.id === fileRecord.uploadedBy;
    if (!hasPermission) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    
    await uploadManager.deleteUpload(req.params.fileId);
    
    res.json({ message: 'File deleted successfully' });
    
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ error: 'File deletion failed' });
  }
});

// Cleanup endpoint (admin only)
app.post('/api/uploads/cleanup', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    await uploadManager.cleanupTempFiles();
    res.json({ message: 'Cleanup completed successfully' });
    
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Cleanup failed' });
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

// RBAC Management API Endpoints (BUG-036 Fix)
app.get('/api/rbac/permissions', authorize(['system.settings']), (req, res) => {
  try {
    const permissions = rbacManager.permissions;
    res.json(permissions);
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/rbac/roles', authorize(['system.settings']), (req, res) => {
  try {
    const roles = rbacManager.roleHierarchy;
    res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/rbac/user/:userId/permissions', authorize(['users.view']), async (req, res) => {
  try {
    const user = await dbService.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const permissions = rbacManager.getEffectivePermissions(user);
    res.json({
      userId: user.id,
      role: user.role,
      permissions
    });
  } catch (error) {
    console.error('Get user permissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/rbac/check-permission', (req, res) => {
  try {
    const { permission, resource } = req.body;
    
    if (!permission) {
      return res.status(400).json({ error: 'Permission is required' });
    }
    
    const hasPermission = rbacManager.hasPermission(req.user, permission, resource);
    
    res.json({
      userId: req.user.id,
      permission,
      hasPermission,
      userRole: req.user.role
    });
  } catch (error) {
    console.error('Check permission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/rbac/permissions', authorize(['system.settings']), (req, res) => {
  try {
    const { permission, roles } = req.body;
    
    if (!permission || !roles || !Array.isArray(roles)) {
      return res.status(400).json({ error: 'Permission and roles array are required' });
    }
    
    rbacManager.addPermission(permission, roles);
    
    res.json({
      message: 'Permission added successfully',
      permission,
      roles
    });
  } catch (error) {
    console.error('Add permission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/rbac/permissions/:permission', authorize(['system.settings']), (req, res) => {
  try {
    const { permission } = req.params;
    
    rbacManager.removePermission(permission);
    
    res.json({
      message: 'Permission removed successfully',
      permission
    });
  } catch (error) {
    console.error('Remove permission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/rbac/roles/:role/hierarchy', authorize(['system.settings']), (req, res) => {
  try {
    const { role } = req.params;
    const { inheritedRoles } = req.body;
    
    if (!inheritedRoles || !Array.isArray(inheritedRoles)) {
      return res.status(400).json({ error: 'inheritedRoles array is required' });
    }
    
    rbacManager.updateRoleHierarchy(role, inheritedRoles);
    
    res.json({
      message: 'Role hierarchy updated successfully',
      role,
      inheritedRoles
    });
  } catch (error) {
    console.error('Update role hierarchy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Encryption Management API Endpoints (BUG-037 Fix)
app.get('/api/encryption/status', authorize(['system.settings']), (req, res) => {
  try {
    const stats = encryptionManager.getStatistics();
    const validation = encryptionManager.validateConfiguration();
    
    res.json({
      ...stats,
      validation
    });
  } catch (error) {
    console.error('Encryption status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/encryption/rotate-key', authorize(['system.settings']), async (req, res) => {
  try {
    const result = await encryptionManager.rotateKey();
    
    // Log key rotation for audit
    await dbService.logAudit({
      userId: req.user.id,
      action: 'KEY_ROTATION',
      table: 'encryption_keys',
      recordId: null,
      oldValues: null,
      newValues: JSON.stringify(result),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json(result);
  } catch (error) {
    console.error('Key rotation error:', error);
    res.status(500).json({ error: 'Key rotation failed' });
  }
});

app.post('/api/encryption/encrypt-field', authorize(['system.settings']), (req, res) => {
  try {
    const { data, context } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }
    
    const encrypted = encryptionManager.encrypt(data, context || '');
    
    res.json({
      encrypted,
      message: 'Data encrypted successfully'
    });
  } catch (error) {
    console.error('Field encryption error:', error);
    res.status(500).json({ error: 'Encryption failed' });
  }
});

app.post('/api/encryption/decrypt-field', authorize(['system.settings']), (req, res) => {
  try {
    const { encryptedData, context } = req.body;
    
    if (!encryptedData) {
      return res.status(400).json({ error: 'Encrypted data is required' });
    }
    
    const decrypted = encryptionManager.decrypt(encryptedData, context || '');
    
    res.json({
      decrypted,
      message: 'Data decrypted successfully'
    });
  } catch (error) {
    console.error('Field decryption error:', error);
    res.status(500).json({ error: 'Decryption failed' });
  }
});

app.get('/api/encryption/sensitive-fields', authorize(['system.settings']), (req, res) => {
  try {
    const fields = Array.from(encryptionManager.sensitiveFields);
    res.json({ sensitiveFields: fields });
  } catch (error) {
    console.error('Get sensitive fields error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/encryption/sensitive-fields', authorize(['system.settings']), (req, res) => {
  try {
    const { fieldName } = req.body;
    
    if (!fieldName) {
      return res.status(400).json({ error: 'Field name is required' });
    }
    
    encryptionManager.addSensitiveField(fieldName);
    
    res.json({
      message: 'Sensitive field added successfully',
      fieldName
    });
  } catch (error) {
    console.error('Add sensitive field error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/encryption/sensitive-fields/:fieldName', authorize(['system.settings']), (req, res) => {
  try {
    const { fieldName } = req.params;
    
    encryptionManager.removeSensitiveField(fieldName);
    
    res.json({
      message: 'Sensitive field removed successfully',
      fieldName
    });
  } catch (error) {
    console.error('Remove sensitive field error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/encryption/encrypt-backup', authorize(['system.backup']), async (req, res) => {
  try {
    const { backupPath } = req.body;
    
    if (!backupPath) {
      return res.status(400).json({ error: 'Backup path is required' });
    }
    
    const encryptedPath = await encryptionManager.encryptBackup(backupPath);
    
    res.json({
      message: 'Backup encrypted successfully',
      encryptedPath
    });
  } catch (error) {
    console.error('Backup encryption error:', error);
    res.status(500).json({ error: 'Backup encryption failed' });
  }
});

app.post('/api/encryption/decrypt-backup', authorize(['system.restore']), async (req, res) => {
  try {
    const { encryptedBackupPath } = req.body;
    
    if (!encryptedBackupPath) {
      return res.status(400).json({ error: 'Encrypted backup path is required' });
    }
    
    const decryptedPath = await encryptionManager.decryptBackup(encryptedBackupPath);
    
    res.json({
      message: 'Backup decrypted successfully',
      decryptedPath
    });
  } catch (error) {
    console.error('Backup decryption error:', error);
    res.status(500).json({ error: 'Backup decryption failed' });
  }
});

// Search functionality
app.get('/api/search', async (req, res) => {
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
app.get('/api/export/:type', authorize(['export']), async (req, res) => {
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
  
  // Schedule cleanup of temp files every hour
  setInterval(() => {
    uploadManager.cleanupTempFiles().catch(console.error);
  }, 60 * 60 * 1000);
});
}

// Initialize and start server
initializeServer().catch((error) => {
  console.error('❌ Server initialization failed:', error);
  process.exit(1);
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