import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Bell, 
  BellOff, 
  Download, 
  Share2, 
  Camera, 
  QrCode,
  MapPin,
  Fingerprint,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Zap,
  Shield,
  Clock,
  Battery,
  Signal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PWAFeaturesProps {
  isOnline: boolean;
  isInstalled: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface DeviceInfo {
  battery: number;
  signal: number;
  location: string;
  biometrics: boolean;
  camera: boolean;
  offline: boolean;
}

export default function PWAFeatures({ isOnline, isInstalled }: PWAFeaturesProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    battery: 85,
    signal: 4,
    location: 'San Francisco, CA',
    biometrics: true,
    camera: true,
    offline: false
  });
  const [pwaSettings, setPwaSettings] = useState({
    pushNotifications: true,
    offlineMode: true,
    backgroundSync: true,
    biometricAuth: true,
    locationServices: true,
    cameraAccess: true
  });
  const { toast } = useToast();

  useEffect(() => {
    // Mock notifications
    setNotifications([
      {
        id: '1',
        title: 'Attendance Reminder',
        message: 'Don\'t forget to check in for today\'s work',
        type: 'info',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        title: 'Leave Approved',
        message: 'Your leave request for next week has been approved',
        type: 'success',
        timestamp: new Date(Date.now() - 3600000),
        read: true
      },
      {
        id: '3',
        title: 'Training Available',
        message: 'New training course "Leadership Skills" is now available',
        type: 'info',
        timestamp: new Date(Date.now() - 7200000),
        read: false
      }
    ]);
  }, []);

  const handleInstallPWA = async () => {
    try {
      // Simulate PWA installation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: 'PWA Installed',
        description: 'SmartBizFlow has been installed on your device',
      });
    } catch (error) {
      toast({
        title: 'Installation Failed',
        description: 'Failed to install PWA. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleNotification = async (enabled: boolean) => {
    try {
      if (enabled) {
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setPwaSettings(prev => ({ ...prev, pushNotifications: true }));
          toast({
            title: 'Notifications Enabled',
            description: 'You will now receive push notifications',
          });
        } else {
          toast({
            title: 'Permission Denied',
            description: 'Please enable notifications in your browser settings',
            variant: 'destructive',
          });
        }
      } else {
        setPwaSettings(prev => ({ ...prev, pushNotifications: false }));
        toast({
          title: 'Notifications Disabled',
          description: 'Push notifications have been turned off',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification settings',
        variant: 'destructive',
      });
    }
  };

  const handleSendTestNotification = async () => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('Test Notification', {
          body: 'This is a test notification from SmartBizFlow',
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: 'test-notification'
        });
        toast({
          title: 'Test Notification Sent',
          description: 'Check your notification panel',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send test notification',
        variant: 'destructive',
      });
    }
  };

  const handleShareApp = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SmartBizFlow HR Portal',
          text: 'Check out this amazing HR management app!',
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied',
          description: 'App link copied to clipboard',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share app',
        variant: 'destructive',
      });
    }
  };

  const handleScanQR = async () => {
    try {
      // Simulate QR code scanning
      toast({
        title: 'QR Scanner',
        description: 'QR code scanning feature activated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to activate QR scanner',
        variant: 'destructive',
      });
    }
  };

  const handleBiometricAuth = async () => {
    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Biometric Authentication',
        description: 'Authentication successful using biometrics',
      });
    } catch (error) {
      toast({
        title: 'Authentication Failed',
        description: 'Biometric authentication failed',
        variant: 'destructive',
      });
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Smartphone className="h-8 w-8 text-blue-600" />
            Mobile PWA Features
          </h1>
          <p className="text-muted-foreground">
            Progressive Web App capabilities and mobile-specific features
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShareApp}>
            <Share2 className="h-4 w-4 mr-2" />
            Share App
          </Button>
          {!isInstalled && (
            <Button onClick={handleInstallPWA}>
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connection</p>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </div>
              {isOnline ? <Wifi className="h-8 w-8 text-green-600" /> : <WifiOff className="h-8 w-8 text-red-600" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isOnline ? 'Connected to server' : 'Working offline'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Battery</p>
                <p className="text-2xl font-bold text-blue-600">{deviceInfo.battery}%</p>
              </div>
              <Battery className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {deviceInfo.battery > 20 ? 'Good battery life' : 'Low battery warning'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Signal</p>
                <p className="text-2xl font-bold text-purple-600">{deviceInfo.signal}/5</p>
              </div>
              <Signal className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {deviceInfo.signal >= 3 ? 'Strong signal' : 'Weak signal'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => !n.read).length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {notifications.filter(n => !n.read).length > 0 ? 'Unread notifications' : 'All caught up'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PWA Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  PWA Status
                </CardTitle>
                <CardDescription>
                  Current Progressive Web App capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Installation</span>
                    </div>
                    <Badge variant={isInstalled ? 'secondary' : 'outline'}>
                      {isInstalled ? 'Installed' : 'Not Installed'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      <span>Offline Mode</span>
                    </div>
                    <Badge variant={pwaSettings.offlineMode ? 'secondary' : 'outline'}>
                      {pwaSettings.offlineMode ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Push Notifications</span>
                    </div>
                    <Badge variant={pwaSettings.pushNotifications ? 'secondary' : 'outline'}>
                      {pwaSettings.pushNotifications ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Biometric Auth</span>
                    </div>
                    <Badge variant={pwaSettings.biometricAuth ? 'secondary' : 'outline'}>
                      {pwaSettings.biometricAuth ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Information
                </CardTitle>
                <CardDescription>
                  Current device capabilities and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Location</span>
                    <span className="text-sm text-muted-foreground">{deviceInfo.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Biometrics</span>
                    <Badge variant={deviceInfo.biometrics ? 'secondary' : 'outline'}>
                      {deviceInfo.biometrics ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Camera</span>
                    <Badge variant={deviceInfo.camera ? 'secondary' : 'outline'}>
                      {deviceInfo.camera ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Offline Storage</span>
                    <Badge variant="secondary">2.5 GB Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common mobile-specific actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" onClick={handleBiometricAuth} className="h-20 flex-col">
                  <Fingerprint className="h-6 w-6 mb-2" />
                  <span className="text-sm">Biometric Login</span>
                </Button>
                
                <Button variant="outline" onClick={handleScanQR} className="h-20 flex-col">
                  <QrCode className="h-6 w-6 mb-2" />
                  <span className="text-sm">Scan QR Code</span>
                </Button>
                
                <Button variant="outline" onClick={handleSendTestNotification} className="h-20 flex-col">
                  <Bell className="h-6 w-6 mb-2" />
                  <span className="text-sm">Test Notification</span>
                </Button>
                
                <Button variant="outline" onClick={handleShareApp} className="h-20 flex-col">
                  <Share2 className="h-6 w-6 mb-2" />
                  <span className="text-sm">Share App</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>
                Manage notification preferences and view recent notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications even when app is closed
                        </p>
                      </div>
                      <Switch
                        checked={pwaSettings.pushNotifications}
                        onCheckedChange={handleToggleNotification}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Background Sync</p>
                        <p className="text-sm text-muted-foreground">
                          Sync data in the background
                        </p>
                      </div>
                      <Switch
                        checked={pwaSettings.backgroundSync}
                        onCheckedChange={(checked) => 
                          setPwaSettings(prev => ({ ...prev, backgroundSync: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Recent Notifications</h3>
                    <Badge variant="outline">
                      {notifications.filter(n => !n.read).length} unread
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          notification.read ? 'bg-muted/50' : 'bg-background hover:bg-muted/50'
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Offline Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5" />
                  Offline Features
                </CardTitle>
                <CardDescription>
                  Functionality available without internet connection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>View employee profiles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Check attendance history</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Access training materials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>View company policies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span>Queue actions for sync</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Features
                </CardTitle>
                <CardDescription>
                  Device-specific capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Camera className="h-4 w-4 text-blue-600" />
                    <span>Document scanning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Fingerprint className="h-4 w-4 text-green-600" />
                    <span>Biometric authentication</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span>Location-based features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <QrCode className="h-4 w-4 text-orange-600" />
                    <span>QR code scanning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-red-600" />
                    <span>Push notifications</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                PWA Settings
              </CardTitle>
              <CardDescription>
                Configure Progressive Web App preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Offline Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Enable offline functionality and data caching
                      </p>
                    </div>
                    <Switch
                      checked={pwaSettings.offlineMode}
                      onCheckedChange={(checked) => 
                        setPwaSettings(prev => ({ ...prev, offlineMode: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Background Sync</p>
                      <p className="text-sm text-muted-foreground">
                        Sync data automatically in the background
                      </p>
                    </div>
                    <Switch
                      checked={pwaSettings.backgroundSync}
                      onCheckedChange={(checked) => 
                        setPwaSettings(prev => ({ ...prev, backgroundSync: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Biometric Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition for login
                      </p>
                    </div>
                    <Switch
                      checked={pwaSettings.biometricAuth}
                      onCheckedChange={(checked) => 
                        setPwaSettings(prev => ({ ...prev, biometricAuth: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Location Services</p>
                      <p className="text-sm text-muted-foreground">
                        Allow location-based features
                      </p>
                    </div>
                    <Switch
                      checked={pwaSettings.locationServices}
                      onCheckedChange={(checked) => 
                        setPwaSettings(prev => ({ ...prev, locationServices: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Camera Access</p>
                      <p className="text-sm text-muted-foreground">
                        Allow camera for document scanning
                      </p>
                    </div>
                    <Switch
                      checked={pwaSettings.cameraAccess}
                      onCheckedChange={(checked) => 
                        setPwaSettings(prev => ({ ...prev, cameraAccess: checked }))
                      }
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Advanced Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 