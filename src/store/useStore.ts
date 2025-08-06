/**
 * Unified store for Smart ERP + CRM + HR Portal
 * Complete Indian business solution with multi-module support
 */

import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  status: string;
  permissions: string[];
  created_at: string;
  last_login?: string;
  password_hash: string;
  avatar?: string;
  // Session-related properties
  timeRemaining?: number;
  isActive?: boolean;
  showWarning?: boolean;
  sessionStartTime?: number;
  lastActivity?: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  gstin?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  status: string;
  created_at: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  value: number;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  hsn_code?: string;
  gst_rate?: number;
  created_at: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  joining_date: string;
  status: string;
  employee_id: string;
}

interface DashboardStats {
  // CRM Stats
  totalCustomers: number;
  activeLeads: number;
  conversionRate: number;
  
  // ERP Stats
  totalProducts: number;
  totalOrders: number;
  monthlyRevenue: number;
  
  // HR Stats
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  
  // GST Stats
  monthlyGST: number;
  gstCompliance: number;
  
  // Overall
  customerSatisfaction: number;
  systemUptime: number;
  totalRevenue: number;
}

interface StoreState {
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  currentModule: string | null; // Track which module user logged into
  allowedModules: string[]; // Modules user is allowed to access
  
  // Dashboard
  dashboardStats: DashboardStats;
  
  // Data
  users: User[];
  customers: Customer[];
  leads: Lead[];
  products: Product[];
  employees: Employee[];
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Authentication actions
  login: (email: string, password: string, module?: string) => Promise<boolean>;
  loginFallback: (email: string, password: string, module?: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  setActiveModule: (module: string) => void;
  getModulesForRole: (role: string, specificModule?: string) => string[];
  updateUserSessionInfo: (sessionInfo: Partial<User>) => void;
  logout: () => void;
  
  // Dashboard actions
  loadDashboardData: () => Promise<void>;
  
  // Data actions
  loadUsers: () => Promise<void>;
  loadCustomers: () => Promise<void>;
  loadLeads: () => Promise<void>;
  loadProducts: () => Promise<void>;
  loadEmployees: () => Promise<void>;
  
  // Initialize app
  initializeApp: () => Promise<void>;
}

// Comprehensive demo users for all modules with role-based access
const DEFAULT_USERS: User[] = [
  {
    id: 'admin-001',
    name: 'System Administrator',
    email: 'admin@smartbizflow.com',
    password_hash: 'password123',
    role: 'admin',
    department: 'IT',
    phone: '+1 (555) 123-4567',
    status: 'active',
    permissions: [
      // Dashboard & Core System
      'dashboard.view', 'dashboard.admin',
      
      // User Management - Full Control
      'users.view', 'users.create', 'users.edit', 'users.delete', 'users.admin',
      'user.permissions.manage', 'user.roles.manage',
      
      // HR Module - Full Control
      'hr.view', 'hr.admin',
      'employees.view', 'employees.create', 'employees.edit', 'employees.delete', 'employees.admin',
      'attendance.view', 'attendance.edit', 'attendance.admin', 'attendance.reports',
      'leave.view', 'leave.edit', 'leave.admin', 'leave.approve', 'leave.reports',
      'payroll.view', 'payroll.edit', 'payroll.admin', 'payroll.process', 'payroll.reports',
      'performance.view', 'performance.edit', 'performance.admin', 'performance.reports',
      'recruitment.view', 'recruitment.create', 'recruitment.edit', 'recruitment.admin',
      'training.view', 'training.create', 'training.edit', 'training.admin',
      'onboarding.view', 'onboarding.create', 'onboarding.edit', 'onboarding.admin',
      'offboarding.view', 'offboarding.create', 'offboarding.edit', 'offboarding.admin',
      'benefits.view', 'benefits.create', 'benefits.edit', 'benefits.admin',
      'workflow.view', 'workflow.create', 'workflow.edit', 'workflow.admin',
      'security.view', 'security.edit', 'security.admin',
      
      // CRM Module - Full Control
      'crm.view', 'crm.admin',
      'customers.view', 'customers.create', 'customers.edit', 'customers.delete', 'customers.admin',
      'leads.view', 'leads.create', 'leads.edit', 'leads.delete', 'leads.admin',
      'leads.scoring', 'leads.advanced',
      'email.integration', 'email.campaigns',
      'notifications.view', 'notifications.create', 'notifications.admin',
      'analytics.crm', 'analytics.advanced',
      
      // ERP Module - Full Control
      'erp.view', 'erp.admin',
      'products.view', 'products.create', 'products.edit', 'products.delete', 'products.admin',
      'orders.view', 'orders.create', 'orders.edit', 'orders.delete', 'orders.admin',
      'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.admin',
      'vendors.view', 'vendors.create', 'vendors.edit', 'vendors.delete', 'vendors.admin',
      'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.admin',
      'manufacturing.view', 'manufacturing.create', 'manufacturing.edit', 'manufacturing.admin',
      'procurement.view', 'procurement.create', 'procurement.edit', 'procurement.admin',
      'financial.view', 'financial.create', 'financial.edit', 'financial.admin',
      'logistics.view', 'logistics.create', 'logistics.edit', 'logistics.admin',
      'quality.view', 'quality.create', 'quality.edit', 'quality.admin',
      
      // GST & Compliance - Full Control
      'gst.view', 'gst.create', 'gst.edit', 'gst.delete', 'gst.admin',
      'gst.filing', 'gst.returns', 'gst.compliance',
      
      // IT Assets - Full Control
      'assets.view', 'assets.create', 'assets.edit', 'assets.delete', 'assets.admin',
      'assets.tracking', 'assets.maintenance', 'assets.software',
      'assets.inventory', 'assets.system', 'assets.access',
      'support.tickets', 'support.admin',
      
      // Reports & Analytics - Full Control
      'reports.view', 'reports.create', 'reports.admin',
      'analytics.view', 'analytics.advanced', 'analytics.predictive',
      'business.intelligence', 'business.intelligence.advanced',
      
      // System Administration - Full Control
      'settings.view', 'settings.edit', 'settings.admin',
      'system.admin', 'system.configuration',
      'automation.view', 'automation.create', 'automation.admin',
      'file.management', 'file.admin',
      'pricing.view', 'pricing.admin',
      'customization.view', 'customization.admin',
      
      // Advanced Features - Full Control
      'blockchain.integration', 'iot.connectivity',
      'multilanguage.support', 'cloud.deployment',
      'advanced.security', 'mobile.features',
      'integrations.advanced', 'integrations.admin',
      
      // Missing permissions for sidebar navigation
      'profile.view', 'home.view',
      
      // Super Admin Permissions
      'super.admin', 'system.override', 'emergency.access', 'admin'
    ],
    created_at: '2024-01-01T00:00:00Z',
    last_login: '2024-12-03T18:30:00Z'
  },
  {
    id: 'hr-001',
    name: 'HR Manager',
    email: 'hr@smartbizflow.com',
    password_hash: 'password123',
    role: 'hr_manager',
    department: 'HR',
    phone: '+1 (555) 234-5678',
    status: 'active',
    permissions: [
      'dashboard.view', 'hr.view', 'hr.admin',
      'employees.view', 'employees.create', 'employees.edit',
      'attendance.view', 'attendance.edit', 'attendance.reports',
      'leave.view', 'leave.edit', 'leave.approve', 'leave.reports',
      'payroll.view', 'payroll.edit', 'payroll.reports',
      'performance.view', 'performance.edit',
      'recruitment.view', 'recruitment.create', 'recruitment.edit',
      'training.view', 'training.create', 'training.edit',
      'reports.view', 'analytics.view'
    ],
    created_at: '2024-01-15T09:00:00Z',
    last_login: '2024-12-03T17:45:00Z'
  },
  {
    id: 'emp-001',
    name: 'John Smith',
    email: 'john.smith@smartbizflow.com',
    password_hash: 'password123',
    role: 'employee',
    department: 'Engineering',
    phone: '+1 (555) 345-6789',
    status: 'active',
    permissions: [
      'dashboard.view', 'hr.view', 'employees.view',
      'attendance.view',
      'leave.view', 'leave.create',
      'training.view', 'training.enroll',
      'payroll.view', 'profile.view'
    ],
    created_at: '2024-02-10T14:20:00Z',
    last_login: '2024-12-03T16:20:00Z'
  },
  {
    id: 'emp-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@smartbizflow.com',
    password_hash: 'password123',
    role: 'employee',
    department: 'HR',
    phone: '+1 (555) 345-6780',
    status: 'active',
    permissions: [
      'dashboard.view', 'hr.view', 'employees.view',
      'attendance.view',
      'leave.view', 'leave.create',
      'training.view', 'training.enroll',
      'payroll.view', 'profile.view'
    ],
    created_at: '2024-02-15T10:00:00Z',
    last_login: '2024-12-03T15:00:00Z'
  },
  {
    id: 'emp-003',
    name: 'Mike Wilson',
    email: 'mike.wilson@smartbizflow.com',
    password_hash: 'password123',
    role: 'employee',
    department: 'Sales',
    phone: '+1 (555) 345-6781',
    status: 'active',
    permissions: [
      'dashboard.view', 'hr.view', 'employees.view',
      'attendance.view',
      'leave.view', 'leave.create',
      'training.view', 'training.enroll',
      'payroll.view', 'profile.view'
    ],
    created_at: '2024-02-20T14:30:00Z',
    last_login: '2024-12-03T14:30:00Z'
  },
  {
    id: 'emp-004',
    name: 'Emily Davis',
    email: 'emily.davis@smartbizflow.com',
    password_hash: 'password123',
    role: 'employee',
    department: 'Marketing',
    phone: '+1 (555) 456-7890',
    status: 'active',
    permissions: [
      'dashboard.view', 'hr.view', 'employees.view',
      'attendance.view',
      'leave.view', 'leave.create',
      'training.view', 'training.enroll',
      'payroll.view', 'profile.view'
    ],
    created_at: '2024-03-01T09:15:00Z',
    last_login: '2024-12-03T13:15:00Z'
  },
  {
    id: 'emp-005',
    name: 'David Brown',
    email: 'david.brown@smartbizflow.com',
    password_hash: 'password123',
    role: 'employee',
    department: 'Finance',
    phone: '+1 (555) 567-8901',
    status: 'active',
    permissions: [
      'dashboard.view', 'hr.view', 'employees.view',
      'attendance.view',
      'leave.view', 'leave.create',
      'training.view', 'training.enroll',
      'payroll.view', 'profile.view'
    ],
    created_at: '2024-02-01T11:45:00Z',
    last_login: '2024-12-03T12:45:00Z'
  },
  {
    id: 'crm-001',
    name: 'CRM Manager',
    email: 'crm@smartbizflow.com',
    password_hash: 'password123',
    role: 'crm_manager',
    department: 'Sales',
    phone: '+1 (555) 678-9012',
    status: 'active',
    permissions: [
      'dashboard.view', 'crm.view', 'crm.admin',
      'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
      'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
      'leads.scoring', 'leads.advanced',
      'email.integration', 'email.campaigns',
      'notifications.view', 'notifications.create',
      'analytics.crm', 'reports.view'
    ],
    created_at: '2024-01-20T11:30:00Z',
    last_login: '2024-12-03T15:30:00Z'
  },
  {
    id: 'sales-001',
    name: 'Sales Representative',
    email: 'sales@smartbizflow.com',
    password_hash: 'password123',
    role: 'sales_rep',
    department: 'Sales',
    phone: '+1 (555) 789-0123',
    status: 'active',
    permissions: [
      'dashboard.view', 'crm.view',
      'customers.view', 'customers.create', 'customers.edit',
      'leads.view', 'leads.create', 'leads.edit',
      'reports.view'
    ],
    created_at: '2024-02-05T13:15:00Z',
    last_login: '2024-12-03T14:15:00Z'
  },
  {
    id: 'support-001',
    name: 'Customer Support Agent',
    email: 'support@smartbizflow.com',
    password_hash: 'password123',
    role: 'customer_support',
    department: 'Support',
    phone: '+1 (555) 890-1234',
    status: 'active',
    permissions: [
      'dashboard.view', 'crm.view',
      'customers.view', 'customers.edit',
      'leads.view', 'leads.edit',
      'support.tickets', 'support.create',
      'reports.view'
    ],
    created_at: '2024-02-15T10:45:00Z',
    last_login: '2024-12-03T13:45:00Z'
  },
  {
    id: 'finance-001',
    name: 'Finance Manager',
    email: 'finance@smartbizflow.com',
    password_hash: 'password123',
    role: 'finance_manager',
    department: 'Finance',
    phone: '+1 (555) 901-2345',
    status: 'active',
    permissions: [
      'dashboard.view', 'erp.view', 'erp.admin',
      'products.view', 'products.create', 'products.edit',
      'orders.view', 'orders.create', 'orders.edit',
      'invoices.view', 'invoices.create', 'invoices.edit',
      'vendors.view', 'vendors.create', 'vendors.edit',
      'gst.view', 'gst.create', 'gst.edit', 'gst.filing',
      'financial.view', 'financial.create', 'financial.edit',
      'payroll.view', 'payroll.edit', 'payroll.process',
      'reports.view', 'analytics.view'
    ],
    created_at: '2024-01-25T08:30:00Z',
    last_login: '2024-12-03T12:30:00Z'
  },
  {
    id: 'it-001',
    name: 'IT Administrator',
    email: 'it@smartbizflow.com',
    password_hash: 'password123',
    role: 'it_admin',
    department: 'IT',
    phone: '+1 (555) 012-3456',
    status: 'active',
    permissions: [
      'dashboard.view', 'assets.view', 'assets.create', 'assets.edit', 'assets.admin',
      'assets.tracking', 'assets.maintenance', 'assets.software',
      'assets.inventory', 'assets.system', 'assets.access',
      'support.tickets', 'support.admin',
      'users.view', 'users.create', 'users.edit',
      'settings.view', 'settings.edit', 'settings.admin',
      'automation.view', 'automation.create', 'automation.admin',
      'system.admin', 'system.configuration',
      'reports.view'
    ],
    created_at: '2024-01-10T16:00:00Z',
    last_login: '2024-12-03T11:00:00Z'
  },
  {
    id: 'viewer-001',
    name: 'Report Viewer',
    email: 'viewer@smartbizflow.com',
    password_hash: 'password123',
    role: 'viewer',
    department: 'Management',
    phone: '+1 (555) 123-4567',
    status: 'active',
    permissions: [
      'dashboard.view', 'reports.view', 'analytics.view',
      'business.intelligence',
      'hr.view', 'employees.view',
      'crm.view', 'customers.view', 'leads.view',
      'erp.view', 'products.view', 'orders.view', 'invoices.view',
      'gst.view', 'assets.view'
    ],
    created_at: '2024-03-01T12:00:00Z',
    last_login: '2024-12-03T10:00:00Z'
  },
  // Healthcare Module Users
  {
    id: 'doc-001',
    name: 'Dr. Smith',
    email: 'dr.smith@healthcareflow.com',
    password_hash: 'password123',
    role: 'doctor',
    department: 'Cardiology',
    phone: '+91 98765-43210',
    status: 'active',
    permissions: [
      'dashboard.view', 'healthcare.view', 'healthcare.admin',
      'patients.view', 'patients.create', 'patients.edit',
      'appointments.view', 'appointments.create', 'appointments.edit',
      'medical.records', 'prescriptions.create',
      'reports.view', 'analytics.view'
    ],
    created_at: '2020-01-15T08:00:00Z',
    last_login: '2024-12-03T09:00:00Z'
  },
  {
    id: 'doc-002',
    name: 'Dr. Kumar',
    email: 'dr.kumar@healthcareflow.com',
    password_hash: 'password123',
    role: 'doctor',
    department: 'Neurology',
    phone: '+91 98765-43211',
    status: 'active',
    permissions: [
      'dashboard.view', 'healthcare.view',
      'patients.view', 'patients.create', 'patients.edit',
      'appointments.view', 'appointments.create', 'appointments.edit',
      'medical.records', 'prescriptions.create',
      'reports.view'
    ],
    created_at: '2021-03-01T09:30:00Z',
    last_login: '2024-12-03T08:30:00Z'
  },
  {
    id: 'nurse-001',
    name: 'Nurse Johnson',
    email: 'nurse.johnson@healthcareflow.com',
    password_hash: 'password123',
    role: 'nurse',
    department: 'General',
    phone: '+91 98765-43212',
    status: 'active',
    permissions: [
      'dashboard.view', 'healthcare.view',
      'patients.view', 'patients.edit',
      'appointments.view', 'appointments.edit',
      'medical.records.view',
      'reports.view'
    ],
    created_at: '2022-06-15T10:00:00Z',
    last_login: '2024-12-03T07:30:00Z'
  }
];

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  loading: false,
  error: null,
  currentUser: null,
  isAuthenticated: false,
  currentModule: null, // Track which module user logged into
  allowedModules: [], // Modules user is allowed to access
  dashboardStats: {
    totalCustomers: 0,
    activeLeads: 0,
    conversionRate: 0,
    totalProducts: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    monthlyGST: 0,
    gstCompliance: 0,
    customerSatisfaction: 0,
    systemUptime: 0,
    totalRevenue: 0
  },
  users: [],
  customers: [],
  leads: [],
  products: [],
  employees: [],

  // Actions
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  // Authentication system with server integration
  login: async (email: string, password: string, module?: string) => {
    console.log('🔐 Login attempt:', { email, password });
    set({ loading: true, error: null });
    
    try {
      // First try server authentication
      console.log('🌐 Attempting server authentication...');
      
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Server authentication successful:', data);
        
        // Store token for future requests
        localStorage.setItem('authToken', data.token);
        
        // Convert server user format to frontend format
        const user: User = {
          id: data.user.id,
          name: data.user.email.split('@')[0], // Extract name from email
          email: data.user.email,
          role: data.user.role,
          department: 'Unknown',
          phone: '',
          status: 'active',
          permissions: [], // Will be populated based on role
          created_at: new Date().toISOString(),
          password_hash: '', // Don't store password hash on frontend
        };

        set({
          currentUser: user,
          isAuthenticated: true,
          loading: false,
          error: null,
          currentModule: module || null
        });
        
        console.log('📊 Loading dashboard data...');
        await get().loadDashboardData();
        
        console.log('✅ Server login successful');
        return true;
      } else {
        console.log('❌ Server authentication failed, trying fallback...');
        // Fallback to local authentication for development
        return await get().loginFallback(email, password, module);
      }
    } catch (error) {
      console.error('🚨 Server connection error:', error);
      console.log('🔄 Falling back to local authentication...');
      // Fallback to local authentication if server is not available
      return await get().loginFallback(email, password, module);
    }
  },

  // Fallback authentication for development/offline mode
  loginFallback: async (email: string, password: string, module?: string) => {
    console.log('🔐 Fallback login attempt:', { email });
    
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use consistent password for all users
      const VALID_PASSWORD = 'password123';
      console.log('Debug - Expected password:', VALID_PASSWORD);
      console.log('Debug - Provided password:', password);
      
      // Find user by email
      const user = DEFAULT_USERS.find(u =>
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      // Check if user exists and password matches
      const isValidLogin = user && password === VALID_PASSWORD;
      
      console.log('🔑 Using static password authentication');
      console.log('🔑 Valid password: password123');
      
      console.log('👤 User found:', user ? 'Yes' : 'No');
      console.log('🔑 Password valid:', isValidLogin ? 'Yes' : 'No');
      
      if (isValidLogin) {
        console.log('✅ Setting authentication state...');
        
        // Determine allowed modules based on user role and selected module
        const allowedModules = get().getModulesForRole(user.role, module);
        
        set({
          currentUser: user,
          isAuthenticated: true,
          loading: false,
          error: null,
          currentModule: module || null,
          allowedModules
        });
        
        console.log('📊 Loading dashboard data...');
        await get().loadDashboardData();
        
        console.log('✅ Fallback login successful');
        return true;
      } else {
        console.log('❌ Invalid credentials');
        set({
          error: 'Invalid email or password',
          loading: false,
          isAuthenticated: false,
          currentUser: null
        });
        return false;
      }
    } catch (error) {
      console.error('🚨 Fallback login error:', error);
      set({
        error: 'Login failed. Please try again.',
        loading: false,
        isAuthenticated: false,
        currentUser: null
      });
      return false;
    }
  },

  logout: () => {
    console.log('🔓 User logged out');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('currentModule');
    set({ 
      currentUser: null, 
      isAuthenticated: false,
      currentModule: null,
      allowedModules: [],
      dashboardStats: {
        totalCustomers: 0,
        activeLeads: 0,
        conversionRate: 0,
        totalProducts: 0,
        totalOrders: 0,
        monthlyRevenue: 0,
        totalEmployees: 0,
        presentToday: 0,
        pendingLeaves: 0,
        monthlyGST: 0,
        gstCompliance: 0,
        customerSatisfaction: 0,
        systemUptime: 0,
        totalRevenue: 0
      }
    });
  },

  checkAuth: async () => {
    console.log('🔍 Checking authentication status...');
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('❌ No auth token found');
        set({ isAuthenticated: false, currentUser: null, loading: false });
        return;
      }

      console.log('🔑 Auth token found, verifying...');
      
      // Try to verify token with server
      const response = await fetch('http://localhost:3001/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Token verification successful:', data);
        
        const user: User = {
          id: data.user.id,
          name: data.user.email.split('@')[0],
          email: data.user.email,
          role: data.user.role,
          department: 'Unknown',
          phone: '',
          status: 'active',
          permissions: [],
          created_at: new Date().toISOString(),
          password_hash: '',
        };

        set({
          currentUser: user,
          isAuthenticated: true,
          loading: false,
          error: null
        });
        
        console.log('📊 Loading dashboard data after token verification...');
        await get().loadDashboardData();
      } else {
        console.log('❌ Token verification failed');
        localStorage.removeItem('authToken');
        set({ isAuthenticated: false, currentUser: null, loading: false });
      }
    } catch (error) {
      console.error('🚨 Token verification error:', error);
      // If server is down, just clear auth state
      localStorage.removeItem('authToken');
      set({ isAuthenticated: false, currentUser: null, loading: false });
    }
  },

  setActiveModule: (module: string) => {
    console.log('📋 Setting active module:', module);
    set({ currentModule: module });
  },

  // Get modules allowed for a user role
  getModulesForRole: (role: string, specificModule?: string) => {
    const moduleMap = {
      'admin': ['Dashboard', 'SmartX CRM', 'SmartX ERP', 'SmartX HRMS', 'SmartX IT Asset', 'GST & Invoicing', 'Business Intelligence', 'Reports & Analytics', 'Automation Hub', 'Future Enhancements', 'File Management', 'User Management', 'Settings'],
      'hr_manager': ['Dashboard', 'SmartX HRMS', 'Reports & Analytics', 'File Management'],
      'hrManager': ['Dashboard', 'SmartX HRMS', 'Reports & Analytics', 'File Management'],
      'employee': ['Dashboard', 'SmartX HRMS'],
      'crm_manager': ['Dashboard', 'SmartX CRM', 'Reports & Analytics', 'File Management'],
      'crmManager': ['Dashboard', 'SmartX CRM', 'Reports & Analytics', 'File Management'],
      'sales_rep': ['Dashboard', 'SmartX CRM'],
      'salesRep': ['Dashboard', 'SmartX CRM'],
      'customer_support': ['Dashboard', 'SmartX CRM'],
      'finance_manager': ['Dashboard', 'SmartX ERP', 'GST & Invoicing', 'Reports & Analytics'],
      'it_admin': ['Dashboard', 'SmartX IT Asset', 'User Management', 'Settings'],
      'itManager': ['Dashboard', 'SmartX IT Asset', 'User Management', 'Settings'],
      'viewer': ['Dashboard', 'Reports & Analytics']
    };

    let allowedModules = moduleMap[role] || ['Dashboard'];
    
    // If user selected a specific module on login, restrict to just that module + Dashboard
    if (specificModule) {
      const moduleNameMap = {
        'hrms': 'SmartX HRMS',
        'crm': 'SmartX CRM',
        'erp': 'SmartX ERP',
        'it': 'SmartX IT Asset'
      };
      
      const targetModule = moduleNameMap[specificModule];
      if (targetModule && allowedModules.includes(targetModule)) {
        allowedModules = ['Dashboard', targetModule];
      }
    }
    
    return allowedModules;
  },

  updateUserSessionInfo: (sessionInfo: Partial<User>) => {
    const { currentUser } = get();
    if (currentUser) {
      set({
        currentUser: {
          ...currentUser,
          ...sessionInfo
        }
      });
    }
  },

  // Dashboard data loading
  loadDashboardData: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    set({ loading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Role-based stats
      let stats = {
        totalCustomers: 0,
        activeLeads: 0,
        conversionRate: 0,
        totalProducts: 0,
        totalOrders: 0,
        monthlyRevenue: 0,
        totalEmployees: 0,
        presentToday: 0,
        pendingLeaves: 0,
        monthlyGST: 0,
        gstCompliance: 0,
        customerSatisfaction: 0,
        systemUptime: 0,
        totalRevenue: 0
      };

      if (currentUser.role === 'admin') {
        stats = {
          totalCustomers: 1247,
          activeLeads: 156,
          conversionRate: 24.5,
          totalProducts: 2341,
          totalOrders: 847,
          monthlyRevenue: 68500000,
          totalEmployees: 180,
          presentToday: 168,
          pendingLeaves: 23,
          monthlyGST: 12330000,
          gstCompliance: 98.5,
          customerSatisfaction: 4.6,
          systemUptime: 99.9,
          totalRevenue: 342500000
        };
      } else if (currentUser.role === 'manager') {
        stats = {
          totalCustomers: 247,
          activeLeads: 32,
          conversionRate: 28.2,
          totalProducts: 456,
          totalOrders: 123,
          monthlyRevenue: 12500000,
          totalEmployees: 25,
          presentToday: 24,
          pendingLeaves: 4,
          monthlyGST: 2250000,
          gstCompliance: 99.2,
          customerSatisfaction: 4.7,
          systemUptime: 99.8,
          totalRevenue: 85600000
        };
      } else {
        stats = {
          totalCustomers: 89,
          activeLeads: 12,
          conversionRate: 31.5,
          totalProducts: 145,
          totalOrders: 45,
          monthlyRevenue: 4200000,
          totalEmployees: 8,
          presentToday: 8,
          pendingLeaves: 1,
          monthlyGST: 756000,
          gstCompliance: 99.5,
          customerSatisfaction: 4.8,
          systemUptime: 99.9,
          totalRevenue: 28500000
        };
      }

      set({ dashboardStats: stats, loading: false });
    } catch (error) {
      set({ error: 'Failed to load dashboard data', loading: false });
    }
  },

  // Data loading functions
  loadUsers: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ users: DEFAULT_USERS });
    } catch (error) {
      set({ error: 'Failed to load users' });
    }
  },

  loadCustomers: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Sample customers data would go here
      set({ customers: [], loading: false });
    } catch (error) {
      set({ error: 'Failed to load customers', loading: false });
    }
  },

  loadLeads: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Sample leads data would go here
      set({ leads: [], loading: false });
    } catch (error) {
      set({ error: 'Failed to load leads', loading: false });
    }
  },

  loadProducts: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Sample products data would go here
      set({ products: [], loading: false });
    } catch (error) {
      set({ error: 'Failed to load products', loading: false });
    }
  },

  loadEmployees: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Sample employees data would go here
      set({ employees: [], loading: false });
    } catch (error) {
      set({ error: 'Failed to load employees', loading: false });
    }
  },

  // Initialize app
  initializeApp: async () => {
    console.log('🚀 Initializing app...');
    set({ loading: true, error: null });
    
    try {
      // Load initial data without setting loading state in individual functions
      const loadUsersData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          return DEFAULT_USERS;
        } catch (error) {
          console.error('Failed to load users:', error);
          return [];
        }
      };

      const loadCustomersData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          return []; // Sample customers data would go here
        } catch (error) {
          console.error('Failed to load customers:', error);
          return [];
        }
      };

      const loadLeadsData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          return []; // Sample leads data would go here
        } catch (error) {
          console.error('Failed to load leads:', error);
          return [];
        }
      };

      const loadProductsData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          return []; // Sample products data would go here
        } catch (error) {
          console.error('Failed to load products:', error);
          return [];
        }
      };

      const loadEmployeesData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          return []; // Sample employees data would go here
        } catch (error) {
          console.error('Failed to load employees:', error);
          return [];
        }
      };

      // Load all data in parallel
      const [users, customers, leads, products, employees] = await Promise.all([
        loadUsersData(),
        loadCustomersData(),
        loadLeadsData(),
        loadProductsData(),
        loadEmployeesData()
      ]);

      console.log('✅ App initialization completed');
      
      // Set all data at once
      set({ 
        users,
        customers,
        leads,
        products,
        employees,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      set({ 
        error: 'Failed to initialize app', 
        loading: false 
      });
    }
  }
}));
