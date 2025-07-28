/**
 * Workflow Configuration for SmartBizFlow Portal
 * Defines custom business processes and automation workflows
 */

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'action' | 'condition' | 'delay' | 'integration';
  config: Record<string, any>;
  nextSteps: string[];
  conditions?: WorkflowCondition[];
  timeout?: number; // in seconds
  retryCount?: number;
  retryDelay?: number; // in seconds
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
  nextStep: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  module: string;
  trigger: 'manual' | 'automatic' | 'scheduled' | 'webhook';
  triggerConfig: Record<string, any>;
  steps: WorkflowStep[];
  isActive: boolean;
  version: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  currentStep: string;
  data: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  createdBy: string;
  assignedTo?: string;
}

// CRM Workflows
export const crmWorkflows: Record<string, Workflow> = {
  leadApproval: {
    id: 'leadApproval',
    name: 'Lead Approval Workflow',
    description: 'Automated lead approval process with manager review',
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
        config: { 
          action: 'create_lead',
          notifySales: true
        },
        nextSteps: ['validateLead']
      },
      {
        id: 'validateLead',
        name: 'Validate Lead',
        type: 'condition',
        config: { 
          action: 'validate_lead_data'
        },
        conditions: [
          {
            field: 'leadScore',
            operator: 'greater_than',
            value: 70,
            nextStep: 'managerApproval'
          },
          {
            field: 'leadScore',
            operator: 'less_than',
            value: 70,
            nextStep: 'assignToJunior'
          }
        ],
        nextSteps: ['managerApproval', 'assignToJunior']
      },
      {
        id: 'managerApproval',
        name: 'Manager Approval',
        type: 'approval',
        config: { 
          approver: 'manager',
          timeout: 86400, // 24 hours
          autoApprove: false,
          notification: {
            email: true,
            sms: false,
            inApp: true
          }
        },
        nextSteps: ['leadQualified', 'leadRejected'],
        timeout: 86400
      },
      {
        id: 'assignToJunior',
        name: 'Assign to Junior Sales',
        type: 'action',
        config: { 
          action: 'assign_sales_rep',
          role: 'junior_sales'
        },
        nextSteps: ['leadQualified']
      },
      {
        id: 'leadQualified',
        name: 'Lead Qualified',
        type: 'action',
        config: { 
          action: 'qualify_lead',
          updateStatus: 'qualified'
        },
        nextSteps: ['createOpportunity']
      },
      {
        id: 'leadRejected',
        name: 'Lead Rejected',
        type: 'action',
        config: { 
          action: 'reject_lead',
          updateStatus: 'rejected',
          reason: 'manager_rejection'
        },
        nextSteps: []
      },
      {
        id: 'createOpportunity',
        name: 'Create Opportunity',
        type: 'action',
        config: { 
          action: 'create_opportunity',
          source: 'qualified_lead'
        },
        nextSteps: ['sendWelcomeEmail']
      },
      {
        id: 'sendWelcomeEmail',
        name: 'Send Welcome Email',
        type: 'notification',
        config: { 
          template: 'lead_welcome',
          channel: 'email',
          delay: 3600 // 1 hour delay
        },
        nextSteps: []
      }
    ],
    isActive: true,
    version: '1.0.0',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  customerOnboarding: {
    id: 'customerOnboarding',
    name: 'Customer Onboarding Workflow',
    description: 'Automated customer onboarding process',
    module: 'crm',
    trigger: 'automatic',
    triggerConfig: {
      event: 'customer_created'
    },
    steps: [
      {
        id: 'customerCreated',
        name: 'Customer Created',
        type: 'action',
        config: { 
          action: 'create_customer_profile'
        },
        nextSteps: ['sendWelcomeEmail']
      },
      {
        id: 'sendWelcomeEmail',
        name: 'Send Welcome Email',
        type: 'notification',
        config: { 
          template: 'customer_welcome',
          channel: 'email'
        },
        nextSteps: ['assignAccountManager']
      },
      {
        id: 'assignAccountManager',
        name: 'Assign Account Manager',
        type: 'action',
        config: { 
          action: 'assign_account_manager',
          criteria: 'workload_balance'
        },
        nextSteps: ['scheduleOnboardingCall']
      },
      {
        id: 'scheduleOnboardingCall',
        name: 'Schedule Onboarding Call',
        type: 'action',
        config: { 
          action: 'schedule_call',
          duration: 30,
          type: 'onboarding'
        },
        nextSteps: ['sendOnboardingMaterials']
      },
      {
        id: 'sendOnboardingMaterials',
        name: 'Send Onboarding Materials',
        type: 'notification',
        config: { 
          template: 'onboarding_materials',
          channel: 'email',
          attachments: ['user_guide', 'faq', 'contact_info']
        },
        nextSteps: ['followUpCall']
      },
      {
        id: 'followUpCall',
        name: 'Follow-up Call',
        type: 'action',
        config: { 
          action: 'schedule_call',
          duration: 15,
          type: 'follow_up',
          delay: 604800 // 1 week delay
        },
        nextSteps: ['customerOnboarded']
      },
      {
        id: 'customerOnboarded',
        name: 'Customer Onboarded',
        type: 'action',
        config: { 
          action: 'update_customer_status',
          status: 'onboarded'
        },
        nextSteps: []
      }
    ],
    isActive: true,
    version: '1.0.0',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

// HR Workflows
export const hrWorkflows: Record<string, Workflow> = {
  leaveApproval: {
    id: 'leaveApproval',
    name: 'Leave Approval Workflow',
    description: 'Employee leave request approval process',
    module: 'hr',
    trigger: 'manual',
    triggerConfig: {
      event: 'leave_request_submitted'
    },
    steps: [
      {
        id: 'leaveSubmitted',
        name: 'Leave Request Submitted',
        type: 'action',
        config: { 
          action: 'create_leave_request',
          notifyManager: true
        },
        nextSteps: ['checkLeaveBalance']
      },
      {
        id: 'checkLeaveBalance',
        name: 'Check Leave Balance',
        type: 'condition',
        config: { 
          action: 'check_leave_balance'
        },
        conditions: [
          {
            field: 'leaveBalance',
            operator: 'greater_than',
            value: 0,
            nextStep: 'managerApproval'
          },
          {
            field: 'leaveBalance',
            operator: 'less_than',
            value: 0,
            nextStep: 'leaveRejected'
          }
        ],
        nextSteps: ['managerApproval', 'leaveRejected']
      },
      {
        id: 'managerApproval',
        name: 'Manager Approval',
        type: 'approval',
        config: { 
          approver: 'direct_manager',
          timeout: 172800, // 48 hours
          autoApprove: false
        },
        nextSteps: ['leaveApproved', 'leaveRejected'],
        timeout: 172800
      },
      {
        id: 'leaveApproved',
        name: 'Leave Approved',
        type: 'action',
        config: { 
          action: 'approve_leave',
          updateStatus: 'approved',
          deductLeaveBalance: true
        },
        nextSteps: ['notifyEmployee', 'updateCalendar']
      },
      {
        id: 'leaveRejected',
        name: 'Leave Rejected',
        type: 'action',
        config: { 
          action: 'reject_leave',
          updateStatus: 'rejected'
        },
        nextSteps: ['notifyEmployee']
      },
      {
        id: 'notifyEmployee',
        name: 'Notify Employee',
        type: 'notification',
        config: { 
          template: 'leave_status_update',
          channel: 'email'
        },
        nextSteps: []
      },
      {
        id: 'updateCalendar',
        name: 'Update Calendar',
        type: 'action',
        config: { 
          action: 'update_calendar',
          syncWithOutlook: true
        },
        nextSteps: []
      }
    ],
    isActive: true,
    version: '1.0.0',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  employeeOnboarding: {
    id: 'employeeOnboarding',
    name: 'Employee Onboarding Workflow',
    description: 'New employee onboarding process',
    module: 'hr',
    trigger: 'automatic',
    triggerConfig: {
      event: 'employee_hired'
    },
    steps: [
      {
        id: 'employeeHired',
        name: 'Employee Hired',
        type: 'action',
        config: { 
          action: 'create_employee_profile'
        },
        nextSteps: ['sendWelcomeEmail']
      },
      {
        id: 'sendWelcomeEmail',
        name: 'Send Welcome Email',
        type: 'notification',
        config: { 
          template: 'employee_welcome',
          channel: 'email'
        },
        nextSteps: ['createITAccount']
      },
      {
        id: 'createITAccount',
        name: 'Create IT Account',
        type: 'action',
        config: { 
          action: 'create_it_accounts',
          accounts: ['email', 'slack', 'jira', 'git']
        },
        nextSteps: ['assignEquipment']
      },
      {
        id: 'assignEquipment',
        name: 'Assign Equipment',
        type: 'action',
        config: { 
          action: 'assign_equipment',
          equipment: ['laptop', 'monitor', 'keyboard', 'mouse']
        },
        nextSteps: ['scheduleOrientation']
      },
      {
        id: 'scheduleOrientation',
        name: 'Schedule Orientation',
        type: 'action',
        config: { 
          action: 'schedule_orientation',
          duration: 120,
          type: 'new_employee_orientation'
        },
        nextSteps: ['sendOnboardingChecklist']
      },
      {
        id: 'sendOnboardingChecklist',
        name: 'Send Onboarding Checklist',
        type: 'notification',
        config: { 
          template: 'onboarding_checklist',
          channel: 'email'
        },
        nextSteps: ['employeeOnboarded']
      },
      {
        id: 'employeeOnboarded',
        name: 'Employee Onboarded',
        type: 'action',
        config: { 
          action: 'update_employee_status',
          status: 'onboarded'
        },
        nextSteps: []
      }
    ],
    isActive: true,
    version: '1.0.0',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

// ERP Workflows
export const erpWorkflows: Record<string, Workflow> = {
  orderApproval: {
    id: 'orderApproval',
    name: 'Order Approval Workflow',
    description: 'Customer order approval process',
    module: 'erp',
    trigger: 'automatic',
    triggerConfig: {
      event: 'order_created'
    },
    steps: [
      {
        id: 'orderCreated',
        name: 'Order Created',
        type: 'action',
        config: { 
          action: 'create_order',
          notifySales: true
        },
        nextSteps: ['checkInventory']
      },
      {
        id: 'checkInventory',
        name: 'Check Inventory',
        type: 'condition',
        config: { 
          action: 'check_inventory_availability'
        },
        conditions: [
          {
            field: 'inventoryAvailable',
            operator: 'equals',
            value: true,
            nextStep: 'managerApproval'
          },
          {
            field: 'inventoryAvailable',
            operator: 'equals',
            value: false,
            nextStep: 'orderOnHold'
          }
        ],
        nextSteps: ['managerApproval', 'orderOnHold']
      },
      {
        id: 'managerApproval',
        name: 'Manager Approval',
        type: 'approval',
        config: { 
          approver: 'sales_manager',
          timeout: 86400, // 24 hours
          autoApprove: false
        },
        nextSteps: ['orderApproved', 'orderRejected'],
        timeout: 86400
      },
      {
        id: 'orderApproved',
        name: 'Order Approved',
        type: 'action',
        config: { 
          action: 'approve_order',
          updateStatus: 'approved'
        },
        nextSteps: ['allocateInventory', 'createInvoice']
      },
      {
        id: 'orderRejected',
        name: 'Order Rejected',
        type: 'action',
        config: { 
          action: 'reject_order',
          updateStatus: 'rejected'
        },
        nextSteps: ['notifyCustomer']
      },
      {
        id: 'orderOnHold',
        name: 'Order On Hold',
        type: 'action',
        config: { 
          action: 'put_order_on_hold',
          updateStatus: 'on_hold',
          reason: 'inventory_unavailable'
        },
        nextSteps: ['notifyCustomer']
      },
      {
        id: 'allocateInventory',
        name: 'Allocate Inventory',
        type: 'action',
        config: { 
          action: 'allocate_inventory',
          reserveStock: true
        },
        nextSteps: ['createInvoice']
      },
      {
        id: 'createInvoice',
        name: 'Create Invoice',
        type: 'action',
        config: { 
          action: 'create_invoice',
          autoGenerate: true
        },
        nextSteps: ['sendInvoice']
      },
      {
        id: 'sendInvoice',
        name: 'Send Invoice',
        type: 'notification',
        config: { 
          template: 'order_invoice',
          channel: 'email'
        },
        nextSteps: []
      },
      {
        id: 'notifyCustomer',
        name: 'Notify Customer',
        type: 'notification',
        config: { 
          template: 'order_status_update',
          channel: 'email'
        },
        nextSteps: []
      }
    ],
    isActive: true,
    version: '1.0.0',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

// All workflows
export const allWorkflows: Record<string, Workflow> = {
  ...crmWorkflows,
  ...hrWorkflows,
  ...erpWorkflows
};

// Workflow utilities
export const getWorkflow = (workflowId: string): Workflow | undefined => {
  return allWorkflows[workflowId];
};

export const getWorkflowsByModule = (module: string): Workflow[] => {
  return Object.values(allWorkflows).filter(workflow => workflow.module === module);
};

export const getActiveWorkflows = (): Workflow[] => {
  return Object.values(allWorkflows).filter(workflow => workflow.isActive);
};

export const createWorkflow = (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Workflow => {
  const newWorkflow: Workflow = {
    ...workflow,
    id: `workflow_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  allWorkflows[newWorkflow.id] = newWorkflow;
  return newWorkflow;
};

export const updateWorkflow = (workflowId: string, updates: Partial<Workflow>): Workflow | null => {
  const workflow = allWorkflows[workflowId];
  if (!workflow) return null;
  
  const updatedWorkflow: Workflow = {
    ...workflow,
    ...updates,
    updatedAt: new Date()
  };
  
  allWorkflows[workflowId] = updatedWorkflow;
  return updatedWorkflow;
};

export const deleteWorkflow = (workflowId: string): boolean => {
  if (!allWorkflows[workflowId]) return false;
  
  delete allWorkflows[workflowId];
  return true;
};

export default {
  allWorkflows,
  crmWorkflows,
  hrWorkflows,
  erpWorkflows,
  getWorkflow,
  getWorkflowsByModule,
  getActiveWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow
}; 