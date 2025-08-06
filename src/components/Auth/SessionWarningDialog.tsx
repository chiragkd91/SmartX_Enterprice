/**
 * Session Warning Dialog - Professional UX for session timeout warnings
 */

import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Clock, AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

interface SessionWarningDialogProps {
  isOpen: boolean;
  timeRemaining: number; // in seconds
  warningMinutes: number;
  onExtend: () => void;
  onLogout: () => void;
  userRole: string;
}

export default function SessionWarningDialog({
  isOpen,
  timeRemaining,
  warningMinutes,
  onExtend,
  onLogout,
  userRole
}: SessionWarningDialogProps) {
  const [countdown, setCountdown] = useState(timeRemaining);
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(timeRemaining);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeRemaining, onLogout]);

  const handleExtend = async () => {
    setIsExtending(true);
    try {
      await onExtend();
    } finally {
      setIsExtending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (countdown / (warningMinutes * 60)) * 100;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <AlertDialogTitle className="text-xl font-bold text-gray-800">
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Your session will expire due to inactivity. Would you like to extend your session?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-6 space-y-4">
          {/* Countdown Timer */}
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-orange-600 mb-2">
              {formatTime(countdown)}
            </div>
            <p className="text-sm text-gray-500">Time remaining</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
          <Progress 
            value={progressPercentage} 
            className={`h-2 transition-all duration-1000`}
          />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Session timeout</span>
              <span>{Math.floor(progressPercentage)}% remaining</span>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <AlertTriangle className="h-4 w-4" />
              <span>
                <strong>Role:</strong> {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Your work will be saved automatically before logout.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onLogout}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout Now
          </AlertDialogCancel>
          
          <AlertDialogAction 
            onClick={handleExtend}
            disabled={isExtending}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
          >
            {isExtending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Extending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Extend Session
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
