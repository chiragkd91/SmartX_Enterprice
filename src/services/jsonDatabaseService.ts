/**
 * JSON Database Service for SmartBizFlow HR Portal
 * Provides CRUD operations for JSON-based database
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Database interfaces
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

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
  manager_id: number | null;
  status: string;
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
  completion_date: string | null;
  certificate: string | null;
  score: number | null;
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
  approved_by: number | null;
  approved_date: string | null;
  comments: string | null;
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
  payment_date: string;
  created_at: string;
}

export interface TwoFactorMethod {
  id: number;
  user_id: number;
  type: string;
  name: string;
  is_enabled: boolean;
  is_primary: boolean;
  device_info: string | null;
  last_used: string;
  created_at: string;
}

export interface BackupCode {
  id: number;
  user_id: number;
  code: string;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
}

export interface TrustedDevice {
  id: number;
  user_id: number;
  name: string;
  type: string;
  browser: string | null;
  os: string | null;
  ip_address: string;
  location: string;
  is_trusted: boolean;
  last_active: string;
  created_at: string;
}

export interface Database {
  users: User[];
  employees: Employee[];
  trainingCourses: TrainingCourse[];
  employeeTrainings: EmployeeTraining[];
  leaveRequests: LeaveRequest[];
  payslips: Payslip[];
  twoFactorMethods: TwoFactorMethod[];
  backupCodes: BackupCode[];
  trustedDevices: TrustedDevice[];
  metadata: {
    created_at: string;
    version: string;
    last_updated: string;
  };
}

class JSONDatabaseService {
  private dbPath: string;
  private database: Database | null = null;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'smartbizflow-db.json');
  }

  /**
   * Load database from file
   */
  private loadDatabase(): Database {
    if (!fs.existsSync(this.dbPath)) {
      throw new Error('Database file not found. Please run the seeder first.');
    }

    if (!this.database) {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      this.database = JSON.parse(data);
    }

    return this.database;
  }

  /**
   * Save database to file
   */
  private saveDatabase(): void {
    if (!this.database) {
      throw new Error('Database not loaded');
    }

    this.database.metadata.last_updated = new Date().toISOString();
    fs.writeFileSync(this.dbPath, JSON.stringify(this.database, null, 2));
  }

  /**
   * Get next ID for a collection
   */
  private getNextId(collection: any[]): number {
    if (collection.length === 0) return 1;
    return Math.max(...collection.map(item => item.id)) + 1;
  }

  // ==================== USER OPERATIONS ====================

  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const db = this.loadDatabase();
    const newUser: User = {
      ...userData,
      id: this.getNextId(db.users),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    const db = this.loadDatabase();
    return db.users.find(user => user.id === id) || null;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const db = this.loadDatabase();
    return db.users.find(user => user.email === email) || null;
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    const db = this.loadDatabase();
    return db.users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Update user
   */
  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const db = this.loadDatabase();
    const userIndex = db.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return null;

    db.users[userIndex] = {
      ...db.users[userIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveDatabase();
    return db.users[userIndex];
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<boolean> {
    const db = this.loadDatabase();
    const userIndex = db.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return false;

    db.users.splice(userIndex, 1);
    this.saveDatabase();
    return true;
  }

  // ==================== EMPLOYEE OPERATIONS ====================

  /**
   * Create a new employee
   */
  async createEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    const db = this.loadDatabase();
    const newEmployee: Employee = {
      ...employeeData,
      id: this.getNextId(db.employees),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.employees.push(newEmployee);
    this.saveDatabase();
    return newEmployee;
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: number): Promise<Employee | null> {
    const db = this.loadDatabase();
    return db.employees.find(employee => employee.id === id) || null;
  }

  /**
   * Get employee by employee ID
   */
  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null> {
    const db = this.loadDatabase();
    return db.employees.find(employee => employee.employee_id === employeeId) || null;
  }

  /**
   * Get all employees with optional filtering
   */
  async getAllEmployees(filters?: {
    department?: string;
    status?: string;
    search?: string;
  }): Promise<Employee[]> {
    const db = this.loadDatabase();
    let employees = db.employees;

    if (filters?.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    if (filters?.status) {
      employees = employees.filter(emp => emp.status === filters.status);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      employees = employees.filter(emp => 
        emp.first_name.toLowerCase().includes(searchTerm) ||
        emp.last_name.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.employee_id.toLowerCase().includes(searchTerm)
      );
    }

    return employees.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Update employee
   */
  async updateEmployee(id: number, updates: Partial<Employee>): Promise<Employee | null> {
    const db = this.loadDatabase();
    const employeeIndex = db.employees.findIndex(employee => employee.id === id);
    
    if (employeeIndex === -1) return null;

    db.employees[employeeIndex] = {
      ...db.employees[employeeIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveDatabase();
    return db.employees[employeeIndex];
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: number): Promise<boolean> {
    const db = this.loadDatabase();
    const employeeIndex = db.employees.findIndex(employee => employee.id === id);
    
    if (employeeIndex === -1) return false;

    db.employees.splice(employeeIndex, 1);
    this.saveDatabase();
    return true;
  }

  // ==================== TRAINING COURSE OPERATIONS ====================

  /**
   * Create a new training course
   */
  async createTrainingCourse(courseData: Omit<TrainingCourse, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingCourse> {
    const db = this.loadDatabase();
    const newCourse: TrainingCourse = {
      ...courseData,
      id: this.getNextId(db.trainingCourses),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.trainingCourses.push(newCourse);
    this.saveDatabase();
    return newCourse;
  }

  /**
   * Get training course by ID
   */
  async getTrainingCourseById(id: number): Promise<TrainingCourse | null> {
    const db = this.loadDatabase();
    return db.trainingCourses.find(course => course.id === id) || null;
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
    const db = this.loadDatabase();
    let courses = db.trainingCourses;

    if (filters?.category) {
      courses = courses.filter(course => course.category === filters.category);
    }

    if (filters?.level) {
      courses = courses.filter(course => course.level === filters.level);
    }

    if (filters?.status) {
      courses = courses.filter(course => course.status === filters.status);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm)
      );
    }

    return courses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Update training course
   */
  async updateTrainingCourse(id: number, updates: Partial<TrainingCourse>): Promise<TrainingCourse | null> {
    const db = this.loadDatabase();
    const courseIndex = db.trainingCourses.findIndex(course => course.id === id);
    
    if (courseIndex === -1) return null;

    db.trainingCourses[courseIndex] = {
      ...db.trainingCourses[courseIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveDatabase();
    return db.trainingCourses[courseIndex];
  }

  /**
   * Delete training course
   */
  async deleteTrainingCourse(id: number): Promise<boolean> {
    const db = this.loadDatabase();
    const courseIndex = db.trainingCourses.findIndex(course => course.id === id);
    
    if (courseIndex === -1) return false;

    db.trainingCourses.splice(courseIndex, 1);
    this.saveDatabase();
    return true;
  }

  // ==================== EMPLOYEE TRAINING OPERATIONS ====================

  /**
   * Enroll employee in training course
   */
  async enrollEmployeeInTraining(enrollmentData: Omit<EmployeeTraining, 'id' | 'created_at'>): Promise<EmployeeTraining> {
    const db = this.loadDatabase();
    const newEnrollment: EmployeeTraining = {
      ...enrollmentData,
      id: this.getNextId(db.employeeTrainings),
      created_at: new Date().toISOString()
    };

    db.employeeTrainings.push(newEnrollment);
    this.saveDatabase();
    return newEnrollment;
  }

  /**
   * Get employee training by ID
   */
  async getEmployeeTrainingById(id: number): Promise<EmployeeTraining | null> {
    const db = this.loadDatabase();
    return db.employeeTrainings.find(enrollment => enrollment.id === id) || null;
  }

  /**
   * Get employee training enrollments
   */
  async getEmployeeTrainings(filters?: {
    employee_id?: number;
    course_id?: number;
    status?: string;
  }): Promise<EmployeeTraining[]> {
    const db = this.loadDatabase();
    let enrollments = db.employeeTrainings;

    if (filters?.employee_id) {
      enrollments = enrollments.filter(enrollment => enrollment.employee_id === filters.employee_id);
    }

    if (filters?.course_id) {
      enrollments = enrollments.filter(enrollment => enrollment.course_id === filters.course_id);
    }

    if (filters?.status) {
      enrollments = enrollments.filter(enrollment => enrollment.status === filters.status);
    }

    return enrollments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Update employee training progress
   */
  async updateEmployeeTraining(id: number, updates: Partial<EmployeeTraining>): Promise<EmployeeTraining | null> {
    const db = this.loadDatabase();
    const enrollmentIndex = db.employeeTrainings.findIndex(enrollment => enrollment.id === id);
    
    if (enrollmentIndex === -1) return null;

    db.employeeTrainings[enrollmentIndex] = {
      ...db.employeeTrainings[enrollmentIndex],
      ...updates
    };

    this.saveDatabase();
    return db.employeeTrainings[enrollmentIndex];
  }

  /**
   * Delete employee training enrollment
   */
  async deleteEmployeeTraining(id: number): Promise<boolean> {
    const db = this.loadDatabase();
    const enrollmentIndex = db.employeeTrainings.findIndex(enrollment => enrollment.id === id);
    
    if (enrollmentIndex === -1) return false;

    db.employeeTrainings.splice(enrollmentIndex, 1);
    this.saveDatabase();
    return true;
  }

  // ==================== LEAVE REQUEST OPERATIONS ====================

  /**
   * Create leave request
   */
  async createLeaveRequest(requestData: Omit<LeaveRequest, 'id' | 'created_at'>): Promise<LeaveRequest> {
    const db = this.loadDatabase();
    const newRequest: LeaveRequest = {
      ...requestData,
      id: this.getNextId(db.leaveRequests),
      created_at: new Date().toISOString()
    };

    db.leaveRequests.push(newRequest);
    this.saveDatabase();
    return newRequest;
  }

  /**
   * Get leave request by ID
   */
  async getLeaveRequestById(id: number): Promise<LeaveRequest | null> {
    const db = this.loadDatabase();
    return db.leaveRequests.find(request => request.id === id) || null;
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
    const db = this.loadDatabase();
    let requests = db.leaveRequests;

    if (filters?.employee_id) {
      requests = requests.filter(request => request.employee_id === filters.employee_id);
    }

    if (filters?.type) {
      requests = requests.filter(request => request.type === filters.type);
    }

    if (filters?.status) {
      requests = requests.filter(request => request.status === filters.status);
    }

    if (filters?.start_date) {
      requests = requests.filter(request => request.start_date >= filters.start_date!);
    }

    if (filters?.end_date) {
      requests = requests.filter(request => request.end_date <= filters.end_date!);
    }

    return requests.sort((a, b) => new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime());
  }

  /**
   * Update leave request
   */
  async updateLeaveRequest(id: number, updates: Partial<LeaveRequest>): Promise<LeaveRequest | null> {
    const db = this.loadDatabase();
    const requestIndex = db.leaveRequests.findIndex(request => request.id === id);
    
    if (requestIndex === -1) return null;

    db.leaveRequests[requestIndex] = {
      ...db.leaveRequests[requestIndex],
      ...updates
    };

    this.saveDatabase();
    return db.leaveRequests[requestIndex];
  }

  /**
   * Delete leave request
   */
  async deleteLeaveRequest(id: number): Promise<boolean> {
    const db = this.loadDatabase();
    const requestIndex = db.leaveRequests.findIndex(request => request.id === id);
    
    if (requestIndex === -1) return false;

    db.leaveRequests.splice(requestIndex, 1);
    this.saveDatabase();
    return true;
  }

  // ==================== PAYSLIP OPERATIONS ====================

  /**
   * Create payslip
   */
  async createPayslip(payslipData: Omit<Payslip, 'id' | 'created_at'>): Promise<Payslip> {
    const db = this.loadDatabase();
    const newPayslip: Payslip = {
      ...payslipData,
      id: this.getNextId(db.payslips),
      created_at: new Date().toISOString()
    };

    db.payslips.push(newPayslip);
    this.saveDatabase();
    return newPayslip;
  }

  /**
   * Get payslip by ID
   */
  async getPayslipById(id: number): Promise<Payslip | null> {
    const db = this.loadDatabase();
    return db.payslips.find(payslip => payslip.id === id) || null;
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
    const db = this.loadDatabase();
    let payslips = db.payslips;

    if (filters?.employee_id) {
      payslips = payslips.filter(payslip => payslip.employee_id === filters.employee_id);
    }

    if (filters?.month) {
      payslips = payslips.filter(payslip => payslip.month === filters.month);
    }

    if (filters?.year) {
      payslips = payslips.filter(payslip => payslip.year === filters.year);
    }

    if (filters?.status) {
      payslips = payslips.filter(payslip => payslip.status === filters.status);
    }

    return payslips.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      return months.indexOf(b.month) - months.indexOf(a.month);
    });
  }

  /**
   * Update payslip
   */
  async updatePayslip(id: number, updates: Partial<Payslip>): Promise<Payslip | null> {
    const db = this.loadDatabase();
    const payslipIndex = db.payslips.findIndex(payslip => payslip.id === id);
    
    if (payslipIndex === -1) return null;

    db.payslips[payslipIndex] = {
      ...db.payslips[payslipIndex],
      ...updates
    };

    this.saveDatabase();
    return db.payslips[payslipIndex];
  }

  /**
   * Delete payslip
   */
  async deletePayslip(id: number): Promise<boolean> {
    const db = this.loadDatabase();
    const payslipIndex = db.payslips.findIndex(payslip => payslip.id === id);
    
    if (payslipIndex === -1) return false;

    db.payslips.splice(payslipIndex, 1);
    this.saveDatabase();
    return true;
  }

  // ==================== UTILITY OPERATIONS ====================

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
    const db = this.loadDatabase();
    
    return {
      totalEmployees: db.employees.length,
      totalCourses: db.trainingCourses.length,
      totalLeaveRequests: db.leaveRequests.length,
      totalPayslips: db.payslips.length,
      totalUsers: db.users.length
    };
  }

  /**
   * Backup database
   */
  async backupDatabase(backupPath: string): Promise<void> {
    const db = this.loadDatabase();
    fs.writeFileSync(backupPath, JSON.stringify(db, null, 2));
  }

  /**
   * Get employee dashboard data
   */
  async getEmployeeDashboardData(employeeId: number): Promise<{
    employee: Employee | null;
    leaveBalance: { type: string; total: number; used: number; remaining: number }[];
    recentLeaveRequests: LeaveRequest[];
    recentPayslips: Payslip[];
    trainingProgress: EmployeeTraining[];
  }> {
    const [employee, leaveRequests, payslips, trainings] = await Promise.all([
      this.getEmployeeById(employeeId),
      this.getLeaveRequests({ employee_id: employeeId }),
      this.getPayslips({ employee_id: employeeId }),
      this.getEmployeeTrainings({ employee_id: employeeId })
    ]);

    // Calculate leave balance
    const leaveBalance = [
      { type: 'Annual', total: 25, used: 0, remaining: 25 },
      { type: 'Sick', total: 15, used: 0, remaining: 15 },
      { type: 'Personal', total: 5, used: 0, remaining: 5 }
    ];

    // Calculate used leave
    leaveRequests.forEach(request => {
      if (request.status === 'Approved') {
        const leaveType = leaveBalance.find(lb => lb.type === request.type);
        if (leaveType) {
          leaveType.used += request.days;
          leaveType.remaining = leaveType.total - leaveType.used;
        }
      }
    });

    return {
      employee,
      leaveBalance,
      recentLeaveRequests: leaveRequests.slice(0, 5),
      recentPayslips: payslips.slice(0, 3),
      trainingProgress: trainings
    };
  }

  /**
   * Get HR dashboard data
   */
  async getHRDashboardData(): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    pendingLeaveRequests: number;
    upcomingTrainings: number;
    recentHires: Employee[];
    leaveRequestsByStatus: { status: string; count: number }[];
  }> {
    const [employees, leaveRequests, trainings] = await Promise.all([
      this.getAllEmployees(),
      this.getLeaveRequests(),
      this.getAllTrainingCourses({ status: 'Active' })
    ]);

    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'Pending').length;
    const recentHires = employees
      .filter(emp => new Date(emp.hire_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .slice(0, 5);

    const leaveRequestsByStatus = [
      { status: 'Pending', count: leaveRequests.filter(req => req.status === 'Pending').length },
      { status: 'Approved', count: leaveRequests.filter(req => req.status === 'Approved').length },
      { status: 'Rejected', count: leaveRequests.filter(req => req.status === 'Rejected').length }
    ];

    return {
      totalEmployees: employees.length,
      activeEmployees,
      pendingLeaveRequests,
      upcomingTrainings: trainings.length,
      recentHires,
      leaveRequestsByStatus
    };
  }

  /**
   * Approve leave request
   */
  async approveLeaveRequest(requestId: number, approvedBy: number, comments?: string): Promise<LeaveRequest | null> {
    return await this.updateLeaveRequest(requestId, {
      status: 'Approved',
      approved_by: approvedBy,
      approved_date: new Date().toISOString(),
      comments
    });
  }

  /**
   * Reject leave request
   */
  async rejectLeaveRequest(requestId: number, approvedBy: number, comments?: string): Promise<LeaveRequest | null> {
    return await this.updateLeaveRequest(requestId, {
      status: 'Rejected',
      approved_by: approvedBy,
      approved_date: new Date().toISOString(),
      comments
    });
  }

  /**
   * Complete training course
   */
  async completeTraining(trainingId: number, score?: number, certificate?: string): Promise<EmployeeTraining | null> {
    return await this.updateEmployeeTraining(trainingId, {
      status: 'completed',
      progress: 100,
      completion_date: new Date().toISOString(),
      score,
      certificate,
      last_accessed: new Date().toISOString()
    });
  }

  /**
   * Generate payslip
   */
  async generatePayslip(employeeId: number, month: string, year: number, grossPay: number, netPay: number): Promise<Payslip> {
    return await this.createPayslip({
      employee_id: employeeId,
      month,
      year,
      gross_pay: grossPay,
      net_pay: netPay,
      status: 'Generated',
      payment_date: new Date().toISOString()
    });
  }
}

// Export singleton instance
export const jsonDbService = new JSONDatabaseService(); 