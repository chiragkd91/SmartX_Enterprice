/**
 * API Routes Configuration for Smart ERP + CRM + HR + IT Asset Portal
 * Comprehensive API endpoint definitions for all modules
 */

export interface ApiRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  module: 'auth' | 'dashboard' | 'crm' | 'erp' | 'hr' | 'it-asset' | 'gst' | 'common';
  requiresAuth: boolean;
  permissions?: string[];
}

export const API_BASE_URL = '/api/v1';

// Authentication Routes
export const authRoutes: ApiRoute[] = [
  {
    path: `${API_BASE_URL}/auth/login`,
    method: 'POST',
    description: 'User login with credentials',
    module: 'auth',
    requiresAuth: false
  },
  {
    path: `${API_BASE_URL}/auth/logout`,
    method: 'POST',
    description: 'User logout',
    module: 'auth',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/auth/refresh`,
    method: 'POST',
    description: 'Refresh authentication token',
    module: 'auth',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/auth/2fa/enable`,
    method: 'POST',
    description: 'Enable two-factor authentication',
    module: 'auth',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/auth/2fa/verify`,
    method: 'POST',
    description: 'Verify two-factor authentication code',
    module: 'auth',
    requiresAuth: false
  },
  {
    path: `${API_BASE_URL}/auth/password/reset`,
    method: 'POST',
    description: 'Request password reset',
    module: 'auth',
    requiresAuth: false
  },
  {
    path: `${API_BASE_URL}/auth/password/change`,
    method: 'POST',
    description: 'Change user password',
    module: 'auth',
    requiresAuth: true
  }
];

// Dashboard Routes
export const dashboardRoutes: ApiRoute[] = [
  {
    path: `${API_BASE_URL}/dashboard/overview`,
    method: 'GET',
    description: 'Get dashboard overview metrics',
    module: 'dashboard',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/dashboard/kpis`,
    method: 'GET',
    description: 'Get key performance indicators',
    module: 'dashboard',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/dashboard/analytics`,
    method: 'GET',
    description: 'Get dashboard analytics data',
    module: 'dashboard',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/dashboard/notifications`,
    method: 'GET',
    description: 'Get user notifications',
    module: 'dashboard',
    requiresAuth: true
  }
];

// CRM Routes
export const crmRoutes: ApiRoute[] = [
  // Leads Management
  {
    path: `${API_BASE_URL}/crm/leads`,
    method: 'GET',
    description: 'Get all leads',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/leads`,
    method: 'POST',
    description: 'Create new lead',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/leads/:id`,
    method: 'GET',
    description: 'Get lead by ID',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/leads/:id`,
    method: 'PUT',
    description: 'Update lead',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/leads/:id`,
    method: 'DELETE',
    description: 'Delete lead',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/leads/:id/convert`,
    method: 'POST',
    description: 'Convert lead to customer',
    module: 'crm',
    requiresAuth: true
  },

  // Customers Management
  {
    path: `${API_BASE_URL}/crm/customers`,
    method: 'GET',
    description: 'Get all customers',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/customers`,
    method: 'POST',
    description: 'Create new customer',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/customers/:id`,
    method: 'GET',
    description: 'Get customer by ID',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/customers/:id`,
    method: 'PUT',
    description: 'Update customer',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/customers/:id`,
    method: 'DELETE',
    description: 'Delete customer',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/customers/:id/contacts`,
    method: 'GET',
    description: 'Get customer contacts',
    module: 'crm',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/crm/customers/:id/opportunities`,
    method: 'GET',
    description: 'Get customer opportunities',
    module: 'crm',
    requiresAuth: true
  }
];

// ERP Routes
export const erpRoutes: ApiRoute[] = [
  // Products Management
  {
    path: `${API_BASE_URL}/erp/products`,
    method: 'GET',
    description: 'Get all products',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/products`,
    method: 'POST',
    description: 'Create new product',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/products/:id`,
    method: 'GET',
    description: 'Get product by ID',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/products/:id`,
    method: 'PUT',
    description: 'Update product',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/products/:id`,
    method: 'DELETE',
    description: 'Delete product',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/products/:id/inventory`,
    method: 'GET',
    description: 'Get product inventory',
    module: 'erp',
    requiresAuth: true
  },

  // Orders Management
  {
    path: `${API_BASE_URL}/erp/orders`,
    method: 'GET',
    description: 'Get all orders',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/orders`,
    method: 'POST',
    description: 'Create new order',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/orders/:id`,
    method: 'GET',
    description: 'Get order by ID',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/orders/:id`,
    method: 'PUT',
    description: 'Update order',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/orders/:id/status`,
    method: 'PATCH',
    description: 'Update order status',
    module: 'erp',
    requiresAuth: true
  },

  // Invoice Management
  {
    path: `${API_BASE_URL}/erp/invoices`,
    method: 'GET',
    description: 'Get all invoices',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/invoices`,
    method: 'POST',
    description: 'Create new invoice',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/invoices/:id`,
    method: 'GET',
    description: 'Get invoice by ID',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/invoices/:id`,
    method: 'PUT',
    description: 'Update invoice',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/invoices/:id/generate-pdf`,
    method: 'POST',
    description: 'Generate invoice PDF',
    module: 'erp',
    requiresAuth: true
  },

  // Vendor Management
  {
    path: `${API_BASE_URL}/erp/vendors`,
    method: 'GET',
    description: 'Get all vendors',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/vendors`,
    method: 'POST',
    description: 'Create new vendor',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/vendors/:id`,
    method: 'GET',
    description: 'Get vendor by ID',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/vendors/:id`,
    method: 'PUT',
    description: 'Update vendor',
    module: 'erp',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/erp/vendors/:id`,
    method: 'DELETE',
    description: 'Delete vendor',
    module: 'erp',
    requiresAuth: true
  }
];

// HR Routes
export const hrRoutes: ApiRoute[] = [
  // Employee Management
  {
    path: `${API_BASE_URL}/hr/employees`,
    method: 'GET',
    description: 'Get all employees',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/employees`,
    method: 'POST',
    description: 'Create new employee',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/employees/:id`,
    method: 'GET',
    description: 'Get employee by ID',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/employees/:id`,
    method: 'PUT',
    description: 'Update employee',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/employees/:id`,
    method: 'DELETE',
    description: 'Delete employee',
    module: 'hr',
    requiresAuth: true
  },

  // Attendance Management
  {
    path: `${API_BASE_URL}/hr/attendance`,
    method: 'GET',
    description: 'Get attendance records',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/attendance/check-in`,
    method: 'POST',
    description: 'Employee check-in',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/attendance/check-out`,
    method: 'POST',
    description: 'Employee check-out',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/attendance/:id`,
    method: 'PUT',
    description: 'Update attendance record',
    module: 'hr',
    requiresAuth: true
  },

  // Leave Management
  {
    path: `${API_BASE_URL}/hr/leave/requests`,
    method: 'GET',
    description: 'Get leave requests',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/leave/requests`,
    method: 'POST',
    description: 'Create leave request',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/leave/requests/:id`,
    method: 'PUT',
    description: 'Update leave request',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/leave/requests/:id/approve`,
    method: 'POST',
    description: 'Approve leave request',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/leave/requests/:id/reject`,
    method: 'POST',
    description: 'Reject leave request',
    module: 'hr',
    requiresAuth: true
  },

  // Payroll Management
  {
    path: `${API_BASE_URL}/hr/payroll`,
    method: 'GET',
    description: 'Get payroll records',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/payroll/generate`,
    method: 'POST',
    description: 'Generate payroll',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/payroll/:id`,
    method: 'GET',
    description: 'Get payroll by ID',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/payroll/:id/process`,
    method: 'POST',
    description: 'Process payroll',
    module: 'hr',
    requiresAuth: true
  },

  // Performance Management
  {
    path: `${API_BASE_URL}/hr/performance/reviews`,
    method: 'GET',
    description: 'Get performance reviews',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/performance/reviews`,
    method: 'POST',
    description: 'Create performance review',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/performance/reviews/:id`,
    method: 'PUT',
    description: 'Update performance review',
    module: 'hr',
    requiresAuth: true
  },

  // Recruitment Management
  {
    path: `${API_BASE_URL}/hr/recruitment/jobs`,
    method: 'GET',
    description: 'Get job postings',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/recruitment/jobs`,
    method: 'POST',
    description: 'Create job posting',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/recruitment/applications`,
    method: 'GET',
    description: 'Get job applications',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/recruitment/applications/:id`,
    method: 'PUT',
    description: 'Update application status',
    module: 'hr',
    requiresAuth: true
  },

  // Training Management
  {
    path: `${API_BASE_URL}/hr/training/courses`,
    method: 'GET',
    description: 'Get training courses',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/training/courses`,
    method: 'POST',
    description: 'Create training course',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/training/enrollments`,
    method: 'GET',
    description: 'Get training enrollments',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/training/enrollments`,
    method: 'POST',
    description: 'Enroll in training course',
    module: 'hr',
    requiresAuth: true
  },

  // Onboarding/Offboarding
  {
    path: `${API_BASE_URL}/hr/onboarding/checklists`,
    method: 'GET',
    description: 'Get onboarding checklists',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/onboarding/processes`,
    method: 'POST',
    description: 'Start onboarding process',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/offboarding/processes`,
    method: 'POST',
    description: 'Start offboarding process',
    module: 'hr',
    requiresAuth: true
  },

  // Benefits Administration
  {
    path: `${API_BASE_URL}/hr/benefits`,
    method: 'GET',
    description: 'Get employee benefits',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/benefits/enroll`,
    method: 'POST',
    description: 'Enroll in benefits',
    module: 'hr',
    requiresAuth: true
  },

  // Workflow Automation
  {
    path: `${API_BASE_URL}/hr/workflows`,
    method: 'GET',
    description: 'Get HR workflows',
    module: 'hr',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/hr/workflows`,
    method: 'POST',
    description: 'Create HR workflow',
    module: 'hr',
    requiresAuth: true
  }
];

// IT Asset Portal Routes
export const itAssetRoutes: ApiRoute[] = [
  // Asset Management
  {
    path: `${API_BASE_URL}/assets`,
    method: 'GET',
    description: 'Get all IT assets',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets`,
    method: 'POST',
    description: 'Create new IT asset',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/:id`,
    method: 'GET',
    description: 'Get asset by ID',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/:id`,
    method: 'PUT',
    description: 'Update asset',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/:id`,
    method: 'DELETE',
    description: 'Delete asset',
    module: 'it-asset',
    requiresAuth: true
  },

  // Asset Tracking
  {
    path: `${API_BASE_URL}/assets/tracking/locations`,
    method: 'GET',
    description: 'Get asset locations',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/tracking/movements`,
    method: 'GET',
    description: 'Get asset movements',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/tracking/scan`,
    method: 'POST',
    description: 'Scan asset QR code',
    module: 'it-asset',
    requiresAuth: true
  },

  // Maintenance Management
  {
    path: `${API_BASE_URL}/assets/maintenance/schedules`,
    method: 'GET',
    description: 'Get maintenance schedules',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/maintenance/schedules`,
    method: 'POST',
    description: 'Create maintenance schedule',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/maintenance/requests`,
    method: 'GET',
    description: 'Get maintenance requests',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/maintenance/requests`,
    method: 'POST',
    description: 'Create maintenance request',
    module: 'it-asset',
    requiresAuth: true
  },

  // Software Licenses
  {
    path: `${API_BASE_URL}/assets/software/licenses`,
    method: 'GET',
    description: 'Get software licenses',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/software/licenses`,
    method: 'POST',
    description: 'Add software license',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/software/licenses/:id`,
    method: 'PUT',
    description: 'Update software license',
    module: 'it-asset',
    requiresAuth: true
  },

  // IT Inventory
  {
    path: `${API_BASE_URL}/assets/inventory`,
    method: 'GET',
    description: 'Get IT inventory',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/inventory/stock`,
    method: 'GET',
    description: 'Get stock levels',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/inventory/orders`,
    method: 'GET',
    description: 'Get inventory orders',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/inventory/orders`,
    method: 'POST',
    description: 'Create inventory order',
    module: 'it-asset',
    requiresAuth: true
  },

  // System Management
  {
    path: `${API_BASE_URL}/assets/systems`,
    method: 'GET',
    description: 'Get system environments',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/systems`,
    method: 'POST',
    description: 'Create system environment',
    module: 'it-asset',
    requiresAuth: true
  },

  // Access Management
  {
    path: `${API_BASE_URL}/assets/access/requests`,
    method: 'GET',
    description: 'Get access requests',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/access/requests`,
    method: 'POST',
    description: 'Create access request',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/access/requests/:id/approve`,
    method: 'POST',
    description: 'Approve access request',
    module: 'it-asset',
    requiresAuth: true
  },

  // Support Tickets
  {
    path: `${API_BASE_URL}/assets/support/tickets`,
    method: 'GET',
    description: 'Get support tickets',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/support/tickets`,
    method: 'POST',
    description: 'Create support ticket',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/support/tickets/:id`,
    method: 'PUT',
    description: 'Update support ticket',
    module: 'it-asset',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/assets/support/tickets/:id/close`,
    method: 'POST',
    description: 'Close support ticket',
    module: 'it-asset',
    requiresAuth: true
  }
];

// GST & Compliance Routes
export const gstRoutes: ApiRoute[] = [
  {
    path: `${API_BASE_URL}/gst/invoices`,
    method: 'GET',
    description: 'Get GST invoices',
    module: 'gst',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/gst/invoices`,
    method: 'POST',
    description: 'Create GST invoice',
    module: 'gst',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/gst/invoices/:id`,
    method: 'GET',
    description: 'Get GST invoice by ID',
    module: 'gst',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/gst/invoices/:id`,
    method: 'PUT',
    description: 'Update GST invoice',
    module: 'gst',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/gst/invoices/:id/generate-pdf`,
    method: 'POST',
    description: 'Generate GST invoice PDF',
    module: 'gst',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/gst/returns`,
    method: 'GET',
    description: 'Get GST returns',
    module: 'gst',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/gst/returns`,
    method: 'POST',
    description: 'File GST return',
    module: 'gst',
    requiresAuth: true
  }
];

// Common Routes
export const commonRoutes: ApiRoute[] = [
  // Reports
  {
    path: `${API_BASE_URL}/reports`,
    method: 'GET',
    description: 'Get available reports',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/reports/generate`,
    method: 'POST',
    description: 'Generate report',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/reports/:id/download`,
    method: 'GET',
    description: 'Download report',
    module: 'common',
    requiresAuth: true
  },

  // Business Intelligence
  {
    path: `${API_BASE_URL}/bi/dashboard`,
    method: 'GET',
    description: 'Get BI dashboard data',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/bi/analytics`,
    method: 'GET',
    description: 'Get analytics data',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/bi/predictions`,
    method: 'GET',
    description: 'Get predictive analytics',
    module: 'common',
    requiresAuth: true
  },

  // File Management
  {
    path: `${API_BASE_URL}/files`,
    method: 'GET',
    description: 'Get files',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/files/upload`,
    method: 'POST',
    description: 'Upload file',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/files/:id`,
    method: 'GET',
    description: 'Download file',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/files/:id`,
    method: 'DELETE',
    description: 'Delete file',
    module: 'common',
    requiresAuth: true
  },

  // User Management
  {
    path: `${API_BASE_URL}/users`,
    method: 'GET',
    description: 'Get all users',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/users`,
    method: 'POST',
    description: 'Create new user',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/users/:id`,
    method: 'GET',
    description: 'Get user by ID',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/users/:id`,
    method: 'PUT',
    description: 'Update user',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/users/:id`,
    method: 'DELETE',
    description: 'Delete user',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/users/:id/permissions`,
    method: 'PUT',
    description: 'Update user permissions',
    module: 'common',
    requiresAuth: true
  },

  // Settings
  {
    path: `${API_BASE_URL}/settings`,
    method: 'GET',
    description: 'Get system settings',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/settings`,
    method: 'PUT',
    description: 'Update system settings',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/settings/backup`,
    method: 'POST',
    description: 'Create system backup',
    module: 'common',
    requiresAuth: true
  },
  {
    path: `${API_BASE_URL}/settings/restore`,
    method: 'POST',
    description: 'Restore system from backup',
    module: 'common',
    requiresAuth: true
  }
];

// Combine all routes
export const allApiRoutes: ApiRoute[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...crmRoutes,
  ...erpRoutes,
  ...hrRoutes,
  ...itAssetRoutes,
  ...gstRoutes,
  ...commonRoutes
];

// Helper functions
export const getApiRoutesByModule = (module: ApiRoute['module']): ApiRoute[] => {
  return allApiRoutes.filter(route => route.module === module);
};

export const getApiRouteByPath = (path: string, method: string): ApiRoute | undefined => {
  return allApiRoutes.find(route => route.path === path && route.method === method);
};

export const getApiRoutesByMethod = (method: string): ApiRoute[] => {
  return allApiRoutes.filter(route => route.method === method);
};

export const getProtectedRoutes = (): ApiRoute[] => {
  return allApiRoutes.filter(route => route.requiresAuth);
};

export const getPublicRoutes = (): ApiRoute[] => {
  return allApiRoutes.filter(route => !route.requiresAuth);
};

export default allApiRoutes; 