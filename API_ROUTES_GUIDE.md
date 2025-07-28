# SmartBizFlow API Routes Guide

## Overview

This guide provides comprehensive documentation for all API routes in the SmartBizFlow application. The application uses a centralized routing system with both frontend routes (for navigation) and backend API routes (for data operations).

## Table of Contents

1. [Frontend Routes Configuration](#frontend-routes-configuration)
2. [Backend API Routes](#backend-api-routes)
3. [API Service Layer](#api-service-layer)
4. [Usage Examples](#usage-examples)
5. [Authentication](#authentication)
6. [Error Handling](#error-handling)

## Frontend Routes Configuration

### Location: `src/config/routes.ts`

The frontend routes are configured in a centralized file that defines all navigation paths, components, and metadata.

### Route Structure

```typescript
export interface RouteConfig {
  path: string;                    // URL path
  component: React.LazyExoticComponent<React.ComponentType<any>>; // Lazy-loaded component
  title: string;                   // Display title
  description: string;             // Route description
  module: 'dashboard' | 'crm' | 'erp' | 'hr' | 'it-asset' | 'gst' | 'common';
  icon?: string;                   // Icon for navigation
  permissions?: string[];          // Required permissions
  exact?: boolean;                 // Exact path matching
}
```

### Available Frontend Routes

#### Dashboard Routes
- `/` - Main dashboard
- `/dashboard` - Dashboard overview
- `/home` - Welcome page

#### CRM Routes
- `/crm` - CRM overview
- `/crm/overview` - CRM overview (alias)
- `/crm/leads` - Leads management
- `/crm/customers` - Customer management

#### ERP Routes
- `/erp` - ERP overview
- `/erp/overview` - ERP overview (alias)
- `/erp/products` - Products management
- `/erp/orders` - Orders management
- `/erp/invoices` - Invoice management
- `/erp/vendors` - Vendor management

#### HR Routes
- `/hr` - HR dashboard
- `/hr/dashboard` - HR dashboard (alias)
- `/hr/employees` - Employee management
- `/hr/attendance` - Attendance management
- `/hr/leave` - Leave management
- `/hr/payroll` - Payroll management
- `/hr/performance` - Performance management
- `/hr/recruitment` - Recruitment management
- `/hr/training` - Training management
- `/hr/self-service` - Employee self-service
- `/hr/onboarding` - Onboarding management
- `/hr/offboarding` - Offboarding management
- `/hr/benefits` - Benefits administration
- `/hr/workflow` - Workflow automation
- `/hr/reports` - HR reports

#### IT Asset Portal Routes
- `/assets` - IT Asset dashboard
- `/assets/dashboard` - IT Asset dashboard (alias)
- `/assets/management` - Asset management
- `/assets/tracking` - Asset tracking
- `/assets/maintenance` - Maintenance management
- `/assets/software` - Software licenses
- `/assets/inventory` - IT inventory
- `/assets/system` - System management
- `/assets/access` - Access management
- `/assets/support` - Support tickets
- `/assets/reports` - Asset reports

#### GST & Compliance Routes
- `/gst` - GST management
- `/gst/invoice` - GST invoice

#### Common Routes
- `/reports` - Reports
- `/business-intelligence` - Business intelligence
- `/automation` - Automation hub
- `/files` - File management
- `/users` - User management
- `/settings` - Settings
- `/pricing` - Pricing

## Backend API Routes

### Location: `src/config/apiRoutes.ts`

The backend API routes define all the endpoints for data operations, organized by module.

### API Route Structure

```typescript
export interface ApiRoute {
  path: string;                    // API endpoint path
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;             // Endpoint description
  module: 'auth' | 'dashboard' | 'crm' | 'erp' | 'hr' | 'it-asset' | 'gst' | 'common';
  requiresAuth: boolean;           // Authentication required
  permissions?: string[];          // Required permissions
}
```

### Base URL
All API routes use the base URL: `/api/v1`

### Available API Routes by Module

#### Authentication Routes (`/api/v1/auth/*`)
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/2fa/enable` - Enable 2FA
- `POST /auth/2fa/verify` - Verify 2FA
- `POST /auth/password/reset` - Reset password
- `POST /auth/password/change` - Change password

#### Dashboard Routes (`/api/v1/dashboard/*`)
- `GET /dashboard/overview` - Get dashboard overview
- `GET /dashboard/kpis` - Get KPIs
- `GET /dashboard/analytics` - Get analytics
- `GET /dashboard/notifications` - Get notifications

#### CRM Routes (`/api/v1/crm/*`)
- `GET /crm/leads` - Get all leads
- `POST /crm/leads` - Create lead
- `GET /crm/leads/:id` - Get lead by ID
- `PUT /crm/leads/:id` - Update lead
- `DELETE /crm/leads/:id` - Delete lead
- `POST /crm/leads/:id/convert` - Convert lead to customer
- `GET /crm/customers` - Get all customers
- `POST /crm/customers` - Create customer
- `GET /crm/customers/:id` - Get customer by ID
- `PUT /crm/customers/:id` - Update customer
- `DELETE /crm/customers/:id` - Delete customer
- `GET /crm/customers/:id/contacts` - Get customer contacts
- `GET /crm/customers/:id/opportunities` - Get customer opportunities

#### ERP Routes (`/api/v1/erp/*`)
- `GET /erp/products` - Get all products
- `POST /erp/products` - Create product
- `GET /erp/products/:id` - Get product by ID
- `PUT /erp/products/:id` - Update product
- `DELETE /erp/products/:id` - Delete product
- `GET /erp/products/:id/inventory` - Get product inventory
- `GET /erp/orders` - Get all orders
- `POST /erp/orders` - Create order
- `GET /erp/orders/:id` - Get order by ID
- `PUT /erp/orders/:id` - Update order
- `PATCH /erp/orders/:id/status` - Update order status
- `GET /erp/invoices` - Get all invoices
- `POST /erp/invoices` - Create invoice
- `GET /erp/invoices/:id` - Get invoice by ID
- `PUT /erp/invoices/:id` - Update invoice
- `POST /erp/invoices/:id/generate-pdf` - Generate invoice PDF
- `GET /erp/vendors` - Get all vendors
- `POST /erp/vendors` - Create vendor
- `GET /erp/vendors/:id` - Get vendor by ID
- `PUT /erp/vendors/:id` - Update vendor
- `DELETE /erp/vendors/:id` - Delete vendor

#### HR Routes (`/api/v1/hr/*`)
- `GET /hr/employees` - Get all employees
- `POST /hr/employees` - Create employee
- `GET /hr/employees/:id` - Get employee by ID
- `PUT /hr/employees/:id` - Update employee
- `DELETE /hr/employees/:id` - Delete employee
- `GET /hr/attendance` - Get attendance records
- `POST /hr/attendance/check-in` - Employee check-in
- `POST /hr/attendance/check-out` - Employee check-out
- `PUT /hr/attendance/:id` - Update attendance
- `GET /hr/leave/requests` - Get leave requests
- `POST /hr/leave/requests` - Create leave request
- `PUT /hr/leave/requests/:id` - Update leave request
- `POST /hr/leave/requests/:id/approve` - Approve leave request
- `POST /hr/leave/requests/:id/reject` - Reject leave request
- `GET /hr/payroll` - Get payroll records
- `POST /hr/payroll/generate` - Generate payroll
- `GET /hr/payroll/:id` - Get payroll by ID
- `POST /hr/payroll/:id/process` - Process payroll
- `GET /hr/performance/reviews` - Get performance reviews
- `POST /hr/performance/reviews` - Create performance review
- `PUT /hr/performance/reviews/:id` - Update performance review
- `GET /hr/recruitment/jobs` - Get job postings
- `POST /hr/recruitment/jobs` - Create job posting
- `GET /hr/recruitment/applications` - Get job applications
- `PUT /hr/recruitment/applications/:id` - Update application status
- `GET /hr/training/courses` - Get training courses
- `POST /hr/training/courses` - Create training course
- `GET /hr/training/enrollments` - Get training enrollments
- `POST /hr/training/enrollments` - Enroll in training
- `GET /hr/onboarding/checklists` - Get onboarding checklists
- `POST /hr/onboarding/processes` - Start onboarding process
- `POST /hr/offboarding/processes` - Start offboarding process
- `GET /hr/benefits` - Get employee benefits
- `POST /hr/benefits/enroll` - Enroll in benefits
- `GET /hr/workflows` - Get HR workflows
- `POST /hr/workflows` - Create HR workflow

#### IT Asset Routes (`/api/v1/assets/*`)
- `GET /assets` - Get all IT assets
- `POST /assets` - Create IT asset
- `GET /assets/:id` - Get asset by ID
- `PUT /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset
- `GET /assets/tracking/locations` - Get asset locations
- `GET /assets/tracking/movements` - Get asset movements
- `POST /assets/tracking/scan` - Scan asset QR code
- `GET /assets/maintenance/schedules` - Get maintenance schedules
- `POST /assets/maintenance/schedules` - Create maintenance schedule
- `GET /assets/maintenance/requests` - Get maintenance requests
- `POST /assets/maintenance/requests` - Create maintenance request
- `GET /assets/software/licenses` - Get software licenses
- `POST /assets/software/licenses` - Add software license
- `PUT /assets/software/licenses/:id` - Update software license
- `GET /assets/inventory` - Get IT inventory
- `GET /assets/inventory/stock` - Get stock levels
- `GET /assets/inventory/orders` - Get inventory orders
- `POST /assets/inventory/orders` - Create inventory order
- `GET /assets/systems` - Get system environments
- `POST /assets/systems` - Create system environment
- `GET /assets/access/requests` - Get access requests
- `POST /assets/access/requests` - Create access request
- `POST /assets/access/requests/:id/approve` - Approve access request
- `GET /assets/support/tickets` - Get support tickets
- `POST /assets/support/tickets` - Create support ticket
- `PUT /assets/support/tickets/:id` - Update support ticket
- `POST /assets/support/tickets/:id/close` - Close support ticket

#### GST Routes (`/api/v1/gst/*`)
- `GET /gst/invoices` - Get GST invoices
- `POST /gst/invoices` - Create GST invoice
- `GET /gst/invoices/:id` - Get GST invoice by ID
- `PUT /gst/invoices/:id` - Update GST invoice
- `POST /gst/invoices/:id/generate-pdf` - Generate GST invoice PDF
- `GET /gst/returns` - Get GST returns
- `POST /gst/returns` - File GST return

#### Common Routes (`/api/v1/*`)
- `GET /reports` - Get available reports
- `POST /reports/generate` - Generate report
- `GET /reports/:id/download` - Download report
- `GET /bi/dashboard` - Get BI dashboard data
- `GET /bi/analytics` - Get analytics data
- `GET /bi/predictions` - Get predictive analytics
- `GET /files` - Get files
- `POST /files/upload` - Upload file
- `GET /files/:id` - Download file
- `DELETE /files/:id` - Delete file
- `GET /users` - Get all users
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PUT /users/:id/permissions` - Update user permissions
- `GET /settings` - Get system settings
- `PUT /settings` - Update system settings
- `POST /settings/backup` - Create system backup
- `POST /settings/restore` - Restore system from backup

## API Service Layer

### Location: `src/services/apiService.ts`

The API service layer provides a centralized interface for making HTTP requests to the backend API.

### Features

- **Authentication Management**: Automatic token handling
- **Retry Logic**: Automatic retry with exponential backoff
- **Error Handling**: Comprehensive error handling
- **Type Safety**: TypeScript interfaces for all responses
- **Request/Response Interceptors**: Customizable request/response handling

### Basic Usage

```typescript
import apiService from '../services/apiService';

// Authentication
const loginResponse = await apiService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get data
const leadsResponse = await apiService.getLeads();
if (leadsResponse.success) {
  console.log('Leads:', leadsResponse.data);
}

// Create data
const newLeadResponse = await apiService.createLead({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});

// Update data
const updateResponse = await apiService.updateLead('123', {
  status: 'qualified'
});

// Delete data
const deleteResponse = await apiService.deleteLead('123');
```

## Usage Examples

### 1. CRM Lead Management

```typescript
// Get all leads
const leads = await apiService.getLeads();

// Create a new lead
const newLead = await apiService.createLead({
  name: 'Jane Smith',
  email: 'jane@company.com',
  phone: '+1234567890',
  company: 'Tech Corp',
  source: 'website',
  status: 'new'
});

// Update lead status
await apiService.updateLead(newLead.data.id, {
  status: 'contacted',
  notes: 'Called and left voicemail'
});

// Convert lead to customer
await apiService.convertLead(newLead.data.id);
```

### 2. HR Employee Management

```typescript
// Get all employees
const employees = await apiService.getEmployees();

// Create new employee
const newEmployee = await apiService.createEmployee({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  department: 'Engineering',
  position: 'Software Developer',
  hireDate: '2024-01-15',
  salary: 75000
});

// Check in attendance
await apiService.checkIn();

// Create leave request
const leaveRequest = await apiService.createLeaveRequest({
  employeeId: newEmployee.data.id,
  startDate: '2024-02-01',
  endDate: '2024-02-05',
  type: 'vacation',
  reason: 'Family vacation'
});
```

### 3. ERP Product Management

```typescript
// Get all products
const products = await apiService.getProducts();

// Create new product
const newProduct = await apiService.createProduct({
  name: 'Premium Widget',
  sku: 'WID-001',
  description: 'High-quality widget for industrial use',
  price: 299.99,
  cost: 150.00,
  category: 'Industrial',
  supplier: 'Widget Co.',
  stockQuantity: 100
});

// Update product inventory
await apiService.updateProduct(newProduct.data.id, {
  stockQuantity: 95,
  lastUpdated: new Date().toISOString()
});
```

### 4. IT Asset Management

```typescript
// Get all assets
const assets = await apiService.getAssets();

// Create new asset
const newAsset = await apiService.createAsset({
  name: 'Dell Latitude 5520',
  type: 'laptop',
  serialNumber: 'DL123456789',
  model: 'Latitude 5520',
  manufacturer: 'Dell',
  purchaseDate: '2024-01-10',
  warrantyExpiry: '2027-01-10',
  assignedTo: 'john.doe@company.com',
  location: 'Office A-101'
});

// Create maintenance request
await apiService.createMaintenanceRequest({
  assetId: newAsset.data.id,
  type: 'preventive',
  description: 'Regular cleaning and inspection',
  scheduledDate: '2024-02-15',
  priority: 'medium'
});
```

## Authentication

### Login Flow

```typescript
// Login with credentials
const loginResponse = await apiService.login({
  email: 'user@example.com',
  password: 'password123'
});

if (loginResponse.success) {
  // Token is automatically stored
  console.log('Logged in successfully');
  console.log('User:', loginResponse.data.user);
} else {
  console.error('Login failed:', loginResponse.error);
}
```

### Two-Factor Authentication

```typescript
// Enable 2FA
const enable2FAResponse = await apiService.enable2FA();
if (enable2FAResponse.success) {
  // Show QR code to user
  console.log('QR Code:', enable2FAResponse.data.qrCode);
}

// Verify 2FA code
const verifyResponse = await apiService.verify2FA('123456');
if (verifyResponse.success) {
  console.log('2FA enabled successfully');
}
```

### Password Management

```typescript
// Reset password
await apiService.resetPassword('user@example.com');

// Change password
await apiService.changePassword({
  currentPassword: 'oldpassword',
  newPassword: 'newpassword123'
});
```

## Error Handling

### Response Structure

All API responses follow this structure:

```typescript
interface ApiResponse<T = any> {
  success: boolean;        // Whether the request was successful
  data?: T;               // Response data (if successful)
  message?: string;       // Success message
  error?: string;         // Error message (if failed)
  status?: number;        // HTTP status code
}
```

### Error Handling Example

```typescript
try {
  const response = await apiService.getLeads();
  
  if (response.success) {
    // Handle success
    console.log('Leads:', response.data);
  } else {
    // Handle API error
    console.error('API Error:', response.error);
    console.error('Status:', response.status);
  }
} catch (error) {
  // Handle network/other errors
  console.error('Network Error:', error);
}
```

### Common Error Scenarios

1. **Authentication Errors (401)**
   - Token expired or invalid
   - User not logged in
   - Insufficient permissions

2. **Validation Errors (400)**
   - Missing required fields
   - Invalid data format
   - Business rule violations

3. **Not Found Errors (404)**
   - Resource doesn't exist
   - Invalid ID provided

4. **Server Errors (500)**
   - Internal server error
   - Database connection issues

## Best Practices

1. **Always check response.success** before accessing response.data
2. **Use TypeScript interfaces** for type safety
3. **Handle errors gracefully** with user-friendly messages
4. **Implement loading states** for better UX
5. **Use retry logic** for network failures
6. **Cache frequently accessed data** when appropriate
7. **Validate data** before sending to API
8. **Use proper HTTP methods** (GET, POST, PUT, DELETE)
9. **Include proper headers** for authentication
10. **Log errors** for debugging purposes

## Testing

### Unit Testing API Service

```typescript
import { renderHook } from '@testing-library/react-hooks';
import apiService from '../services/apiService';

describe('API Service', () => {
  test('should login successfully', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await apiService.login(credentials);
    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('token');
  });
  
  test('should handle login failure', async () => {
    const credentials = {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    };
    
    const response = await apiService.login(credentials);
    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
  });
});
```

This comprehensive API routes configuration provides a solid foundation for the SmartBizFlow application, enabling seamless communication between the frontend and backend while maintaining type safety and proper error handling. 