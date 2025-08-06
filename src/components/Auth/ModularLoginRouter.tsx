import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import HRMSLogin from './HRMSLogin';
import LoginForm from './LoginForm';

interface ModularLoginRouterProps {
  onLoginSuccess?: (module: string, user: any) => void;
}

export default function ModularLoginRouter({ onLoginSuccess }: ModularLoginRouterProps) {
  const location = useLocation();
  
  // Extract module from pathname
  const getModuleFromPath = () => {
    const path = location.pathname;
    if (path.includes('/hrms/') || path.includes('/hr/')) return 'hrms';
    if (path.includes('/crm/')) return 'crm';
    if (path.includes('/erp/')) return 'erp';
    if (path.includes('/assets/') || path.includes('/it-asset/')) return 'assets';
    if (path.includes('/reports/') || path.includes('/business-intelligence/')) return 'reports';
    if (path.includes('/automation/')) return 'automation';
    return null;
  };

  const module = getModuleFromPath();

  const renderLoginComponent = () => {
    switch (module) {
      case 'hrms':
        return <HRMSLogin />;
      case 'crm':
      case 'erp':
      case 'assets':
      case 'reports':
      case 'automation':
      default:
        // For now, use the general login form for all modules
        // Individual module login components can be added later
        return <LoginForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {renderLoginComponent()}
    </div>
  );
}