# Role-Based Access Control (RBAC) Implementation Guide

## Overview

SmartBizFlow now features a comprehensive Role-Based Access Control (RBAC) system that provides granular access control across all modules. This implementation ensures that users only have access to the features and data they need based on their organizational role.

## Features Implemented

### 1. Comprehensive Role System

#### Administrative Roles
- **Super Administrator**: Complete system access with all permissions
- **Administrator**: Full access to all modules with administrative capabilities
- **Manager**: Department manager with limited administrative access

#### Department-Specific Manager Roles
- **HR Manager**: Complete access to HRMS module and user management
- **CRM Manager**: Complete access to CRM module and sales analytics
- **ERP Manager**: Complete access to ERP module and business operations
- **IT Manager**: Complete access to IT Assets and system management
- **Finance Manager**: Access to financial modules, ERP, and GST compliance
- **Sales Manager**: Access to CRM module and sales team management

#### Operational Roles
- **Sales Representative**: Access to CRM leads and customer management
- **Accountant**: Access to financial records, ERP invoices, and GST
- **Support Agent**: Access to customer support and asset management
- **Employee**: Basic access to HR self-service and file management
- **Viewer**: Read-only access to reports and dashboards

#### System Roles
- **Guest**: Limited dashboard access for external users

### 2. Permission-Based Access Control

#### Resource-Level Permissions
Each role has specific permissions for different resources:
- **Dashboard**: Read and customize access
- **CRM**: Create, read, update, delete, and admin permissions
- **ERP**: Create, read, update, delete, and admin permissions
- **HR**: Create, read, update, delete, and admin permissions
- **IT Assets**: Create, read, update, delete, and admin permissions
- **GST**: Create, read, update, delete, and admin permissions
- **Business Intelligence**: Read, write, and admin permissions
- **Automation**: Read, write, and admin permissions
- **Files**: Create, read, update, delete, and admin permissions
- **Users**: Create, read, update, delete, and admin permissions
- **Reports**: Read, write, and admin permissions
- **Settings**: Read, write, and admin permissions

### 3. Module Access Control

#### Dynamic Module Assignment
- Roles automatically grant access to relevant modules
- Admin roles have access to all modules (*)
- Department managers have access to their specific modules plus common areas
- Employees have restricted access based on their role requirements

#### Module Mapping
- **dashboard**: Available to all authenticated users
- **crm**: Sales, CRM managers, and admin roles
- **erp**: ERP managers, finance managers, accountants, and admin roles
- **hr**: HR managers, employees (self-service), and admin roles
- **assets**: IT managers, support agents, and admin roles
- **gst**: Finance managers, accountants, and admin roles
- **bi**: Managers and admin roles
- **automation**: IT managers and admin roles
- **files**: All authenticated users
- **users**: HR managers and admin roles
- **reports**: Managers, specialists, and admin roles
- **settings**: IT managers and admin roles

### 4. Enhanced User Management

#### User Creation with Role Assignment
- Create users with specific roles and departments
- Automatic permission assignment based on role
- Password policy enforcement
- Status management (active/inactive)

#### Quick User Creation Templates
- Pre-configured templates for common roles
- Automatic email generation
- Department assignment

#### Role Management Interface
- Visual role assignment interface
- Role comparison and change tracking
- Bulk role management capabilities

### 5. Security Features

#### Permission Validation
- Real-time permission checking
- Resource-level access control
- Action-based permission validation

#### Role Hierarchy
- Priority-based role system
- Inheritance prevention for security
- System role protection

#### Audit and Logging
- Role assignment tracking
- Permission change logging
- Access attempt monitoring

## Technical Implementation

### 1. RBAC Configuration (`src/config/rbac.ts`)

```typescript
// Permission structure
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'admin';
  conditions?: Record<string, any>;
}

// Role structure
export interface Role {
  name: string;
  displayName: string;
  description: string;
  permissions: Permission[];
  modules: string[];
  isSystem: boolean;
  isActive: boolean;
  priority: number;
}
```

### 2. RBAC Hook (`src/hooks/useRBAC.ts`)

The useRBAC hook provides convenient access to role-based functionality:

```typescript
const {
  // Access control checks
  canAccess,
  canPerform,
  hasUserRole,
  hasPermission,
  
  // Role checks
  isAdmin,
  isSuperAdmin,
  isManager,
  isEmployee,
  
  // Resource-specific checks
  canDeleteRecords,
  canCreateRecords,
  canEditRecords,
  canViewRecords
} = useRBAC();
```

### 3. Component Usage

#### Conditional Rendering Based on Permissions
```typescript
{canViewRecords('users') && (
  <Button onClick={() => handleViewUser(user)}>
    View User
  </Button>
)}

{canEditRecords('users') && (
  <Button onClick={() => handleEditUser(user)}>
    Edit User
  </Button>
)}
```

#### Module Access Control
```typescript
{canAccess('userManagement') && (
  <NavigationItem path="/users" icon={Users}>
    User Management
  </NavigationItem>
)}
```

### 4. Role Assignment Component

A dedicated component (`src/components/RoleManagement/RoleAssignment.tsx`) provides:
- Visual role assignment interface
- User role management
- Role comparison and tracking
- Bulk operations

## Usage Examples

### 1. Admin Access
- **Admin users** have access to all modules and can perform all operations
- Can create, edit, and delete users
- Can assign roles to other users
- Can access all reports and analytics

### 2. HR Manager Access
- Complete access to HRMS module
- Can manage employees and HR processes
- Can create and manage users
- Access to HR-specific reports
- Can view basic dashboard and file management

### 3. Employee Access
- Basic dashboard access
- HR self-service features
- File management (create, read, write)
- No administrative capabilities

## Security Considerations

### 1. Role Protection
- System roles cannot be deleted
- Users cannot modify their own roles
- Super admin role has ultimate access

### 2. Permission Validation
- All API endpoints validate permissions
- Frontend components check access before rendering
- Resource-level security enforcement

### 3. Session Management
- Role-based session validation
- Automatic permission refresh
- Session timeout based on role priority

## Setup and Configuration

### 1. Default Users
The system includes pre-configured users for testing:
- **admin@smartbizflow.com** - Administrator role
- **hr@smartbizflow.com** - HR Manager role
- **employee@smartbizflow.com** - Employee role
- Password: `password123` for all default users

### 2. Role Customization
Roles can be customized by modifying the roles configuration:
- Add new permissions
- Modify module access
- Adjust role priorities
- Create custom roles

### 3. Integration
The RBAC system integrates with:
- Authentication system
- Navigation components
- API security
- Database permissions

## Future Enhancements

### 1. Advanced Features (Planned)
- Dynamic permission assignment
- Time-based role restrictions
- Geographic access controls
- Advanced audit logging

### 2. Integration Enhancements
- LDAP/Active Directory integration
- SSO compatibility
- Multi-tenant support
- API-first role management

## Testing

### 1. Role Testing
- Login with different roles to test access
- Verify module visibility
- Test permission enforcement
- Validate role assignment functionality

### 2. Permission Testing
- Test CRUD operations for each role
- Verify resource-level access
- Check administrative functions
- Validate security boundaries

## Troubleshooting

### Common Issues
1. **Permission Denied**: Check if user has required role and permissions
2. **Module Not Visible**: Verify role has module access in configuration
3. **Role Assignment Failed**: Ensure user has admin privileges
4. **Permission Not Working**: Check permission key matches configuration

### Debug Information
- Check browser console for RBAC logs
- Verify user role in store
- Validate permission configuration
- Test with admin user first

This RBAC implementation provides a solid foundation for enterprise-level access control while maintaining flexibility for future enhancements.
