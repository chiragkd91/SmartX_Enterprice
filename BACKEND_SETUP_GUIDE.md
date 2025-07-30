# 🚀 SmartBizFlow Backend Setup Guide

## 📋 Quick Start

### **Option 1: Development Mode (Recommended)**
```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env

# Start backend development server
npm run server:dev
```

### **Option 2: Production Mode**
```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env

# Start backend server
npm run server
```

---

## 🛠️ Detailed Setup Instructions

### **1. Prerequisites**
- **Node.js**: Version 18+ installed
- **npm**: Package manager
- **Database**: One of the following:
  - PostgreSQL 12+ (Recommended)
  - Microsoft SQL Server 2017+
  - SQLite (Development only)

### **2. Install Dependencies**
```bash
# Navigate to project directory
cd SmartBizFlow_update

# Install all dependencies
npm install
```

### **3. Environment Configuration**

#### **Create Environment File**
```bash
# Copy the example environment file
cp env.example .env
```

#### **Basic Configuration (.env)**
```env
# =============================================================================
# BASIC CONFIGURATION
# =============================================================================
NODE_ENV=development
PORT=3001
APP_NAME=SmartBizFlow

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
ENCRYPTION_KEY=your-encryption-key-change-this-in-production

# =============================================================================
# DATABASE CONFIGURATION (Choose one)
# =============================================================================

# Option 1: PostgreSQL (Recommended)
DATABASE_URL="postgresql://username:password@localhost:5432/smartbizflow"
DATABASE_TYPE=postgresql

# Option 2: Microsoft SQL Server
# DATABASE_URL="sqlserver://server:port;database=SmartBizFlow;user=sa;password=Password@123;trustServerCertificate=true;encrypt=false"
# DATABASE_TYPE=mssql

# Option 3: SQLite (Development only)
# DATABASE_URL="file:./database/smartbizflow.db"
# DATABASE_TYPE=sqlite

# =============================================================================
# CORS CONFIGURATION
# =============================================================================
FRONTEND_URL=http://localhost:5173
```

### **4. Database Setup**

#### **Option A: PostgreSQL Setup**
```bash
# Install PostgreSQL
# Windows: Download from https://www.postgresql.org/download/
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb smartbizflow

# Update .env with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/smartbizflow"
```

#### **Option B: Microsoft SQL Server Setup**
```bash
# Update .env with your SQL Server credentials
DATABASE_URL="sqlserver://server:port;database=SmartBizFlow;user=sa;password=Password@123;trustServerCertificate=true;encrypt=false"
```

#### **Option C: SQLite Setup (Development)**
```bash
# SQLite requires no additional setup
# Database file will be created automatically
DATABASE_URL="file:./database/smartbizflow.db"
```

### **5. Initialize Database**

#### **Run Database Scripts**
```bash
# Generate Prisma client (if using Prisma)
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed
```

---

## 🎯 Starting the Backend Server

### **Development Mode (with Auto-restart)**
```bash
npm run server:dev
```
- ✅ Automatic server restart on file changes
- ✅ Development logging enabled
- ✅ Hot reload support

### **Production Mode**
```bash
npm run server
```
- ✅ Optimized for production
- ✅ Better performance
- ✅ Production logging

### **Expected Output**
```
🔄 Database service initialized successfully
✅ SmartBizFlow Backend Server starting...
🚀 HR Portal Server running on port 3001
📊 Database connected successfully
🔐 Authentication system ready
📁 File upload system initialized
🌐 WebSocket server ready
⚡ All services initialized successfully!
```

---

## 🔐 Default Login Credentials

After seeding the database, you can login with:

```
🔹 Super Admin:
   Email: admin@smartbizflow.com
   Password: admin123

🔹 HR Manager:
   Email: hr@smartbizflow.com
   Password: hr123

🔹 Employee:
   Email: employee@smartbizflow.com
   Password: employee123
```

---

## 📡 API Endpoints Overview

### **Authentication Endpoints**
```
POST /api/auth/login           - User login
POST /api/auth/logout          - User logout
POST /api/auth/refresh         - Refresh token
GET  /api/auth/verify          - Verify token
POST /api/auth/change-password - Change password
```

### **Core Module Endpoints**
```
# User Management
GET    /api/users              - Get all users
POST   /api/users              - Create user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user

# Employee Management
GET    /api/employees          - Get employees
POST   /api/employees          - Create employee
GET    /api/employees/:id      - Get employee

# CRM
GET    /api/crm/customers      - Get customers
POST   /api/crm/customers      - Create customer
PUT    /api/crm/customers/:id  - Update customer

# IT Assets
GET    /api/it-assets/assets   - Get assets
POST   /api/it-assets/assets   - Create asset
PUT    /api/it-assets/assets/:id - Update asset

# File Upload
POST   /api/upload/avatar      - Upload avatar
POST   /api/upload/document    - Upload document
GET    /api/files/:fileId      - Serve file
```

### **Business Intelligence**
```
GET /api/analytics/dashboard   - Dashboard analytics
GET /api/analytics/crm         - CRM analytics
GET /api/analytics/financial   - Financial analytics
GET /api/analytics/hr          - HR analytics
```

---

## 🔧 Configuration Options

### **Server Configuration**
```env
# Server Settings
PORT=3001                      # Server port
NODE_ENV=development           # Environment mode

# Database Settings
DATABASE_URL=your-database-url # Database connection
DATABASE_TYPE=postgresql       # Database type

# Security Settings
JWT_SECRET=your-jwt-secret     # JWT signing key
ENCRYPTION_KEY=your-enc-key    # Data encryption key

# CORS Settings
FRONTEND_URL=http://localhost:5173  # Frontend URL
```

### **Feature Flags**
```env
# Module Enablement
VITE_ENABLE_CRM=true          # Enable CRM module
VITE_ENABLE_ERP=true          # Enable ERP module
VITE_ENABLE_HR=true           # Enable HR module
VITE_ENABLE_IT_ASSETS=true    # Enable IT Assets
VITE_ENABLE_GST=true          # Enable GST compliance
```

---

## 🛠️ Available Scripts

### **Server Scripts**
```bash
npm run server              # Start production server
npm run server:dev          # Start development server (nodemon)
```

### **Database Scripts**
```bash
npm run db:generate         # Generate Prisma client
npm run db:push             # Push schema to database
npm run db:migrate          # Run database migrations
npm run db:studio           # Open Prisma Studio
npm run db:seed             # Seed database with sample data
```

### **Migration Scripts**
```bash
npm run migrate             # Run migrations
npm run migrate:status      # Check migration status
npm run migrate:rollback    # Rollback migrations
```

### **Backup Scripts**
```bash
npm run db:backup           # Create database backup
npm run db:restore          # Restore database backup
```

---

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. Port Already in Use**
```bash
# Error: EADDRINUSE: address already in use :::3001

# Solution: Change port in .env
PORT=3002

# Or kill process using port
lsof -ti:3001 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3001   # Windows
```

#### **2. Database Connection Error**
```bash
# Error: database connection failed

# Check database status
pg_ctl status                  # PostgreSQL
systemctl status postgresql   # Linux PostgreSQL
services.msc                   # Windows SQL Server

# Verify connection string
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```

#### **3. JWT Secret Error**
```bash
# Error: JWT secret required

# Solution: Set proper JWT secret in .env
JWT_SECRET=your-very-long-secure-random-secret-key-here
```

#### **4. File Upload Error**
```bash
# Error: upload directory not found

# Solution: Create uploads directory
mkdir server/uploads
chmod 755 server/uploads
```

#### **5. Permission Errors**
```bash
# Error: RBAC permission denied

# Solution: Check user roles and permissions
# Default admin user has full access
# Use admin account for initial setup
```

---

## 📊 Server Health Check

### **Test Server Status**
```bash
# Test if server is running
curl http://localhost:3001/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-12-27T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

### **Test Authentication**
```bash
# Test login endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartbizflow.com","password":"admin123"}'

# Expected response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@smartbizflow.com",
    "role": "admin"
  }
}
```

---

## 🔒 Security Features

### **Built-in Security**
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access Control** - Granular permissions
- ✅ **Password Hashing** - bcrypt encryption
- ✅ **Rate Limiting** - Protection against brute force
- ✅ **CORS Protection** - Cross-origin security
- ✅ **Helmet Security** - HTTP security headers
- ✅ **Audit Logging** - Complete activity tracking

### **Environment Security**
```env
# Production Security Settings
NODE_ENV=production
JWT_SECRET=your-very-secure-random-256-bit-key
ENCRYPTION_KEY=your-aes-256-encryption-key
DATABASE_URL=encrypted-production-url
```

---

## 🚀 Production Deployment

### **1. Environment Setup**
```bash
# Set production environment
NODE_ENV=production

# Use strong secrets
JWT_SECRET=generate-secure-256-bit-key
ENCRYPTION_KEY=generate-secure-encryption-key

# Production database
DATABASE_URL=production-database-connection-string
```

### **2. Process Management**
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server/index.js --name smartbizflow-backend
pm2 startup
pm2 save

# Using systemd (Linux)
sudo systemctl enable smartbizflow-backend
sudo systemctl start smartbizflow-backend
```

### **3. Load Balancing**
```bash
# Nginx configuration
upstream smartbizflow_backend {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    location /api {
        proxy_pass http://smartbizflow_backend;
    }
}
```

---

## 📞 Support & Resources

### **Documentation**
- 📋 [API Documentation](./API_ROUTES_GUIDE.md)
- 🔧 [Configuration Guide](./SETUP_GUIDE.md)
- 🏗️ [Architecture Overview](./IMPLEMENTATION_COMPLETION_SUMMARY.md)

### **Getting Help**
- 🐛 Check logs in `logs/` directory
- 📊 Monitor server health endpoints
- 🔍 Use debug mode: `DEBUG=* npm run server:dev`
- 📧 Contact development team for support

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment file created (`.env`)
- [ ] Database configured and connected
- [ ] Server starts without errors
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] File uploads functional
- [ ] Database seeded with default users
- [ ] Frontend can connect to backend

---

**🎉 Congratulations! Your SmartBizFlow backend is now running successfully!**

Your backend server is ready to handle all SmartBizFlow operations including CRM, ERP, HRMS, IT Asset Management, and more.

**Server URL**: `http://localhost:3001`
**API Base**: `http://localhost:3001/api`
**Health Check**: `http://localhost:3001/api/health`