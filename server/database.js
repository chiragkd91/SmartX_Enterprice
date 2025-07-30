/**
 * SmartBizFlow HR Portal - Database Service
 * JSON file-based database implementation for local development
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseService {
  constructor() {
    this.dataPath = path.join(__dirname, '..', 'data', 'hrms.json');
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

  async initialize() {
    try {
      const dataDir = path.dirname(this.dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

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

  saveData() {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  async seedData() {
    // Create admin user
    const adminPassword = await bcrypt.hash('password123', 12);
    const adminUser = {
      id: 'admin-001',
      email: 'admin@smartbizflow.com',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const adminEmployee = {
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
    const hrPassword = await bcrypt.hash('password123', 12);
    const hrUser = {
      id: 'hr-001',
      email: 'hr@smartbizflow.com',
      password: hrPassword,
      role: 'HR_MANAGER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const hrEmployee = {
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

    const sampleUsers = [];
    const sampleEmployeesData = [];

    for (const emp of sampleEmployees) {
      const password = await bcrypt.hash('password123', 12);
      const user = {
        id: emp.id,
        email: emp.email,
        password,
        role: 'EMPLOYEE',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const employee = {
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
    const trainingCourses = [
      {
        id: 'course-001',
        title: 'Leadership Skills',
        description: 'Essential leadership skills for managers',
        category: 'Management',
        level: 'Intermediate',
        duration: 8,
        instructor: 'Dr. Sarah Johnson',
        format: 'Online',
        maxEnrollment: 20,
        currentEnrollment: 15,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'course-002',
        title: 'Project Management',
        description: 'Project management fundamentals',
        category: 'Business',
        level: 'Beginner',
        duration: 6,
        instructor: 'Mike Wilson',
        format: 'Hybrid',
        maxEnrollment: 25,
        currentEnrollment: 18,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Create sample benefits
    const benefits = [
      {
        id: 'benefit-001',
        name: 'Health Insurance',
        description: 'Comprehensive health coverage',
        type: 'HEALTH_INSURANCE',
        cost: 500,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'benefit-002',
        name: 'Dental Insurance',
        description: 'Dental care coverage',
        type: 'DENTAL_INSURANCE',
        cost: 200,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Populate data
    this.data.users = [adminUser, hrUser, ...sampleUsers];
    this.data.employees = [adminEmployee, hrEmployee, ...sampleEmployeesData];
    this.data.trainingCourses = trainingCourses;
    this.data.benefits = benefits;
  }

  async getUserByEmail(email) {
    return this.data.users.find(user => user.email === email) || null;
  }

  async getUserById(id) {
    return this.data.users.find(user => user.id === id) || null;
  }

  async getUsers(options = {}) {
    const { limit = 50, offset = 0, role, status, search } = options;
    let filtered = [...this.data.users];
    
    // Filter by role
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }
    
    // Filter by status (active/inactive)
    if (status !== undefined) {
      const isActive = status === 'active';
      filtered = filtered.filter(user => user.isActive === isActive);
    }
    
    // Search by email
    if (search) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    return filtered.slice(offset, offset + limit);
  }

  async createUser(user) {
    const newUser = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  async updateUser(id, updates) {
    const userIndex = this.data.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    
    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveData();
    return this.data.users[userIndex];
  }

  async deleteUser(id) {
    const userIndex = this.data.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    
    this.data.users.splice(userIndex, 1);
    this.saveData();
    return true;
  }

  async getEmployees(limit = 10, offset = 0) {
    return this.data.employees.slice(offset, offset + limit);
  }

  async getEmployeeById(id) {
    return this.data.employees.find(emp => emp.id === id) || null;
  }

  async createEmployee(employee) {
    const newEmployee = {
      ...employee,
      id: `emp-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.employees.push(newEmployee);
    this.saveData();
    return newEmployee;
  }

  async getAttendance(employeeId, startDate, endDate) {
    let filtered = this.data.attendance;
    
    if (employeeId) {
      filtered = filtered.filter(att => att.employeeId === employeeId);
    }
    
    if (startDate) {
      filtered = filtered.filter(att => new Date(att.date) >= new Date(startDate));
    }
    
    if (endDate) {
      filtered = filtered.filter(att => new Date(att.date) <= new Date(endDate));
    }
    
    return filtered;
  }

  async createAttendance(attendance) {
    const newAttendance = {
      ...attendance,
      id: `att-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.attendance.push(newAttendance);
    this.saveData();
    return newAttendance;
  }

  async getDashboardStats() {
    const totalEmployees = this.data.employees.length;
    const activeEmployees = this.data.employees.filter(emp => emp.status === 'ACTIVE').length;
    const totalUsers = this.data.users.length;
    const activeUsers = this.data.users.filter(user => user.isActive).length;
    
    const today = new Date();
    const todayAttendance = this.data.attendance.filter(att => {
      const attDate = new Date(att.date);
      return attDate.toDateString() === today.toDateString();
    });
    
    const pendingLeaves = this.data.leaves.filter(leave => leave.status === 'PENDING').length;
    
    return {
      totalEmployees,
      activeEmployees,
      totalUsers,
      activeUsers,
      todayAttendance: todayAttendance.length,
      pendingLeaves,
      totalTrainingCourses: this.data.trainingCourses.length,
      totalBenefits: this.data.benefits.length
    };
  }

  async logAudit(audit) {
    const newAudit = {
      ...audit,
      id: `audit-${Date.now()}`,
      createdAt: new Date()
    };
    this.data.auditLogs.push(newAudit);
    this.saveData();
  }

  async getTrainingCourses() {
    return this.data.trainingCourses;
  }

  async getEmployeeTraining(employeeId) {
    return this.data.employeeTraining.filter(et => et.employeeId === employeeId);
  }

  async getBenefits() {
    return this.data.benefits;
  }

  async getEmployeeBenefits(employeeId) {
    return this.data.employeeBenefits.filter(eb => eb.employeeId === employeeId);
  }

  async getLeaves(employeeId) {
    if (employeeId) {
      return this.data.leaves.filter(leave => leave.employeeId === employeeId);
    }
    return this.data.leaves;
  }

  async createLeave(leave) {
    const newLeave = {
      ...leave,
      id: `leave-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.leaves.push(newLeave);
    this.saveData();
    return newLeave;
  }

  async updateUserPassword(userId, hashedPassword) {
    const userIndex = this.data.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.data.users[userIndex].password = hashedPassword;
      this.data.users[userIndex].updatedAt = new Date();
      this.saveData();
      return this.data.users[userIndex];
    }
    throw new Error('User not found');
  }

  async close() {
    this.saveData();
    console.log('Database connection closed');
  }
}

const dbService = new DatabaseService();
export default dbService; 