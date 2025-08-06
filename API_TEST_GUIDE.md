# 🚀 SmartBizFlow API Testing Guide

## ✅ **API Status Check - Complete Guide**

Your SmartBizFlow application has **100+ API endpoints** across all modules. Here's how to test them all:

---

## 🔧 **Step 1: Start the Backend Server**

### Option A: Using Node.js
```bash
cd server
node index.js
```

### Option B: Using npm (if package.json exists in server/)
```bash
cd server
npm start
```

**Expected Output:**
```
✅ Database service initialized successfully
🚀 HR Portal Server running on port 3001
```

---

## 🧪 **Step 2: Test APIs**

### **Quick Test (Browser Console)**
1. Open your browser to `http://localhost:5174`
2. Open Developer Tools (F12) → Console
3. Copy and paste this script:

```javascript
// Quick API Test
async function testLoginAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@smartbizflow.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    console.log('🔐 Login API Result:', response.status, data);
    
    if (response.ok && data.token) {
      console.log('✅ Login API Working! Token received');
      localStorage.setItem('authToken', data.token);
      return data.token;
    } else {
      console.log('❌ Login API Failed');
      return null;
    }
  } catch (error) {
    console.log('🚨 API Server not accessible:', error);
    return null;
  }
}

// Test other APIs
async function testOtherAPIs(token) {
  const endpoints = [
    '/api/dashboard/stats',
    '/api/users',
    '/api/crm/customers',
    '/api/employees'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`${response.ok ? '✅' : '❌'} ${endpoint}: ${response.status}`);
    } catch (error) {
      console.log(`🚨 ${endpoint}: ${error.message}`);
    }
  }
}

// Run tests
testLoginAPI().then(token => {
  if (token) testOtherAPIs(token);
});
```

### **Comprehensive Test (Node.js)**
If you have Node.js installed:

```bash
# Install fetch for Node.js (if needed)
npm install node-fetch

# Run the comprehensive test suite
node api-test-suite.js
```

---

## 📊 **Available API Endpoints (100+)**

### **🔐 Authentication APIs**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout  
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/password/reset` - Password reset

### **👥 User Management APIs**
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### **👨‍💼 HR APIs**
- `GET /api/employees` - Get employees
- `POST /api/employees` - Create employee
- `GET /api/attendance` - Get attendance
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Create leave request
- `GET /api/training/courses` - Get training courses

### **🤝 CRM APIs**
- `GET /api/crm/customers` - Get customers
- `POST /api/crm/customers` - Create customer
- `PUT /api/crm/customers/:id` - Update customer
- `DELETE /api/crm/customers/:id` - Delete customer

### **🏭 ERP APIs**
- `GET /api/erp/financial/accounts` - Chart of accounts
- `GET /api/erp/financial/journal-entries` - Journal entries
- `GET /api/erp/financial/budgets` - Budgets
- `GET /api/erp/financial/cost-centers` - Cost centers

### **💻 IT Asset APIs**
- `GET /api/it-assets/assets` - Get IT assets
- `POST /api/it-assets/assets` - Create asset
- `GET /api/it-assets/support-tickets` - Support tickets
- `POST /api/it-assets/support-tickets` - Create ticket

### **📄 GST APIs**
- `GET /api/gst/returns` - GST returns
- `POST /api/gst/returns` - Create GST return
- `GET /api/gst/invoices` - GST invoices
- `POST /api/gst/invoices` - Create GST invoice

### **📈 Analytics APIs**
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/crm` - CRM analytics
- `GET /api/analytics/financial` - Financial analytics
- `GET /api/analytics/hr` - HR analytics

### **📁 File APIs**
- `POST /api/upload/avatar` - Upload avatar
- `POST /api/upload/document` - Upload document
- `POST /api/upload/bulk` - Bulk upload
- `GET /api/files/:fileId` - Download file

### **🔐 RBAC APIs**
- `GET /api/rbac/permissions` - Get permissions
- `GET /api/rbac/roles` - Get roles
- `POST /api/rbac/check-permission` - Check permission

---

## 🚨 **Troubleshooting Login Issues**

### **Issue 1: Server Not Running**
**Symptoms:** Console shows "Failed to fetch" or connection errors
**Solution:**
```bash
# Check if server is running
curl http://localhost:3001/api/auth/login
# or visit http://localhost:3001/api/dashboard/stats in browser
```

### **Issue 2: CORS Issues**
**Symptoms:** CORS policy error in browser console
**Solution:** Server should allow origins `localhost:5173`, `localhost:5174`

### **Issue 3: Database Not Connected**
**Symptoms:** Server logs show database connection errors
**Solution:** Check database configuration in `server/database.js`

### **Issue 4: Invalid Credentials**
**Symptoms:** 401 Unauthorized response
**Solution:** 
- Use: `admin@smartbizflow.com` / `admin123`
- Check user exists in database

### **Issue 5: Missing Dependencies**
**Symptoms:** Module not found errors
**Solution:**
```bash
cd server
npm install express cors helmet bcryptjs jsonwebtoken multer dotenv
```

---

## 🎯 **Expected Results**

### **✅ Working System Should Show:**
```
🔐 Login API: 200 OK - Token received
✅ Dashboard API: 200 OK
✅ Users API: 200 OK  
✅ CRM API: 200 OK
✅ HR API: 200 OK
✅ All endpoints accessible
```

### **❌ Common Issues:**
- **Login failing:** Check credentials and database
- **APIs returning 401:** Token not valid/expired
- **APIs returning 403:** Permission denied
- **Server not responding:** Check if running on port 3001

---

## 📞 **Support**

If APIs are not working:

1. **Check Server Status:**
   ```bash
   curl http://localhost:3001/api/auth/login
   ```

2. **Check Browser Console** for error messages

3. **Check Server Logs** in the terminal where you started the server

4. **Verify Credentials:**
   - Email: `admin@smartbizflow.com`
   - Password: `admin123`

Your API system is comprehensive with full CRUD operations, authentication, authorization, file uploads, analytics, and more! 🚀