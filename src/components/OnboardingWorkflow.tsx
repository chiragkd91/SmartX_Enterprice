/**
 * Comprehensive Onboarding Workflow - Complete 10-Step Process
 * Following HR best practices for employee onboarding
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  FileText,
  UserCheck,
  Database,
  Shield,
  Key,
  BookOpen,
  Calendar,
  GraduationCap,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  Eye,
  Settings,
  Award,
  Laptop,
  Phone,
  CreditCard,
  Send,
  Video,
  MapPin,
  Target,
  TrendingUp
} from 'lucide-react';

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  dueDate: string;
  assignedTo: string;
  dependencies: number[];
  substeps: SubStep[];
  isOptional?: boolean;
}

export interface SubStep {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  description?: string;
  dueDate?: string;
}

export interface OnboardingProcess {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  startDate: string;
  currentStep: number;
  overallProgress: number;
  steps: OnboardingStep[];
  createdAt: string;
  estimatedCompletion: string;
}

const initialOnboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Offer & Acceptance",
    description: "Generate and process offer letter with candidate acceptance",
    icon: FileText,
    status: 'pending',
    progress: 0,
    dueDate: '2024-01-15',
    assignedTo: 'HR Team',
    dependencies: [],
    substeps: [
      { id: '1a', title: 'Generate offer letter from HRMS', status: 'pending' },
      { id: '1b', title: 'Send offer to candidate', status: 'pending' },
      { id: '1c', title: 'Candidate acceptance (e-signature/upload)', status: 'pending' },
      { id: '1d', title: 'Store signed offer in system', status: 'pending' }
    ]
  },
  {
    id: 2,
    title: "Pre-Onboarding Data Collection",
    description: "Collect comprehensive employee information via secure portal",
    icon: Database,
    status: 'pending',
    progress: 0,
    dueDate: '2024-01-20',
    assignedTo: 'Employee/HR',
    dependencies: [1],
    substeps: [
      { id: '2a', title: 'Send secure portal access link', status: 'pending' },
      { id: '2b', title: 'Personal information collection', status: 'pending' },
      { id: '2c', title: 'Educational & experience details', status: 'pending' },
      { id: '2d', title: 'Banking & tax information', status: 'pending' },
      { id: '2e', title: 'Dependent information', status: 'pending' },
      { id: '2f', title: 'Document uploads (ID, certificates, resume)', status: 'pending' }
    ]
  },
  {
    id: 3,
    title: "Document Verification",
    description: "HR verification of uploaded documents and information",
    icon: Eye,
    status: 'pending',
    progress: 0,
    dueDate: '2024-01-22',
    assignedTo: 'HR Verification Team',
    dependencies: [2],
    substeps: [
      { id: '3a', title: 'Verify ID proof documents', status: 'pending' },
      { id: '3b', title: 'Verify educational certificates', status: 'pending' },
      { id: '3c', title: 'Verify experience certificates', status: 'pending' },
      { id: '3d', title: 'Flag missing or invalid entries', status: 'pending' },
      { id: '3e', title: 'Request corrections if needed', status: 'pending' }
    ]
  },
  {
    id: 4,
    title: "Background Verification",
    description: "Optional third-party background check integration",
    icon: Shield,
    status: 'pending',
    progress: 0,
    dueDate: '2024-01-30',
    assignedTo: 'BGV Agency',
    dependencies: [3],
    isOptional: true,
    substeps: [
      { id: '4a', title: 'Initiate BGV with third-party service', status: 'pending' },
      { id: '4b', title: 'Track BGV progress in HRMS', status: 'pending' },
      { id: '4c', title: 'Review BGV results', status: 'pending' },
      { id: '4d', title: 'BGV clearance confirmation', status: 'pending' }
    ]
  },
  {
    id: 5,
    title: "System Account & ID Creation",
    description: "Automatic generation of employee accounts and system access",
    icon: Key,
    status: 'pending',
    progress: 0,
    dueDate: '2024-02-01',
    assignedTo: 'IT Team',
    dependencies: [3],
    substeps: [
      { id: '5a', title: 'Generate unique Employee ID', status: 'pending' },
      { id: '5b', title: 'Create corporate email ID', status: 'pending' },
      { id: '5c', title: 'Setup ERP system access', status: 'pending' },
      { id: '5d', title: 'Setup CRM system access', status: 'pending' },
      { id: '5e', title: 'Configure IT asset access', status: 'pending' }
    ]
  },
  {
    id: 6,
    title: "Policy Acknowledgement",
    description: "Review and acknowledge company policies and procedures",
    icon: BookOpen,
    status: 'pending',
    progress: 0,
    dueDate: '2024-02-03',
    assignedTo: 'Employee/HR',
    dependencies: [5],
    substeps: [
      { id: '6a', title: 'Code of conduct review & acknowledgement', status: 'pending' },
      { id: '6b', title: 'Leave policies acknowledgement', status: 'pending' },
      { id: '6c', title: 'HR manual review', status: 'pending' },
      { id: '6d', title: 'IT usage policy acknowledgement', status: 'pending' },
      { id: '6e', title: 'Store policy acknowledgements', status: 'pending' }
    ]
  },
  {
    id: 7,
    title: "Induction & Orientation",
    description: "Schedule and conduct orientation sessions",
    icon: Video,
    status: 'pending',
    progress: 0,
    dueDate: '2024-02-05',
    assignedTo: 'HR/Manager',
    dependencies: [6],
    substeps: [
      { id: '7a', title: 'Schedule induction sessions via HRMS', status: 'pending' },
      { id: '7b', title: 'Send calendar invites', status: 'pending' },
      { id: '7c', title: 'Conduct orientation sessions', status: 'pending' },
      { id: '7d', title: 'Collect feedback forms', status: 'pending' },
      { id: '7e', title: 'Company culture introduction', status: 'pending' }
    ]
  },
  {
    id: 8,
    title: "Training Assignment",
    description: "Role-based training assignment and LMS integration",
    icon: GraduationCap,
    status: 'pending',
    progress: 0,
    dueDate: '2024-02-10',
    assignedTo: 'Training Team',
    dependencies: [7],
    substeps: [
      { id: '8a', title: 'Identify role-specific training requirements', status: 'pending' },
      { id: '8b', title: 'Assign required trainings in LMS', status: 'pending' },
      { id: '8c', title: 'Schedule training sessions', status: 'pending' },
      { id: '8d', title: 'Track training progress', status: 'pending' },
      { id: '8e', title: 'Training completion certification', status: 'pending' }
    ]
  },
  {
    id: 9,
    title: "Manager Assignment & Team Mapping",
    description: "Assign reporting manager and map to team structure",
    icon: Users,
    status: 'pending',
    progress: 0,
    dueDate: '2024-02-05',
    assignedTo: 'HR/Department Head',
    dependencies: [5],
    substeps: [
      { id: '9a', title: 'Assign reporting manager in HRMS', status: 'pending' },
      { id: '9b', title: 'Map employee to team structure', status: 'pending' },
      { id: '9c', title: 'Map to department hierarchy', status: 'pending' },
      { id: '9d', title: 'Assign work location', status: 'pending' },
      { id: '9e', title: 'Setup team communication channels', status: 'pending' }
    ]
  },
  {
    id: 10,
    title: "Probation & Confirmation Setup",
    description: "Setup probation tracking and confirmation process",
    icon: Target,
    status: 'pending',
    progress: 0,
    dueDate: '2024-02-01',
    assignedTo: 'HR/Manager',
    dependencies: [9],
    substeps: [
      { id: '10a', title: 'Set probation period (3-6 months)', status: 'pending' },
      { id: '10b', title: 'Setup performance review cycle', status: 'pending' },
      { id: '10c', title: 'Configure confirmation process tasks', status: 'pending' },
      { id: '10d', title: 'Schedule probation review meetings', status: 'pending' },
      { id: '10e', title: 'Setup auto-confirmation triggers', status: 'pending' }
    ]
  }
];

// Optional Add-ons
const optionalModules = [
  {
    id: 'asset',
    title: 'Asset Allocation Module',
    description: 'Laptop, Phone, Access Card assignment',
    icon: Laptop,
    enabled: false
  },
  {
    id: 'esignature',
    title: 'E-signature Integration',
    description: 'DocuSign, AdobeSign integration',
    icon: FileText,
    enabled: false
  },
  {
    id: 'itticket',
    title: 'IT Helpdesk Ticket',
    description: 'Automatic IT support ticket creation',
    icon: Settings,
    enabled: false
  },
  {
    id: 'welcomekit',
    title: 'Welcome Kit Automation',
    description: 'Logistics trigger for welcome package',
    icon: Award,
    enabled: false
  }
];

interface OnboardingWorkflowProps {
  process: OnboardingProcess;
  onUpdateStep: (stepId: number, updates: Partial<OnboardingStep>) => void;
  onUpdateSubstep: (stepId: number, substepId: string, completed: boolean) => void;
}

const OnboardingWorkflow: React.FC<OnboardingWorkflowProps> = ({
  process,
  onUpdateStep,
  onUpdateSubstep
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [showOptionalModules, setShowOptionalModules] = useState(false);

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4 opacity-50" />;
    }
  };

  const selectedStepData = process.steps.find(step => step.id === selectedStep);

  const handleSubstepToggle = (substepId: string, completed: boolean) => {
    onUpdateSubstep(selectedStep, substepId, completed);
  };

  const completedSubsteps = selectedStepData?.substeps.filter(sub => sub.status === 'completed').length || 0;
  const totalSubsteps = selectedStepData?.substeps.length || 0;
  const stepProgress = totalSubsteps > 0 ? (completedSubsteps / totalSubsteps) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{process.employeeName} - Onboarding Process</h1>
            <p className="text-blue-100 mt-1">
              {process.employeeId} • {process.department} • {process.position}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{process.overallProgress}%</div>
            <p className="text-blue-100">Overall Progress</p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={process.overallProgress} className="h-2 bg-blue-500" />
        </div>
        <div className="flex justify-between text-sm text-blue-100 mt-2">
          <span>Started: {new Date(process.createdAt).toLocaleDateString()}</span>
          <span>Expected: {new Date(process.estimatedCompletion).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Onboarding Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {process.steps.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === selectedStep;
                
                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedStep(step.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <div>
                          <h3 className={`font-medium text-sm ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                            {step.title}
                            {step.isOptional && <span className="text-xs text-orange-500 ml-1">(Optional)</span>}
                          </h3>
                          <p className="text-xs text-gray-500">{step.assignedTo}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getStepStatusColor(step.status)}>
                          {getStepStatusIcon(step.status)}
                        </Badge>
                        <span className="text-xs text-gray-500">{step.progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Optional Modules */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Optional Add-ons
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptionalModules(!showOptionalModules)}
                >
                  {showOptionalModules ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showOptionalModules && (
              <CardContent className="space-y-2">
                {optionalModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <div key={module.id} className="p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{module.title}</h4>
                          <p className="text-xs text-gray-500">{module.description}</p>
                        </div>
                        <Badge variant={module.enabled ? 'default' : 'secondary'}>
                          {module.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Step Details */}
        <div className="lg:col-span-2">
          {selectedStepData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <selectedStepData.icon className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle>{selectedStepData.title}</CardTitle>
                      <p className="text-gray-600 text-sm mt-1">{selectedStepData.description}</p>
                    </div>
                  </div>
                  <Badge className={getStepStatusColor(selectedStepData.status)}>
                    {getStepStatusIcon(selectedStepData.status)}
                    <span className="ml-1">{selectedStepData.status}</span>
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress: {completedSubsteps}/{totalSubsteps} tasks</span>
                    <span>{Math.round(stepProgress)}%</span>
                  </div>
                  <Progress value={stepProgress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Assigned To</p>
                      <p className="font-medium">{selectedStepData.assignedTo}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="font-medium">{new Date(selectedStepData.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Sub-tasks</h3>
                    <div className="space-y-2">
                      {selectedStepData.substeps.map((substep) => (
                        <div key={substep.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={substep.status === 'completed'}
                              onChange={(e) => handleSubstepToggle(substep.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300"
                            />
                            <div>
                              <h4 className={`text-sm font-medium ${
                                substep.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}>
                                {substep.title}
                              </h4>
                              {substep.description && (
                                <p className="text-xs text-gray-500">{substep.description}</p>
                              )}
                            </div>
                          </div>
                          {substep.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Step Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWorkflow;
