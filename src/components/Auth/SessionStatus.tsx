/**
 * Session Status Indicator - Shows session information in header
 */

import React from 'react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Clock, Shield, Timer, Wifi } from 'lucide-react';

interface SessionStatusProps {
  timeRemaining: number; // in minutes
  userRole: string;
  isActive: boolean;
  showWarning: boolean;
  sessionConfig: {
    timeoutMinutes: number;
    warningMinutes: number;
    extendMinutes: number;
  };
}

export default function SessionStatus({ 
  timeRemaining, 
  userRole, 
  isActive, 
  showWarning,
  sessionConfig 
}: SessionStatusProps) {
  const getStatusColor = () => {
    if (!isActive) return 'bg-red-500';
    if (showWarning) return 'bg-yellow-500';
    if (timeRemaining > 30) return 'bg-green-500';
    if (timeRemaining > 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (!isActive) return 'Inactive';
    if (showWarning) return 'Expiring';
    return 'Active';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'manager':
        return <Timer className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
            {/* Status Indicator */}
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
              <span className="text-xs font-medium text-gray-700">
                {getStatusText()}
              </span>
            </div>

            {/* Time Remaining */}
            {isActive && (
              <Badge 
                variant={showWarning ? "destructive" : "secondary"}
                className="text-xs px-1.5 py-0.5"
              >
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        
        <TooltipContent side="bottom" className="max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {getRoleIcon()}
              <span className="font-medium">Session Information</span>
            </div>
            
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${
                  isActive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getStatusText()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Role:</span>
                <span className="font-medium capitalize">{userRole}</span>
              </div>
              
              {isActive && (
                <>
                  <div className="flex justify-between">
                    <span>Time Remaining:</span>
                    <span className="font-medium">{formatTime(timeRemaining)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Session Length:</span>
                    <span className="font-medium">{formatTime(sessionConfig.timeoutMinutes)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Can Extend:</span>
                    <span className="font-medium">{formatTime(sessionConfig.extendMinutes)}</span>
                  </div>
                </>
              )}
            </div>
            
            {showWarning && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <div className="flex items-center space-x-1">
                  <Timer className="h-3 w-3" />
                  <span>Session expiring soon!</span>
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
