/**
 * Microsoft SQL Server Service
 * Complete CRUD operations for SmartBizFlow
 */

import sql from 'mssql';
import { dbService, DatabaseSchema } from '../config/mssql-database';

// User Management Service
export class UserService {
  async createUser(userData: Omit<DatabaseSchema['users'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['users']> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO users (id, email, password_hash, role, department, phone, status, permissions)
      VALUES (@id, @email, @password_hash, @role, @department, @phone, @status, @permissions)
    `;
    
    await dbService.query(query, [id, userData.email, userData.password_hash, userData.role, userData.department, userData.phone, userData.status, userData.permissions]);
    
    return this.getUserById(id);
  }

  async getUserById(id: string): Promise<DatabaseSchema['users'] | null> {
    const result = await dbService.query<DatabaseSchema['users']>('SELECT * FROM users WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getUserByEmail(email: string): Promise<DatabaseSchema['users'] | null> {
    const result = await dbService.query<DatabaseSchema['users']>('SELECT * FROM users WHERE email = @email', [email]);
    return result[0] || null;
  }

  async getAllUsers(filters?: { role?: string; department?: string; status?: string }): Promise<DatabaseSchema['users'][]> {
    let query = 'SELECT * FROM users WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.role) {
      query += ' AND role = @role';
      params.push(filters.role);
    }
    if (filters?.department) {
      query += ' AND department = @department';
      params.push(filters.department);
    }
    if (filters?.status) {
      query += ' AND status = @status';
      params.push(filters.status);
    }
    
    return await dbService.query<DatabaseSchema['users']>(query, params);
  }

  async updateUser(id: string, updates: Partial<DatabaseSchema['users']>): Promise<DatabaseSchema['users']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE users SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<void> {
    await dbService.query('DELETE FROM users WHERE id = @id', [id]);
  }
}

// CRM Service
export class CRMService {
  // Lead Management
  async createLead(leadData: Omit<DatabaseSchema['leads'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['leads']> {
    const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO leads (id, name, email, phone, company, source, status, assigned_to)
      VALUES (@id, @name, @email, @phone, @company, @source, @status, @assigned_to)
    `;
    
    await dbService.query(query, [id, leadData.name, leadData.email, leadData.phone, leadData.company, leadData.source, leadData.status, leadData.assigned_to]);
    
    return this.getLeadById(id);
  }

  async getLeadById(id: string): Promise<DatabaseSchema['leads'] | null> {
    const result = await dbService.query<DatabaseSchema['leads']>('SELECT * FROM leads WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getAllLeads(filters?: { status?: string; source?: string; assigned_to?: string }): Promise<DatabaseSchema['leads'][]> {
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.status) {
      query += ' AND status = @status';
      params.push(filters.status);
    }
    if (filters?.source) {
      query += ' AND source = @source';
      params.push(filters.source);
    }
    if (filters?.assigned_to) {
      query += ' AND assigned_to = @assigned_to';
      params.push(filters.assigned_to);
    }
    
    return await dbService.query<DatabaseSchema['leads']>(query, params);
  }

  async updateLead(id: string, updates: Partial<DatabaseSchema['leads']>): Promise<DatabaseSchema['leads']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE leads SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getLeadById(id);
  }

  async deleteLead(id: string): Promise<void> {
    await dbService.query('DELETE FROM leads WHERE id = @id', [id]);
  }

  // Customer Management
  async createCustomer(customerData: Omit<DatabaseSchema['customers'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['customers']> {
    const id = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO customers (id, name, contact_person, email, phone, company, industry, address)
      VALUES (@id, @name, @contact_person, @email, @phone, @company, @industry, @address)
    `;
    
    await dbService.query(query, [id, customerData.name, customerData.contact_person, customerData.email, customerData.phone, customerData.company, customerData.industry, customerData.address]);
    
    return this.getCustomerById(id);
  }

  async getCustomerById(id: string): Promise<DatabaseSchema['customers'] | null> {
    const result = await dbService.query<DatabaseSchema['customers']>('SELECT * FROM customers WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getAllCustomers(filters?: { industry?: string; company?: string }): Promise<DatabaseSchema['customers'][]> {
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.industry) {
      query += ' AND industry = @industry';
      params.push(filters.industry);
    }
    if (filters?.company) {
      query += ' AND company = @company';
      params.push(filters.company);
    }
    
    return await dbService.query<DatabaseSchema['customers']>(query, params);
  }

  async updateCustomer(id: string, updates: Partial<DatabaseSchema['customers']>): Promise<DatabaseSchema['customers']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE customers SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getCustomerById(id);
  }

  async deleteCustomer(id: string): Promise<void> {
    await dbService.query('DELETE FROM customers WHERE id = @id', [id]);
  }
}

// ERP Service
export class ERPService {
  // Product Management
  async createProduct(productData: Omit<DatabaseSchema['products'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['products']> {
    const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO products (id, name, description, category, price, cost, sku, hsn_code, gst_rate, stock_quantity)
      VALUES (@id, @name, @description, @category, @price, @cost, @sku, @hsn_code, @gst_rate, @stock_quantity)
    `;
    
    await dbService.query(query, [id, productData.name, productData.description, productData.category, productData.price, productData.cost, productData.sku, productData.hsn_code, productData.gst_rate, productData.stock_quantity]);
    
    return this.getProductById(id);
  }

  async getProductById(id: string): Promise<DatabaseSchema['products'] | null> {
    const result = await dbService.query<DatabaseSchema['products']>('SELECT * FROM products WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getAllProducts(filters?: { category?: string; sku?: string }): Promise<DatabaseSchema['products'][]> {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.category) {
      query += ' AND category = @category';
      params.push(filters.category);
    }
    if (filters?.sku) {
      query += ' AND sku = @sku';
      params.push(filters.sku);
    }
    
    return await dbService.query<DatabaseSchema['products']>(query, params);
  }

  async updateProduct(id: string, updates: Partial<DatabaseSchema['products']>): Promise<DatabaseSchema['products']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE products SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getProductById(id);
  }

  async deleteProduct(id: string): Promise<void> {
    await dbService.query('DELETE FROM products WHERE id = @id', [id]);
  }

  // Order Management
  async createOrder(orderData: Omit<DatabaseSchema['orders'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['orders']> {
    const id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO orders (id, order_number, customer_id, order_date, delivery_date, status, total_amount)
      VALUES (@id, @order_number, @customer_id, @order_date, @delivery_date, @status, @total_amount)
    `;
    
    await dbService.query(query, [id, orderData.order_number, orderData.customer_id, orderData.order_date, orderData.delivery_date, orderData.status, orderData.total_amount]);
    
    return this.getOrderById(id);
  }

  async getOrderById(id: string): Promise<DatabaseSchema['orders'] | null> {
    const result = await dbService.query<DatabaseSchema['orders']>('SELECT * FROM orders WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getAllOrders(filters?: { customer_id?: string; status?: string }): Promise<DatabaseSchema['orders'][]> {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.customer_id) {
      query += ' AND customer_id = @customer_id';
      params.push(filters.customer_id);
    }
    if (filters?.status) {
      query += ' AND status = @status';
      params.push(filters.status);
    }
    
    return await dbService.query<DatabaseSchema['orders']>(query, params);
  }

  async updateOrder(id: string, updates: Partial<DatabaseSchema['orders']>): Promise<DatabaseSchema['orders']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE orders SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getOrderById(id);
  }

  async deleteOrder(id: string): Promise<void> {
    await dbService.query('DELETE FROM orders WHERE id = @id', [id]);
  }

  // Invoice Management
  async createInvoice(invoiceData: Omit<DatabaseSchema['invoices'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['invoices']> {
    const id = `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO invoices (id, invoice_number, customer_id, order_id, invoice_date, due_date, total_amount, gst_amount, status)
      VALUES (@id, @invoice_number, @customer_id, @order_id, @invoice_date, @due_date, @total_amount, @gst_amount, @status)
    `;
    
    await dbService.query(query, [id, invoiceData.invoice_number, invoiceData.customer_id, invoiceData.order_id, invoiceData.invoice_date, invoiceData.due_date, invoiceData.total_amount, invoiceData.gst_amount, invoiceData.status]);
    
    return this.getInvoiceById(id);
  }

  async getInvoiceById(id: string): Promise<DatabaseSchema['invoices'] | null> {
    const result = await dbService.query<DatabaseSchema['invoices']>('SELECT * FROM invoices WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getAllInvoices(filters?: { customer_id?: string; status?: string }): Promise<DatabaseSchema['invoices'][]> {
    let query = 'SELECT * FROM invoices WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.customer_id) {
      query += ' AND customer_id = @customer_id';
      params.push(filters.customer_id);
    }
    if (filters?.status) {
      query += ' AND status = @status';
      params.push(filters.status);
    }
    
    return await dbService.query<DatabaseSchema['invoices']>(query, params);
  }

  async updateInvoice(id: string, updates: Partial<DatabaseSchema['invoices']>): Promise<DatabaseSchema['invoices']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE invoices SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getInvoiceById(id);
  }

  async deleteInvoice(id: string): Promise<void> {
    await dbService.query('DELETE FROM invoices WHERE id = @id', [id]);
  }
}

// HR Service
export class HRService {
  // Employee Management
  async createEmployee(employeeData: Omit<DatabaseSchema['employees'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['employees']> {
    const id = `employee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO employees (id, employee_id, first_name, last_name, email, phone, date_of_birth, gender, address, department, position, hire_date, manager_id, salary, status)
      VALUES (@id, @employee_id, @first_name, @last_name, @email, @phone, @date_of_birth, @gender, @address, @department, @position, @hire_date, @manager_id, @salary, @status)
    `;
    
    await dbService.query(query, [id, employeeData.employee_id, employeeData.first_name, employeeData.last_name, employeeData.email, employeeData.phone, employeeData.date_of_birth, employeeData.gender, employeeData.address, employeeData.department, employeeData.position, employeeData.hire_date, employeeData.manager_id, employeeData.salary, employeeData.status]);
    
    return this.getEmployeeById(id);
  }

  async getEmployeeById(id: string): Promise<DatabaseSchema['employees'] | null> {
    const result = await dbService.query<DatabaseSchema['employees']>('SELECT * FROM employees WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getAllEmployees(filters?: { department?: string; status?: string; manager_id?: string }): Promise<DatabaseSchema['employees'][]> {
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.department) {
      query += ' AND department = @department';
      params.push(filters.department);
    }
    if (filters?.status) {
      query += ' AND status = @status';
      params.push(filters.status);
    }
    if (filters?.manager_id) {
      query += ' AND manager_id = @manager_id';
      params.push(filters.manager_id);
    }
    
    return await dbService.query<DatabaseSchema['employees']>(query, params);
  }

  async updateEmployee(id: string, updates: Partial<DatabaseSchema['employees']>): Promise<DatabaseSchema['employees']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE employees SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getEmployeeById(id);
  }

  async deleteEmployee(id: string): Promise<void> {
    await dbService.query('DELETE FROM employees WHERE id = @id', [id]);
  }

  // Leave Management
  async createLeaveRequest(leaveData: Omit<DatabaseSchema['leave_requests'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['leave_requests']> {
    const id = `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO leave_requests (id, employee_id, leave_type, start_date, end_date, days_requested, reason, status)
      VALUES (@id, @employee_id, @leave_type, @start_date, @end_date, @days_requested, @reason, @status)
    `;
    
    await dbService.query(query, [id, leaveData.employee_id, leaveData.leave_type, leaveData.start_date, leaveData.end_date, leaveData.days_requested, leaveData.reason, leaveData.status]);
    
    return this.getLeaveRequestById(id);
  }

  async getLeaveRequestById(id: string): Promise<DatabaseSchema['leave_requests'] | null> {
    const result = await dbService.query<DatabaseSchema['leave_requests']>('SELECT * FROM leave_requests WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getAllLeaveRequests(filters?: { employee_id?: string; status?: string; leave_type?: string }): Promise<DatabaseSchema['leave_requests'][]> {
    let query = 'SELECT * FROM leave_requests WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.employee_id) {
      query += ' AND employee_id = @employee_id';
      params.push(filters.employee_id);
    }
    if (filters?.status) {
      query += ' AND status = @status';
      params.push(filters.status);
    }
    if (filters?.leave_type) {
      query += ' AND leave_type = @leave_type';
      params.push(filters.leave_type);
    }
    
    return await dbService.query<DatabaseSchema['leave_requests']>(query, params);
  }

  async updateLeaveRequest(id: string, updates: Partial<DatabaseSchema['leave_requests']>): Promise<DatabaseSchema['leave_requests']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE leave_requests SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getLeaveRequestById(id);
  }

  async deleteLeaveRequest(id: string): Promise<void> {
    await dbService.query('DELETE FROM leave_requests WHERE id = @id', [id]);
  }

  async approveLeaveRequest(id: string, approvedBy: string): Promise<DatabaseSchema['leave_requests']> {
    return await this.updateLeaveRequest(id, {
      status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date()
    });
  }

  async rejectLeaveRequest(id: string, approvedBy: string): Promise<DatabaseSchema['leave_requests']> {
    return await this.updateLeaveRequest(id, {
      status: 'rejected',
      approved_by: approvedBy,
      approved_at: new Date()
    });
  }
}

// IT Asset Service
export class ITAssetService {
  async createAsset(assetData: Omit<DatabaseSchema['assets'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['assets']> {
    const id = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO assets (id, asset_name, asset_type, serial_number, manufacturer, model, purchase_date, purchase_cost, location, assigned_to, status)
      VALUES (@id, @asset_name, @asset_type, @serial_number, @manufacturer, @model, @purchase_date, @purchase_cost, @location, @assigned_to, @status)
    `;
    
    await dbService.query(query, [id, assetData.asset_name, assetData.asset_type, assetData.serial_number, assetData.manufacturer, assetData.model, assetData.purchase_date, assetData.purchase_cost, assetData.location, assetData.assigned_to, assetData.status]);
    
    return this.getAssetById(id);
  }

  async getAssetById(id: string): Promise<DatabaseSchema['assets'] | null> {
    const result = await dbService.query<DatabaseSchema['assets']>('SELECT * FROM assets WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getAllAssets(filters?: { asset_type?: string; status?: string; assigned_to?: string }): Promise<DatabaseSchema['assets'][]> {
    let query = 'SELECT * FROM assets WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.asset_type) {
      query += ' AND asset_type = @asset_type';
      params.push(filters.asset_type);
    }
    if (filters?.status) {
      query += ' AND status = @status';
      params.push(filters.status);
    }
    if (filters?.assigned_to) {
      query += ' AND assigned_to = @assigned_to';
      params.push(filters.assigned_to);
    }
    
    return await dbService.query<DatabaseSchema['assets']>(query, params);
  }

  async updateAsset(id: string, updates: Partial<DatabaseSchema['assets']>): Promise<DatabaseSchema['assets']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE assets SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getAssetById(id);
  }

  async deleteAsset(id: string): Promise<void> {
    await dbService.query('DELETE FROM assets WHERE id = @id', [id]);
  }
}

// GST Service
export class GSTService {
  async createGSTInvoice(invoiceData: Omit<DatabaseSchema['gst_invoices'], 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseSchema['gst_invoices']> {
    const id = `gst_invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO gst_invoices (id, invoice_number, customer_id, invoice_date, due_date, total_amount, gst_amount, cgst_amount, sgst_amount, igst_amount, status)
      VALUES (@id, @invoice_number, @customer_id, @invoice_date, @due_date, @total_amount, @gst_amount, @cgst_amount, @sgst_amount, @igst_amount, @status)
    `;
    
    await dbService.query(query, [id, invoiceData.invoice_number, invoiceData.customer_id, invoiceData.invoice_date, invoiceData.due_date, invoiceData.total_amount, invoiceData.gst_amount, invoiceData.cgst_amount, invoiceData.sgst_amount, invoiceData.igst_amount, invoiceData.status]);
    
    return this.getGSTInvoiceById(id);
  }

  async getGSTInvoiceById(id: string): Promise<DatabaseSchema['gst_invoices'] | null> {
    const result = await dbService.query<DatabaseSchema['gst_invoices']>('SELECT * FROM gst_invoices WHERE id = @id', [id]);
    return result[0] || null;
  }

  async getAllGSTInvoices(filters?: { customer_id?: string; status?: string }): Promise<DatabaseSchema['gst_invoices'][]> {
    let query = 'SELECT * FROM gst_invoices WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.customer_id) {
      query += ' AND customer_id = @customer_id';
      params.push(filters.customer_id);
    }
    if (filters?.status) {
      query += ' AND status = @status';
      params.push(filters.status);
    }
    
    return await dbService.query<DatabaseSchema['gst_invoices']>(query, params);
  }

  async updateGSTInvoice(id: string, updates: Partial<DatabaseSchema['gst_invoices']>): Promise<DatabaseSchema['gst_invoices']> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const query = `UPDATE gst_invoices SET ${setClause}, updated_at = GETDATE() WHERE id = @id`;
    
    const params = [...Object.values(updates), id];
    await dbService.query(query, params);
    
    return this.getGSTInvoiceById(id);
  }

  async deleteGSTInvoice(id: string): Promise<void> {
    await dbService.query('DELETE FROM gst_invoices WHERE id = @id', [id]);
  }
}

// Export service instances
export const userService = new UserService();
export const crmService = new CRMService();
export const erpService = new ERPService();
export const hrService = new HRService();
export const itAssetService = new ITAssetService();
export const gstService = new GSTService();

export default {
  UserService,
  CRMService,
  ERPService,
  HRService,
  ITAssetService,
  GSTService,
  userService,
  crmService,
  erpService,
  hrService,
  itAssetService,
  gstService
}; 