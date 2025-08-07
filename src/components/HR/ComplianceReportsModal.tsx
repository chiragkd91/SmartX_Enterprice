/**
 * Compliance Reports Generation Modal
 * Professional UI for generating PF, ESI, and TDS returns
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { 
  FileText, 
  CheckCircle, 
  Download, 
  Printer,
  Send,
  Clock,
  AlertCircle,
  Calendar,
  Building2,
  Users,
  IndianRupee,
  Shield,
  Mail,
  Eye
} from 'lucide-react';

interface ComplianceReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
}

interface ReportStatus {
  id: string;
  name: string;
  form: string;
  description: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  progress: number;
  fileSize?: string;
  lastUpdated?: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const ComplianceReportsModal: React.FC<ComplianceReportsModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedMonth 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [reports, setReports] = useState<ReportStatus[]>([
    {
      id: 'pf-returns',
      name: 'Provident Fund Returns',
      form: 'Form 5 & 10',
      description: 'Monthly PF contributions and member details',
      status: 'pending',
      progress: 0,
      dueDate: '15th of next month',
      priority: 'high'
    },
    {
      id: 'esi-returns',
      name: 'ESI Returns',
      form: 'Form 6',
      description: 'Employee State Insurance contributions',
      status: 'pending',
      progress: 0,
      dueDate: '21st of next month',
      priority: 'high'
    },
    {
      id: 'tds-returns',
      name: 'TDS Returns',
      form: 'Form 24Q',
      description: 'Tax deducted at source for salary',
      status: 'pending',
      progress: 0,
      dueDate: 'Quarterly submission',
      priority: 'medium'
    }
  ]);

  const steps = [
    { name: 'Validating employee data', description: 'Checking active employees and salary records' },
    { name: 'Calculating PF contributions', description: 'Processing Form 5 & 10 data' },
    { name: 'Processing ESI contributions', description: 'Generating Form 6 records' },
    { name: 'Computing TDS deductions', description: 'Preparing Form 24Q data' },
    { name: 'Generating compliance reports', description: 'Creating final documents' },
    { name: 'Validating report accuracy', description: 'Cross-checking calculations' },
    { name: 'Finalizing submissions', description: 'Preparing for government portals' }
  ];

  useEffect(() => {
    if (!isGenerating) {
      // Reset states when modal opens
      setCurrentStep(0);
      setOverallProgress(0);
      setReports(prev => prev.map(report => ({
        ...report,
        status: 'pending',
        progress: 0
      })));
    }
  }, [isOpen]);

  const startGeneration = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation process
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        // Update overall progress
        setOverallProgress((i / steps.length) * 100);
        
        // Update individual report progress
        if (i >= 1 && i <= 3) {
          const reportIndex = i - 1;
          setReports(prev => prev.map((report, index) => 
            index === reportIndex
              ? { ...report, status: 'generating', progress: 50 }
              : report
          ));
        }
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Complete individual reports
        if (i >= 1 && i <= 3) {
          const reportIndex = i - 1;
          setReports(prev => prev.map((report, index) => 
            index === reportIndex
              ? { 
                  ...report, 
                  status: 'completed', 
                  progress: 100,
                  fileSize: `${Math.floor(Math.random() * 500 + 100)} KB`,
                  lastUpdated: new Date().toLocaleString()
                }
              : report
          ));
        }
      }
      
      // Complete all reports
      setReports(prev => prev.map(report => ({
        ...report,
        status: 'completed',
        progress: 100,
        fileSize: report.fileSize || `${Math.floor(Math.random() * 500 + 100)} KB`,
        lastUpdated: new Date().toLocaleString()
      })));
      
      setOverallProgress(100);
      setCurrentStep(steps.length);
      
    } catch (error) {
      console.error('Error generating reports:', error);
      setReports(prev => prev.map(report => ({
        ...report,
        status: 'error'
      })));
    } finally {
      // Keep generating state for a moment to show completion
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'generating':
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">Generating</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-green-500';
    }
  };

  const allCompleted = reports.every(report => report.status === 'completed');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <span className="text-xl font-bold">Compliance Reports Generation</span>
              <div className="text-sm font-normal text-gray-500 mt-1">
                Generate statutory reports for {selectedMonth}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Card */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-600 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Period</p>
                    <p className="font-semibold text-purple-900">{selectedMonth}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-600 rounded-full">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Organization</p>
                    <p className="font-semibold text-blue-900">SmartBizFlow Ltd.</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-600 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employees</p>
                    <p className="font-semibold text-green-900">156 Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Section - Only show during generation */}
          {isGenerating && (
            <Card className="bg-white border-blue-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Generation Progress</h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      Step {currentStep + 1} of {steps.length}
                    </Badge>
                  </div>
                  
                  <Progress value={overallProgress} className="h-2" />
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <div>
                      <p className="font-medium">{steps[currentStep]?.name}</p>
                      <p className="text-sm text-gray-600">{steps[currentStep]?.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Compliance Reports ({reports.length})
            </h3>
            
            <div className="grid gap-4">
              {reports.map((report) => (
                <Card key={report.id} className={`border-l-4 ${getPriorityColor(report.priority)} hover:shadow-md transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(report.status)}
                          <div>
                            <h4 className="font-semibold text-gray-900">{report.name}</h4>
                            <p className="text-sm text-gray-600">{report.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{report.form}</Badge>
                            {getStatusBadge(report.status)}
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Due:</span> {report.dueDate}
                          </div>
                          
                          {report.fileSize && (
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Size:</span> {report.fileSize}
                            </div>
                          )}
                        </div>

                        {report.status === 'generating' && (
                          <div className="mt-4">
                            <Progress value={report.progress} className="h-1" />
                          </div>
                        )}

                        {report.lastUpdated && (
                          <div className="text-xs text-gray-400 mt-2">
                            Generated: {report.lastUpdated}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {report.status === 'completed' && (
                        <div className="flex space-x-2 ml-4">
                          <Button variant="ghost" size="sm" title="Preview">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Print">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary Section - Show after completion */}
          {allCompleted && !isGenerating && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-600 rounded-full">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      All Reports Generated Successfully!
                    </h3>
                    <p className="text-green-700 mb-4">
                      All compliance reports for {selectedMonth} have been generated and are ready for submission 
                      to the respective government portals.
                    </p>
                    
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>PF Returns (Form 5 & 10) - Ready for EPFO portal</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>ESI Returns (Form 6) - Ready for ESIC portal</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>TDS Returns (Form 24Q) - Ready for Income Tax portal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              {allCompleted ? 'Close' : 'Cancel'}
            </Button>

            <div className="flex space-x-3">
              {allCompleted && (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email Reports</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download All</span>
                  </Button>
                </>
              )}

              {!isGenerating && !allCompleted && (
                <Button
                  onClick={startGeneration}
                  className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Generate Reports</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplianceReportsModal;
