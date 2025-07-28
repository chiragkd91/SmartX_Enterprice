# SmartBizFlow Routing Setup Summary

## Overview

The SmartBizFlow application now has a comprehensive routing system configured with both frontend routes (for navigation) and backend API routes (for data operations). This setup enables seamless access to all screens via routes and provides a centralized API communication layer.

## 🎯 What's Been Configured

### 1. Frontend Routes (`src/config/routes.ts`)
- **Centralized route configuration** with lazy loading
- **All 50+ screens** accessible via URL routes
- **Module-based organization** (CRM, ERP, HR, IT Asset, GST, Common)
- **Navigation menu structure** for sidebar
- **Route metadata** (titles, descriptions, icons, permissions)

### 2. Backend API Routes (`src/config/apiRoutes.ts`)
- **100+ API endpoints** organized by module
- **RESTful design** with proper HTTP methods
- **Authentication requirements** specified
- **Permission-based access control**
- **Comprehensive endpoint documentation**

### 3. API Service Layer (`src/services/apiService.ts`)
- **Centralized HTTP client** with retry logic
- **Authentication management** (token handling)
- **Type-safe methods** for all API operations
- **Error handling** and response formatting
- **Request/response interceptors**

### 4. App Routing (`src/App.tsx`)
- **React Router integration** with HashRouter
- **All routes mapped** to components
- **Catch-all route** for 404 handling
- **Consistent with route configuration**

## 🚀 How to Access Screens via Routes

### Dashboard & Home
```
/                    → Main Dashboard
/dashboard          → Dashboard Overview
/home               → Welcome Page
```

### CRM Module
```
/crm                → CRM Overview
/crm/overview       → CRM Overview (alias)
/crm/leads          → Leads Management
/crm/customers      → Customer Management
```

### ERP Module
```
/erp                → ERP Overview
/erp/overview       → ERP Overview (alias)
/erp/products       → Products Management
/erp/orders         → Orders Management
/erp/invoices       → Invoice Management
/erp/vendors        → Vendor Management
```

### HR Module
```
/hr                 → HR Dashboard
/hr/dashboard       → HR Dashboard (alias)
/hr/employees       → Employee Management
/hr/attendance      → Attendance Management
/hr/leave           → Leave Management
/hr/payroll         → Payroll Management
/hr/performance     → Performance Management
/hr/recruitment     → Recruitment Management
/hr/training        → Training Management
/hr/self-service    → Employee Self Service
/hr/onboarding      → Onboarding Management
/hr/offboarding     → Offboarding Management
/hr/benefits        → Benefits Administration
/hr/workflow        → Workflow Automation
/hr/reports         → HR Reports
```

### IT Asset Portal
```
/assets             → IT Asset Dashboard
/assets/dashboard   → IT Asset Dashboard (alias)
/assets/management  → Asset Management
/assets/tracking    → Asset Tracking
/assets/maintenance → Maintenance Management
/assets/software    → Software Licenses
/assets/inventory   → IT Inventory
/assets/system      → System Management
/assets/access      → Access Management
/assets/support     → Support Tickets
/assets/reports     → Asset Reports
```

### GST & Compliance
```
/gst                → GST Management
/gst/invoice        → GST Invoice
```

### Common Modules
```
/reports            → Reports
/business-intelligence → Business Intelligence
/automation         → Automation Hub
/files              → File Management
/users              → User Management
/settings           → Settings
/pricing            → Pricing
```

## 🔧 API Endpoints Available

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/2fa/*` - Two-factor authentication

### CRM Operations
- `GET/POST/PUT/DELETE /api/v1/crm/leads` - Lead management
- `GET/POST/PUT/DELETE /api/v1/crm/customers` - Customer management

### ERP Operations
- `GET/POST/PUT/DELETE /api/v1/erp/products` - Product management
- `GET/POST/PUT/DELETE /api/v1/erp/orders` - Order management
- `GET/POST/PUT/DELETE /api/v1/erp/invoices` - Invoice management
- `GET/POST/PUT/DELETE /api/v1/erp/vendors` - Vendor management

### HR Operations
- `GET/POST/PUT/DELETE /api/v1/hr/employees` - Employee management
- `GET/POST /api/v1/hr/attendance/*` - Attendance tracking
- `GET/POST/PUT /api/v1/hr/leave/*` - Leave management
- `GET/POST /api/v1/hr/payroll/*` - Payroll operations
- `GET/POST/PUT /api/v1/hr/performance/*` - Performance reviews
- `GET/POST/PUT /api/v1/hr/recruitment/*` - Recruitment
- `GET/POST /api/v1/hr/training/*` - Training management
- `GET/POST /api/v1/hr/onboarding/*` - Onboarding
- `GET/POST /api/v1/hr/offboarding/*` - Offboarding
- `GET/POST /api/v1/hr/benefits/*` - Benefits administration
- `GET/POST /api/v1/hr/workflows` - Workflow automation

### IT Asset Operations
- `GET/POST/PUT/DELETE /api/v1/assets` - Asset management
- `GET/POST /api/v1/assets/tracking/*` - Asset tracking
- `GET/POST /api/v1/assets/maintenance/*` - Maintenance
- `GET/POST/PUT /api/v1/assets/software/*` - Software licenses
- `GET/POST /api/v1/assets/inventory/*` - IT inventory
- `GET/POST /api/v1/assets/systems` - System management
- `GET/POST /api/v1/assets/access/*` - Access management
- `GET/POST/PUT /api/v1/assets/support/*` - Support tickets

### GST Operations
- `GET/POST/PUT /api/v1/gst/invoices` - GST invoice management
- `GET/POST /api/v1/gst/returns` - GST returns

### Common Operations
- `GET/POST /api/v1/reports/*` - Report generation
- `GET /api/v1/bi/*` - Business intelligence
- `GET/POST/DELETE /api/v1/files/*` - File management
- `GET/POST/PUT/DELETE /api/v1/users/*` - User management
- `GET/PUT /api/v1/settings/*` - System settings

## 💻 How to Use the API Service

### Basic Usage
```typescript
import apiService from '../services/apiService';

// Authentication
const loginResponse = await apiService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get data
const leads = await apiService.getLeads();
const employees = await apiService.getEmployees();
const products = await apiService.getProducts();

// Create data
const newLead = await apiService.createLead({
  name: 'John Doe',
  email: 'john@example.com'
});

// Update data
await apiService.updateLead('123', { status: 'qualified' });

// Delete data
await apiService.deleteLead('123');
```

### Error Handling
```typescript
const response = await apiService.getLeads();

if (response.success) {
  console.log('Data:', response.data);
} else {
  console.error('Error:', response.error);
  console.error('Status:', response.status);
}
```

## 🎨 Navigation Structure

The application includes a comprehensive navigation menu with:

### Main Navigation
- Dashboard
- Home

### Module Navigation
- **CRM**: Overview, Leads, Customers
- **ERP**: Overview, Products, Orders, Invoices, Vendors
- **HR Management**: Dashboard, Employees, Attendance, Leave, Payroll, Performance, Recruitment, Training, Self Service, Onboarding, Offboarding, Benefits, Workflow, Reports
- **IT Asset Portal**: Dashboard, Asset Management, Tracking, Maintenance, Software Licenses, Inventory, System Management, Access Management, Support Tickets, Reports
- **GST & Compliance**: GST Invoice

### Common Navigation
- Reports
- Business Intelligence
- Automation
- Files
- Users
- Settings
- Pricing

## 🔐 Security Features

- **Authentication required** for most routes
- **Token-based authentication** with automatic refresh
- **Permission-based access control**
- **Two-factor authentication** support
- **Secure password management**

## 📱 Responsive Design

All routes are accessible on:
- Desktop browsers
- Tablet devices
- Mobile phones
- Progressive Web App (PWA)

## 🚀 Performance Optimizations

- **Lazy loading** of components
- **Code splitting** by modules
- **Caching** of API responses
- **Retry logic** for failed requests
- **Optimized bundle** size

## 📋 Next Steps

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application** at `http://localhost:5173`

3. **Navigate to any route** using the URLs listed above

4. **Test API endpoints** using the service layer

5. **Customize routes** as needed in `src/config/routes.ts`

6. **Add new API endpoints** in `src/config/apiRoutes.ts`

## 📚 Documentation

- **API Routes Guide**: `API_ROUTES_GUIDE.md` - Comprehensive API documentation
- **Route Configuration**: `src/config/routes.ts` - Frontend route definitions
- **API Configuration**: `src/config/apiRoutes.ts` - Backend API definitions
- **Service Layer**: `src/services/apiService.ts` - API communication methods

## ✅ Benefits of This Setup

1. **Centralized Configuration** - All routes in one place
2. **Type Safety** - Full TypeScript support
3. **Scalability** - Easy to add new routes and modules
4. **Maintainability** - Clear separation of concerns
5. **Developer Experience** - Intuitive API and navigation
6. **User Experience** - Direct URL access to any screen
7. **Security** - Proper authentication and authorization
8. **Performance** - Optimized loading and caching

The SmartBizFlow application now has a complete routing system that enables users to access any screen via URL routes while providing a robust API layer for all data operations. This setup ensures scalability, maintainability, and excellent user experience. 