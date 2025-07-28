/**
 * RBAC Test Utility for SmartBizFlow
 * Comprehensive testing of role-based access control functionality
 */

import {
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
  deleteRole,
  rbacConfig
} from '../config/rbac';

interface TestResult {
  testName: string;
  passed: boolean;
  expected: any;
  actual: any;
  description: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  total: number;
}

class RBACTester {
  private testResults: TestSuite[] = [];

  /**
   * Run all RBAC tests
   */
  runAllTests(): TestSuite[] {
    console.log('🔐 Starting RBAC System Tests...\n');
    
    this.testRoles();
    this.testPermissions();
    this.testAccessControl();
    this.testUtilityFunctions();
    this.testRoleManagement();
    this.testEdgeCases();
    
    this.printResults();
    return this.testResults;
  }

  /**
   * Test role definitions
   */
  private testRoles(): void {
    const suite: TestSuite = {
      name: 'Role Definitions',
      tests: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test 1: Check if all system roles exist
    const systemRoles = ['superAdmin', 'admin', 'manager', 'employee', 'guest'];
    systemRoles.forEach(roleName => {
      const test: TestResult = {
        testName: `System Role: ${roleName}`,
        passed: !!roles[roleName],
        expected: true,
        actual: !!roles[roleName],
        description: `Check if ${roleName} role exists`
      };
      suite.tests.push(test);
    });

    // Test 2: Check role priorities
    const test: TestResult = {
      testName: 'Role Priority Hierarchy',
      passed: roles.superAdmin.priority > roles.admin.priority,
      expected: true,
      actual: roles.superAdmin.priority > roles.admin.priority,
      description: 'SuperAdmin should have higher priority than Admin'
    };
    suite.tests.push(test);

    // Test 3: Check if roles have required properties
    Object.keys(roles).forEach(roleName => {
      const role = roles[roleName];
      const test: TestResult = {
        testName: `Role Properties: ${roleName}`,
        passed: !!(role.name && role.displayName && role.permissions && role.modules),
        expected: true,
        actual: !!(role.name && role.displayName && role.permissions && role.modules),
        description: `Check if ${roleName} has all required properties`
      };
      suite.tests.push(test);
    });

    this.calculateSuiteResults(suite);
    this.testResults.push(suite);
  }

  /**
   * Test permission definitions
   */
  private testPermissions(): void {
    const suite: TestSuite = {
      name: 'Permission Definitions',
      tests: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test 1: Check if all permissions have valid structure
    Object.keys(permissions).forEach(permissionKey => {
      const permission = permissions[permissionKey];
      const test: TestResult = {
        testName: `Permission Structure: ${permissionKey}`,
        passed: !!(permission.resource && permission.action),
        expected: true,
        actual: !!(permission.resource && permission.action),
        description: `Check if ${permissionKey} has valid structure`
      };
      suite.tests.push(test);
    });

    // Test 2: Check if actions are valid
    const validActions = ['create', 'read', 'update', 'delete', 'admin'];
    Object.keys(permissions).forEach(permissionKey => {
      const permission = permissions[permissionKey];
      const test: TestResult = {
        testName: `Valid Action: ${permissionKey}`,
        passed: validActions.includes(permission.action),
        expected: true,
        actual: validActions.includes(permission.action),
        description: `Check if ${permissionKey} has valid action`
      };
      suite.tests.push(test);
    });

    this.calculateSuiteResults(suite);
    this.testResults.push(suite);
  }

  /**
   * Test access control functions
   */
  private testAccessControl(): void {
    const suite: TestSuite = {
      name: 'Access Control Functions',
      tests: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test 1: SuperAdmin should have access to everything
    const test1: TestResult = {
      testName: 'SuperAdmin Full Access',
      passed: canAccessModule(['superAdmin'], 'crm') && 
              canAccessModule(['superAdmin'], 'erp') && 
              canAccessModule(['superAdmin'], 'hr'),
      expected: true,
      actual: canAccessModule(['superAdmin'], 'crm') && 
              canAccessModule(['superAdmin'], 'erp') && 
              canAccessModule(['superAdmin'], 'hr'),
      description: 'SuperAdmin should have access to all modules'
    };
    suite.tests.push(test1);

    // Test 2: Admin should have access to most modules
    const test2: TestResult = {
      testName: 'Admin Module Access',
      passed: canAccessModule(['admin'], 'crm') && 
              canAccessModule(['admin'], 'erp') && 
              canAccessModule(['admin'], 'hr'),
      expected: true,
      actual: canAccessModule(['admin'], 'crm') && 
              canAccessModule(['admin'], 'erp') && 
              canAccessModule(['admin'], 'hr'),
      description: 'Admin should have access to main modules'
    };
    suite.tests.push(test2);

    // Test 3: Employee should have limited access
    const test3: TestResult = {
      testName: 'Employee Limited Access',
      passed: canAccessModule(['employee'], 'dashboard') && 
              !canAccessModule(['employee'], 'settings'),
      expected: true,
      actual: canAccessModule(['employee'], 'dashboard') && 
              !canAccessModule(['employee'], 'settings'),
      description: 'Employee should have limited module access'
    };
    suite.tests.push(test3);

    // Test 4: Action permissions
    const test4: TestResult = {
      testName: 'Action Permissions',
      passed: canPerformAction(['admin'], 'crm', 'read') && 
              canPerformAction(['admin'], 'crm', 'write') && 
              !canPerformAction(['employee'], 'settings', 'admin'),
      expected: true,
      actual: canPerformAction(['admin'], 'crm', 'read') && 
              canPerformAction(['admin'], 'crm', 'write') && 
              !canPerformAction(['employee'], 'settings', 'admin'),
      description: 'Check action-based permissions'
    };
    suite.tests.push(test4);

    this.calculateSuiteResults(suite);
    this.testResults.push(suite);
  }

  /**
   * Test utility functions
   */
  private testUtilityFunctions(): void {
    const suite: TestSuite = {
      name: 'Utility Functions',
      tests: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test 1: Role permissions retrieval
    const test1: TestResult = {
      testName: 'Get Role Permissions',
      passed: getRolePermissions('admin').length > 0,
      expected: true,
      actual: getRolePermissions('admin').length > 0,
      description: 'Should retrieve permissions for admin role'
    };
    suite.tests.push(test1);

    // Test 2: Role modules retrieval
    const test2: TestResult = {
      testName: 'Get Role Modules',
      passed: getRoleModules('admin').length > 0,
      expected: true,
      actual: getRoleModules('admin').length > 0,
      description: 'Should retrieve modules for admin role'
    };
    suite.tests.push(test2);

    // Test 3: Available roles
    const test3: TestResult = {
      testName: 'Get Available Roles',
      passed: getAvailableRoles().length > 0,
      expected: true,
      actual: getAvailableRoles().length > 0,
      description: 'Should retrieve available roles'
    };
    suite.tests.push(test3);

    // Test 4: System roles
    const test4: TestResult = {
      testName: 'Get System Roles',
      passed: getSystemRoles().length > 0,
      expected: true,
      actual: getSystemRoles().length > 0,
      description: 'Should retrieve system roles'
    };
    suite.tests.push(test4);

    this.calculateSuiteResults(suite);
    this.testResults.push(suite);
  }

  /**
   * Test role management functions
   */
  private testRoleManagement(): void {
    const suite: TestSuite = {
      name: 'Role Management',
      tests: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test 1: Create custom role
    const customRole = createCustomRole(
      'testRole',
      'Test Role',
      'Test role for testing',
      [permissions['crm.read']],
      ['crm']
    );
    
    const test1: TestResult = {
      testName: 'Create Custom Role',
      passed: customRole.name === 'testRole' && customRole.isSystem === false,
      expected: true,
      actual: customRole.name === 'testRole' && customRole.isSystem === false,
      description: 'Should create custom role successfully'
    };
    suite.tests.push(test1);

    // Test 2: Update role
    const updatedRole = updateRole('testRole', { displayName: 'Updated Test Role' });
    const test2: TestResult = {
      testName: 'Update Role',
      passed: updatedRole?.displayName === 'Updated Test Role',
      expected: true,
      actual: updatedRole?.displayName === 'Updated Test Role',
      description: 'Should update role successfully'
    };
    suite.tests.push(test2);

    // Test 3: Delete role
    const deleteResult = deleteRole('testRole');
    const test3: TestResult = {
      testName: 'Delete Role',
      passed: deleteResult === true,
      expected: true,
      actual: deleteResult,
      description: 'Should delete custom role successfully'
    };
    suite.tests.push(test3);

    this.calculateSuiteResults(suite);
    this.testResults.push(suite);
  }

  /**
   * Test edge cases
   */
  private testEdgeCases(): void {
    const suite: TestSuite = {
      name: 'Edge Cases',
      tests: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test 1: Empty roles array
    const test1: TestResult = {
      testName: 'Empty Roles Array',
      passed: !canAccessModule([], 'crm'),
      expected: false,
      actual: canAccessModule([], 'crm'),
      description: 'Empty roles should not have access'
    };
    suite.tests.push(test1);

    // Test 2: Non-existent role
    const test2: TestResult = {
      testName: 'Non-existent Role',
      passed: !canAccessModule(['nonExistentRole'], 'crm'),
      expected: false,
      actual: canAccessModule(['nonExistentRole'], 'crm'),
      description: 'Non-existent role should not have access'
    };
    suite.tests.push(test2);

    // Test 3: Invalid permission
    const test3: TestResult = {
      testName: 'Invalid Permission',
      passed: !hasPermission([], 'invalid.permission'),
      expected: false,
      actual: hasPermission([], 'invalid.permission'),
      description: 'Invalid permission should return false'
    };
    suite.tests.push(test3);

    // Test 4: Wildcard permission
    const test4: TestResult = {
      testName: 'Wildcard Permission',
      passed: hasPermission(['*'], 'any.permission'),
      expected: true,
      actual: hasPermission(['*'], 'any.permission'),
      description: 'Wildcard permission should grant all access'
    };
    suite.tests.push(test4);

    this.calculateSuiteResults(suite);
    this.testResults.push(suite);
  }

  /**
   * Calculate test suite results
   */
  private calculateSuiteResults(suite: TestSuite): void {
    suite.total = suite.tests.length;
    suite.passed = suite.tests.filter(test => test.passed).length;
    suite.failed = suite.tests.filter(test => !test.passed).length;
  }

  /**
   * Print test results
   */
  private printResults(): void {
    console.log('📊 RBAC Test Results:\n');
    
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;

    this.testResults.forEach(suite => {
      console.log(`\n🔍 ${suite.name}:`);
      console.log(`   Passed: ${suite.passed}/${suite.total} (${((suite.passed/suite.total)*100).toFixed(1)}%)`);
      
      if (suite.failed > 0) {
        console.log(`   ❌ Failed Tests:`);
        suite.tests.filter(test => !test.passed).forEach(test => {
          console.log(`      - ${test.testName}: ${test.description}`);
          console.log(`        Expected: ${test.expected}, Actual: ${test.actual}`);
        });
      }
      
      totalTests += suite.total;
      totalPassed += suite.passed;
      totalFailed += suite.failed;
    });

    console.log(`\n🎯 Overall Results:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${totalPassed} (${((totalPassed/totalTests)*100).toFixed(1)}%)`);
    console.log(`   Failed: ${totalFailed} (${((totalFailed/totalTests)*100).toFixed(1)}%)`);
    
    if (totalFailed === 0) {
      console.log(`\n✅ All RBAC tests passed! The system is working correctly.`);
    } else {
      console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review the issues above.`);
    }
  }

  /**
   * Get detailed test results
   */
  getDetailedResults(): TestSuite[] {
    return this.testResults;
  }

  /**
   * Check if all tests passed
   */
  allTestsPassed(): boolean {
    return this.testResults.every(suite => suite.failed === 0);
  }
}

// Export test utility
export const rbacTester = new RBACTester();

// Convenience function to run tests
export const runRBACTests = () => {
  return rbacTester.runAllTests();
};

export default rbacTester; 