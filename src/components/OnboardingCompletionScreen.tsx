/**
 * Onboarding Completion Screen - Professional UI for onboarding completion
 * Replaces basic alert dialog with a comprehensive completion screen
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  UserPlus, 
  Calendar,
  Users,
  Clipboard,
  Laptop,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';

interface OnboardingCompletionProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  onProceedToNextSteps: () => void;
}

const OnboardingCompletionScreen: React.FC<OnboardingCompletionProps> = ({
  isOpen,
  onClose,
  employeeName,
  employeeId,
  department,
  position,
  onProceedToNextSteps
}) => {
  if (!isOpen) return null;

  const handleViewWorkflow = () => {
    onProceedToNextSteps();
  };

  const nextSteps = [
    {
      icon: Clipboard,
      title: 'Review and assign tasks',
      description: 'Set up specific tasks for equipment, accounts, and access',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Laptop,
      title: 'Set up equipment and accounts',
      description: 'Configure hardware, software, and system accounts',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: GraduationCap,
      title: 'Schedule training sessions',
      description: 'Plan orientation and department-specific training',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header with Success Animation */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-white animate-pulse" />
              <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">
            Onboarding Process Created Successfully!
          </h1>
          <p className="text-green-100 text-center text-lg">
            Welcome to the team, {employeeName}!
          </p>
        </div>

        {/* Employee Information Card */}
        <div className="p-6">
          <Card className="bg-gray-50 border-0 shadow-sm mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <UserPlus className="h-6 w-6 text-blue-600" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{employeeName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employee ID</label>
                    <p className="text-lg font-semibold text-gray-900">{employeeId}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <Badge className="bg-blue-100 text-blue-800 text-sm">{department}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Position</label>
                    <p className="text-lg font-semibold text-gray-900">{position}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Status */}
          <Card className="bg-green-50 border-green-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Process Initiated</h3>
                    <p className="text-sm text-green-700">Onboarding workflow has been set up</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ArrowRight className="h-6 w-6 text-orange-600" />
                Next Steps
              </CardTitle>
              <p className="text-sm text-gray-600">
                Complete these essential onboarding tasks to ensure a smooth start for the new employee
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className={`${step.bgColor} p-4 rounded-lg border border-gray-100`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <Icon className={`h-6 w-6 ${step.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="bg-white text-gray-500 text-xs font-medium px-2 py-1 rounded-full border">
                            Step {index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onClose}
            >
              <Users className="h-4 w-4 mr-2" />
              Back to Onboarding List
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleViewWorkflow}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Workflow
            </Button>
          </div>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Important Reminders</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ensure all required documents are collected before the start date</li>
                  <li>• Coordinate with IT for equipment setup 48 hours in advance</li>
                  <li>• Schedule a welcome meeting with the team lead</li>
                  <li>• Prepare workspace and necessary access permissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCompletionScreen;
