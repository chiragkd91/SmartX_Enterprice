/**
 * SmartBizFlow - Single Database Configuration
 * Microsoft SQL Server Only - Simplified Database Architecture
 */

import sql from 'mssql';
import { config } from 'dotenv';

// Load environment variables
config();

// Single Database Configuration - SQL Server
export const databaseConfig: sql.config = {
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || 'Password@123',
  server: process.env.MSSQL_SERVER || '103.206.57.30',
  database: process.env.MSSQL_DATABASE || 'SmartXSolution',
  port: parseInt(process.env.MSSQL_PORT || '1201'),
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
 * Single Database Service Class
 * Handles all database operations through SQL Server only
 */
export class SingleDatabaseService {
  private static instance: SingleDatabaseService;
  private pool: sql.ConnectionPool | null = null;

  private constructor() {}

  static getInstance(): SingleDatabaseService {
    if (!SingleDatabaseService.instance) {
      SingleDatabaseService.instance = new SingleDatabaseService();
    }
    return SingleDatabaseService.instance;
  }

  /**
   * Initialize database connection
   */
  async initialize(): Promise<sql.ConnectionPool> {
    try {
      if (!this.pool) {
        console.log('🔗 Connecting to Single Database (SQL Server)...');
        this.pool = await sql.connect(databaseConfig);
        console.log('✅ Single Database connected successfully');
        
        // Test connection
        await this.pool.request().query('SELECT 1 as health_check');
        console.log('✅ Database health check passed');
      }
      return this.pool;
    } catch (error) {
      console.error('❌ Single Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Get database connection
   */
  async getConnection(): Promise<sql.ConnectionPool> {
    if (!this.pool) {
      return await this.initialize();
    }
    return this.pool;
  }

  /**
   * Execute SQL query
   */
  async query<T = any>(query: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const connection = await this.getConnection();
      const request = connection.request();
      
      // Add parameters if provided
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
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
  async procedure<T = any>(
    procedureName: string,
    params?: Record<string, any>
  ): Promise<T[]> {
    try {
      const connection = await this.getConnection();
      const request = connection.request();
      
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
  async transaction<T>(
    callback: (transaction: sql.Transaction) => Promise<T>
  ): Promise<T> {
    const connection = await this.getConnection();
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
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1 as health_check');
      return true;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      console.log('🔌 Single Database connection closed');
    }
  }
}

// Export singleton instance
export const db = SingleDatabaseService.getInstance();

// Database connection utilities
export const connectDatabase = () => db.initialize();
export const queryDatabase = (query: string, params?: Record<string, any>) => db.query(query, params);
export const executeStoredProcedure = (name: string, params?: Record<string, any>) => db.procedure(name, params);
export const executeTransaction = <T>(callback: (transaction: sql.Transaction) => Promise<T>) => db.transaction(callback);
export const checkDatabaseHealth = () => db.healthCheck();
export const closeDatabaseConnection = () => db.close();

export default {
  db,
  databaseConfig,
  connectDatabase,
  queryDatabase,
  executeStoredProcedure,
  executeTransaction,
  checkDatabaseHealth,
  closeDatabaseConnection
};