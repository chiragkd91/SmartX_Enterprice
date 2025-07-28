/**
 * SmartBizFlow HR Portal - Database Service
 * JSON file-based database implementation for local development
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'HR_MANAGER' | 'MANAGER' | 'EMPLOYEE';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  emergencyContacts?: string;
  department: string;
  position: string;
  hireDate: Date;
  managerId?: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'SUSPENDED';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  totalHours?: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'WORK_FROM_HOME';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Leave {
  id: string;
  employeeId: string;
  type: 'ANNUAL' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'BEREAVEMENT' | 'UNPAID';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'PENDING' | 'PROCESSED' | 'PAID' | 'CANCELLED';
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  instructor?: string;
  format: string;
  maxEnrollment?: number;
  currentEnrollment: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  materials?: string;
  prerequisites?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeTraining {
  id: string;
  employeeId: string;
  courseId: string;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'DROPPED';
  progress: number;
  startDate?: Date;
  completionDate?: Date;
  certificate?: string;
  score?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Benefit {
  id: string;
  name: string;
  description?: string;
  type: 'HEALTH_INSURANCE' | 'LIFE_INSURANCE' | 'DENTAL_INSURANCE' | 'VISION_INSURANCE' | 'RETIREMENT' | 'TRANSPORT' | 'MEAL' | 'OTHER';
  cost: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeBenefit {
  id: string;
  employeeId: string;
  benefitId: string;
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  table: string;
  recordId?: string;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

interface DatabaseData {
  users: User[];
  employees: Employee[];
  attendance: Attendance[];
  leaves: Leave[];
  payroll: Payroll[];
  trainingCourses: TrainingCourse[];
  employeeTraining: EmployeeTraining[];
  benefits: Benefit[];
  employeeBenefits: EmployeeBenefit[];
  auditLogs: AuditLog[];
}

class DatabaseService {
  private dataPath: string;
  private data: DatabaseData;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'hrms.json');
    this.data = {
      users: [],
      employees: [],
      attendance: [],
      leaves: [],
      payroll: [],
      trainingCourses: [],
      employeeTraining: [],
      benefits: [],
      employeeBenefits: [],
      auditLogs: []
    };
  }

  async initialize(): Promise<void> {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Load existing data or create new
      if (fs.existsSync(this.dataPath)) {
        const fileData = fs.readFileSync(this.dataPath, 'utf8');
        this.data = JSON.parse(fileData);
        console.log('✅ Database loaded from file');
      } else {
        await this.seedData();
        this.saveData();
        console.log('✅ Database initialized with sample data');
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  private async seedData(): Promise<void> {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser: User = {
      id: 'admin-001',
      email: 'admin@smartbizflow.com',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const adminEmployee: Employee = {
      id: 'admin-001',
      employeeId: 'EMP001',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@smartbizflow.com',
      department: 'IT',
      position: 'System Administrator',
      hireDate: new Date('2024-01-01'),
      salary: 75000,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create HR Manager
    const hrPassword = await bcrypt.hash('hr123', 12);
    const hrUser: User = {
      id: 'hr-001',
      email: 'hr@smartbizflow.com',
      password: hrPassword,
      role: 'HR_MANAGER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const hrEmployee: Employee = {
      id: 'hr-001',
      employeeId: 'EMP002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'hr@smartbizflow.com',
      department: 'Human Resources',
      position: 'HR Manager',
      hireDate: new Date('2024-01-15'),
      salary: 65000,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create sample employees
    const sampleEmployees = [
      {
        id: 'emp-001',
        employeeId: 'EMP003',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@smartbizflow.com',
        department: 'Engineering',
        position: 'Senior Developer',
        salary: 55000
      },
      {
        id: 'emp-002',
        employeeId: 'EMP004',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@smartbizflow.com',
        department: 'Marketing',
        position: 'Marketing Manager',
        salary: 60000
      },
      {
        id: 'emp-003',
        employeeId: 'EMP005',
        firstName: 'Mike',
        lastName: 'Wilson',
        email: 'mike.wilson@smartbizflow.com',
        department: 'Sales',
        position: 'Sales Executive',
        salary: 45000
      }
    ];

    const sampleUsers: User[] = [];
    const sampleEmployeesData: Employee[] = [];

    for (const emp of sampleEmployees) {
      const password = await bcrypt.hash('employee123', 12);
      const user: User = {
        id: emp.id,
        email: emp.email,
        password,
        role: 'EMPLOYEE',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const employee: Employee = {
        id: emp.id,
        employeeId: emp.employeeId,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        department: emp.department,
        position: emp.position,
        hireDate: new Date('2024-02-01'),
        salary: emp.salary,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      sampleUsers.push(user);
      sampleEmployeesData.push(employee);
    }

    // Create sample training courses
    const courses: TrainingCourse[] = [
      {
        id: 'course-001',
        title: 'React Fundamentals',
        description: 'Learn the basics of React development',
        category: 'Technical',
        level: 'Beginner',
        duration: 16,
        instructor: 'John Doe',
        format: 'Online',
        currentEnrollment: 0,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'course-002',
        title: 'Leadership Skills',
        description: 'Develop essential leadership and management skills',
        category: 'Leadership',
        level: 'Intermediate',
        duration: 24,
        instructor: 'Sarah Johnson',
        format: 'In-Person',
        currentEnrollment: 0,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Create sample benefits
    const benefits: Benefit[] = [
      {
        id: 'benefit-001',
        name: 'Health Insurance',
        description: 'Comprehensive health insurance coverage',
        type: 'HEALTH_INSURANCE',
        cost: 5000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'benefit-002',
        name: 'Transport Allowance',
        description: 'Monthly transport allowance',
        type: 'TRANSPORT',
        cost: 3000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize data
    this.data.users = [adminUser, hrUser, ...sampleUsers];
    this.data.employees = [adminEmployee, hrEmployee, ...sampleEmployeesData];
    this.data.trainingCourses = courses;
    this.data.benefits = benefits;
  }

  // User methods
  async getUserByEmail(email: string): Promise<User | null> {
    return this.data.users.find(user => user.email === email) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.data.users.find(user => user.id === id) || null;
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const newUser: User = { id, ...user, createdAt: now, updatedAt: now };
    
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  // Employee methods
  async getEmployees(limit = 10, offset = 0): Promise<Employee[]> {
    return this.data.employees
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    return this.data.employees.find(emp => emp.id === id) || null;
  }

  async createEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    const id = `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const newEmployee: Employee = { id, ...employee, createdAt: now, updatedAt: now };
    
    this.data.employees.push(newEmployee);
    this.saveData();
    return newEmployee;
  }

  // Attendance methods
  async getAttendance(employeeId?: string, startDate?: Date, endDate?: Date): Promise<Attendance[]> {
    let filtered = this.data.attendance;
    
    if (employeeId) {
      filtered = filtered.filter(att => att.employeeId === employeeId);
    }
    
    if (startDate && endDate) {
      filtered = filtered.filter(att => {
        const attDate = new Date(att.date);
        return attDate >= startDate && attDate <= endDate;
      });
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createAttendance(attendance: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attendance> {
    const id = `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const newAttendance: Attendance = { id, ...attendance, createdAt: now, updatedAt: now };
    
    this.data.attendance.push(newAttendance);
    this.saveData();
    return newAttendance;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<any> {
    const totalEmployees = this.data.employees.filter(emp => emp.status === 'ACTIVE').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const presentToday = this.data.attendance.filter(att => {
      const attDate = new Date(att.date);
      return attDate >= today && att.status === 'PRESENT';
    }).length;
    
    const pendingLeaves = this.data.leaves.filter(leave => leave.status === 'PENDING').length;
    const activeTrainings = this.data.employeeTraining.filter(training => training.status === 'IN_PROGRESS').length;
    
    return {
      totalEmployees,
      presentToday,
      pendingLeaves,
      activeTrainings
    };
  }

  // Audit logging
  async logAudit(audit: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const newAudit: AuditLog = { id, ...audit, createdAt: now };
    
    this.data.auditLogs.push(newAudit);
    this.saveData();
  }

  // Training methods
  async getTrainingCourses(): Promise<TrainingCourse[]> {
    return this.data.trainingCourses.filter(course => course.status === 'ACTIVE');
  }

  async getEmployeeTraining(employeeId: string): Promise<EmployeeTraining[]> {
    return this.data.employeeTraining.filter(training => training.employeeId === employeeId);
  }

  // Benefits methods
  async getBenefits(): Promise<Benefit[]> {
    return this.data.benefits.filter(benefit => benefit.isActive);
  }

  async getEmployeeBenefits(employeeId: string): Promise<EmployeeBenefit[]> {
    return this.data.employeeBenefits.filter(benefit => benefit.employeeId === employeeId);
  }

  // Leave methods
  async getLeaves(employeeId?: string): Promise<Leave[]> {
    let filtered = this.data.leaves;
    if (employeeId) {
      filtered = filtered.filter(leave => leave.employeeId === employeeId);
    }
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createLeave(leave: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>): Promise<Leave> {
    const id = `leave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const newLeave: Leave = { id, ...leave, createdAt: now, updatedAt: now };
    
    this.data.leaves.push(newLeave);
    this.saveData();
    return newLeave;
  }

  async close(): Promise<void> {
    this.saveData();
  }
}

// Create singleton instance
const dbService = new DatabaseService();

export default dbService;
