/**
 * Session Configuration Component - Allows admins to configure session timeouts
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Clock, 
  Shield, 
  Users, 
  Timer, 
  Settings, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SessionConfigData {
  admin: {
    timeoutMinutes: number;
    warningMinutes: number;
    extendMinutes: number;
    trackActivity: boolean;
  };
  manager: {
    timeoutMinutes: number;
    warningMinutes: number;
    extendMinutes: number;
    trackActivity: boolean;
  };
  staff: {
    timeoutMinutes: number;
    warningMinutes: number;
    extendMinutes: number;
    trackActivity: boolean;
  };
  viewer: {
    timeoutMinutes: number;
    warningMinutes: number;
    extendMinutes: number;
    trackActivity: boolean;
  };
}

const defaultConfigs: SessionConfigData = {
  admin: {
    timeoutMinutes: 480, // 8 hours
    warningMinutes: 10,
    extendMinutes: 120,
    trackActivity: true
  },
  manager: {
    timeoutMinutes: 240, // 4 hours
    warningMinutes: 5,
    extendMinutes: 60,
    trackActivity: true
  },
  staff: {
    timeoutMinutes: 120, // 2 hours
    warningMinutes: 5,
    extendMinutes: 30,
    trackActivity: true
  },
  viewer: {
    timeoutMinutes: 60, // 1 hour
    warningMinutes: 5,
    extendMinutes: 30,
    trackActivity: true
  }
};

export default function SessionConfig() {
  const [configs, setConfigs] = useState<SessionConfigData>(defaultConfigs);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleConfigChange = (role: keyof SessionConfigData, field: string, value: number | boolean) => {
    setConfigs(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save configurations
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store in localStorage for demo
      localStorage.setItem('session_configs', JSON.stringify(configs));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save session configs:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setConfigs(defaultConfigs);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-5 w-5 text-red-600" />;
      case 'manager': return <Users className="h-5 w-5 text-blue-600" />;
      case 'staff': return <Timer className="h-5 w-5 text-green-600" />;
      case 'viewer': return <Clock className="h-5 w-5 text-gray-600" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'border-red-200 bg-red-50';
      case 'manager': return 'border-blue-200 bg-blue-50';
      case 'staff': return 'border-green-200 bg-green-50';
      case 'viewer': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Session Management</h2>
          <p className="text-gray-600">Configure automatic logout settings for different user roles</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset Defaults</span>
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800">
            Session configuration saved successfully! Changes will apply to new login sessions.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {Object.keys(configs).map((role) => (
            <TabsTrigger 
              key={role} 
              value={role}
              className="flex items-center space-x-2"
            >
              {getRoleIcon(role)}
              <span className="capitalize">{role}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(configs).map(([role, config]) => (
          <TabsContent key={role} value={role}>
            <Card className={getRoleColor(role)}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getRoleIcon(role)}
                  <span className="capitalize">{role} Session Settings</span>
                  <Badge variant="secondary" className="ml-auto">
                    {formatDuration(config.timeoutMinutes)} timeout
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Configure session timeout and security settings for {role} users
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Session Timeout */}
                  <div className="space-y-2">
                    <Label htmlFor={`${role}-timeout`} className="text-sm font-medium">
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      id={`${role}-timeout`}
                      type="number"
                      min="15"
                      max="480"
                      value={config.timeoutMinutes}
                      onChange={(e) => handleConfigChange(
                        role as keyof SessionConfigData, 
                        'timeoutMinutes', 
                        parseInt(e.target.value)
                      )}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Duration: {formatDuration(config.timeoutMinutes)}
                    </p>
                  </div>

                  {/* Warning Time */}
                  <div className="space-y-2">
                    <Label htmlFor={`${role}-warning`} className="text-sm font-medium">
                      Warning Before (minutes)
                    </Label>
                    <Input
                      id={`${role}-warning`}
                      type="number"
                      min="1"
                      max="30"
                      value={config.warningMinutes}
                      onChange={(e) => handleConfigChange(
                        role as keyof SessionConfigData, 
                        'warningMinutes', 
                        parseInt(e.target.value)
                      )}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Warning at: {formatDuration(config.timeoutMinutes - config.warningMinutes)} remaining
                    </p>
                  </div>

                  {/* Extension Duration */}
                  <div className="space-y-2">
                    <Label htmlFor={`${role}-extend`} className="text-sm font-medium">
                      Extension Duration (minutes)
                    </Label>
                    <Input
                      id={`${role}-extend`}
                      type="number"
                      min="15"
                      max="120"
                      value={config.extendMinutes}
                      onChange={(e) => handleConfigChange(
                        role as keyof SessionConfigData, 
                        'extendMinutes', 
                        parseInt(e.target.value)
                      )}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Extend by: {formatDuration(config.extendMinutes)}
                    </p>
                  </div>
                </div>

                {/* Activity Tracking */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Activity Tracking</Label>
                    <p className="text-xs text-gray-500">
                      Monitor user activity to reset session timer
                    </p>
                  </div>
                  <Switch
                    checked={config.trackActivity}
                    onCheckedChange={(checked) => handleConfigChange(
                      role as keyof SessionConfigData, 
                      'trackActivity', 
                      checked
                    )}
                  />
                </div>

                {/* Security Info */}
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Security Note:</strong> Shorter timeouts provide better security but may impact user experience. 
                    Consider the role's typical workflow when setting timeouts.
                  </AlertDescription>
                </Alert>

                {/* Role-specific Recommendations */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Recommended Settings for {role.charAt(0).toUpperCase() + role.slice(1)}
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    {role === 'admin' && (
                      <>
                        <p>• Longer sessions for administrative tasks</p>
                        <p>• Extended warning time for important operations</p>
                        <p>• Activity tracking for security</p>
                      </>
                    )}
                    {role === 'manager' && (
                      <>
                        <p>• Balanced timeout for management workflows</p>
                        <p>• Quick session extension for meetings</p>
                        <p>• Activity tracking recommended</p>
                      </>
                    )}
                    {role === 'staff' && (
                      <>
                        <p>• Standard timeout for daily operations</p>
                        <p>• Brief warning period</p>
                        <p>• Activity tracking for security</p>
                      </>
                    )}
                    {role === 'viewer' && (
                      <>
                        <p>• Shortest timeout for read-only access</p>
                        <p>• Quick logout for security</p>
                        <p>• Limited extension time</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
