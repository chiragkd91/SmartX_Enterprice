/**
 * SQLite Database Implementation for SmartBizFlow HR Portal
 * Complete CRUD operations for all HR modules
 */

// Using JSON database instead of SQLite for better compatibility
// import sqlite3 from 'sqlite3';
// import { open, Database } from 'sqlite';
import path from 'path';

// Database interface types
export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  hire_date: string;
  department: string;
  position: string;
  salary: number;
  manager_id?: number;
  status: 'active' | 'inactive' | 'terminated';
  created_at: string;
  updated_at: string;
}

export interface TrainingCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  instructor: string;
  format: string;
  max_enrollment: number;
  current_enrollment: number;
  status: string;
  rating: number;
  total_ratings: number;
  created_at: string;
  updated_at: string;
}

export interface EmployeeTraining {
  id: number;
  employee_id: number;
  course_id: number;
  status: string;
  progress: number;
  start_date: string;
  completion_date?: string;
  certificate?: string;
  score?: number;
  attempts: number;
  last_accessed: string;
  created_at: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: string;
  submitted_date: string;
  approved_by?: number;
  approved_date?: string;
  comments?: string;
  created_at: string;
}

export interface Payslip {
  id: number;
  employee_id: number;
  month: string;
  year: number;
  gross_pay: number;
  net_pay: number;
  status: string;
  payment_date?: string;
  created_at: string;
}

export interface TwoFactorMethod {
  id: number;
  user_id: number;
  type: string;
  name: string;
  is_enabled: boolean;
  is_primary: boolean;
  device_info?: string;
  last_used?: string;
  created_at: string;
}

export interface BackupCode {
  id: number;
  user_id: number;
  code: string;
  is_used: boolean;
  used_at?: string;
  created_at: string;
}

export interface TrustedDevice {
  id: number;
  user_id: number;
  name: string;
  type: string;
  browser?: string;
  os?: string;
  ip_address: string;
  location: string;
  is_trusted: boolean;
  last_active: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

class SQLiteDatabase {
  private db: Database | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'smartbizflow.db');
  }

  /**
   * Initialize database connection and create tables
   */
  async initialize(): Promise<void> {
    try {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });

      await this.createTables();
      console.log('✅ SQLite database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create all database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Users table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'employee',
        is_active BOOLEAN NOT NULL DEFAULT 1,
        last_login TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Employees table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS employees (
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
      )
    `);

    // Training courses table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS training_courses (
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
      )
    `);

    // Employee training enrollments table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS employee_trainings (
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
      )
    `);

    // Leave requests table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS leave_requests (
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
      )
    `);

    // Payslips table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS payslips (
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
      )
    `);

    // Two-factor authentication methods table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS two_factor_methods (
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
      )
    `);

    // Backup codes table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS backup_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        code TEXT NOT NULL,
        is_used BOOLEAN NOT NULL DEFAULT 0,
        used_at TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Trusted devices table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS trusted_devices (
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
      )
    `);

    // Employee documents table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS employee_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        file_type TEXT NOT NULL,
        upload_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expiry_date TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
      )
    `);

    // Employee skills table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS employee_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        skill_name TEXT NOT NULL,
        level TEXT NOT NULL,
        category TEXT NOT NULL,
        verified BOOLEAN NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
      )
    `);

    // Employee certifications table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS employee_certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        issuing_organization TEXT NOT NULL,
        issue_date TEXT NOT NULL,
        expiry_date TEXT,
        credential_id TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
      )
    `);

    console.log('✅ All database tables created successfully');
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  // ==================== USER CRUD OPERATIONS ====================

  /**
   * Create a new user
   */
  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(`
      INSERT INTO users (username, email, password_hash, role, is_active, last_login)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [user.username, user.email, user.password_hash, user.role, user.is_active, user.last_login]);

    return this.getUserById(result.lastID!);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const user = await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
    return user || null;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const user = await this.db.get('SELECT * FROM users WHERE email = ?', [email]);
    return user || null;
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all('SELECT * FROM users ORDER BY created_at DESC');
  }

  /**
   * Update user
   */
  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(new Date().toISOString()); // updated_at
    values.push(id);

    await this.db.run(`
      UPDATE users SET ${fields}, updated_at = ? WHERE id = ?
    `, values);

    return this.getUserById(id);
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run('DELETE FROM users WHERE id = ?', [id]);
    return result.changes! > 0;
  }

  // ==================== EMPLOYEE CRUD OPERATIONS ====================

  /**
   * Create a new employee
   */
  async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(`
      INSERT INTO employees (
        employee_id, first_name, last_name, email, phone, date_of_birth,
        hire_date, department, position, salary, manager_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      employee.employee_id, employee.first_name, employee.last_name,
      employee.email, employee.phone, employee.date_of_birth,
      employee.hire_date, employee.department, employee.position,
      employee.salary, employee.manager_id, employee.status
    ]);

    return this.getEmployeeById(result.lastID!);
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: number): Promise<Employee | null> {
    if (!this.db) throw new Error('Database not initialized');

    const employee = await this.db.get('SELECT * FROM employees WHERE id = ?', [id]);
    return employee || null;
  }

  /**
   * Get employee by employee ID
   */
  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null> {
    if (!this.db) throw new Error('Database not initialized');

    const employee = await this.db.get('SELECT * FROM employees WHERE employee_id = ?', [employeeId]);
    return employee || null;
  }

  /**
   * Get all employees with optional filtering
   */
  async getAllEmployees(filters?: {
    department?: string;
    status?: string;
    search?: string;
  }): Promise<Employee[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM employees WHERE 1=1';
    const params: any[] = [];

    if (filters?.department) {
      query += ' AND department = ?';
      params.push(filters.department);
    }

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR employee_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    return await this.db.all(query, params);
  }

  /**
   * Update employee
   */
  async updateEmployee(id: number, updates: Partial<Employee>): Promise<Employee | null> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(new Date().toISOString()); // updated_at
    values.push(id);

    await this.db.run(`
      UPDATE employees SET ${fields}, updated_at = ? WHERE id = ?
    `, values);

    return this.getEmployeeById(id);
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run('DELETE FROM employees WHERE id = ?', [id]);
    return result.changes! > 0;
  }

  // ==================== TRAINING COURSE CRUD OPERATIONS ====================

  /**
   * Create a new training course
   */
  async createTrainingCourse(course: Omit<TrainingCourse, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingCourse> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(`
      INSERT INTO training_courses (
        title, description, category, level, duration, instructor,
        format, max_enrollment, current_enrollment, status, rating, total_ratings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      course.title, course.description, course.category, course.level,
      course.duration, course.instructor, course.format, course.max_enrollment,
      course.current_enrollment, course.status, course.rating, course.total_ratings
    ]);

    return this.getTrainingCourseById(result.lastID!);
  }

  /**
   * Get training course by ID
   */
  async getTrainingCourseById(id: number): Promise<TrainingCourse | null> {
    if (!this.db) throw new Error('Database not initialized');

    const course = await this.db.get('SELECT * FROM training_courses WHERE id = ?', [id]);
    return course || null;
  }

  /**
   * Get all training courses with optional filtering
   */
  async getAllTrainingCourses(filters?: {
    category?: string;
    level?: string;
    status?: string;
    search?: string;
  }): Promise<TrainingCourse[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM training_courses WHERE 1=1';
    const params: any[] = [];

    if (filters?.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters?.level) {
      query += ' AND level = ?';
      params.push(filters.level);
    }

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR instructor LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    return await this.db.all(query, params);
  }

  /**
   * Update training course
   */
  async updateTrainingCourse(id: number, updates: Partial<TrainingCourse>): Promise<TrainingCourse | null> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(new Date().toISOString()); // updated_at
    values.push(id);

    await this.db.run(`
      UPDATE training_courses SET ${fields}, updated_at = ? WHERE id = ?
    `, values);

    return this.getTrainingCourseById(id);
  }

  /**
   * Delete training course
   */
  async deleteTrainingCourse(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run('DELETE FROM training_courses WHERE id = ?', [id]);
    return result.changes! > 0;
  }

  // ==================== EMPLOYEE TRAINING CRUD OPERATIONS ====================

  /**
   * Enroll employee in training course
   */
  async enrollEmployeeInTraining(enrollment: Omit<EmployeeTraining, 'id' | 'created_at'>): Promise<EmployeeTraining> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(`
      INSERT INTO employee_trainings (
        employee_id, course_id, status, progress, start_date,
        completion_date, certificate, score, attempts, last_accessed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      enrollment.employee_id, enrollment.course_id, enrollment.status,
      enrollment.progress, enrollment.start_date, enrollment.completion_date,
      enrollment.certificate, enrollment.score, enrollment.attempts, enrollment.last_accessed
    ]);

    return this.getEmployeeTrainingById(result.lastID!);
  }

  /**
   * Get employee training by ID
   */
  async getEmployeeTrainingById(id: number): Promise<EmployeeTraining | null> {
    if (!this.db) throw new Error('Database not initialized');

    const enrollment = await this.db.get('SELECT * FROM employee_trainings WHERE id = ?', [id]);
    return enrollment || null;
  }

  /**
   * Get employee training enrollments
   */
  async getEmployeeTrainings(filters?: {
    employee_id?: number;
    course_id?: number;
    status?: string;
  }): Promise<EmployeeTraining[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM employee_trainings WHERE 1=1';
    const params: any[] = [];

    if (filters?.employee_id) {
      query += ' AND employee_id = ?';
      params.push(filters.employee_id);
    }

    if (filters?.course_id) {
      query += ' AND course_id = ?';
      params.push(filters.course_id);
    }

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    return await this.db.all(query, params);
  }

  /**
   * Update employee training progress
   */
  async updateEmployeeTraining(id: number, updates: Partial<EmployeeTraining>): Promise<EmployeeTraining | null> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await this.db.run(`
      UPDATE employee_trainings SET ${fields} WHERE id = ?
    `, values);

    return this.getEmployeeTrainingById(id);
  }

  /**
   * Delete employee training enrollment
   */
  async deleteEmployeeTraining(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run('DELETE FROM employee_trainings WHERE id = ?', [id]);
    return result.changes! > 0;
  }

  // ==================== LEAVE REQUEST CRUD OPERATIONS ====================

  /**
   * Create leave request
   */
  async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'created_at'>): Promise<LeaveRequest> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(`
      INSERT INTO leave_requests (
        employee_id, type, start_date, end_date, days, reason,
        status, submitted_date, approved_by, approved_date, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      request.employee_id, request.type, request.start_date, request.end_date,
      request.days, request.reason, request.status, request.submitted_date,
      request.approved_by, request.approved_date, request.comments
    ]);

    return this.getLeaveRequestById(result.lastID!);
  }

  /**
   * Get leave request by ID
   */
  async getLeaveRequestById(id: number): Promise<LeaveRequest | null> {
    if (!this.db) throw new Error('Database not initialized');

    const request = await this.db.get('SELECT * FROM leave_requests WHERE id = ?', [id]);
    return request || null;
  }

  /**
   * Get leave requests with filtering
   */
  async getLeaveRequests(filters?: {
    employee_id?: number;
    type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<LeaveRequest[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM leave_requests WHERE 1=1';
    const params: any[] = [];

    if (filters?.employee_id) {
      query += ' AND employee_id = ?';
      params.push(filters.employee_id);
    }

    if (filters?.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.start_date) {
      query += ' AND start_date >= ?';
      params.push(filters.start_date);
    }

    if (filters?.end_date) {
      query += ' AND end_date <= ?';
      params.push(filters.end_date);
    }

    query += ' ORDER BY submitted_date DESC';

    return await this.db.all(query, params);
  }

  /**
   * Update leave request
   */
  async updateLeaveRequest(id: number, updates: Partial<LeaveRequest>): Promise<LeaveRequest | null> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await this.db.run(`
      UPDATE leave_requests SET ${fields} WHERE id = ?
    `, values);

    return this.getLeaveRequestById(id);
  }

  /**
   * Delete leave request
   */
  async deleteLeaveRequest(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run('DELETE FROM leave_requests WHERE id = ?', [id]);
    return result.changes! > 0;
  }

  // ==================== PAYSLIP CRUD OPERATIONS ====================

  /**
   * Create payslip
   */
  async createPayslip(payslip: Omit<Payslip, 'id' | 'created_at'>): Promise<Payslip> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(`
      INSERT INTO payslips (
        employee_id, month, year, gross_pay, net_pay, status, payment_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      payslip.employee_id, payslip.month, payslip.year,
      payslip.gross_pay, payslip.net_pay, payslip.status, payslip.payment_date
    ]);

    return this.getPayslipById(result.lastID!);
  }

  /**
   * Get payslip by ID
   */
  async getPayslipById(id: number): Promise<Payslip | null> {
    if (!this.db) throw new Error('Database not initialized');

    const payslip = await this.db.get('SELECT * FROM payslips WHERE id = ?', [id]);
    return payslip || null;
  }

  /**
   * Get payslips with filtering
   */
  async getPayslips(filters?: {
    employee_id?: number;
    month?: string;
    year?: number;
    status?: string;
  }): Promise<Payslip[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM payslips WHERE 1=1';
    const params: any[] = [];

    if (filters?.employee_id) {
      query += ' AND employee_id = ?';
      params.push(filters.employee_id);
    }

    if (filters?.month) {
      query += ' AND month = ?';
      params.push(filters.month);
    }

    if (filters?.year) {
      query += ' AND year = ?';
      params.push(filters.year);
    }

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY year DESC, month DESC';

    return await this.db.all(query, params);
  }

  /**
   * Update payslip
   */
  async updatePayslip(id: number, updates: Partial<Payslip>): Promise<Payslip | null> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await this.db.run(`
      UPDATE payslips SET ${fields} WHERE id = ?
    `, values);

    return this.getPayslipById(id);
  }

  /**
   * Delete payslip
   */
  async deletePayslip(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run('DELETE FROM payslips WHERE id = ?', [id]);
    return result.changes! > 0;
  }

  // ==================== TWO-FACTOR AUTHENTICATION CRUD OPERATIONS ====================

  /**
   * Create two-factor authentication method
   */
  async createTwoFactorMethod(method: Omit<TwoFactorMethod, 'id' | 'created_at'>): Promise<TwoFactorMethod> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(`
      INSERT INTO two_factor_methods (
        user_id, type, name, is_enabled, is_primary, device_info, last_used
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      method.user_id, method.type, method.name, method.is_enabled,
      method.is_primary, method.device_info, method.last_used
    ]);

    return this.getTwoFactorMethodById(result.lastID!);
  }

  /**
   * Get two-factor authentication method by ID
   */
  async getTwoFactorMethodById(id: number): Promise<TwoFactorMethod | null> {
    if (!this.db) throw new Error('Database not initialized');

    const method = await this.db.get('SELECT * FROM two_factor_methods WHERE id = ?', [id]);
    return method || null;
  }

  /**
   * Get two-factor authentication methods for user
   */
  async getTwoFactorMethodsByUserId(userId: number): Promise<TwoFactorMethod[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all('SELECT * FROM two_factor_methods WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC', [userId]);
  }

  /**
   * Update two-factor authentication method
   */
  async updateTwoFactorMethod(id: number, updates: Partial<TwoFactorMethod>): Promise<TwoFactorMethod | null> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await this.db.run(`
      UPDATE two_factor_methods SET ${fields} WHERE id = ?
    `, values);

    return this.getTwoFactorMethodById(id);
  }

  /**
   * Delete two-factor authentication method
   */
  async deleteTwoFactorMethod(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run('DELETE FROM two_factor_methods WHERE id = ?', [id]);
    return result.changes! > 0;
  }

  // ==================== BACKUP CODES CRUD OPERATIONS ====================

  /**
   * Create backup codes for user
   */
  async createBackupCodes(userId: number, codes: string[]): Promise<BackupCode[]> {
    if (!this.db) throw new Error('Database not initialized');

    const createdCodes: BackupCode[] = [];

    for (const code of codes) {
      const result = await this.db.run(`
        INSERT INTO backup_codes (user_id, code, is_used)
        VALUES (?, ?, 0)
      `, [userId, code]);

      const createdCode = await this.getBackupCodeById(result.lastID!);
      if (createdCode) createdCodes.push(createdCode);
    }

    return createdCodes;
  }

  /**
   * Get backup code by ID
   */
  async getBackupCodeById(id: number): Promise<BackupCode | null> {
    if (!this.db) throw new Error('Database not initialized');

    const code = await this.db.get('SELECT * FROM backup_codes WHERE id = ?', [id]);
    return code || null;
  }

  /**
   * Get backup codes for user
   */
  async getBackupCodesByUserId(userId: number): Promise<BackupCode[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all('SELECT * FROM backup_codes WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  }

  /**
   * Use backup code
   */
  async useBackupCode(userId: number, code: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(`
      UPDATE backup_codes 
      SET is_used = 1, used_at = ? 
      WHERE user_id = ? AND code = ? AND is_used = 0
    `, [new Date().toISOString(), userId, code]);

    return result.changes! > 0;
  }

  /**
   * Delete backup code
   */
  async deleteBackupCode(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run('DELETE FROM backup_codes WHERE id = ?', [id]);
    return result.changes! > 0;
  }

  // ==================== TRUSTED DEVICES CRUD OPERATIONS ====================

  /**
   * Create trusted device
   */
  async createTrustedDevice(device: Omit<TrustedDevice, 'id' | 'created_at'>): Promise<TrustedDevice> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(`
      INSERT INTO trusted_devices (
        user_id, name, type, browser, os, ip_address, location, is_trusted, last_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      device.user_id, device.name, device.type, device.browser, device.os,
      device.ip_address, device.location, device.is_trusted, device.last_active
    ]);

    return this.getTrustedDeviceById(result.lastID!);
  }

  /**
   * Get trusted device by ID
   */
  async getTrustedDeviceById(id: number): Promise<TrustedDevice | null> {
    if (!this.db) throw new Error('Database not initialized');

    const device = await this.db.get('SELECT * FROM trusted_devices WHERE id = ?', [id]);
    return device || null;
  }

  /**
   * Get trusted devices for user
   */
  async getTrustedDevicesByUserId(userId: number): Promise<TrustedDevice[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all('SELECT * FROM trusted_devices WHERE user_id = ? ORDER BY last_active DESC', [userId]);
  }

  /**
   * Update trusted device
   */
  async updateTrustedDevice(id: number, updates: Partial<TrustedDevice>): Promise<TrustedDevice | null> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await this.db.run(`
      UPDATE trusted_devices SET ${fields} WHERE id = ?
    `, values);

    return this.getTrustedDeviceById(id);
  }

  /**
   * Delete trusted device
   */
  async deleteTrustedDevice(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run('DELETE FROM trusted_devices WHERE id = ?', [id]);
    return result.changes! > 0;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<{
    totalEmployees: number;
    totalCourses: number;
    totalLeaveRequests: number;
    totalPayslips: number;
    totalUsers: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const [
      { count: totalEmployees },
      { count: totalCourses },
      { count: totalLeaveRequests },
      { count: totalPayslips },
      { count: totalUsers }
    ] = await Promise.all([
      this.db.get('SELECT COUNT(*) as count FROM employees'),
      this.db.get('SELECT COUNT(*) as count FROM training_courses'),
      this.db.get('SELECT COUNT(*) as count FROM leave_requests'),
      this.db.get('SELECT COUNT(*) as count FROM payslips'),
      this.db.get('SELECT COUNT(*) as count FROM users')
    ]);

    return {
      totalEmployees,
      totalCourses,
      totalLeaveRequests,
      totalPayslips,
      totalUsers
    };
  }

  /**
   * Backup database
   */
  async backupDatabase(backupPath: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.backup(backupPath);
  }

  /**
   * Execute raw SQL query
   */
  async executeQuery(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(sql, params);
  }
}

// Create singleton instance
const database = new SQLiteDatabase();

export default database; 