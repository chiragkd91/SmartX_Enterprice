// COMPREHENSIVE CHROME RPA TEST FOR SMARTBIZFLOW
// This will test the full application flow and identify all issues

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runFullApplicationTest() {
  console.log('🚀 STARTING COMPREHENSIVE CHROME RPA TEST');
  console.log('==========================================');
  
  // Create screenshots directory
  const screenshotsDir = './test-screenshots';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  let browser;
  let testResults = {
    serverAccess: false,
    loginFormVisible: false,
    loginSuccess: false,
    mainAppVisible: false,
    navigationWorking: false,
    errors: [],
    screenshots: []
  };
  
  try {
    // Launch Chrome browser
    console.log('🌐 Launching Chrome browser...');
    browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      devtools: true,  // Open DevTools
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Enable console logging from the page
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`📊 Browser Console [${type}]:`, text);
      
      if (type === 'error') {
        testResults.errors.push(text);
      }
    });
    
    // Enable error logging
    page.on('pageerror', err => {
      console.log('🚨 Page Error:', err.message);
      testResults.errors.push(`Page Error: ${err.message}`);
    });
    
    // Test 1: Server Access
    console.log('\n🔍 TEST 1: Server Access');
    console.log('========================');
    
    const serverUrl = 'http://localhost:5175';
    console.log(`Navigating to: ${serverUrl}`);
    
    try {
      await page.goto(serverUrl, { waitUntil: 'networkidle2', timeout: 10000 });
      testResults.serverAccess = true;
      console.log('✅ Server is accessible');
      
      // Take screenshot
      const screenshot1 = path.join(screenshotsDir, '01-server-access.png');
      await page.screenshot({ path: screenshot1, fullPage: true });
      testResults.screenshots.push(screenshot1);
      
    } catch (error) {
      console.log('❌ Server not accessible:', error.message);
      testResults.errors.push(`Server access failed: ${error.message}`);
      return testResults;
    }
    
    // Test 2: Navigation to Login Page
    console.log('\n🔍 TEST 2: HRMS Login Page');
    console.log('===========================');
    
    const loginUrl = `${serverUrl}/#/hrms/login`;
    console.log(`Navigating to login: ${loginUrl}`);
    
    await page.goto(loginUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Take screenshot
    const screenshot2 = path.join(screenshotsDir, '02-login-page.png');
    await page.screenshot({ path: screenshot2, fullPage: true });
    testResults.screenshots.push(screenshot2);
    
    // Check if login form exists
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const loginButton = await page.$('button[type="submit"]');
    
    if (emailInput && passwordInput && loginButton) {
      testResults.loginFormVisible = true;
      console.log('✅ Login form is visible and complete');
    } else {
      console.log('❌ Login form is incomplete');
      console.log('Email input:', !!emailInput);
      console.log('Password input:', !!passwordInput);
      console.log('Login button:', !!loginButton);
    }
    
    // Test 3: Quick Login Button Test
    console.log('\n🔍 TEST 3: Quick Login Test');
    console.log('============================');
    
    try {
      // Look for HR Manager quick login button
      const quickLoginButtons = await page.$$('button');
      let hrManagerButton = null;
      
      for (let button of quickLoginButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text && text.includes('HR Manager')) {
          hrManagerButton = button;
          break;
        }
      }
      
      if (hrManagerButton) {
        console.log('✅ Found HR Manager quick login button');
        console.log('🖱️  Clicking HR Manager button...');
        
        // Click the quick login button
        await hrManagerButton.click();
        
        // Wait for login to process
        await page.waitForTimeout(3000);
        
        // Take screenshot after login attempt
        const screenshot3 = path.join(screenshotsDir, '03-after-login-click.png');
        await page.screenshot({ path: screenshot3, fullPage: true });
        testResults.screenshots.push(screenshot3);
        
        // Check current URL
        const currentUrl = page.url();
        console.log(`Current URL after login: ${currentUrl}`);
        
        if (!currentUrl.includes('/login')) {
          testResults.loginSuccess = true;
          console.log('✅ Successfully redirected away from login page');
        } else {
          console.log('❌ Still on login page after login attempt');
        }
        
      } else {
        console.log('❌ HR Manager quick login button not found');
        
        // Try manual login
        console.log('🔄 Trying manual login...');
        await page.type('input[type="email"]', 'hr@smartbizflow.com');
        await page.type('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        
        await page.waitForTimeout(3000);
        
        const screenshot3b = path.join(screenshotsDir, '03b-manual-login.png');
        await page.screenshot({ path: screenshot3b, fullPage: true });
        testResults.screenshots.push(screenshot3b);
      }
      
    } catch (error) {
      console.log('❌ Login test failed:', error.message);
      testResults.errors.push(`Login test failed: ${error.message}`);
    }
    
    // Test 4: Main Application Access
    console.log('\n🔍 TEST 4: Main Application');
    console.log('============================');
    
    try {
      // Try to navigate to dashboard
      const dashboardUrl = `${serverUrl}/#/dashboard`;
      console.log(`Navigating to dashboard: ${dashboardUrl}`);
      
      await page.goto(dashboardUrl, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(2000);
      
      // Take screenshot
      const screenshot4 = path.join(screenshotsDir, '04-dashboard.png');
      await page.screenshot({ path: screenshot4, fullPage: true });
      testResults.screenshots.push(screenshot4);
      
      // Check for main app elements
      const sidebar = await page.$('[data-testid="sidebar"], .sidebar, nav');
      const header = await page.$('[data-testid="header"], .header, header');
      const mainContent = await page.$('[data-testid="main"], .main, main');
      
      if (sidebar || header || mainContent) {
        testResults.mainAppVisible = true;
        console.log('✅ Main application layout is visible');
        console.log('Sidebar:', !!sidebar);
        console.log('Header:', !!header);
        console.log('Main content:', !!mainContent);
      } else {
        console.log('❌ Main application layout not found');
      }
      
    } catch (error) {
      console.log('❌ Dashboard access failed:', error.message);
      testResults.errors.push(`Dashboard access failed: ${error.message}`);
    }
    
    // Test 5: Navigation Test
    console.log('\n🔍 TEST 5: Navigation Test');
    console.log('===========================');
    
    const testUrls = [
      `${serverUrl}/#/hr`,
      `${serverUrl}/#/crm`,
      `${serverUrl}/#/erp`,
      `${serverUrl}/#/business-intelligence`
    ];
    
    for (let i = 0; i < testUrls.length; i++) {
      try {
        console.log(`Testing navigation to: ${testUrls[i]}`);
        await page.goto(testUrls[i], { waitUntil: 'networkidle2' });
        await page.waitForTimeout(1000);
        
        const screenshot = path.join(screenshotsDir, `05-nav-test-${i + 1}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        testResults.screenshots.push(screenshot);
        
        testResults.navigationWorking = true;
        console.log(`✅ Navigation to ${testUrls[i]} successful`);
        
      } catch (error) {
        console.log(`❌ Navigation to ${testUrls[i]} failed:`, error.message);
      }
    }
    
    // Test 6: Authentication State Check
    console.log('\n🔍 TEST 6: Authentication State');
    console.log('================================');
    
    const authState = await page.evaluate(() => {
      if (window.useStore) {
        const state = window.useStore.getState();
        return {
          isAuthenticated: state.isAuthenticated,
          currentUser: state.currentUser ? state.currentUser.email : null,
          currentModule: state.currentModule,
          loading: state.loading,
          error: state.error
        };
      }
      return 'Store not available';
    });
    
    console.log('📊 Authentication State:', authState);
    
  } catch (error) {
    console.log('🚨 Test execution error:', error.message);
    testResults.errors.push(`Test execution error: ${error.message}`);
  }
  
  // Generate Test Report
  console.log('\n📋 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`✅ Server Access: ${testResults.serverAccess}`);
  console.log(`✅ Login Form Visible: ${testResults.loginFormVisible}`);
  console.log(`✅ Login Success: ${testResults.loginSuccess}`);
  console.log(`✅ Main App Visible: ${testResults.mainAppVisible}`);
  console.log(`✅ Navigation Working: ${testResults.navigationWorking}`);
  console.log(`📷 Screenshots: ${testResults.screenshots.length} captured`);
  console.log(`❌ Errors: ${testResults.errors.length} found`);
  
  if (testResults.errors.length > 0) {
    console.log('\n🚨 ERRORS FOUND:');
    testResults.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  console.log('\n📷 Screenshots saved to:', screenshotsDir);
  testResults.screenshots.forEach(screenshot => {
    console.log(`  - ${screenshot}`);
  });
  
  // Save detailed report
  const reportPath = './RPA_TEST_REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📊 Detailed report saved to: ${reportPath}`);
  
  if (browser) {
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection');
    console.log('Press Ctrl+C to close when done');
    
    // Wait for manual close
    await new Promise(resolve => {
      process.on('SIGINT', () => {
        console.log('\n👋 Closing browser...');
        resolve();
      });
    });
    
    await browser.close();
  }
  
  return testResults;
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullApplicationTest()
    .then(results => {
      console.log('\n🎯 Test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('🚨 Test failed:', error);
      process.exit(1);
    });
}

export default runFullApplicationTest;