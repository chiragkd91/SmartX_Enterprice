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
  permissions,
  securitySettings,
  validatePassword,
  isRoleElevated,
  requiresMFA,
  canElevateRole,
  getSessionTimeout
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
  
  // Enhanced security functions
  const validateUserPassword = (password: string) => {
    return validatePassword(password);
  };
  
  const isElevatedRole = (): boolean => {
    if (!currentUser) return false;
    return isRoleElevated(currentUser.role);
  };
  
  const userRequiresMFA = (): boolean => {
    if (!currentUser) return false;
    return requiresMFA(currentUser.role);
  };
  
  const canElevateUserRole = (targetRole: string): boolean => {
    if (!currentUser) return false;
    return canElevateRole(currentUser.role, targetRole);
  };
  
  const getUserSessionTimeout = (): number => {
    if (!currentUser) return securitySettings.sessionTimeout;
    return getSessionTimeout(currentUser.role);
  };
  
  // Enhanced permission checks
  const canViewSensitiveData = (): boolean => {
    return isAdmin() || isSuperAdmin() || isElevatedRole();
  };
  
  const canPerformBulkOperations = (): boolean => {
    return isAdmin() || isSuperAdmin();
  };
  
  const canBypassWorkflow = (): boolean => {
    return isSuperAdmin() || (isAdmin() && !isElevatedRole());
  };
  
  const canAccessAuditLogs = (): boolean => {
    return isSuperAdmin() || (isAdmin() && hasPermission('audit.logs'));
  };
  
  const canManageSecuritySettings = (): boolean => {
    return isSuperAdmin();
  };
  
  // Time-based access control
  const isWithinBusinessHours = (): boolean => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Business hours: Monday-Friday, 8 AM - 6 PM
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
  };
  
  const canAccessAfterHours = (): boolean => {
    if (isWithinBusinessHours()) return true;
    return isAdmin() || isSuperAdmin() || hasPermission('access.afterhours');
  };
  
  // Risk assessment
  const assessActionRisk = (resource: string, action: string): 'low' | 'medium' | 'high' | 'critical' => {
    if (action === 'delete' && ['users', 'settings'].includes(resource)) return 'critical';
    if (action === 'admin') return 'high';
    if (['create', 'update'].includes(action) && ['users', 'roles'].includes(resource)) return 'high';
    if (action === 'delete') return 'medium';
    return 'low';
  };
  
  const requiresAdditionalApproval = (resource: string, action: string): boolean => {
    const risk = assessActionRisk(resource, action);
    return risk === 'critical' || (risk === 'high' && !isSuperAdmin());
  };
  
  // Data access patterns
  const canAccessPersonalData = (targetUserId?: string): boolean => {
    if (!currentUser) return false;
    
    // Users can always access their own data
    if (targetUserId === currentUser.id) return true;
    
    // Admin and HR can access personal data
    return isAdmin() || hasUserRole('hrManager') || hasPermission('personal.data.access');
  };
  
  const canAccessFinancialData = (): boolean => {
    return isAdmin() || hasUserRole('financeManager') || hasUserRole('accountant') || hasPermission('financial.data.access');
  };
  
  const canViewSalaryInformation = (targetUserId?: string): boolean => {
    if (!currentUser) return false;
    
    // Users can view their own salary
    if (targetUserId === currentUser.id) return true;
    
    // Only admin, HR managers, and finance can view others' salary
    return isAdmin() || hasUserRole('hrManager') || hasUserRole('financeManager');
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
    canViewRecords,
    
    // Enhanced security functions
    validateUserPassword,
    isElevatedRole,
    userRequiresMFA,
    canElevateUserRole,
    getUserSessionTimeout,
    
    // Enhanced permission checks
    canViewSensitiveData,
    canPerformBulkOperations,
    canBypassWorkflow,
    canAccessAuditLogs,
    canManageSecuritySettings,
    
    // Time-based access
    isWithinBusinessHours,
    canAccessAfterHours,
    
    // Risk assessment
    assessActionRisk,
    requiresAdditionalApproval,
    
    // Data access patterns
    canAccessPersonalData,
    canAccessFinancialData,
    canViewSalaryInformation
  };
}; 