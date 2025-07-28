import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, Wifi, WifiOff, Bell, BellOff, Download, Upload,
  RefreshCw, CheckCircle, AlertTriangle, Settings, Battery, Signal,
  Camera, QrCode, Fingerprint, Eye, EyeOff, MapPin, Clock,
  Zap, Shield, Database, Cloud, CloudOff
} from 'lucide-react';

interface OfflineData {
  id: string;
  type: 'employee' | 'attendance' | 'leave' | 'payroll' | 'reports';
  name: string;
  size: number;
  lastSync: Date;
  status: 'synced' | 'pending' | 'failed' | 'syncing';
  priority: 'high' | 'medium' | 'low';
}

interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

interface MobileOptimization {
  feature: string;
  status: 'enabled' | 'disabled' | 'optimizing';
  performance: number;
  batteryImpact: 'low' | 'medium' | 'high';
  dataUsage: 'low' | 'medium' | 'high';
  description: string;
}

const EnhancedMobileFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState('offline');
  const [loading, setLoading] = useState(false);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [optimizations, setOptimizations] = useState<MobileOptimization[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed' | 'failed'>('idle');
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'weak'>('online');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [dataUsage, setDataUsage] = useState(2.4);

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOfflineData([
        {
          id: 'emp-001',
          type: 'employee',
          name: 'Employee Directory',
          size: 2.4,
          lastSync: new Date('2024-01-20T10:30:00'),
          status: 'synced',
          priority: 'high'
        },
        {
          id: 'att-001',
          type: 'attendance',
          name: 'Attendance Records',
          size: 1.8,
          lastSync: new Date('2024-01-20T09:15:00'),
          status: 'syncing',
          priority: 'high'
        },
        {
          id: 'leave-001',
          type: 'leave',
          name: 'Leave Requests',
          size: 0.5,
          lastSync: new Date('2024-01-20T08:45:00'),
          status: 'pending',
          priority: 'medium'
        },
        {
          id: 'pay-001',
          type: 'payroll',
          name: 'Payroll Data',
          size: 3.2,
          lastSync: new Date('2024-01-19T16:30:00'),
          status: 'failed',
          priority: 'high'
        }
      ]);

      setNotifications([
        {
          id: 'notif-001',
          title: 'Attendance Reminder',
          message: 'Please mark your attendance for today',
          type: 'info',
          timestamp: new Date('2024-01-20T09:00:00'),
          read: false,
          action: 'Mark Attendance',
          priority: 'high'
        },
        {
          id: 'notif-002',
          title: 'Leave Approved',
          message: 'Your leave request for Jan 25-26 has been approved',
          type: 'success',
          timestamp: new Date('2024-01-20T08:30:00'),
          read: true,
          action: 'View Details',
          priority: 'medium'
        },
        {
          id: 'notif-003',
          title: 'System Maintenance',
          message: 'Scheduled maintenance from 2-4 AM tonight',
          type: 'warning',
          timestamp: new Date('2024-01-20T07:15:00'),
          read: false,
          action: 'Dismiss',
          priority: 'low'
        }
      ]);

      setOptimizations([
        {
          feature: 'Image Compression',
          status: 'enabled',
          performance: 85,
          batteryImpact: 'low',
          dataUsage: 'low',
          description: 'Automatically compresses images to reduce data usage'
        },
        {
          feature: 'Background Sync',
          status: 'enabled',
          performance: 92,
          batteryImpact: 'medium',
          dataUsage: 'medium',
          description: 'Syncs data in background when connection is available'
        },
        {
          feature: 'Offline Mode',
          status: 'enabled',
          performance: 78,
          batteryImpact: 'low',
          dataUsage: 'low',
          description: 'Provides full functionality without internet connection'
        },
        {
          feature: 'Push Notifications',
          status: 'enabled',
          performance: 95,
          batteryImpact: 'low',
          dataUsage: 'low',
          description: 'Real-time notifications for important updates'
        },
        {
          feature: 'Data Caching',
          status: 'optimizing',
          performance: 88,
          batteryImpact: 'medium',
          dataUsage: 'medium',
          description: 'Caches frequently accessed data for faster loading'
        }
      ]);

      setLoading(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Bell className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('completed');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Mobile Features</h1>
          <p className="text-gray-600 mt-2">
            Advanced mobile optimizations, offline sync, and push notifications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Smartphone className="h-4 w-4" />
            <span>Mobile Optimized</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <span>Offline Ready</span>
          </Badge>
        </div>
      </div>

      {/* Connection Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {connectionStatus === 'online' ? (
                  <Wifi className="h-5 w-5 text-green-600" />
                ) : connectionStatus === 'offline' ? (
                  <WifiOff className="h-5 w-5 text-red-600" />
                ) : (
                  <Wifi className="h-5 w-5 text-yellow-600" />
                )}
                <span className="font-medium">Connection</span>
              </div>
              <Badge className={connectionStatus === 'online' ? 'bg-green-100 text-green-800' : 
                               connectionStatus === 'offline' ? 'bg-red-100 text-red-800' : 
                               'bg-yellow-100 text-yellow-800'}>
                {connectionStatus.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Battery className={`h-5 w-5 ${getBatteryColor(batteryLevel)}`} />
                <span className="font-medium">Battery</span>
              </div>
              <span className={`font-bold ${getBatteryColor(batteryLevel)}`}>{batteryLevel}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Data Used</span>
              </div>
              <span className="font-bold text-blue-600">{dataUsage} GB</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                                <RefreshCw className={`h-5 w-5 ${syncStatus === 'syncing' ? 'animate-spin text-blue-600' :
                  syncStatus === 'completed' ? 'text-green-600' :
                  syncStatus === 'failed' ? 'text-red-600' : 'text-gray-600'}`} />
                <span className="font-medium">Sync Status</span>
              </div>
              <Badge className={syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' : 
                               syncStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                               syncStatus === 'failed' ? 'bg-red-100 text-red-800' : 
                               'bg-gray-100 text-gray-800'}>
                {syncStatus.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="offline" className="flex items-center space-x-2">
            <Cloud className="h-4 w-4" />
            <span>Offline Sync</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Push Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="optimizations" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Optimizations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  <span>Offline Data</span>
                </CardTitle>
                <CardDescription>
                  Data available offline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {offlineData.filter(d => d.status === 'synced').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Items synced
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CloudOff className="h-5 w-5 text-orange-600" />
                  <span>Pending Sync</span>
                </CardTitle>
                <CardDescription>
                  Data waiting to sync
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {offlineData.filter(d => d.status === 'pending' || d.status === 'failed').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Items pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-green-600" />
                  <span>Total Size</span>
                </CardTitle>
                <CardDescription>
                  Offline data size
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {offlineData.reduce((sum, d) => sum + d.size, 0).toFixed(1)} MB
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Cached data
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Offline Synchronization</CardTitle>
              <CardDescription>
                Manage offline data and synchronization status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offlineData.map((data) => (
                  <div key={data.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{data.name}</h3>
                            <Badge className={getStatusColor(data.status)}>
                              {data.status.toUpperCase()}
                            </Badge>
                            <Badge className={getPriorityColor(data.priority)}>
                              {data.priority.toUpperCase()} PRIORITY
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Type: {data.type} | Size: {data.size} MB | 
                            Last Sync: {data.lastSync.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {data.size} MB
                        </div>
                        <div className="text-sm text-gray-600">
                          Data size
                        </div>
                      </div>
                    </div>

                    {data.status === 'syncing' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Syncing...</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    )}

                    {data.status === 'failed' && (
                      <Alert className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Sync failed. Check your internet connection and try again.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={handleSync} disabled={syncStatus === 'syncing'}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Sync All'}
                </Button>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Sync Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Total Notifications</span>
                </CardTitle>
                <CardDescription>
                  Notifications received today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{notifications.length}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Today's notifications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  <span>Unread</span>
                </CardTitle>
                <CardDescription>
                  Unread notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {notifications.filter(n => !n.read).length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>High Priority</span>
                </CardTitle>
                <CardDescription>
                  High priority notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {notifications.filter(n => n.priority === 'high').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Important alerts
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Manage and view push notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`border rounded-lg p-4 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.read && (
                              <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                            )}
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {notification.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          {notification.action}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{notification.message}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline">
                  <BellOff className="h-4 w-4 mr-2" />
                  Disable All
                </Button>
                <Button>
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span>Performance Score</span>
                </CardTitle>
                <CardDescription>
                  Overall mobile performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(optimizations.reduce((sum, o) => sum + o.performance, 0) / optimizations.length)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Average score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Battery className="h-5 w-5 text-orange-600" />
                  <span>Battery Impact</span>
                </CardTitle>
                <CardDescription>
                  Battery usage optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {optimizations.filter(o => o.batteryImpact === 'low').length}/{optimizations.length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Low impact features
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>Data Usage</span>
                </CardTitle>
                <CardDescription>
                  Data consumption optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {optimizations.filter(o => o.dataUsage === 'low').length}/{optimizations.length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Low usage features
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mobile Optimizations</CardTitle>
              <CardDescription>
                Performance and battery optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {optimizations.map((optimization, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{optimization.feature}</h3>
                            <Badge className={optimization.status === 'enabled' ? 'bg-green-100 text-green-800' : 
                                             optimization.status === 'disabled' ? 'bg-red-100 text-red-800' : 
                                             'bg-yellow-100 text-yellow-800'}>
                              {optimization.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{optimization.description}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={optimization.status === 'enabled'} 
                        disabled={optimization.status === 'optimizing'}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Performance</span>
                          <span>{optimization.performance}%</span>
                        </div>
                        <Progress value={optimization.performance} className="h-2" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Battery Impact</div>
                        <Badge className={optimization.batteryImpact === 'low' ? 'bg-green-100 text-green-800' : 
                                         optimization.batteryImpact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-red-100 text-red-800'}>
                          {optimization.batteryImpact.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Data Usage</div>
                        <Badge className={optimization.dataUsage === 'low' ? 'bg-green-100 text-green-800' : 
                                         optimization.dataUsage === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-red-100 text-red-800'}>
                          {optimization.dataUsage.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Settings
        </Button>
        <Button>
          <Smartphone className="h-4 w-4 mr-2" />
          Mobile Dashboard
        </Button>
      </div>
    </div>
  );
};

export default EnhancedMobileFeatures; 