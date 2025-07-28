/**
 * Role-Based Access Control (RBAC) Configuration for SmartBizFlow Portal
 * Centralized permission management and role definitions
 */

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'admin';
  conditions?: Record<string, any>;
}

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

export interface UserRole {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface RBACConfig {
  roles: Record<string, Role>;
  permissions: Record<string, Permission>;
  defaultRole: string;
  superAdminRole: string;
  guestRole: string;
}

// Permission Definitions
export const permissions: Record<string, Permission> = {
  // Dashboard permissions
  'dashboard.read': { resource: 'dashboard', action: 'read' as const },
  'dashboard.customize': { resource: 'dashboard', action: 'update' as const },
  
  // CRM permissions
  'crm.read': { resource: 'crm', action: 'read' as const },
  'crm.write': { resource: 'crm', action: 'update' as const },
  'crm.create': { resource: 'crm', action: 'create' as const },
  'crm.delete': { resource: 'crm', action: 'delete' as const },
  'crm.admin': { resource: 'crm', action: 'admin' as const },
  
  // ERP permissions
  'erp.read': { resource: 'erp', action: 'read' as const },
  'erp.write': { resource: 'erp', action: 'update' as const },
  'erp.create': { resource: 'erp', action: 'create' as const },
  'erp.delete': { resource: 'erp', action: 'delete' as const },
  'erp.admin': { resource: 'erp', action: 'admin' as const },
  
  // HR permissions
  'hr.read': { resource: 'hr', action: 'read' as const },
  'hr.write': { resource: 'hr', action: 'update' as const },
  'hr.create': { resource: 'hr', action: 'create' as const },
  'hr.delete': { resource: 'hr', action: 'delete' as const },
  'hr.admin': { resource: 'hr', action: 'admin' as const },
  
  // IT Asset permissions
  'assets.read': { resource: 'assets', action: 'read' as const },
  'assets.write': { resource: 'assets', action: 'update' as const },
  'assets.create': { resource: 'assets', action: 'create' as const },
  'assets.delete': { resource: 'assets', action: 'delete' as const },
  'assets.admin': { resource: 'assets', action: 'admin' as const },
  
  // GST permissions
  'gst.read': { resource: 'gst', action: 'read' as const },
  'gst.write': { resource: 'gst', action: 'update' as const },
  'gst.create': { resource: 'gst', action: 'create' as const },
  'gst.delete': { resource: 'gst', action: 'delete' as const },
  'gst.admin': { resource: 'gst', action: 'admin' as const },
  
  // Business Intelligence permissions
  'bi.read': { resource: 'bi', action: 'read' as const },
  'bi.write': { resource: 'bi', action: 'update' as const },
  'bi.admin': { resource: 'bi', action: 'admin' as const },
  
  // Automation permissions
  'automation.read': { resource: 'automation', action: 'read' as const },
  'automation.write': { resource: 'automation', action: 'update' as const },
  'automation.admin': { resource: 'automation', action: 'admin' as const },
  
  // File Management permissions
  'files.read': { resource: 'files', action: 'read' as const },
  'files.write': { resource: 'files', action: 'update' as const },
  'files.create': { resource: 'files', action: 'create' as const },
  'files.delete': { resource: 'files', action: 'delete' as const },
  'files.admin': { resource: 'files', action: 'admin' as const },
  
  // User Management permissions
  'users.read': { resource: 'users', action: 'read' as const },
  'users.write': { resource: 'users', action: 'update' as const },
  'users.create': { resource: 'users', action: 'create' as const },
  'users.delete': { resource: 'users', action: 'delete' as const },
  'users.admin': { resource: 'users', action: 'admin' as const },
  
  // Reports permissions
  'reports.read': { resource: 'reports', action: 'read' as const },
  'reports.write': { resource: 'reports', action: 'update' as const },
  'reports.admin': { resource: 'reports', action: 'admin' as const },
  
  // Settings permissions
  'settings.read': { resource: 'settings', action: 'read' as const },
  'settings.write': { resource: 'settings', action: 'update' as const },
  'settings.admin': { resource: 'settings', action: 'admin' as const }
};

// Role Definitions
export const roles: Record<string, Role> = {
  superAdmin: {
    name: 'superAdmin',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: Object.values(permissions),
    modules: ['*'],
    isSystem: true,
    isActive: true,
    priority: 1000
  },
  
  admin: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'System administrator with most permissions',
    permissions: [
      permissions['dashboard.read'],
      permissions['dashboard.customize'],
      permissions['crm.read'],
      permissions['crm.write'],
      permissions['crm.create'],
      permissions['crm.delete'],
      permissions['erp.read'],
      permissions['erp.write'],
      permissions['erp.create'],
      permissions['erp.delete'],
      permissions['hr.read'],
      permissions['hr.write'],
      permissions['hr.create'],
      permissions['hr.delete'],
      permissions['assets.read'],
      permissions['assets.write'],
      permissions['assets.create'],
      permissions['assets.delete'],
      permissions['gst.read'],
      permissions['gst.write'],
      permissions['gst.create'],
      permissions['gst.delete'],
      permissions['bi.read'],
      permissions['bi.write'],
      permissions['automation.read'],
      permissions['automation.write'],
      permissions['files.read'],
      permissions['files.write'],
      permissions['files.create'],
      permissions['files.delete'],
      permissions['users.read'],
      permissions['users.write'],
      permissions['users.create'],
      permissions['reports.read'],
      permissions['reports.write'],
      permissions['settings.read'],
      permissions['settings.write']
    ],
    modules: ['dashboard', 'crm', 'erp', 'hr', 'assets', 'gst', 'bi', 'automation', 'files', 'users', 'reports', 'settings'],
    isSystem: true,
    isActive: true,
    priority: 900
  },
  
  manager: {
    name: 'manager',
    displayName: 'Manager',
    description: 'Department manager with limited administrative access',
    permissions: [
      permissions['dashboard.read'],
      permissions['dashboard.customize'],
      permissions['crm.read'],
      permissions['crm.write'],
      permissions['crm.create'],
      permissions['erp.read'],
      permissions['erp.write'],
      permissions['erp.create'],
      permissions['hr.read'],
      permissions['hr.write'],
      permissions['hr.create'],
      permissions['assets.read'],
      permissions['assets.write'],
      permissions['gst.read'],
      permissions['gst.write'],
      permissions['bi.read'],
      permissions['automation.read'],
      permissions['files.read'],
      permissions['files.write'],
      permissions['files.create'],
      permissions['users.read'],
      permissions['reports.read'],
      permissions['settings.read']
    ],
    modules: ['dashboard', 'crm', 'erp', 'hr', 'assets', 'gst', 'bi', 'automation', 'files', 'users', 'reports', 'settings'],
    isSystem: true,
    isActive: true,
    priority: 800
  },
  
  employee: {
    name: 'employee',
    displayName: 'Employee',
    description: 'Regular employee with basic access',
    permissions: [
      permissions['dashboard.read'],
      permissions['hr.read'],
      permissions['files.read'],
      permissions['files.write'],
      permissions['files.create']
    ],
    modules: ['dashboard', 'hr/self-service', 'files'],
    isSystem: true,
    isActive: true,
    priority: 100
  },
  
  crmManager: {
    name: 'crmManager',
    displayName: 'CRM Manager',
    description: 'CRM department manager',
    permissions: [
      permissions['dashboard.read'],
      permissions['dashboard.customize'],
      permissions['crm.read'],
      permissions['crm.write'],
      permissions['crm.create'],
      permissions['crm.delete'],
      permissions['bi.read'],
      permissions['reports.read'],
      permissions['files.read'],
      permissions['files.write']
    ],
    modules: ['dashboard', 'crm', 'bi', 'reports', 'files'],
    isSystem: false,
    isActive: true,
    priority: 700
  },
  
  hrManager: {
    name: 'hrManager',
    displayName: 'HR Manager',
    description: 'Human resources department manager',
    permissions: [
      permissions['dashboard.read'],
      permissions['dashboard.customize'],
      permissions['hr.read'],
      permissions['hr.write'],
      permissions['hr.create'],
      permissions['hr.delete'],
      permissions['hr.admin'],
      permissions['users.read'],
      permissions['users.write'],
      permissions['users.create'],
      permissions['reports.read'],
      permissions['files.read'],
      permissions['files.write']
    ],
    modules: ['dashboard', 'hr', 'users', 'reports', 'files'],
    isSystem: false,
    isActive: true,
    priority: 700
  },
  
  itManager: {
    name: 'itManager',
    displayName: 'IT Manager',
    description: 'IT department manager',
    permissions: [
      permissions['dashboard.read'],
      permissions['dashboard.customize'],
      permissions['assets.read'],
      permissions['assets.write'],
      permissions['assets.create'],
      permissions['assets.delete'],
      permissions['assets.admin'],
      permissions['automation.read'],
      permissions['automation.write'],
      permissions['settings.read'],
      permissions['settings.write'],
      permissions['reports.read'],
      permissions['files.read'],
      permissions['files.write']
    ],
    modules: ['dashboard', 'assets', 'automation', 'settings', 'reports', 'files'],
    isSystem: false,
    isActive: true,
    priority: 700
  },
  
  salesRep: {
    name: 'salesRep',
    displayName: 'Sales Representative',
    description: 'Sales team member',
    permissions: [
      permissions['dashboard.read'],
      permissions['crm.read'],
      permissions['crm.write'],
      permissions['crm.create'],
      permissions['files.read'],
      permissions['files.write']
    ],
    modules: ['dashboard', 'crm/leads', 'crm/customers', 'files'],
    isSystem: false,
    isActive: true,
    priority: 200
  },
  
  accountant: {
    name: 'accountant',
    displayName: 'Accountant',
    description: 'Accounting and finance team member',
    permissions: [
      permissions['dashboard.read'],
      permissions['erp.read'],
      permissions['erp.write'],
      permissions['erp.create'],
      permissions['gst.read'],
      permissions['gst.write'],
      permissions['gst.create'],
      permissions['reports.read'],
      permissions['files.read'],
      permissions['files.write']
    ],
    modules: ['dashboard', 'erp/invoices', 'erp/orders', 'gst', 'reports', 'files'],
    isSystem: false,
    isActive: true,
    priority: 300
  },
  
  guest: {
    name: 'guest',
    displayName: 'Guest',
    description: 'Limited access for external users',
    permissions: [
      permissions['dashboard.read']
    ],
    modules: ['dashboard'],
    isSystem: true,
    isActive: true,
    priority: 50
  }
};

// RBAC Configuration
export const rbacConfig: RBACConfig = {
  roles,
  permissions,
  defaultRole: 'employee',
  superAdminRole: 'superAdmin',
  guestRole: 'guest'
};

// RBAC Utility Functions
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('*');
};

export const hasRole = (userRoles: string[], requiredRole: string): boolean => {
  return userRoles.includes(requiredRole);
};

export const getRolePermissions = (roleName: string): Permission[] => {
  const role = roles[roleName];
  return role ? role.permissions : [];
};

export const getRoleModules = (roleName: string): string[] => {
  const role = roles[roleName];
  return role ? role.modules : [];
};

export const canAccessModule = (userRoles: string[], moduleName: string): boolean => {
  for (const roleName of userRoles) {
    const role = roles[roleName];
    if (role && (role.modules.includes('*') || role.modules.includes(moduleName))) {
      return true;
    }
  }
  return false;
};

export const canPerformAction = (userRoles: string[], resource: string, action: string): boolean => {
  for (const roleName of userRoles) {
    const role = roles[roleName];
    if (role) {
      const hasPermission = role.permissions.some(
        permission => 
          permission.resource === resource && 
          (permission.action === action || permission.action === 'admin')
      );
      if (hasPermission) return true;
    }
  }
  return false;
};

export const getAvailableRoles = (): Role[] => {
  return Object.values(roles).filter(role => role.isActive);
};

export const getSystemRoles = (): Role[] => {
  return Object.values(roles).filter(role => role.isSystem && role.isActive);
};

export const getCustomRoles = (): Role[] => {
  return Object.values(roles).filter(role => !role.isSystem && role.isActive);
};

export const createCustomRole = (
  name: string,
  displayName: string,
  description: string,
  permissions: Permission[],
  modules: string[]
): Role => {
  return {
    name,
    displayName,
    description,
    permissions,
    modules,
    isSystem: false,
    isActive: true,
    priority: 100
  };
};

export const updateRole = (roleName: string, updates: Partial<Role>): Role | null => {
  const role = roles[roleName];
  if (!role) return null;
  
  const updatedRole = { ...role, ...updates };
  roles[roleName] = updatedRole;
  return updatedRole;
};

export const deleteRole = (roleName: string): boolean => {
  const role = roles[roleName];
  if (!role || role.isSystem) return false;
  
  delete roles[roleName];
  return true;
};

export default {
  rbacConfig,
  roles,
  permissions,
  hasPermission,
  hasRole,
  getRolePermissions,
  getRoleModules,
  canAccessModule,
  canPerformAction,
  getAvailableRoles,
  getSystemRoles,
  getCustomRoles,
  createCustomRole,
  updateRole,
  deleteRole
}; 