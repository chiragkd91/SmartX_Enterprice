/**
 * Database Seeder for SmartBizFlow HR Portal
 * Populates the database with sample data for testing and demonstration
 */

import { dbService } from '../services/databaseService';
import bcrypt from 'bcryptjs';

interface SeedData {
  users: any[];
  employees: any[];
  trainingCourses: any[];
  leaveRequests: any[];
  payslips: any[];
}

const seedData: SeedData = {
  users: [
    {
      username: 'admin',
      email: 'admin@smartbizflow.com',
      password_hash: '',
      role: 'admin',
      is_active: true
    },
    {
      username: 'hr_manager',
      email: 'hr@smartbizflow.com',
      password_hash: '',
      role: 'hr_manager',
      is_active: true
    },
    {
      username: 'john.smith',
      email: 'john.smith@smartbizflow.com',
      password_hash: '',
      role: 'employee',
      is_active: true
    },
    {
      username: 'sarah.johnson',
      email: 'sarah.johnson@smartbizflow.com',
      password_hash: '',
      role: 'employee',
      is_active: true
    },
    {
      username: 'mike.wilson',
      email: 'mike.wilson@smartbizflow.com',
      password_hash: '',
      role: 'employee',
      is_active: true
    }
  ],

  employees: [
    {
      employee_id: 'EMP001',
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@smartbizflow.com',
      phone: '+1 (555) 123-4567',
      date_of_birth: '1990-05-15',
      hire_date: '2022-03-01',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      salary: 95000,
      status: 'active'
    },
    {
      employee_id: 'EMP002',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@smartbizflow.com',
      phone: '+1 (555) 234-5678',
      date_of_birth: '1988-12-20',
      hire_date: '2022-01-15',
      department: 'HR',
      position: 'HR Manager',
      salary: 85000,
      status: 'active'
    },
    {
      employee_id: 'EMP003',
      first_name: 'Mike',
      last_name: 'Wilson',
      email: 'mike.wilson@smartbizflow.com',
      phone: '+1 (555) 345-6789',
      date_of_birth: '1992-08-10',
      hire_date: '2022-06-01',
      department: 'Sales',
      position: 'Sales Executive',
      salary: 75000,
      status: 'active'
    },
    {
      employee_id: 'EMP004',
      first_name: 'Emily',
      last_name: 'Davis',
      email: 'emily.davis@smartbizflow.com',
      phone: '+1 (555) 456-7890',
      date_of_birth: '1995-03-25',
      hire_date: '2022-09-01',
      department: 'Marketing',
      position: 'Marketing Specialist',
      salary: 70000,
      status: 'active'
    },
    {
      employee_id: 'EMP005',
      first_name: 'David',
      last_name: 'Brown',
      email: 'david.brown@smartbizflow.com',
      phone: '+1 (555) 567-8901',
      date_of_birth: '1985-11-05',
      hire_date: '2022-02-01',
      department: 'Finance',
      position: 'Senior Accountant',
      salary: 80000,
      status: 'active'
    },
    {
      employee_id: 'EMP006',
      first_name: 'Lisa',
      last_name: 'Garcia',
      email: 'lisa.garcia@smartbizflow.com',
      phone: '+1 (555) 678-9012',
      date_of_birth: '1991-07-18',
      hire_date: '2022-04-15',
      department: 'Engineering',
      position: 'Frontend Developer',
      salary: 85000,
      status: 'active'
    },
    {
      employee_id: 'EMP007',
      first_name: 'Robert',
      last_name: 'Martinez',
      email: 'robert.martinez@smartbizflow.com',
      phone: '+1 (555) 789-0123',
      date_of_birth: '1989-09-30',
      hire_date: '2022-07-01',
      department: 'Engineering',
      position: 'Backend Developer',
      salary: 90000,
      status: 'active'
    },
    {
      employee_id: 'EMP008',
      first_name: 'Jennifer',
      last_name: 'Taylor',
      email: 'jennifer.taylor@smartbizflow.com',
      phone: '+1 (555) 890-1234',
      date_of_birth: '1993-01-12',
      hire_date: '2022-08-15',
      department: 'Sales',
      position: 'Sales Manager',
      salary: 95000,
      status: 'active'
    }
  ],

  trainingCourses: [
    {
      title: 'React Development Fundamentals',
      description: 'Learn the basics of React development including components, state, and props.',
      category: 'Technical',
      level: 'Beginner',
      duration: 16,
      instructor: 'Dr. Sarah Johnson',
      format: 'Online',
      max_enrollment: 50,
      current_enrollment: 35,
      status: 'Active',
      rating: 4.5,
      total_ratings: 128
    },
    {
      title: 'Leadership Skills for Managers',
      description: 'Develop essential leadership skills including communication, delegation, and team building.',
      category: 'Leadership',
      level: 'Intermediate',
      duration: 20,
      instructor: 'Prof. Michael Chen',
      format: 'Hybrid',
      max_enrollment: 25,
      current_enrollment: 18,
      status: 'Active',
      rating: 4.8,
      total_ratings: 89
    },
    {
      title: 'Data Security Compliance',
      description: 'Understand data security regulations and best practices for compliance.',
      category: 'Compliance',
      level: 'Intermediate',
      duration: 8,
      instructor: 'Lisa Rodriguez',
      format: 'Self-Paced',
      max_enrollment: 100,
      current_enrollment: 67,
      status: 'Active',
      rating: 4.2,
      total_ratings: 156
    },
    {
      title: 'Advanced TypeScript',
      description: 'Master advanced TypeScript concepts including generics, decorators, and advanced types.',
      category: 'Technical',
      level: 'Advanced',
      duration: 24,
      instructor: 'Alex Thompson',
      format: 'Online',
      max_enrollment: 30,
      current_enrollment: 22,
      status: 'Active',
      rating: 4.7,
      total_ratings: 95
    },
    {
      title: 'Customer Service Excellence',
      description: 'Learn best practices for providing exceptional customer service and handling difficult situations.',
      category: 'Soft Skills',
      level: 'Beginner',
      duration: 12,
      instructor: 'Maria Gonzalez',
      format: 'In-Person',
      max_enrollment: 40,
      current_enrollment: 28,
      status: 'Active',
      rating: 4.3,
      total_ratings: 112
    },
    {
      title: 'Project Management Professional',
      description: 'Comprehensive project management training covering PMP methodology and best practices.',
      category: 'Leadership',
      level: 'Advanced',
      duration: 40,
      instructor: 'James Wilson',
      format: 'Hybrid',
      max_enrollment: 20,
      current_enrollment: 15,
      status: 'Active',
      rating: 4.9,
      total_ratings: 78
    }
  ],

  leaveRequests: [
    {
      employee_id: 1,
      type: 'Annual',
      start_date: '2024-02-15',
      end_date: '2024-02-20',
      days: 5,
      reason: 'Family vacation',
      status: 'Approved',
      submitted_date: '2024-01-20',
      approved_by: 2,
      approved_date: '2024-01-22'
    },
    {
      employee_id: 1,
      type: 'Sick',
      start_date: '2024-01-10',
      end_date: '2024-01-12',
      days: 3,
      reason: 'Medical appointment',
      status: 'Approved',
      submitted_date: '2024-01-09',
      approved_by: 2,
      approved_date: '2024-01-09'
    },
    {
      employee_id: 3,
      type: 'Personal',
      start_date: '2024-03-05',
      end_date: '2024-03-05',
      days: 1,
      reason: 'Personal matter',
      status: 'Pending',
      submitted_date: '2024-01-25'
    },
    {
      employee_id: 4,
      type: 'Annual',
      start_date: '2024-04-01',
      end_date: '2024-04-05',
      days: 4,
      reason: 'Spring break vacation',
      status: 'Pending',
      submitted_date: '2024-01-28'
    },
    {
      employee_id: 5,
      type: 'Sick',
      start_date: '2024-01-15',
      end_date: '2024-01-16',
      days: 2,
      reason: 'Not feeling well',
      status: 'Approved',
      submitted_date: '2024-01-14',
      approved_by: 2,
      approved_date: '2024-01-14'
    }
  ],

  payslips: [
    {
      employee_id: 1,
      month: 'January',
      year: 2024,
      gross_pay: 9500,
      net_pay: 7125,
      status: 'Paid',
      payment_date: '2024-01-31'
    },
    {
      employee_id: 2,
      month: 'January',
      year: 2024,
      gross_pay: 8500,
      net_pay: 6375,
      status: 'Paid',
      payment_date: '2024-01-31'
    },
    {
      employee_id: 3,
      month: 'January',
      year: 2024,
      gross_pay: 7500,
      net_pay: 5625,
      status: 'Paid',
      payment_date: '2024-01-31'
    },
    {
      employee_id: 4,
      month: 'January',
      year: 2024,
      gross_pay: 7000,
      net_pay: 5250,
      status: 'Paid',
      payment_date: '2024-01-31'
    },
    {
      employee_id: 5,
      month: 'January',
      year: 2024,
      gross_pay: 8000,
      net_pay: 6000,
      status: 'Paid',
      payment_date: '2024-01-31'
    },
    {
      employee_id: 1,
      month: 'December',
      year: 2023,
      gross_pay: 9500,
      net_pay: 7125,
      status: 'Paid',
      payment_date: '2023-12-31'
    },
    {
      employee_id: 2,
      month: 'December',
      year: 2023,
      gross_pay: 8500,
      net_pay: 6375,
      status: 'Paid',
      payment_date: '2023-12-31'
    },
    {
      employee_id: 3,
      month: 'December',
      year: 2023,
      gross_pay: 7500,
      net_pay: 5625,
      status: 'Paid',
      payment_date: '2023-12-31'
    }
  ]
};

export class DatabaseSeeder {
  /**
   * Seed all data
   */
  static async seedAll(): Promise<void> {
    try {
      console.log('🌱 Starting database seeding...');

      // Initialize database
      await dbService.initialize();

      // Seed users
      await this.seedUsers();

      // Seed employees
      await this.seedEmployees();

      // Seed training courses
      await this.seedTrainingCourses();

      // Seed employee training enrollments
      await this.seedEmployeeTrainings();

      // Seed leave requests
      await this.seedLeaveRequests();

      // Seed payslips
      await this.seedPayslips();

      // Seed two-factor authentication
      await this.seedTwoFactorAuth();

      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  /**
   * Seed users
   */
  static async seedUsers(): Promise<void> {
    console.log('👥 Seeding users...');

    for (const userData of seedData.users) {
      // Hash password
      const passwordHash = await bcrypt.hash('password123', 10);
      
      try {
        await dbService.createUser({
          ...userData,
          password_hash: passwordHash
        });
      } catch (error) {
        console.log(`User ${userData.email} already exists, skipping...`);
      }
    }

    console.log(`✅ Seeded ${seedData.users.length} users`);
  }

  /**
   * Seed employees
   */
  static async seedEmployees(): Promise<void> {
    console.log('👨‍💼 Seeding employees...');

    for (const employeeData of seedData.employees) {
      try {
        await dbService.createEmployee(employeeData);
      } catch (error) {
        console.log(`Employee ${employeeData.email} already exists, skipping...`);
      }
    }

    console.log(`✅ Seeded ${seedData.employees.length} employees`);
  }

  /**
   * Seed training courses
   */
  static async seedTrainingCourses(): Promise<void> {
    console.log('📚 Seeding training courses...');

    for (const courseData of seedData.trainingCourses) {
      try {
        await dbService.createTrainingCourse(courseData);
      } catch (error) {
        console.log(`Course "${courseData.title}" already exists, skipping...`);
      }
    }

    console.log(`✅ Seeded ${seedData.trainingCourses.length} training courses`);
  }

  /**
   * Seed employee training enrollments
   */
  static async seedEmployeeTrainings(): Promise<void> {
    console.log('🎓 Seeding employee training enrollments...');

    const employees = await dbService.getAllEmployees();
    const courses = await dbService.getAllTrainingCourses();

    const enrollments = [
      {
        employee_id: employees[0]?.id,
        course_id: courses[0]?.id,
        status: 'in_progress',
        progress: 65,
        start_date: '2024-01-15',
        attempts: 1
      },
      {
        employee_id: employees[1]?.id,
        course_id: courses[1]?.id,
        status: 'completed',
        progress: 100,
        start_date: '2024-01-10',
        completion_date: '2024-01-25',
        certificate: 'CERT-2024-001',
        score: 92,
        attempts: 1
      },
      {
        employee_id: employees[2]?.id,
        course_id: courses[2]?.id,
        status: 'enrolled',
        progress: 0,
        start_date: '2024-01-20',
        attempts: 0
      },
      {
        employee_id: employees[3]?.id,
        course_id: courses[3]?.id,
        status: 'in_progress',
        progress: 45,
        start_date: '2024-01-12',
        attempts: 1
      },
      {
        employee_id: employees[4]?.id,
        course_id: courses[4]?.id,
        status: 'completed',
        progress: 100,
        start_date: '2024-01-05',
        completion_date: '2024-01-20',
        certificate: 'CERT-2024-002',
        score: 88,
        attempts: 1
      }
    ];

    for (const enrollment of enrollments) {
      if (enrollment.employee_id && enrollment.course_id) {
        try {
          await dbService.enrollEmployeeInTraining(enrollment);
        } catch (error) {
          console.log(`Enrollment already exists, skipping...`);
        }
      }
    }

    console.log(`✅ Seeded ${enrollments.length} employee training enrollments`);
  }

  /**
   * Seed leave requests
   */
  static async seedLeaveRequests(): Promise<void> {
    console.log('🏖️ Seeding leave requests...');

    for (const requestData of seedData.leaveRequests) {
      try {
        await dbService.createLeaveRequest(requestData);
      } catch (error) {
        console.log(`Leave request already exists, skipping...`);
      }
    }

    console.log(`✅ Seeded ${seedData.leaveRequests.length} leave requests`);
  }

  /**
   * Seed payslips
   */
  static async seedPayslips(): Promise<void> {
    console.log('💰 Seeding payslips...');

    for (const payslipData of seedData.payslips) {
      try {
        await dbService.createPayslip(payslipData);
      } catch (error) {
        console.log(`Payslip already exists, skipping...`);
      }
    }

    console.log(`✅ Seeded ${seedData.payslips.length} payslips`);
  }

  /**
   * Seed two-factor authentication
   */
  static async seedTwoFactorAuth(): Promise<void> {
    console.log('🔐 Seeding two-factor authentication...');

    const users = await dbService.getAllUsers();

    // Create 2FA methods for admin user
    if (users.length > 0) {
      const adminUser = users.find(u => u.role === 'admin');
      if (adminUser) {
        try {
          // Create authenticator method
          await dbService.createTwoFactorMethod({
            user_id: adminUser.id,
            type: 'authenticator',
            name: 'Authenticator App',
            is_enabled: true,
            is_primary: true
          });

          // Create backup codes
          const backupCodes = [
            '12345678', '87654321', '11223344', '44332211', '55667788',
            '88776655', '99887766', '66778899', '22334455', '55443322'
          ];
          await dbService.createBackupCodes(adminUser.id, backupCodes);

          // Create trusted device
          await dbService.createTrustedDevice({
            user_id: adminUser.id,
            name: 'MacBook Pro',
            type: 'desktop',
            browser: 'Chrome',
            os: 'macOS 14.2',
            ip_address: '192.168.1.100',
            location: 'San Francisco, CA',
            is_trusted: true
          });

          console.log('✅ Seeded two-factor authentication for admin user');
        } catch (error) {
          console.log('2FA data already exists, skipping...');
        }
      }
    }
  }

  /**
   * Clear all data (for testing)
   */
  static async clearAll(): Promise<void> {
    try {
      console.log('🗑️ Clearing all data...');

      // Execute raw SQL to clear all tables
      const tables = [
        'backup_codes',
        'trusted_devices',
        'two_factor_methods',
        'payslips',
        'leave_requests',
        'employee_trainings',
        'training_courses',
        'employees',
        'users'
      ];

      for (const table of tables) {
        await dbService.executeQuery(`DELETE FROM ${table}`);
        await dbService.executeQuery(`DELETE FROM sqlite_sequence WHERE name = ?`, [table]);
      }

      console.log('✅ All data cleared successfully!');
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  static async getStats(): Promise<void> {
    try {
      const stats = await dbService.getDatabaseStats();
      
      console.log('\n📊 Database Statistics:');
      console.log(`👥 Total Users: ${stats.totalUsers}`);
      console.log(`👨‍💼 Total Employees: ${stats.totalEmployees}`);
      console.log(`📚 Total Training Courses: ${stats.totalCourses}`);
      console.log(`🏖️ Total Leave Requests: ${stats.totalLeaveRequests}`);
      console.log(`💰 Total Payslips: ${stats.totalPayslips}`);
    } catch (error) {
      console.error('❌ Failed to get statistics:', error);
    }
  }
}

// Export for use in scripts
export default DatabaseSeeder; 