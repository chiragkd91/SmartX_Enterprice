/**
 * Session Management Hook with Automated Logout
 * Handles user activity detection, session timeouts, and automatic logout
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '../store/useStore';

interface SessionConfig {
  timeoutMinutes: number;
  warningMinutes: number;
  extendMinutes: number;
  trackActivity: boolean;
}

interface SessionState {
  isActive: boolean;
  timeRemaining: number;
  showWarning: boolean;
  lastActivity: number;
}

// Role-based session timeout configurations
const SESSION_CONFIGS: Record<string, SessionConfig> = {
  admin: {
    timeoutMinutes: 480, // 8 hours
    warningMinutes: 10,  // Warning 10 minutes before
    extendMinutes: 120,  // Extend by 2 hours
    trackActivity: true
  },
  manager: {
    timeoutMinutes: 240, // 4 hours
    warningMinutes: 5,   // Warning 5 minutes before
    extendMinutes: 60,   // Extend by 1 hour
    trackActivity: true
  },
  staff: {
    timeoutMinutes: 120, // 2 hours
    warningMinutes: 5,   // Warning 5 minutes before
    extendMinutes: 30,   // Extend by 30 minutes
    trackActivity: true
  },
  viewer: {
    timeoutMinutes: 60,  // 1 hour
    warningMinutes: 5,   // Warning 5 minutes before
    extendMinutes: 30,   // Extend by 30 minutes
    trackActivity: true
  }
};

// Activity events to monitor
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
  'keydown'
];

export function useSessionManager() {
  const { currentUser, logout, updateUserSessionInfo } = useStore();
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: true,
    timeRemaining: 0,
    showWarning: false,
    lastActivity: Date.now()
  });

  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const activityCheckRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  // Get session configuration based on user role
  const getSessionConfig = useCallback((): SessionConfig => {
    if (!currentUser) {
      return SESSION_CONFIGS.viewer; // Default to most restrictive
    }
    
    return SESSION_CONFIGS[currentUser.role] || SESSION_CONFIGS.viewer;
  }, [currentUser]);

  // Handle automatic logout
  const handleAutoLogout = useCallback(() => {
    console.log('🔐 Session expired - automatic logout');
    
    // Clear session data
    localStorage.removeItem('smartbizflow_session');
    sessionStorage.clear();
    
    // Store logout reason for user feedback
    localStorage.setItem('logout_reason', 'session_timeout');
    
    // Logout user
    logout();
    
    setSessionState({
      isActive: false,
      timeRemaining: 0,
      showWarning: false,
      lastActivity: 0
    });
  }, [logout]);

  // Start session timer
  const startSessionTimer = useCallback(() => {
    const config = getSessionConfig();
    
    // Set warning timeout
    const warningTime = (config.timeoutMinutes - config.warningMinutes) * 60 * 1000;
    warningTimeoutRef.current = setTimeout(() => {
      setSessionState(prev => ({ ...prev, showWarning: true }));
    }, warningTime);

    // Set logout timeout
    const logoutTime = config.timeoutMinutes * 60 * 1000;
    sessionTimeoutRef.current = setTimeout(() => {
      handleAutoLogout();
    }, logoutTime);

  }, [getSessionConfig, handleAutoLogout]);

  // Reset activity and restart session timer
  const resetActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    
    const newState = {
      lastActivity: now,
      showWarning: false,
      isActive: true
    };
    
    setSessionState(prev => ({
      ...prev,
      ...newState
    }));

    // Clear existing timeouts
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Restart session timer
    startSessionTimer();
  }, [startSessionTimer]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    const config = getSessionConfig();
    if (!config.trackActivity || !sessionState.isActive) return;
    
    resetActivity();
  }, [resetActivity, getSessionConfig, sessionState.isActive]);

  // Extend session
  const extendSession = useCallback(() => {
    const config = getSessionConfig();
    
    // Clear existing timeouts
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Reset activity and restart timer
    resetActivity();
    
    // Log session extension
    console.log(`🔄 Session extended by ${config.extendMinutes} minutes`);
    
    // Update session storage
    const sessionData = {
      userId: currentUser?.id,
      loginTime: Date.now(),
      extendedAt: Date.now(),
      role: currentUser?.role
    };
    localStorage.setItem('smartbizflow_session', JSON.stringify(sessionData));
    
  }, [getSessionConfig, resetActivity, currentUser]);

  // Calculate time remaining
  const calculateTimeRemaining = useCallback(() => {
    const config = getSessionConfig();
    const elapsed = Date.now() - lastActivityRef.current;
    const totalTimeout = config.timeoutMinutes * 60 * 1000;
    const remaining = Math.max(0, totalTimeout - elapsed);
    const timeRemaining = Math.floor(remaining / 1000 / 60); // Convert to minutes
    
    setSessionState(prev => ({
      ...prev,
      timeRemaining
    }));
  }, [getSessionConfig]);

  // Setup activity listeners
  useEffect(() => {
    if (!currentUser) return;

    // Add activity event listeners
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start activity checking interval
    activityCheckRef.current = setInterval(calculateTimeRemaining, 60000); // Check every minute

    // Initialize session
    resetActivity();

    // Store session data
    const sessionData = {
      userId: currentUser.id,
      loginTime: Date.now(),
      role: currentUser.role
    };
    localStorage.setItem('smartbizflow_session', JSON.stringify(sessionData));

    return () => {
      // Cleanup listeners
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });

      // Clear timeouts
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (activityCheckRef.current) {
        clearInterval(activityCheckRef.current);
      }
    };
  }, [currentUser, handleActivity, resetActivity, calculateTimeRemaining]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible - check session validity
        const sessionData = localStorage.getItem('smartbizflow_session');
        if (sessionData) {
          try {
            const session = JSON.parse(sessionData);
            const config = getSessionConfig();
            const elapsed = Date.now() - session.loginTime;
            const maxTime = config.timeoutMinutes * 60 * 1000;
            
            if (elapsed > maxTime) {
              // Session expired while away
              handleAutoLogout();
            } else {
              // Session still valid - reset activity
              resetActivity();
            }
          } catch (error) {
            console.error('Error checking session:', error);
            handleAutoLogout();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [getSessionConfig, handleAutoLogout, resetActivity]);

  return {
    sessionState,
    extendSession,
    resetActivity,
    getSessionConfig
  };
}
