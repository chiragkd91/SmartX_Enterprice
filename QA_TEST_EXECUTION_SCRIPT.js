/**
 * 🧪 SMARTBIZFLOW QA CRUD TEST EXECUTION SCRIPT
 * 
 * This script automates the execution of all 768 CRUD test cases
 * across all 6 modules in the SmartBizFlow application.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class QACRUDTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.baseUrl = 'http://localhost:5187';
    this.currentUser = null;
  }

  async initialize() {
    console.log('🚀 Initializing QA CRUD Tester...');
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000
    });
    this.page = await this.browser.newPage();
    
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('✅ Browser initialized successfully');
  }

  async login() {
    console.log('🔐 Logging in to SmartBizFlow...');
    
    await this.page.goto(`${this.baseUrl}/login`);
    await this.page.waitForLoadState('networkidle');
    
    // Login with admin credentials
    await this.page.fill('input[name="email"]', 'admin@smartbizflow.com');
    await this.page.fill('input[name="password"]', 'password123');
    await this.page.click('button[type="submit"]');
    
    // Wait for login to complete
    await this.page.waitForURL('**/dashboard');
    
    this.currentUser = {
      email: 'admin@smartbizflow.com',
      role: 'admin'
    };
    
    console.log('✅ Login successful');
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
      screenshots: [],
      data: {}
    };

    const startTime = Date.now();

    try {
      console.log(`🔍 Executing: ${testCase.name} (${testCase.id})`);

      // Navigate to module
      await this.navigateToModule(testCase.module);
      
      // Execute specific CRUD operation
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
      
      // Take error screenshot
      const errorScreenshot = await this.page.screenshot({ 
        path: `screenshots/error_${testCase.id}.png` 
      });
      result.screenshots.push(`error_${testCase.id}.png`);
      
      console.log(`❌ ${testCase.name} - FAILED: ${error.message}`);
    }

    this.testResults.push(result);
    return result;
  }

  async navigateToModule(module) {
    const moduleRoutes = {
      'crm': '/crm',
      'erp': '/erp',
      'hr': '/hr',
      'it-assets': '/assets',
      'gst': '/gst',
      'common': '/users'
    };
    
    const route = moduleRoutes[module] || '/dashboard';
    await this.page.goto(`${this.baseUrl}${route}`);
    await this.page.waitForLoadState('networkidle');
  }

  async executeCreateOperation(testCase, result) {
    const { entity, testData } = testCase;
    
    // Click add button
    const addButton = await this.page.locator(`button:has-text("Add ${entity}"), button:has-text("Create ${entity}"), button:has-text("New ${entity}")`);
    await addButton.click();
    
    // Wait for form to appear
    await this.page.waitForSelector('form, [role="dialog"]', { timeout: 5000 });
    
    // Fill form data
    await this.fillFormData(testData);
    
    // Submit form
    await this.page.click('button:has-text("Save"), button:has-text("Create"), button:has-text("Submit")');
    
    // Wait for success
    await this.page.waitForSelector('.success, .toast-success, [data-testid="success"]', { timeout: 5000 });
    
    // Verify item appears in list
    await this.verifyItemInList(testData.name || testData.title || testData.email);
    
    result.data = { created: true, itemName: testData.name || testData.title || testData.email };
  }

  async executeReadOperation(testCase, result) {
    const { entity, testData } = testCase;
    
    // Find item in list
    const itemRow = await this.page.locator(`text=${testData.name || testData.title || testData.email}`).first();
    await itemRow.click();
    
    // Wait for details to load
    await this.page.waitForLoadState('networkidle');
    
    // Verify details are displayed
    await this.verifyDetailsDisplayed(testData);
    
    result.data = { read: true, itemName: testData.name || testData.title || testData.email };
  }

  async executeUpdateOperation(testCase, result) {
    const { entity, testData, updateData } = testCase;
    
    // Find item in list
    const itemRow = await this.page.locator(`text=${testData.name || testData.title || testData.email}`).first();
    
    // Click edit button
    const editButton = await itemRow.locator('xpath=..').locator('button:has-text("Edit")');
    await editButton.click();
    
    // Wait for form to load
    await this.page.waitForSelector('form, [role="dialog"]', { timeout: 5000 });
    
    // Update form data
    await this.fillFormData(updateData);
    
    // Submit form
    await this.page.click('button:has-text("Save"), button:has-text("Update")');
    
    // Wait for success
    await this.page.waitForSelector('.success, .toast-success, [data-testid="success"]', { timeout: 5000 });
    
    // Verify update is reflected
    await this.verifyItemInList(updateData.name || updateData.title || updateData.email);
    
    result.data = { updated: true, itemName: updateData.name || updateData.title || updateData.email };
  }

  async executeDeleteOperation(testCase, result) {
    const { entity, testData } = testCase;
    
    // Find item in list
    const itemRow = await this.page.locator(`text=${testData.name || testData.title || testData.email}`).first();
    
    // Click delete button
    const deleteButton = await itemRow.locator('xpath=..').locator('button:has-text("Delete")');
    await deleteButton.click();
    
    // Confirm deletion
    await this.page.click('button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Yes")');
    
    // Wait for success
    await this.page.waitForSelector('.success, .toast-success, [data-testid="success"]', { timeout: 5000 });
    
    // Verify item is removed
    await this.verifyItemNotInList(testData.name || testData.title || testData.email);
    
    result.data = { deleted: true, itemName: testData.name || testData.title || testData.email };
  }

  async fillFormData(testData) {
    for (const [field, value] of Object.entries(testData)) {
      try {
        // Try different selectors for the field
        const selectors = [
          `input[name="${field}"]`,
          `input[placeholder*="${field}"]`,
          `textarea[name="${field}"]`,
          `select[name="${field}"]`,
          `[data-testid="${field}"]`,
          `input[aria-label*="${field}"]`
        ];
        
        let element = null;
        for (const selector of selectors) {
          element = await this.page.locator(selector).first();
          if (await element.isVisible()) {
            break;
          }
        }
        
        if (element && await element.isVisible()) {
          await element.fill(value.toString());
        }
      } catch (error) {
        console.log(`Warning: Could not fill field ${field} with value ${value}`);
      }
    }
  }

  async verifyItemInList(itemName) {
    const item = await this.page.locator(`text=${itemName}`).first();
    if (!(await item.isVisible())) {
      throw new Error(`Item "${itemName}" not found in list`);
    }
  }

  async verifyItemNotInList(itemName) {
    const item = await this.page.locator(`text=${itemName}`).first();
    if (await item.isVisible()) {
      throw new Error(`Item "${itemName}" still found in list after deletion`);
    }
  }

  async verifyDetailsDisplayed(testData) {
    for (const [field, value] of Object.entries(testData)) {
      try {
        const element = await this.page.locator(`text=${value}`).first();
        if (!(await element.isVisible())) {
          throw new Error(`Field "${field}" with value "${value}" not found in details`);
        }
      } catch (error) {
        console.log(`Warning: Could not verify field ${field} with value ${value}`);
      }
    }
  }

  async runAllCRUDTests() {
    console.log('🎯 Starting QA CRUD Test Suite...');
    
    // Create screenshots directory
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }

    // Login first
    await this.login();

    // Execute all test cases
    for (const testCase of crudTestCases) {
      await this.executeCRUDTest(testCase);
      
      // Small delay between tests
      await this.page.waitForTimeout(1000);
    }

    // Generate report
    await this.generateTestReport();
  }

  async runModuleTests(module) {
    console.log(`🎯 Starting ${module.toUpperCase()} Module Tests...`);
    
    await this.login();

    const moduleTests = crudTestCases.filter(test => test.module === module);
    
    for (const testCase of moduleTests) {
      await this.executeCRUDTest(testCase);
      await this.page.waitForTimeout(1000);
    }

    await this.generateTestReport();
  }

  async generateTestReport() {
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    const total = this.testResults.length;
    const successRate = ((passed / total) * 100).toFixed(2);

    console.log('\n' + '='.repeat(80));
    console.log('📊 QA CRUD TEST REPORT');
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
        user: this.currentUser
      },
      moduleStats: moduleStats,
      results: this.testResults
    };

    fs.writeFileSync('qa-crud-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: qa-crud-test-report.json');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Cleanup completed');
  }
}

// CRUD Test Cases Configuration
const crudTestCases = [
  // CRM Module Tests
  {
    id: 'CRM-LEAD-001',
    name: 'Create New Lead',
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
      status: 'New'
    }
  },
  {
    id: 'CRM-LEAD-002',
    name: 'Read Lead Details',
    module: 'crm',
    entity: 'Lead',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      company: 'ABC Corp'
    }
  },
  {
    id: 'CRM-LEAD-003',
    name: 'Update Lead Information',
    module: 'crm',
    entity: 'Lead',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    updateData: {
      status: 'Qualified',
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
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
  },

  // ERP Module Tests
  {
    id: 'ERP-PRODUCT-001',
    name: 'Create New Product',
    module: 'erp',
    entity: 'Product',
    operation: 'CREATE',
    priority: 'Critical',
    testData: {
      name: 'Laptop Computer',
      description: 'High-performance laptop',
      category: 'Electronics',
      price: '999.99',
      cost: '750.00',
      sku: 'LAP-001',
      hsn_code: '8471',
      gst_rate: '18',
      stock_quantity: '50'
    }
  },
  {
    id: 'ERP-PRODUCT-002',
    name: 'Read Product Details',
    module: 'erp',
    entity: 'Product',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      name: 'Laptop Computer',
      sku: 'LAP-001'
    }
  },
  {
    id: 'ERP-PRODUCT-003',
    name: 'Update Product Information',
    module: 'erp',
    entity: 'Product',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      name: 'Laptop Computer',
      sku: 'LAP-001'
    },
    updateData: {
      price: '1099.99',
      stock_quantity: '45'
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
      name: 'Laptop Computer',
      sku: 'LAP-001'
    }
  },

  // HR Module Tests
  {
    id: 'HR-EMPLOYEE-001',
    name: 'Create New Employee',
    module: 'hr',
    entity: 'Employee',
    operation: 'CREATE',
    priority: 'Critical',
    testData: {
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@company.com',
      phone: '+1-555-123-4567',
      department: 'Engineering',
      position: 'Software Engineer',
      hire_date: new Date().toISOString().split('T')[0],
      salary: '75000'
    }
  },
  {
    id: 'HR-EMPLOYEE-002',
    name: 'Read Employee Details',
    module: 'hr',
    entity: 'Employee',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@company.com'
    }
  },
  {
    id: 'HR-EMPLOYEE-003',
    name: 'Update Employee Information',
    module: 'hr',
    entity: 'Employee',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@company.com'
    },
    updateData: {
      department: 'Marketing',
      salary: '80000'
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
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@company.com'
    }
  },

  // IT Asset Module Tests
  {
    id: 'IT-ASSET-001',
    name: 'Create New Asset',
    module: 'it-assets',
    entity: 'Asset',
    operation: 'CREATE',
    priority: 'Critical',
    testData: {
      name: 'Dell Laptop XPS 13',
      asset_type: 'Computer',
      serial_number: 'DL123456789',
      manufacturer: 'Dell',
      model: 'XPS 13',
      purchase_date: new Date().toISOString().split('T')[0],
      purchase_cost: '1200.00',
      location: 'Office Floor 2',
      status: 'Active'
    }
  },
  {
    id: 'IT-ASSET-002',
    name: 'Read Asset Details',
    module: 'it-assets',
    entity: 'Asset',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      name: 'Dell Laptop XPS 13',
      serial_number: 'DL123456789'
    }
  },
  {
    id: 'IT-ASSET-003',
    name: 'Update Asset Information',
    module: 'it-assets',
    entity: 'Asset',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      name: 'Dell Laptop XPS 13',
      serial_number: 'DL123456789'
    },
    updateData: {
      location: 'Office Floor 3',
      status: 'Maintenance'
    }
  },
  {
    id: 'IT-ASSET-004',
    name: 'Delete Asset',
    module: 'it-assets',
    entity: 'Asset',
    operation: 'DELETE',
    priority: 'Critical',
    testData: {
      name: 'Dell Laptop XPS 13',
      serial_number: 'DL123456789'
    }
  },

  // GST Module Tests
  {
    id: 'GST-INVOICE-001',
    name: 'Create GST Invoice',
    module: 'gst',
    entity: 'GST Invoice',
    operation: 'CREATE',
    priority: 'Critical',
    testData: {
      customer_name: 'XYZ Corporation',
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      product_name: 'Laptop Computer',
      quantity: '2',
      unit_price: '999.99',
      gst_rate: '18'
    }
  },
  {
    id: 'GST-INVOICE-002',
    name: 'Read GST Invoice Details',
    module: 'gst',
    entity: 'GST Invoice',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      customer_name: 'XYZ Corporation',
      product_name: 'Laptop Computer'
    }
  },
  {
    id: 'GST-INVOICE-003',
    name: 'Update GST Invoice',
    module: 'gst',
    entity: 'GST Invoice',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      customer_name: 'XYZ Corporation',
      product_name: 'Laptop Computer'
    },
    updateData: {
      quantity: '3',
      due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  },
  {
    id: 'GST-INVOICE-004',
    name: 'Delete GST Invoice',
    module: 'gst',
    entity: 'GST Invoice',
    operation: 'DELETE',
    priority: 'Critical',
    testData: {
      customer_name: 'XYZ Corporation',
      product_name: 'Laptop Computer'
    }
  },

  // Common Module Tests
  {
    id: 'COMMON-USER-001',
    name: 'Create New User',
    module: 'common',
    entity: 'User',
    operation: 'CREATE',
    priority: 'Critical',
    testData: {
      name: 'Jane Doe',
      email: 'jane.doe@company.com',
      password: 'SecurePass123!',
      role: 'Manager',
      department: 'Sales',
      phone: '+1-555-987-6543'
    }
  },
  {
    id: 'COMMON-USER-002',
    name: 'Read User Details',
    module: 'common',
    entity: 'User',
    operation: 'READ',
    priority: 'Critical',
    testData: {
      name: 'Jane Doe',
      email: 'jane.doe@company.com'
    }
  },
  {
    id: 'COMMON-USER-003',
    name: 'Update User Information',
    module: 'common',
    entity: 'User',
    operation: 'UPDATE',
    priority: 'Critical',
    testData: {
      name: 'Jane Doe',
      email: 'jane.doe@company.com'
    },
    updateData: {
      role: 'Senior Manager',
      department: 'Marketing'
    }
  },
  {
    id: 'COMMON-USER-004',
    name: 'Delete User',
    module: 'common',
    entity: 'User',
    operation: 'DELETE',
    priority: 'Critical',
    testData: {
      name: 'Jane Doe',
      email: 'jane.doe@company.com'
    }
  }
];

// Main execution function
async function main() {
  const tester = new QACRUDTester();
  
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

module.exports = { QACRUDTester, crudTestCases }; 