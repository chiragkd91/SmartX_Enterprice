/**
 * Email Configuration Modal - Professional UI for email settings
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Mail, 
  Settings, 
  Users,
  Clock,
  FileText,
  Save,
  Test,
  Plus,
  X
} from 'lucide-react';

interface EmailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

const EmailConfigModal: React.FC<EmailConfigModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [config, setConfig] = useState({
    // General Settings
    enabled: true,
    fromEmail: 'noreply@company.com',
    fromName: 'SmartBizFlow HR',
    
    // Recipients
    recipients: {
      employee: true,
      manager: true,
      hrTeam: false,
      customEmails: ['hr@company.com']
    },
    
    // Scheduling
    schedule: {
      immediate: true,
      daily: false,
      weekly: false,
      dailyTime: '09:00',
      weeklyDay: 'monday'
    },
    
    // Notifications
    notifications: {
      taskCreated: true,
      statusChanged: true,
      dueDateApproaching: true,
      overdue: true,
      completed: false
    },
    
    // Templates
    templates: {
      subject: 'Onboarding Task Update - {taskName}',
      body: `Hi {recipientName},\n\nThis is an update regarding the onboarding task: {taskName}\n\nStatus: {status}\nDue Date: {dueDate}\nAssigned to: {assignedTo}\n\nPlease take necessary action if required.\n\nBest regards,\nHR Team`
    }
  });

  const [customEmail, setCustomEmail] = useState('');

  const handleConfigChange = (path: string, value: any) => {
    setConfig(prev => {
      const keys = path.split('.');
      const newConfig = { ...prev };
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const addCustomEmail = () => {
    if (customEmail && !config.recipients.customEmails.includes(customEmail)) {
      handleConfigChange('recipients.customEmails', [...config.recipients.customEmails, customEmail]);
      setCustomEmail('');
    }
  };

  const removeCustomEmail = (email: string) => {
    handleConfigChange('recipients.customEmails', 
      config.recipients.customEmails.filter(e => e !== email)
    );
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const testEmail = () => {
    alert(`Test email would be sent to:\n\n• ${config.fromEmail}\n• Preview template with current settings\n• Verify SMTP configuration\n\nThis would typically send a real test email in production.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-5 w-5 text-blue-600" />
            Email Configuration
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-enabled" className="text-sm font-medium">
                  Enable Email Notifications
                </Label>
                <Switch
                  id="email-enabled"
                  checked={config.enabled}
                  onCheckedChange={(checked) => handleConfigChange('enabled', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-email">From Email Address</Label>
                  <Input
                    id="from-email"
                    type="email"
                    value={config.fromEmail}
                    onChange={(e) => handleConfigChange('fromEmail', e.target.value)}
                    placeholder="noreply@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="from-name">From Name</Label>
                  <Input
                    id="from-name"
                    value={config.fromName}
                    onChange={(e) => handleConfigChange('fromName', e.target.value)}
                    placeholder="SmartBizFlow HR"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">SMTP Settings</h4>
                <p className="text-sm text-blue-700 mb-3">Configure your SMTP server settings to send emails:</p>
                <div className="space-y-2 text-sm text-blue-600">
                  <div>• Server: smtp.company.com:587</div>
                  <div>• Authentication: Username/Password</div>
                  <div>• Encryption: TLS/STARTTLS</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Recipients */}
          <TabsContent value="recipients" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Default Recipients
              </Label>

              <div className="space-y-3">
                {[
                  { key: 'employee', label: 'Employee (Task Assignee)', description: 'Send to the person assigned to the task' },
                  { key: 'manager', label: 'Reporting Manager', description: 'Send to the employee\'s direct manager' },
                  { key: 'hrTeam', label: 'HR Team', description: 'Send copy to HR team members' }
                ].map(recipient => (
                  <div key={recipient.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{recipient.label}</div>
                      <div className="text-sm text-gray-600">{recipient.description}</div>
                    </div>
                    <Switch
                      checked={config.recipients[recipient.key]}
                      onCheckedChange={(checked) => 
                        handleConfigChange(`recipients.${recipient.key}`, checked)
                      }
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label className="text-sm font-medium">Custom Email Addresses</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="email@company.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomEmail()}
                    />
                    <Button onClick={addCustomEmail} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {config.recipients.customEmails.map(email => (
                      <div key={email} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{email}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCustomEmail(email)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Notification Schedule
              </Label>

              <div className="space-y-3">
                {[
                  { key: 'immediate', label: 'Immediate', description: 'Send notifications immediately when events occur' },
                  { key: 'daily', label: 'Daily Digest', description: 'Send daily summary of all updates' },
                  { key: 'weekly', label: 'Weekly Summary', description: 'Send weekly summary of all activities' }
                ].map(schedule => (
                  <div key={schedule.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{schedule.label}</div>
                      <div className="text-sm text-gray-600">{schedule.description}</div>
                    </div>
                    <Switch
                      checked={config.schedule[schedule.key]}
                      onCheckedChange={(checked) => 
                        handleConfigChange(`schedule.${schedule.key}`, checked)
                      }
                    />
                  </div>
                ))}
              </div>

              {config.schedule.daily && (
                <div>
                  <Label>Daily Email Time</Label>
                  <Input
                    type="time"
                    value={config.schedule.dailyTime}
                    onChange={(e) => handleConfigChange('schedule.dailyTime', e.target.value)}
                  />
                </div>
              )}

              {config.schedule.weekly && (
                <div>
                  <Label>Weekly Email Day</Label>
                  <Select
                    value={config.schedule.weeklyDay}
                    onValueChange={(value) => handleConfigChange('schedule.weeklyDay', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <SelectItem key={day} value={day}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Email Templates
              </Label>

              <div>
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input
                  id="email-subject"
                  value={config.templates.subject}
                  onChange={(e) => handleConfigChange('templates.subject', e.target.value)}
                  placeholder="Subject line with variables"
                />
              </div>

              <div>
                <Label htmlFor="email-body">Email Body</Label>
                <Textarea
                  id="email-body"
                  value={config.templates.body}
                  onChange={(e) => handleConfigChange('templates.body', e.target.value)}
                  rows={8}
                  placeholder="Email body with variables"
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Available Variables</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-yellow-800">
                  <div>• {'{taskName}'} - Task title</div>
                  <div>• {'{recipientName}'} - Recipient name</div>
                  <div>• {'{status}'} - Current status</div>
                  <div>• {'{dueDate}'} - Due date</div>
                  <div>• {'{assignedTo}'} - Assigned person</div>
                  <div>• {'{employeeName}'} - Employee name</div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Notification Types</Label>
                {[
                  { key: 'taskCreated', label: 'Task Created' },
                  { key: 'statusChanged', label: 'Status Changed' },
                  { key: 'dueDateApproaching', label: 'Due Date Approaching' },
                  { key: 'overdue', label: 'Task Overdue' },
                  { key: 'completed', label: 'Task Completed' }
                ].map(notification => (
                  <div key={notification.key} className="flex items-center justify-between">
                    <Label>{notification.label}</Label>
                    <Switch
                      checked={config.notifications[notification.key]}
                      onCheckedChange={(checked) => 
                        handleConfigChange(`notifications.${notification.key}`, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={testEmail} className="flex items-center gap-2">
            <Test className="h-4 w-4" />
            Test Email
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailConfigModal;
