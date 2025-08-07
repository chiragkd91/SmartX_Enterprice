/**
 * Status Update Modal - Professional UI for updating workflow step status
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Play, 
  User, 
  Calendar,
  MessageSquare,
  Save
} from 'lucide-react';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepTitle: string;
  currentStatus: string;
  assignedTo: string;
  dueDate: string;
  onStatusUpdate: (newStatus: string, notes: string) => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  onClose,
  stepTitle,
  currentStatus,
  assignedTo,
  dueDate,
  onStatusUpdate
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-600', icon: Clock },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Play },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  ];

  const getStatusOption = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const currentStatusOption = getStatusOption(currentStatus);
  const selectedStatusOption = getStatusOption(selectedStatus);

  const handleSave = () => {
    onStatusUpdate(selectedStatus, notes);
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Save className="h-5 w-5 text-blue-600" />
            Update Task Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Information */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">{stepTitle}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Assigned to:</span>
                <span className="font-medium">{assignedTo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Due:</span>
                <span className="font-medium">{new Date(dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Current Status</Label>
            <div className="mt-2">
              <Badge className={`${currentStatusOption.color} border px-3 py-1`}>
                <currentStatusOption.icon className="h-4 w-4 mr-2" />
                {currentStatusOption.label}
              </Badge>
            </div>
          </div>

          {/* New Status Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Update Status To</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="mt-2">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <selectedStatusOption.icon className="h-4 w-4" />
                    {selectedStatusOption.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Status Update Notes */}
          <div>
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Update Notes (Optional)
            </Label>
            <Textarea
              placeholder="Add notes about this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Impact Summary */}
          {selectedStatus !== currentStatus && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">This update will:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Update task status in the database</li>
                <li>• Send notifications to assigned team members</li>
                <li>• Recalculate overall workflow progress</li>
                <li>• Log status change in audit trail</li>
                {selectedStatus === 'completed' && <li>• Trigger next workflow step (if applicable)</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={selectedStatus === currentStatus && !notes.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Update Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
