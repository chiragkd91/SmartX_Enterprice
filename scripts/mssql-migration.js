/**
 * Microsoft SQL Server Migration Script
 * Sets up SmartX Solution database in SQL Server
 * 
 * Connection Details:
 * Server: 103.206.57.30, 1201
 * User: sa
 * Password: Password@123
 */

import sql from 'mssql';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL Server Configuration
const sqlServerConfig = {
  user: 'sa',
  password: 'Password@123',
  server: '103.206.57.30',
  database: 'SmartXSolution',
  port: 1201,
  options: {
    encrypt: false, // Set to true if using SSL
    trustServerCertificate: true,
    enableArithAbort: true,
    requestTimeout: 60000,
    connectionTimeout: 60000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }
};

class DatabaseMigration {
  constructor() {
    this.sqlServerPool = null;
  }

  /**
   * Initialize connections
   */
  async initialize() {
    console.log('🔗 Initializing SQL Server connection...');
    
    try {
      // Connect to SQL Server
      this.sqlServerPool = await sql.connect(sqlServerConfig);
      console.log('✅ SQL Server connection established');
      
      // Test SQL Server connection
      await this.sqlServerPool.request().query('SELECT 1 as test');
      console.log('✅ SQL Server connection test passed');
      
    } catch (error) {
      console.error('❌ Connection initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create SQL Server database if it doesn't exist
   */
  async createDatabase() {
    try {
      console.log('🗄️ Creating SQL Server database...');
      
      // Connect to master database to create new database
      const masterConfig = { ...sqlServerConfig, database: 'master' };
      const masterPool = await sql.connect(masterConfig);
      
      // Create database if it doesn't exist
      await masterPool.request().query(`
        IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SmartXSolution')
        BEGIN
          CREATE DATABASE SmartXSolution;
        END
      `);
      
      await masterPool.close();
      console.log('✅ Database created/verified successfully');
      
      // Reconnect to the SmartXSolution database
      this.sqlServerPool = await sql.connect(sqlServerConfig);
      console.log('✅ Reconnected to SmartXSolution database');
      
    } catch (error) {
      console.error('❌ Database creation failed:', error);
      throw error;
    }
  }

  /**
   * Create tables in SQL Server
   */
  async createTables() {
    try {
      console.log('📋 Creating tables in SQL Server...');
      
      const createTablesSQL = `
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

        -- Permissions Table
        IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'permissions')
        CREATE TABLE permissions (
            id NVARCHAR(50) PRIMARY KEY,
            name NVARCHAR(255) UNIQUE NOT NULL,
            description NVARCHAR(MAX),
            module NVARCHAR(100) NOT NULL,
            createdAt DATETIME2 DEFAULT GETDATE()
        );

        -- User Permissions Junction Table
        IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_permissions')
        CREATE TABLE user_permissions (
            userId NVARCHAR(50) NOT NULL,
            permissionId NVARCHAR(50) NOT NULL,
            PRIMARY KEY (userId, permissionId),
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
        );

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
      `;

      await this.sqlServerPool.request().query(createTablesSQL);
      console.log('✅ Tables created successfully');
      
    } catch (error) {
      console.error('❌ Table creation failed:', error);
      throw error;
    }
  }

  /**
   * Insert sample data
   */
  async insertSampleData() {
    try {
      console.log('📝 Inserting sample data...');
      
      // Insert default admin user
      await this.sqlServerPool.request()
        .input('id', sql.NVarChar, 'admin-001')
        .input('email', sql.NVarChar, 'admin@smartxsolution.com')
        .input('password', sql.NVarChar, '$2a$10$rQZ8K9mN2pL1vX3yU7wE4t.5sA6bC8dF9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9')
        .input('role', sql.NVarChar, 'ADMIN')
        .query(`
          IF NOT EXISTS (SELECT 1 FROM users WHERE email = @email)
          INSERT INTO users (id, email, password, role, isActive, createdAt, updatedAt)
          VALUES (@id, @email, @password, @role, 1, GETDATE(), GETDATE())
        `);

      // Insert sample permissions
      const permissions = [
        { id: 'perm-001', name: 'user_management', description: 'Manage users and their roles', module: 'ADMIN' },
        { id: 'perm-002', name: 'employee_management', description: 'Manage employee information', module: 'HR' },
        { id: 'perm-003', name: 'attendance_management', description: 'Manage attendance records', module: 'HR' },
        { id: 'perm-004', name: 'leave_management', description: 'Manage leave requests', module: 'HR' },
        { id: 'perm-005', name: 'payroll_management', description: 'Manage payroll and salary', module: 'HR' },
        { id: 'perm-006', name: 'training_management', description: 'Manage training courses', module: 'HR' },
        { id: 'perm-007', name: 'performance_management', description: 'Manage performance reviews', module: 'HR' },
        { id: 'perm-008', name: 'benefits_management', description: 'Manage employee benefits', module: 'HR' },
        { id: 'perm-009', name: 'onboarding_management', description: 'Manage onboarding process', module: 'HR' },
        { id: 'perm-010', name: 'offboarding_management', description: 'Manage offboarding process', module: 'HR' }
      ];

      for (const perm of permissions) {
        await this.sqlServerPool.request()
          .input('id', sql.NVarChar, perm.id)
          .input('name', sql.NVarChar, perm.name)
          .input('description', sql.NVarChar, perm.description)
          .input('module', sql.NVarChar, perm.module)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM permissions WHERE id = @id)
            INSERT INTO permissions (id, name, description, module, createdAt)
            VALUES (@id, @name, @description, @module, GETDATE())
          `);
      }

      // Insert sample employees
      const employees = [
        { id: 'emp-001', employeeId: 'EMP001', firstName: 'John', lastName: 'Smith', email: 'hr.manager@smartxsolution.com', phone: '+91-9876543210', department: 'Human Resources', position: 'HR Manager', hireDate: '2023-01-15', salary: 75000.00 },
        { id: 'emp-002', employeeId: 'EMP002', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@smartxsolution.com', phone: '+91-9876543211', department: 'IT', position: 'Software Developer', hireDate: '2023-02-01', salary: 65000.00 },
        { id: 'emp-003', employeeId: 'EMP003', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@smartxsolution.com', phone: '+91-9876543212', department: 'Finance', position: 'Accountant', hireDate: '2023-03-01', salary: 55000.00 },
        { id: 'emp-004', employeeId: 'EMP004', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@smartxsolution.com', phone: '+91-9876543213', department: 'Marketing', position: 'Marketing Specialist', hireDate: '2023-04-01', salary: 60000.00 },
        { id: 'emp-005', employeeId: 'EMP005', firstName: 'David', lastName: 'Wilson', email: 'david.wilson@smartxsolution.com', phone: '+91-9876543214', department: 'Sales', position: 'Sales Representative', hireDate: '2023-05-01', salary: 50000.00 }
      ];

      for (const emp of employees) {
        await this.sqlServerPool.request()
          .input('id', sql.NVarChar, emp.id)
          .input('employeeId', sql.NVarChar, emp.employeeId)
          .input('firstName', sql.NVarChar, emp.firstName)
          .input('lastName', sql.NVarChar, emp.lastName)
          .input('email', sql.NVarChar, emp.email)
          .input('phone', sql.NVarChar, emp.phone)
          .input('department', sql.NVarChar, emp.department)
          .input('position', sql.NVarChar, emp.position)
          .input('hireDate', sql.Date, new Date(emp.hireDate))
          .input('salary', sql.Decimal(10,2), emp.salary)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM employees WHERE id = @id)
            INSERT INTO employees (id, employeeId, firstName, lastName, email, phone, department, position, hireDate, salary, status, createdAt, updatedAt)
            VALUES (@id, @employeeId, @firstName, @lastName, @email, @phone, @department, @position, @hireDate, @salary, 'ACTIVE', GETDATE(), GETDATE())
          `);
      }

      // Insert sample training courses
      const courses = [
        { id: 'course-001', title: 'Employee Onboarding', description: 'Comprehensive onboarding program for new employees', category: 'HR', level: 'Beginner', duration: 8, instructor: 'John Smith', format: 'In-Person', maxEnrollment: 20 },
        { id: 'course-002', title: 'Leadership Skills', description: 'Advanced leadership and management training', category: 'Management', level: 'Advanced', duration: 16, instructor: 'Sarah Johnson', format: 'Hybrid', maxEnrollment: 15 },
        { id: 'course-003', title: 'Technical Skills', description: 'Technical training for IT professionals', category: 'IT', level: 'Intermediate', duration: 24, instructor: 'Michael Brown', format: 'Online', maxEnrollment: 30 },
        { id: 'course-004', title: 'Communication Skills', description: 'Effective communication in the workplace', category: 'Soft Skills', level: 'Beginner', duration: 12, instructor: 'Emily Davis', format: 'In-Person', maxEnrollment: 25 },
        { id: 'course-005', title: 'Project Management', description: 'Project management methodologies and tools', category: 'Management', level: 'Intermediate', duration: 20, instructor: 'David Wilson', format: 'Hybrid', maxEnrollment: 18 }
      ];

      for (const course of courses) {
        await this.sqlServerPool.request()
          .input('id', sql.NVarChar, course.id)
          .input('title', sql.NVarChar, course.title)
          .input('description', sql.NVarChar, course.description)
          .input('category', sql.NVarChar, course.category)
          .input('level', sql.NVarChar, course.level)
          .input('duration', sql.Int, course.duration)
          .input('instructor', sql.NVarChar, course.instructor)
          .input('format', sql.NVarChar, course.format)
          .input('maxEnrollment', sql.Int, course.maxEnrollment)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM training_courses WHERE id = @id)
            INSERT INTO training_courses (id, title, description, category, level, duration, instructor, format, maxEnrollment, currentEnrollment, status, createdAt, updatedAt)
            VALUES (@id, @title, @description, @category, @level, @duration, @instructor, @format, @maxEnrollment, 0, 'ACTIVE', GETDATE(), GETDATE())
          `);
      }

      // Insert sample benefits
      const benefits = [
        { id: 'benefit-001', name: 'Health Insurance', description: 'Comprehensive health insurance coverage', type: 'HEALTH_INSURANCE', cost: 500.00 },
        { id: 'benefit-002', name: 'Life Insurance', description: 'Life insurance coverage for employees', type: 'LIFE_INSURANCE', cost: 200.00 },
        { id: 'benefit-003', name: 'Dental Insurance', description: 'Dental insurance coverage', type: 'DENTAL_INSURANCE', cost: 150.00 },
        { id: 'benefit-004', name: 'Transport Allowance', description: 'Monthly transport allowance', type: 'TRANSPORT', cost: 1000.00 },
        { id: 'benefit-005', name: 'Meal Allowance', description: 'Daily meal allowance', type: 'MEAL', cost: 500.00 }
      ];

      for (const benefit of benefits) {
        await this.sqlServerPool.request()
          .input('id', sql.NVarChar, benefit.id)
          .input('name', sql.NVarChar, benefit.name)
          .input('description', sql.NVarChar, benefit.description)
          .input('type', sql.NVarChar, benefit.type)
          .input('cost', sql.Decimal(10,2), benefit.cost)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM benefits WHERE id = @id)
            INSERT INTO benefits (id, name, description, type, cost, isActive, createdAt, updatedAt)
            VALUES (@id, @name, @description, @type, @cost, 1, GETDATE(), GETDATE())
          `);
      }

      console.log('✅ Sample data inserted successfully');
      
    } catch (error) {
      console.error('❌ Sample data insertion failed:', error);
      throw error;
    }
  }

  /**
   * Create indexes for better performance
   */
  async createIndexes() {
    try {
      console.log('📈 Creating indexes...');
      
      const createIndexesSQL = `
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
      `;

      await this.sqlServerPool.request().query(createIndexesSQL);
      console.log('✅ Indexes created successfully');
      
    } catch (error) {
      console.error('❌ Index creation failed:', error);
      throw error;
    }
  }

  /**
   * Verify migration
   */
  async verifyMigration() {
    try {
      console.log('🔍 Verifying migration...');
      
      const tables = [
        'users', 'employees', 'training_courses', 'employee_training',
        'leaves', 'payroll', 'attendance', 'performance', 'benefits',
        'onboarding', 'offboarding', 'audit_logs'
      ];
      
      for (const table of tables) {
        const result = await this.sqlServerPool.request().query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`📊 ${table}: ${result.recordset[0].count} records`);
      }
      
      console.log('✅ Migration verification completed');
      
    } catch (error) {
      console.error('❌ Migration verification failed:', error);
      throw error;
    }
  }

  /**
   * Close connections
   */
  async close() {
    try {
      if (this.sqlServerPool) {
        await this.sqlServerPool.close();
        console.log('🔌 SQL Server connection closed');
      }
    } catch (error) {
      console.error('❌ Error closing connections:', error);
    }
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  const migration = new DatabaseMigration();
  
  try {
    console.log('🚀 Starting SQL Server database setup...');
    console.log('📍 Target: 103.206.57.30:1201');
    console.log('👤 User: sa');
    console.log('');
    
    // Initialize connections
    await migration.initialize();
    
    // Create database
    await migration.createDatabase();
    
    // Create tables
    await migration.createTables();
    
    // Insert sample data
    await migration.insertSampleData();
    
    // Create indexes
    await migration.createIndexes();
    
    // Verify migration
    await migration.verifyMigration();
    
    console.log('');
    console.log('🎉 Database setup completed successfully!');
    console.log('✅ SmartX Solution database is ready');
    console.log('🔗 Database: SmartXSolution');
    console.log('📍 Server: 103.206.57.30:1201');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Update your .env file with the DATABASE_URL');
    console.log('2. Run: npm run db:generate');
    console.log('3. Start your application');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await migration.close();
  }
}

// Run migration immediately
console.log('Starting migration script...');
runMigration().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});

export { DatabaseMigration, runMigration }; 