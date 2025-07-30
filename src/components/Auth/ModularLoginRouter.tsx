import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import HRMSLogin from './HRMSLogin';
import CRMLogin from './CRMLogin';
import ERPLogin from './ERPLogin';
import ITAssetLogin from './ITAssetLogin';
import BusinessIntelligenceLogin from './BusinessIntelligenceLogin';
import AutomationLogin from './AutomationLogin';

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
        return <HRMSLogin onLoginSuccess={onLoginSuccess} />;
      case 'crm':
        return <CRMLogin onLoginSuccess={onLoginSuccess} />;
      case 'erp':
        return <ERPLogin onLoginSuccess={onLoginSuccess} />;
      case 'assets':
        return <ITAssetLogin onLoginSuccess={onLoginSuccess} />;
      case 'reports':
        return <BusinessIntelligenceLogin onLoginSuccess={onLoginSuccess} />;
      case 'automation':
        return <AutomationLogin onLoginSuccess={onLoginSuccess} />;
      default:
        return <Navigate to="/hrms/login" replace />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {renderLoginComponent()}
    </div>
  );
}