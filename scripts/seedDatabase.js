#!/usr/bin/env node

/**
 * JSON Database Seeder for SmartBizFlow HR Portal
 * Creates a simple JSON-based database for demonstration
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 SmartBizFlow JSON Database Seeder');
console.log('=====================================\n');

// Database file path
const dbPath = path.join(process.cwd(), 'smartbizflow-db.json');

// Simple password hashing function
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Create database structure
function createDatabase() {
  const database = {
    users: [],
    employees: [],
    trainingCourses: [],
    employeeTrainings: [],
    leaveRequests: [],
    payslips: [],
    twoFactorMethods: [],
    backupCodes: [],
    trustedDevices: [],
    metadata: {
      created_at: new Date().toISOString(),
      version: '1.0.0',
      last_updated: new Date().toISOString()
    }
  };

  return database;
}

// Seed users
function seedUsers() {
  console.log('👥 Seeding users...');
  
  const users = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@smartbizflow.com',
      password_hash: hashPassword('password123'),
      role: 'admin',
      is_active: true,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      username: 'hr_manager',
      email: 'hr@smartbizflow.com',
      password_hash: hashPassword('password123'),
      role: 'hr_manager',
      is_active: true,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      username: 'john.smith',
      email: 'john.smith@smartbizflow.com',
      password_hash: hashPassword('password123'),
      role: 'employee',
      is_active: true,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      username: 'sarah.johnson',
      email: 'sarah.johnson@smartbizflow.com',
      password_hash: hashPassword('password123'),
      role: 'employee',
      is_active: true,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
      username: 'mike.wilson',
      email: 'mike.wilson@smartbizflow.com',
      password_hash: hashPassword('password123'),
      role: 'employee',
      is_active: true,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  console.log(`✅ Seeded ${users.length} users`);
  return users;
}

// Seed employees
function seedEmployees() {
  console.log('👨‍💼 Seeding employees...');
  
  const employees = [
    {
      id: 1,
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
      manager_id: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
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
      manager_id: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
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
      manager_id: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
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
      manager_id: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
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
      manager_id: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  console.log(`✅ Seeded ${employees.length} employees`);
  return employees;
}

// Seed training courses
function seedTrainingCourses() {
  console.log('📚 Seeding training courses...');
  
  const courses = [
    {
      id: 1,
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
      total_ratings: 128,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
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
      total_ratings: 89,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
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
      total_ratings: 156,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
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
      total_ratings: 95,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
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
      total_ratings: 112,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  console.log(`✅ Seeded ${courses.length} training courses`);
  return courses;
}

// Seed employee training enrollments
function seedEmployeeTrainings() {
  console.log('🎓 Seeding employee training enrollments...');
  
  const enrollments = [
    {
      id: 1,
      employee_id: 1,
      course_id: 1,
      status: 'in_progress',
      progress: 65,
      start_date: '2024-01-15',
      completion_date: null,
      certificate: null,
      score: null,
      attempts: 1,
      last_accessed: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      employee_id: 2,
      course_id: 2,
      status: 'completed',
      progress: 100,
      start_date: '2024-01-10',
      completion_date: '2024-01-25',
      certificate: 'CERT-2024-001',
      score: 92,
      attempts: 1,
      last_accessed: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      employee_id: 3,
      course_id: 3,
      status: 'enrolled',
      progress: 0,
      start_date: '2024-01-20',
      completion_date: null,
      certificate: null,
      score: null,
      attempts: 0,
      last_accessed: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      employee_id: 4,
      course_id: 4,
      status: 'in_progress',
      progress: 45,
      start_date: '2024-01-12',
      completion_date: null,
      certificate: null,
      score: null,
      attempts: 1,
      last_accessed: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      employee_id: 5,
      course_id: 5,
      status: 'completed',
      progress: 100,
      start_date: '2024-01-05',
      completion_date: '2024-01-20',
      certificate: 'CERT-2024-002',
      score: 88,
      attempts: 1,
      last_accessed: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ];

  console.log(`✅ Seeded ${enrollments.length} employee training enrollments`);
  return enrollments;
}

// Seed leave requests
function seedLeaveRequests() {
  console.log('🏖️ Seeding leave requests...');
  
  const requests = [
    {
      id: 1,
      employee_id: 1,
      type: 'Annual',
      start_date: '2024-02-15',
      end_date: '2024-02-20',
      days: 5,
      reason: 'Family vacation',
      status: 'Approved',
      submitted_date: '2024-01-20',
      approved_by: 2,
      approved_date: '2024-01-22',
      comments: 'Approved for family vacation',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      employee_id: 1,
      type: 'Sick',
      start_date: '2024-01-10',
      end_date: '2024-01-12',
      days: 3,
      reason: 'Medical appointment',
      status: 'Approved',
      submitted_date: '2024-01-09',
      approved_by: 2,
      approved_date: '2024-01-09',
      comments: 'Medical leave approved',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      employee_id: 3,
      type: 'Personal',
      start_date: '2024-03-05',
      end_date: '2024-03-05',
      days: 1,
      reason: 'Personal matter',
      status: 'Pending',
      submitted_date: '2024-01-25',
      approved_by: null,
      approved_date: null,
      comments: null,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      employee_id: 4,
      type: 'Annual',
      start_date: '2024-04-01',
      end_date: '2024-04-05',
      days: 4,
      reason: 'Spring break vacation',
      status: 'Pending',
      submitted_date: '2024-01-28',
      approved_by: null,
      approved_date: null,
      comments: null,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      employee_id: 5,
      type: 'Sick',
      start_date: '2024-01-15',
      end_date: '2024-01-16',
      days: 2,
      reason: 'Not feeling well',
      status: 'Approved',
      submitted_date: '2024-01-14',
      approved_by: 2,
      approved_date: '2024-01-14',
      comments: 'Sick leave approved',
      created_at: new Date().toISOString()
    }
  ];

  console.log(`✅ Seeded ${requests.length} leave requests`);
  return requests;
}

// Seed payslips
function seedPayslips() {
  console.log('💰 Seeding payslips...');
  
  const payslips = [
    {
      id: 1,
      employee_id: 1,
      month: 'January',
      year: 2024,
      gross_pay: 9500,
      net_pay: 7125,
      status: 'Paid',
      payment_date: '2024-01-31',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      employee_id: 2,
      month: 'January',
      year: 2024,
      gross_pay: 8500,
      net_pay: 6375,
      status: 'Paid',
      payment_date: '2024-01-31',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      employee_id: 3,
      month: 'January',
      year: 2024,
      gross_pay: 7500,
      net_pay: 5625,
      status: 'Paid',
      payment_date: '2024-01-31',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      employee_id: 4,
      month: 'January',
      year: 2024,
      gross_pay: 7000,
      net_pay: 5250,
      status: 'Paid',
      payment_date: '2024-01-31',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      employee_id: 5,
      month: 'January',
      year: 2024,
      gross_pay: 8000,
      net_pay: 6000,
      status: 'Paid',
      payment_date: '2024-01-31',
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      employee_id: 1,
      month: 'December',
      year: 2023,
      gross_pay: 9500,
      net_pay: 7125,
      status: 'Paid',
      payment_date: '2023-12-31',
      created_at: new Date().toISOString()
    },
    {
      id: 7,
      employee_id: 2,
      month: 'December',
      year: 2023,
      gross_pay: 8500,
      net_pay: 6375,
      status: 'Paid',
      payment_date: '2023-12-31',
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      employee_id: 3,
      month: 'December',
      year: 2023,
      gross_pay: 7500,
      net_pay: 5625,
      status: 'Paid',
      payment_date: '2023-12-31',
      created_at: new Date().toISOString()
    }
  ];

  console.log(`✅ Seeded ${payslips.length} payslips`);
  return payslips;
}

// Seed two-factor authentication
function seedTwoFactorAuth() {
  console.log('🔐 Seeding two-factor authentication...');
  
  const twoFactorMethods = [
    {
      id: 1,
      user_id: 1,
      type: 'authenticator',
      name: 'Authenticator App',
      is_enabled: true,
      is_primary: true,
      device_info: null,
      last_used: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ];

  const backupCodes = [
    { id: 1, user_id: 1, code: '12345678', is_used: false, used_at: null, created_at: new Date().toISOString() },
    { id: 2, user_id: 1, code: '87654321', is_used: false, used_at: null, created_at: new Date().toISOString() },
    { id: 3, user_id: 1, code: '11223344', is_used: false, used_at: null, created_at: new Date().toISOString() },
    { id: 4, user_id: 1, code: '44332211', is_used: false, used_at: null, created_at: new Date().toISOString() },
    { id: 5, user_id: 1, code: '55667788', is_used: false, used_at: null, created_at: new Date().toISOString() }
  ];

  const trustedDevices = [
    {
      id: 1,
      user_id: 1,
      name: 'MacBook Pro',
      type: 'desktop',
      browser: 'Chrome',
      os: 'macOS 14.2',
      ip_address: '192.168.1.100',
      location: 'San Francisco, CA',
      is_trusted: true,
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ];

  console.log('✅ Seeded two-factor authentication data');
  return { twoFactorMethods, backupCodes, trustedDevices };
}

// Main seeding function
async function runSeeder() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create database structure
    const database = createDatabase();
    
    // Seed all data
    database.users = seedUsers();
    database.employees = seedEmployees();
    database.trainingCourses = seedTrainingCourses();
    database.employeeTrainings = seedEmployeeTrainings();
    database.leaveRequests = seedLeaveRequests();
    database.payslips = seedPayslips();
    
    const twoFactorData = seedTwoFactorAuth();
    database.twoFactorMethods = twoFactorData.twoFactorMethods;
    database.backupCodes = twoFactorData.backupCodes;
    database.trustedDevices = twoFactorData.trustedDevices;
    
    // Update metadata
    database.metadata.last_updated = new Date().toISOString();
    
    // Write to file
    fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
    
    console.log(`\n📁 Database file created: ${dbPath}`);
    
    // Display statistics
    console.log('\n📊 Database Statistics:');
    console.log(`👥 Total Users: ${database.users.length}`);
    console.log(`👨‍💼 Total Employees: ${database.employees.length}`);
    console.log(`📚 Total Training Courses: ${database.trainingCourses.length}`);
    console.log(`🎓 Total Training Enrollments: ${database.employeeTrainings.length}`);
    console.log(`🏖️ Total Leave Requests: ${database.leaveRequests.length}`);
    console.log(`💰 Total Payslips: ${database.payslips.length}`);
    console.log(`🔐 Total 2FA Methods: ${database.twoFactorMethods.length}`);
    console.log(`🔑 Total Backup Codes: ${database.backupCodes.length}`);
    console.log(`💻 Total Trusted Devices: ${database.trustedDevices.length}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start your application: npm run dev');
    console.log('   2. Navigate to the HR modules');
    console.log('   3. Test the CRUD operations');
    console.log('\n🔑 Default login credentials:');
    console.log('   Email: admin@smartbizflow.com');
    console.log('   Password: password123');
    console.log('\n📁 Database file location:');
    console.log(`   ${dbPath}`);
    
  } catch (error) {
    console.error('\n❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Get database statistics
function getDatabaseStats() {
  try {
    if (!fs.existsSync(dbPath)) {
      console.log('❌ Database file not found. Run the seeder first.');
      return;
    }
    
    const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    console.log('\n📊 Database Statistics:');
    console.log(`👥 Total Users: ${database.users.length}`);
    console.log(`👨‍💼 Total Employees: ${database.employees.length}`);
    console.log(`📚 Total Training Courses: ${database.trainingCourses.length}`);
    console.log(`🎓 Total Training Enrollments: ${database.employeeTrainings.length}`);
    console.log(`🏖️ Total Leave Requests: ${database.leaveRequests.length}`);
    console.log(`💰 Total Payslips: ${database.payslips.length}`);
    console.log(`🔐 Total 2FA Methods: ${database.twoFactorMethods.length}`);
    console.log(`🔑 Total Backup Codes: ${database.backupCodes.length}`);
    console.log(`💻 Total Trusted Devices: ${database.trustedDevices.length}`);
    
    console.log('\n📁 Database file location:');
    console.log(`   ${dbPath}`);
    
  } catch (error) {
    console.error('❌ Error reading database:', error);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/seedDatabase.js [options]

Options:
  --clear, -c     Clear database file
  --stats, -s     Show database statistics only
  --help, -h      Show this help message

Examples:
  node scripts/seedDatabase.js          # Seed database with sample data
  node scripts/seedDatabase.js --clear  # Clear database file
  node scripts/seedDatabase.js --stats  # Show statistics only
  `);
  process.exit(0);
}

// Run the appropriate action
async function main() {
  try {
    if (args.includes('--stats') || args.includes('-s')) {
      getDatabaseStats();
      return;
    }
    
    if (args.includes('--clear') || args.includes('-c')) {
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('🗑️ Database file cleared successfully!');
      } else {
        console.log('ℹ️ Database file does not exist.');
      }
      return;
    }
    
    await runSeeder();
    
  } catch (error) {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  }
}

// Run the script
main(); 