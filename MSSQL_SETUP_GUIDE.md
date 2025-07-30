# Microsoft SQL Server Migration Guide
## SmartX Solution Database Migration

### Overview
This guide provides step-by-step instructions for migrating the SmartX Solution application from SQLite to Microsoft SQL Server.

### Target Configuration
- **Server**: 103.206.57.30
- **Port**: 1201
- **Database**: SmartXSolution
- **User**: sa
- **Password**: Password@123

### Prerequisites

1. **Node.js and npm** installed
2. **SQL Server client tools** (optional, for manual verification)
3. **Network access** to the SQL Server instance

### Step 1: Environment Setup

1. **Copy environment variables**:
   ```bash
   cp env.example .env
   ```

2. **Update the DATABASE_URL** in your `.env` file:
   ```
   DATABASE_URL="sqlserver://103.206.57.30:1201;database=SmartXSolution;user=sa;password=Password@123;trustServerCertificate=true;encrypt=false"
   ```

### Step 2: Install Dependencies

1. **Install SQL Server dependencies**:
   ```bash
   npm install mssql @types/mssql
   ```

2. **Install Prisma SQL Server provider**:
   ```bash
   npm install prisma @prisma/client
   ```

### Step 3: Database Migration

#### Option A: Automated Migration (Recommended)

1. **Run the automated migration script**:
   ```bash
   npm run mssql:migrate
   ```

   This script will:
   - Connect to SQL Server
   - Create the SmartXSolution database
   - Create all necessary tables
   - Migrate existing data from SQLite
   - Create indexes for performance
   - Verify the migration

#### Option B: Manual SQL Script

1. **Connect to SQL Server** using SQL Server Management Studio or Azure Data Studio
2. **Execute the SQL script**:
   ```bash
   # Using sqlcmd (if available)
   sqlcmd -S 103.206.57.30,1201 -U sa -P Password@123 -i scripts/mssql-migration.sql
   ```

### Step 4: Prisma Setup

1. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

2. **Push schema to database** (if needed):
   ```bash
   npm run db:push
   ```

### Step 5: Seed Data

1. **Seed the database with sample data**:
   ```bash
   npm run mssql:seed
   ```

### Step 6: Verification

1. **Test the connection**:
   ```bash
   npm run db:studio
   ```

2. **Check table counts**:
   ```sql
   SELECT 'users' as Table_Name, COUNT(*) as Record_Count FROM users
   UNION ALL
   SELECT 'employees' as Table_Name, COUNT(*) as Record_Count FROM employees
   UNION ALL
   SELECT 'training_courses' as Table_Name, COUNT(*) as Record_Count FROM training_courses
   UNION ALL
   SELECT 'benefits' as Table_Name, COUNT(*) as Record_Count FROM benefits;
   ```

### Database Schema

#### Core Tables

1. **users** - User authentication and authorization
2. **employees** - Employee information and management
3. **attendance** - Attendance tracking
4. **leaves** - Leave management
5. **payroll** - Payroll processing
6. **performance** - Performance reviews
7. **training_courses** - Training course catalog
8. **employee_training** - Employee training enrollments
9. **benefits** - Employee benefits
10. **onboarding** - Employee onboarding process
11. **offboarding** - Employee offboarding process
12. **audit_logs** - System audit trail

#### Key Features

- **Foreign Key Constraints** - Maintains data integrity
- **Indexes** - Optimized for performance
- **Audit Logging** - Tracks all changes
- **Role-Based Access Control** - Secure access management

### Configuration Files

#### Updated Files

1. **prisma/schema.prisma** - Updated for SQL Server
2. **src/config/mssql-database.ts** - SQL Server configuration
3. **scripts/mssql-migration.js** - Migration script
4. **scripts/mssql-migration.sql** - SQL migration script
5. **env.example** - Environment variables template

### Troubleshooting

#### Common Issues

1. **Connection Failed**
   - Verify server IP and port
   - Check firewall settings
   - Ensure SQL Server is running

2. **Authentication Failed**
   - Verify username and password
   - Check SQL Server authentication mode
   - Ensure user has necessary permissions

3. **Database Not Found**
   - Run the migration script to create database
   - Check database name in connection string

4. **Prisma Generation Failed**
   - Verify DATABASE_URL format
   - Check Prisma schema syntax
   - Ensure all dependencies are installed

#### Error Messages

```
Error: Connection failed
Solution: Check network connectivity and SQL Server status

Error: Login failed for user 'sa'
Solution: Verify username and password

Error: Database 'SmartXSolution' does not exist
Solution: Run the migration script to create the database
```

### Performance Optimization

#### Indexes Created

- **users**: email, role
- **employees**: email, department, manager
- **attendance**: employee + date
- **leaves**: employee, status
- **payroll**: employee + month + year
- **training**: employee, course
- **audit_logs**: user, created date

#### Connection Pooling

- **Max Connections**: 10
- **Min Connections**: 0
- **Idle Timeout**: 30 seconds
- **Request Timeout**: 60 seconds

### Security Considerations

1. **Encryption**: Disabled for development (enable for production)
2. **Trust Server Certificate**: Enabled for development
3. **Connection Pooling**: Configured for optimal performance
4. **Audit Logging**: All changes are tracked

### Backup and Recovery

#### Backup Strategy

1. **Full Backup**: Daily
2. **Transaction Log Backup**: Every 15 minutes
3. **Differential Backup**: Weekly

#### Recovery Procedures

1. **Point-in-time recovery** using transaction logs
2. **Full database restore** from backup
3. **Individual table restore** if needed

### Monitoring

#### Key Metrics

1. **Connection Count**: Monitor active connections
2. **Query Performance**: Track slow queries
3. **Disk Usage**: Monitor database size
4. **Memory Usage**: Track SQL Server memory consumption

#### Alerts

1. **High CPU Usage**: > 80%
2. **High Memory Usage**: > 90%
3. **Disk Space**: < 20% free
4. **Connection Count**: > 80% of max

### Migration Checklist

- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Database created
- [ ] Tables created
- [ ] Data migrated
- [ ] Indexes created
- [ ] Prisma client generated
- [ ] Sample data seeded
- [ ] Connection tested
- [ ] Application tested

### Support

For issues or questions:

1. **Check the troubleshooting section**
2. **Review error logs**
3. **Verify configuration**
4. **Test connectivity manually**

### Next Steps

After successful migration:

1. **Update application configuration** to use SQL Server
2. **Test all features** thoroughly
3. **Monitor performance** and optimize as needed
4. **Set up regular backups**
5. **Configure monitoring and alerts**

---

**Migration Status**: ✅ Ready for execution
**Target Database**: SmartXSolution
**Server**: 103.206.57.30:1201
**User**: sa
**Password**: Password@123 