/**
 * Theme Provider Component for SmartBizFlow Portal
 * Applies custom theme configuration and branding
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getThemeConfig, getBrandingConfig, generateCSSVariables, ThemeConfig, BrandingConfig } from '../../config/theme';

interface ThemeContextType {
  theme: ThemeConfig;
  branding: BrandingConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
  updateBranding: (newBranding: Partial<BrandingConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(getThemeConfig());
  const [branding, setBranding] = useState<BrandingConfig>(getBrandingConfig());

  // Apply CSS variables to document
  useEffect(() => {
    const cssVariables = generateCSSVariables(theme);
    const styleElement = document.createElement('style');
    styleElement.textContent = cssVariables;
    styleElement.id = 'smartbizflow-theme-variables';
    
    // Remove existing style element if it exists
    const existingStyle = document.getElementById('smartbizflow-theme-variables');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(styleElement);

    // Apply branding to document
    document.title = branding.appName;
    
    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = branding.favicon;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = branding.favicon;
      document.head.appendChild(newFavicon);
    }

    return () => {
      styleElement.remove();
    };
  }, [theme, branding]);

  // Update theme function
  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prevTheme => ({ ...prevTheme, ...newTheme }));
  };

  // Update branding function
  const updateBranding = (newBranding: Partial<BrandingConfig>) => {
    setBranding(prevBranding => ({ ...prevBranding, ...newBranding }));
  };

  const contextValue: ThemeContextType = {
    theme,
    branding,
    updateTheme,
    updateBranding
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider; 