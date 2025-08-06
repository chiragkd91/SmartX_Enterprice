/**
 * SmartX Solution - Enterprise Database Integration
 * Microsoft SQL Server Configuration and Utilities
 */

import sql from 'mssql';
import { config } from 'dotenv';

// Load environment variables
config();

// SQL Server Configuration
export const sqlServerConfig: sql.config = {
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || 'YourStrong@Passw0rd',
  server: process.env.MSSQL_SERVER || 'localhost',
  database: process.env.MSSQL_DATABASE || 'SmartXSolution',
  port: parseInt(process.env.MSSQL_PORT || '1433'),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.MSSQL_TRUST_CERT === 'true',
    enableArithAbort: true
  },
  requestTimeout: 30000,
  connectionTimeout: 30000
};

// Database connection pool
let pool: sql.ConnectionPool | null = null;

/**
 * Initialize SQL Server connection pool
 */
export async function initializeDatabase(): Promise<sql.ConnectionPool> {
  try {
    if (!pool) {
      console.log('🔗 Initializing SQL Server connection...');
      pool = await sql.connect(sqlServerConfig);
      console.log('✅ SQL Server connected successfully');
      
      // Test connection
      await pool.request().query('SELECT 1 as test');
      console.log('✅ Database connection test passed');
    }
    return pool;
  } catch (error) {
    console.error('❌ SQL Server connection failed:', error);
    throw error;
  }
}

/**
 * Get database connection
 */
export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
    return await initializeDatabase();
  }
  return pool;
}

/**
 * Execute SQL query
 */
export async function executeQuery<T = any>(
  query: string, 
  params?: any[]
): Promise<T[]> {
  try {
    const connection = await getConnection();
    const request = connection.request();
    
    // Add parameters if provided
    if (params) {
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
    }
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('❌ Query execution failed:', error);
    throw error;
  }
}

/**
 * Execute stored procedure
 */
export async function executeStoredProcedure<T = any>(
  procedureName: string,
  params?: Record<string, any>
): Promise<T[]> {
  try {
    const connection = await getConnection();
    const request = connection.request();
    
    // Add parameters if provided
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }
    
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (error) {
    console.error('❌ Stored procedure execution failed:', error);
    throw error;
  }
}

/**
 * Execute transaction
 */
export async function executeTransaction<T>(
  callback: (transaction: sql.Transaction) => Promise<T>
): Promise<T> {
  const connection = await getConnection();
  const transaction = new sql.Transaction(connection);
  
  try {
    await transaction.begin();
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Transaction failed:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('🔌 Database connection closed');
  }
}

// Database Schema Types
export interface DatabaseSchema {
  // User Management
  users: {
    id: string;
    email: string;
    password_hash: string;
    role: string;
    department?: string;
    phone?: string;
    status: string;
    permissions?: string;
    created_at: Date;
    updated_at: Date;
  };

  // CRM Module
  leads: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    source?: string;
    status: string;
    assigned_to?: string;
    created_at: Date;
    updated_at: Date;
  };

  customers: {
    id: string;
    name: string;
    contact_person?: string;
    email: string;
    phone?: string;
    company?: string;
    industry?: string;
    address?: string;
    created_at: Date;
    updated_at: Date;
  };

  // ERP Module
  products: {
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    cost: number;
    sku?: string;
    hsn_code?: string;
    gst_rate: number;
    stock_quantity: number;
    created_at: Date;
    updated_at: Date;
  };

  orders: {
    id: string;
    order_number: string;
    customer_id: string;
    order_date: Date;
    delivery_date?: Date;
    status: string;
    total_amount: number;
    created_at: Date;
    updated_at: Date;
  };

  invoices: {
    id: string;
    invoice_number: string;
    customer_id: string;
    order_id?: string;
    invoice_date: Date;
    due_date: Date;
    total_amount: number;
    gst_amount: number;
    status: string;
    created_at: Date;
    updated_at: Date;
  };

  // HR Module
  employees: {
    id: string;
    employee_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: Date;
    gender?: string;
    address?: string;
    department: string;
    position: string;
    hire_date: Date;
    manager_id?: string;
    salary: number;
    status: string;
    created_at: Date;
    updated_at: Date;
  };

  leave_requests: {
    id: string;
    employee_id: string;
    leave_type: string;
    start_date: Date;
    end_date: Date;
    days_requested: number;
    reason?: string;
    status: string;
    approved_by?: string;
    approved_at?: Date;
    created_at: Date;
    updated_at: Date;
  };

  // IT Asset Module
  assets: {
    id: string;
    asset_name: string;
    asset_type: string;
    serial_number?: string;
    manufacturer?: string;
    model?: string;
    purchase_date: Date;
    purchase_cost: number;
    location: string;
    assigned_to?: string;
    status: string;
    created_at: Date;
    updated_at: Date;
  };

  // GST Module
  gst_invoices: {
    id: string;
    invoice_number: string;
    customer_id: string;
    invoice_date: Date;
    due_date: Date;
    total_amount: number;
    gst_amount: number;
    cgst_amount: number;
    sgst_amount: number;
    igst_amount: number;
    status: string;
    created_at: Date;
    updated_at: Date;
  };
}

// Database Service Class
export class SQLServerService {
  private static instance: SQLServerService;
  private pool: sql.ConnectionPool | null = null;

  private constructor() {}

  static getInstance(): SQLServerService {
    if (!SQLServerService.instance) {
      SQLServerService.instance = new SQLServerService();
    }
    return SQLServerService.instance;
  }

  async initialize(): Promise<void> {
    this.pool = await initializeDatabase();
  }

  async getConnection(): Promise<sql.ConnectionPool> {
    if (!this.pool) {
      await this.initialize();
    }
    return this.pool!;
  }

  async query<T = any>(query: string, params?: any[]): Promise<T[]> {
    return await executeQuery<T>(query, params);
  }

  async procedure<T = any>(name: string, params?: Record<string, any>): Promise<T[]> {
    return await executeStoredProcedure<T>(name, params);
  }

  async transaction<T>(callback: (transaction: sql.Transaction) => Promise<T>): Promise<T> {
    return await executeTransaction(callback);
  }

  async close(): Promise<void> {
    await closeDatabase();
  }
}

// Export singleton instance
export const dbService = SQLServerService.getInstance();

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    const connection = await getConnection();
    await connection.request().query('SELECT 1 as health_check');
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
}

// Database initialization script
export const createTablesSQL = `
-- Users Table
CREATE TABLE users (
    id NVARCHAR(50) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL,
    department NVARCHAR(100),
    phone NVARCHAR(20),
    status NVARCHAR(20) DEFAULT 'active',
    permissions NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Leads Table
CREATE TABLE leads (
    id NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    company NVARCHAR(255),
    source NVARCHAR(100),
    status NVARCHAR(50) DEFAULT 'new',
    assigned_to NVARCHAR(50),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Customers Table
CREATE TABLE customers (
    id NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    contact_person NVARCHAR(255),
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    company NVARCHAR(255),
    industry NVARCHAR(100),
    address NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Products Table
CREATE TABLE products (
    id NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) DEFAULT 0,
    sku NVARCHAR(100),
    hsn_code NVARCHAR(20),
    gst_rate DECIMAL(5,2) DEFAULT 18.00,
    stock_quantity INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Orders Table
CREATE TABLE orders (
    id NVARCHAR(50) PRIMARY KEY,
    order_number NVARCHAR(50) UNIQUE NOT NULL,
    customer_id NVARCHAR(50) NOT NULL,
    order_date DATETIME2 NOT NULL,
    delivery_date DATETIME2,
    status NVARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Invoices Table
CREATE TABLE invoices (
    id NVARCHAR(50) PRIMARY KEY,
    invoice_number NVARCHAR(50) UNIQUE NOT NULL,
    customer_id NVARCHAR(50) NOT NULL,
    order_id NVARCHAR(50),
    invoice_date DATETIME2 NOT NULL,
    due_date DATETIME2 NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    gst_amount DECIMAL(10,2) DEFAULT 0,
    status NVARCHAR(50) DEFAULT 'pending',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Employees Table
CREATE TABLE employees (
    id NVARCHAR(50) PRIMARY KEY,
    employee_id NVARCHAR(50) UNIQUE NOT NULL,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    date_of_birth DATE,
    gender NVARCHAR(10),
    address NVARCHAR(MAX),
    department NVARCHAR(100) NOT NULL,
    position NVARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL,
    manager_id NVARCHAR(50),
    salary DECIMAL(10,2) NOT NULL,
    status NVARCHAR(20) DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- Leave Requests Table
CREATE TABLE leave_requests (
    id NVARCHAR(50) PRIMARY KEY,
    employee_id NVARCHAR(50) NOT NULL,
    leave_type NVARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested INT NOT NULL,
    reason NVARCHAR(MAX),
    status NVARCHAR(50) DEFAULT 'pending',
    approved_by NVARCHAR(50),
    approved_at DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES employees(id)
);

-- Assets Table
CREATE TABLE assets (
    id NVARCHAR(50) PRIMARY KEY,
    asset_name NVARCHAR(255) NOT NULL,
    asset_type NVARCHAR(100) NOT NULL,
    serial_number NVARCHAR(100),
    manufacturer NVARCHAR(100),
    model NVARCHAR(100),
    purchase_date DATE NOT NULL,
    purchase_cost DECIMAL(10,2) NOT NULL,
    location NVARCHAR(255) NOT NULL,
    assigned_to NVARCHAR(50),
    status NVARCHAR(50) DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (assigned_to) REFERENCES employees(id)
);

-- GST Invoices Table
CREATE TABLE gst_invoices (
    id NVARCHAR(50) PRIMARY KEY,
    invoice_number NVARCHAR(50) UNIQUE NOT NULL,
    customer_id NVARCHAR(50) NOT NULL,
    invoice_date DATETIME2 NOT NULL,
    due_date DATETIME2 NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    gst_amount DECIMAL(10,2) DEFAULT 0,
    cgst_amount DECIMAL(10,2) DEFAULT 0,
    sgst_amount DECIMAL(10,2) DEFAULT 0,
    igst_amount DECIMAL(10,2) DEFAULT 0,
    status NVARCHAR(50) DEFAULT 'pending',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_assets_serial ON assets(serial_number);
CREATE INDEX idx_assets_assigned ON assets(assigned_to);
CREATE INDEX idx_gst_invoices_customer ON gst_invoices(customer_id);
`;

export default {
  sqlServerConfig,
  initializeDatabase,
  getConnection,
  executeQuery,
  executeStoredProcedure,
  executeTransaction,
  closeDatabase,
  dbService,
  healthCheck,
  createTablesSQL
}; 