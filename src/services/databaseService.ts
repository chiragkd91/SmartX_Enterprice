/**
 * Database Service Layer for SmartBizFlow HR Portal
 * Provides easy-to-use CRUD operations for all HR modules
 */

import database from '../lib/database.json';
import type {
  Employee,
  TrainingCourse,
  EmployeeTraining,
  LeaveRequest,
  Payslip,
  TwoFactorMethod,
  BackupCode,
  TrustedDevice,
  User
} from '../types/database';

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Initialize database connection (not needed for JSON database)
   */
  async initialize(): Promise<void> {
    // JSON database is auto-initialized
  }

  /**
   * Close database connection (not needed for JSON database)
   */
  async close(): Promise<void> {
    // JSON database doesn't need explicit closing
  }

  // ==================== USER OPERATIONS ====================

  /**
   * Create a new user
   */
  async createUser(userData: {
    username: string;
    email: string;
    password_hash: string;
    role?: string;
    is_active?: boolean;
  }): Promise<User> {
    return await database.createUser({
      ...userData,
      role: userData.role || 'employee',
      is_active: userData.is_active ?? true,
      last_login: undefined
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    return await database.getUserById(id);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return await database.getUserByEmail(email);
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    return await database.getAllUsers();
  }

  /**
   * Update user
   */
  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    return await database.updateUser(id, updates);
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<boolean> {
    return await database.deleteUser(id);
  }

  // ==================== EMPLOYEE OPERATIONS ====================

  /**
   * Create a new employee
   */
  async createEmployee(employeeData: {
    employee_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    hire_date: string;
    department: string;
    position: string;
    salary: number;
    manager_id?: number;
    status?: string;
  }): Promise<Employee> {
    return await database.createEmployee({
      ...employeeData,
      phone: employeeData.phone || '',
      date_of_birth: employeeData.date_of_birth || '',
      status: (employeeData.status as 'active' | 'inactive' | 'terminated') || 'active'
    });
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: number): Promise<Employee | null> {
    return await database.getEmployeeById(id);
  }

  /**
   * Get employee by employee ID
   */
  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null> {
    return await database.getEmployeeByEmployeeId(employeeId);
  }

  /**
   * Get all employees with optional filtering
   */
  async getAllEmployees(filters?: {
    department?: string;
    status?: string;
    search?: string;
  }): Promise<Employee[]> {
    return await database.getAllEmployees(filters);
  }

  /**
   * Update employee
   */
  async updateEmployee(id: number, updates: Partial<Employee>): Promise<Employee | null> {
    return await database.updateEmployee(id, updates);
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: number): Promise<boolean> {
    return await database.deleteEmployee(id);
  }

  // ==================== TRAINING COURSE OPERATIONS ====================

  /**
   * Create a new training course
   */
  async createTrainingCourse(courseData: {
    title: string;
    description?: string;
    category: string;
    level: string;
    duration: number;
    instructor: string;
    format: string;
    max_enrollment: number;
    current_enrollment?: number;
    status?: string;
    rating?: number;
    total_ratings?: number;
  }): Promise<TrainingCourse> {
    return await database.createTrainingCourse({
      ...courseData,
      description: courseData.description || '',
      current_enrollment: courseData.current_enrollment || 0,
      status: courseData.status || 'Draft',
      rating: courseData.rating || 0,
      total_ratings: courseData.total_ratings || 0
    });
  }

  /**
   * Get training course by ID
   */
  async getTrainingCourseById(id: number): Promise<TrainingCourse | null> {
    return await database.getTrainingCourseById(id);
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
    return await database.getAllTrainingCourses(filters);
  }

  /**
   * Update training course
   */
  async updateTrainingCourse(id: number, updates: Partial<TrainingCourse>): Promise<TrainingCourse | null> {
    return await database.updateTrainingCourse(id, updates);
  }

  /**
   * Delete training course
   */
  async deleteTrainingCourse(id: number): Promise<boolean> {
    return await database.deleteTrainingCourse(id);
  }

  // ==================== EMPLOYEE TRAINING OPERATIONS ====================

  /**
   * Enroll employee in training course
   */
  async enrollEmployeeInTraining(enrollmentData: {
    employee_id: number;
    course_id: number;
    status?: string;
    progress?: number;
    start_date: string;
    completion_date?: string;
    certificate?: string;
    score?: number;
    attempts?: number;
  }): Promise<EmployeeTraining> {
    return await database.enrollEmployeeInTraining({
      ...enrollmentData,
      status: enrollmentData.status || 'enrolled',
      progress: enrollmentData.progress || 0,
      attempts: enrollmentData.attempts || 0,
      last_accessed: new Date().toISOString()
    });
  }

  /**
   * Get employee training by ID
   */
  async getEmployeeTrainingById(id: number): Promise<EmployeeTraining | null> {
    return await database.getEmployeeTrainingById(id);
  }

  /**
   * Get employee training enrollments
   */
  async getEmployeeTrainings(filters?: {
    employee_id?: number;
    course_id?: number;
    status?: string;
  }): Promise<EmployeeTraining[]> {
    return await database.getEmployeeTrainings(filters);
  }

  /**
   * Update employee training progress
   */
  async updateEmployeeTraining(id: number, updates: Partial<EmployeeTraining>): Promise<EmployeeTraining | null> {
    return await database.updateEmployeeTraining(id, updates);
  }

  /**
   * Delete employee training enrollment
   */
  async deleteEmployeeTraining(id: number): Promise<boolean> {
    return await database.deleteEmployeeTraining(id);
  }

  // ==================== LEAVE REQUEST OPERATIONS ====================

  /**
   * Create leave request
   */
  async createLeaveRequest(requestData: {
    employee_id: number;
    type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason?: string;
    status?: string;
    submitted_date?: string;
    approved_by?: number;
    approved_date?: string;
    comments?: string;
  }): Promise<LeaveRequest> {
    return await database.createLeaveRequest({
      ...requestData,
      reason: requestData.reason || '',
      status: requestData.status || 'Pending',
      submitted_date: requestData.submitted_date || new Date().toISOString()
    });
  }

  /**
   * Get leave request by ID
   */
  async getLeaveRequestById(id: number): Promise<LeaveRequest | null> {
    return await database.getLeaveRequestById(id);
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
    return await database.getLeaveRequests(filters);
  }

  /**
   * Update leave request
   */
  async updateLeaveRequest(id: number, updates: Partial<LeaveRequest>): Promise<LeaveRequest | null> {
    return await database.updateLeaveRequest(id, updates);
  }

  /**
   * Delete leave request
   */
  async deleteLeaveRequest(id: number): Promise<boolean> {
    return await database.deleteLeaveRequest(id);
  }

  // ==================== PAYSLIP OPERATIONS ====================

  /**
   * Create payslip
   */
  async createPayslip(payslipData: {
    employee_id: number;
    month: string;
    year: number;
    gross_pay: number;
    net_pay: number;
    status?: string;
    payment_date?: string;
  }): Promise<Payslip> {
    return await database.createPayslip({
      ...payslipData,
      status: payslipData.status || 'Generated'
    });
  }

  /**
   * Get payslip by ID
   */
  async getPayslipById(id: number): Promise<Payslip | null> {
    return await database.getPayslipById(id);
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
    return await database.getPayslips(filters);
  }

  /**
   * Update payslip
   */
  async updatePayslip(id: number, updates: Partial<Payslip>): Promise<Payslip | null> {
    return await database.updatePayslip(id, updates);
  }

  /**
   * Delete payslip
   */
  async deletePayslip(id: number): Promise<boolean> {
    return await database.deletePayslip(id);
  }

  // ==================== TWO-FACTOR AUTHENTICATION OPERATIONS ====================

  /**
   * Create two-factor authentication method
   */
  async createTwoFactorMethod(methodData: {
    user_id: number;
    type: string;
    name: string;
    is_enabled?: boolean;
    is_primary?: boolean;
    device_info?: string;
    last_used?: string;
  }): Promise<TwoFactorMethod> {
    return await database.createTwoFactorMethod({
      ...methodData,
      is_enabled: methodData.is_enabled ?? false,
      is_primary: methodData.is_primary ?? false
    });
  }

  /**
   * Get two-factor authentication method by ID
   */
  async getTwoFactorMethodById(id: number): Promise<TwoFactorMethod | null> {
    return await database.getTwoFactorMethodById(id);
  }

  /**
   * Get two-factor authentication methods for user
   */
  async getTwoFactorMethodsByUserId(userId: number): Promise<TwoFactorMethod[]> {
    return await database.getTwoFactorMethodsByUserId(userId);
  }

  /**
   * Update two-factor authentication method
   */
  async updateTwoFactorMethod(id: number, updates: Partial<TwoFactorMethod>): Promise<TwoFactorMethod | null> {
    return await database.updateTwoFactorMethod(id, updates);
  }

  /**
   * Delete two-factor authentication method
   */
  async deleteTwoFactorMethod(id: number): Promise<boolean> {
    return await database.deleteTwoFactorMethod(id);
  }

  // ==================== BACKUP CODES OPERATIONS ====================

  /**
   * Create backup codes for user
   */
  async createBackupCodes(userId: number, codes: string[]): Promise<BackupCode[]> {
    return await database.createBackupCodes(userId, codes);
  }

  /**
   * Get backup code by ID
   */
  async getBackupCodeById(id: number): Promise<BackupCode | null> {
    return await database.getBackupCodeById(id);
  }

  /**
   * Get backup codes for user
   */
  async getBackupCodesByUserId(userId: number): Promise<BackupCode[]> {
    return await database.getBackupCodesByUserId(userId);
  }

  /**
   * Use backup code
   */
  async useBackupCode(userId: number, code: string): Promise<boolean> {
    return await database.useBackupCode(userId, code);
  }

  /**
   * Delete backup code
   */
  async deleteBackupCode(id: number): Promise<boolean> {
    return await database.deleteBackupCode(id);
  }

  // ==================== TRUSTED DEVICES OPERATIONS ====================

  /**
   * Create trusted device
   */
  async createTrustedDevice(deviceData: {
    user_id: number;
    name: string;
    type: string;
    browser?: string;
    os?: string;
    ip_address: string;
    location: string;
    is_trusted?: boolean;
    last_active?: string;
  }): Promise<TrustedDevice> {
    return await database.createTrustedDevice({
      ...deviceData,
      is_trusted: deviceData.is_trusted ?? false,
      last_active: deviceData.last_active || new Date().toISOString()
    });
  }

  /**
   * Get trusted device by ID
   */
  async getTrustedDeviceById(id: number): Promise<TrustedDevice | null> {
    return await database.getTrustedDeviceById(id);
  }

  /**
   * Get trusted devices for user
   */
  async getTrustedDevicesByUserId(userId: number): Promise<TrustedDevice[]> {
    return await database.getTrustedDevicesByUserId(userId);
  }

  /**
   * Update trusted device
   */
  async updateTrustedDevice(id: number, updates: Partial<TrustedDevice>): Promise<TrustedDevice | null> {
    return await database.updateTrustedDevice(id, updates);
  }

  /**
   * Delete trusted device
   */
  async deleteTrustedDevice(id: number): Promise<boolean> {
    return await database.deleteTrustedDevice(id);
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
    return await database.getDatabaseStats();
  }

  /**
   * Backup database
   */
  async backupDatabase(backupPath: string): Promise<void> {
    await database.backupDatabase(backupPath);
  }

  /**
   * Execute raw SQL query
   */
  async executeQuery(sql: string, params: any[] = []): Promise<any[]> {
    return await database.executeQuery(sql, params);
  }

  // ==================== BUSINESS LOGIC OPERATIONS ====================

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
      status: 'Generated'
    });
  }
}

// Export singleton instance
export const dbService = DatabaseService.getInstance(); 