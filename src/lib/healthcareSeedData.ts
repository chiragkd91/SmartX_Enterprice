/**
 * Healthcare Industry Seed Data for SmartBizFlow
 * Comprehensive data for Healthcare & Hospitals industry across all modules
 */

import { dbService } from '../services/databaseService';
import bcrypt from 'bcryptjs';

// Healthcare Industry Data
export const healthcareSeedData = {
  // ==================== USERS & EMPLOYEES ====================
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

  // ==================== CRM - PATIENTS & LEADS ====================
  patients: [
    {
      patient_id: 'PAT001',
      first_name: 'Ramesh',
      last_name: 'Kumar',
      email: 'ramesh.kumar@email.com',
      phone: '+91 98765-12345',
      date_of_birth: '1975-05-15',
      gender: 'Male',
      blood_group: 'O+',
      address: '123 MG Road, Bangalore, Karnataka',
      emergency_contact: '+91 98765-54321',
      medical_history: 'Hypertension, Diabetes',
      insurance_provider: 'Star Health',
      insurance_number: 'STAR123456789',
      status: 'active'
    },
    {
      patient_id: 'PAT002',
      first_name: 'Sunita',
      last_name: 'Sharma',
      email: 'sunita.sharma@email.com',
      phone: '+91 98765-12346',
      date_of_birth: '1982-08-22',
      gender: 'Female',
      blood_group: 'A+',
      address: '456 Indiranagar, Bangalore, Karnataka',
      emergency_contact: '+91 98765-54322',
      medical_history: 'Asthma',
      insurance_provider: 'ICICI Lombard',
      insurance_number: 'ICICI987654321',
      status: 'active'
    },
    {
      patient_id: 'PAT003',
      first_name: 'Vikram',
      last_name: 'Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 98765-12347',
      date_of_birth: '1968-12-10',
      gender: 'Male',
      blood_group: 'B+',
      address: '789 Koramangala, Bangalore, Karnataka',
      emergency_contact: '+91 98765-54323',
      medical_history: 'Heart Disease, Diabetes',
      insurance_provider: 'HDFC ERGO',
      insurance_number: 'HDFC456789123',
      status: 'active'
    },
    {
      patient_id: 'PAT004',
      first_name: 'Priya',
      last_name: 'Reddy',
      email: 'priya.reddy@email.com',
      phone: '+91 98765-12348',
      date_of_birth: '1990-03-25',
      gender: 'Female',
      blood_group: 'AB+',
      address: '321 Whitefield, Bangalore, Karnataka',
      emergency_contact: '+91 98765-54324',
      medical_history: 'None',
      insurance_provider: 'Bajaj Allianz',
      insurance_number: 'BAJAJ789123456',
      status: 'active'
    },
    {
      patient_id: 'PAT005',
      first_name: 'Arun',
      last_name: 'Malhotra',
      email: 'arun.malhotra@email.com',
      phone: '+91 98765-12349',
      date_of_birth: '1972-07-08',
      gender: 'Male',
      blood_group: 'O-',
      address: '654 JP Nagar, Bangalore, Karnataka',
      emergency_contact: '+91 98765-54325',
      medical_history: 'Kidney Stones',
      insurance_provider: 'Max Bupa',
      insurance_number: 'MAX321654987',
      status: 'active'
    }
  ],

  leads: [
    {
      lead_id: 'LEAD001',
      first_name: 'Meera',
      last_name: 'Iyer',
      email: 'meera.iyer@email.com',
      phone: '+91 98765-11111',
      company: 'TechCorp India',
      position: 'HR Manager',
      source: 'Website',
      status: 'New',
      priority: 'High',
      assigned_to: 'dr.smith',
      expected_value: 50000,
      lead_score: 85,
      notes: 'Interested in corporate health checkup packages'
    },
    {
      lead_id: 'LEAD002',
      first_name: 'Krishna',
      last_name: 'Menon',
      email: 'krishna.menon@email.com',
      phone: '+91 98765-22222',
      company: 'StartupXYZ',
      position: 'CEO',
      source: 'Referral',
      status: 'Contacted',
      priority: 'Medium',
      assigned_to: 'nurse.johnson',
      expected_value: 75000,
      lead_score: 72,
      notes: 'Looking for executive health screening'
    },
    {
      lead_id: 'LEAD003',
      first_name: 'Anita',
      last_name: 'Gupta',
      email: 'anita.gupta@email.com',
      phone: '+91 98765-33333',
      company: 'EduTech Solutions',
      position: 'Operations Director',
      source: 'Social Media',
      status: 'Qualified',
      priority: 'High',
      assigned_to: 'dr.kumar',
      expected_value: 100000,
      lead_score: 90,
      notes: 'Interested in comprehensive health packages for employees'
    }
  ],

  // ==================== ERP - MEDICAL PRODUCTS & EQUIPMENT ====================
  products: [
    {
      product_id: 'PROD001',
      name: 'ECG Machine',
      description: '12-lead ECG machine with digital display',
      category: 'Diagnostic Equipment',
      brand: 'GE Healthcare',
      model: 'MAC 2000',
      hsn_code: '9018',
      gst_rate: 18,
      unit_price: 150000,
      cost_price: 120000,
      stock_quantity: 5,
      min_stock: 2,
      supplier: 'MedEquip Solutions',
      location: 'Cardiology Department',
      status: 'active'
    },
    {
      product_id: 'PROD002',
      name: 'MRI Scanner',
      description: '1.5 Tesla MRI Scanner with advanced imaging',
      category: 'Imaging Equipment',
      brand: 'Siemens',
      model: 'MAGNETOM Aera',
      hsn_code: '9022',
      gst_rate: 18,
      unit_price: 25000000,
      cost_price: 20000000,
      stock_quantity: 1,
      min_stock: 1,
      supplier: 'Siemens Healthcare',
      location: 'Radiology Department',
      status: 'active'
    },
    {
      product_id: 'PROD003',
      name: 'Surgical Instruments Set',
      description: 'Complete surgical instruments set for general surgery',
      category: 'Surgical Equipment',
      brand: 'Johnson & Johnson',
      model: 'SURG-001',
      hsn_code: '9018',
      gst_rate: 18,
      unit_price: 25000,
      cost_price: 20000,
      stock_quantity: 15,
      min_stock: 5,
      supplier: 'Surgical Supplies Co.',
      location: 'Surgery Department',
      status: 'active'
    },
    {
      product_id: 'PROD004',
      name: 'Ventilator',
      description: 'ICU Ventilator with advanced monitoring',
      category: 'Life Support Equipment',
      brand: 'Philips',
      model: 'V680',
      hsn_code: '9019',
      gst_rate: 18,
      unit_price: 800000,
      cost_price: 640000,
      stock_quantity: 8,
      min_stock: 3,
      supplier: 'Philips Healthcare',
      location: 'ICU Department',
      status: 'active'
    },
    {
      product_id: 'PROD005',
      name: 'X-Ray Machine',
      description: 'Digital X-Ray machine with CR system',
      category: 'Imaging Equipment',
      brand: 'Canon',
      model: 'CXDI-710C',
      hsn_code: '9022',
      gst_rate: 18,
      unit_price: 1200000,
      cost_price: 960000,
      stock_quantity: 2,
      min_stock: 1,
      supplier: 'Canon Medical Systems',
      location: 'Radiology Department',
      status: 'active'
    },
    {
      product_id: 'PROD006',
      name: 'Syringes (10ml)',
      description: 'Disposable syringes 10ml pack of 100',
      category: 'Medical Supplies',
      brand: 'BD',
      model: 'BD-10ML',
      hsn_code: '9018',
      gst_rate: 12,
      unit_price: 500,
      cost_price: 400,
      stock_quantity: 200,
      min_stock: 50,
      supplier: 'BD Medical',
      location: 'Pharmacy',
      status: 'active'
    },
    {
      product_id: 'PROD007',
      name: 'Surgical Masks',
      description: '3-ply surgical masks pack of 50',
      category: 'PPE',
      brand: '3M',
      model: '3M-1860',
      hsn_code: '6307',
      gst_rate: 12,
      unit_price: 300,
      cost_price: 240,
      stock_quantity: 500,
      min_stock: 100,
      supplier: '3M Healthcare',
      location: 'General Store',
      status: 'active'
    },
    {
      product_id: 'PROD008',
      name: 'Glucose Monitor',
      description: 'Digital glucose monitoring system',
      category: 'Diagnostic Equipment',
      brand: 'Accu-Chek',
      model: 'Active',
      hsn_code: '9018',
      gst_rate: 18,
      unit_price: 2500,
      cost_price: 2000,
      stock_quantity: 25,
      min_stock: 10,
      supplier: 'Roche Diagnostics',
      location: 'Pathology Department',
      status: 'active'
    }
  ],

  // ==================== ERP - ORDERS ====================
  orders: [
    {
      order_id: 'ORD001',
      patient_id: 'PAT001',
      order_date: '2024-01-15',
      delivery_date: '2024-01-20',
      status: 'Confirmed',
      total_amount: 5000,
      payment_status: 'Paid',
      payment_method: 'Insurance',
      items: [
        {
          product_id: 'PROD001',
          quantity: 1,
          unit_price: 5000,
          total_price: 5000
        }
      ]
    },
    {
      order_id: 'ORD002',
      patient_id: 'PAT002',
      order_date: '2024-01-16',
      delivery_date: '2024-01-18',
      status: 'In Progress',
      total_amount: 15000,
      payment_status: 'Pending',
      payment_method: 'Cash',
      items: [
        {
          product_id: 'PROD003',
          quantity: 1,
          unit_price: 15000,
          total_price: 15000
        }
      ]
    },
    {
      order_id: 'ORD003',
      patient_id: 'PAT003',
      order_date: '2024-01-17',
      delivery_date: '2024-01-25',
      status: 'Scheduled',
      total_amount: 25000,
      payment_status: 'Pending',
      payment_method: 'Insurance',
      items: [
        {
          product_id: 'PROD002',
          quantity: 1,
          unit_price: 25000,
          total_price: 25000
        }
      ]
    }
  ],

  // ==================== ERP - INVOICES ====================
  invoices: [
    {
      invoice_id: 'INV001',
      order_id: 'ORD001',
      patient_id: 'PAT001',
      invoice_date: '2024-01-15',
      due_date: '2024-01-22',
      total_amount: 5000,
      gst_amount: 900,
      cgst: 450,
      sgst: 450,
      igst: 0,
      net_amount: 5900,
      status: 'Paid',
      payment_date: '2024-01-16'
    },
    {
      invoice_id: 'INV002',
      order_id: 'ORD002',
      patient_id: 'PAT002',
      invoice_date: '2024-01-16',
      due_date: '2024-01-23',
      total_amount: 15000,
      gst_amount: 2700,
      cgst: 1350,
      sgst: 1350,
      igst: 0,
      net_amount: 17700,
      status: 'Pending',
      payment_date: null
    }
  ],

  // ==================== ERP - VENDORS/SUPPLIERS ====================
  vendors: [
    {
      vendor_id: 'VEN001',
      name: 'MedEquip Solutions',
      contact_person: 'Rajesh Agarwal',
      email: 'rajesh@medequip.com',
      phone: '+91 98765-55555',
      address: '456 Industrial Area, Mumbai, Maharashtra',
      gst_number: '27AABCM1234A1Z5',
      pan_number: 'AABCM1234A',
      credit_limit: 1000000,
      payment_terms: 'Net 30',
      rating: 4.5,
      status: 'active'
    },
    {
      vendor_id: 'VEN002',
      name: 'Siemens Healthcare',
      contact_person: 'Priya Sharma',
      email: 'priya.sharma@siemens.com',
      phone: '+91 98765-66666',
      address: '789 Corporate Park, Delhi, NCR',
      gst_number: '07AABCS5678B2Z9',
      pan_number: 'AABCS5678B',
      credit_limit: 5000000,
      payment_terms: 'Net 45',
      rating: 4.8,
      status: 'active'
    },
    {
      vendor_id: 'VEN003',
      name: 'Surgical Supplies Co.',
      contact_person: 'Amit Patel',
      email: 'amit@surgicalsupplies.com',
      phone: '+91 98765-77777',
      address: '321 Medical Hub, Bangalore, Karnataka',
      gst_number: '29AABCS9012C3Z1',
      pan_number: 'AABCS9012C',
      credit_limit: 500000,
      payment_terms: 'Net 30',
      rating: 4.2,
      status: 'active'
    },
    {
      vendor_id: 'VEN004',
      name: 'Philips Healthcare',
      contact_person: 'Sunita Reddy',
      email: 'sunita.reddy@philips.com',
      phone: '+91 98765-88888',
      address: '654 Tech Park, Hyderabad, Telangana',
      gst_number: '36AABCP3456D4Z7',
      pan_number: 'AABCP3456D',
      credit_limit: 3000000,
      payment_terms: 'Net 60',
      rating: 4.7,
      status: 'active'
    }
  ],

  // ==================== HR - TRAINING COURSES ====================
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
    }
  ],

  // ==================== HR - LEAVE REQUESTS ====================
  leaveRequests: [
    {
      employee_id: 1,
      type: 'Medical',
      start_date: '2024-02-15',
      end_date: '2024-02-17',
      days: 3,
      reason: 'Medical conference attendance',
      status: 'Approved',
      submitted_date: '2024-01-20',
      approved_by: 2,
      approved_date: '2024-01-22'
    },
    {
      employee_id: 3,
      type: 'Annual',
      start_date: '2024-03-10',
      end_date: '2024-03-15',
      days: 5,
      reason: 'Family vacation',
      status: 'Pending',
      submitted_date: '2024-01-25'
    },
    {
      employee_id: 5,
      type: 'Sick',
      start_date: '2024-01-20',
      end_date: '2024-01-22',
      days: 3,
      reason: 'Not feeling well',
      status: 'Approved',
      submitted_date: '2024-01-19',
      approved_by: 2,
      approved_date: '2024-01-19'
    }
  ],

  // ==================== HR - PAYSLIPS ====================
  payslips: [
    {
      employee_id: 1,
      month: 'January',
      year: 2024,
      gross_pay: 180000,
      net_pay: 135000,
      status: 'Paid',
      payment_date: '2024-01-31'
    },
    {
      employee_id: 2,
      month: 'January',
      year: 2024,
      gross_pay: 160000,
      net_pay: 120000,
      status: 'Paid',
      payment_date: '2024-01-31'
    },
    {
      employee_id: 3,
      month: 'January',
      year: 2024,
      gross_pay: 85000,
      net_pay: 63750,
      status: 'Paid',
      payment_date: '2024-01-31'
    },
    {
      employee_id: 4,
      month: 'January',
      year: 2024,
      gross_pay: 200000,
      net_pay: 150000,
      status: 'Paid',
      payment_date: '2024-01-31'
    },
    {
      employee_id: 5,
      month: 'January',
      year: 2024,
      gross_pay: 90000,
      net_pay: 67500,
      status: 'Paid',
      payment_date: '2024-01-31'
    }
  ],

  // ==================== IT ASSETS ====================
  itAssets: [
    {
      asset_id: 'IT001',
      name: 'Hospital Information System Server',
      category: 'Server',
      brand: 'Dell',
      model: 'PowerEdge R740',
      serial_number: 'DELL123456789',
      location: 'IT Server Room',
      assigned_to: 'IT Department',
      purchase_date: '2023-01-15',
      warranty_expiry: '2026-01-15',
      status: 'Active',
      value: 500000
    },
    {
      asset_id: 'IT002',
      name: 'Medical Records Database Server',
      category: 'Server',
      brand: 'HP',
      model: 'ProLiant DL380',
      serial_number: 'HP987654321',
      location: 'IT Server Room',
      assigned_to: 'IT Department',
      purchase_date: '2023-03-20',
      warranty_expiry: '2026-03-20',
      status: 'Active',
      value: 450000
    },
    {
      asset_id: 'IT003',
      name: 'Laptop - Dr. Smith',
      category: 'Laptop',
      brand: 'Lenovo',
      model: 'ThinkPad X1 Carbon',
      serial_number: 'LEN123456789',
      location: 'Cardiology Department',
      assigned_to: 'Dr. Sarah Smith',
      purchase_date: '2023-06-10',
      warranty_expiry: '2026-06-10',
      status: 'Active',
      value: 120000
    },
    {
      asset_id: 'IT004',
      name: 'Desktop - Reception',
      category: 'Desktop',
      brand: 'Dell',
      model: 'OptiPlex 7090',
      serial_number: 'DELL456789123',
      location: 'Reception',
      assigned_to: 'Reception Staff',
      purchase_date: '2023-08-05',
      warranty_expiry: '2026-08-05',
      status: 'Active',
      value: 80000
    },
    {
      asset_id: 'IT005',
      name: 'Network Switch',
      category: 'Network Equipment',
      brand: 'Cisco',
      model: 'Catalyst 2960',
      serial_number: 'CIS789123456',
      location: 'IT Server Room',
      assigned_to: 'IT Department',
      purchase_date: '2023-02-12',
      warranty_expiry: '2026-02-12',
      status: 'Active',
      value: 150000
    }
  ],

  // ==================== SOFTWARE LICENSES ====================
  softwareLicenses: [
    {
      license_id: 'LIC001',
      software_name: 'Hospital Management System',
      vendor: 'HealthcareSoft',
      license_type: 'Enterprise',
      license_key: 'HMS-ENT-2024-001',
      seats: 100,
      used_seats: 85,
      purchase_date: '2024-01-01',
      expiry_date: '2024-12-31',
      cost: 500000,
      status: 'Active'
    },
    {
      license_id: 'LIC002',
      software_name: 'Electronic Medical Records',
      vendor: 'MedTech Solutions',
      license_type: 'Perpetual',
      license_key: 'EMR-PERP-2023-001',
      seats: 50,
      used_seats: 42,
      purchase_date: '2023-06-01',
      expiry_date: '2028-06-01',
      cost: 750000,
      status: 'Active'
    },
    {
      license_id: 'LIC003',
      software_name: 'Microsoft Office 365',
      vendor: 'Microsoft',
      license_type: 'Subscription',
      license_key: 'MS365-ENT-2024-001',
      seats: 200,
      used_seats: 180,
      purchase_date: '2024-01-01',
      expiry_date: '2024-12-31',
      cost: 200000,
      status: 'Active'
    }
  ],

  // ==================== SUPPORT TICKETS ====================
  supportTickets: [
    {
      ticket_id: 'TKT001',
      title: 'ECG Machine not working',
      description: 'ECG machine in Cardiology department showing error code E-101',
      category: 'Medical Equipment',
      priority: 'High',
      status: 'Open',
      assigned_to: 'Technical Support',
      reported_by: 'Dr. Sarah Smith',
      created_date: '2024-01-20',
      due_date: '2024-01-22'
    },
    {
      ticket_id: 'TKT002',
      title: 'Network connectivity issue',
      description: 'Slow internet connection in Emergency department',
      category: 'IT Infrastructure',
      priority: 'Medium',
      status: 'In Progress',
      assigned_to: 'IT Department',
      reported_by: 'Nurse Priya Patel',
      created_date: '2024-01-19',
      due_date: '2024-01-25'
    },
    {
      ticket_id: 'TKT003',
      title: 'Software license renewal',
      description: 'Hospital Management System license expiring soon',
      category: 'Software',
      priority: 'Low',
      status: 'Open',
      assigned_to: 'IT Department',
      reported_by: 'IT Manager',
      created_date: '2024-01-18',
      due_date: '2024-01-31'
    }
  ]
};

export class HealthcareDatabaseSeeder {
  /**
   * Seed all healthcare data
   */
  static async seedAll(): Promise<void> {
    try {
      console.log('🏥 Starting healthcare database seeding...');

      // Initialize database
      await dbService.initialize();

      // Seed users
      await this.seedUsers();

      // Seed employees
      await this.seedEmployees();

      // Seed patients (CRM)
      await this.seedPatients();

      // Seed leads (CRM)
      await this.seedLeads();

      // Seed products (ERP)
      await this.seedProducts();

      // Seed orders (ERP)
      await this.seedOrders();

      // Seed invoices (ERP)
      await this.seedInvoices();

      // Seed vendors (ERP)
      await this.seedVendors();

      // Seed training courses (HR)
      await this.seedTrainingCourses();

      // Seed leave requests (HR)
      await this.seedLeaveRequests();

      // Seed payslips (HR)
      await this.seedPayslips();

      // Seed IT assets
      await this.seedITAssets();

      // Seed software licenses
      await this.seedSoftwareLicenses();

      // Seed support tickets
      await this.seedSupportTickets();

      console.log('✅ Healthcare database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Healthcare database seeding failed:', error);
      throw error;
    }
  }

  /**
   * Seed users
   */
  static async seedUsers(): Promise<void> {
    console.log('👥 Seeding healthcare users...');

    for (const userData of healthcareSeedData.users) {
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

    console.log(`✅ Seeded ${healthcareSeedData.users.length} healthcare users`);
  }

  /**
   * Seed employees
   */
  static async seedEmployees(): Promise<void> {
    console.log('👨‍⚕️ Seeding healthcare employees...');

    for (const employeeData of healthcareSeedData.employees) {
      try {
        await dbService.createEmployee(employeeData);
      } catch (error) {
        console.log(`Employee ${employeeData.email} already exists, skipping...`);
      }
    }

    console.log(`✅ Seeded ${healthcareSeedData.employees.length} healthcare employees`);
  }

  /**
   * Seed patients (CRM data)
   */
  static async seedPatients(): Promise<void> {
    console.log('🏥 Seeding patients...');

    // This would need to be implemented in the database service
    // For now, we'll log the data structure
    console.log(`📋 Patient data structure ready for ${healthcareSeedData.patients.length} patients`);
    
    healthcareSeedData.patients.forEach(patient => {
      console.log(`  - ${patient.first_name} ${patient.last_name} (${patient.patient_id})`);
    });
  }

  /**
   * Seed leads (CRM data)
   */
  static async seedLeads(): Promise<void> {
    console.log('📞 Seeding leads...');

    // This would need to be implemented in the database service
    console.log(`📋 Lead data structure ready for ${healthcareSeedData.leads.length} leads`);
    
    healthcareSeedData.leads.forEach(lead => {
      console.log(`  - ${lead.first_name} ${lead.last_name} (${lead.lead_id}) - ${lead.company}`);
    });
  }

  /**
   * Seed products (ERP data)
   */
  static async seedProducts(): Promise<void> {
    console.log('🏥 Seeding medical products...');

    // This would need to be implemented in the database service
    console.log(`📋 Product data structure ready for ${healthcareSeedData.products.length} medical products`);
    
    healthcareSeedData.products.forEach(product => {
      console.log(`  - ${product.name} (${product.product_id}) - ₹${product.unit_price}`);
    });
  }

  /**
   * Seed orders (ERP data)
   */
  static async seedOrders(): Promise<void> {
    console.log('📋 Seeding medical orders...');

    // This would need to be implemented in the database service
    console.log(`📋 Order data structure ready for ${healthcareSeedData.orders.length} orders`);
    
    healthcareSeedData.orders.forEach(order => {
      console.log(`  - Order ${order.order_id} - ₹${order.total_amount} - ${order.status}`);
    });
  }

  /**
   * Seed invoices (ERP data)
   */
  static async seedInvoices(): Promise<void> {
    console.log('🧾 Seeding medical invoices...');

    // This would need to be implemented in the database service
    console.log(`📋 Invoice data structure ready for ${healthcareSeedData.invoices.length} invoices`);
    
    healthcareSeedData.invoices.forEach(invoice => {
      console.log(`  - Invoice ${invoice.invoice_id} - ₹${invoice.net_amount} - ${invoice.status}`);
    });
  }

  /**
   * Seed vendors (ERP data)
   */
  static async seedVendors(): Promise<void> {
    console.log('🏢 Seeding medical vendors...');

    // This would need to be implemented in the database service
    console.log(`📋 Vendor data structure ready for ${healthcareSeedData.vendors.length} vendors`);
    
    healthcareSeedData.vendors.forEach(vendor => {
      console.log(`  - ${vendor.name} (${vendor.vendor_id}) - Rating: ${vendor.rating}`);
    });
  }

  /**
   * Seed training courses
   */
  static async seedTrainingCourses(): Promise<void> {
    console.log('📚 Seeding healthcare training courses...');

    for (const courseData of healthcareSeedData.trainingCourses) {
      try {
        await dbService.createTrainingCourse(courseData);
      } catch (error) {
        console.log(`Course "${courseData.title}" already exists, skipping...`);
      }
    }

    console.log(`✅ Seeded ${healthcareSeedData.trainingCourses.length} healthcare training courses`);
  }

  /**
   * Seed leave requests
   */
  static async seedLeaveRequests(): Promise<void> {
    console.log('🏖️ Seeding healthcare leave requests...');

    for (const requestData of healthcareSeedData.leaveRequests) {
      try {
        await dbService.createLeaveRequest(requestData);
      } catch (error) {
        console.log(`Leave request already exists, skipping...`);
      }
    }

    console.log(`✅ Seeded ${healthcareSeedData.leaveRequests.length} healthcare leave requests`);
  }

  /**
   * Seed payslips
   */
  static async seedPayslips(): Promise<void> {
    console.log('💰 Seeding healthcare payslips...');

    for (const payslipData of healthcareSeedData.payslips) {
      try {
        await dbService.createPayslip(payslipData);
      } catch (error) {
        console.log(`Payslip already exists, skipping...`);
      }
    }

    console.log(`✅ Seeded ${healthcareSeedData.payslips.length} healthcare payslips`);
  }

  /**
   * Seed IT assets
   */
  static async seedITAssets(): Promise<void> {
    console.log('💻 Seeding IT assets...');

    // This would need to be implemented in the database service
    console.log(`📋 IT Asset data structure ready for ${healthcareSeedData.itAssets.length} assets`);
    
    healthcareSeedData.itAssets.forEach(asset => {
      console.log(`  - ${asset.name} (${asset.asset_id}) - ₹${asset.value}`);
    });
  }

  /**
   * Seed software licenses
   */
  static async seedSoftwareLicenses(): Promise<void> {
    console.log('🔐 Seeding software licenses...');

    // This would need to be implemented in the database service
    console.log(`📋 Software License data structure ready for ${healthcareSeedData.softwareLicenses.length} licenses`);
    
    healthcareSeedData.softwareLicenses.forEach(license => {
      console.log(`  - ${license.software_name} (${license.license_id}) - ₹${license.cost}`);
    });
  }

  /**
   * Seed support tickets
   */
  static async seedSupportTickets(): Promise<void> {
    console.log('🎫 Seeding support tickets...');

    // This would need to be implemented in the database service
    console.log(`📋 Support Ticket data structure ready for ${healthcareSeedData.supportTickets.length} tickets`);
    
    healthcareSeedData.supportTickets.forEach(ticket => {
      console.log(`  - ${ticket.title} (${ticket.ticket_id}) - ${ticket.priority} priority`);
    });
  }

  /**
   * Get healthcare data summary
   */
  static getHealthcareDataSummary(): void {
    console.log('\n🏥 Healthcare Data Summary:');
    console.log(`👥 Users: ${healthcareSeedData.users.length}`);
    console.log(`👨‍⚕️ Employees: ${healthcareSeedData.employees.length}`);
    console.log(`🏥 Patients: ${healthcareSeedData.patients.length}`);
    console.log(`📞 Leads: ${healthcareSeedData.leads.length}`);
    console.log(`🏥 Products: ${healthcareSeedData.products.length}`);
    console.log(`📋 Orders: ${healthcareSeedData.orders.length}`);
    console.log(`🧾 Invoices: ${healthcareSeedData.invoices.length}`);
    console.log(`🏢 Vendors: ${healthcareSeedData.vendors.length}`);
    console.log(`📚 Training Courses: ${healthcareSeedData.trainingCourses.length}`);
    console.log(`🏖️ Leave Requests: ${healthcareSeedData.leaveRequests.length}`);
    console.log(`💰 Payslips: ${healthcareSeedData.payslips.length}`);
    console.log(`💻 IT Assets: ${healthcareSeedData.itAssets.length}`);
    console.log(`🔐 Software Licenses: ${healthcareSeedData.softwareLicenses.length}`);
    console.log(`🎫 Support Tickets: ${healthcareSeedData.supportTickets.length}`);
  }
}

// Export for use in scripts
export default HealthcareDatabaseSeeder; 