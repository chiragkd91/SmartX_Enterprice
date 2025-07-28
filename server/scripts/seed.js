/**
 * SmartBizFlow HR Portal - Database Seeding Script
 * Populates the database with initial data for development and testing
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create permissions
  console.log('📋 Creating permissions...');
  const permissions = [
    // Employee permissions
    { name: 'employees.view', description: 'View employee records', module: 'employees' },
    { name: 'employees.create', description: 'Create new employees', module: 'employees' },
    { name: 'employees.edit', description: 'Edit employee records', module: 'employees' },
    { name: 'employees.delete', description: 'Delete employee records', module: 'employees' },
    
    // Attendance permissions
    { name: 'attendance.view', description: 'View attendance records', module: 'attendance' },
    { name: 'attendance.create', description: 'Create attendance records', module: 'attendance' },
    { name: 'attendance.edit', description: 'Edit attendance records', module: 'attendance' },
    
    // Leave permissions
    { name: 'leave.view', description: 'View leave requests', module: 'leave' },
    { name: 'leave.create', description: 'Create leave requests', module: 'leave' },
    { name: 'leave.approve', description: 'Approve/reject leave requests', module: 'leave' },
    
    // Payroll permissions
    { name: 'payroll.view', description: 'View payroll records', module: 'payroll' },
    { name: 'payroll.create', description: 'Create payroll records', module: 'payroll' },
    { name: 'payroll.process', description: 'Process payroll', module: 'payroll' },
    
    // Performance permissions
    { name: 'performance.view', description: 'View performance records', module: 'performance' },
    { name: 'performance.create', description: 'Create performance reviews', module: 'performance' },
    { name: 'performance.edit', description: 'Edit performance reviews', module: 'performance' },
    
    // Training permissions
    { name: 'training.view', description: 'View training courses', module: 'training' },
    { name: 'training.create', description: 'Create training courses', module: 'training' },
    { name: 'training.edit', description: 'Edit training courses', module: 'training' },
    
    // Reports permissions
    { name: 'reports.view', description: 'View reports', module: 'reports' },
    { name: 'reports.create', description: 'Create reports', module: 'reports' },
    
    // HR permissions
    { name: 'hr.view', description: 'View HR dashboard', module: 'hr' },
    { name: 'hr.manage', description: 'Manage HR settings', module: 'hr' }
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission
    });
  }

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smartbizflow.com' },
    update: {},
    create: {
      email: 'admin@smartbizflow.com',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true
    }
  });

  // Assign all permissions to admin
  const allPermissions = await prisma.permission.findMany();
  await prisma.user.update({
    where: { id: adminUser.id },
    data: {
      permissions: {
        connect: allPermissions.map(p => ({ id: p.id }))
      }
    }
  });

  // Create admin employee record
  await prisma.employee.upsert({
    where: { id: adminUser.id },
    update: {},
    create: {
      id: adminUser.id,
      employeeId: 'EMP001',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@smartbizflow.com',
      phone: '+91-9876543210',
      department: 'IT',
      position: 'System Administrator',
      hireDate: new Date('2024-01-01'),
      salary: 75000,
      status: 'ACTIVE'
    }
  });

  // Create HR Manager
  console.log('👥 Creating HR Manager...');
  const hrPassword = await bcrypt.hash('hr123', 12);
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@smartbizflow.com' },
    update: {},
    create: {
      email: 'hr@smartbizflow.com',
      password: hrPassword,
      role: 'HR_MANAGER',
      isActive: true
    }
  });

  // Assign HR permissions
  const hrPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          'employees.view', 'employees.create', 'employees.edit',
          'attendance.view', 'attendance.create', 'attendance.edit',
          'leave.view', 'leave.create', 'leave.approve',
          'payroll.view', 'payroll.create', 'payroll.process',
          'performance.view', 'performance.create', 'performance.edit',
          'training.view', 'training.create', 'training.edit',
          'reports.view', 'reports.create',
          'hr.view', 'hr.manage'
        ]
      }
    }
  });

  await prisma.user.update({
    where: { id: hrUser.id },
    data: {
      permissions: {
        connect: hrPermissions.map(p => ({ id: p.id }))
      }
    }
  });

  await prisma.employee.upsert({
    where: { id: hrUser.id },
    update: {},
    create: {
      id: hrUser.id,
      employeeId: 'EMP002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'hr@smartbizflow.com',
      phone: '+91-9876543211',
      department: 'Human Resources',
      position: 'HR Manager',
      hireDate: new Date('2024-01-15'),
      salary: 65000,
      status: 'ACTIVE'
    }
  });

  // Create sample employees
  console.log('👥 Creating sample employees...');
  const sampleEmployees = [
    {
      employeeId: 'EMP003',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@smartbizflow.com',
      phone: '+91-9876543212',
      department: 'Engineering',
      position: 'Senior Developer',
      hireDate: new Date('2024-02-01'),
      salary: 55000,
      managerId: null
    },
    {
      employeeId: 'EMP004',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@smartbizflow.com',
      phone: '+91-9876543213',
      department: 'Marketing',
      position: 'Marketing Manager',
      hireDate: new Date('2024-02-15'),
      salary: 60000,
      managerId: null
    },
    {
      employeeId: 'EMP005',
      firstName: 'Mike',
      lastName: 'Wilson',
      email: 'mike.wilson@smartbizflow.com',
      phone: '+91-9876543214',
      department: 'Sales',
      position: 'Sales Executive',
      hireDate: new Date('2024-03-01'),
      salary: 45000,
      managerId: null
    },
    {
      employeeId: 'EMP006',
      firstName: 'Lisa',
      lastName: 'Brown',
      email: 'lisa.brown@smartbizflow.com',
      phone: '+91-9876543215',
      department: 'Finance',
      position: 'Financial Analyst',
      hireDate: new Date('2024-03-15'),
      salary: 50000,
      managerId: null
    }
  ];

  for (const empData of sampleEmployees) {
    const password = await bcrypt.hash('employee123', 12);
    const user = await prisma.user.create({
      data: {
        email: empData.email,
        password,
        role: 'EMPLOYEE',
        isActive: true
      }
    });

    await prisma.employee.create({
      data: {
        id: user.id,
        ...empData,
        status: 'ACTIVE'
      }
    });

    // Assign basic permissions
    const basicPermissions = await prisma.permission.findMany({
      where: {
        name: {
          in: ['employees.view', 'attendance.view', 'leave.view', 'reports.view']
        }
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        permissions: {
          connect: basicPermissions.map(p => ({ id: p.id }))
        }
      }
    });
  }

  // Create sample training courses
  console.log('📚 Creating sample training courses...');
  const sampleCourses = [
    {
      title: 'React Fundamentals',
      description: 'Learn the basics of React development',
      category: 'Technical',
      level: 'Beginner',
      duration: 16,
      instructor: 'John Doe',
      format: 'Online',
      maxEnrollment: 20,
      status: 'ACTIVE',
      prerequisites: []
    },
    {
      title: 'Leadership Skills',
      description: 'Develop essential leadership and management skills',
      category: 'Leadership',
      level: 'Intermediate',
      duration: 24,
      instructor: 'Sarah Johnson',
      format: 'In-Person',
      maxEnrollment: 15,
      status: 'ACTIVE',
      prerequisites: []
    },
    {
      title: 'Customer Service Excellence',
      description: 'Master customer service and communication skills',
      category: 'Soft Skills',
      level: 'Beginner',
      duration: 12,
      instructor: 'Jane Smith',
      format: 'Hybrid',
      maxEnrollment: 25,
      status: 'ACTIVE',
      prerequisites: []
    },
    {
      title: 'Advanced JavaScript',
      description: 'Deep dive into advanced JavaScript concepts',
      category: 'Technical',
      level: 'Advanced',
      duration: 20,
      instructor: 'John Doe',
      format: 'Online',
      maxEnrollment: 15,
      status: 'ACTIVE',
      prerequisites: ['React Fundamentals']
    }
  ];

  for (const courseData of sampleCourses) {
    await prisma.trainingCourse.upsert({
      where: { title: courseData.title },
      update: {},
      create: courseData
    });
  }

  // Create sample benefits
  console.log('🏥 Creating sample benefits...');
  const sampleBenefits = [
    {
      name: 'Health Insurance',
      description: 'Comprehensive health insurance coverage',
      type: 'HEALTH_INSURANCE',
      cost: 5000
    },
    {
      name: 'Life Insurance',
      description: 'Life insurance coverage',
      type: 'LIFE_INSURANCE',
      cost: 2000
    },
    {
      name: 'Transport Allowance',
      description: 'Monthly transport allowance',
      type: 'TRANSPORT',
      cost: 3000
    },
    {
      name: 'Meal Allowance',
      description: 'Daily meal allowance',
      type: 'MEAL',
      cost: 1500
    }
  ];

  for (const benefitData of sampleBenefits) {
    await prisma.benefit.upsert({
      where: { name: benefitData.name },
      update: {},
      create: benefitData
    });
  }

  // Create sample attendance records for the last 30 days
  console.log('📅 Creating sample attendance records...');
  const employees = await prisma.employee.findMany({
    where: { status: 'ACTIVE' }
  });

  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    for (const employee of employees) {
      // Skip weekends
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      // Random attendance status
      const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'ABSENT'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      if (status === 'PRESENT' || status === 'LATE') {
        const checkIn = new Date(date);
        checkIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        
        const checkOut = new Date(date);
        checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        
        const totalHours = (checkOut - checkIn) / (1000 * 60 * 60);

        await prisma.attendance.create({
          data: {
            employeeId: employee.id,
            date,
            checkIn,
            checkOut,
            totalHours: parseFloat(totalHours.toFixed(2)),
            status
          }
        });
      } else {
        await prisma.attendance.create({
          data: {
            employeeId: employee.id,
            date,
            status
          }
        });
      }
    }
  }

  // Create sample leave requests
  console.log('🏖️ Creating sample leave requests...');
  const leaveTypes = ['ANNUAL', 'SICK', 'PERSONAL'];
  const leaveStatuses = ['PENDING', 'APPROVED', 'REJECTED'];

  for (const employee of employees.slice(1)) { // Skip admin
    const numLeaves = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numLeaves; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 7);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
      
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      await prisma.leave.create({
        data: {
          employeeId: employee.id,
          type: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
          startDate,
          endDate,
          days,
          reason: 'Personal leave request',
          status: leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)]
        }
      });
    }
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Default Login Credentials:');
  console.log('👤 Admin: admin@smartbizflow.com / admin123');
  console.log('👥 HR Manager: hr@smartbizflow.com / hr123');
  console.log('👤 Employee: john.doe@smartbizflow.com / employee123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 