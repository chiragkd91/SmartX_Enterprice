/**
 * SmartBizFlow Frontend Login Testing Suite
 * Tests all login pages and authentication flows
 */

import puppeteer from 'puppeteer';
import fs from 'fs';

async function testFrontendLogin() {
  console.log('🚀 Starting Frontend Login Test Suite...');
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    defaultViewport: null,
    args: ['--start-maximized', '--disable-web-security']
  });

  const page = await browser.newPage();
  
  // Test credentials
  const testUsers = [
    { 
      email: 'admin@smartbizflow.com', 
      password: 'password123', 
      role: 'ADMIN',
      name: 'System Admin'
    },
    { 
      email: 'hr@smartbizflow.com', 
      password: 'password123', 
      role: 'HR_MANAGER',
      name: 'HR Manager'
    },
    { 
      email: 'john.doe@smartbizflow.com', 
      password: 'password123', 
      role: 'EMPLOYEE',
      name: 'John Doe'
    }
  ];

  // Login pages to test
  const loginPages = [
    { url: 'http://localhost:5177/', name: 'Main Login' },
    { url: 'http://localhost:5177/#/login', name: 'Direct Login' },
    { url: 'http://localhost:5177/#/hrms/login', name: 'HRMS Login' },
    { url: 'http://localhost:5177/#/crm/login', name: 'CRM Login' },
    { url: 'http://localhost:5177/#/erp/login', name: 'ERP Login' },
    { url: 'http://localhost:5177/#/assets/login', name: 'IT Assets Login' },
    { url: 'http://localhost:5177/#/reports/login', name: 'Reports Login' },
    { url: 'http://localhost:5177/#/automation/login', name: 'Automation Login' }
  ];

  const testResults = [];

  try {
    // Test each login page
    for (const loginPage of loginPages) {
      console.log(`\n📋 Testing: ${loginPage.name}`);
      console.log(`URL: ${loginPage.url}`);
      
      try {
        // Navigate to login page
        await page.goto(loginPage.url, { waitUntil: 'networkidle2', timeout: 10000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Take screenshot of login page
        await page.screenshot({ 
          path: `screenshot_${loginPage.name.replace(/\s+/g, '_')}_page.png`,
          fullPage: true
        });

        // Check if login form exists
        const loginFormExists = await page.$('form') !== null;
        const emailInputExists = await page.$('input[type="email"], input[name="email"]') !== null;
        const passwordInputExists = await page.$('input[type="password"], input[name="password"]') !== null;
        const submitButtonExists = await page.$('button[type="submit"]') !== null;

        console.log(`  📝 Login form exists: ${loginFormExists ? '✅' : '❌'}`);
        console.log(`  📧 Email input exists: ${emailInputExists ? '✅' : '❌'}`);
        console.log(`  🔐 Password input exists: ${passwordInputExists ? '✅' : '❌'}`);
        console.log(`  🔘 Submit button exists: ${submitButtonExists ? '✅' : '❌'}`);

        // Test login with admin credentials
        if (loginFormExists && emailInputExists && passwordInputExists) {
          const testUser = testUsers[0]; // Use admin for testing

          try {
            // Clear and fill email field
            const emailInput = await page.$('input[type="email"], input[name="email"]');
            if (emailInput) {
              await emailInput.click({ clickCount: 3 });
              await emailInput.type(testUser.email);
            }

            // Clear and fill password field  
            const passwordInput = await page.$('input[type="password"], input[name="password"]');
            if (passwordInput) {
              await passwordInput.click({ clickCount: 3 });
              await passwordInput.type(testUser.password);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Take screenshot before login
            await page.screenshot({ 
              path: `screenshot_${loginPage.name.replace(/\s+/g, '_')}_filled.png`,
              fullPage: true
            });

            // Try to find and click submit button
            const submitButton = await page.$('button[type="submit"]') || 
                                await page.$('input[type="submit"]') ||
                                await page.$('button:contains("Sign In")') ||
                                await page.$('button');

            if (submitButton) {
              console.log('  🔄 Attempting login...');
              await submitButton.click();
              await new Promise(resolve => setTimeout(resolve, 3000));

              // Check if login was successful (look for redirect or dashboard)
              const currentUrl = page.url();
              const hasAuthToken = await page.evaluate(() => {
                return localStorage.getItem('authToken') !== null || 
                       sessionStorage.getItem('authToken') !== null ||
                       document.cookie.includes('token');
              });

              // Take screenshot after login attempt
              await page.screenshot({ 
                path: `screenshot_${loginPage.name.replace(/\s+/g, '_')}_after_login.png`,
                fullPage: true
              });

              const loginSuccessful = currentUrl !== loginPage.url || hasAuthToken;
              console.log(`  🎯 Login successful: ${loginSuccessful ? '✅' : '❌'}`);
              console.log(`  🔗 Current URL: ${currentUrl}`);
              console.log(`  🔑 Auth token found: ${hasAuthToken ? '✅' : '❌'}`);

              testResults.push({
                page: loginPage.name,
                url: loginPage.url,
                formExists: loginFormExists,
                emailInput: emailInputExists,
                passwordInput: passwordInputExists,
                submitButton: submitButtonExists,
                loginSuccessful,
                finalUrl: currentUrl,
                hasAuthToken
              });

            } else {
              console.log('  ❌ Submit button not found');
              testResults.push({
                page: loginPage.name,
                url: loginPage.url,
                formExists: loginFormExists,
                emailInput: emailInputExists,
                passwordInput: passwordInputExists,
                submitButton: false,
                loginSuccessful: false,
                error: 'Submit button not found'
              });
            }

          } catch (loginError) {
            console.log(`  ❌ Login test failed: ${loginError.message}`);
            testResults.push({
              page: loginPage.name,
              url: loginPage.url,
              formExists: loginFormExists,
              emailInput: emailInputExists,
              passwordInput: passwordInputExists,
              loginSuccessful: false,
              error: loginError.message
            });
          }

        } else {
          console.log('  ⚠️ Cannot test login - missing form elements');
          testResults.push({
            page: loginPage.name,
            url: loginPage.url,
            formExists: loginFormExists,
            emailInput: emailInputExists,
            passwordInput: passwordInputExists,
            loginSuccessful: false,
            error: 'Missing form elements'
          });
        }

      } catch (pageError) {
        console.log(`  ❌ Page load failed: ${pageError.message}`);
        testResults.push({
          page: loginPage.name,
          url: loginPage.url,
          error: `Page load failed: ${pageError.message}`,
          loginSuccessful: false
        });
      }
    }

    // Generate test report
    console.log('\n\n📊 FRONTEND LOGIN TEST RESULTS');
    console.log('='.repeat(50));
    
    let successCount = 0;
    let totalTests = testResults.length;

    testResults.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.page}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Form Elements: ${result.formExists && result.emailInput && result.passwordInput ? '✅' : '❌'}`);
      console.log(`   Login Test: ${result.loginSuccessful ? '✅ PASS' : '❌ FAIL'}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      if (result.finalUrl && result.finalUrl !== result.url) {
        console.log(`   Redirected to: ${result.finalUrl}`);
      }
      if (result.hasAuthToken) {
        console.log(`   Auth Token: ✅ Found`);
      }
      
      if (result.loginSuccessful) successCount++;
    });

    console.log('\n📈 SUMMARY');
    console.log('='.repeat(20));
    console.log(`✅ Successful logins: ${successCount}/${totalTests}`);
    console.log(`❌ Failed logins: ${totalTests - successCount}/${totalTests}`);
    console.log(`📊 Success rate: ${((successCount / totalTests) * 100).toFixed(1)}%`);

    // Save detailed results to JSON
    fs.writeFileSync('frontend_login_test_results.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        successful: successCount,
        failed: totalTests - successCount,
        successRate: ((successCount / totalTests) * 100).toFixed(1) + '%'
      },
      results: testResults
    }, null, 2));

    console.log('\n📝 Detailed results saved to: frontend_login_test_results.json');
    console.log('📸 Screenshots saved for each login page');

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testFrontendLogin().catch(console.error);
