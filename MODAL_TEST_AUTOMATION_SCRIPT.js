/**
 * 🤖 SMARTBIZFLOW MODAL RPA TEST AUTOMATION SCRIPT
 * 
 * This script automates testing of all 48 modals in the SmartBizFlow application
 * using Playwright for browser automation.
 */

const { chromium } = require('playwright');

class ModalRPATester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.baseUrl = 'http://localhost:5187';
  }

  async initialize() {
    console.log('🚀 Initializing Modal RPA Tester...');
    this.browser = await chromium.launch({ 
      headless: false, // Set to true for headless mode
      slowMo: 1000 // Slow down for visibility
    });
    this.page = await this.browser.newPage();
    
    // Set viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('✅ Browser initialized successfully');
  }

  async testModal(modalConfig) {
    const result = {
      module: modalConfig.module,
      modalName: modalConfig.modalName,
      testId: modalConfig.testId,
      status: 'PENDING',
      errors: [],
      duration: 0,
      screenshots: []
    };

    const startTime = Date.now();

    try {
      console.log(`🔍 Testing modal: ${modalConfig.modalName} (${modalConfig.testId})`);

      // Navigate to module page
      await this.navigateToModule(modalConfig.module);
      
      // Wait for page to load
      await this.page.waitForLoadState('networkidle');
      
      // Take screenshot before opening modal
      const beforeScreenshot = await this.page.screenshot({ 
        path: `screenshots/before_${modalConfig.testId}.png` 
      });
      result.screenshots.push(`before_${modalConfig.testId}.png`);

      // Click trigger button to open modal
      await this.page.click(modalConfig.triggerSelector);
      
      // Wait for modal to appear
      await this.page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      // Take screenshot of open modal
      const modalScreenshot = await this.page.screenshot({ 
        path: `screenshots/modal_${modalConfig.testId}.png` 
      });
      result.screenshots.push(`modal_${modalConfig.testId}.png`);

      // Verify modal content
      await this.verifyModalContent(modalConfig.expectedContent);
      
      // Test modal functionality
      await this.testModalFunctionality(modalConfig);
      
      // Test modal close
      await this.testModalClose();
      
      // Take screenshot after closing modal
      const afterScreenshot = await this.page.screenshot({ 
        path: `screenshots/after_${modalConfig.testId}.png` 
      });
      result.screenshots.push(`after_${modalConfig.testId}.png`);

      result.status = 'PASSED';
      result.duration = Date.now() - startTime;
      
      console.log(`✅ ${modalConfig.modalName} - PASSED (${result.duration}ms)`);
      
    } catch (error) {
      result.status = 'FAILED';
      result.errors.push(error.message);
      result.duration = Date.now() - startTime;
      
      // Take error screenshot
      const errorScreenshot = await this.page.screenshot({ 
        path: `screenshots/error_${modalConfig.testId}.png` 
      });
      result.screenshots.push(`error_${modalConfig.testId}.png`);
      
      console.log(`❌ ${modalConfig.modalName} - FAILED: ${error.message}`);
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
      'common': '/dashboard'
    };
    
    const route = moduleRoutes[module] || '/dashboard';
    await this.page.goto(`${this.baseUrl}${route}`);
    
    // Wait for page to load
    await this.page.waitForLoadState('networkidle');
  }

  async verifyModalContent(expectedContent) {
    for (const content of expectedContent) {
      const element = await this.page.locator(`text=${content}`);
      const isVisible = await element.isVisible();
      
      if (!isVisible) {
        throw new Error(`Expected content "${content}" not found in modal`);
      }
    }
  }

  async testModalFunctionality(modalConfig) {
    // Test form inputs if present
    const inputs = await this.page.locator('[role="dialog"] input, [role="dialog"] textarea, [role="dialog"] select');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      console.log(`  📝 Testing ${inputCount} form inputs...`);
      
      for (let i = 0; i < Math.min(inputCount, 3); i++) { // Test first 3 inputs
        const input = inputs.nth(i);
        const inputType = await input.getAttribute('type');
        
        if (inputType !== 'hidden') {
          await input.fill('test input');
          await this.page.waitForTimeout(500);
        }
      }
    }

    // Test buttons if present
    const buttons = await this.page.locator('[role="dialog"] button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      console.log(`  🔘 Found ${buttonCount} buttons in modal`);
    }
  }

  async testModalClose() {
    // Try to close modal using X button
    const closeButton = await this.page.locator('[role="dialog"] button[aria-label="Close"], [role="dialog"] [data-testid="close-button"]');
    
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // Try Escape key
      await this.page.keyboard.press('Escape');
    }
    
    // Wait for modal to close
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 3000 });
  }

  async runAllTests() {
    console.log('🎯 Starting Modal RPA Test Suite...');
    
    // Create screenshots directory
    const fs = require('fs');
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }

    // Test all modals
    for (const config of modalTestConfigs) {
      await this.testModal(config);
      
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

    console.log('\n' + '='.repeat(60));
    console.log('📊 MODAL RPA TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log('='.repeat(60));

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => r.status === 'FAILED')
        .forEach(result => {
          console.log(`\n- ${result.modalName} (${result.testId})`);
          console.log(`  Duration: ${result.duration}ms`);
          console.log(`  Errors: ${result.errors.join(', ')}`);
        });
    }

    // Save detailed report to file
    const report = {
      summary: {
        total: total,
        passed: passed,
        failed: failed,
        successRate: successRate,
        timestamp: new Date().toISOString()
      },
      results: this.testResults
    };

    const fs = require('fs');
    fs.writeFileSync('modal-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: modal-test-report.json');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Cleanup completed');
  }
}

// Modal Test Configurations
const modalTestConfigs = [
  // CRM Module Tests
  {
    module: 'crm',
    modalName: 'Add New Lead',
    triggerSelector: 'button:has-text("Add New Lead")',
    expectedContent: ['Add New Lead', 'Full Name', 'Company', 'Email'],
    testId: 'crm-leads-add-dialog'
  },
  {
    module: 'crm',
    modalName: 'Add Customer',
    triggerSelector: 'button:has-text("Add Customer")',
    expectedContent: ['Add New Customer', 'Customer Name', 'Company'],
    testId: 'crm-customers-add-dialog'
  },
  {
    module: 'crm',
    modalName: 'View Customer Details',
    triggerSelector: 'button:has-text("View")',
    expectedContent: ['Customer Details', 'Company Information'],
    testId: 'crm-customers-view-dialog'
  },
  {
    module: 'crm',
    modalName: 'Create Campaign',
    triggerSelector: 'button:has-text("Create Campaign")',
    expectedContent: ['Create Email Campaign', 'Campaign Name'],
    testId: 'crm-email-campaign-dialog'
  },
  {
    module: 'crm',
    modalName: 'Create Template',
    triggerSelector: 'button:has-text("Create Template")',
    expectedContent: ['Create Email Template', 'Template Name'],
    testId: 'crm-email-template-dialog'
  },
  {
    module: 'crm',
    modalName: 'Create Scoring Rule',
    triggerSelector: 'button:has-text("Create Rule")',
    expectedContent: ['Create Scoring Rule', 'Rule Name'],
    testId: 'crm-scoring-rule-dialog'
  },
  {
    module: 'crm',
    modalName: 'Create Scoring Model',
    triggerSelector: 'button:has-text("Create Model")',
    expectedContent: ['Create Scoring Model', 'Model Name'],
    testId: 'crm-scoring-model-dialog'
  },
  {
    module: 'crm',
    modalName: 'Notification Settings',
    triggerSelector: 'button:has-text("Settings")',
    expectedContent: ['Notification Settings'],
    testId: 'crm-notifications-settings-dialog'
  },

  // ERP Module Tests
  {
    module: 'erp',
    modalName: 'Add Customer (ERP)',
    triggerSelector: 'button:has-text("Add Customer")',
    expectedContent: ['Add New Customer', 'Customer Name'],
    testId: 'erp-customers-add-dialog'
  },
  {
    module: 'erp',
    modalName: 'View Customer (ERP)',
    triggerSelector: 'button:has-text("View")',
    expectedContent: ['Customer Details'],
    testId: 'erp-customers-view-dialog'
  },
  {
    module: 'erp',
    modalName: 'Add Product',
    triggerSelector: 'button:has-text("Add Product")',
    expectedContent: ['Add New Product', 'Product Name'],
    testId: 'erp-products-add-dialog'
  },
  {
    module: 'erp',
    modalName: 'View Order Details',
    triggerSelector: 'button:has-text("View")',
    expectedContent: ['Order Details'],
    testId: 'erp-orders-view-dialog'
  },
  {
    module: 'erp',
    modalName: 'Create Invoice',
    triggerSelector: 'button:has-text("Create Invoice")',
    expectedContent: ['Create Invoice', 'Invoice Number'],
    testId: 'erp-invoices-create-dialog'
  },
  {
    module: 'erp',
    modalName: 'View Invoice',
    triggerSelector: 'button:has-text("View")',
    expectedContent: ['Invoice Details'],
    testId: 'erp-invoices-view-dialog'
  },
  {
    module: 'erp',
    modalName: 'Add Vendor',
    triggerSelector: 'button:has-text("Add Vendor")',
    expectedContent: ['Add New Vendor', 'Vendor Name'],
    testId: 'erp-vendors-add-dialog'
  },
  {
    module: 'erp',
    modalName: 'Add Inventory Item',
    triggerSelector: 'button:has-text("Add Item")',
    expectedContent: ['Add New Item', 'Item Name'],
    testId: 'erp-inventory-add-dialog'
  },
  {
    module: 'erp',
    modalName: 'Inventory Movement',
    triggerSelector: 'button:has-text("Movement")',
    expectedContent: ['Inventory Movement'],
    testId: 'erp-inventory-movement-dialog'
  },
  {
    module: 'erp',
    modalName: 'Warehouse Management',
    triggerSelector: 'button:has-text("Warehouse")',
    expectedContent: ['Warehouse Management'],
    testId: 'erp-inventory-warehouse-dialog'
  },
  {
    module: 'erp',
    modalName: 'Create Work Order',
    triggerSelector: 'button:has-text("Create Work Order")',
    expectedContent: ['Create New Work Order'],
    testId: 'erp-manufacturing-workorder-dialog'
  },
  {
    module: 'erp',
    modalName: 'BOM Management',
    triggerSelector: 'button:has-text("BOM")',
    expectedContent: ['Bill of Materials Management'],
    testId: 'erp-manufacturing-bom-dialog'
  },
  {
    module: 'erp',
    modalName: 'Quality Check',
    triggerSelector: 'button:has-text("Quality")',
    expectedContent: ['Quality Check'],
    testId: 'erp-manufacturing-quality-dialog'
  },
  {
    module: 'erp',
    modalName: 'Create Purchase Order',
    triggerSelector: 'button:has-text("Create PO")',
    expectedContent: ['Create Purchase Order'],
    testId: 'erp-procurement-po-dialog'
  },
  {
    module: 'erp',
    modalName: 'Create Requisition',
    triggerSelector: 'button:has-text("Create Requisition")',
    expectedContent: ['Create Requisition'],
    testId: 'erp-procurement-requisition-dialog'
  },
  {
    module: 'erp',
    modalName: 'Add Vendor (Procurement)',
    triggerSelector: 'button:has-text("Add Vendor")',
    expectedContent: ['Add New Vendor'],
    testId: 'erp-procurement-vendor-dialog'
  },
  {
    module: 'erp',
    modalName: 'Create Shipment',
    triggerSelector: 'button:has-text("Create Shipment")',
    expectedContent: ['Create Shipment'],
    testId: 'erp-logistics-shipment-dialog'
  },
  {
    module: 'erp',
    modalName: 'Receiving',
    triggerSelector: 'button:has-text("Receiving")',
    expectedContent: ['Receiving'],
    testId: 'erp-logistics-receiving-dialog'
  },
  {
    module: 'erp',
    modalName: 'Quality Inspection',
    triggerSelector: 'button:has-text("Create Inspection")',
    expectedContent: ['Create Quality Inspection'],
    testId: 'erp-quality-inspection-dialog'
  },
  {
    module: 'erp',
    modalName: 'Defect Management',
    triggerSelector: 'button:has-text("Defect")',
    expectedContent: ['Defect Management'],
    testId: 'erp-quality-defect-dialog'
  },
  {
    module: 'erp',
    modalName: 'Add Account',
    triggerSelector: 'button:has-text("Add Account")',
    expectedContent: ['Add New Account'],
    testId: 'erp-financial-account-dialog'
  },
  {
    module: 'erp',
    modalName: 'Add Journal Entry',
    triggerSelector: 'button:has-text("Add Entry")',
    expectedContent: ['Add Journal Entry'],
    testId: 'erp-financial-journal-dialog'
  },
  {
    module: 'erp',
    modalName: 'View Entry',
    triggerSelector: 'button:has-text("View")',
    expectedContent: ['Journal Entry Details'],
    testId: 'erp-financial-view-dialog'
  },

  // HR Module Tests
  {
    module: 'hr',
    modalName: 'Add Employee',
    triggerSelector: 'button:has-text("Add Employee")',
    expectedContent: ['Add New Employee', 'Full Name'],
    testId: 'hr-employees-add-dialog'
  },
  {
    module: 'hr',
    modalName: 'View Employee',
    triggerSelector: 'button:has-text("View")',
    expectedContent: ['Employee Details'],
    testId: 'hr-employees-view-dialog'
  },
  {
    module: 'hr',
    modalName: 'Apply Leave',
    triggerSelector: 'button:has-text("Apply Leave")',
    expectedContent: ['Apply Leave Request'],
    testId: 'hr-leave-apply-dialog'
  },
  {
    module: 'hr',
    modalName: 'Edit Profile',
    triggerSelector: 'button:has-text("Edit Profile")',
    expectedContent: ['Edit Profile'],
    testId: 'hr-ess-edit-profile-dialog'
  },
  {
    module: 'hr',
    modalName: 'Leave Request',
    triggerSelector: 'button:has-text("Request Leave")',
    expectedContent: ['Leave Request'],
    testId: 'hr-ess-leave-request-dialog'
  },
  {
    module: 'hr',
    modalName: 'Document Upload',
    triggerSelector: 'button:has-text("Upload Document")',
    expectedContent: ['Upload Document'],
    testId: 'hr-ess-document-upload-dialog'
  },
  {
    module: 'hr',
    modalName: 'Enrollment',
    triggerSelector: 'button:has-text("Enroll")',
    expectedContent: ['Benefits Enrollment'],
    testId: 'hr-benefits-enrollment-dialog'
  },
  {
    module: 'hr',
    modalName: 'Submit Claim',
    triggerSelector: 'button:has-text("Submit Claim")',
    expectedContent: ['Submit Claim'],
    testId: 'hr-benefits-claim-dialog'
  },
  {
    module: 'hr',
    modalName: 'Create Course',
    triggerSelector: 'button:has-text("Create Course")',
    expectedContent: ['Create Training Course'],
    testId: 'hr-training-course-dialog'
  },
  {
    module: 'hr',
    modalName: 'Schedule Training',
    triggerSelector: 'button:has-text("Schedule")',
    expectedContent: ['Schedule Training'],
    testId: 'hr-training-schedule-dialog'
  },
  {
    module: 'hr',
    modalName: 'Two-Factor Auth',
    triggerSelector: 'button:has-text("2FA")',
    expectedContent: ['Two-Factor Authentication'],
    testId: 'hr-security-2fa-dialog'
  },
  {
    module: 'hr',
    modalName: 'Security Policy',
    triggerSelector: 'button:has-text("Policy")',
    expectedContent: ['Security Policy'],
    testId: 'hr-security-policy-dialog'
  },
  {
    module: 'hr',
    modalName: 'Workflow Builder',
    triggerSelector: 'button:has-text("Workflow Builder")',
    expectedContent: ['Workflow Builder'],
    testId: 'hr-workflow-builder-dialog'
  },
  {
    module: 'hr',
    modalName: 'Form Builder',
    triggerSelector: 'button:has-text("Form Builder")',
    expectedContent: ['Form Builder'],
    testId: 'hr-workflow-form-dialog'
  },

  // IT Asset Module Tests
  {
    module: 'it-assets',
    modalName: 'Add Asset',
    triggerSelector: 'button:has-text("Add Asset")',
    expectedContent: ['Add New Asset'],
    testId: 'it-assets-add-dialog'
  },
  {
    module: 'it-assets',
    modalName: 'Edit Asset',
    triggerSelector: 'button:has-text("Edit")',
    expectedContent: ['Edit Asset'],
    testId: 'it-assets-edit-dialog'
  },
  {
    module: 'it-assets',
    modalName: 'Schedule Maintenance',
    triggerSelector: 'button:has-text("Schedule Maintenance")',
    expectedContent: ['Schedule New Maintenance'],
    testId: 'it-maintenance-schedule-dialog'
  },
  {
    module: 'it-assets',
    modalName: 'Edit Maintenance',
    triggerSelector: 'button:has-text("Edit")',
    expectedContent: ['Edit Maintenance Record'],
    testId: 'it-maintenance-edit-dialog'
  },
  {
    module: 'it-assets',
    modalName: 'Add License',
    triggerSelector: 'button:has-text("Add License")',
    expectedContent: ['Add New License'],
    testId: 'it-software-add-dialog'
  },
  {
    module: 'it-assets',
    modalName: 'Edit License',
    triggerSelector: 'button:has-text("Edit")',
    expectedContent: ['Edit License'],
    testId: 'it-software-edit-dialog'
  },
  {
    module: 'it-assets',
    modalName: 'Create Ticket',
    triggerSelector: 'button:has-text("Create Ticket")',
    expectedContent: ['Create Support Ticket'],
    testId: 'it-support-create-dialog'
  },
  {
    module: 'it-assets',
    modalName: 'View Ticket',
    triggerSelector: 'button:has-text("View")',
    expectedContent: ['Ticket Details'],
    testId: 'it-support-view-dialog'
  },

  // GST Module Tests
  {
    module: 'gst',
    modalName: 'File Return',
    triggerSelector: 'button:has-text("File Return")',
    expectedContent: ['File GST Return'],
    testId: 'gst-returns-file-dialog'
  },
  {
    module: 'gst',
    modalName: 'View Return',
    triggerSelector: 'button:has-text("View")',
    expectedContent: ['Return Details'],
    testId: 'gst-returns-view-dialog'
  },

  // Common Module Tests
  {
    module: 'common',
    modalName: 'Add User',
    triggerSelector: 'button:has-text("Add User")',
    expectedContent: ['Add New User'],
    testId: 'common-users-add-dialog'
  },
  {
    module: 'common',
    modalName: 'Edit User',
    triggerSelector: 'button:has-text("Edit")',
    expectedContent: ['Edit User'],
    testId: 'common-users-edit-dialog'
  },
  {
    module: 'common',
    modalName: 'Delete User',
    triggerSelector: 'button:has-text("Delete")',
    expectedContent: ['Delete User'],
    testId: 'common-users-delete-dialog'
  },
  {
    module: 'common',
    modalName: 'Upload Files',
    triggerSelector: 'button:has-text("Upload Files")',
    expectedContent: ['Upload New Files'],
    testId: 'common-files-upload-dialog'
  },
  {
    module: 'common',
    modalName: 'Create Report',
    triggerSelector: 'button:has-text("Create Report")',
    expectedContent: ['Create Custom Report'],
    testId: 'common-bi-report-dialog'
  },
  {
    module: 'common',
    modalName: 'Add Automation',
    triggerSelector: 'button:has-text("Add Automation")',
    expectedContent: ['Add New Automation'],
    testId: 'common-automation-add-dialog'
  }
];

// Main execution function
async function main() {
  const tester = new ModalRPATester();
  
  try {
    await tester.initialize();
    await tester.runAllTests();
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

module.exports = { ModalRPATester, modalTestConfigs }; 