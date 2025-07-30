import dbService from './database.js';

/**
 * Role-Based Access Control (RBAC) System
 * Implements comprehensive permission management for API endpoints
 */

// Define roles and their hierarchical relationships
const ROLE_HIERARCHY = {
  'super_admin': ['admin', 'manager', 'hr', 'employee', 'user'],
  'admin': ['manager', 'hr', 'employee', 'user'],
  'manager': ['employee', 'user'],
  'hr': ['employee', 'user'],
  'employee': ['user'],
  'user': []
};

// Define permissions for different resources and actions
const PERMISSIONS = {
  // User management permissions
  'users.view': ['super_admin', 'admin', 'hr'],
  'users.create': ['super_admin', 'admin'],
  'users.update': ['super_admin', 'admin', 'hr'],
  'users.delete': ['super_admin', 'admin'],
  'users.view_own': ['super_admin', 'admin', 'hr', 'manager', 'employee', 'user'],
  'users.update_own': ['super_admin', 'admin', 'hr', 'manager', 'employee', 'user'],

  // Employee management permissions
  'employees.view': ['super_admin', 'admin', 'hr', 'manager'],
  'employees.create': ['super_admin', 'admin', 'hr'],
  'employees.update': ['super_admin', 'admin', 'hr'],
  'employees.delete': ['super_admin', 'admin'],
  'employees.view_own': ['super_admin', 'admin', 'hr', 'manager', 'employee'],
  'employees.update_own': ['super_admin', 'admin', 'hr', 'employee'],

  // Attendance permissions
  'attendance.view': ['super_admin', 'admin', 'hr', 'manager'],
  'attendance.create': ['super_admin', 'admin', 'hr', 'manager', 'employee'],
  'attendance.update': ['super_admin', 'admin', 'hr', 'manager'],
  'attendance.delete': ['super_admin', 'admin'],
  'attendance.view_own': ['super_admin', 'admin', 'hr', 'manager', 'employee'],
  'attendance.update_own': ['super_admin', 'admin', 'hr', 'employee'],

  // Leave management permissions
  'leaves.view': ['super_admin', 'admin', 'hr', 'manager'],
  'leaves.create': ['super_admin', 'admin', 'hr', 'manager', 'employee'],
  'leaves.update': ['super_admin', 'admin', 'hr', 'manager'],
  'leaves.delete': ['super_admin', 'admin', 'hr'],
  'leaves.approve': ['super_admin', 'admin', 'hr', 'manager'],
  'leaves.view_own': ['super_admin', 'admin', 'hr', 'manager', 'employee'],
  'leaves.update_own': ['super_admin', 'admin', 'hr', 'employee'],

  // Payroll permissions
  'payroll.view': ['super_admin', 'admin', 'hr'],
  'payroll.create': ['super_admin', 'admin', 'hr'],
  'payroll.update': ['super_admin', 'admin', 'hr'],
  'payroll.delete': ['super_admin', 'admin'],
  'payroll.view_own': ['super_admin', 'admin', 'hr', 'manager', 'employee'],

  // Training permissions
  'training.view': ['super_admin', 'admin', 'hr', 'manager', 'employee'],
  'training.create': ['super_admin', 'admin', 'hr'],
  'training.update': ['super_admin', 'admin', 'hr'],
  'training.delete': ['super_admin', 'admin'],
  'training.enroll': ['super_admin', 'admin', 'hr', 'manager', 'employee'],

  // CRM permissions
  'crm.view': ['super_admin', 'admin', 'sales', 'manager'],
  'crm.create': ['super_admin', 'admin', 'sales', 'manager'],
  'crm.update': ['super_admin', 'admin', 'sales', 'manager'],
  'crm.delete': ['super_admin', 'admin', 'sales'],
  'crm.assign': ['super_admin', 'admin', 'sales', 'manager'],

  // Financial permissions
  'finance.view': ['super_admin', 'admin', 'finance', 'manager'],
  'finance.create': ['super_admin', 'admin', 'finance'],
  'finance.update': ['super_admin', 'admin', 'finance'],
  'finance.delete': ['super_admin', 'admin'],

  // IT Asset management permissions
  'assets.view': ['super_admin', 'admin', 'it_support', 'manager'],
  'assets.create': ['super_admin', 'admin', 'it_support'],
  'assets.update': ['super_admin', 'admin', 'it_support'],
  'assets.delete': ['super_admin', 'admin'],

  // Support ticket permissions
  'support.view': ['super_admin', 'admin', 'it_support', 'manager'],
  'support.create': ['super_admin', 'admin', 'it_support', 'manager', 'employee'],
  'support.update': ['super_admin', 'admin', 'it_support'],
  'support.delete': ['super_admin', 'admin'],
  'support.view_own': ['super_admin', 'admin', 'it_support', 'manager', 'employee'],

  // GST and compliance permissions
  'gst.view': ['super_admin', 'admin', 'finance', 'accountant'],
  'gst.create': ['super_admin', 'admin', 'finance', 'accountant'],
  'gst.update': ['super_admin', 'admin', 'finance', 'accountant'],
  'gst.delete': ['super_admin', 'admin'],

  // Analytics permissions
  'analytics.view': ['super_admin', 'admin', 'manager', 'hr', 'finance'],

  // Dashboard permissions
  'dashboard.view': ['super_admin', 'admin', 'manager', 'hr', 'employee'],

  // File upload permissions
  'files.upload': ['super_admin', 'admin', 'hr', 'manager', 'employee'],
  'files.view': ['super_admin', 'admin', 'hr', 'manager', 'employee'],
  'files.delete': ['super_admin', 'admin', 'hr'],

  // Notification permissions
  'notifications.send': ['super_admin', 'admin', 'hr', 'manager'],
  'notifications.broadcast': ['super_admin', 'admin'],

  // Export permissions
  'export': ['super_admin', 'admin', 'hr', 'manager', 'finance'],

  // System administration permissions
  'system.backup': ['super_admin', 'admin'],
  'system.restore': ['super_admin', 'admin'],
  'system.migrate': ['super_admin', 'admin'],
  'system.logs': ['super_admin', 'admin'],
  'system.settings': ['super_admin', 'admin']
};

// Resource ownership rules
const OWNERSHIP_RULES = {
  'users': (user, resource) => user.id === resource.id,
  'employees': (user, resource) => user.id === resource.userId || user.id === resource.id,
  'attendance': (user, resource) => user.id === resource.employeeId,
  'leaves': (user, resource) => user.id === resource.employeeId,
  'payroll': (user, resource) => user.id === resource.employeeId,
  'support_tickets': (user, resource) => user.id === resource.createdBy,
  'files': (user, resource) => user.id === resource.uploadedBy
};

class RBACManager {
  constructor() {
    this.permissions = PERMISSIONS;
    this.roleHierarchy = ROLE_HIERARCHY;
    this.ownershipRules = OWNERSHIP_RULES;
  }

  /**
   * Check if a user has a specific permission
   * @param {Object} user - User object with role information
   * @param {string} permission - Permission to check
   * @param {Object} resource - Optional resource for ownership checks
   * @returns {boolean} - Whether user has permission
   */
  hasPermission(user, permission, resource = null) {
    if (!user || !user.role) {
      return false;
    }

    // Check if permission exists
    if (!this.permissions[permission]) {
      console.warn(`Unknown permission: ${permission}`);
      return false;
    }

    // Check if user's role has the permission
    const allowedRoles = this.permissions[permission];
    const userRole = user.role;

    // Direct role match
    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // Check role hierarchy
    if (this.roleHierarchy[userRole]) {
      const inheritedRoles = this.roleHierarchy[userRole];
      if (inheritedRoles.some(role => allowedRoles.includes(role))) {
        return true;
      }
    }

    // Check ownership-based permissions
    if (resource && permission.endsWith('_own')) {
      const basePermission = permission.replace('_own', '');
      if (this.hasPermission(user, basePermission, resource)) {
        return this.checkOwnership(user, resource);
      }
    }

    return false;
  }

  /**
   * Check if user owns a resource
   * @param {Object} user - User object
   * @param {Object} resource - Resource object
   * @returns {boolean} - Whether user owns the resource
   */
  checkOwnership(user, resource) {
    if (!resource || !resource.type) {
      return false;
    }

    const ownershipRule = this.ownershipRules[resource.type];
    if (!ownershipRule) {
      return false;
    }

    return ownershipRule(user, resource);
  }

  /**
   * Get all permissions for a user role
   * @param {string} role - User role
   * @returns {Array} - Array of permissions
   */
  getRolePermissions(role) {
    const permissions = [];
    
    for (const [permission, allowedRoles] of Object.entries(this.permissions)) {
      if (allowedRoles.includes(role)) {
        permissions.push(permission);
      }
      
      // Check inherited permissions
      if (this.roleHierarchy[role]) {
        const inheritedRoles = this.roleHierarchy[role];
        if (inheritedRoles.some(inheritedRole => allowedRoles.includes(inheritedRole))) {
          permissions.push(permission);
        }
      }
    }
    
    return [...new Set(permissions)]; // Remove duplicates
  }

  /**
   * Check multiple permissions at once
   * @param {Object} user - User object
   * @param {Array} permissions - Array of permissions to check
   * @param {Object} resource - Optional resource
   * @returns {Object} - Object with permission results
   */
  checkPermissions(user, permissions, resource = null) {
    const results = {};
    
    for (const permission of permissions) {
      results[permission] = this.hasPermission(user, permission, resource);
    }
    
    return results;
  }

  /**
   * Middleware factory for Express.js route protection
   * @param {string|Array} permissions - Required permission(s)
   * @param {Object} options - Additional options
   * @returns {Function} - Express middleware function
   */
  authorize(permissions, options = {}) {
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    const requireAll = options.requireAll || false;
    const allowOwnership = options.allowOwnership || false;

    return async (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({ 
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
        }

        // Get resource if specified
        let resource = null;
        if (options.resourceLoader) {
          resource = await options.resourceLoader(req);
        }

        // Check permissions
        const permissionResults = this.checkPermissions(req.user, requiredPermissions, resource);
        
        let hasAccess = false;
        if (requireAll) {
          // User must have ALL permissions
          hasAccess = Object.values(permissionResults).every(result => result === true);
        } else {
          // User must have at least ONE permission
          hasAccess = Object.values(permissionResults).some(result => result === true);
        }

        // Check ownership if allowed and no other permissions match
        if (!hasAccess && allowOwnership && resource) {
          hasAccess = this.checkOwnership(req.user, resource);
        }

        if (!hasAccess) {
          // Log access attempt for security monitoring
          await this.logAccessAttempt(req.user, requiredPermissions, req.path, false);
          
          return res.status(403).json({ 
            error: 'Insufficient permissions',
            code: 'INSUFFICIENT_PERMISSIONS',
            required: requiredPermissions,
            userRole: req.user.role
          });
        }

        // Log successful access
        await this.logAccessAttempt(req.user, requiredPermissions, req.path, true);
        
        next();
      } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ 
          error: 'Authorization check failed',
          code: 'AUTH_CHECK_FAILED'
        });
      }
    };
  }

  /**
   * Log access attempts for security monitoring
   * @param {Object} user - User object
   * @param {Array} permissions - Attempted permissions
   * @param {string} path - Request path
   * @param {boolean} success - Whether access was granted
   */
  async logAccessAttempt(user, permissions, path, success) {
    try {
      await dbService.logAudit({
        userId: user.id,
        action: success ? 'ACCESS_GRANTED' : 'ACCESS_DENIED',
        table: 'rbac_access_log',
        recordId: null,
        oldValues: null,
        newValues: JSON.stringify({
          permissions,
          path,
          userRole: user.role,
          success
        }),
        ipAddress: null, // Would be set by the calling middleware
        userAgent: null  // Would be set by the calling middleware
      });
    } catch (error) {
      console.error('Failed to log access attempt:', error);
    }
  }

  /**
   * Get user's effective permissions (including inherited)
   * @param {Object} user - User object
   * @returns {Array} - Array of effective permissions
   */
  getEffectivePermissions(user) {
    if (!user || !user.role) {
      return [];
    }

    return this.getRolePermissions(user.role);
  }

  /**
   * Check if user can access a specific resource
   * @param {Object} user - User object
   * @param {string} action - Action to perform
   * @param {Object} resource - Resource object
   * @returns {boolean} - Whether access is allowed
   */
  canAccess(user, action, resource) {
    // Try direct permission first
    if (this.hasPermission(user, action)) {
      return true;
    }

    // Try ownership-based permission
    const ownPermission = `${action}_own`;
    if (this.hasPermission(user, ownPermission) && this.checkOwnership(user, resource)) {
      return true;
    }

    return false;
  }

  /**
   * Filter resources based on user permissions
   * @param {Object} user - User object
   * @param {Array} resources - Array of resources
   * @param {string} action - Action to check
   * @returns {Array} - Filtered resources
   */
  filterResources(user, resources, action) {
    return resources.filter(resource => this.canAccess(user, action, resource));
  }

  /**
   * Add custom permission
   * @param {string} permission - Permission name
   * @param {Array} roles - Allowed roles
   */
  addPermission(permission, roles) {
    this.permissions[permission] = roles;
  }

  /**
   * Remove permission
   * @param {string} permission - Permission name
   */
  removePermission(permission) {
    delete this.permissions[permission];
  }

  /**
   * Update role hierarchy
   * @param {string} role - Role name
   * @param {Array} inheritedRoles - Roles this role inherits from
   */
  updateRoleHierarchy(role, inheritedRoles) {
    this.roleHierarchy[role] = inheritedRoles;
  }
}

// Create singleton instance
const rbacManager = new RBACManager();

export default rbacManager;
export { RBACManager, PERMISSIONS, ROLE_HIERARCHY };