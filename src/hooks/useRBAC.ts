/**
 * RBAC Hook for SmartBizFlow Portal
 * Provides role-based access control functionality
 */

import { useStore } from '../store/useStore';
import { 
  canPerformAction, 
  canAccessModule, 
  hasRole, 
  getRolePermissions,
  getRoleModules,
  roles,
  permissions
} from '../config/rbac';

export const useRBAC = () => {
  const { currentUser } = useStore();
  
  const userRoles = currentUser?.role ? [currentUser.role] : [];
  const userPermissions = currentUser?.permissions || [];
  
  // Check if user can access a specific module
  const canAccess = (moduleName: string): boolean => {
    if (!currentUser) return false;
    
    // Map module names to their corresponding resources
    const moduleMap: { [key: string]: string } = {
      'dashboard': 'dashboard',
      'home': 'dashboard',
      'crm': 'crm',
      'erp': 'erp', 
      'hr': 'hr',
      'hrms': 'hr',
      'assets': 'assets',
      'itAssets': 'assets',
      'gst': 'gst',
      'businessIntelligence': 'bi',
      'bi': 'bi',
      'automation': 'automation',
      'fileManagement': 'files',
      'files': 'files',
      'userManagement': 'users',
      'users': 'users',
      'reports': 'reports',
      'settings': 'settings'
    };
    
    const resource = moduleMap[moduleName] || moduleName;
    
    // Check if user has at least read access to the module
    return canPerformAction(userRoles, resource, 'read') || canAccessModule(userRoles, moduleName);
  };
  
  // Check if user can perform a specific action on a resource
  const canPerform = (resource: string, action: string): boolean => {
    return canPerformAction(userRoles, resource, action);
  };
  
  // Check if user has a specific role
  const hasUserRole = (roleName: string): boolean => {
    return hasRole(userRoles, roleName);
  };
  
  // Check if user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    return userPermissions.includes(permissionName) || userPermissions.includes('*');
  };
  
  // Get all permissions for the current user
  const getUserPermissions = (): string[] => {
    const allPermissions: string[] = [];
    
    userRoles.forEach((roleName: string) => {
      const rolePermissions = getRolePermissions(roleName);
      rolePermissions.forEach(permission => {
        const permissionKey = `${permission.resource}.${permission.action}`;
        if (!allPermissions.includes(permissionKey)) {
          allPermissions.push(permissionKey);
        }
      });
    });
    
    return allPermissions;
  };
  
  // Get all modules the user can access
  const getUserModules = (): string[] => {
    const allModules: string[] = [];
    
    userRoles.forEach((roleName: string) => {
      const roleModules = getRoleModules(roleName);
      roleModules.forEach(module => {
        if (module === '*' || !allModules.includes(module)) {
          if (module === '*') {
            // User has access to all modules
            return ['dashboard', 'crm', 'erp', 'hr', 'itAssets', 'gst', 'businessIntelligence', 'automation', 'fileManagement', 'userManagement', 'reports', 'settings'];
          } else {
            allModules.push(module);
          }
        }
      });
    });
    
    return allModules;
  };
  
  // Check if user is admin
  const isAdmin = (): boolean => {
    return hasUserRole('admin') || hasUserRole('superAdmin');
  };
  
  // Check if user is super admin
  const isSuperAdmin = (): boolean => {
    return hasUserRole('superAdmin');
  };
  
  // Check if user is manager
  const isManager = (): boolean => {
    return hasUserRole('manager') || hasUserRole('crmManager') || hasUserRole('hrManager') || hasUserRole('itManager');
  };
  
  // Check if user is employee
  const isEmployee = (): boolean => {
    return hasUserRole('employee');
  };
  
  // Get user's highest priority role
  const getHighestRole = (): string | null => {
    if (!userRoles.length) return null;
    
    let highestRole = userRoles[0];
    let highestPriority = roles[userRoles[0]]?.priority || 0;
    
    userRoles.forEach((roleName: string) => {
      const role = roles[roleName];
      if (role && role.priority > highestPriority) {
        highestPriority = role.priority;
        highestRole = roleName;
      }
    });
    
    return highestRole;
  };
  
  // Check if user can manage other users
  const canManageUsers = (): boolean => {
    return canPerform('users', 'admin') || canPerform('users', 'write');
  };
  
  // Check if user can manage system settings
  const canManageSettings = (): boolean => {
    return canPerform('settings', 'admin') || canPerform('settings', 'write');
  };
  
  // Check if user can view reports
  const canViewReports = (): boolean => {
    return canPerform('reports', 'read') || canPerform('reports', 'admin');
  };
  
  // Check if user can export data
  const canExportData = (): boolean => {
    return hasPermission('export') || isAdmin();
  };
  
  // Check if user can import data
  const canImportData = (): boolean => {
    return hasPermission('import') || isAdmin();
  };
  
  // Check if user can delete records
  const canDeleteRecords = (resource: string): boolean => {
    return canPerform(resource, 'delete') || canPerform(resource, 'admin');
  };
  
  // Check if user can create records
  const canCreateRecords = (resource: string): boolean => {
    return canPerform(resource, 'create') || canPerform(resource, 'admin');
  };
  
  // Check if user can edit records
  const canEditRecords = (resource: string): boolean => {
    return canPerform(resource, 'update') || canPerform(resource, 'admin');
  };
  
  // Check if user can view records
  const canViewRecords = (resource: string): boolean => {
    return canPerform(resource, 'read') || canPerform(resource, 'admin');
  };
  
  return {
    // User roles and permissions
    userRoles,
    userPermissions,
    getUserPermissions,
    getUserModules,
    
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
    getHighestRole,
    
    // Specific permission checks
    canManageUsers,
    canManageSettings,
    canViewReports,
    canExportData,
    canImportData,
    
    // Resource-specific checks
    canDeleteRecords,
    canCreateRecords,
    canEditRecords,
    canViewRecords
  };
}; 