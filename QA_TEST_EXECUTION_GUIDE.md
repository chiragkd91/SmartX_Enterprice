# 🚀 **QA CRUD TEST EXECUTION GUIDE**

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

### **3. Test Data Preparation**
```bash
# Create test directories
mkdir qa-test-automation
mkdir screenshots
mkdir reports

# Copy test script
cp QA_TEST_EXECUTION_SCRIPT.js ./qa-test-automation/
```

---

## 🎯 **EXECUTION STEPS**

### **Step 1: Prepare Test Environment**

```bash
# Create test directory
mkdir qa-test-automation
cd qa-test-automation

# Create screenshots directory
mkdir screenshots
mkdir reports

# Copy test script
cp ../QA_TEST_EXECUTION_SCRIPT.js ./qa-test-automation.js
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
// Update baseUrl in qa-test-automation.js
const baseUrl = 'http://localhost:5187'; // Update if different port

// Update login credentials if needed
const loginCredentials = {
  email: 'admin@smartbizflow.com',
  password: 'password123'
};
```

### **Step 4: Run All CRUD Tests**

```bash
# Execute complete test suite
node qa-test-automation.js
```

### **Step 5: Run Module-Specific Tests**

```bash
# Test CRM module only
node qa-test-automation.js crm

# Test ERP module only
node qa-test-automation.js erp

# Test HR module only
node qa-test-automation.js hr

# Test IT Asset module only
node qa-test-automation.js it-assets

# Test GST module only
node qa-test-automation.js gst

# Test Common module only
node qa-test-automation.js common
```

### **Step 6: Run Individual Test Cases**

```bash
# Test specific CRUD operation
node -e "
const { QACRUDTester } = require('./qa-test-automation.js');
const tester = new QACRUDTester();

async function testSpecificCRUD() {
  await tester.initialize();
  await tester.login();
  
  const testCase = {
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
  };
  
  await tester.executeCRUDTest(testCase);
  await tester.cleanup();
}

testSpecificCRUD();
"
```

---

## 📊 **TEST EXECUTION OPTIONS**

### **1. Headless Mode (Recommended for CI/CD)**
```javascript
// Update in qa-test-automation.js
this.browser = await chromium.launch({ 
  headless: true, // Set to true for headless
  slowMo: 0 // No delay for faster execution
});
```

### **2. Debug Mode (For Development)**
```javascript
// Update in qa-test-automation.js
this.browser = await chromium.launch({ 
  headless: false, // Visible browser
  slowMo: 2000, // 2 second delay
  devtools: true // Open DevTools
});
```

### **3. Parallel Execution**
```javascript
// Run multiple test cases in parallel
async function runParallelTests() {
  const tester = new QACRUDTester();
  await tester.initialize();
  await tester.login();
  
  const batchSize = 5; // Test 5 cases at once
  const batches = [];
  
  for (let i = 0; i < crudTestCases.length; i += batchSize) {
    batches.push(crudTestCases.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    await Promise.all(batch.map(testCase => tester.executeCRUDTest(testCase)));
  }
  
  await tester.cleanup();
}
```

---

## 🔍 **MONITORING & DEBUGGING**

### **1. Real-time Monitoring**
```bash
# Watch test execution
tail -f qa-test-automation.log

# Monitor screenshots
ls -la screenshots/

# Check test progress
node -e "
const report = require('./qa-crud-test-report.json');
console.log('Progress:', report.summary.passed + '/' + report.summary.total);
"
```

### **2. Debug Failed Tests**
```javascript
// Add debugging to executeCRUDTest function
async executeCRUDTest(testCase) {
  try {
    // ... existing code ...
  } catch (error) {
    console.log('🔍 Debugging failed test:', testCase.id);
    console.log('Current URL:', await this.page.url());
    console.log('Page content:', await this.page.content());
    
    // Take debug screenshot
    await this.page.screenshot({ 
      path: `screenshots/debug_${testCase.id}.png`,
      fullPage: true 
    });
    
    throw error;
  }
}
```

### **3. Network Monitoring**
```javascript
// Monitor API requests
await this.page.route('**/*', route => {
  console.log('🌐 API request:', route.request().url());
  route.continue();
});
```

---

## 📈 **PERFORMANCE TESTING**

### **1. Load Testing**
```javascript
// Test CRUD performance under load
async function loadTest() {
  const tester = new QACRUDTester();
  await tester.initialize();
  await tester.login();
  
  const startTime = Date.now();
  
  // Execute same CRUD operation 100 times
  for (let i = 0; i < 100; i++) {
    const testCase = crudTestCases[0]; // Test first case
    await tester.executeCRUDTest(testCase);
  }
  
  const duration = Date.now() - startTime;
  console.log(`Load test completed in ${duration}ms`);
  
  await tester.cleanup();
}
```

### **2. Memory Testing**
```javascript
// Monitor memory usage during tests
async function memoryTest() {
  const tester = new QACRUDTester();
  await tester.initialize();
  await tester.login();
  
  const initialMemory = process.memoryUsage();
  
  // Execute all test cases
  for (const testCase of crudTestCases) {
    await tester.executeCRUDTest(testCase);
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

#### **1. Login Failures**
```bash
# Error: Login not working
# Solution: Check credentials and application status
```

**Debug Steps:**
1. Verify application is running
2. Check login credentials
3. Ensure database is accessible
4. Check for JavaScript errors

#### **2. Element Not Found**
```javascript
// Increase timeout for slow elements
await this.page.waitForSelector('button:has-text("Add")', { 
  timeout: 10000 // 10 seconds
});
```

#### **3. Form Validation Issues**
```javascript
// Handle form validation errors
try {
  await this.page.click('button:has-text("Save")');
} catch (error) {
  // Check for validation errors
  const errors = await this.page.locator('.error, .validation-error').all();
  if (errors.length > 0) {
    console.log('Form validation errors:', await Promise.all(errors.map(e => e.textContent())));
  }
  throw error;
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
  const report = require('./qa-crud-test-report.json');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>QA CRUD Test Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .passed { color: green; }
        .failed { color: red; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .module-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .module-card { background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <h1>QA CRUD Test Report</h1>
      <div class="summary">
        <h2>Summary</h2>
        <p>Total Tests: ${report.summary.total}</p>
        <p>Passed: <span class="passed">${report.summary.passed}</span></p>
        <p>Failed: <span class="failed">${report.summary.failed}</span></p>
        <p>Success Rate: ${report.summary.successRate}%</p>
        <p>Timestamp: ${report.summary.timestamp}</p>
      </div>
      
      <h2>Module Statistics</h2>
      <div class="module-stats">
        ${Object.entries(report.moduleStats).map(([module, stats]) => `
          <div class="module-card">
            <h3>${module.toUpperCase()}</h3>
            <p>Passed: ${stats.passed}</p>
            <p>Failed: ${stats.failed}</p>
            <p>Total: ${stats.total}</p>
            <p>Success Rate: ${((stats.passed/stats.total)*100).toFixed(2)}%</p>
          </div>
        `).join('')}
      </div>
      
      <h2>Detailed Results</h2>
      ${report.results.map(result => `
        <div class="${result.status.toLowerCase()}">
          <h3>${result.testCaseName}</h3>
          <p><strong>ID:</strong> ${result.testCaseId}</p>
          <p><strong>Module:</strong> ${result.module}</p>
          <p><strong>Entity:</strong> ${result.entity}</p>
          <p><strong>Operation:</strong> ${result.operation}</p>
          <p><strong>Status:</strong> ${result.status}</p>
          <p><strong>Duration:</strong> ${result.duration}ms</p>
          ${result.errors.length > 0 ? `<p><strong>Errors:</strong> ${result.errors.join(', ')}</p>` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  fs.writeFileSync('qa-crud-test-report.html', html);
}
```

### **2. Performance Analysis**
```javascript
// Analyze test performance
function analyzePerformance() {
  const report = require('./qa-crud-test-report.json');
  
  const durations = report.results.map(r => r.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);
  
  console.log('Performance Analysis:');
  console.log(`Average Duration: ${avgDuration.toFixed(2)}ms`);
  console.log(`Max Duration: ${maxDuration}ms`);
  console.log(`Min Duration: ${minDuration}ms`);
  
  // Identify slow tests
  const slowTests = report.results.filter(r => r.duration > 5000);
  if (slowTests.length > 0) {
    console.log('Slow Tests:');
    slowTests.forEach(test => {
      console.log(`- ${test.testCaseName}: ${test.duration}ms`);
    });
  }
}
```

---

## 🚀 **CI/CD INTEGRATION**

### **1. GitHub Actions**
```yaml
# .github/workflows/qa-crud-tests.yml
name: QA CRUD Tests

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
    
    - name: Run QA CRUD tests
      run: node qa-test-automation/qa-test-automation.js
    
    - name: Upload screenshots
      uses: actions/upload-artifact@v2
      with:
        name: qa-test-screenshots
        path: qa-test-automation/screenshots/
    
    - name: Upload report
      uses: actions/upload-artifact@v2
      with:
        name: qa-crud-test-report
        path: qa-test-automation/qa-crud-test-report.json
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
        
        stage('Run QA Tests') {
            steps {
                sh 'node qa-test-automation/qa-test-automation.js'
            }
        }
        
        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'qa-test-automation/screenshots/**/*'
                archiveArtifacts artifacts: 'qa-test-automation/qa-crud-test-report.json'
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
- [ ] Login credentials are valid
- [ ] Test data is prepared

### **Test Execution Checklist**
- [ ] Individual CRUD tests working
- [ ] All modules accessible
- [ ] Screenshots being captured
- [ ] Error handling working
- [ ] Reports being generated
- [ ] Performance is acceptable

### **Post-Test Checklist**
- [ ] All screenshots reviewed
- [ ] Test report analyzed
- [ ] Performance metrics recorded
- [ ] Failed tests documented
- [ ] Cleanup completed
- [ ] Results shared with team

---

## 🎯 **TEST PRIORITY EXECUTION**

### **Critical Tests (Must Pass)**
```bash
# Run only critical tests
node -e "
const { QACRUDTester, crudTestCases } = require('./qa-test-automation.js');

async function runCriticalTests() {
  const tester = new QACRUDTester();
  await tester.initialize();
  await tester.login();
  
  const criticalTests = crudTestCases.filter(test => test.priority === 'Critical');
  
  for (const testCase of criticalTests) {
    await tester.executeCRUDTest(testCase);
  }
  
  await tester.generateTestReport();
  await tester.cleanup();
}

runCriticalTests();
"
```

### **Module-Specific Critical Tests**
```bash
# Run critical tests for specific module
node -e "
const { QACRUDTester, crudTestCases } = require('./qa-test-automation.js');

async function runModuleCriticalTests(module) {
  const tester = new QACRUDTester();
  await tester.initialize();
  await tester.login();
  
  const moduleCriticalTests = crudTestCases.filter(test => 
    test.module === module && test.priority === 'Critical'
  );
  
  for (const testCase of moduleCriticalTests) {
    await tester.executeCRUDTest(testCase);
  }
  
  await tester.generateTestReport();
  await tester.cleanup();
}

runModuleCriticalTests('crm');
"
```

---

**Execution Guide Status: ✅ READY FOR USE**
**Total Test Cases: 768**
**Estimated Execution Time: 2-3 hours**
**Screenshot Capture: Enabled**
**Error Reporting: Comprehensive**
**CI/CD Integration: Ready** 