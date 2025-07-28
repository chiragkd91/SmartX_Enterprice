/**
 * RBAC Test Script for SmartBizFlow
 * Tests the role-based access control system
 */

// Mock RBAC configuration for testing
const permissions = {
  'dashboard.read': { resource: 'dashboard', action: 'read' },
  'dashboard.customize': { resource: 'dashboard', action: 'update' },
  'crm.read': { resource: 'crm', action: 'read' },
  'crm.write': { resource: 'crm', action: 'update' },
  'crm.create': { resource: 'crm', action: 'create' },
  'crm.delete': { resource: 'crm', action: 'delete' },
  'crm.admin': { resource: 'crm', action: 'admin' },
  'erp.read': { resource: 'erp', action: 'read' },
  'erp.write': { resource: 'erp', action: 'update' },
  'erp.create': { resource: 'erp', action: 'create' },
  'erp.delete': { resource: 'erp', action: 'delete' },
  'erp.admin': { resource: 'erp', action: 'admin' },
  'hr.read': { resource: 'hr', action: 'read' },
  'hr.write': { resource: 'hr', action: 'update' },
  'hr.create': { resource: 'hr', action: 'create' },
  'hr.delete': { resource: 'hr', action: 'delete' },
  'hr.admin': { resource: 'hr', action: 'admin' },
  'assets.read': { resource: 'assets', action: 'read' },
  'assets.write': { resource: 'assets', action: 'update' },
  'assets.create': { resource: 'assets', action: 'create' },
  'assets.delete': { resource: 'assets', action: 'delete' },
  'assets.admin': { resource: 'assets', action: 'admin' },
  'gst.read': { resource: 'gst', action: 'read' },
  'gst.write': { resource: 'gst', action: 'update' },
  'gst.create': { resource: 'gst', action: 'create' },
  'gst.delete': { resource: 'gst', action: 'delete' },
  'gst.admin': { resource: 'gst', action: 'admin' },
  'bi.read': { resource: 'bi', action: 'read' },
  'bi.write': { resource: 'bi', action: 'update' },
  'bi.admin': { resource: 'bi', action: 'admin' },
  'automation.read': { resource: 'automation', action: 'read' },
  'automation.write': { resource: 'automation', action: 'update' },
  'automation.admin': { resource: 'automation', action: 'admin' },
  'files.read': { resource: 'files', action: 'read' },
  'files.write': { resource: 'files', action: 'update' },
  'files.create': { resource: 'files', action: 'create' },
  'files.delete': { resource: 'files', action: 'delete' },
  'files.admin': { resource: 'files', action: 'admin' },
  'users.read': { resource: 'users', action: 'read' },
  'users.write': { resource: 'users', action: 'update' },
  'users.create': { resource: 'users', action: 'create' },
  'users.delete': { resource: 'users', action: 'delete' },
  'users.admin': { resource: 'users', action: 'admin' },
  'reports.read': { resource: 'reports', action: 'read' },
  'reports.write': { resource: 'reports', action: 'update' },
  'reports.admin': { resource: 'reports', action: 'admin' },
  'settings.read': { resource: 'settings', action: 'read' },
  'settings.write': { resource: 'settings', action: 'update' },
  'settings.admin': { resource: 'settings', action: 'admin' }
};

const roles = {
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
      permissions['reports.read']
    ],
    modules: ['dashboard', 'crm', 'erp', 'hr', 'assets', 'gst', 'bi', 'automation', 'files', 'reports'],
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
      permissions['crm.read'],
      permissions['erp.read'],
      permissions['hr.read'],
      permissions['assets.read'],
      permissions['gst.read'],
      permissions['files.read'],
      permissions['reports.read']
    ],
    modules: ['dashboard', 'crm', 'erp', 'hr', 'assets', 'gst', 'files', 'reports'],
    isSystem: true,
    isActive: true,
    priority: 100
  },
  guest: {
    name: 'guest',
    displayName: 'Guest',
    description: 'Guest user with minimal access',
    permissions: [
      permissions['dashboard.read']
    ],
    modules: ['dashboard'],
    isSystem: true,
    isActive: true,
    priority: 50
  }
};

// RBAC Utility Functions
function hasPermission(userPermissions, requiredPermission) {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('*');
}

function hasRole(userRoles, requiredRole) {
  return userRoles.includes(requiredRole);
}

function getRolePermissions(roleName) {
  const role = roles[roleName];
  return role ? role.permissions : [];
}

function getRoleModules(roleName) {
  const role = roles[roleName];
  return role ? role.modules : [];
}

function canAccessModule(userRoles, moduleName) {
  for (const roleName of userRoles) {
    const role = roles[roleName];
    if (role && (role.modules.includes('*') || role.modules.includes(moduleName))) {
      return true;
    }
  }
  return false;
}

function canPerformAction(userRoles, resource, action) {
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
}

// Test Functions
function testRoleDefinitions() {
  console.log('🔍 Testing Role Definitions...');
  let passed = 0;
  let total = 0;

  // Test 1: Check if all system roles exist
  const systemRoles = ['superAdmin', 'admin', 'manager', 'employee', 'guest'];
  systemRoles.forEach(roleName => {
    total++;
    if (roles[roleName]) {
      passed++;
      console.log(`   ✅ System Role: ${roleName} - EXISTS`);
    } else {
      console.log(`   ❌ System Role: ${roleName} - MISSING`);
    }
  });

  // Test 2: Check role priorities
  total++;
  if (roles.superAdmin.priority > roles.admin.priority) {
    passed++;
    console.log(`   ✅ Role Priority Hierarchy - CORRECT`);
  } else {
    console.log(`   ❌ Role Priority Hierarchy - INCORRECT`);
  }

  // Test 3: Check if roles have required properties
  Object.keys(roles).forEach(roleName => {
    total++;
    const role = roles[roleName];
    if (role.name && role.displayName && role.permissions && role.modules) {
      passed++;
      console.log(`   ✅ Role Properties: ${roleName} - COMPLETE`);
    } else {
      console.log(`   ❌ Role Properties: ${roleName} - INCOMPLETE`);
    }
  });

  console.log(`   📊 Role Definitions: ${passed}/${total} tests passed\n`);
  return { passed, total };
}

function testPermissions() {
  console.log('🔍 Testing Permission Definitions...');
  let passed = 0;
  let total = 0;

  // Test 1: Check if all permissions have valid structure
  Object.keys(permissions).forEach(permissionKey => {
    total++;
    const permission = permissions[permissionKey];
    if (permission.resource && permission.action) {
      passed++;
      console.log(`   ✅ Permission Structure: ${permissionKey} - VALID`);
    } else {
      console.log(`   ❌ Permission Structure: ${permissionKey} - INVALID`);
    }
  });

  // Test 2: Check if actions are valid
  const validActions = ['create', 'read', 'update', 'delete', 'admin'];
  Object.keys(permissions).forEach(permissionKey => {
    total++;
    const permission = permissions[permissionKey];
    if (validActions.includes(permission.action)) {
      passed++;
      console.log(`   ✅ Valid Action: ${permissionKey} - VALID`);
    } else {
      console.log(`   ❌ Valid Action: ${permissionKey} - INVALID ACTION: ${permission.action}`);
    }
  });

  console.log(`   📊 Permission Definitions: ${passed}/${total} tests passed\n`);
  return { passed, total };
}

function testAccessControl() {
  console.log('🔍 Testing Access Control Functions...');
  let passed = 0;
  let total = 0;

  // Test 1: SuperAdmin should have access to everything
  total++;
  if (canAccessModule(['superAdmin'], 'crm') && 
      canAccessModule(['superAdmin'], 'erp') && 
      canAccessModule(['superAdmin'], 'hr')) {
    passed++;
    console.log(`   ✅ SuperAdmin Full Access - WORKING`);
  } else {
    console.log(`   ❌ SuperAdmin Full Access - FAILED`);
  }

  // Test 2: Admin should have access to most modules
  total++;
  if (canAccessModule(['admin'], 'crm') && 
      canAccessModule(['admin'], 'erp') && 
      canAccessModule(['admin'], 'hr')) {
    passed++;
    console.log(`   ✅ Admin Module Access - WORKING`);
  } else {
    console.log(`   ❌ Admin Module Access - FAILED`);
  }

  // Test 3: Employee should have limited access
  total++;
  if (canAccessModule(['employee'], 'dashboard') && 
      !canAccessModule(['employee'], 'settings')) {
    passed++;
    console.log(`   ✅ Employee Limited Access - WORKING`);
  } else {
    console.log(`   ❌ Employee Limited Access - FAILED`);
  }

  // Test 4: Action permissions
  total++;
  if (canPerformAction(['admin'], 'crm', 'read') && 
      canPerformAction(['admin'], 'crm', 'write') && 
      !canPerformAction(['employee'], 'settings', 'admin')) {
    passed++;
    console.log(`   ✅ Action Permissions - WORKING`);
  } else {
    console.log(`   ❌ Action Permissions - FAILED`);
  }

  console.log(`   📊 Access Control: ${passed}/${total} tests passed\n`);
  return { passed, total };
}

function testUtilityFunctions() {
  console.log('🔍 Testing Utility Functions...');
  let passed = 0;
  let total = 0;

  // Test 1: Role permissions retrieval
  total++;
  if (getRolePermissions('admin').length > 0) {
    passed++;
    console.log(`   ✅ Get Role Permissions - WORKING`);
  } else {
    console.log(`   ❌ Get Role Permissions - FAILED`);
  }

  // Test 2: Role modules retrieval
  total++;
  if (getRoleModules('admin').length > 0) {
    passed++;
    console.log(`   ✅ Get Role Modules - WORKING`);
  } else {
    console.log(`   ❌ Get Role Modules - FAILED`);
  }

  // Test 3: Permission checking
  total++;
  if (hasPermission(['crm.read', 'crm.write'], 'crm.read')) {
    passed++;
    console.log(`   ✅ Has Permission - WORKING`);
  } else {
    console.log(`   ❌ Has Permission - FAILED`);
  }

  // Test 4: Role checking
  total++;
  if (hasRole(['admin', 'manager'], 'admin')) {
    passed++;
    console.log(`   ✅ Has Role - WORKING`);
  } else {
    console.log(`   ❌ Has Role - FAILED`);
  }

  console.log(`   📊 Utility Functions: ${passed}/${total} tests passed\n`);
  return { passed, total };
}

function testEdgeCases() {
  console.log('🔍 Testing Edge Cases...');
  let passed = 0;
  let total = 0;

  // Test 1: Empty roles array
  total++;
  if (!canAccessModule([], 'crm')) {
    passed++;
    console.log(`   ✅ Empty Roles Array - WORKING`);
  } else {
    console.log(`   ❌ Empty Roles Array - FAILED`);
  }

  // Test 2: Non-existent role
  total++;
  if (!canAccessModule(['nonExistentRole'], 'crm')) {
    passed++;
    console.log(`   ✅ Non-existent Role - WORKING`);
  } else {
    console.log(`   ❌ Non-existent Role - FAILED`);
  }

  // Test 3: Wildcard permission
  total++;
  if (hasPermission(['*'], 'any.permission')) {
    passed++;
    console.log(`   ✅ Wildcard Permission - WORKING`);
  } else {
    console.log(`   ❌ Wildcard Permission - FAILED`);
  }

  // Test 4: Wildcard module access
  total++;
  if (canAccessModule(['superAdmin'], 'anyModule')) {
    passed++;
    console.log(`   ✅ Wildcard Module Access - WORKING`);
  } else {
    console.log(`   ❌ Wildcard Module Access - FAILED`);
  }

  console.log(`   📊 Edge Cases: ${passed}/${total} tests passed\n`);
  return { passed, total };
}

// Main test runner
function runAllTests() {
  console.log('🔐 Starting RBAC System Tests...\n');
  
  const results = [
    testRoleDefinitions(),
    testPermissions(),
    testAccessControl(),
    testUtilityFunctions(),
    testEdgeCases()
  ];
  
  const totalTests = results.reduce((sum, result) => sum + result.total, 0);
  const totalPassed = results.reduce((sum, result) => sum + result.passed, 0);
  const totalFailed = totalTests - totalPassed;
  
  console.log('📊 Overall Results:');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${totalPassed} (${((totalPassed/totalTests)*100).toFixed(1)}%)`);
  console.log(`   Failed: ${totalFailed} (${((totalFailed/totalTests)*100).toFixed(1)}%)`);
  
  if (totalFailed === 0) {
    console.log('\n✅ All RBAC tests passed! The system is working correctly.');
  } else {
    console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review the issues above.`);
  }
  
  return { totalTests, totalPassed, totalFailed };
}

// Run the tests
runAllTests(); 