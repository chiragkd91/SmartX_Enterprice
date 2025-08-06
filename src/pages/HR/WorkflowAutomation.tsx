/**
 * Workflow Automation System - Complete process automation platform
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { 
  Zap, 
  Workflow, 
  Settings, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  Circle,
  Square,
  Diamond,
  Hexagon,
  Star,
  Target,
  FileText,
  Mail,
  Bell,
  UserCheck,
  UserX,
  Shield,
  Key,
  Lock,
  Unlock,
  Database,
  Server,
  Globe,
  Wifi,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'Approval' | 'Notification' | 'Data Processing' | 'Integration' | 'Custom';
  status: 'Active' | 'Inactive' | 'Draft' | 'Testing';
  trigger: string;
  steps: WorkflowStep[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  executionCount: number;
  successRate: number;
  avgExecutionTime: number;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'Action' | 'Condition' | 'Approval' | 'Notification' | 'Integration' | 'Delay';
  order: number;
  config: any;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed' | 'Skipped';
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'Running' | 'Completed' | 'Failed' | 'Paused' | 'Cancelled';
  startedAt: string;
  completedAt?: string;
  duration: number;
  steps: WorkflowStepExecution[];
  data: any;
  error?: string;
}

interface WorkflowStepExecution {
  id: string;
  stepId: string;
  stepName: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed' | 'Skipped';
  startedAt: string;
  completedAt?: string;
  duration: number;
  result?: any;
  error?: string;
}

interface CustomForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  workflow: string;
  status: 'Active' | 'Inactive' | 'Draft';
  createdBy: string;
  createdAt: string;
  submissions: number;
}

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: any;
  order: number;
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Leave Request Approval',
    description: 'Automated leave request approval workflow with manager escalation',
    type: 'Approval',
    status: 'Active',
    trigger: 'Leave Request Submitted',
    steps: [
      {
        id: '1-1',
        name: 'Validate Request',
        type: 'Action',
        order: 1,
        config: { action: 'validate_leave_request' },
        status: 'Completed'
      },
      {
        id: '1-2',
        name: 'Manager Approval',
        type: 'Approval',
        order: 2,
        config: { approver: 'direct_manager', timeout: '24h' },
        status: 'Completed',
        assignedTo: 'Manager A',
        completedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '1-3',
        name: 'HR Review',
        type: 'Approval',
        order: 3,
        config: { approver: 'hr_manager', timeout: '48h' },
        status: 'In Progress',
        assignedTo: 'HR Manager'
      },
      {
        id: '1-4',
        name: 'Send Notification',
        type: 'Notification',
        order: 4,
        config: { type: 'email', template: 'leave_approved' },
        status: 'Pending'
      }
    ],
    createdBy: 'Admin User',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    executionCount: 156,
    successRate: 94.2,
    avgExecutionTime: 2.5
  },
  {
    id: '2',
    name: 'Employee Onboarding',
    description: 'Complete employee onboarding process automation',
    type: 'Custom',
    status: 'Active',
    trigger: 'New Employee Created',
    steps: [
      {
        id: '2-1',
        name: 'Send Welcome Email',
        type: 'Notification',
        order: 1,
        config: { type: 'email', template: 'welcome_email' },
        status: 'Completed'
      },
      {
        id: '2-2',
        name: 'Create IT Accounts',
        type: 'Integration',
        order: 2,
        config: { system: 'active_directory', action: 'create_user' },
        status: 'Completed'
      },
      {
        id: '2-3',
        name: 'Assign Equipment',
        type: 'Action',
        order: 3,
        config: { action: 'assign_equipment' },
        status: 'In Progress'
      },
      {
        id: '2-4',
        name: 'Schedule Training',
        type: 'Action',
        order: 4,
        config: { action: 'schedule_training' },
        status: 'Pending'
      }
    ],
    createdBy: 'HR Manager',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    executionCount: 23,
    successRate: 87.0,
    avgExecutionTime: 8.2
  }
];

const mockExecutions: WorkflowExecution[] = [
  {
    id: '1',
    workflowId: '1',
    workflowName: 'Leave Request Approval',
    status: 'Running',
    startedAt: '2024-01-20T09:00:00Z',
    duration: 1.5,
    steps: [
      {
        id: '1-1',
        stepId: '1-1',
        stepName: 'Validate Request',
        status: 'Completed',
        startedAt: '2024-01-20T09:00:00Z',
        completedAt: '2024-01-20T09:00:05Z',
        duration: 5
      },
      {
        id: '1-2',
        stepId: '1-2',
        stepName: 'Manager Approval',
        status: 'In Progress',
        startedAt: '2024-01-20T09:00:05Z',
        duration: 85
      }
    ],
    data: { employeeId: 'GCI001', leaveType: 'Annual', days: 5 }
  }
];

const mockForms: CustomForm[] = [
  {
    id: '1',
    name: 'Leave Request Form',
    description: 'Standard leave request form with approval workflow',
    fields: [
      {
        id: '1-1',
        name: 'employee_name',
        type: 'text',
        label: 'Employee Name',
        required: true,
        order: 1
      },
      {
        id: '1-2',
        name: 'leave_type',
        type: 'select',
        label: 'Leave Type',
        required: true,
        options: ['Annual', 'Sick', 'Personal', 'Maternity', 'Paternity'],
        order: 2
      },
      {
        id: '1-3',
        name: 'start_date',
        type: 'date',
        label: 'Start Date',
        required: true,
        order: 3
      },
      {
        id: '1-4',
        name: 'end_date',
        type: 'date',
        label: 'End Date',
        required: true,
        order: 4
      },
      {
        id: '1-5',
        name: 'reason',
        type: 'textarea',
        label: 'Reason for Leave',
        required: true,
        order: 5
      }
    ],
    workflow: '1',
    status: 'Active',
    createdBy: 'HR Manager',
    createdAt: '2024-01-01T00:00:00Z',
    submissions: 45
  }
];

export default function WorkflowAutomation() {
  const [activeTab, setActiveTab] = useState('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Inactive': return 'text-gray-600 bg-gray-50';
      case 'Draft': return 'text-yellow-600 bg-yellow-50';
      case 'Testing': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getExecutionStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return 'text-blue-600 bg-blue-50';
      case 'Completed': return 'text-green-600 bg-green-50';
      case 'Failed': return 'text-red-600 bg-red-50';
      case 'Paused': return 'text-yellow-600 bg-yellow-50';
      case 'Cancelled': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Approval': return 'text-purple-600 bg-purple-50';
      case 'Notification': return 'text-blue-600 bg-blue-50';
      case 'Data Processing': return 'text-green-600 bg-green-50';
      case 'Integration': return 'text-orange-600 bg-orange-50';
      case 'Custom': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const workflowMetrics = {
    totalWorkflows: mockWorkflows.length,
    activeWorkflows: mockWorkflows.filter(w => w.status === 'Active').length,
    totalExecutions: mockWorkflows.reduce((sum, w) => sum + w.executionCount, 0),
    avgSuccessRate: mockWorkflows.reduce((sum, w) => sum + w.successRate, 0) / mockWorkflows.length,
    runningExecutions: mockExecutions.filter(e => e.status === 'Running').length,
    totalForms: mockForms.length
  };

  const executionData = [
    { month: 'Jan', executions: 45, success: 42, failed: 3 },
    { month: 'Feb', executions: 52, success: 49, failed: 3 },
    { month: 'Mar', executions: 48, success: 45, failed: 3 },
    { month: 'Apr', executions: 61, success: 58, failed: 3 },
    { month: 'May', executions: 59, success: 56, failed: 3 },
    { month: 'Jun', executions: 68, success: 65, failed: 3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Automation</h1>
          <p className="text-gray-600">Design, manage, and monitor automated business processes</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowWorkflowBuilder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
          <Button onClick={() => setShowFormBuilder(true)} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Form Builder
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowMetrics.totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">Active workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowMetrics.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">Process executions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowMetrics.avgSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowMetrics.runningExecutions}</div>
            <p className="text-xs text-muted-foreground">Active executions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Executions</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="builder">Visual Builder</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Definitions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Executions</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">{workflow.name}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(workflow.type)}>{workflow.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                      </TableCell>
                      <TableCell>{workflow.trigger}</TableCell>
                      <TableCell>{workflow.executionCount}</TableCell>
                      <TableCell>{workflow.successRate}%</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Executions Tab */}
        <TabsContent value="executions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockExecutions.map((execution) => (
                    <TableRow key={execution.id}>
                      <TableCell className="font-medium">{execution.workflowName}</TableCell>
                      <TableCell>
                        <Badge className={getExecutionStatusColor(execution.status)}>{execution.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(execution.startedAt).toLocaleString()}</TableCell>
                      <TableCell>{execution.duration.toFixed(1)}s</TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(execution.steps.filter(s => s.status === 'Completed').length / execution.steps.length) * 100}%` }}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {execution.status === 'Running' && (
                            <Button variant="ghost" size="sm">
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.name}</TableCell>
                      <TableCell>{form.description}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(form.status)}>{form.status}</Badge>
                      </TableCell>
                      <TableCell>{form.fields.length}</TableCell>
                      <TableCell>{form.submissions}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Builder Tab */}
        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Workflow Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Workflow className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Designer</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop components to create automated workflows
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setShowWorkflowBuilder(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Workflow
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Workflow
                  </Button>
                </div>
              </div>

              {/* Component Palette */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Available Components</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Circle className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-medium">Start</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Square className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <p className="text-sm font-medium">Action</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Diamond className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                    <p className="text-sm font-medium">Condition</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Hexagon className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <p className="text-sm font-medium">Approval</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Mail className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-medium">Notification</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Globe className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                    <p className="text-sm font-medium">Integration</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Clock className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                    <p className="text-sm font-medium">Delay</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Star className="w-8 h-8 mx-auto text-red-600 mb-2" />
                    <p className="text-sm font-medium">End</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Execution Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Execution Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={executionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="executions" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Success Rate Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Success Rate Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={executionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="success" fill="#10B981" />
                    <Bar dataKey="failed" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWorkflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Workflow className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-gray-600">{workflow.executionCount} executions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{workflow.successRate}%</p>
                      <p className="text-sm text-gray-600">{workflow.avgExecutionTime}s avg</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Workflow Builder Dialog */}
      <Dialog open={showWorkflowBuilder} onOpenChange={setShowWorkflowBuilder}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Workflow Builder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Workflow Name</Label>
                <Input placeholder="Enter workflow name" />
              </div>
              <div>
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approval">Approval</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="data_processing">Data Processing</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe the workflow..." />
            </div>
            <div>
              <Label>Trigger</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="form_submission">Form Submission</SelectItem>
                  <SelectItem value="data_change">Data Change</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Workflow Canvas */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[400px]">
              <p className="text-gray-600">Drag and drop components here to build your workflow</p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowWorkflowBuilder(false)}>
                Cancel
              </Button>
              <Button>Save Workflow</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Builder Dialog */}
      <Dialog open={showFormBuilder} onOpenChange={setShowFormBuilder}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Form Builder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Form Name</Label>
                <Input placeholder="Enter form name" />
              </div>
              <div>
                <Label>Workflow</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWorkflows.map((workflow) => (
                      <SelectItem key={workflow.id} value={workflow.id}>{workflow.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe the form..." />
            </div>
            
            {/* Form Canvas */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[400px]">
              <p className="text-gray-600">Drag and drop form fields here to build your form</p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowFormBuilder(false)}>
                Cancel
              </Button>
              <Button>Save Form</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 