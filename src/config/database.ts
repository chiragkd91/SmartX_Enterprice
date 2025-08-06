/**
 * Database Configuration for SmartBizFlow
 * Single Database Configuration - Microsoft SQL Server
 * Primary Database: SmartXSolution on SQL Server
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  connectionString: string;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

// Environment variables with fallbacks
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

// Single Database Configuration - SQL Server Only
export const databaseConfig: DatabaseConfig = {
  host: getEnvVar('MSSQL_SERVER', '103.206.57.30'),
  port: parseInt(getEnvVar('MSSQL_PORT', '1201')),
  database: getEnvVar('MSSQL_DATABASE', 'SmartXSolution'),
  username: getEnvVar('MSSQL_USER', 'sa'),
  password: getEnvVar('MSSQL_PASSWORD', 'Password@123'),
  ssl: false, // SQL Server with trust certificate
  connectionString: getEnvVar(
    'DATABASE_URL', 
    'sqlserver://103.206.57.30:1201;database=SmartXSolution;user=sa;password=Password@123;trustServerCertificate=true;encrypt=false'
  ),
};

// API configuration
export const apiConfig: ApiConfig = {
  baseUrl: getEnvVar('REACT_APP_API_BASE_URL', 'http://localhost:5000'),
  timeout: parseInt(getEnvVar('API_TIMEOUT', '30000')),
  retryAttempts: parseInt(getEnvVar('API_RETRY_ATTEMPTS', '3')),
  retryDelay: parseInt(getEnvVar('API_RETRY_DELAY', '1000')),
};

// Application configuration
export const appConfig = {
  name: getEnvVar('APP_NAME', 'HR Management System'),
  version: getEnvVar('APP_VERSION', '1.0.0'),
  environment: getEnvVar('NODE_ENV', 'development'),
  port: parseInt(getEnvVar('PORT', '3000')),
};

// Database table names (matching your schema)
export const tableNames = {
  departments: 'departments',
  roles: 'roles',
  employees: 'employees',
  onboarding_processes: 'onboarding_processes',
  onboarding_tasks: 'onboarding_tasks',
  offboarding_processes: 'offboarding_processes',
  it_assets: 'it_assets',
  software_licenses: 'software_licenses',
  support_tickets: 'support_tickets',
  system_environments: 'system_environments',
  system_deployments: 'system_deployments',
  access_requests: 'access_requests',
  notifications: 'notifications',
  audit_logs: 'audit_logs',
};

// Security configuration
export const securityConfig = {
  jwtSecret: getEnvVar('JWT_SECRET', 'your-super-secret-jwt-key'),
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
  bcryptRounds: parseInt(getEnvVar('BCRYPT_ROUNDS', '12')),
  sessionSecret: getEnvVar('SESSION_SECRET', 'your-session-secret'),
};

// Feature flags based on your schema
export const featureFlags = {
  enableOnboarding: true,
  enableOffboarding: true,
  enableAssetManagement: true,
  enableSoftwareLicenses: true,
  enableSupportTickets: true,
  enableSystemDeployments: true,
  enableAccessRequests: true,
  enableNotifications: true,
  enableAuditLogging: true,
};

export default {
  database: databaseConfig,
  api: apiConfig,
  app: appConfig,
  tables: tableNames,
  security: securityConfig,
  features: featureFlags,
};
