/**
 * Microsoft SQL Server CRUD Test Script
 * SmartBizFlow - Complete Database Testing
 */

const sql = require('mssql');
require('dotenv').config();

// SQL Server Configuration
const config = {
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || 'YourStrong@Passw0rd',
  server: process.env.MSSQL_SERVER || 'localhost',
  database: process.env.MSSQL_DATABASE || 'SmartBizFlow',
  port: parseInt(process.env.MSSQL_PORT || '1433'),
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.MSSQL_TRUST_CERT === 'true',
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000
  }
};

class MSSQLCRUDTester {
  constructor() {
    this.pool = null;
    this.testResults = [];
  }

  async initialize() {
    try {
      console.log('🔗 Initializing SQL Server connection...');
      this.pool = await sql.connect(config);
      console.log('✅ SQL Server connected successfully');
      
      // Test connection
      await this.pool.request().query('SELECT 1 as test');
      console.log('✅ Database connection test passed');
    } catch (error) {
      console.error('❌ SQL Server connection failed:', error);
      throw error;
    }
  }

  async executeCRUDTest(testCase) {
    const result = {
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      module: testCase.module,
      entity: testCase.entity,
      operation: testCase.operation,
      status: 'PENDING',
      errors: [],
      duration: 0,
      data: {}
    };

    const startTime = Date.now();

    try {
      console.log(`🔍 Executing: ${testCase.name} (${testCase.id})`);

      switch (testCase.operation) {
        case 'CREATE':
          await this.executeCreateOperation(testCase, result);
          break;
        case 'READ':
          await this.executeReadOperation(testCase, result);
          break;
        case 'UPDATE':
          await this.executeUpdateOperation(testCase, result);
          break;
        case 'DELETE':
          await this.executeDeleteOperation(testCase, result);
          break;
        default:
          throw new Error(`Unknown operation: ${testCase.operation}`);
      }

      result.status = 'PASSED';
      result.duration = Date.now() - startTime;
      
      console.log(`✅ ${testCase.name} - PASSED (${result.duration}ms)`);
      
    } catch (error) {
      result.status = 'FAILED';
      result.errors.push(error.message);
      result.duration = Date.now() - startTime;
      
      console.log(`❌ ${testCase.name} - FAILED: ${error.message}`);
    }

    this.testResults.push(result);
    return result;
  }

  async executeCreateOperation(testCase, result) {
    const { entity, testData } = testCase;
    const tableName = this.getTableName(entity);
    const id = this.generateId(entity);
    
    const columns = Object.keys(testData).join(', ');
    const values = Object.keys(testData).map(key => `@${key}`).join(', ');
    const query = `INSERT INTO ${tableName} (id, ${columns}) VALUES (@id, ${values})`;
    
    const request = this.pool.request();
    request.input('id', id);
    
    Object.entries(testData).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    await request.query(query);
    
    // Verify creation
    const verifyQuery = `SELECT * FROM ${tableName} WHERE id = @id`;
    const verifyResult = await this.pool.request()
      .input('id', id)
      .query(verifyQuery);
    
    if (verifyResult.recordset.length === 0) {
      throw new Error('Record was not created successfully');
    }
    
    result.data = { created: true, id, record: verifyResult.recordset[0] };
  }

  async executeReadOperation(testCase, result) {
    const { entity, testData } = testCase;
    const tableName = this.getTableName(entity);
    
    // Find record by unique identifier
    const identifier = this.getIdentifier(testData);
    const query = `SELECT * FROM ${tableName} WHERE ${identifier.key} = @value`;
    
    const readResult = await this.pool.request()
      .input('value', identifier.value)
      .query(query);
    
    if (readResult.recordset.length === 0) {
      throw new Error(`Record not found with ${identifier.key} = ${identifier.value}`);
    }
    
    result.data = { read: true, record: readResult.recordset[0] };
  }

  async executeUpdateOperation(testCase, result) {
    const { entity, testData, updateData } = testCase;
    const tableName = this.getTableName(entity);
    
    // Find record to update
    const identifier = this.getIdentifier(testData);
    const findQuery = `SELECT * FROM ${tableName} WHERE ${identifier.key} = @value`;
    
    const findResult = await this.pool.request()
      .input('value', identifier.value)
      .query(findQuery);
    
    if (findResult.recordset.length === 0) {
      throw new Error(`Record not found for update with ${identifier.key} = ${identifier.value}`);
    }
    
    // Update record
    const setClause = Object.keys(updateData).map(key => `${key} = @${key}`).join(', ');
    const updateQuery = `UPDATE ${tableName} SET ${setClause}, updated_at = GETDATE() WHERE ${identifier.key} = @id`;
    
    const request = this.pool.request();
    request.input('id', identifier.value);
    
    Object.entries(updateData).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    await request.query(updateQuery);
    
    // Verify update
    const verifyQuery = `SELECT * FROM ${tableName} WHERE ${identifier.key} = @value`;
    const verifyResult = await this.pool.request()
      .input('value', identifier.value)
      .query(verifyQuery);
    
    result.data = { updated: true, record: verifyResult.recordset[0] };
  }

  async executeDeleteOperation(testCase, result) {
    const { entity, testData } = testCase;
    const tableName = this.getTableName(entity);
    
    // Find record to delete
    const identifier = this.getIdentifier(testData);
    const findQuery = `SELECT * FROM ${tableName} WHERE ${identifier.key} = @value`;
    
    const findResult = await this.pool.request()
      .input('value', identifier.value)
      .query(findQuery);
    
    if (findResult.recordset.length === 0) {
      throw new Error(`Record not found for deletion with ${identifier.key} = ${identifier.value}`);
    }
    
    // Delete record
    const deleteQuery = `DELETE FROM ${tableName} WHERE ${identifier.key} = @value`;
    await this.pool.request()
      .input('value', identifier.value)
      .query(deleteQuery);
    
    // Verify deletion
    const verifyQuery = `SELECT * FROM ${tableName} WHERE ${identifier.key} = @value`;
    const verifyResult = await this.pool.request()
      .input('value', identifier.value)
      .query(verifyQuery);
    
    if (verifyResult.recordset.length > 0) {
      throw new Error('Record was not deleted successfully');
    }
    
    result.data = { deleted: true, record: findResult.recordset[0] };
  }

  getTableName(entity) {
    const tableMap = {
      'User': 'users',
      'Lead': 'leads',
      'Customer': 'customers',
      'Product': 'products',
      'Order': 'orders',
      'Invoice': 'invoices',
      'Employee': 'employees',
      'Leave Request': 'leave_requests',
      'Asset': 'assets',
      'GST Invoice': 'gst_invoices'
    };
    
    return tableMap[entity] || entity.toLowerCase() + 's';
  }

  generateId(entity) {
    const prefix = entity.toLowerCase().replace(/\s+/g, '_');
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getIdentifier(testData) {
    // Find the most likely unique identifier
    const identifiers = ['email', 'name', 'id', 'employee_id', 'order_number', 'invoice_number'];
    
    for (const id of identifiers) {
      if (testData[id]) {
        return { key: id, value: testData[id] };
      }
    }
    
    // Fallback to first field
    const firstKey = Object.keys(testData)[0];
    return { key: firstKey, value: testData[firstKey] };
  }

  async runAllCRUDTests() {
    console.log('🎯 Starting SQL Server CRUD Test Suite...');
    
    // Execute all test cases
    for (const testCase of crudTestCases) {
      await this.executeCRUDTest(testCase);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Generate report
    await this.generateTestReport();
  }

  async runModuleTests(module) {
    console.log(`🎯 Starting ${module.toUpperCase()} Module Tests...`);
    
    const moduleTests = crudTestCases.filter(test => test.module === module);
    
    for (const testCase of moduleTests) {
      await this.executeCRUDTest(testCase);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await this.generateTestReport();
  }

  async generateTestReport() {
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    const total = this.testResults.length;
    const successRate = ((passed / total) * 100).toFixed(2);

    console.log('\n' + '='.repeat(80));
    console.log('📊 SQL SERVER CRUD TEST REPORT');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log('='.repeat(80));

    // Module-wise breakdown
    const moduleStats = {};
    this.testResults.forEach(result => {
      if (!moduleStats[result.module]) {
        moduleStats[result.module] = { passed: 0, failed: 0, total: 0 };
      }
      moduleStats[result.module].total++;
      if (result.status === 'PASSED') {
        moduleStats[result.module].passed++;
      } else {
        moduleStats[result.module].failed++;
      }
    });

    console.log('\n📊 MODULE-WISE BREAKDOWN:');
    for (const [module, stats] of Object.entries(moduleStats)) {
      const moduleSuccessRate = ((stats.passed / stats.total) * 100).toFixed(2);
      console.log(`${module.toUpperCase()}: ${stats.passed}/${stats.total} (${moduleSuccessRate}%)`);
    }

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => r.status === 'FAILED')
        .forEach(result => {
          console.log(`\n- ${result.testCaseName} (${result.testCaseId})`);
          console.log(`  Module: ${result.module}, Entity: ${result.entity}, Operation: ${result.operation}`);
          console.log(`  Duration: ${result.duration}ms`);
          console.log(`  Errors: ${result.errors.join(', ')}`);
        });
    }

    // Save detailed report
    const report = {
      summary: {
        total: total,
        passed: passed,
        failed: failed,
        successRate: successRate,
        timestamp: new Date().toISOString(),
        database: 'Microsoft SQL Server'
      },
      moduleStats: moduleStats,
      results: this.testResults
    };

    const fs = require('fs');
    fs.writeFileSync('mssql-crud-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: mssql-crud-test-report.json');
  }

  async cleanup() {
    if (this.pool) {
      await this.pool.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// CRUD Test Cases Configuration
const crudTestCases = [
  // User Management Tests
  {
    id: 'USER-001',
    name: 'Create User',
    module: 'common',
    entity: 'User',
    operation: 'CREATE',
    priority: 'Critical',
    testData: {
      email: 'test.user@company.com',
      password_hash: '$2b$10$hashed_password',
      role: 'employee',
      department: 'IT',
      phone: '+1-555-123-4567',
      status: 'active'
    }
  },
  {
    id: 'USER-002',
    name: 'Read User',
    module: 'common',
    entity: 'User',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      email: 'test.user@company.com'
    }
  },
  {
    id: 'USER-003',
    name: 'Update User',
    module: 'common',
    entity: 'User',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      email: 'test.user@company.com'
    },
    updateData: {
      role: 'manager',
      department: 'Engineering'
    }
  },
  {
    id: 'USER-004',
    name: 'Delete User',
    module: 'common',
    entity: 'User',
    operation: 'DELETE',
    priority: 'Critical',
    testData: {
      email: 'test.user@company.com'
    }
  },

  // CRM Module Tests
  {
    id: 'CRM-LEAD-001',
    name: 'Create Lead',
    module: 'crm',
    entity: 'Lead',
    operation: 'CREATE',
    priority: 'Critical',
    testData: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567',
      company: 'ABC Corp',
      source: 'Website',
      status: 'new'
    }
  },
  {
    id: 'CRM-LEAD-002',
    name: 'Read Lead',
    module: 'crm',
    entity: 'Lead',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      email: 'john.doe@example.com'
    }
  },
  {
    id: 'CRM-LEAD-003',
    name: 'Update Lead',
    module: 'crm',
    entity: 'Lead',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      email: 'john.doe@example.com'
    },
    updateData: {
      status: 'qualified',
      phone: '+1-555-123-4568'
    }
  },
  {
    id: 'CRM-LEAD-004',
    name: 'Delete Lead',
    module: 'crm',
    entity: 'Lead',
    operation: 'DELETE',
    priority: 'Critical',
    testData: {
      email: 'john.doe@example.com'
    }
  },

  // ERP Module Tests
  {
    id: 'ERP-PRODUCT-001',
    name: 'Create Product',
    module: 'erp',
    entity: 'Product',
    operation: 'CREATE',
    priority: 'Critical',
    testData: {
      name: 'Test Product',
      description: 'Test product description',
      category: 'Electronics',
      price: 999.99,
      cost: 750.00,
      sku: 'TEST-001',
      hsn_code: '8471',
      gst_rate: 18.00,
      stock_quantity: 50
    }
  },
  {
    id: 'ERP-PRODUCT-002',
    name: 'Read Product',
    module: 'erp',
    entity: 'Product',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      sku: 'TEST-001'
    }
  },
  {
    id: 'ERP-PRODUCT-003',
    name: 'Update Product',
    module: 'erp',
    entity: 'Product',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      sku: 'TEST-001'
    },
    updateData: {
      price: 1099.99,
      stock_quantity: 45
    }
  },
  {
    id: 'ERP-PRODUCT-004',
    name: 'Delete Product',
    module: 'erp',
    entity: 'Product',
    operation: 'DELETE',
    priority: 'Critical',
    testData: {
      sku: 'TEST-001'
    }
  },

  // HR Module Tests
  {
    id: 'HR-EMPLOYEE-001',
    name: 'Create Employee',
    module: 'hr',
    entity: 'Employee',
    operation: 'CREATE',
    priority: 'Critical',
    testData: {
      employee_id: 'EMP001',
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@company.com',
      phone: '+1-555-123-4567',
      department: 'Engineering',
      position: 'Software Engineer',
      hire_date: new Date('2022-03-01'),
      salary: 75000,
      status: 'active'
    }
  },
  {
    id: 'HR-EMPLOYEE-002',
    name: 'Read Employee',
    module: 'hr',
    entity: 'Employee',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      email: 'john.smith@company.com'
    }
  },
  {
    id: 'HR-EMPLOYEE-003',
    name: 'Update Employee',
    module: 'hr',
    entity: 'Employee',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      email: 'john.smith@company.com'
    },
    updateData: {
      department: 'Marketing',
      salary: 80000
    }
  },
  {
    id: 'HR-EMPLOYEE-004',
    name: 'Delete Employee',
    module: 'hr',
    entity: 'Employee',
    operation: 'DELETE',
    priority: 'Critical',
    testData: {
      email: 'john.smith@company.com'
    }
  }
];

// Main execution function
async function main() {
  const tester = new MSSQLCRUDTester();
  
  try {
    await tester.initialize();
    
    // Check command line arguments
    const args = process.argv.slice(2);
    const module = args[0];
    
    if (module) {
      await tester.runModuleTests(module);
    } else {
      await tester.runAllCRUDTests();
    }
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  } finally {
    await tester.cleanup();
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MSSQLCRUDTester, crudTestCases }; 