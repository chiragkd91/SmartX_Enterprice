# SmartBizFlow HR Portal

A comprehensive HR management system built with React, TypeScript, and Node.js.

## 🚀 Features

### Core HR Modules
- ✅ Employee Management
- ✅ Attendance Management
- ✅ Leave Management
- ✅ Payroll Management
- ✅ Performance Management
- ✅ Training Management
- ✅ Employee Self-Service
- ✅ Benefits Administration
- ✅ Workflow Automation

### Technical Features
- ✅ Modern React 18 with TypeScript
- ✅ Express.js Backend with Prisma ORM
- ✅ PostgreSQL Database
- ✅ JWT Authentication
- ✅ Role-based Access Control
- ✅ Real-time Dashboard
- ✅ File Upload System
- ✅ Audit Logging

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SmartBizFlow_update
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Install PostgreSQL
- Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
- Create a new database named `smartbizflow_hr`

#### Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/smartbizflow_hr"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Server Configuration
PORT=3001
NODE_ENV="development"

# Email Configuration (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload Configuration
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=10485760 # 10MB

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# CORS Configuration
CORS_ORIGIN="http://localhost:5173"

# Logging Configuration
LOG_LEVEL="info"
LOG_FILE="./logs/app.log"

# Redis Configuration (for sessions and caching)
REDIS_URL="redis://localhost:6379"

# API Configuration
API_VERSION="v1"
API_PREFIX="/api"
```

### 4. Database Migration and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 5. Start Development Servers

#### Start Backend Server
```bash
npm run server:dev
```

#### Start Frontend Development Server
```bash
npm run dev
```

## 🔐 Default Login Credentials

After running the seed script, you can login with:

- **Admin**: `admin@smartbizflow.com` / `admin123`
- **HR Manager**: `hr@smartbizflow.com` / `hr123`
- **Employee**: `john.doe@smartbizflow.com` / `employee123`

## 📁 Project Structure

```
SmartBizFlow_update/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── types/             # TypeScript types
│   └── lib/               # Utility functions
├── server/                # Backend source code
│   ├── index.js           # Main server file
│   └── scripts/           # Database scripts
├── prisma/                # Database schema
│   └── schema.prisma      # Prisma schema
├── uploads/               # File uploads directory
└── dist/                  # Build output
```

## 🚀 Available Scripts

### Development
```bash
npm run dev              # Start frontend development server
npm run server:dev       # Start backend development server
npm run build            # Build frontend for production
npm run preview          # Preview production build
```

### Database
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data
```

### Linting
```bash
npm run lint             # Run ESLint
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Employees
- `GET /api/employees` - Get employees list
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out

### Leave Management
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id/approve` - Approve/reject leave

### Training
- `GET /api/training/courses` - Get training courses
- `POST /api/training/enroll` - Enroll in course

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### File Upload
- `POST /api/upload` - Upload files

## 🛡️ Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Audit logging

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User authentication and roles
- **employees** - Employee information
- **attendance** - Attendance records
- **leaves** - Leave requests
- **payroll** - Payroll records
- **training_courses** - Training courses
- **employee_training** - Training enrollments
- **benefits** - Employee benefits
- **audit_logs** - System audit trail

## 🔄 Development Workflow

1. **Database Changes**: Update `prisma/schema.prisma`
2. **Backend Changes**: Modify `server/index.js`
3. **Frontend Changes**: Update React components in `src/`
4. **API Integration**: Use `src/services/apiService.ts`

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Update the `.env` file with production values:
- Use strong JWT secrets
- Configure production database URL
- Set up email service credentials
- Configure file storage (AWS S3, etc.)

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Version History

### Phase 1: Backend Foundation (Weeks 1-6)
- ✅ Database Setup (Week 1-2)
- ✅ API Development (Week 3-4)
- ✅ Authentication System (Week 5-6)

### Phase 2: Advanced Features (Weeks 7-10)
- ⏳ Advanced Analytics (Week 7-8)
- ⏳ Security Enhancements (Week 9-10)

### Phase 3: Integration & Mobile (Weeks 11-16)
- ⏳ Third-party Integrations (Week 11-13)
- ⏳ Mobile PWA Development (Week 14-16)

### Phase 4: Communication (Weeks 17-20)
- ⏳ Real-time Communication (Week 17-20) 