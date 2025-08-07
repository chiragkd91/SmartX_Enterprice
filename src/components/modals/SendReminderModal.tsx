/**
 * Send Reminder Modal - Professional UI for sending task reminders
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { 
  Send, 
  Mail, 
  MessageSquare,
  Bell,
  Clock,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepTitle: string;
  assignedTo: string;
  dueDate: string;
  currentStatus: string;
  onSendReminder: (reminderData: {
    type: string;
    message: string;
    priority: string;
    includeManager: boolean;
  }) => void;
}

const SendReminderModal: React.FC<SendReminderModalProps> = ({
  isOpen,
  onClose,
  stepTitle,
  assignedTo,
  dueDate,
  currentStatus,
  onSendReminder
}) => {
  const [reminderType, setReminderType] = useState('email');
  const [priority, setPriority] = useState('normal');
  const [customMessage, setCustomMessage] = useState('');
  const [includeManager, setIncludeManager] = useState(false);

  const reminderTypes = [
    { value: 'email', label: 'Email Notification', icon: Mail },
    { value: 'sms', label: 'SMS Alert', icon: MessageSquare },
    { value: 'system', label: 'System Notification', icon: Bell }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const getDefaultMessage = () => {
    const daysOverdue = Math.ceil((new Date().getTime() - new Date(dueDate).getTime()) / (1000 * 3600 * 24));
    const isOverdue = daysOverdue > 0;
    
    if (isOverdue) {
      return `Hi ${assignedTo},\n\nThis is a reminder that the task "${stepTitle}" was due ${daysOverdue} day(s) ago and is currently ${currentStatus}.\n\nPlease update the status or complete the task as soon as possible.\n\nThank you!`;
    } else {
      return `Hi ${assignedTo},\n\nThis is a friendly reminder about the task "${stepTitle}" which is due on ${new Date(dueDate).toLocaleDateString()} and is currently ${currentStatus}.\n\nPlease ensure timely completion.\n\nThank you!`;
    }
  };

  const selectedReminderType = reminderTypes.find(type => type.value === reminderType);
  const selectedPriority = priorityOptions.find(p => p.value === priority);

  const handleSend = () => {
    onSendReminder({
      type: reminderType,
      message: customMessage || getDefaultMessage(),
      priority,
      includeManager
    });
    setCustomMessage('');
    onClose();
  };

  const isOverdue = new Date(dueDate) < new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-blue-600" />
            Send Task Reminder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Information */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">{stepTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Assigned to:</span>
                <span className="font-medium">{assignedTo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Due:</span>
                <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {new Date(dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Status:</span>
                <Badge className="text-xs capitalize">{currentStatus}</Badge>
              </div>
            </div>
            {isOverdue && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">This task is overdue</span>
              </div>
            )}
          </div>

          {/* Reminder Type */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Reminder Type</Label>
            <Select value={reminderType} onValueChange={setReminderType}>
              <SelectTrigger className="mt-2">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <selectedReminderType?.icon className="h-4 w-4" />
                    {selectedReminderType?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {reminderTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Level */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Priority Level</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="mt-2">
                <SelectValue>
                  <span className={selectedPriority?.color}>{selectedPriority?.label}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className={option.color}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Message */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Message</Label>
            <Textarea
              placeholder="Leave blank to use default message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
              className="mt-2"
            />
            {!customMessage && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 font-medium mb-2">Default message preview:</p>
                <p className="text-sm text-blue-600 whitespace-pre-line">{getDefaultMessage()}</p>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Additional Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeManager"
                checked={includeManager}
                onCheckedChange={setIncludeManager}
              />
              <Label htmlFor="includeManager" className="text-sm text-gray-700">
                Also send copy to reporting manager
              </Label>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">This reminder will:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Send {selectedReminderType?.label.toLowerCase()} to {assignedTo}</li>
              {includeManager && <li>• Send copy to reporting manager</li>}
              <li>• Log reminder activity in system</li>
              <li>• Update task priority to {priority}</li>
              <li>• Track reminder delivery status</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4 mr-2" />
            Send Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendReminderModal;
