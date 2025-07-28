/**
 * Customization Screen for SmartBizFlow Portal
 * Allows users to customize portal settings after login
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/Customization/ThemeProvider';
import { useModules } from '../components/Customization/ModuleProvider';
import { useRBAC } from '../hooks/useRBAC';
import { useStore } from '../store/useStore';
import { 
  Palette, 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Globe, 
  Bell, 
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  Download,
  Check,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { toast } from '../hooks/use-toast';

interface CustomizationSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
  };
  branding: {
    appName: string;
    logo: string;
    favicon: string;
    companyName: string;
    companyWebsite: string;
  };
  modules: {
    dashboard: boolean;
    crm: boolean;
    erp: boolean;
    hr: boolean;
    itAssets: boolean;
    gst: boolean;
    businessIntelligence: boolean;
    automation: boolean;
    fileManagement: boolean;
    userManagement: boolean;
    reports: boolean;
    settings: boolean;
  };
  features: {
    notifications: boolean;
    search: boolean;
    breadcrumbs: boolean;
    sidebarCollapsible: boolean;
    userCustomization: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: boolean;
    auditLogging: boolean;
  };
  integrations: {
    email: boolean;
    sms: boolean;
    paymentGateway: boolean;
    calendar: boolean;
  };
}

export const Customization: React.FC = () => {
  const { theme, branding, updateTheme, updateBranding } = useTheme();
  const { enabledModules, isModuleEnabled, refreshModules } = useModules();
  const { isAdmin, canManageSettings } = useRBAC();
  const { currentUser } = useStore();

  const [settings, setSettings] = useState<CustomizationSettings>({
    theme: {
      primaryColor: theme.primary.light,
      secondaryColor: theme.secondary.light,
      accentColor: theme.accent.light,
      darkMode: false
    },
    branding: {
      appName: branding.appName,
      logo: branding.logo.url,
      favicon: branding.favicon,
      companyName: branding.companyName,
      companyWebsite: branding.companyWebsite
    },
    modules: {
      dashboard: isModuleEnabled('dashboard'),
      crm: isModuleEnabled('crm'),
      erp: isModuleEnabled('erp'),
      hr: isModuleEnabled('hr'),
      itAssets: isModuleEnabled('itAssets'),
      gst: isModuleEnabled('gst'),
      businessIntelligence: isModuleEnabled('businessIntelligence'),
      automation: isModuleEnabled('automation'),
      fileManagement: isModuleEnabled('fileManagement'),
      userManagement: isModuleEnabled('userManagement'),
      reports: isModuleEnabled('reports'),
      settings: isModuleEnabled('settings')
    },
    features: {
      notifications: true,
      search: true,
      breadcrumbs: true,
      sidebarCollapsible: true,
      userCustomization: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 3600,
      passwordPolicy: true,
      auditLogging: true
    },
    integrations: {
      email: true,
      sms: false,
      paymentGateway: true,
      calendar: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Check if user has permission to customize
  if (!isAdmin() && !canManageSettings()) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
              <p className="text-gray-600">
                You don't have permission to access customization settings.
                Please contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update theme
      updateTheme({
        primary: {
          ...theme.primary,
          light: settings.theme.primaryColor,
          dark: settings.theme.primaryColor
        },
        secondary: {
          ...theme.secondary,
          light: settings.theme.secondaryColor,
          dark: settings.theme.secondaryColor
        },
        accent: {
          ...theme.accent,
          light: settings.theme.accentColor,
          dark: settings.theme.accentColor
        }
      });

      // Update branding
      updateBranding({
        appName: settings.branding.appName,
        logo: {
          ...branding.logo,
          url: settings.branding.logo
        },
        favicon: settings.branding.favicon,
        companyName: settings.branding.companyName,
        companyWebsite: settings.branding.companyWebsite
      });

      // Save to localStorage for persistence
      localStorage.setItem('smartbizflow-customization', JSON.stringify(settings));

      toast({
        title: "Settings Saved",
        description: "Your customization settings have been saved successfully.",
      });

      // Refresh modules
      refreshModules();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        accentColor: '#F59E0B',
        darkMode: false
      },
      branding: {
        appName: 'SmartBizFlow',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        companyName: 'SmartBizFlow Solutions',
        companyWebsite: 'https://smartbizflow.com'
      },
      modules: {
        dashboard: true,
        crm: true,
        erp: true,
        hr: true,
        itAssets: true,
        gst: true,
        businessIntelligence: true,
        automation: true,
        fileManagement: true,
        userManagement: true,
        reports: true,
        settings: true
      },
      features: {
        notifications: true,
        search: true,
        breadcrumbs: true,
        sidebarCollapsible: true,
        userCustomization: true
      },
      security: {
        twoFactorAuth: true,
        sessionTimeout: 3600,
        passwordPolicy: true,
        auditLogging: true
      },
      integrations: {
        email: true,
        sms: false,
        paymentGateway: true,
        calendar: true
      }
    });

    toast({
      title: "Settings Reset",
      description: "Settings have been reset to default values.",
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smartbizflow-customization.json';
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Settings Exported",
      description: "Customization settings have been exported successfully.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          toast({
            title: "Settings Imported",
            description: "Customization settings have been imported successfully.",
          });
        } catch (error) {
          toast({
            title: "Import Error",
            description: "Failed to import settings. Please check the file format.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portal Customization</h1>
          <p className="text-gray-600 mt-2">
            Customize your SmartBizFlow portal settings and appearance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Preview Mode Banner */}
      {previewMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Preview Mode</span>
            <span className="text-blue-600 ml-2">
              Changes are being previewed. Click "Save Changes" to apply them permanently.
            </span>
          </div>
        </div>
      )}

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="theme" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* Theme Tab */}
        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize the primary colors and appearance of your portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, primaryColor: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.theme.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, primaryColor: e.target.value }
                      })}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, secondaryColor: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.theme.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, secondaryColor: e.target.value }
                      })}
                      placeholder="#10B981"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.theme.accentColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, accentColor: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.theme.accentColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, accentColor: e.target.value }
                      })}
                      placeholder="#F59E0B"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="darkMode"
                      checked={settings.theme.darkMode}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, darkMode: checked }
                      })}
                    />
                    <span className="text-sm text-gray-600">
                      {settings.theme.darkMode ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="mt-6">
                <Label>Color Preview</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div 
                    className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: settings.theme.primaryColor }}
                  >
                    Primary
                  </div>
                  <div 
                    className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: settings.theme.secondaryColor }}
                  >
                    Secondary
                  </div>
                  <div 
                    className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: settings.theme.accentColor }}
                  >
                    Accent
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Identity</CardTitle>
              <CardDescription>
                Customize your company branding and portal identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    value={settings.branding.appName}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, appName: e.target.value }
                    })}
                    placeholder="SmartBizFlow"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.branding.companyName}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, companyName: e.target.value }
                    })}
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    value={settings.branding.companyWebsite}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, companyWebsite: e.target.value }
                    })}
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={settings.branding.logo}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, logo: e.target.value }
                    })}
                    placeholder="/logo.png"
                  />
                </div>
              </div>

              {/* Logo Preview */}
              <div className="mt-6">
                <Label>Logo Preview</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <img 
                    src={settings.branding.logo} 
                    alt="Logo Preview"
                    className="h-12 w-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-gray-500 text-sm">
                    Logo not found. Please check the URL.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Management</CardTitle>
              <CardDescription>
                Enable or disable portal modules based on your business needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(settings.modules).map(([module, enabled]) => (
                  <div key={module} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium capitalize">
                        {module.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {enabled ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        modules: { ...settings.modules, [module]: checked }
                      })}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
              <CardDescription>
                Configure portal features and user experience options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(settings.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feature === 'notifications' && 'Enable system notifications'}
                        {feature === 'search' && 'Enable global search functionality'}
                        {feature === 'breadcrumbs' && 'Show navigation breadcrumbs'}
                        {feature === 'sidebarCollapsible' && 'Allow sidebar to be collapsed'}
                        {feature === 'userCustomization' && 'Allow users to customize their dashboard'}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        features: { ...settings.features, [feature]: checked }
                      })}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {Object.entries(settings.security).map(([setting, value]) => (
                  <div key={setting} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">
                        {setting.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {setting === 'twoFactorAuth' && 'Require two-factor authentication'}
                        {setting === 'sessionTimeout' && 'Session timeout in seconds'}
                        {setting === 'passwordPolicy' && 'Enforce strong password policy'}
                        {setting === 'auditLogging' && 'Enable audit logging for all actions'}
                      </p>
                    </div>
                    {setting === 'sessionTimeout' ? (
                      <Input
                        type="number"
                        value={value as number}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, [setting]: parseInt(e.target.value) }
                        })}
                        className="w-32"
                      />
                    ) : (
                      <Switch
                        checked={value as boolean}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          security: { ...settings.security, [setting]: checked }
                        })}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure third-party integrations and external services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(settings.integrations).map(([integration, enabled]) => (
                  <div key={integration} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">
                        {integration.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {integration === 'email' && 'Email service integration'}
                        {integration === 'sms' && 'SMS notification service'}
                        {integration === 'paymentGateway' && 'Payment gateway integration'}
                        {integration === 'calendar' && 'Calendar service integration'}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        integrations: { ...settings.integrations, [integration]: checked }
                      })}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import/Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore</CardTitle>
          <CardDescription>
            Export your current settings or import previously saved configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customization; 