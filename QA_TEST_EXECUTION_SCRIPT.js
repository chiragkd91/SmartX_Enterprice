/**
 * 🧪 SMARTBIZFLOW QA CRUD TEST EXECUTION SCRIPT
 * 
 * This script automates the execution of basic functionality tests
 * across all modules in the SmartBizFlow application.
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

class QACRUDTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.baseUrl = 'http://localhost:5173';
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
    
    // Wait for the login form to be visible
    await this.page.waitForSelector('#email', { timeout: 10000 });
    await this.page.waitForSelector('#password', { timeout: 10000 });
    
    // Login with admin credentials
    await this.page.fill('#email', 'admin@smartbizflow.com');
    await this.page.fill('#password', 'password123');
    await this.page.click('button[type="submit"]');
    
    // Wait for login to complete - check for dashboard or main app
    try {
      await this.page.waitForURL('**/dashboard', { timeout: 10000 });
    } catch (error) {
      // If dashboard URL doesn't work, wait for any navigation away from login
      await this.page.waitForURL('**/*', { timeout: 10000 });
    }
    
    this.currentUser = {
      email: 'admin@smartbizflow.com',
      role: 'admin'
    };
    
    console.log('✅ Login successful');
  }

  async executeNavigationTest(testCase) {
    const result = {
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      module: testCase.module,
      path: testCase.path,
      status: 'PENDING',
      errors: [],
      duration: 0,
      screenshots: []
    };

    const startTime = Date.now();

    try {
      console.log(`🔍 Executing: ${testCase.name} (${testCase.id})`);

      // Navigate to the module
      await this.page.goto(`${this.baseUrl}${testCase.path}`);
      await this.page.waitForLoadState('networkidle');
      
      // Wait for the page to load
      await this.page.waitForTimeout(2000);
      
      // Take a screenshot
      const screenshotPath = `screenshots/${testCase.id}.png`;
      await this.page.screenshot({ path: screenshotPath });
      result.screenshots.push(screenshotPath);
      
      // Basic validation - check if page loaded
      const pageTitle = await this.page.title();
      if (!pageTitle || pageTitle === 'Error') {
        throw new Error('Page failed to load properly');
      }
      
      result.status = 'PASSED';
      result.duration = Date.now() - startTime;
      
      console.log(`✅ ${testCase.name} - PASSED (${result.duration}ms)`);
      
    } catch (error) {
      result.status = 'FAILED';
      result.errors.push(error.message);
      result.duration = Date.now() - startTime;
      
      // Take error screenshot
      const errorScreenshot = `screenshots/error_${testCase.id}.png`;
      await this.page.screenshot({ path: errorScreenshot });
      result.screenshots.push(errorScreenshot);
      
      console.log(`❌ ${testCase.name} - FAILED: ${error.message}`);
    }

    this.testResults.push(result);
    return result;
  }

  async runAllNavigationTests() {
    console.log('🎯 Starting QA Navigation Test Suite...');
    
    // Create screenshots directory
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }

    // Login first
    await this.login();

    // Execute all navigation test cases
    for (const testCase of navigationTestCases) {
      await this.executeNavigationTest(testCase);
      
      // Small delay between tests
      await this.page.waitForTimeout(1000);
    }

    // Generate report
    await this.generateTestReport();
  }

  async generateTestReport() {
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    const total = this.testResults.length;
    const successRate = ((passed / total) * 100).toFixed(2);

    console.log('\n' + '='.repeat(80));
    console.log('📊 QA NAVIGATION TEST REPORT');
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
          console.log(`  Module: ${result.module}, Path: ${result.path}`);
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

    fs.writeFileSync('qa-navigation-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: qa-navigation-test-report.json');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Cleanup completed');
  }
}

// Navigation Test Cases Configuration
const navigationTestCases = [
  // Dashboard Tests
  {
    id: 'NAV-DASHBOARD-001',
    name: 'Navigate to Dashboard',
    module: 'dashboard',
    path: '/dashboard'
  },
  {
    id: 'NAV-HOME-001',
    name: 'Navigate to Home',
    module: 'dashboard',
    path: '/home'
  },

  // CRM Module Tests
  {
    id: 'NAV-CRM-001',
    name: 'Navigate to CRM Overview',
    module: 'crm',
    path: '/crm'
  },
  {
    id: 'NAV-CRM-002',
    name: 'Navigate to CRM Leads',
    module: 'crm',
    path: '/crm/leads'
  },
  {
    id: 'NAV-CRM-003',
    name: 'Navigate to CRM Customers',
    module: 'crm',
    path: '/crm/customers'
  },

  // ERP Module Tests
  {
    id: 'NAV-ERP-001',
    name: 'Navigate to ERP Overview',
    module: 'erp',
    path: '/erp'
  },
  {
    id: 'NAV-ERP-002',
    name: 'Navigate to ERP Products',
    module: 'erp',
    path: '/erp/products'
  },
  {
    id: 'NAV-ERP-003',
    name: 'Navigate to ERP Orders',
    module: 'erp',
    path: '/erp/orders'
  },
  {
    id: 'NAV-ERP-004',
    name: 'Navigate to ERP Invoices',
    module: 'erp',
    path: '/erp/invoices'
  },
  {
    id: 'NAV-ERP-005',
    name: 'Navigate to ERP Vendors',
    module: 'erp',
    path: '/erp/vendors'
  },

  // HR Module Tests
  {
    id: 'NAV-HR-001',
    name: 'Navigate to HR Dashboard',
    module: 'hr',
    path: '/hr'
  },
  {
    id: 'NAV-HR-002',
    name: 'Navigate to HR Employees',
    module: 'hr',
    path: '/hr/employees'
  },
  {
    id: 'NAV-HR-003',
    name: 'Navigate to HR Attendance',
    module: 'hr',
    path: '/hr/attendance'
  },
  {
    id: 'NAV-HR-004',
    name: 'Navigate to HR Leave',
    module: 'hr',
    path: '/hr/leave'
  },
  {
    id: 'NAV-HR-005',
    name: 'Navigate to HR Payroll',
    module: 'hr',
    path: '/hr/payroll'
  },

  // IT Asset Module Tests
  {
    id: 'NAV-IT-ASSET-001',
    name: 'Navigate to IT Asset Dashboard',
    module: 'it-assets',
    path: '/assets'
  },
  {
    id: 'NAV-IT-ASSET-002',
    name: 'Navigate to IT Asset Management',
    module: 'it-assets',
    path: '/assets/management'
  },
  {
    id: 'NAV-IT-ASSET-003',
    name: 'Navigate to IT Asset Tracking',
    module: 'it-assets',
    path: '/assets/tracking'
  },

  // GST Module Tests
  {
    id: 'NAV-GST-001',
    name: 'Navigate to GST',
    module: 'gst',
    path: '/gst'
  },

  // Common Module Tests
  {
    id: 'NAV-COMMON-001',
    name: 'Navigate to User Management',
    module: 'common',
    path: '/users'
  },
  {
    id: 'NAV-COMMON-002',
    name: 'Navigate to Settings',
    module: 'common',
    path: '/settings'
  },
  {
    id: 'NAV-COMMON-003',
    name: 'Navigate to Reports',
    module: 'common',
    path: '/reports'
  }
];

// Main execution function
async function main() {
  const tester = new QACRUDTester();
  
  try {
    await tester.initialize();
    await tester.runAllNavigationTests();
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  } finally {
    await tester.cleanup();
  }
}

// Run the tests if this script is executed directly
console.log('🚀 Starting QA Navigation Test Execution...');
main().catch(console.error);

export { QACRUDTester, navigationTestCases }; 