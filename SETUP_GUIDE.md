# SmartBizFlow Portal Setup & Customization Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- SQLite (for development) or PostgreSQL/MySQL (for production)

### 1. Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd SmartBizFlow_update

# Copy environment configuration
cp env.example .env

# Install dependencies
npm install

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

---

## 🎨 Customization Steps

### Step 1: Environment Variables Setup

Edit your `.env` file with your specific configuration:

```env
# Branding & Theme
VITE_APP_NAME=Your Company Name
VITE_APP_LOGO=/your-logo.png
VITE_PRIMARY_COLOR=#2563EB
VITE_SECONDARY_COLOR=#059669

# Module Enablement
VITE_ENABLE_CRM=true
VITE_ENABLE_ERP=true
VITE_ENABLE_HR=true
VITE_ENABLE_IT_ASSETS=true
VITE_ENABLE_GST=true

# Database
DATABASE_URL=file:./smartbizflow.db
DATABASE_TYPE=sqlite

# Security
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-encryption-key

# Integrations
RAZORPAY_API_KEY=your-razorpay-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Step 2: Theme Customization

#### A. Update Brand Colors
Edit `src/config/theme.ts`:

```typescript
export const defaultThemeConfig: ThemeConfig = {
  primary: {
    light: '#2563EB',    // Your brand blue
    dark: '#1D4ED8',
    contrast: '#FFFFFF'
  },
  secondary: {
    light: '#059669',    // Your brand green
    dark: '#047857',
    contrast: '#FFFFFF'
  },
  // ... other colors
};
```

#### B. Add Custom CSS
Edit `src/shadcn.css`:

```css
:root {
  /* Your custom brand colors */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-500: #2563EB;
  --color-primary-600: #1D4ED8;
  --color-primary-900: #1E3A8A;
}

/* Custom component styles */
.custom-brand-button {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  border-radius: 8px;
  font-weight: 600;
}
```

### Step 3: Module Configuration

#### A. Enable/Disable Modules
Edit `src/config/modules.ts`:

```typescript
export const crmConfig: ModuleConfig = {
  enabled: true,
  features: {
    leadManagement: { enabled: true },
    customerProfiles: { enabled: true },
    salesPipeline: { enabled: true },
    advancedAnalytics: { enabled: false }, // Disable if not needed
    emailIntegration: { enabled: true },
    mobileApp: { enabled: false }
  },
  // ... rest of config
};
```

#### B. Add Custom Fields
```typescript
customFields: {
  customer: [
    'gstNumber', 
    'panNumber', 
    'aadhaarNumber',
    'annualRevenue',     // Custom field
    'customerSegment',   // Custom field
    'preferredContact'   // Custom field
  ],
  lead: [
    'source',
    'priority',
    'assignedTo',
    'marketingCampaign', // Custom field
    'leadSource',        // Custom field
    'followUpDate'       // Custom field
  ]
}
```

### Step 4: Role-Based Access Control

#### A. Create Custom Roles
Edit `src/config/rbac.ts`:

```typescript
export const roles: Record<string, Role> = {
  // ... existing roles
  
  salesManager: {
    name: 'salesManager',
    displayName: 'Sales Manager',
    description: 'Sales team manager with CRM and reporting access',
    permissions: [
      permissions['dashboard.read'],
      permissions['dashboard.customize'],
      permissions['crm.read'],
      permissions['crm.write'],
      permissions['crm.create'],
      permissions['crm.delete'],
      permissions['crm.admin'],
      permissions['bi.read'],
      permissions['reports.read'],
      permissions['reports.write']
    ],
    modules: ['dashboard', 'crm', 'bi', 'reports'],
    isSystem: false,
    isActive: true,
    priority: 600
  }
};
```

#### B. Assign Roles to Users
Update your user data in the database or seed file:

```typescript
// Example user with custom role
{
  id: 1,
  name: 'John Doe',
  email: 'john@company.com',
  role: 'salesManager',
  permissions: ['crm.read', 'crm.write', 'reports.read']
}
```

### Step 5: Custom Workflows

#### A. Create Business Workflows
Edit `src/config/workflows.ts`:

```typescript
export const crmWorkflows: Record<string, Workflow> = {
  leadApproval: {
    id: 'leadApproval',
    name: 'Lead Approval Workflow',
    description: 'Automated lead approval process',
    module: 'crm',
    trigger: 'automatic',
    triggerConfig: {
      event: 'lead_created',
      conditions: {
        leadValue: { operator: 'greater_than', value: 10000 }
      }
    },
    steps: [
      {
        id: 'leadCreated',
        name: 'Lead Created',
        type: 'action',
        config: { action: 'create_lead' },
        nextSteps: ['managerApproval']
      },
      {
        id: 'managerApproval',
        name: 'Manager Approval',
        type: 'approval',
        config: { 
          approver: 'manager',
          timeout: 86400 // 24 hours
        },
        nextSteps: ['leadQualified', 'leadRejected']
      }
      // ... more steps
    ],
    isActive: true,
    version: '1.0.0',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
};
```

### Step 6: Database Customization

#### A. Add Custom Tables
Create a new migration file or update your schema:

```sql
-- Add custom tables for your business needs
CREATE TABLE custom_customer_fields (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  field_name TEXT NOT NULL,
  field_value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE custom_lead_fields (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  field_name TEXT NOT NULL,
  field_value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);
```

#### B. Update Data Models
Create `src/types/custom.ts`:

```typescript
export interface CustomCustomerField {
  id: number;
  customerId: number;
  fieldName: string;
  fieldValue: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomLeadField {
  id: number;
  leadId: number;
  fieldName: string;
  fieldValue: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extend existing interfaces
export interface Customer extends BaseCustomer {
  customFields?: CustomCustomerField[];
}

export interface Lead extends BaseLead {
  customFields?: CustomLeadField[];
}
```

---

## 🔧 Component Integration

### Step 7: Update App Layout

#### A. Integrate Theme Provider
Update `src/App.tsx`:

```typescript
import { ThemeProvider } from './components/Customization/ThemeProvider';
import { ModuleProvider } from './components/Customization/ModuleProvider';
import { CustomHeader } from './components/Layout/CustomHeader';
import { CustomSidebar } from './components/Layout/CustomSidebar';

export default function App() {
  const { isAuthenticated, currentUser, loading } = useStore();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <ThemeProvider>
      <ModuleProvider>
        <HashRouter>
          <div className="flex h-screen">
            <CustomSidebar />
            <div className="flex-1 flex flex-col">
              <CustomHeader />
              <main className="flex-1 overflow-auto">
                <Routes>
                  {/* Your routes */}
                </Routes>
              </main>
            </div>
          </div>
        </HashRouter>
      </ModuleProvider>
    </ThemeProvider>
  );
}
```

#### B. Use RBAC in Components
Example component with role-based access:

```typescript
import { useRBAC } from '../hooks/useRBAC';

export const CustomerList: React.FC = () => {
  const { canCreateRecords, canEditRecords, canDeleteRecords } = useRBAC();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Customers</h1>
        {canCreateRecords('crm') && (
          <Button onClick={handleCreateCustomer}>
            Add Customer
          </Button>
        )}
      </div>
      
      <Table>
        {customers.map(customer => (
          <TableRow key={customer.id}>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {canEditRecords('crm') && (
                  <Button size="sm" onClick={() => handleEdit(customer.id)}>
                    Edit
                  </Button>
                )}
                {canDeleteRecords('crm') && (
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(customer.id)}>
                    Delete
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};
```

---

## 🚀 Deployment

### Step 8: Production Deployment

#### A. Build for Production
```bash
# Build the application
npm run build

# Set up production environment
cp .env .env.production
# Edit .env.production with production values
```

#### B. Using Docker
```bash
# Build Docker image
docker build -t smartbizflow .

# Run container
docker run -p 80:80 -e NODE_ENV=production smartbizflow
```

#### C. Using Deployment Script
```bash
# Run full deployment
node scripts/deploy.mjs --production --docker

# Skip tests for faster deployment
node scripts/deploy.mjs --production --skip-tests --skip-lint
```

### Step 9: Environment-Specific Configuration

#### Development Environment
```env
NODE_ENV=development
VITE_DEV_SERVER_PORT=5173
DEBUG_ENABLED=true
DATABASE_URL=file:./smartbizflow-dev.db
```

#### Production Environment
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/smartbizflow
JWT_SECRET=your-production-jwt-secret
ENCRYPTION_KEY=your-production-encryption-key
SMTP_HOST=smtp.your-domain.com
SMTP_USER=your-email@your-domain.com
SMTP_PASS=your-email-password
```

---

## 🧪 Testing

### Step 10: Testing Your Customizations

#### A. Test Theme Changes
1. Start the development server: `npm run dev`
2. Navigate to different pages to see theme changes
3. Check if custom colors are applied correctly
4. Verify logo and branding elements

#### B. Test Module Access
1. Login with different user roles
2. Verify that users can only access permitted modules
3. Test custom fields in forms
4. Check workflow functionality

#### C. Test RBAC
1. Create test users with different roles
2. Verify permission-based UI elements
3. Test action restrictions (create, edit, delete)
4. Check module access restrictions

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
```bash
# Check if .env file exists
ls -la .env

# Verify environment variable format
# Should be: VITE_VARIABLE_NAME=value
```

#### 2. Module Not Showing
```bash
# Check module enablement
grep "VITE_ENABLE_CRM" .env

# Verify user permissions
# Check if user has access to the module
```

#### 3. Theme Not Applying
```bash
# Clear browser cache
# Check CSS variables in browser dev tools
# Verify theme configuration syntax
```

#### 4. Database Issues
```bash
# Reset database
npm run db:push --force-reset

# Regenerate Prisma client
npm run db:generate

# Check database connection
npm run db:studio
```

---

## 📚 Additional Resources

### Configuration Files
- `src/config/theme.ts` - Theme and branding configuration
- `src/config/modules.ts` - Module enablement and features
- `src/config/rbac.ts` - Role-based access control
- `src/config/workflows.ts` - Business process workflows

### Customization Components
- `src/components/Customization/ThemeProvider.tsx` - Theme context provider
- `src/components/Customization/ModuleProvider.tsx` - Module management
- `src/components/Layout/CustomHeader.tsx` - Custom header with branding
- `src/components/Layout/CustomSidebar.tsx` - Role-based navigation

### Hooks and Utilities
- `src/hooks/useRBAC.ts` - Role-based access control hook
- `src/lib/utils.ts` - Utility functions

### Deployment
- `scripts/deploy.mjs` - Automated deployment script
- `Dockerfile` - Docker configuration
- `nginx.conf` - Nginx configuration

---

## 🎯 Next Steps

1. **Customize further** based on your specific business requirements
2. **Add more workflows** for your business processes
3. **Integrate with external services** (payment gateways, email services, etc.)
4. **Set up monitoring and logging** for production
5. **Create user training materials** for your team
6. **Plan for scaling** as your business grows

Your SmartBizFlow portal is now customized and ready for use! 🎉 