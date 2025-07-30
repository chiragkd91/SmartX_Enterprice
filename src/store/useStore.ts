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
  currentModule: string | null;
  
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
  logout: () => void;
  updateUserSessionInfo: (sessionInfo: Partial<User>) => void;
  
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

const STATIC_USER: User = {
  id: 'static-user-1',
  name: 'Chirag',
  email: 'chirag@smartbizflow.com',
  password_hash: 'Password@123',
  role: 'admin',
  department: 'IT',
  phone: '+1 (555) 123-4567',
  status: 'active',
  permissions: ['dashboard.view', 'users.view', 'users.create', 'users.edit', 'users.delete', 'hr.view', 'employees.view', 'employees.create', 'employees.edit', 'employees.delete', 'attendance.view', 'attendance.edit', 'leave.view', 'leave.edit', 'payroll.view', 'payroll.edit', 'performance.view', 'performance.edit', 'recruitment.view', 'recruitment.create', 'recruitment.edit', 'training.view', 'training.create', 'training.edit', 'crm.view', 'customers.view', 'customers.create', 'customers.edit', 'leads.view', 'leads.create', 'leads.edit', 'erp.view', 'products.view', 'products.create', 'products.edit', 'orders.view', 'orders.create', 'orders.edit', 'invoices.view', 'invoices.create', 'invoices.edit', 'vendors.view', 'vendors.create', 'vendors.edit', 'gst.view', 'gst.create', 'gst.edit', 'assets.view', 'assets.create', 'assets.edit', 'reports.view', 'settings.view', 'settings.edit'],
  created_at: '2024-01-01T00:00:00Z',
  last_login: new Date().toISOString()
};

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  loading: false,
  error: null,
  currentUser: STATIC_USER,
  isAuthenticated: true,
  currentModule: null, // Track which module user logged in from
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
  login: async () => {
    console.log('Login is disabled; using static user.');
    return Promise.resolve(true);
  },
  loginFallback: async () => {
    console.log('Login fallback is disabled; using static user.');
    return Promise.resolve(true);
  },

  logout: () => {
    console.log('🔓 User logged out');
    set({ 
      currentUser: null, 
      isAuthenticated: false,
      currentModule: null,
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
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ users: DEFAULT_USERS, loading: false });
    } catch (error) {
      set({ error: 'Failed to load users', loading: false });
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
