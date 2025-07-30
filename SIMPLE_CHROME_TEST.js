// SIMPLE CHROME RPA TEST - ES Modules
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function testSmartBizFlow() {
  console.log('🚀 STARTING CHROME RPA TEST FOR SMARTBIZFLOW');
  console.log('=============================================');
  
  let browser;
  let results = {
    success: [],
    errors: [],
    screenshots: []
  };
  
  try {
    console.log('🌐 Launching Chrome...');
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    // Create screenshots directory
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots');
    }
    
    // Enable console logging
    page.on('console', msg => {
      console.log(`📊 Browser: ${msg.text()}`);
    });
    
    page.on('pageerror', err => {
      console.log(`🚨 Page Error: ${err.message}`);
      results.errors.push(err.message);
    });
    
    console.log('\n🔍 TEST 1: Server Access');
    console.log('========================');
    
    // Test server access
    const serverUrl = 'http://localhost:5175';
    console.log(`Accessing: ${serverUrl}`);
    
    await page.goto(serverUrl, { waitUntil: 'networkidle2', timeout: 15000 });
    
    // Take screenshot
    await page.screenshot({ path: './screenshots/01-homepage.png', fullPage: true });
    results.screenshots.push('01-homepage.png');
    console.log('✅ Server accessible, screenshot saved');
    results.success.push('Server access successful');
    
    console.log('\n🔍 TEST 2: Navigation to HRMS Login');
    console.log('===================================');
    
    // Navigate to login page
    const loginUrl = `${serverUrl}/#/hrms/login`;
    console.log(`Navigating to: ${loginUrl}`);
    
    await page.goto(loginUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: './screenshots/02-login-page.png', fullPage: true });
    results.screenshots.push('02-login-page.png');
    console.log('✅ Login page loaded, screenshot saved');
    results.success.push('Login page navigation successful');
    
    console.log('\n🔍 TEST 3: Login Form Check');
    console.log('============================');
    
    // Check for form elements
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log(`Email input found: ${!!emailInput}`);
    console.log(`Password input found: ${!!passwordInput}`);
    console.log(`Submit button found: ${!!submitButton}`);
    
    if (emailInput && passwordInput && submitButton) {
      results.success.push('Login form elements found');
      
      console.log('\n🔍 TEST 4: Quick Login Test');
      console.log('============================');
      
      // Look for quick login buttons
      const buttons = await page.$$('button');
      let quickLoginFound = false;
      
      for (let button of buttons) {
        const text = await page.evaluate(el => el.textContent?.toLowerCase() || '', button);
        if (text.includes('hr manager') || text.includes('admin') || text.includes('quick')) {
          console.log(`Found quick login button: "${text}"`);
          console.log('🖱️  Clicking quick login...');
          
          try {
            await button.click();
            await page.waitForTimeout(3000);
            
            // Take screenshot after click
            await page.screenshot({ path: './screenshots/03-after-quick-login.png', fullPage: true });
            results.screenshots.push('03-after-quick-login.png');
            
            quickLoginFound = true;
            break;
          } catch (clickError) {
            console.log(`❌ Click failed: ${clickError.message}`);
            results.errors.push(`Quick login click failed: ${clickError.message}`);
          }
        }
      }
      
      if (!quickLoginFound) {
        console.log('❌ No quick login button found, trying manual login...');
        
        // Manual login
        await page.type('input[type="email"]', 'hr@smartbizflow.com');
        await page.type('input[type="password"]', 'password123');
        
        console.log('📝 Credentials entered, clicking submit...');
        await submitButton.click();
        await page.waitForTimeout(3000);
        
        // Take screenshot after manual login
        await page.screenshot({ path: './screenshots/04-after-manual-login.png', fullPage: true });
        results.screenshots.push('04-after-manual-login.png');
      }
      
      // Check current URL after login
      const currentUrl = page.url();
      console.log(`Current URL after login: ${currentUrl}`);
      
      if (currentUrl.includes('/login')) {
        console.log('❌ Still on login page');
        results.errors.push('Login failed - still on login page');
      } else {
        console.log('✅ Redirected away from login page');
        results.success.push('Login redirect successful');
      }
      
    } else {
      console.log('❌ Login form incomplete');
      results.errors.push('Login form elements missing');
    }
    
    console.log('\n🔍 TEST 5: Dashboard Access');
    console.log('============================');
    
    // Try to access dashboard directly
    const dashboardUrl = `${serverUrl}/#/dashboard`;
    console.log(`Navigating to: ${dashboardUrl}`);
    
    await page.goto(dashboardUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: './screenshots/05-dashboard.png', fullPage: true });
    results.screenshots.push('05-dashboard.png');
    console.log('✅ Dashboard page accessed, screenshot saved');
    
    // Check for main app elements
    const sidebar = await page.$('nav, .sidebar, [data-testid="sidebar"]');
    const header = await page.$('header, .header, [data-testid="header"]');
    const mainContent = await page.$('main, .main, [data-testid="main"]');
    
    console.log(`Sidebar found: ${!!sidebar}`);
    console.log(`Header found: ${!!header}`);
    console.log(`Main content found: ${!!mainContent}`);
    
    if (sidebar || header || mainContent) {
      results.success.push('Main app layout detected');
    } else {
      results.errors.push('Main app layout not found');
    }
    
    console.log('\n🔍 TEST 6: Authentication State');
    console.log('=================================');
    
    // Check authentication state
    const authState = await page.evaluate(() => {
      if (typeof window !== 'undefined' && window.useStore) {
        const state = window.useStore.getState();
        return {
          isAuthenticated: state.isAuthenticated,
          currentUser: state.currentUser ? state.currentUser.email : null,
          loading: state.loading,
          error: state.error
        };
      }
      return { error: 'Store not available' };
    });
    
    console.log('📊 Authentication State:', JSON.stringify(authState, null, 2));
    
    if (authState.isAuthenticated) {
      results.success.push('User is authenticated');
    } else {
      results.errors.push('User not authenticated');
    }
    
  } catch (error) {
    console.log(`🚨 Test failed: ${error.message}`);
    results.errors.push(`Test execution failed: ${error.message}`);
  }
  
  // Generate Results Summary
  console.log('\n📋 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`✅ Successful Tests: ${results.success.length}`);
  results.success.forEach((success, index) => {
    console.log(`  ${index + 1}. ${success}`);
  });
  
  console.log(`\n❌ Errors Found: ${results.errors.length}`);
  results.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
  
  console.log(`\n📷 Screenshots: ${results.screenshots.length} saved`);
  results.screenshots.forEach((screenshot, index) => {
    console.log(`  ${index + 1}. ./screenshots/${screenshot}`);
  });
  
  // Save detailed report
  fs.writeFileSync('./RPA_TEST_RESULTS.json', JSON.stringify(results, null, 2));
  console.log('\n📊 Detailed results saved to: ./RPA_TEST_RESULTS.json');
  
  console.log('\n🔍 Browser will stay open for 30 seconds for manual inspection...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  if (browser) {
    await browser.close();
  }
  
  console.log('\n🎯 RPA Test Complete!');
  return results;
}

// Run the test
testSmartBizFlow()
  .then(results => {
    console.log('\n✅ Test completed successfully');
    if (results.errors.length > 0) {
      console.log('⚠️  Issues found - check screenshots and results');
      process.exit(1);
    } else {
      console.log('🎉 All tests passed!');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('\n🚨 Test failed:', error);
    process.exit(1);
  });