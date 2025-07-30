-- Microsoft SQL Server Migration Script
-- SmartX Solution Database Migration
-- Target: 103.206.57.30:1201
-- User: sa
-- Password: Password@123

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SmartXSolution')
BEGIN
    CREATE DATABASE SmartXSolution;
END
GO

USE SmartXSolution;
GO

-- Create tables
-- Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
CREATE TABLE users (
    id NVARCHAR(50) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
    isActive BIT DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- Sessions Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'sessions')
CREATE TABLE sessions (
    id NVARCHAR(50) PRIMARY KEY,
    userId NVARCHAR(50) NOT NULL,
    token NVARCHAR(255) UNIQUE NOT NULL,
    expiresAt DATETIME2 NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
GO

-- Permissions Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'permissions')
CREATE TABLE permissions (
    id NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(255) UNIQUE NOT NULL,
    description NVARCHAR(MAX),
    module NVARCHAR(100) NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE()
);
GO

-- User Permissions Junction Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_permissions')
CREATE TABLE user_permissions (
    userId NVARCHAR(50) NOT NULL,
    permissionId NVARCHAR(50) NOT NULL,
    PRIMARY KEY (userId, permissionId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
);
GO

-- Employees Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'employees')
CREATE TABLE employees (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) UNIQUE NOT NULL,
    firstName NVARCHAR(100) NOT NULL,
    lastName NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    dateOfBirth DATE,
    gender NVARCHAR(10),
    address NVARCHAR(MAX),
    emergencyContacts NVARCHAR(MAX),
    department NVARCHAR(100) NOT NULL,
    position NVARCHAR(100) NOT NULL,
    hireDate DATE NOT NULL,
    managerId NVARCHAR(50),
    salary DECIMAL(10,2) NOT NULL,
    status NVARCHAR(20) DEFAULT 'ACTIVE',
    avatar NVARCHAR(255),
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (managerId) REFERENCES employees(id)
);
GO

-- Attendance Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'attendance')
CREATE TABLE attendance (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    checkIn DATETIME2,
    checkOut DATETIME2,
    totalHours DECIMAL(5,2),
    status NVARCHAR(20) DEFAULT 'PRESENT',
    notes NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE (employeeId, date)
);
GO

-- Leaves Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'leaves')
CREATE TABLE leaves (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) NOT NULL,
    type NVARCHAR(20) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    days INT NOT NULL,
    reason NVARCHAR(MAX),
    status NVARCHAR(20) DEFAULT 'PENDING',
    approvedBy NVARCHAR(50),
    approvedAt DATETIME2,
    notes NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approvedBy) REFERENCES employees(id)
);
GO

-- Payroll Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'payroll')
CREATE TABLE payroll (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    basicSalary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    netSalary DECIMAL(10,2) NOT NULL,
    status NVARCHAR(20) DEFAULT 'PENDING',
    paidAt DATETIME2,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE (employeeId, month, year)
);
GO

-- Performance Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'performance')
CREATE TABLE performance (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) NOT NULL,
    period NVARCHAR(50) NOT NULL,
    rating INT NOT NULL,
    goals NVARCHAR(MAX),
    achievements NVARCHAR(MAX),
    feedback NVARCHAR(MAX),
    reviewedBy NVARCHAR(50),
    reviewedAt DATETIME2,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewedBy) REFERENCES employees(id)
);
GO

-- Training Courses Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'training_courses')
CREATE TABLE training_courses (
    id NVARCHAR(50) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(100) NOT NULL,
    level NVARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    instructor NVARCHAR(255),
    format NVARCHAR(50) NOT NULL,
    maxEnrollment INT,
    currentEnrollment INT DEFAULT 0,
    status NVARCHAR(20) DEFAULT 'ACTIVE',
    materials NVARCHAR(MAX),
    prerequisites NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- Employee Training Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'employee_training')
CREATE TABLE employee_training (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) NOT NULL,
    courseId NVARCHAR(50) NOT NULL,
    status NVARCHAR(20) DEFAULT 'ENROLLED',
    progress INT DEFAULT 0,
    startDate DATETIME2,
    completionDate DATETIME2,
    certificate NVARCHAR(255),
    score INT,
    feedback NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES training_courses(id) ON DELETE CASCADE,
    UNIQUE (employeeId, courseId)
);
GO

-- Employee Documents Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'employee_documents')
CREATE TABLE employee_documents (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) NOT NULL,
    title NVARCHAR(255) NOT NULL,
    type NVARCHAR(50) NOT NULL,
    fileName NVARCHAR(255) NOT NULL,
    filePath NVARCHAR(500) NOT NULL,
    fileSize INT NOT NULL,
    mimeType NVARCHAR(100) NOT NULL,
    uploadedBy NVARCHAR(50) NOT NULL,
    uploadedAt DATETIME2 DEFAULT GETDATE(),
    expiresAt DATETIME2,
    isActive BIT DEFAULT 1,
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);
GO

-- Benefits Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'benefits')
CREATE TABLE benefits (
    id NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    type NVARCHAR(50) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    isActive BIT DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- Employee Benefits Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'employee_benefits')
CREATE TABLE employee_benefits (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) NOT NULL,
    benefitId NVARCHAR(50) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE,
    status NVARCHAR(20) DEFAULT 'ACTIVE',
    cost DECIMAL(10,2) NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (benefitId) REFERENCES benefits(id) ON DELETE CASCADE
);
GO

-- Onboarding Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'onboarding')
CREATE TABLE onboarding (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) UNIQUE NOT NULL,
    status NVARCHAR(20) DEFAULT 'IN_PROGRESS',
    startDate DATE NOT NULL,
    completionDate DATE,
    checklist NVARCHAR(MAX),
    notes NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);
GO

-- Offboarding Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'offboarding')
CREATE TABLE offboarding (
    id NVARCHAR(50) PRIMARY KEY,
    employeeId NVARCHAR(50) UNIQUE NOT NULL,
    status NVARCHAR(20) DEFAULT 'INITIATED',
    startDate DATE NOT NULL,
    completionDate DATE,
    reason NVARCHAR(MAX) NOT NULL,
    checklist NVARCHAR(MAX),
    exitInterview NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);
GO

-- Audit Logs Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'audit_logs')
CREATE TABLE audit_logs (
    id NVARCHAR(50) PRIMARY KEY,
    userId NVARCHAR(50),
    action NVARCHAR(100) NOT NULL,
    table_name NVARCHAR(100) NOT NULL,
    recordId NVARCHAR(50),
    oldValues NVARCHAR(MAX),
    newValues NVARCHAR(MAX),
    ipAddress NVARCHAR(45),
    userAgent NVARCHAR(500),
    createdAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id)
);
GO

-- Create indexes for better performance
-- Users indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_users_email')
CREATE INDEX IX_users_email ON users(email);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_users_role')
CREATE INDEX IX_users_role ON users(role);

-- Employees indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_employees_email')
CREATE INDEX IX_employees_email ON employees(email);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_employees_department')
CREATE INDEX IX_employees_department ON employees(department);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_employees_manager')
CREATE INDEX IX_employees_manager ON employees(managerId);

-- Attendance indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_attendance_employee_date')
CREATE INDEX IX_attendance_employee_date ON attendance(employeeId, date);

-- Leaves indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_leaves_employee')
CREATE INDEX IX_leaves_employee ON leaves(employeeId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_leaves_status')
CREATE INDEX IX_leaves_status ON leaves(status);

-- Payroll indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_payroll_employee_month_year')
CREATE INDEX IX_payroll_employee_month_year ON payroll(employeeId, month, year);

-- Training indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_employee_training_employee')
CREATE INDEX IX_employee_training_employee ON employee_training(employeeId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_employee_training_course')
CREATE INDEX IX_employee_training_course ON employee_training(courseId);

-- Audit logs indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_audit_logs_user')
CREATE INDEX IX_audit_logs_user ON audit_logs(userId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_audit_logs_created')
CREATE INDEX IX_audit_logs_created ON audit_logs(createdAt);
GO

-- Insert sample data
-- Insert default admin user
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@smartxsolution.com')
INSERT INTO users (id, email, password, role, isActive, createdAt, updatedAt)
VALUES (
    'admin-001',
    'admin@smartxsolution.com',
    '$2a$10$rQZ8K9mN2pL1vX3yU7wE4t.5sA6bC8dF9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9',
    'ADMIN',
    1,
    GETDATE(),
    GETDATE()
);
GO

-- Insert sample permissions
IF NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'user_management')
INSERT INTO permissions (id, name, description, module, createdAt)
VALUES 
    ('perm-001', 'user_management', 'Manage users and their roles', 'ADMIN', GETDATE()),
    ('perm-002', 'employee_management', 'Manage employee information', 'HR', GETDATE()),
    ('perm-003', 'attendance_management', 'Manage attendance records', 'HR', GETDATE()),
    ('perm-004', 'leave_management', 'Manage leave requests', 'HR', GETDATE()),
    ('perm-005', 'payroll_management', 'Manage payroll and salary', 'HR', GETDATE()),
    ('perm-006', 'training_management', 'Manage training courses', 'HR', GETDATE()),
    ('perm-007', 'performance_management', 'Manage performance reviews', 'HR', GETDATE()),
    ('perm-008', 'benefits_management', 'Manage employee benefits', 'HR', GETDATE()),
    ('perm-009', 'onboarding_management', 'Manage onboarding process', 'HR', GETDATE()),
    ('perm-010', 'offboarding_management', 'Manage offboarding process', 'HR', GETDATE());
GO

-- Assign all permissions to admin user
DECLARE @adminUserId NVARCHAR(50) = 'admin-001';
DECLARE @permissionId NVARCHAR(50);

DECLARE permission_cursor CURSOR FOR
SELECT id FROM permissions;

OPEN permission_cursor;
FETCH NEXT FROM permission_cursor INTO @permissionId;

WHILE @@FETCH_STATUS = 0
BEGIN
    IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE userId = @adminUserId AND permissionId = @permissionId)
    INSERT INTO user_permissions (userId, permissionId)
    VALUES (@adminUserId, @permissionId);
    
    FETCH NEXT FROM permission_cursor INTO @permissionId;
END

CLOSE permission_cursor;
DEALLOCATE permission_cursor;
GO

-- Insert sample employees
IF NOT EXISTS (SELECT 1 FROM employees WHERE email = 'hr.manager@smartxsolution.com')
INSERT INTO employees (id, employeeId, firstName, lastName, email, phone, department, position, hireDate, salary, status, createdAt, updatedAt)
VALUES 
    ('emp-001', 'EMP001', 'John', 'Smith', 'hr.manager@smartxsolution.com', '+91-9876543210', 'Human Resources', 'HR Manager', '2023-01-15', 75000.00, 'ACTIVE', GETDATE(), GETDATE()),
    ('emp-002', 'EMP002', 'Sarah', 'Johnson', 'sarah.johnson@smartxsolution.com', '+91-9876543211', 'IT', 'Software Developer', '2023-02-01', 65000.00, 'ACTIVE', GETDATE(), GETDATE()),
    ('emp-003', 'EMP003', 'Michael', 'Brown', 'michael.brown@smartxsolution.com', '+91-9876543212', 'Finance', 'Accountant', '2023-03-01', 55000.00, 'ACTIVE', GETDATE(), GETDATE()),
    ('emp-004', 'EMP004', 'Emily', 'Davis', 'emily.davis@smartxsolution.com', '+91-9876543213', 'Marketing', 'Marketing Specialist', '2023-04-01', 60000.00, 'ACTIVE', GETDATE(), GETDATE()),
    ('emp-005', 'EMP005', 'David', 'Wilson', 'david.wilson@smartxsolution.com', '+91-9876543214', 'Sales', 'Sales Representative', '2023-05-01', 50000.00, 'ACTIVE', GETDATE(), GETDATE());
GO

-- Insert sample training courses
IF NOT EXISTS (SELECT 1 FROM training_courses WHERE title = 'Employee Onboarding')
INSERT INTO training_courses (id, title, description, category, level, duration, instructor, format, maxEnrollment, currentEnrollment, status, createdAt, updatedAt)
VALUES 
    ('course-001', 'Employee Onboarding', 'Comprehensive onboarding program for new employees', 'HR', 'Beginner', 8, 'John Smith', 'In-Person', 20, 0, 'ACTIVE', GETDATE(), GETDATE()),
    ('course-002', 'Leadership Skills', 'Advanced leadership and management training', 'Management', 'Advanced', 16, 'Sarah Johnson', 'Hybrid', 15, 0, 'ACTIVE', GETDATE(), GETDATE()),
    ('course-003', 'Technical Skills', 'Technical training for IT professionals', 'IT', 'Intermediate', 24, 'Michael Brown', 'Online', 30, 0, 'ACTIVE', GETDATE(), GETDATE()),
    ('course-004', 'Communication Skills', 'Effective communication in the workplace', 'Soft Skills', 'Beginner', 12, 'Emily Davis', 'In-Person', 25, 0, 'ACTIVE', GETDATE(), GETDATE()),
    ('course-005', 'Project Management', 'Project management methodologies and tools', 'Management', 'Intermediate', 20, 'David Wilson', 'Hybrid', 18, 0, 'ACTIVE', GETDATE(), GETDATE());
GO

-- Insert sample benefits
IF NOT EXISTS (SELECT 1 FROM benefits WHERE name = 'Health Insurance')
INSERT INTO benefits (id, name, description, type, cost, isActive, createdAt, updatedAt)
VALUES 
    ('benefit-001', 'Health Insurance', 'Comprehensive health insurance coverage', 'HEALTH_INSURANCE', 500.00, 1, GETDATE(), GETDATE()),
    ('benefit-002', 'Life Insurance', 'Life insurance coverage for employees', 'LIFE_INSURANCE', 200.00, 1, GETDATE(), GETDATE()),
    ('benefit-003', 'Dental Insurance', 'Dental insurance coverage', 'DENTAL_INSURANCE', 150.00, 1, GETDATE(), GETDATE()),
    ('benefit-004', 'Transport Allowance', 'Monthly transport allowance', 'TRANSPORT', 1000.00, 1, GETDATE(), GETDATE()),
    ('benefit-005', 'Meal Allowance', 'Daily meal allowance', 'MEAL', 500.00, 1, GETDATE(), GETDATE());
GO

-- Display migration summary
SELECT 'Migration Summary' as Info;
SELECT 'Database: SmartXSolution' as Database_Name;
SELECT 'Server: 103.206.57.30:1201' as Server_Info;
SELECT 'User: sa' as Database_User;
SELECT GETDATE() as Migration_Date;
GO

-- Display table counts
SELECT 'Table Records Count' as Info;
SELECT 'users' as Table_Name, COUNT(*) as Record_Count FROM users
UNION ALL
SELECT 'employees' as Table_Name, COUNT(*) as Record_Count FROM employees
UNION ALL
SELECT 'training_courses' as Table_Name, COUNT(*) as Record_Count FROM training_courses
UNION ALL
SELECT 'benefits' as Table_Name, COUNT(*) as Record_Count FROM benefits
UNION ALL
SELECT 'permissions' as Table_Name, COUNT(*) as Record_Count FROM permissions;
GO

PRINT 'Migration completed successfully!';
PRINT 'Database: SmartXSolution';
PRINT 'Server: 103.206.57.30:1201';
PRINT 'User: sa';
PRINT 'All tables and sample data have been created.'; 