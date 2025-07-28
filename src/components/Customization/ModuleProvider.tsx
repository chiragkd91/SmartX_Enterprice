/**
 * Module Provider Component for SmartBizFlow Portal
 * Manages module enablement and configuration
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getEnabledModules, isFeatureEnabled, getModuleConfig, PortalModules, ModuleConfig } from '../../config/modules';

interface ModuleContextType {
  enabledModules: Record<string, ModuleConfig>;
  isModuleEnabled: (moduleName: keyof PortalModules) => boolean;
  isFeatureEnabled: (moduleName: keyof PortalModules, featureName: string) => boolean;
  getModuleConfig: (moduleName: keyof PortalModules) => ModuleConfig;
  refreshModules: () => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

interface ModuleProviderProps {
  children: React.ReactNode;
}

export const ModuleProvider: React.FC<ModuleProviderProps> = ({ children }) => {
  const [enabledModules, setEnabledModules] = useState<Record<string, ModuleConfig>>(getEnabledModules());

  // Refresh modules configuration
  const refreshModules = () => {
    setEnabledModules(getEnabledModules());
  };

  // Check if a module is enabled
  const isModuleEnabled = (moduleName: keyof PortalModules): boolean => {
    return enabledModules[moduleName]?.enabled === true;
  };

  // Check if a specific feature is enabled
  const checkFeatureEnabled = (moduleName: keyof PortalModules, featureName: string): boolean => {
    return isFeatureEnabled(moduleName, featureName);
  };

  // Get module configuration
  const getModuleConfiguration = (moduleName: keyof PortalModules): ModuleConfig => {
    return getModuleConfig(moduleName);
  };

  // Refresh modules when environment variables change
  useEffect(() => {
    const handleStorageChange = () => {
      refreshModules();
    };

    // Listen for storage events (useful for development)
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh modules on mount
    refreshModules();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const contextValue: ModuleContextType = {
    enabledModules,
    isModuleEnabled,
    isFeatureEnabled: checkFeatureEnabled,
    getModuleConfig: getModuleConfiguration,
    refreshModules
  };

  return (
    <ModuleContext.Provider value={contextValue}>
      {children}
    </ModuleContext.Provider>
  );
};

// Custom hook to use module context
export const useModules = (): ModuleContextType => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};

export default ModuleProvider; 