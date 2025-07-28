/**
 * Theme Configuration for SmartBizFlow Portal
 * Centralized theme management for consistent branding and customization
 */

export interface ThemeColors {
  light: string;
  dark: string;
  contrast: string;
}

export interface ThemeConfig {
  primary: ThemeColors;
  secondary: ThemeColors;
  accent: ThemeColors;
  neutral: Record<string, string>;
  success: ThemeColors;
  warning: ThemeColors;
  error: ThemeColors;
  info: ThemeColors;
}

export interface BrandingConfig {
  logo: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  favicon: string;
  appName: string;
  appDescription: string;
  companyName: string;
  companyWebsite: string;
}

export interface TypographyConfig {
  fontFamily: {
    primary: string;
    secondary: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface LayoutConfig {
  sidebar: {
    position: 'left' | 'right' | 'top' | 'bottom';
    width: number;
    collapsible: boolean;
    showIcons: boolean;
    showLabels: boolean;
    backgroundColor: string;
    textColor: string;
  };
  header: {
    height: number;
    showLogo: boolean;
    showSearch: boolean;
    showNotifications: boolean;
    showUserMenu: boolean;
    backgroundColor: string;
    textColor: string;
  };
  content: {
    maxWidth: number;
    padding: number;
    showBreadcrumbs: boolean;
    backgroundColor: string;
  };
}

// Default Theme Configuration
export const defaultThemeConfig: ThemeConfig = {
  primary: {
    light: '#3B82F6',
    dark: '#1E40AF',
    contrast: '#FFFFFF'
  },
  secondary: {
    light: '#10B981',
    dark: '#047857',
    contrast: '#FFFFFF'
  },
  accent: {
    light: '#F59E0B',
    dark: '#D97706',
    contrast: '#FFFFFF'
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },
  success: {
    light: '#10B981',
    dark: '#047857',
    contrast: '#FFFFFF'
  },
  warning: {
    light: '#F59E0B',
    dark: '#D97706',
    contrast: '#FFFFFF'
  },
  error: {
    light: '#EF4444',
    dark: '#DC2626',
    contrast: '#FFFFFF'
  },
  info: {
    light: '#3B82F6',
    dark: '#1E40AF',
    contrast: '#FFFFFF'
  }
};

// Default Branding Configuration
export const defaultBrandingConfig: BrandingConfig = {
  logo: {
    url: '/logo.png',
    alt: 'SmartBizFlow',
    width: 150,
    height: 40
  },
  favicon: '/favicon.ico',
  appName: 'SmartBizFlow',
  appDescription: 'Complete Business Management Solution',
  companyName: 'SmartBizFlow Solutions',
  companyWebsite: 'https://smartbizflow.com'
};

// Default Typography Configuration
export const defaultTypographyConfig: TypographyConfig = {
  fontFamily: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Poppins, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

// Default Layout Configuration
export const defaultLayoutConfig: LayoutConfig = {
  sidebar: {
    position: 'left',
    width: 280,
    collapsible: true,
    showIcons: true,
    showLabels: true,
    backgroundColor: '#FFFFFF',
    textColor: '#374151'
  },
  header: {
    height: 64,
    showLogo: true,
    showSearch: true,
    showNotifications: true,
    showUserMenu: true,
    backgroundColor: '#FFFFFF',
    textColor: '#374151'
  },
  content: {
    maxWidth: 1200,
    padding: 24,
    showBreadcrumbs: true,
    backgroundColor: '#F9FAFB'
  }
};

// Environment-based configuration
export const getThemeConfig = (): ThemeConfig => {
  return {
    ...defaultThemeConfig,
    primary: {
      light: import.meta.env.VITE_PRIMARY_COLOR || defaultThemeConfig.primary.light,
      dark: import.meta.env.VITE_PRIMARY_COLOR_DARK || defaultThemeConfig.primary.dark,
      contrast: defaultThemeConfig.primary.contrast
    },
    secondary: {
      light: import.meta.env.VITE_SECONDARY_COLOR || defaultThemeConfig.secondary.light,
      dark: import.meta.env.VITE_SECONDARY_COLOR_DARK || defaultThemeConfig.secondary.dark,
      contrast: defaultThemeConfig.secondary.contrast
    }
  };
};

export const getBrandingConfig = (): BrandingConfig => {
  return {
    ...defaultBrandingConfig,
    appName: import.meta.env.VITE_APP_NAME || defaultBrandingConfig.appName,
    logo: {
      ...defaultBrandingConfig.logo,
      url: import.meta.env.VITE_APP_LOGO || defaultBrandingConfig.logo.url
    }
  };
};

// CSS Variables for theme
export const generateCSSVariables = (theme: ThemeConfig): string => {
  return `
    :root {
      /* Primary Colors */
      --color-primary-50: ${theme.primary.light}1A;
      --color-primary-100: ${theme.primary.light}33;
      --color-primary-500: ${theme.primary.light};
      --color-primary-600: ${theme.primary.dark};
      --color-primary-900: ${theme.primary.dark};
      
      /* Secondary Colors */
      --color-secondary-50: ${theme.secondary.light}1A;
      --color-secondary-100: ${theme.secondary.light}33;
      --color-secondary-500: ${theme.secondary.light};
      --color-secondary-600: ${theme.secondary.dark};
      --color-secondary-900: ${theme.secondary.dark};
      
      /* Accent Colors */
      --color-accent-50: ${theme.accent.light}1A;
      --color-accent-100: ${theme.accent.light}33;
      --color-accent-500: ${theme.accent.light};
      --color-accent-600: ${theme.accent.dark};
      --color-accent-900: ${theme.accent.dark};
      
      /* Neutral Colors */
      --color-neutral-50: ${theme.neutral[50]};
      --color-neutral-100: ${theme.neutral[100]};
      --color-neutral-200: ${theme.neutral[200]};
      --color-neutral-300: ${theme.neutral[300]};
      --color-neutral-400: ${theme.neutral[400]};
      --color-neutral-500: ${theme.neutral[500]};
      --color-neutral-600: ${theme.neutral[600]};
      --color-neutral-700: ${theme.neutral[700]};
      --color-neutral-800: ${theme.neutral[800]};
      --color-neutral-900: ${theme.neutral[900]};
      
      /* Status Colors */
      --color-success: ${theme.success.light};
      --color-warning: ${theme.warning.light};
      --color-error: ${theme.error.light};
      --color-info: ${theme.info.light};
    }
  `;
};

// Theme utilities
export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation - in production, use a proper color contrast library
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

export const darkenColor = (color: string, amount: number): string => {
  // Simple color darkening - in production, use a proper color manipulation library
  const hex = color.replace('#', '');
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const lightenColor = (color: string, amount: number): string => {
  // Simple color lightening - in production, use a proper color manipulation library
  const hex = color.replace('#', '');
  const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
  const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export default {
  getThemeConfig,
  getBrandingConfig,
  generateCSSVariables,
  getContrastColor,
  darkenColor,
  lightenColor,
  defaultThemeConfig,
  defaultBrandingConfig,
  defaultTypographyConfig,
  defaultLayoutConfig
}; 