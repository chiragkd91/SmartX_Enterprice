/**
 * Welcome Customization Component
 * Shows after login to guide users to customization options
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRBAC } from '../../hooks/useRBAC';
import { useTheme } from './ThemeProvider';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Palette, 
  Settings, 
  Users, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  X
} from 'lucide-react';

interface WelcomeCustomizationProps {
  onDismiss?: () => void;
}

export const WelcomeCustomization: React.FC<WelcomeCustomizationProps> = ({ onDismiss }) => {
  const navigate = useNavigate();
  const { isAdmin, isManager } = useRBAC();
  const { branding, theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show welcome message after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCustomize = () => {
    navigate('/customization');
    onDismiss?.();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  // Only show for admins and managers
  if (!isAdmin() && !isManager()) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="text-center">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold mb-2">
                Welcome to {branding.appName}! 🎉
              </CardTitle>
              <CardDescription className="text-lg">
                Your portal is ready for customization
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quick Setup Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Theme & Branding</h3>
              </div>
              <p className="text-sm text-gray-600">
                Customize colors, logo, and company branding
              </p>
              <Badge variant="secondary" className="w-fit">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready to customize
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Module Management</h3>
              </div>
              <p className="text-sm text-gray-600">
                Enable or disable portal modules
              </p>
              <Badge variant="secondary" className="w-fit">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready to configure
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">User Management</h3>
              </div>
              <p className="text-sm text-gray-600">
                Set up roles and permissions
              </p>
              <Badge variant="secondary" className="w-fit">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready to configure
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Security Settings</h3>
              </div>
              <p className="text-sm text-gray-600">
                Configure security and authentication
              </p>
              <Badge variant="secondary" className="w-fit">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready to configure
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleCustomize}
              className="flex-1"
              style={{
                backgroundColor: theme.primary.light,
                color: theme.primary.contrast
              }}
            >
              <Palette className="h-4 w-4 mr-2" />
              Start Customizing
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>

          {/* Quick Tips */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">💡 Quick Tips:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You can access customization anytime from the header palette icon</li>
              <li>• Changes are saved automatically and applied immediately</li>
              <li>• Export your settings to backup or share configurations</li>
              <li>• Only admins and managers can access customization settings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeCustomization; 