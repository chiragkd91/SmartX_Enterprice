# SmartBizFlow Portal Customization Implementation Guide

## 🚀 Quick Start Guide

### 1. Environment Setup

First, create a `.env` file in your project root with your customization preferences:

```env
# Theme & Branding
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
VITE_ENABLE_BUSINESS_INTELLIGENCE=true

# Database Configuration
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

### 2. Theme Customization

#### A. Basic Theme Changes

```typescript
// src/config/theme.ts - Update these values
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

#### B. Custom CSS Variables

Add custom CSS to `src/shadcn.css`:

```css
:root {
  /* Your custom brand colors */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-500: #2563EB;
  --color-primary-600: #1D4ED8;
  --color-primary-900: #1E3A8A;
  
  /* Custom fonts */
  --font-primary: 'Your Brand Font', system-ui, sans-serif;
  --font-secondary: 'Your Secondary Font', system-ui, sans-serif;
}

/* Custom component styles */
.custom-brand-button {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  border-radius: 8px;
  font-weight: 600;
}
```

### 3. Module Customization

#### A. Enable/Disable Modules

```typescript
// src/config/modules.ts - Modify module configurations
export const crmConfig: ModuleConfig = {
  enabled: true,
  features: {
    leadManagement: { enabled: true },
    customerProfiles: { enabled: true },
    salesPipeline: { enabled: true },
    indianCompliance: { enabled: true },
    advancedAnalytics: { enabled: false }, // Disable if not needed
    emailIntegration: { enabled: true },
    mobileApp: { enabled: false }
  },
  // ... rest of config
};
```

#### B. Add Custom Fields

```typescript
// Add custom fields to modules
export const crmConfig: ModuleConfig = {
  // ... existing config
  customFields: {
    customer: [
      'gstNumber', 
      'panNumber', 
      'aadhaarNumber',
      'companyType',
      'industry',
      'annualRevenue',     // Custom field
      'customerSegment',   // Custom field
      'preferredContact'   // Custom field
    ],
    lead: [
      'source',
      'priority',
      'assignedTo',
      'expectedValue',
      'leadScore',
      'marketingCampaign', // Custom field
      'leadSource',        // Custom field
      'followUpDate'       // Custom field
    ]
  }
};
```

### 4. Role-Based Access Control

#### A. Create Custom Roles

```typescript
// src/config/rbac.ts - Add custom roles
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
  },
  
  financeManager: {
    name: 'financeManager',
    displayName: 'Finance Manager',
    description: 'Finance team manager with ERP and GST access',
    permissions: [
      permissions['dashboard.read'],
      permissions['erp.read'],
      permissions['erp.write'],
      permissions['erp.create'],
      permissions['erp.delete'],
      permissions['gst.read'],
      permissions['gst.write'],
      permissions['gst.create'],
      permissions['gst.admin'],
      permissions['reports.read'],
      permissions['reports.write']
    ],
    modules: ['dashboard', 'erp', 'gst', 'reports'],
    isSystem: false,
    isActive: true,
    priority: 600
  }
};
```

#### B. Dynamic Role Assignment

```typescript
// src/hooks/useRBAC.ts
import { useStore } from '../store/useStore';
import { canPerformAction, canAccessModule } from '../config/rbac';

export const useRBAC = () => {
  const { currentUser } = useStore();
  
  const userRoles = currentUser?.roles || [];
  
  const canAccess = (moduleName: string) => {
    return canAccessModule(userRoles, moduleName);
  };
  
  const canPerform = (resource: string, action: string) => {
    return canPerformAction(userRoles, resource, action);
  };
  
  const hasRole = (roleName: string) => {
    return userRoles.includes(roleName);
  };
  
  return {
    canAccess,
    canPerform,
    hasRole,
    userRoles
  };
};
```

### 5. Component Customization

#### A. Custom Header Component

```typescript
// src/components/Layout/CustomHeader.tsx
import React from 'react';
import { getBrandingConfig } from '../../config/theme';

export const CustomHeader: React.FC = () => {
  const branding = getBrandingConfig();
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src={branding.logo.url} 
            alt={branding.logo.alt}
            width={branding.logo.width}
            height={branding.logo.height}
            className="h-8 w-auto"
          />
          <h1 className="text-xl font-semibold text-gray-900">
            {branding.appName}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Custom header content */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Welcome,</span>
            <span className="font-medium text-gray-900">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};
```

#### B. Custom Sidebar Component

```typescript
// src/components/Layout/CustomSidebar.tsx
import React from 'react';
import { useRBAC } from '../../hooks/useRBAC';
import { getEnabledModules } from '../../config/modules';

export const CustomSidebar: React.FC = () => {
  const { canAccess } = useRBAC();
  const enabledModules = getEnabledModules();
  
  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'BarChart3',
      module: 'dashboard'
    },
    {
      title: 'CRM',
      path: '/crm',
      icon: 'Users',
      module: 'crm',
      children: [
        { title: 'Overview', path: '/crm' },
        { title: 'Leads', path: '/crm/leads' },
        { title: 'Customers', path: '/crm/customers' }
      ]
    },
    // ... other menu items
  ].filter(item => canAccess(item.module));
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <nav className="mt-8">
        {menuItems.map((item) => (
          <div key={item.path}>
            {/* Custom sidebar item rendering */}
          </div>
        ))}
      </nav>
    </aside>
  );
};
```

### 6. Database Customization

#### A. Custom Database Schema

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

-- Add indexes for performance
CREATE INDEX idx_custom_customer_fields_customer_id ON custom_customer_fields(customer_id);
CREATE INDEX idx_custom_lead_fields_lead_id ON custom_lead_fields(lead_id);
```

#### B. Custom Data Models

```typescript
// src/types/custom.ts
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

### 7. API Customization

#### A. Custom API Endpoints

```typescript
// src/services/customApiService.ts
export class CustomApiService {
  // Custom customer fields API
  async getCustomerCustomFields(customerId: number): Promise<CustomCustomerField[]> {
    const response = await fetch(`/api/customers/${customerId}/custom-fields`);
    return response.json();
  }
  
  async updateCustomerCustomFields(
    customerId: number, 
    fields: Partial<CustomCustomerField>[]
  ): Promise<CustomCustomerField[]> {
    const response = await fetch(`/api/customers/${customerId}/custom-fields`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });
    return response.json();
  }
  
  // Custom lead fields API
  async getLeadCustomFields(leadId: number): Promise<CustomLeadField[]> {
    const response = await fetch(`/api/leads/${leadId}/custom-fields`);
    return response.json();
  }
  
  async updateLeadCustomFields(
    leadId: number, 
    fields: Partial<CustomLeadField>[]
  ): Promise<CustomLeadField[]> {
    const response = await fetch(`/api/leads/${leadId}/custom-fields`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });
    return response.json();
  }
}
```

### 8. Workflow Customization

#### A. Custom Workflow Definitions

```typescript
// src/config/workflows.ts
export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'action' | 'condition';
  config: Record<string, any>;
  nextSteps: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  module: string;
  steps: WorkflowStep[];
  isActive: boolean;
}

export const customWorkflows: Record<string, Workflow> = {
  leadApproval: {
    id: 'leadApproval',
    name: 'Lead Approval Workflow',
    description: 'Automated lead approval process',
    module: 'crm',
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
          timeout: '24h',
          autoApprove: false
        },
        nextSteps: ['leadQualified', 'leadRejected']
      },
      {
        id: 'leadQualified',
        name: 'Lead Qualified',
        type: 'action',
        config: { action: 'qualify_lead' },
        nextSteps: ['assignToSales']
      },
      {
        id: 'assignToSales',
        name: 'Assign to Sales',
        type: 'action',
        config: { action: 'assign_sales_rep' },
        nextSteps: []
      }
    ],
    isActive: true
  }
};
```

### 9. Reporting Customization

#### A. Custom Report Templates

```typescript
// src/config/reports.ts
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  module: string;
  query: string;
  parameters: ReportParameter[];
  visualization: ReportVisualization;
  schedule?: ReportSchedule;
}

export interface ReportParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: any;
}

export interface ReportVisualization {
  type: 'table' | 'chart' | 'kpi';
  config: Record<string, any>;
}

export const customReports: ReportTemplate[] = [
  {
    id: 'salesPerformance',
    name: 'Sales Performance Report',
    description: 'Monthly sales performance by team member',
    module: 'crm',
    query: `
      SELECT 
        u.name as sales_rep,
        COUNT(l.id) as total_leads,
        COUNT(CASE WHEN l.status = 'qualified' THEN 1 END) as qualified_leads,
        SUM(CASE WHEN l.status = 'converted' THEN l.value ELSE 0 END) as total_revenue
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      WHERE l.created_at >= :start_date AND l.created_at <= :end_date
      GROUP BY u.id, u.name
      ORDER BY total_revenue DESC
    `,
    parameters: [
      { name: 'start_date', type: 'date', required: true },
      { name: 'end_date', type: 'date', required: true }
    ],
    visualization: {
      type: 'chart',
      config: {
        chartType: 'bar',
        xAxis: 'sales_rep',
        yAxis: 'total_revenue',
        title: 'Sales Performance by Representative'
      }
    }
  }
];
```

### 10. Deployment Customization

#### A. Production Environment Variables

```env
# Production .env file
NODE_ENV=production

# Theme & Branding
VITE_APP_NAME=Your Company Portal
VITE_APP_LOGO=https://your-domain.com/logo.png
VITE_PRIMARY_COLOR=#2563EB
VITE_SECONDARY_COLOR=#059669

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smartbizflow
DATABASE_TYPE=postgresql

# Security
JWT_SECRET=your-production-jwt-secret
ENCRYPTION_KEY=your-production-encryption-key

# Integrations
RAZORPAY_API_KEY=your-production-razorpay-key
RAZORPAY_WEBHOOK_SECRET=your-production-webhook-secret
SMTP_HOST=smtp.your-domain.com
SMTP_PORT=587
SMTP_USER=your-email@your-domain.com
SMTP_PASS=your-email-password

# Features
VITE_ENABLE_CRM=true
VITE_ENABLE_ERP=true
VITE_ENABLE_HR=true
VITE_ENABLE_IT_ASSETS=true
VITE_ENABLE_GST=true
VITE_ENABLE_BUSINESS_INTELLIGENCE=true
```

#### B. Docker Configuration

```dockerfile
# Dockerfile for production
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🎯 Best Practices

### 1. Configuration Management
- Use environment variables for sensitive data
- Keep configuration files in version control
- Document all customization options
- Use TypeScript for type safety

### 2. Performance Optimization
- Lazy load modules and components
- Implement proper caching strategies
- Optimize database queries
- Use CDN for static assets

### 3. Security Considerations
- Validate all user inputs
- Implement proper authentication
- Use HTTPS in production
- Regular security audits

### 4. Testing Strategy
- Unit tests for custom components
- Integration tests for workflows
- E2E tests for critical paths
- Performance testing

### 5. Maintenance
- Regular backups
- Monitor system performance
- Update dependencies regularly
- Document changes

This implementation guide provides a comprehensive approach to customizing your SmartBizFlow portal while maintaining scalability and maintainability. 