import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, Bluetooth, Smartphone, Monitor, Printer, Camera, 
  Activity, CheckCircle, AlertTriangle, Settings, RefreshCw, 
  Plus, Eye, Zap, Shield, Database, Thermometer, Lightbulb,
  Lock, Unlock, Volume2, VolumeX, WifiOff, BluetoothOff,
  Cpu, Network, Cloud, HardDrive, Clock
} from 'lucide-react';

interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'camera' | 'printer' | 'lighting' | 'security' | 'environmental';
  status: 'online' | 'offline' | 'maintenance' | 'error';
  location: string;
  ipAddress: string;
  lastSeen: Date;
  batteryLevel: number;
  signalStrength: number;
  dataUsage: number;
  firmware: string;
  features: string[];
}

interface SmartOffice {
  id: string;
  name: string;
  type: 'lighting' | 'climate' | 'security' | 'audio' | 'display';
  status: 'active' | 'inactive' | 'scheduled' | 'manual';
  currentValue: number;
  targetValue: number;
  unit: string;
  lastUpdated: Date;
  automation: boolean;
  schedule: string[];
}

interface IoTMetrics {
  totalDevices: number;
  onlineDevices: number;
  dataUsage: number;
  energyConsumption: number;
  networkStatus: 'healthy' | 'congested' | 'maintenance';
  securityStatus: 'secure' | 'warning' | 'breach';
}

const IoTConnectivity: React.FC = () => {
  const [activeTab, setActiveTab] = useState('devices');
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [smartOffice, setSmartOffice] = useState<SmartOffice[]>([]);
  const [metrics, setMetrics] = useState<IoTMetrics>({
    totalDevices: 0,
    onlineDevices: 0,
    dataUsage: 0,
    energyConsumption: 0,
    networkStatus: 'healthy',
    securityStatus: 'secure'
  });

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setDevices([
        {
          id: 'device-001',
          name: 'Office Temperature Sensor',
          type: 'sensor',
          status: 'online',
          location: 'Main Office',
          ipAddress: '192.168.1.101',
          lastSeen: new Date('2024-01-20T10:30:00'),
          batteryLevel: 85,
          signalStrength: 95,
          dataUsage: 2.4,
          firmware: 'v2.1.5',
          features: ['Temperature Monitoring', 'Humidity Sensing', 'Data Logging']
        },
        {
          id: 'device-002',
          name: 'Security Camera - Front Door',
          type: 'camera',
          status: 'online',
          location: 'Front Entrance',
          ipAddress: '192.168.1.102',
          lastSeen: new Date('2024-01-20T10:29:00'),
          batteryLevel: 92,
          signalStrength: 88,
          dataUsage: 15.6,
          firmware: 'v1.8.2',
          features: ['Motion Detection', 'Night Vision', 'Cloud Storage']
        },
        {
          id: 'device-003',
          name: 'Smart Printer - HR Department',
          type: 'printer',
          status: 'online',
          location: 'HR Office',
          ipAddress: '192.168.1.103',
          lastSeen: new Date('2024-01-20T10:28:00'),
          batteryLevel: 100,
          signalStrength: 90,
          dataUsage: 8.2,
          firmware: 'v3.0.1',
          features: ['Wireless Printing', 'Scan to Email', 'Document Management']
        },
        {
          id: 'device-004',
          name: 'Smart Lighting - Conference Room',
          type: 'lighting',
          status: 'online',
          location: 'Conference Room A',
          ipAddress: '192.168.1.104',
          lastSeen: new Date('2024-01-20T10:27:00'),
          batteryLevel: 78,
          signalStrength: 85,
          dataUsage: 1.8,
          firmware: 'v2.0.3',
          features: ['Dimmable Control', 'Color Temperature', 'Motion Sensing']
        },
        {
          id: 'device-005',
          name: 'Access Control System',
          type: 'security',
          status: 'maintenance',
          location: 'Main Building',
          ipAddress: '192.168.1.105',
          lastSeen: new Date('2024-01-20T09:15:00'),
          batteryLevel: 45,
          signalStrength: 60,
          dataUsage: 5.3,
          firmware: 'v1.5.7',
          features: ['Card Access', 'Biometric Authentication', 'Visitor Management']
        }
      ]);

      setSmartOffice([
        {
          id: 'office-001',
          name: 'Conference Room Lighting',
          type: 'lighting',
          status: 'active',
          currentValue: 75,
          targetValue: 80,
          unit: '%',
          lastUpdated: new Date('2024-01-20T10:30:00'),
          automation: true,
          schedule: ['09:00-17:00', 'Auto-dimming at 18:00']
        },
        {
          id: 'office-002',
          name: 'Office Temperature',
          type: 'climate',
          status: 'active',
          currentValue: 22,
          targetValue: 23,
          unit: '°C',
          lastUpdated: new Date('2024-01-20T10:29:00'),
          automation: true,
          schedule: ['08:00-18:00', 'Energy saving at night']
        },
        {
          id: 'office-003',
          name: 'Security System',
          type: 'security',
          status: 'active',
          currentValue: 1,
          targetValue: 1,
          unit: 'status',
          lastUpdated: new Date('2024-01-20T10:28:00'),
          automation: true,
          schedule: ['24/7 monitoring', 'Auto-lock at 20:00']
        },
        {
          id: 'office-004',
          name: 'Audio System',
          type: 'audio',
          status: 'inactive',
          currentValue: 0,
          targetValue: 0,
          unit: '%',
          lastUpdated: new Date('2024-01-20T10:27:00'),
          automation: false,
          schedule: ['Manual control only']
        }
      ]);

      setMetrics({
        totalDevices: 5,
        onlineDevices: 4,
        dataUsage: 33.3,
        energyConsumption: 2.8,
        networkStatus: 'healthy',
        securityStatus: 'secure'
      });

      setLoading(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'offline':
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sensor':
        return <Thermometer className="h-4 w-4" />;
      case 'camera':
        return <Camera className="h-4 w-4" />;
      case 'printer':
        return <Printer className="h-4 w-4" />;
      case 'lighting':
        return <Lightbulb className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'environmental':
        return <Activity className="h-4 w-4" />;
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  const getNetworkStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'congested': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'breach': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IoT Connectivity</h1>
          <p className="text-gray-600 mt-2">
            Smart office features, device integration, and IoT management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Wifi className="h-4 w-4" />
            <span>IoT Connected</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Cpu className="h-4 w-4" />
            <span>Smart Office</span>
          </Badge>
        </div>
      </div>

      <Alert>
        <Cpu className="h-4 w-4" />
        <AlertDescription>
          IoT connectivity enables smart office automation, device monitoring, and intelligent 
          environment control. All devices are securely connected and monitored in real-time.
        </AlertDescription>
      </Alert>

      {/* IoT Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Devices</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalDevices}</p>
              </div>
              <Cpu className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Connected devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Devices</p>
                <p className="text-2xl font-bold text-green-600">{metrics.onlineDevices}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Active devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Usage</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.dataUsage} GB</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Today's usage</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Energy Consumption</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.energyConsumption} kWh</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Today's usage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="devices" className="flex items-center space-x-2">
            <Cpu className="h-4 w-4" />
            <span>IoT Devices</span>
          </TabsTrigger>
          <TabsTrigger value="smart-office" className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Smart Office</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Online Devices</span>
                </CardTitle>
                <CardDescription>
                  Currently connected devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {devices.filter(d => d.status === 'online').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Active connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Network Status</span>
                </CardTitle>
                <CardDescription>
                  IoT network health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${getNetworkStatusColor(metrics.networkStatus)}`}>
                    <Wifi className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-semibold capitalize">{metrics.networkStatus}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Network health
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span>Security Status</span>
                </CardTitle>
                <CardDescription>
                  IoT security status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${getSecurityStatusColor(metrics.securityStatus)}`}>
                    <Shield className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-semibold capitalize">{metrics.securityStatus}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Security status
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>IoT Devices</CardTitle>
              <CardDescription>
                Connected IoT devices and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {devices.map((device) => (
                  <div key={device.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(device.type)}
                            <h3 className="font-semibold">{device.name}</h3>
                            <Badge className={getStatusColor(device.status)}>
                              {device.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {device.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Location: {device.location} | IP: {device.ipAddress}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last Seen: {device.lastSeen.toLocaleString()} | 
                            Firmware: {device.firmware}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {device.batteryLevel}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Battery
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Signal Strength</span>
                          <span>{device.signalStrength}%</span>
                        </div>
                        <Progress value={device.signalStrength} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Battery Level</span>
                          <span>{device.batteryLevel}%</span>
                        </div>
                        <Progress value={device.batteryLevel} className="h-2" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Data Usage</div>
                        <div className="text-lg font-semibold">{device.dataUsage} GB</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Status</div>
                        <Badge className={getStatusColor(device.status)}>
                          {device.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {device.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smart-office" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span>Active Systems</span>
                </CardTitle>
                <CardDescription>
                  Currently active smart systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {smartOffice.filter(s => s.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Running systems
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span>Automation</span>
                </CardTitle>
                <CardDescription>
                  Automated systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {smartOffice.filter(s => s.automation).length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Automated systems
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                  <span>Climate Control</span>
                </CardTitle>
                <CardDescription>
                  Environmental systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {smartOffice.filter(s => s.type === 'climate').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Climate systems
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Smart Office Systems</CardTitle>
              <CardDescription>
                Automated office systems and controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {smartOffice.map((system) => (
                  <div key={system.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(system.type)}
                            <h3 className="font-semibold">{system.name}</h3>
                            <Badge className={getStatusColor(system.status)}>
                              {system.status.toUpperCase()}
                            </Badge>
                            {system.automation && (
                              <Badge className="bg-green-100 text-green-800">
                                AUTOMATED
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Type: {system.type} | Last Updated: {system.lastUpdated.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {system.currentValue}{system.unit}
                        </div>
                        <div className="text-sm text-gray-600">
                          Current Value
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Current Value</span>
                          <span>{system.currentValue}{system.unit}</span>
                        </div>
                        <Progress value={(system.currentValue / system.targetValue) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Target Value</span>
                          <span>{system.targetValue}{system.unit}</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Schedule</h4>
                        <div className="space-y-1">
                          {system.schedule.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Clock className="h-3 w-3 text-gray-600" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Control</h4>
                        <div className="flex items-center space-x-4">
                          <Switch checked={system.status === 'active'} />
                          <span className="text-sm">
                            {system.status === 'active' ? 'System Active' : 'System Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Devices
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          IoT Settings
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>
    </div>
  );
};

export default IoTConnectivity; 