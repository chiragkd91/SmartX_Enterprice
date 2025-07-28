/**
 * Module Configuration for SmartBizFlow Portal
 * Centralized module management for feature enablement and customization
 */

export interface ModuleFeature {
  enabled: boolean;
  config?: Record<string, any>;
}

export interface ModuleConfig {
  enabled: boolean;
  features: Record<string, ModuleFeature>;
  customFields?: Record<string, string[]>;
  workflows?: Record<string, boolean>;
  integrations?: Record<string, any>;
  permissions?: string[];
}

export interface PortalModules {
  dashboard: ModuleConfig;
  crm: ModuleConfig;
  erp: ModuleConfig;
  hr: ModuleConfig;
  itAssets: ModuleConfig;
  gst: ModuleConfig;
  businessIntelligence: ModuleConfig;
  automation: ModuleConfig;
  fileManagement: ModuleConfig;
  userManagement: ModuleConfig;
  reports: ModuleConfig;
  settings: ModuleConfig;
}

// CRM Module Configuration
export const crmConfig: ModuleConfig = {
  enabled: true,
  features: {
    leadManagement: { enabled: true },
    customerProfiles: { enabled: true },
    salesPipeline: { enabled: true },
    indianCompliance: { enabled: true },
    advancedAnalytics: { enabled: true },
    emailIntegration: { enabled: true },
    mobileApp: { enabled: false },
    opportunityTracking: { enabled: true },
    followUpReminders: { enabled: true },
    documentManagement: { enabled: true }
  },
  customFields: {
    customer: ['gstNumber', 'panNumber', 'aadhaarNumber', 'companyType', 'industry'],
    lead: ['source', 'priority', 'assignedTo', 'expectedValue', 'leadScore'],
    opportunity: ['value', 'probability', 'closeDate', 'stage', 'competitor']
  },
  workflows: {
    leadToCustomer: true,
    opportunityTracking: true,
    followUpReminders: true,
    approvalProcess: true
  },
  integrations: {
    email: 'smtp',
    calendar: 'google',
    crm: 'salesforce'
  },
  permissions: ['crm.read', 'crm.write', 'crm.delete', 'crm.admin']
};

// ERP Module Configuration
export const erpConfig: ModuleConfig = {
  enabled: true,
  features: {
    inventoryManagement: { enabled: true },
    orderProcessing: { enabled: true },
    invoiceGeneration: { enabled: true },
    vendorManagement: { enabled: true },
    purchaseOrders: { enabled: true },
    gstCompliance: { enabled: true },
    multiCurrency: { enabled: false },
    barcodeScanning: { enabled: false },
    warehouseManagement: { enabled: true },
    costCenterManagement: { enabled: true },
    projectManagement: { enabled: false }
  },
  customFields: {
    product: ['hsnCode', 'gstRate', 'category', 'brand', 'supplier'],
    order: ['paymentTerms', 'deliveryDate', 'status', 'priority'],
    invoice: ['gstAmount', 'cgst', 'sgst', 'igst', 'placeOfSupply']
  },
  workflows: {
    orderApproval: true,
    invoiceApproval: true,
    purchaseApproval: true,
    inventoryAlerts: true
  },
  integrations: {
    paymentGateway: 'razorpay',
    accounting: 'tally',
    shipping: 'delhivery',
    banking: 'razorpay'
  },
  permissions: ['erp.read', 'erp.write', 'erp.delete', 'erp.admin']
};

// HR Module Configuration
export const hrConfig: ModuleConfig = {
  enabled: true,
  features: {
    employeeManagement: { enabled: true },
    attendanceTracking: { enabled: true },
    leaveManagement: { enabled: true },
    payrollProcessing: { enabled: true },
    performanceReviews: { enabled: true },
    recruitment: { enabled: true },
    training: { enabled: true },
    selfService: { enabled: true },
    onboarding: { enabled: true },
    offboarding: { enabled: true },
    benefits: { enabled: true },
    workflowAutomation: { enabled: true },
    securityManagement: { enabled: true },
    timeTracking: { enabled: true },
    expenseManagement: { enabled: false }
  },
  customFields: {
    employee: ['aadhaarNumber', 'panNumber', 'uanNumber', 'pfNumber', 'esiNumber'],
    attendance: ['checkIn', 'checkOut', 'location', 'device', 'overtime'],
    leave: ['leaveType', 'approvalStatus', 'balance', 'reason', 'attachment']
  },
  workflows: {
    leaveApproval: true,
    expenseApproval: true,
    performanceReview: true,
    recruitmentProcess: true,
    onboardingProcess: true
  },
  integrations: {
    payroll: 'local',
    attendance: 'biometric',
    email: 'smtp',
    sms: 'twilio'
  },
  permissions: ['hr.read', 'hr.write', 'hr.delete', 'hr.admin']
};

// IT Asset Module Configuration
export const itAssetConfig: ModuleConfig = {
  enabled: true,
  features: {
    assetManagement: { enabled: true },
    assetTracking: { enabled: true },
    maintenanceScheduling: { enabled: true },
    softwareLicenses: { enabled: true },
    inventoryManagement: { enabled: true },
    systemManagement: { enabled: true },
    accessControl: { enabled: true },
    supportTickets: { enabled: true },
    reporting: { enabled: true },
    vendorManagement: { enabled: true },
    costTracking: { enabled: true },
    complianceManagement: { enabled: true }
  },
  customFields: {
    asset: ['serialNumber', 'model', 'warranty', 'location', 'assignedTo'],
    software: ['licenseKey', 'expiryDate', 'vendor', 'version', 'users'],
    maintenance: ['schedule', 'technician', 'cost', 'status', 'notes']
  },
  workflows: {
    assetRequest: true,
    maintenanceRequest: true,
    licenseRenewal: true,
    supportTicket: true
  },
  integrations: {
    monitoring: 'nagios',
    ticketing: 'jira',
    backup: 'local'
  },
  permissions: ['assets.read', 'assets.write', 'assets.delete', 'assets.admin']
};

// GST Module Configuration
export const gstConfig: ModuleConfig = {
  enabled: true,
  features: {
    gstInvoice: { enabled: true },
    gstReturns: { enabled: true },
    hsnCodeManagement: { enabled: true },
    gstRateManagement: { enabled: true },
    complianceReporting: { enabled: true },
    eWayBill: { enabled: false },
    tdsManagement: { enabled: true },
    tcsManagement: { enabled: true }
  },
  customFields: {
    invoice: ['gstin', 'placeOfSupply', 'reverseCharge', 'eCommerce'],
    product: ['hsnCode', 'gstRate', 'exempted', 'nilRated']
  },
  workflows: {
    gstReturnFiling: true,
    tdsDeduction: true,
    tcsCollection: true
  },
  integrations: {
    gstPortal: 'api',
    accounting: 'tally',
    banking: 'razorpay'
  },
  permissions: ['gst.read', 'gst.write', 'gst.admin']
};

// Business Intelligence Module Configuration
export const businessIntelligenceConfig: ModuleConfig = {
  enabled: true,
  features: {
    realTimeKPIDashboard: { enabled: true },
    predictiveAnalytics: { enabled: true },
    customReportBuilder: { enabled: true },
    dataVisualization: { enabled: true },
    automatedReporting: { enabled: true },
    dataExport: { enabled: true },
    scheduledReports: { enabled: true },
    mobileDashboards: { enabled: false }
  },
  customFields: {},
  workflows: {
    reportGeneration: true,
    alertNotifications: true,
    dataRefresh: true
  },
  integrations: {
    analytics: 'google',
    reporting: 'powerbi'
  },
  permissions: ['bi.read', 'bi.write', 'bi.admin']
};

// Automation Module Configuration
export const automationConfig: ModuleConfig = {
  enabled: true,
  features: {
    workflowAutomation: { enabled: true },
    emailAutomation: { enabled: true },
    taskAutomation: { enabled: true },
    approvalWorkflows: { enabled: true },
    notificationSystem: { enabled: true },
    integrationAutomation: { enabled: true },
    scheduledTasks: { enabled: true },
    aiAssistedAutomation: { enabled: false }
  },
  customFields: {},
  workflows: {
    approvalProcess: true,
    notificationProcess: true,
    dataSyncProcess: true
  },
  integrations: {
    email: 'smtp',
    sms: 'twilio',
    slack: 'webhook'
  },
  permissions: ['automation.read', 'automation.write', 'automation.admin']
};

// File Management Module Configuration
export const fileManagementConfig: ModuleConfig = {
  enabled: true,
  features: {
    documentStorage: { enabled: true },
    fileSharing: { enabled: true },
    versionControl: { enabled: true },
    accessControl: { enabled: true },
    searchAndFilter: { enabled: true },
    backupAndRecovery: { enabled: true },
    cloudSync: { enabled: false },
    collaboration: { enabled: true }
  },
  customFields: {},
  workflows: {
    fileApproval: true,
    accessRequest: true,
    backupProcess: true
  },
  integrations: {
    storage: 'local',
    cloud: 'aws'
  },
  permissions: ['files.read', 'files.write', 'files.delete', 'files.admin']
};

// User Management Module Configuration
export const userManagementConfig: ModuleConfig = {
  enabled: true,
  features: {
    userRegistration: { enabled: true },
    roleManagement: { enabled: true },
    permissionManagement: { enabled: true },
    groupManagement: { enabled: true },
    auditLogging: { enabled: true },
    twoFactorAuth: { enabled: true },
    ssoIntegration: { enabled: false },
    passwordPolicy: { enabled: true }
  },
  customFields: {},
  workflows: {
    userApproval: true,
    roleAssignment: true,
    accessReview: true
  },
  integrations: {
    ldap: false,
    oauth: 'google'
  },
  permissions: ['users.read', 'users.write', 'users.delete', 'users.admin']
};

// Dashboard Module Configuration
export const dashboardConfig: ModuleConfig = {
  enabled: true,
  features: {
    kpiWidgets: { enabled: true },
    chartWidgets: { enabled: true },
    tableWidgets: { enabled: true },
    notificationWidgets: { enabled: true },
    customWidgets: { enabled: true },
    realTimeUpdates: { enabled: true },
    mobileResponsive: { enabled: true },
    userCustomization: { enabled: true }
  },
  customFields: {},
  workflows: {
    widgetRefresh: true,
    dataUpdate: true
  },
  integrations: {},
  permissions: ['dashboard.read', 'dashboard.customize']
};

// Reports Module Configuration
export const reportsConfig: ModuleConfig = {
  enabled: true,
  features: {
    standardReports: { enabled: true },
    customReports: { enabled: true },
    scheduledReports: { enabled: true },
    exportFormats: { enabled: true },
    reportTemplates: { enabled: true },
    dataDrillDown: { enabled: true },
    comparativeAnalysis: { enabled: true },
    reportSharing: { enabled: true }
  },
  customFields: {},
  workflows: {
    reportGeneration: true,
    reportDistribution: true
  },
  integrations: {
    export: ['pdf', 'excel', 'csv']
  },
  permissions: ['reports.read', 'reports.write', 'reports.admin']
};

// Settings Module Configuration
export const settingsConfig: ModuleConfig = {
  enabled: true,
  features: {
    systemSettings: { enabled: true },
    userPreferences: { enabled: true },
    notificationSettings: { enabled: true },
    securitySettings: { enabled: true },
    backupSettings: { enabled: true },
    integrationSettings: { enabled: true },
    themeSettings: { enabled: true },
    languageSettings: { enabled: true }
  },
  customFields: {},
  workflows: {
    settingsUpdate: true,
    backupProcess: true
  },
  integrations: {},
  permissions: ['settings.read', 'settings.write', 'settings.admin']
};

// Complete Portal Modules Configuration
export const portalModules: PortalModules = {
  dashboard: dashboardConfig,
  crm: crmConfig,
  erp: erpConfig,
  hr: hrConfig,
  itAssets: itAssetConfig,
  gst: gstConfig,
  businessIntelligence: businessIntelligenceConfig,
  automation: automationConfig,
  fileManagement: fileManagementConfig,
  userManagement: userManagementConfig,
  reports: reportsConfig,
  settings: settingsConfig
};

// Environment-based module configuration
export const getModuleConfig = (moduleName: keyof PortalModules): ModuleConfig => {
  const envKey = `VITE_ENABLE_${moduleName.toUpperCase()}`;
  const isEnabled = import.meta.env[envKey] !== 'false';
  
  return {
    ...portalModules[moduleName],
    enabled: isEnabled
  };
};

// Get all enabled modules
export const getEnabledModules = (): Record<string, ModuleConfig> => {
  const enabled: Record<string, ModuleConfig> = {};
  
  Object.entries(portalModules).forEach(([name, config]) => {
    if (getModuleConfig(name as keyof PortalModules).enabled) {
      enabled[name] = config;
    }
  });
  
  return enabled;
};

// Check if a specific feature is enabled
export const isFeatureEnabled = (moduleName: keyof PortalModules, featureName: string): boolean => {
  const moduleConfig = getModuleConfig(moduleName);
  return moduleConfig.enabled && moduleConfig.features[featureName]?.enabled === true;
};

// Get custom fields for a module
export const getCustomFields = (moduleName: keyof PortalModules): Record<string, string[]> => {
  const moduleConfig = getModuleConfig(moduleName);
  return moduleConfig.customFields || {};
};

// Get workflows for a module
export const getWorkflows = (moduleName: keyof PortalModules): Record<string, boolean> => {
  const moduleConfig = getModuleConfig(moduleName);
  return moduleConfig.workflows || {};
};

// Get integrations for a module
export const getIntegrations = (moduleName: keyof PortalModules): Record<string, any> => {
  const moduleConfig = getModuleConfig(moduleName);
  return moduleConfig.integrations || {};
};

export default {
  portalModules,
  getModuleConfig,
  getEnabledModules,
  isFeatureEnabled,
  getCustomFields,
  getWorkflows,
  getIntegrations
}; 