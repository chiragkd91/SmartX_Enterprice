# SQLite Database Guide for SmartBizFlow HR Portal

## 📋 **Overview**

This guide covers the complete SQLite database implementation for the SmartBizFlow HR Portal System. The database provides comprehensive CRUD operations for all HR modules including employees, training, leave management, payroll, and security features.

---

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
npm install sqlite3 bcryptjs
```

### **2. Initialize Database**
```bash
node scripts/seedDatabase.js
```

### **3. Start Application**
```bash
npm run dev
```

---

## 🗄️ **Database Schema**

### **Core Tables**

#### **1. Users Table**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee',
    is_active BOOLEAN NOT NULL DEFAULT 1,
    last_login TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### **2. Employees Table**
```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    date_of_birth TEXT,
    hire_date TEXT NOT NULL,
    department TEXT NOT NULL,
    position TEXT NOT NULL,
    salary REAL NOT NULL,
    manager_id INTEGER,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES employees (id)
);
```

#### **3. Training Courses Table**
```sql
CREATE TABLE training_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    duration INTEGER NOT NULL,
    instructor TEXT NOT NULL,
    format TEXT NOT NULL,
    max_enrollment INTEGER NOT NULL,
    current_enrollment INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Draft',
    rating REAL DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### **4. Employee Training Enrollments Table**
```sql
CREATE TABLE employee_trainings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'enrolled',
    progress INTEGER DEFAULT 0,
    start_date TEXT NOT NULL,
    completion_date TEXT,
    certificate TEXT,
    score INTEGER,
    attempts INTEGER DEFAULT 0,
    last_accessed TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees (id),
    FOREIGN KEY (course_id) REFERENCES training_courses (id)
);
```

#### **5. Leave Requests Table**
```sql
CREATE TABLE leave_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    submitted_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by INTEGER,
    approved_date TEXT,
    comments TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees (id),
    FOREIGN KEY (approved_by) REFERENCES employees (id)
);
```

#### **6. Payslips Table**
```sql
CREATE TABLE payslips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    gross_pay REAL NOT NULL,
    net_pay REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Generated',
    payment_date TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
);
```

#### **7. Two-Factor Authentication Tables**
```sql
CREATE TABLE two_factor_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT 0,
    device_info TEXT,
    last_used TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE backup_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT 0,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE trusted_devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    browser TEXT,
    os TEXT,
    ip_address TEXT NOT NULL,
    location TEXT,
    is_trusted BOOLEAN NOT NULL DEFAULT 0,
    last_active TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

---

## 🔧 **Database Service Usage**

### **1. Initialize Database Service**
```typescript
import { dbService } from '../services/databaseService';

// Initialize database
await dbService.initialize();
```

### **2. User Operations**
```typescript
// Create user
const user = await dbService.createUser({
  username: 'john.doe',
  email: 'john.doe@company.com',
  password_hash: 'hashed_password',
  role: 'employee'
});

// Get user by email
const user = await dbService.getUserByEmail('john.doe@company.com');

// Update user
await dbService.updateUser(userId, { role: 'manager' });

// Delete user
await dbService.deleteUser(userId);
```

### **3. Employee Operations**
```typescript
// Create employee
const employee = await dbService.createEmployee({
  employee_id: 'EMP001',
  first_name: 'John',
  last_name: 'Smith',
  email: 'john.smith@company.com',
  phone: '+1 (555) 123-4567',
  hire_date: '2022-03-01',
  department: 'Engineering',
  position: 'Software Engineer',
  salary: 75000
});

// Get all employees with filtering
const employees = await dbService.getAllEmployees({
  department: 'Engineering',
  status: 'active',
  search: 'John'
});

// Update employee
await dbService.updateEmployee(employeeId, { salary: 80000 });

// Delete employee
await dbService.deleteEmployee(employeeId);
```

### **4. Training Operations**
```typescript
// Create training course
const course = await dbService.createTrainingCourse({
  title: 'React Development',
  description: 'Learn React fundamentals',
  category: 'Technical',
  level: 'Beginner',
  duration: 16,
  instructor: 'Dr. Sarah Johnson',
  format: 'Online',
  max_enrollment: 50
});

// Enroll employee in training
const enrollment = await dbService.enrollEmployeeInTraining({
  employee_id: 1,
  course_id: 1,
  status: 'enrolled',
  start_date: '2024-01-15'
});

// Update training progress
await dbService.updateEmployeeTraining(enrollmentId, {
  progress: 75,
  status: 'in_progress'
});

// Complete training
await dbService.completeTraining(enrollmentId, 92, 'CERT-2024-001');
```

### **5. Leave Management Operations**
```typescript
// Create leave request
const leaveRequest = await dbService.createLeaveRequest({
  employee_id: 1,
  type: 'Annual',
  start_date: '2024-02-15',
  end_date: '2024-02-20',
  days: 5,
  reason: 'Family vacation'
});

// Get leave requests
const requests = await dbService.getLeaveRequests({
  employee_id: 1,
  status: 'Pending'
});

// Approve leave request
await dbService.approveLeaveRequest(requestId, approverId, 'Approved');

// Reject leave request
await dbService.rejectLeaveRequest(requestId, approverId, 'Insufficient notice');
```

### **6. Payroll Operations**
```typescript
// Generate payslip
const payslip = await dbService.generatePayslip(
  employeeId,
  'January',
  2024,
  7500,
  5625
);

// Get payslips
const payslips = await dbService.getPayslips({
  employee_id: 1,
  month: 'January',
  year: 2024
});

// Update payslip status
await dbService.updatePayslip(payslipId, { status: 'Paid' });
```

### **7. Security Operations**
```typescript
// Create two-factor authentication method
const twoFactorMethod = await dbService.createTwoFactorMethod({
  user_id: 1,
  type: 'authenticator',
  name: 'Google Authenticator',
  is_enabled: true,
  is_primary: true
});

// Generate backup codes
const backupCodes = await dbService.createBackupCodes(userId, [
  '12345678', '87654321', '11223344'
]);

// Create trusted device
const trustedDevice = await dbService.createTrustedDevice({
  user_id: 1,
  name: 'MacBook Pro',
  type: 'desktop',
  browser: 'Chrome',
  os: 'macOS',
  ip_address: '192.168.1.100',
  location: 'San Francisco, CA',
  is_trusted: true
});
```

---

## 📊 **Business Logic Operations**

### **1. Employee Dashboard Data**
```typescript
const dashboardData = await dbService.getEmployeeDashboardData(employeeId);

// Returns:
{
  employee: Employee,
  leaveBalance: [
    { type: 'Annual', total: 25, used: 8, remaining: 17 },
    { type: 'Sick', total: 15, used: 3, remaining: 12 }
  ],
  recentLeaveRequests: LeaveRequest[],
  recentPayslips: Payslip[],
  trainingProgress: EmployeeTraining[]
}
```

### **2. HR Dashboard Data**
```typescript
const hrDashboardData = await dbService.getHRDashboardData();

// Returns:
{
  totalEmployees: 50,
  activeEmployees: 48,
  pendingLeaveRequests: 5,
  upcomingTrainings: 3,
  recentHires: Employee[],
  leaveRequestsByStatus: [
    { status: 'Pending', count: 5 },
    { status: 'Approved', count: 12 },
    { status: 'Rejected', count: 2 }
  ]
}
```

---

## 🌱 **Database Seeding**

### **1. Seed All Data**
```bash
node scripts/seedDatabase.js
```

### **2. Clear and Reseed**
```bash
node scripts/seedDatabase.js --clear
```

### **3. Show Statistics**
```bash
node scripts/seedDatabase.js --stats
```

### **4. Sample Data Included**
- **5 Users**: Admin, HR Manager, and 3 employees
- **8 Employees**: Various departments and positions
- **6 Training Courses**: Technical, Leadership, and Soft Skills
- **5 Leave Requests**: Different types and statuses
- **8 Payslips**: Multiple months and employees
- **2FA Setup**: Authenticator app and backup codes

---

## 🔍 **Query Examples**

### **1. Complex Queries**
```typescript
// Get employees with their managers
const employeesWithManagers = await dbService.executeQuery(`
  SELECT 
    e.*,
    m.first_name as manager_first_name,
    m.last_name as manager_last_name
  FROM employees e
  LEFT JOIN employees m ON e.manager_id = m.id
  WHERE e.status = 'active'
  ORDER BY e.department, e.last_name
`);

// Get training statistics by department
const trainingStats = await dbService.executeQuery(`
  SELECT 
    e.department,
    COUNT(et.id) as total_enrollments,
    AVG(et.progress) as avg_progress,
    COUNT(CASE WHEN et.status = 'completed' THEN 1 END) as completed_courses
  FROM employees e
  LEFT JOIN employee_trainings et ON e.id = et.employee_id
  GROUP BY e.department
  ORDER BY total_enrollments DESC
`);

// Get leave balance summary
const leaveBalance = await dbService.executeQuery(`
  SELECT 
    e.first_name,
    e.last_name,
    e.department,
    lr.type,
    SUM(lr.days) as total_days,
    COUNT(CASE WHEN lr.status = 'Approved' THEN 1 END) as approved_requests
  FROM employees e
  LEFT JOIN leave_requests lr ON e.id = lr.employee_id
  WHERE lr.status = 'Approved'
  GROUP BY e.id, lr.type
  ORDER BY e.department, e.last_name
`);
```

### **2. Search and Filter**
```typescript
// Search employees by name or email
const searchResults = await dbService.getAllEmployees({
  search: 'john'
});

// Filter training courses
const technicalCourses = await dbService.getAllTrainingCourses({
  category: 'Technical',
  level: 'Beginner'
});

// Get pending leave requests
const pendingRequests = await dbService.getLeaveRequests({
  status: 'Pending'
});
```

---

## 🛠️ **Database Maintenance**

### **1. Backup Database**
```typescript
await dbService.backupDatabase('./backups/smartbizflow_backup.db');
```

### **2. Get Statistics**
```typescript
const stats = await dbService.getDatabaseStats();
console.log('Database Statistics:', stats);
```

### **3. Clear All Data**
```typescript
await DatabaseSeeder.clearAll();
```

---

## 🔒 **Security Features**

### **1. Password Hashing**
```typescript
import bcrypt from 'bcryptjs';

// Hash password
const passwordHash = await bcrypt.hash('password123', 10);

// Verify password
const isValid = await bcrypt.compare('password123', passwordHash);
```

### **2. Two-Factor Authentication**
- **Authenticator Apps**: Google Authenticator, Microsoft Authenticator
- **SMS/Email Verification**: Backup verification methods
- **Backup Codes**: Emergency access codes
- **Device Management**: Trust and revoke device access

### **3. Role-Based Access Control**
- **Admin**: Full system access
- **HR Manager**: HR module access
- **Employee**: Self-service access
- **Manager**: Team management access

---

## 📈 **Performance Optimization**

### **1. Indexes**
```sql
-- Add indexes for better performance
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_training_courses_category ON training_courses(category);
CREATE INDEX idx_employee_trainings_employee ON employee_trainings(employee_id);
```

### **2. Query Optimization**
- Use specific column selection instead of `SELECT *`
- Implement pagination for large datasets
- Use appropriate WHERE clauses for filtering
- Leverage foreign key relationships

### **3. Connection Management**
- Use connection pooling for production
- Implement proper error handling
- Close connections after use
- Use transactions for complex operations

---

## 🚨 **Error Handling**

### **1. Database Errors**
```typescript
try {
  const employee = await dbService.createEmployee(employeeData);
} catch (error) {
  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    console.error('Employee with this email already exists');
  } else {
    console.error('Database error:', error);
  }
}
```

### **2. Validation**
```typescript
// Validate employee data before insertion
function validateEmployee(data) {
  if (!data.email || !data.first_name || !data.last_name) {
    throw new Error('Required fields missing');
  }
  
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  if (data.salary < 0) {
    throw new Error('Salary cannot be negative');
  }
}
```

---

## 📝 **Best Practices**

### **1. Data Integrity**
- Always use transactions for related operations
- Implement proper foreign key constraints
- Validate data before insertion
- Use appropriate data types

### **2. Security**
- Hash passwords using bcrypt
- Implement input sanitization
- Use parameterized queries
- Implement proper access controls

### **3. Performance**
- Use indexes for frequently queried columns
- Implement pagination for large datasets
- Optimize queries for specific use cases
- Monitor query performance

### **4. Maintenance**
- Regular database backups
- Monitor database size and growth
- Implement data archival strategies
- Regular performance optimization

---

## 🔧 **Troubleshooting**

### **1. Common Issues**

#### **Database Locked**
```bash
# Check if database is in use
lsof smartbizflow.db

# Kill processes using the database
kill -9 <process_id>
```

#### **Permission Denied**
```bash
# Check file permissions
ls -la smartbizflow.db

# Fix permissions
chmod 644 smartbizflow.db
```

#### **Memory Issues**
```bash
# Check database size
ls -lh smartbizflow.db

# Optimize database
VACUUM;
```

### **2. Debug Queries**
```typescript
// Enable query logging
const debugQuery = async (sql: string, params: any[]) => {
  console.log('SQL:', sql);
  console.log('Params:', params);
  const result = await dbService.executeQuery(sql, params);
  console.log('Result:', result);
  return result;
};
```

---

## 📚 **Additional Resources**

### **1. SQLite Documentation**
- [SQLite Official Documentation](https://www.sqlite.org/docs.html)
- [SQLite Data Types](https://www.sqlite.org/datatype3.html)
- [SQLite SQL Syntax](https://www.sqlite.org/lang.html)

### **2. Node.js SQLite**
- [sqlite3 Package](https://www.npmjs.com/package/sqlite3)
- [better-sqlite3 Package](https://www.npmjs.com/package/better-sqlite3)

### **3. Security**
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

---

## 🎯 **Next Steps**

1. **Test CRUD Operations**: Use the provided examples to test all operations
2. **Customize Schema**: Modify tables based on your specific requirements
3. **Add Indexes**: Implement performance optimizations
4. **Security Review**: Audit security implementations
5. **Backup Strategy**: Implement automated backup solutions
6. **Monitoring**: Add database monitoring and alerting

---

**Database Implementation Status**: ✅ **COMPLETE**  
**Last Updated**: December 2024  
**Version**: 1.0.0 