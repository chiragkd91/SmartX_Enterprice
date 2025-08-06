/**
 * SmartBizFlow - JSON Database Service
 * Provides database functionality using JSON files instead of SQLite
 */

import fs from 'fs';
import path from 'path';
import { 
  User, 
  Employee, 
  TrainingCourse, 
  EmployeeTraining, 
  LeaveRequest, 
  Payslip, 
  TwoFactorMethod, 
  BackupCode, 
  TrustedDevice 
} from '../types/database';

interface DatabaseData {
  users: User[];
  employees: Employee[];
  trainingCourses: TrainingCourse[];
  employeeTrainings: EmployeeTraining[];
  leaveRequests: LeaveRequest[];
  payslips: Payslip[];
  twoFactorMethods: TwoFactorMethod[];
  backupCodes: BackupCode[];
  trustedDevices: TrustedDevice[];
}

class JSONDatabase {
  private dbPath: string;
  private data: DatabaseData;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'smartbizflow-db.json');
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseData {
    try {
      if (fs.existsSync(this.dbPath)) {
        const fileContent = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }

    // Return default empty database structure
    return {
      users: [],
      employees: [],
      trainingCourses: [],
      employeeTrainings: [],
      leaveRequests: [],
      payslips: [],
      twoFactorMethods: [],
      backupCodes: [],
      trustedDevices: []
    };
  }

  private saveDatabase(): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  private generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // User operations
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.users.push(user);
    this.saveDatabase();
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    return this.data.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.data.users.find(user => user.email === email) || null;
  }

  async getAllUsers(): Promise<User[]> {
    return this.data.users;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.users[userIndex];
  }

  async deleteUser(id: number): Promise<boolean> {
    const userIndex = this.data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.data.users.splice(userIndex, 1);
    this.saveDatabase();
    return true;
  }

  // Employee operations
  async createEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    const employee: Employee = {
      id: this.generateId(),
      ...employeeData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.employees.push(employee);
    this.saveDatabase();
    return employee;
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    return this.data.employees.find(employee => employee.id === id) || null;
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null> {
    return this.data.employees.find(employee => employee.employee_id === employeeId) || null;
  }

  async getAllEmployees(filters?: {
    department?: string;
    status?: string;
    search?: string;
  }): Promise<Employee[]> {
    let employees = this.data.employees;

    if (filters?.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    if (filters?.status) {
      employees = employees.filter(emp => emp.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      employees = employees.filter(emp => 
        emp.first_name.toLowerCase().includes(searchLower) ||
        emp.last_name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.employee_id.toLowerCase().includes(searchLower)
      );
    }

    return employees;
  }

  async updateEmployee(id: number, updates: Partial<Employee>): Promise<Employee | null> {
    const employeeIndex = this.data.employees.findIndex(employee => employee.id === id);
    if (employeeIndex === -1) return null;

    this.data.employees[employeeIndex] = {
      ...this.data.employees[employeeIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.employees[employeeIndex];
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const employeeIndex = this.data.employees.findIndex(employee => employee.id === id);
    if (employeeIndex === -1) return false;

    this.data.employees.splice(employeeIndex, 1);
    this.saveDatabase();
    return true;
  }

  // Training Course operations
  async createTrainingCourse(courseData: Omit<TrainingCourse, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingCourse> {
    const course: TrainingCourse = {
      id: this.generateId(),
      ...courseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.trainingCourses.push(course);
    this.saveDatabase();
    return course;
  }

  async getTrainingCourseById(id: number): Promise<TrainingCourse | null> {
    return this.data.trainingCourses.find(course => course.id === id) || null;
  }

  async getAllTrainingCourses(filters?: {
    category?: string;
    level?: string;
    status?: string;
    search?: string;
  }): Promise<TrainingCourse[]> {
    let courses = this.data.trainingCourses;

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
      const searchLower = filters.search.toLowerCase();
      courses = courses.filter(course => 
        (course.title?.toLowerCase() || '').includes(searchLower) ||
        (course.description?.toLowerCase() || '').includes(searchLower) ||
        (course.instructor?.toLowerCase() || '').includes(searchLower)
      );
    }

    return courses;
  }

  async updateTrainingCourse(id: number, updates: Partial<TrainingCourse>): Promise<TrainingCourse | null> {
    const courseIndex = this.data.trainingCourses.findIndex(course => course.id === id);
    if (courseIndex === -1) return null;

    this.data.trainingCourses[courseIndex] = {
      ...this.data.trainingCourses[courseIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.trainingCourses[courseIndex];
  }

  async deleteTrainingCourse(id: number): Promise<boolean> {
    const courseIndex = this.data.trainingCourses.findIndex(course => course.id === id);
    if (courseIndex === -1) return false;

    this.data.trainingCourses.splice(courseIndex, 1);
    this.saveDatabase();
    return true;
  }

  // Employee Training operations
  async createEmployeeTraining(trainingData: Omit<EmployeeTraining, 'id' | 'created_at' | 'updated_at'>): Promise<EmployeeTraining> {
    const training: EmployeeTraining = {
      id: this.generateId(),
      ...trainingData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.employeeTrainings.push(training);
    this.saveDatabase();
    return training;
  }

  async getEmployeeTrainingById(id: number): Promise<EmployeeTraining | null> {
    return this.data.employeeTrainings.find(training => training.id === id) || null;
  }

  async getEmployeeTrainings(filters?: {
    employee_id?: number;
    course_id?: number;
    status?: string;
  }): Promise<EmployeeTraining[]> {
    let trainings = this.data.employeeTrainings;

    if (filters?.employee_id) {
      trainings = trainings.filter(training => training.employee_id === filters.employee_id);
    }

    if (filters?.course_id) {
      trainings = trainings.filter(training => training.course_id === filters.course_id);
    }

    if (filters?.status) {
      trainings = trainings.filter(training => training.status === filters.status);
    }

    return trainings;
  }

  async updateEmployeeTraining(id: number, updates: Partial<EmployeeTraining>): Promise<EmployeeTraining | null> {
    const trainingIndex = this.data.employeeTrainings.findIndex(training => training.id === id);
    if (trainingIndex === -1) return null;

    this.data.employeeTrainings[trainingIndex] = {
      ...this.data.employeeTrainings[trainingIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.employeeTrainings[trainingIndex];
  }

  async deleteEmployeeTraining(id: number): Promise<boolean> {
    const trainingIndex = this.data.employeeTrainings.findIndex(training => training.id === id);
    if (trainingIndex === -1) return false;

    this.data.employeeTrainings.splice(trainingIndex, 1);
    this.saveDatabase();
    return true;
  }

  // Leave Request operations
  async createLeaveRequest(requestData: Omit<LeaveRequest, 'id' | 'created_at'>): Promise<LeaveRequest> {
    const request: LeaveRequest = {
      id: this.generateId(),
      ...requestData,
      created_at: new Date().toISOString()
    };
    this.data.leaveRequests.push(request);
    this.saveDatabase();
    return request;
  }

  async getLeaveRequestById(id: number): Promise<LeaveRequest | null> {
    return this.data.leaveRequests.find(request => request.id === id) || null;
  }

  async getLeaveRequests(filters?: {
    employee_id?: number;
    type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<LeaveRequest[]> {
    let requests = this.data.leaveRequests;

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

    return requests;
  }

  async updateLeaveRequest(id: number, updates: Partial<LeaveRequest>): Promise<LeaveRequest | null> {
    const requestIndex = this.data.leaveRequests.findIndex(request => request.id === id);
    if (requestIndex === -1) return null;

    this.data.leaveRequests[requestIndex] = {
      ...this.data.leaveRequests[requestIndex],
      ...updates
    };
    this.saveDatabase();
    return this.data.leaveRequests[requestIndex];
  }

  async deleteLeaveRequest(id: number): Promise<boolean> {
    const requestIndex = this.data.leaveRequests.findIndex(request => request.id === id);
    if (requestIndex === -1) return false;

    this.data.leaveRequests.splice(requestIndex, 1);
    this.saveDatabase();
    return true;
  }

  // Payslip operations
  async createPayslip(payslipData: Omit<Payslip, 'id' | 'created_at' | 'updated_at'>): Promise<Payslip> {
    const payslip: Payslip = {
      id: this.generateId(),
      ...payslipData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.payslips.push(payslip);
    this.saveDatabase();
    return payslip;
  }

  async getPayslipById(id: number): Promise<Payslip | null> {
    return this.data.payslips.find(payslip => payslip.id === id) || null;
  }

  async getPayslips(filters?: {
    employee_id?: number;
    month?: string;
    year?: number;
    status?: string;
  }): Promise<Payslip[]> {
    let payslips = this.data.payslips;

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

    return payslips;
  }

  async updatePayslip(id: number, updates: Partial<Payslip>): Promise<Payslip | null> {
    const payslipIndex = this.data.payslips.findIndex(payslip => payslip.id === id);
    if (payslipIndex === -1) return null;

    this.data.payslips[payslipIndex] = {
      ...this.data.payslips[payslipIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.payslips[payslipIndex];
  }

  async deletePayslip(id: number): Promise<boolean> {
    const payslipIndex = this.data.payslips.findIndex(payslip => payslip.id === id);
    if (payslipIndex === -1) return false;

    this.data.payslips.splice(payslipIndex, 1);
    this.saveDatabase();
    return true;
  }

  // Two Factor Method operations
  async createTwoFactorMethod(methodData: Omit<TwoFactorMethod, 'id' | 'created_at' | 'updated_at'>): Promise<TwoFactorMethod> {
    const method: TwoFactorMethod = {
      id: this.generateId(),
      ...methodData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.twoFactorMethods.push(method);
    this.saveDatabase();
    return method;
  }

  async getTwoFactorMethodById(id: number): Promise<TwoFactorMethod | null> {
    return this.data.twoFactorMethods.find(method => method.id === id) || null;
  }

  async getTwoFactorMethodsByUserId(userId: number): Promise<TwoFactorMethod[]> {
    return this.data.twoFactorMethods.filter(method => method.user_id === userId);
  }

  async updateTwoFactorMethod(id: number, updates: Partial<TwoFactorMethod>): Promise<TwoFactorMethod | null> {
    const methodIndex = this.data.twoFactorMethods.findIndex(method => method.id === id);
    if (methodIndex === -1) return null;

    this.data.twoFactorMethods[methodIndex] = {
      ...this.data.twoFactorMethods[methodIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.twoFactorMethods[methodIndex];
  }

  async deleteTwoFactorMethod(id: number): Promise<boolean> {
    const methodIndex = this.data.twoFactorMethods.findIndex(method => method.id === id);
    if (methodIndex === -1) return false;

    this.data.twoFactorMethods.splice(methodIndex, 1);
    this.saveDatabase();
    return true;
  }

  // Backup Code operations
  async createBackupCodes(userId: number, codes: string[]): Promise<BackupCode[]> {
    const backupCodes: BackupCode[] = codes.map(code => ({
      id: Date.now() + Math.random(),
      user_id: userId,
      code,
      is_used: false,
      used: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    this.data.backupCodes.push(...backupCodes);
    this.saveDatabase();
    return backupCodes;
  }

  async getBackupCodeById(id: number): Promise<BackupCode | null> {
    return this.data.backupCodes.find(code => code.id === id) || null;
  }

  async getBackupCodesByUserId(userId: number): Promise<BackupCode[]> {
    return this.data.backupCodes.filter(code => code.user_id === userId && !code.is_used);
  }

  async useBackupCode(userId: number, code: string): Promise<boolean> {
    const backupCode = this.data.backupCodes.find(
      bc => bc.user_id === userId && bc.code === code && !bc.is_used
    );
    if (!backupCode) return false;

    backupCode.is_used = true;
    this.saveDatabase();
    return true;
  }

  async deleteBackupCode(id: number): Promise<boolean> {
    const codeIndex = this.data.backupCodes.findIndex(code => code.id === id);
    if (codeIndex === -1) return false;

    this.data.backupCodes.splice(codeIndex, 1);
    this.saveDatabase();
    return true;
  }

  // Trusted Device operations
  async createTrustedDevice(deviceData: Omit<TrustedDevice, 'id' | 'created_at' | 'updated_at'>): Promise<TrustedDevice> {
    const device: TrustedDevice = {
      id: this.generateId(),
      ...deviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.trustedDevices.push(device);
    this.saveDatabase();
    return device;
  }

  async getTrustedDeviceById(id: number): Promise<TrustedDevice | null> {
    return this.data.trustedDevices.find(device => device.id === id) || null;
  }

  async getTrustedDevicesByUserId(userId: number): Promise<TrustedDevice[]> {
    return this.data.trustedDevices.filter(device => device.user_id === userId);
  }

  async updateTrustedDevice(id: number, updates: Partial<TrustedDevice>): Promise<TrustedDevice | null> {
    const deviceIndex = this.data.trustedDevices.findIndex(device => device.id === id);
    if (deviceIndex === -1) return null;

    this.data.trustedDevices[deviceIndex] = {
      ...this.data.trustedDevices[deviceIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.trustedDevices[deviceIndex];
  }

  async deleteTrustedDevice(id: number): Promise<boolean> {
    const deviceIndex = this.data.trustedDevices.findIndex(device => device.id === id);
    if (deviceIndex === -1) return false;

    this.data.trustedDevices.splice(deviceIndex, 1);
    this.saveDatabase();
    return true;
  }

  // Database statistics
  async getDatabaseStats(): Promise<{
    totalEmployees: number;
    totalCourses: number;
    totalLeaveRequests: number;
    totalPayslips: number;
    totalUsers: number;
  }> {
    return {
      totalEmployees: this.data.employees.length,
      totalCourses: this.data.trainingCourses.length,
      totalLeaveRequests: this.data.leaveRequests.length,
      totalPayslips: this.data.payslips.length,
      totalUsers: this.data.users.length
    };
  }

  // Backup database
  async backupDatabase(backupPath: string): Promise<void> {
    try {
      const backupData = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(backupPath, backupData);
    } catch (error) {
      console.error('Error backing up database:', error);
      throw error;
    }
  }

  // Execute custom query (simplified for JSON)
  async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    // This is a simplified implementation for JSON database
    // In a real scenario, you might want to implement a query parser
    console.log('Query executed:', query, 'with params:', params);
    return [];
  }
}

// Export singleton instance
export const database = new JSONDatabase();
export default database; 