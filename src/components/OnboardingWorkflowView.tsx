/**
 * Onboarding Workflow View - Complete 10-Step Onboarding Process
 * Displays comprehensive workflow with all required steps following HR best practices
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import StatusUpdateModal from './modals/StatusUpdateModal';
import SendReminderModal from './modals/SendReminderModal';
import EmailConfigModal from './modals/EmailConfigModal';
import SmsSetupModal from './modals/SmsSetupModal';
import OfferLetterModal from './modals/OfferLetterModal';
import DocumentSignatureModal from './modals/DocumentSignatureModal';
import DocumentStorageModal from './modals/DocumentStorageModal';
import { 
  FileText,
  Database,
  Eye,
  Shield,
  Key,
  BookOpen,
  Video,
  GraduationCap,
  Users,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Send,
  Edit,
  Calendar,
  User,
  Mail,
  Phone,
  Building
} from 'lucide-react';

interface OnboardingWorkflowProps {
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  onBack: () => void;
}

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  progress: number;
  dueDate: string;
  assignedTo: string;
  substeps: string[];
  isOptional?: boolean;
}

const OnboardingWorkflowView: React.FC<OnboardingWorkflowProps> = ({
  employeeName,
  employeeId,
  department,
  position,
  onBack
}) => {
  const [selectedStep, setSelectedStep] = useState(1);
  
  // Modal states
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [emailConfigOpen, setEmailConfigOpen] = useState(false);
  const [smsSetupOpen, setSmsSetupOpen] = useState(false);
  const [offerLetterModalOpen, setOfferLetterModalOpen] = useState(false);
  const [documentSignatureModalOpen, setDocumentSignatureModalOpen] = useState(false);
  const [documentStorageModalOpen, setDocumentStorageModalOpen] = useState(false);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: "Offer & Acceptance",
      description: "Generate and process offer letter with candidate acceptance",
      icon: FileText,
      status: 'completed',
      progress: 100,
      dueDate: '2024-01-15',
      assignedTo: 'HR Team',
      substeps: [
        'Generate offer letter from HRMS',
        'Send offer to candidate',
        'Candidate acceptance (e-signature/upload)',
        'Store signed offer in system'
      ]
    },
    {
      id: 2,
      title: "Pre-Onboarding Data Collection",
      description: "Collect comprehensive employee information via secure portal",
      icon: Database,
      status: 'in-progress',
      progress: 60,
      dueDate: '2024-01-20',
      assignedTo: 'Employee/HR',
      substeps: [
        'Send secure portal access link',
        'Personal information collection',
        'Educational & experience details',
        'Banking & tax information',
        'Dependent information',
        'Document uploads (ID, certificates, resume)'
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
      substeps: [
        'Verify ID proof documents',
        'Verify educational certificates',
        'Verify experience certificates',
        'Flag missing or invalid entries',
        'Request corrections if needed'
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
      isOptional: true,
      substeps: [
        'Initiate BGV with third-party service',
        'Track BGV progress in HRMS',
        'Review BGV results',
        'BGV clearance confirmation'
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
      substeps: [
        'Generate unique Employee ID',
        'Create corporate email ID',
        'Setup ERP system access',
        'Setup CRM system access',
        'Configure IT asset access'
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
      substeps: [
        'Code of conduct review & acknowledgement',
        'Leave policies acknowledgement',
        'HR manual review',
        'IT usage policy acknowledgement',
        'Store policy acknowledgements'
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
      substeps: [
        'Schedule induction sessions via HRMS',
        'Send calendar invites',
        'Conduct orientation sessions',
        'Collect feedback forms',
        'Company culture introduction'
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
      substeps: [
        'Identify role-specific training requirements',
        'Assign required trainings in LMS',
        'Schedule training sessions',
        'Track training progress',
        'Training completion certification'
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
      substeps: [
        'Assign reporting manager in HRMS',
        'Map employee to team structure',
        'Map to department hierarchy',
        'Assign work location',
        'Setup team communication channels'
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
      substeps: [
        'Set probation period (3-6 months)',
        'Setup performance review cycle',
        'Configure confirmation process tasks',
        'Schedule probation review meetings',
        'Setup auto-confirmation triggers'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4 opacity-50" />;
    }
  };

  const selectedStepData = workflowSteps.find(step => step.id === selectedStep);
  const overallProgress = Math.round((workflowSteps.filter(step => step.status === 'completed').length / workflowSteps.length) * 100);
  
  // Modal handlers
  const handleStatusUpdate = (newStatus: string, notes: string) => {
    console.log('Status updated:', { newStatus, notes, step: selectedStepData?.title });
    // Here you would update the step status in your state management
    // For demo purposes, we'll just show a success message
    alert(`Status successfully updated to "${newStatus}"${notes ? ` with notes: "${notes}"` : ''}`);
  };
  
  const handleSendReminder = (reminderData: any) => {
    console.log('Reminder sent:', { reminderData, step: selectedStepData?.title });
    alert(`Reminder sent successfully!\n\nType: ${reminderData.type}\nPriority: ${reminderData.priority}${reminderData.includeManager ? '\nCopy sent to manager' : ''}`);
  };
  
  const handleEmailConfigSave = (config: any) => {
    console.log('Email configuration saved:', config);
    alert('Email configuration saved successfully!\n\nNotifications will be sent according to your settings.');
  };
  
  const handleSmsConfigSave = (config: any) => {
    console.log('SMS configuration saved:', config);
    alert('SMS configuration saved successfully!\n\nSMS alerts are now configured according to your settings.');
  };

  // New modal handlers
  const handleOfferLetterGenerate = (offerData: any) => {
    console.log('Offer letter generated:', offerData);
    alert(`Offer letter generated successfully!\n\nDocument ID: ${offerData.documentId}\nSalary: ₹${offerData.salary}\nJoining Date: ${offerData.joiningDate}`);
  };

  const handleDocumentSignatureComplete = (signatureData: any) => {
    console.log('Document signature completed:', signatureData);
    alert(`Document signature process completed!\n\nCompletion ID: ${signatureData.completionId}\nDocuments processed: ${signatureData.documents.length}`);
  };

  const handleDocumentStorageComplete = (storageData: any) => {
    console.log('Document storage completed:', storageData);
    alert(`Documents stored successfully!\n\nStorage ID: ${storageData.storageId}\nDocuments stored: ${storageData.documents.length}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="text-blue-600 bg-white hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{employeeName} - Onboarding Workflow</h1>
              <p className="text-blue-100 mt-1">
                {employeeId} • {department} • {position}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{overallProgress}%</div>
            <p className="text-blue-100">Overall Progress</p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={overallProgress} className="h-2 bg-blue-500" />
        </div>
        <div className="flex justify-between text-sm text-blue-100 mt-2">
          <span>Started: {new Date().toLocaleDateString()}</span>
          <span>Expected Completion: Feb 10, 2024</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Onboarding Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workflowSteps.map((step) => {
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
                        <Badge className={getStatusColor(step.status)}>
                          {getStatusIcon(step.status)}
                        </Badge>
                        <span className="text-xs text-gray-500">{step.progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed:</span>
                <span className="font-medium text-green-600">
                  {workflowSteps.filter(s => s.status === 'completed').length} steps
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>In Progress:</span>
                <span className="font-medium text-blue-600">
                  {workflowSteps.filter(s => s.status === 'in-progress').length} steps
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending:</span>
                <span className="font-medium text-gray-600">
                  {workflowSteps.filter(s => s.status === 'pending').length} steps
                </span>
              </div>
            </CardContent>
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
                  <Badge className={getStatusColor(selectedStepData.status)}>
                    {getStatusIcon(selectedStepData.status)}
                    <span className="ml-1 capitalize">{selectedStepData.status}</span>
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress: {selectedStepData.substeps.length} sub-tasks</span>
                    <span>{selectedStepData.progress}%</span>
                  </div>
                  <Progress value={selectedStepData.progress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Assigned To</p>
                      <p className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedStepData.assignedTo}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedStepData.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Sub-tasks</h3>
                    <div className="space-y-2">
                      {selectedStepData.substeps.map((substep, index) => {
                        const isCompleted = selectedStepData.status === 'completed' || (selectedStepData.status === 'in-progress' && index < 3);
                        
                        // Define click handlers for specific sub-tasks
                        const getSubtaskHandler = () => {
                          if (selectedStepData.id === 1) {
                            if (substep.includes('Generate offer letter')) {
                              return () => setOfferLetterModalOpen(true);
                            }
                            if (substep.includes('e-signature/upload')) {
                              return () => setDocumentSignatureModalOpen(true);
                            }
                            if (substep.includes('Store signed offer')) {
                              return () => setDocumentStorageModalOpen(true);
                            }
                          }
                          return null;
                        };
                        
                        const clickHandler = getSubtaskHandler();
                        
                        return (
                          <div 
                            key={index} 
                            className={`flex items-center gap-3 p-3 border rounded-lg ${
                              clickHandler ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300' : ''
                            }`}
                            onClick={clickHandler}
                          >
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              readOnly
                              className="w-4 h-4 text-blue-600 rounded border-gray-300"
                            />
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                clickHandler ? 'text-blue-900 hover:text-blue-700' : 'text-gray-900'
                              }`}>
                                {substep}
                                {clickHandler && (
                                  <span className="text-xs text-blue-500 ml-2">
                                    Click to open
                                  </span>
                                )}
                              </h4>
                            </div>
                            {isCompleted && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {clickHandler && !isCompleted && (
                              <FileText className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setReminderModalOpen(true)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button
                      onClick={() => setStatusModalOpen(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Contact & Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Email Updates</span>
                  </div>
                  <p className="text-sm text-gray-600">Automated notifications sent to HR and employee</p>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setEmailConfigOpen(true)}
                  >
                    Configure
                  </Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="font-medium">SMS Alerts</span>
                  </div>
                  <p className="text-sm text-gray-600">Important milestone notifications</p>
                  <Button 
                    size="sm" 
                    className="mt-2" 
                    variant="outline"
                    onClick={() => setSmsSetupOpen(true)}
                  >
                    Setup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Modals */}
      <StatusUpdateModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        currentStatus={selectedStepData?.status || 'pending'}
        stepTitle={selectedStepData?.title || ''}
      />
      
      <SendReminderModal
        isOpen={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        onSendReminder={handleSendReminder}
        recipientName={selectedStepData?.assignedTo || ''}
        stepTitle={selectedStepData?.title || ''}
      />
      
      <EmailConfigModal
        isOpen={emailConfigOpen}
        onClose={() => setEmailConfigOpen(false)}
        onSaveConfig={handleEmailConfigSave}
      />
      
      <SmsSetupModal
        isOpen={smsSetupOpen}
        onClose={() => setSmsSetupOpen(false)}
        onSaveConfig={handleSmsConfigSave}
      />
      
      {/* New Professional Modals */}
      <OfferLetterModal
        isOpen={offerLetterModalOpen}
        onClose={() => setOfferLetterModalOpen(false)}
        onGenerate={handleOfferLetterGenerate}
      />
      
      <DocumentSignatureModal
        isOpen={documentSignatureModalOpen}
        onClose={() => setDocumentSignatureModalOpen(false)}
        onComplete={handleDocumentSignatureComplete}
      />
      
      <DocumentStorageModal
        isOpen={documentStorageModalOpen}
        onClose={() => setDocumentStorageModalOpen(false)}
        onComplete={handleDocumentStorageComplete}
      />
    </div>
  );
};

export default OnboardingWorkflowView;
