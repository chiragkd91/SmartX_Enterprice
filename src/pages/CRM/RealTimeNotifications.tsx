/**
 * Real-time Notifications - Live updates and notification management
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Switch } from '../../components/ui/switch';
import { 
  Bell, 
  BellOff, 
  Settings, 
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Clock,
  Calendar,
  Users,
  Mail,
  Phone,
  MessageSquare,
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  Activity,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Battery,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryEmpty,
  Play,
  Pause,
  Stop,
  RotateCcw,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Edit,
  Search,
  Filter,
  MoreHorizontal,
  X,
  Minus,
  Plus as PlusIcon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Link,
  Copy,
  Share,
  Lock,
  Unlock,
  Shield,
  Key,
  Database,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Globe,
  MapPin,
  Building,
  User,
  UserCheck,
  UserX,
  FileText,
  Image,
  Video,
  Music,
  File,
  Folder,
  FolderOpen,
  Save,
  SaveAll,
  Undo,
  Redo,
  Cut,
  Copy as CopyIcon,
  Paste,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Justify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Video as VideoIcon,
  Table as TableIcon,
  Grid,
  Columns,
  Rows,
  Layout,
  Sidebar,
  SidebarClose,
  SidebarOpen,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Maximize,
  Minimize,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Search as SearchIcon,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Timer,
  Stopwatch,
  Watch,
  Sunrise,
  Sunset,
  Moon,
  Sun,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  Snowflake,
  Flame,
  Sparkles,
  Star as StarIcon,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Sad,
  Surprised,
  Wink,
  Tongue,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Ear,
  EarOff,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Headphones,
  Speaker,
  Radio,
  Tv,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Watch as WatchIcon,
  Camera,
  CameraOff,
  Video as VideoIcon2,
  VideoOff,
  Image as ImageIcon2,
  ImageOff,
  Music as MusicIcon,
  Music2,
  Music3,
  Music4,
  Play as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Shuffle,
  Repeat,
  Repeat1,
  Smartphone as SmartphoneIcon2,
  Tablet as TabletIcon2,
  Laptop as LaptopIcon2,
  Watch as WatchIcon2,
  Camera as CameraIcon,
  CameraOff as CameraOffIcon,
  Video as VideoIcon3,
  VideoOff as VideoOffIcon,
  Image as ImageIcon3,
  ImageOff as ImageOffIcon,
  Music as MusicIcon2,
  Music2 as Music2Icon,
  Music3 as Music3Icon,
  Music4 as Music4Icon,
  Play as PlayIcon2,
  Pause as PauseIcon2,
  Stop as StopIcon2,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
  Rewind as RewindIcon,
  FastForward as FastForwardIcon,
  Shuffle as ShuffleIcon,
  Repeat as RepeatIcon,
  Repeat1 as Repeat1Icon
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'lead' | 'deal' | 'email' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'sales' | 'marketing' | 'support' | 'system' | 'general';
  action?: {
    type: 'link' | 'button' | 'modal';
    label: string;
    url?: string;
  };
  metadata?: {
    leadId?: string;
    dealId?: string;
    userId?: string;
    emailId?: string;
  };
}

interface NotificationSettings {
  id: string;
  category: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

interface RealTimeStats {
  totalNotifications: number;
  unreadCount: number;
  todayCount: number;
  thisWeekCount: number;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  lastUpdate: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'lead',
    title: 'New High-Value Lead',
    message: 'John Smith from TechCorp Solutions has been assigned to you',
    timestamp: '2024-01-20T10:30:00Z',
    read: false,
    priority: 'high',
    category: 'sales',
    action: {
      type: 'link',
      label: 'View Lead',
      url: '/crm/leads/1'
    },
    metadata: {
      leadId: 'L001'
    }
  },
  {
    id: '2',
    type: 'deal',
    title: 'Deal Status Updated',
    message: 'Enterprise Software License deal moved to Negotiation stage',
    timestamp: '2024-01-20T09:15:00Z',
    read: false,
    priority: 'medium',
    category: 'sales',
    action: {
      type: 'link',
      label: 'View Deal',
      url: '/crm/opportunities/1'
    },
    metadata: {
      dealId: 'D001'
    }
  },
  {
    id: '3',
    type: 'email',
    title: 'Email Campaign Completed',
    message: 'Q4 Product Launch campaign has been sent to 2,500 recipients',
    timestamp: '2024-01-20T08:45:00Z',
    read: true,
    priority: 'low',
    category: 'marketing',
    action: {
      type: 'link',
      label: 'View Report',
      url: '/crm/email/campaigns/1'
    },
    metadata: {
      emailId: 'E001'
    }
  },
  {
    id: '4',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will begin in 30 minutes',
    timestamp: '2024-01-20T07:30:00Z',
    read: false,
    priority: 'urgent',
    category: 'system',
    action: {
      type: 'button',
      label: 'Acknowledge'
    }
  }
];

const mockNotificationSettings: NotificationSettings[] = [
  {
    id: '1',
    category: 'sales',
    email: true,
    push: true,
    sms: false,
    inApp: true,
    frequency: 'immediate'
  },
  {
    id: '2',
    category: 'marketing',
    email: true,
    push: false,
    sms: false,
    inApp: true,
    frequency: 'hourly'
  },
  {
    id: '3',
    category: 'support',
    email: false,
    push: true,
    sms: false,
    inApp: true,
    frequency: 'immediate'
  },
  {
    id: '4',
    category: 'system',
    email: true,
    push: true,
    sms: true,
    inApp: true,
    frequency: 'immediate'
  }
];

export default function RealTimeNotifications() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings[]>(mockNotificationSettings);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');

  const realTimeStats: RealTimeStats = {
    totalNotifications: notifications.length,
    unreadCount: notifications.filter(n => !n.read).length,
    todayCount: notifications.filter(n => {
      const today = new Date().toDateString();
      return new Date(n.timestamp).toDateString() === today;
    }).length,
    thisWeekCount: notifications.filter(n => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(n.timestamp) > weekAgo;
    }).length,
    connectionStatus,
    lastUpdate: new Date().toISOString()
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lead': return <Users className="w-4 h-4" />;
      case 'deal': return <Target className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lead': return 'text-blue-600 bg-blue-50';
      case 'deal': return 'text-green-600 bg-green-50';
      case 'email': return 'text-purple-600 bg-purple-50';
      case 'system': return 'text-orange-600 bg-orange-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notifications
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['lead', 'deal', 'email', 'system'][Math.floor(Math.random() * 4)] as any,
          title: 'Real-time Update',
          message: 'This is a simulated real-time notification',
          timestamp: new Date().toISOString(),
          read: false,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          category: ['sales', 'marketing', 'support'][Math.floor(Math.random() * 3)] as any
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-time Notifications</h1>
          <p className="text-gray-600">Live updates and notification management</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowSettingsDialog(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <div>
                <p className="font-medium">Real-time Connection</p>
                <p className="text-sm text-gray-600">
                  {connectionStatus === 'connected' ? 'Connected' :
                   connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last Update</p>
              <p className="font-medium">{new Date(realTimeStats.lastUpdate).toLocaleTimeString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeStats.totalNotifications}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <BellOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeStats.unreadCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeStats.todayCount}</div>
            <p className="text-xs text-muted-foreground">New today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeStats.thisWeekCount}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Notifications</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg transition-all duration-200 ${
                      notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            {notification.action && (
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Push</TableHead>
                    <TableHead>SMS</TableHead>
                    <TableHead>In-App</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell className="font-medium capitalize">{setting.category}</TableCell>
                      <TableCell>
                        <Switch checked={setting.email} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={setting.push} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={setting.sms} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={setting.inApp} />
                      </TableCell>
                      <TableCell>
                        <Badge className="text-blue-600 bg-blue-50 capitalize">
                          {setting.frequency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Sales</span>
                    </div>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-sm text-gray-600">notifications today</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="font-medium">Marketing</span>
                    </div>
                    <p className="text-2xl font-bold">23</p>
                    <p className="text-sm text-gray-600">notifications today</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="font-medium">System</span>
                    </div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-gray-600">notifications today</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Default Frequency</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sound Alerts</Label>
                <Switch defaultChecked />
              </div>
            </div>
            <div>
              <Label>Quiet Hours</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label className="text-sm">Start Time</Label>
                  <Input type="time" defaultValue="22:00" />
                </div>
                <div>
                  <Label className="text-sm">End Time</Label>
                  <Input type="time" defaultValue="08:00" />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                Cancel
              </Button>
              <Button>Save Settings</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 