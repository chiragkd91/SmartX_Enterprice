# 🚀 **MODAL RPA TEST EXECUTION GUIDE**

## 📋 **PREREQUISITES**

### **1. Environment Setup**
```bash
# Install Node.js (v16 or higher)
node --version

# Install Playwright
npm install playwright

# Install Playwright browsers
npx playwright install chromium
```

### **2. Application Setup**
```bash
# Ensure SmartBizFlow is running
npm run dev

# Verify application is accessible
curl http://localhost:5187
```

### **3. Directory Structure**
```
SmartBizFlow_update/
├── modal-test-automation/
│   ├── modal-test-automation.js
│   ├── modal-test-configs.js
│   ├── screenshots/
│   └── reports/
├── MODAL_RPA_TEST_PLAN.md
├── MODAL_BUG_REPORT.md
└── MODAL_TEST_EXECUTION_GUIDE.md
```

---

## 🎯 **EXECUTION STEPS**

### **Step 1: Prepare Test Environment**

```bash
# Create test directory
mkdir modal-test-automation
cd modal-test-automation

# Create screenshots directory
mkdir screenshots
mkdir reports

# Copy test script
cp ../MODAL_TEST_AUTOMATION_SCRIPT.js ./modal-test-automation.js
```

### **Step 2: Install Dependencies**

```bash
# Initialize package.json
npm init -y

# Install Playwright
npm install playwright

# Install additional dependencies
npm install fs-extra
```

### **Step 3: Configure Test Script**

```javascript
// Update baseUrl in modal-test-automation.js
const baseUrl = 'http://localhost:5187'; // Update if different port
```

### **Step 4: Run Individual Modal Tests**

```bash
# Test specific modal
node -e "
const { ModalRPATester } = require('./modal-test-automation.js');
const tester = new ModalRPATester();

async function testSpecificModal() {
  await tester.initialize();
  
  const config = {
    module: 'crm',
    modalName: 'Add New Lead',
    triggerSelector: 'button:has-text(\"Add New Lead\")',
    expectedContent: ['Add New Lead', 'Full Name'],
    testId: 'crm-leads-add-dialog'
  };
  
  await tester.testModal(config);
  await tester.cleanup();
}

testSpecificModal();
"
```

### **Step 5: Run All Modal Tests**

```bash
# Execute complete test suite
node modal-test-automation.js
```

### **Step 6: Run Module-Specific Tests**

```bash
# Test CRM modals only
node -e "
const { ModalRPATester, modalTestConfigs } = require('./modal-test-automation.js');

async function testCRM() {
  const tester = new ModalRPATester();
  await tester.initialize();
  
  const crmConfigs = modalTestConfigs.filter(config => config.module === 'crm');
  
  for (const config of crmConfigs) {
    await tester.testModal(config);
  }
  
  await tester.generateTestReport();
  await tester.cleanup();
}

testCRM();
"
```

---

## 📊 **TEST EXECUTION OPTIONS**

### **1. Headless Mode (Recommended for CI/CD)**
```javascript
// Update in modal-test-automation.js
this.browser = await chromium.launch({ 
  headless: true, // Set to true for headless
  slowMo: 0 // No delay for faster execution
});
```

### **2. Debug Mode (For Development)**
```javascript
// Update in modal-test-automation.js
this.browser = await chromium.launch({ 
  headless: false, // Visible browser
  slowMo: 2000, // 2 second delay
  devtools: true // Open DevTools
});
```

### **3. Parallel Execution**
```javascript
// Run multiple modals in parallel
async function runParallelTests() {
  const tester = new ModalRPATester();
  await tester.initialize();
  
  const batchSize = 5; // Test 5 modals at once
  const batches = [];
  
  for (let i = 0; i < modalTestConfigs.length; i += batchSize) {
    batches.push(modalTestConfigs.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    await Promise.all(batch.map(config => tester.testModal(config)));
  }
  
  await tester.cleanup();
}
```

---

## 🔍 **MONITORING & DEBUGGING**

### **1. Real-time Monitoring**
```bash
# Watch test execution
tail -f modal-test-automation.log

# Monitor screenshots
ls -la screenshots/
```

### **2. Debug Failed Tests**
```javascript
// Add debugging to testModal function
async testModal(modalConfig) {
  try {
    // ... existing code ...
  } catch (error) {
    console.log('🔍 Debugging failed test:', modalConfig.testId);
    console.log('Current URL:', await this.page.url());
    console.log('Page content:', await this.page.content());
    
    // Take debug screenshot
    await this.page.screenshot({ 
      path: `screenshots/debug_${modalConfig.testId}.png`,
      fullPage: true 
    });
    
    throw error;
  }
}
```

### **3. Network Monitoring**
```javascript
// Monitor network requests
await this.page.route('**/*', route => {
  console.log('🌐 Network request:', route.request().url());
  route.continue();
});
```

---

## 📈 **PERFORMANCE TESTING**

### **1. Load Testing**
```javascript
// Test modal performance under load
async function loadTest() {
  const tester = new ModalRPATester();
  await tester.initialize();
  
  const startTime = Date.now();
  
  // Open/close modal 100 times
  for (let i = 0; i < 100; i++) {
    const config = modalTestConfigs[0]; // Test first modal
    await tester.testModal(config);
  }
  
  const duration = Date.now() - startTime;
  console.log(`Load test completed in ${duration}ms`);
  
  await tester.cleanup();
}
```

### **2. Memory Testing**
```javascript
// Monitor memory usage
async function memoryTest() {
  const tester = new ModalRPATester();
  await tester.initialize();
  
  const initialMemory = process.memoryUsage();
  
  // Test modals
  for (const config of modalTestConfigs) {
    await tester.testModal(config);
  }
  
  const finalMemory = process.memoryUsage();
  
  console.log('Memory usage:', {
    initial: initialMemory,
    final: finalMemory,
    difference: {
      heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
      heapTotal: finalMemory.heapTotal - initialMemory.heapTotal
    }
  });
  
  await tester.cleanup();
}
```

---

## 🐛 **TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **1. Modal Not Found**
```bash
# Error: Modal not opening
# Solution: Check selector and page navigation
```

**Debug Steps:**
1. Verify page URL is correct
2. Check if trigger button exists
3. Ensure modal component is loaded
4. Check for JavaScript errors

#### **2. Timeout Errors**
```javascript
// Increase timeout for slow modals
await this.page.waitForSelector('[role="dialog"]', { 
  timeout: 10000 // 10 seconds
});
```

#### **3. Selector Issues**
```javascript
// Use multiple selectors for robustness
const selectors = [
  'button:has-text("Add New Lead")',
  '[data-testid="add-lead-button"]',
  'button[aria-label="Add New Lead"]'
];

for (const selector of selectors) {
  try {
    await this.page.click(selector);
    break;
  } catch (error) {
    continue;
  }
}
```

#### **4. Network Issues**
```javascript
// Handle network errors
this.page.on('error', error => {
  console.log('Page error:', error);
});

this.page.on('pageerror', error => {
  console.log('JavaScript error:', error);
});
```

---

## 📊 **REPORTING & ANALYSIS**

### **1. Generate HTML Report**
```javascript
// Create HTML report
async function generateHTMLReport() {
  const report = require('./modal-test-report.json');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Modal Test Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .passed { color: green; }
        .failed { color: red; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Modal Test Report</h1>
      <div class="summary">
        <h2>Summary</h2>
        <p>Total: ${report.summary.total}</p>
        <p>Passed: <span class="passed">${report.summary.passed}</span></p>
        <p>Failed: <span class="failed">${report.summary.failed}</span></p>
        <p>Success Rate: ${report.summary.successRate}%</p>
      </div>
      
      <h2>Results</h2>
      ${report.results.map(result => `
        <div class="${result.status.toLowerCase()}">
          <h3>${result.modalName}</h3>
          <p>Status: ${result.status}</p>
          <p>Duration: ${result.duration}ms</p>
          ${result.errors.length > 0 ? `<p>Errors: ${result.errors.join(', ')}</p>` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  require('fs').writeFileSync('modal-test-report.html', html);
}
```

### **2. Performance Analysis**
```javascript
// Analyze test performance
function analyzePerformance() {
  const report = require('./modal-test-report.json');
  
  const durations = report.results.map(r => r.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);
  
  console.log('Performance Analysis:');
  console.log(`Average Duration: ${avgDuration.toFixed(2)}ms`);
  console.log(`Max Duration: ${maxDuration}ms`);
  console.log(`Min Duration: ${minDuration}ms`);
  
  // Identify slow modals
  const slowModals = report.results.filter(r => r.duration > 5000);
  if (slowModals.length > 0) {
    console.log('Slow Modals:');
    slowModals.forEach(modal => {
      console.log(`- ${modal.modalName}: ${modal.duration}ms`);
    });
  }
}
```

---

## 🚀 **CI/CD INTEGRATION**

### **1. GitHub Actions**
```yaml
# .github/workflows/modal-tests.yml
name: Modal Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm install
    
    - name: Install Playwright
      run: npx playwright install chromium
    
    - name: Start application
      run: npm run dev &
    
    - name: Wait for application
      run: sleep 30
    
    - name: Run modal tests
      run: node modal-test-automation/modal-test-automation.js
    
    - name: Upload screenshots
      uses: actions/upload-artifact@v2
      with:
        name: modal-test-screenshots
        path: modal-test-automation/screenshots/
    
    - name: Upload report
      uses: actions/upload-artifact@v2
      with:
        name: modal-test-report
        path: modal-test-automation/modal-test-report.json
```

### **2. Jenkins Pipeline**
```groovy
// Jenkinsfile
pipeline {
    agent any
    
    stages {
        stage('Setup') {
            steps {
                sh 'npm install'
                sh 'npx playwright install chromium'
            }
        }
        
        stage('Start App') {
            steps {
                sh 'npm run dev &'
                sh 'sleep 30'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'node modal-test-automation/modal-test-automation.js'
            }
        }
        
        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'modal-test-automation/screenshots/**/*'
                archiveArtifacts artifacts: 'modal-test-automation/modal-test-report.json'
            }
        }
    }
    
    post {
        always {
            sh 'pkill -f "npm run dev"'
        }
    }
}
```

---

## 📋 **CHECKLIST**

### **Pre-Test Checklist**
- [ ] Application is running on correct port
- [ ] All dependencies installed
- [ ] Test directories created
- [ ] Screenshots directory exists
- [ ] Base URL configured correctly

### **Test Execution Checklist**
- [ ] Individual modal tests working
- [ ] All modals opening correctly
- [ ] Screenshots being captured
- [ ] Error handling working
- [ ] Reports being generated

### **Post-Test Checklist**
- [ ] All screenshots reviewed
- [ ] Test report analyzed
- [ ] Performance metrics recorded
- [ ] Failed tests documented
- [ ] Cleanup completed

---

**Execution Guide Status: ✅ READY FOR USE**
**Total Test Configurations: 48**
**Estimated Execution Time: 30-45 minutes**
**Screenshot Capture: Enabled**
**Error Reporting: Comprehensive** 