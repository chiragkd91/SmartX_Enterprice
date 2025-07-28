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
      email: 'admin@healthcareflow.com',
      password_hash: '',
      role: 'admin',
      is_active: true
    },
    {
      username: 'dr.smith',
      email: 'dr.smith@healthcareflow.com',
      password_hash: '',
      role: 'doctor',
      is_active: true
    },
    {
      username: 'nurse.johnson',
      email: 'nurse.johnson@healthcareflow.com',
      password_hash: '',
      role: 'nurse',
      is_active: true
    },
    {
      username: 'hr.manager',
      email: 'hr@healthcareflow.com',
      password_hash: '',
      role: 'hr_manager',
      is_active: true
    },
    {
      username: 'finance.admin',
      email: 'finance@healthcareflow.com',
      password_hash: '',
      role: 'finance_manager',
      is_active: true
    }
  ],

  employees: [
    {
      employee_id: 'EMP001',
      first_name: 'Dr. Sarah',
      last_name: 'Smith',
      email: 'dr.smith@healthcareflow.com',
      phone: '+91 98765-43210',
      date_of_birth: '1985-03-15',
      hire_date: '2020-01-15',
      department: 'Cardiology',
      position: 'Senior Cardiologist',
      salary: 180000,
      status: 'active'
    },
    {
      employee_id: 'EMP002',
      first_name: 'Dr. Rajesh',
      last_name: 'Kumar',
      email: 'dr.kumar@healthcareflow.com',
      phone: '+91 98765-43211',
      date_of_birth: '1988-07-22',
      hire_date: '2021-03-01',
      department: 'Neurology',
      position: 'Neurologist',
      salary: 160000,
      status: 'active'
    },
    {
      employee_id: 'EMP003',
      first_name: 'Nurse Priya',
      last_name: 'Patel',
      email: 'nurse.patel@healthcareflow.com',
      phone: '+91 98765-43212',
      date_of_birth: '1992-11-08',
      hire_date: '2022-06-15',
      department: 'Emergency',
      position: 'Senior Nurse',
      salary: 85000,
      status: 'active'
    },
    {
      employee_id: 'EMP004',
      first_name: 'Dr. Amit',
      last_name: 'Sharma',
      email: 'dr.sharma@healthcareflow.com',
      phone: '+91 98765-43213',
      date_of_birth: '1983-09-12',
      hire_date: '2019-08-01',
      department: 'Orthopedics',
      position: 'Orthopedic Surgeon',
      salary: 200000,
      status: 'active'
    },
    {
      employee_id: 'EMP005',
      first_name: 'Nurse Maria',
      last_name: 'Fernandez',
      email: 'nurse.fernandez@healthcareflow.com',
      phone: '+91 98765-43214',
      date_of_birth: '1990-04-25',
      hire_date: '2021-11-01',
      department: 'ICU',
      position: 'ICU Nurse',
      salary: 90000,
      status: 'active'
    },
    {
      employee_id: 'EMP006',
      first_name: 'Dr. Anjali',
      last_name: 'Desai',
      email: 'dr.desai@healthcareflow.com',
      phone: '+91 98765-43215',
      date_of_birth: '1987-12-03',
      hire_date: '2020-09-15',
      department: 'Pediatrics',
      position: 'Pediatrician',
      salary: 150000,
      status: 'active'
    },
    {
      employee_id: 'EMP007',
      first_name: 'Nurse Robert',
      last_name: 'Wilson',
      email: 'nurse.wilson@healthcareflow.com',
      phone: '+91 98765-43216',
      date_of_birth: '1989-06-18',
      hire_date: '2022-01-10',
      department: 'Surgery',
      position: 'Surgical Nurse',
      salary: 95000,
      status: 'active'
    },
    {
      employee_id: 'EMP008',
      first_name: 'Dr. Sanjay',
      last_name: 'Verma',
      email: 'dr.verma@healthcareflow.com',
      phone: '+91 98765-43217',
      date_of_birth: '1984-02-28',
      hire_date: '2018-12-01',
      department: 'Oncology',
      position: 'Oncologist',
      salary: 220000,
      status: 'active'
    }
  ],

  trainingCourses: [
    {
      title: 'Advanced Cardiac Life Support (ACLS)',
      description: 'Comprehensive training in advanced cardiac life support procedures and protocols.',
      category: 'Medical Training',
      level: 'Advanced',
      duration: 16,
      instructor: 'Dr. Sarah Smith',
      format: 'In-Person',
      max_enrollment: 20,
      current_enrollment: 15,
      status: 'Active',
      rating: 4.8,
      total_ratings: 45
    },
    {
      title: 'Basic Life Support (BLS)',
      description: 'Essential life support training for healthcare professionals.',
      category: 'Medical Training',
      level: 'Beginner',
      duration: 8,
      instructor: 'Nurse Priya Patel',
      format: 'Hybrid',
      max_enrollment: 30,
      current_enrollment: 25,
      status: 'Active',
      rating: 4.6,
      total_ratings: 78
    },
    {
      title: 'Patient Safety and Quality Care',
      description: 'Training on patient safety protocols and quality improvement in healthcare.',
      category: 'Quality Management',
      level: 'Intermediate',
      duration: 12,
      instructor: 'Dr. Rajesh Kumar',
      format: 'Online',
      max_enrollment: 40,
      current_enrollment: 32,
      status: 'Active',
      rating: 4.5,
      total_ratings: 56
    },
    {
      title: 'Medical Equipment Operation',
      description: 'Training on operation and maintenance of medical equipment.',
      category: 'Technical Training',
      level: 'Intermediate',
      duration: 20,
      instructor: 'Dr. Amit Sharma',
      format: 'In-Person',
      max_enrollment: 15,
      current_enrollment: 12,
      status: 'Active',
      rating: 4.7,
      total_ratings: 34
    },
    {
      title: 'Healthcare Compliance and Regulations',
      description: 'Understanding healthcare regulations and compliance requirements.',
      category: 'Compliance',
      level: 'Intermediate',
      duration: 10,
      instructor: 'Legal Team',
      format: 'Online',
      max_enrollment: 50,
      current_enrollment: 38,
      status: 'Active',
      rating: 4.3,
      total_ratings: 67
    },
    {
      title: 'Emergency Response Training',
      description: 'Comprehensive emergency response training for healthcare staff.',
      category: 'Emergency Training',
      level: 'Advanced',
      duration: 24,
      instructor: 'Emergency Response Team',
      format: 'In-Person',
      max_enrollment: 25,
      current_enrollment: 20,
      status: 'Active',
      rating: 4.9,
      total_ratings: 89
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