/**
 * SMS Setup Modal - Professional UI for SMS configuration
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
  MessageSquare, 
  Phone, 
  Settings,
  Clock,
  FileText,
  Save,
  Test,
  AlertTriangle
} from 'lucide-react';

interface SmsSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

const SmsSetupModal: React.FC<SmsSetupModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [config, setConfig] = useState({
    // General Settings
    enabled: false,
    provider: 'twilio',
    
    // Provider Settings
    credentials: {
      accountSid: '',
      authToken: '',
      fromNumber: ''
    },
    
    // Recipients
    recipients: {
      employee: true,
      manager: false,
      emergency: false
    },
    
    // Frequency Limits
    limits: {
      maxPerDay: 5,
      maxPerHour: 2,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      }
    },
    
    // Notifications
    notifications: {
      urgent: true,
      overdue: true,
      reminders: false,
      completed: false
    },
    
    // Templates
    templates: {
      urgent: 'URGENT: Task "{taskName}" requires immediate attention. Due: {dueDate}',
      overdue: 'OVERDUE: Task "{taskName}" was due {daysOverdue} day(s) ago. Please update status.',
      reminder: 'Reminder: Task "{taskName}" is due on {dueDate}. Status: {status}'
    }
  });

  const providers = [
    { value: 'twilio', label: 'Twilio', description: 'Reliable SMS delivery worldwide' },
    { value: 'aws-sns', label: 'AWS SNS', description: 'Amazon Simple Notification Service' },
    { value: 'messagebird', label: 'MessageBird', description: 'Global SMS and messaging platform' },
    { value: 'custom', label: 'Custom API', description: 'Use your own SMS provider' }
  ];

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

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const testSms = () => {
    alert(`Test SMS would be sent to configured number:\n\n• Provider: ${config.provider}\n• From: ${config.credentials.fromNumber}\n• Message: "Test message from SmartBizFlow"\n\nThis would send a real SMS in production.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-green-600" />
            SMS Configuration
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="provider">Provider</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-enabled" className="text-sm font-medium">
                  Enable SMS Notifications
                </Label>
                <Switch
                  id="sms-enabled"
                  checked={config.enabled}
                  onCheckedChange={(checked) => handleConfigChange('enabled', checked)}
                />
              </div>

              {!config.enabled && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">SMS Disabled</h4>
                      <p className="text-sm text-yellow-700">
                        Enable SMS notifications to send critical alerts and reminders to users.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Recipients
                </Label>

                {[
                  { key: 'employee', label: 'Employee', description: 'Send SMS to task assignee' },
                  { key: 'manager', label: 'Manager', description: 'Send SMS to reporting manager' },
                  { key: 'emergency', label: 'Emergency Contact', description: 'Send to emergency contact for critical tasks' }
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

              <div className="space-y-3">
                <Label>Notification Types</Label>
                {[
                  { key: 'urgent', label: 'Urgent Tasks', description: 'High priority task alerts' },
                  { key: 'overdue', label: 'Overdue Tasks', description: 'Tasks past due date' },
                  { key: 'reminders', label: 'Reminders', description: 'Regular task reminders' },
                  { key: 'completed', label: 'Completion', description: 'Task completion confirmations' }
                ].map(notification => (
                  <div key={notification.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{notification.label}</div>
                      <div className="text-sm text-gray-600">{notification.description}</div>
                    </div>
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

          {/* Provider Settings */}
          <TabsContent value="provider" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">SMS Provider</Label>
                <Select
                  value={config.provider}
                  onValueChange={(value) => handleConfigChange('provider', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(provider => (
                      <SelectItem key={provider.value} value={provider.value}>
                        <div>
                          <div className="font-medium">{provider.label}</div>
                          <div className="text-xs text-gray-600">{provider.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {config.provider === 'twilio' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="account-sid">Account SID</Label>
                    <Input
                      id="account-sid"
                      type="password"
                      value={config.credentials.accountSid}
                      onChange={(e) => handleConfigChange('credentials.accountSid', e.target.value)}
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="auth-token">Auth Token</Label>
                    <Input
                      id="auth-token"
                      type="password"
                      value={config.credentials.authToken}
                      onChange={(e) => handleConfigChange('credentials.authToken', e.target.value)}
                      placeholder="Your Twilio Auth Token"
                    />
                  </div>
                  <div>
                    <Label htmlFor="from-number">From Phone Number</Label>
                    <Input
                      id="from-number"
                      value={config.credentials.fromNumber}
                      onChange={(e) => handleConfigChange('credentials.fromNumber', e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Provider Requirements</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Valid SMS provider account with active subscription</li>
                  <li>• Verified phone numbers for sending SMS</li>
                  <li>• Sufficient credit balance for message delivery</li>
                  <li>• Compliance with local SMS regulations</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Limits */}
          <TabsContent value="limits" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Frequency Limits
              </Label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-per-day">Max SMS per Day</Label>
                  <Input
                    id="max-per-day"
                    type="number"
                    value={config.limits.maxPerDay}
                    onChange={(e) => handleConfigChange('limits.maxPerDay', parseInt(e.target.value))}
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <Label htmlFor="max-per-hour">Max SMS per Hour</Label>
                  <Input
                    id="max-per-hour"
                    type="number"
                    value={config.limits.maxPerHour}
                    onChange={(e) => handleConfigChange('limits.maxPerHour', parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quiet-hours" className="text-sm font-medium">
                    Enable Quiet Hours
                  </Label>
                  <Switch
                    id="quiet-hours"
                    checked={config.limits.quietHours.enabled}
                    onCheckedChange={(checked) => handleConfigChange('limits.quietHours.enabled', checked)}
                  />
                </div>

                {config.limits.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                      <Input
                        id="quiet-start"
                        type="time"
                        value={config.limits.quietHours.start}
                        onChange={(e) => handleConfigChange('limits.quietHours.start', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiet-end">Quiet Hours End</Label>
                      <Input
                        id="quiet-end"
                        type="time"
                        value={config.limits.quietHours.end}
                        onChange={(e) => handleConfigChange('limits.quietHours.end', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Rate Limiting</h4>
                <p className="text-sm text-yellow-700">
                  These limits help prevent SMS spam and manage costs. Urgent notifications may override some limits.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                SMS Templates
              </Label>

              <div className="space-y-4">
                {[
                  { key: 'urgent', label: 'Urgent Task Alert', maxLength: 160 },
                  { key: 'overdue', label: 'Overdue Task Notice', maxLength: 160 },
                  { key: 'reminder', label: 'Task Reminder', maxLength: 160 }
                ].map(template => (
                  <div key={template.key}>
                    <Label htmlFor={`template-${template.key}`}>
                      {template.label} ({config.templates[template.key].length}/{template.maxLength} chars)
                    </Label>
                    <Textarea
                      id={`template-${template.key}`}
                      value={config.templates[template.key]}
                      onChange={(e) => handleConfigChange(`templates.${template.key}`, e.target.value)}
                      rows={3}
                      maxLength={template.maxLength}
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Available Variables</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                  <div>• {'{taskName}'} - Task title</div>
                  <div>• {'{dueDate}'} - Due date</div>
                  <div>• {'{status}'} - Current status</div>
                  <div>• {'{assignedTo}'} - Assigned person</div>
                  <div>• {'{daysOverdue}'} - Days overdue</div>
                  <div>• {'{employeeName}'} - Employee name</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={testSms} className="flex items-center gap-2">
            <Test className="h-4 w-4" />
            Test SMS
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmsSetupModal;
