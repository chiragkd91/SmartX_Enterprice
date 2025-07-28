/**
 * Security Management System - Advanced security and authentication platform
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Switch } from '../../components/ui/switch';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Key, 
  Users,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  QrCode,
  Smartphone,
  Mail,
  Phone,
  Globe,
  Server,
  Database,
  Wifi,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertCircle,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity as ActivityIcon,
  MapPin,
  Calendar,
  FileText,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Copy,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

interface SecurityUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  loginAttempts: number;
  status: 'Active' | 'Suspended' | 'Locked' | 'Inactive';
  permissions: string[];
  devices: SecurityDevice[];
  loginHistory: LoginEvent[];
}

interface SecurityDevice {
  id: string;
  name: string;
  type: 'Desktop' | 'Laptop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastUsed: string;
  isTrusted: boolean;
  isActive: boolean;
}

interface LoginEvent {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  status: 'Success' | 'Failed' | 'Blocked';
  reason?: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  type: 'Password' | 'Session' | 'Access' | 'Data' | 'Network';
  description: string;
  rules: SecurityRule[];
  status: 'Active' | 'Inactive' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

interface SecurityRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
}

interface SecurityAlert {
  id: string;
  type: 'Login Attempt' | 'Data Access' | 'Permission Change' | 'System Event' | 'Threat Detected';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  status: 'New' | 'Investigating' | 'Resolved' | 'False Positive';
  assignedTo?: string;
}

const mockSecurityUsers: SecurityUser[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@globalcyberit.com',
    role: 'Admin',
    department: 'IT',
    twoFactorEnabled: true,
    lastLogin: '2024-01-20T10:30:00Z',
    loginAttempts: 0,
    status: 'Active',
    permissions: ['users.view', 'users.edit', 'security.view', 'security.edit'],
    devices: [
      {
        id: '1',
        name: 'MacBook Pro',
        type: 'Laptop',
        browser: 'Chrome 120.0',
        os: 'macOS 14.0',
        ipAddress: '192.168.1.100',
        location: 'Mumbai, India',
        lastUsed: '2024-01-20T10:30:00Z',
        isTrusted: true,
        isActive: true
      }
    ],
    loginHistory: [
      {
        id: '1',
        timestamp: '2024-01-20T10:30:00Z',
        ipAddress: '192.168.1.100',
        location: 'Mumbai, India',
        device: 'MacBook Pro',
        browser: 'Chrome 120.0',
        status: 'Success'
      }
    ]
  }
];

const mockSecurityPolicies: SecurityPolicy[] = [
  {
    id: '1',
    name: 'Password Policy',
    type: 'Password',
    description: 'Strong password requirements and expiration rules',
    rules: [
      {
        id: '1-1',
        name: 'Minimum Length',
        condition: 'password.length >= 8',
        action: 'Require',
        priority: 1,
        enabled: true
      },
      {
        id: '1-2',
        name: 'Complexity Requirements',
        condition: 'password.contains(upper, lower, number, special)',
        action: 'Require',
        priority: 2,
        enabled: true
      },
      {
        id: '1-3',
        name: 'Expiration',
        condition: 'password.age > 90 days',
        action: 'Force Change',
        priority: 3,
        enabled: true
      }
    ],
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Session Management',
    type: 'Session',
    description: 'Session timeout and security settings',
    rules: [
      {
        id: '2-1',
        name: 'Session Timeout',
        condition: 'session.inactive > 30 minutes',
        action: 'Logout',
        priority: 1,
        enabled: true
      },
      {
        id: '2-2',
        name: 'Concurrent Sessions',
        condition: 'user.sessions > 3',
        action: 'Terminate Oldest',
        priority: 2,
        enabled: true
      }
    ],
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  }
];

const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: '1',
    type: 'Login Attempt',
    severity: 'Medium',
    title: 'Multiple Failed Login Attempts',
    description: 'User account has experienced 5 failed login attempts in the last 10 minutes',
    timestamp: '2024-01-20T11:45:00Z',
    source: '192.168.1.150',
    status: 'Investigating',
    assignedTo: 'Security Team'
  },
  {
    id: '2',
    type: 'Data Access',
    severity: 'High',
    title: 'Unusual Data Access Pattern',
    description: 'User accessed sensitive HR data outside of normal working hours',
    timestamp: '2024-01-20T02:30:00Z',
    source: 'user@globalcyberit.com',
    status: 'New'
  }
];

export default function SecurityManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Suspended': return 'text-yellow-600 bg-yellow-50';
      case 'Locked': return 'text-red-600 bg-red-50';
      case 'Inactive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'text-blue-600 bg-blue-50';
      case 'Investigating': return 'text-yellow-600 bg-yellow-50';
      case 'Resolved': return 'text-green-600 bg-green-50';
      case 'False Positive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const securityMetrics = {
    totalUsers: mockSecurityUsers.length,
    activeUsers: mockSecurityUsers.filter(u => u.status === 'Active').length,
    twoFactorEnabled: mockSecurityUsers.filter(u => u.twoFactorEnabled).length,
    securityPolicies: mockSecurityPolicies.length,
    activeAlerts: mockSecurityAlerts.filter(a => a.status === 'New' || a.status === 'Investigating').length,
    criticalAlerts: mockSecurityAlerts.filter(a => a.severity === 'Critical').length,
    totalLoginAttempts: mockSecurityUsers.reduce((sum, u) => sum + u.loginAttempts, 0),
    securityScore: 85
  };

  const loginData = [
    { hour: '00:00', successful: 12, failed: 2, blocked: 0 },
    { hour: '04:00', successful: 8, failed: 1, blocked: 0 },
    { hour: '08:00', successful: 45, failed: 5, blocked: 1 },
    { hour: '12:00', successful: 67, failed: 3, blocked: 0 },
    { hour: '16:00', successful: 52, failed: 4, blocked: 1 },
    { hour: '20:00', successful: 23, failed: 2, blocked: 0 }
  ];

  const alertData = [
    { day: 'Mon', alerts: 5, critical: 1, high: 2, medium: 2 },
    { day: 'Tue', alerts: 3, critical: 0, high: 1, medium: 2 },
    { day: 'Wed', alerts: 7, critical: 2, high: 3, medium: 2 },
    { day: 'Thu', alerts: 4, critical: 0, high: 2, medium: 2 },
    { day: 'Fri', alerts: 6, critical: 1, high: 2, medium: 3 },
    { day: 'Sat', alerts: 2, critical: 0, high: 1, medium: 1 },
    { day: 'Sun', alerts: 1, critical: 0, high: 0, medium: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Management</h1>
          <p className="text-gray-600">Advanced security, authentication, and access control</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowPolicyDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </Button>
          <Button onClick={() => setShowTwoFactorDialog(true)} variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            2FA Setup
          </Button>
        </div>
      </div>

      {/* Security Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Security Score</h3>
              <p className="text-gray-600">Overall system security rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{securityMetrics.securityScore}</div>
              <div className="text-sm text-gray-600">out of 100</div>
            </div>
            <div className="w-32">
              <Progress value={securityMetrics.securityScore} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">of {securityMetrics.totalUsers} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2FA Enabled</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.twoFactorEnabled}</div>
            <p className="text-xs text-muted-foreground">users with 2FA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">{securityMetrics.criticalAlerts} critical</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Policies</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.securityPolicies}</div>
            <p className="text-xs text-muted-foreground">active policies</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="authentication">2FA</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Login Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Login Activity (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={loginData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="successful" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="failed" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="blocked" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Security Alerts (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={alertData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="critical" fill="#EF4444" />
                    <Bar dataKey="high" fill="#F59E0B" />
                    <Bar dataKey="medium" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Security Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getSeverityColor(alert.severity).replace('text-', '').replace('bg-', 'bg-')}`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{new Date(alert.timestamp).toLocaleString()}</p>
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>2FA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Login Attempts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSecurityUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.twoFactorEnabled ? (
                          <Badge className="text-green-600 bg-green-50">Enabled</Badge>
                        ) : (
                          <Badge className="text-red-600 bg-red-50">Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
                      <TableCell>{user.loginAttempts}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Lock className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rules</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSecurityPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{policy.name}</p>
                          <p className="text-sm text-gray-600">{policy.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-blue-600 bg-blue-50">{policy.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(policy.status)}>{policy.status}</Badge>
                      </TableCell>
                      <TableCell>{policy.rules.length} rules</TableCell>
                      <TableCell>{new Date(policy.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSecurityAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{alert.type}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAlertStatusColor(alert.status)}>{alert.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-gray-600">Send codes via SMS</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Authentication</p>
                    <p className="text-sm text-gray-600">Send codes via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authenticator Apps</p>
                    <p className="text-sm text-gray-600">TOTP apps like Google Authenticator</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup Codes</p>
                    <p className="text-sm text-gray-600">Generate backup codes</p>
                  </div>
                  <Switch />
                </div>
                <Button className="w-full">
                  <QrCode className="w-4 h-4 mr-2" />
                  Setup 2FA for All Users
                </Button>
              </CardContent>
            </Card>

            {/* Single Sign-On */}
            <Card>
              <CardHeader>
                <CardTitle>Single Sign-On (SSO)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SAML 2.0</p>
                    <p className="text-sm text-gray-600">SAML-based SSO</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">OAuth 2.0</p>
                    <p className="text-sm text-gray-600">OAuth-based authentication</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Active Directory</p>
                    <p className="text-sm text-gray-600">LDAP/AD integration</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Social Login</p>
                    <p className="text-sm text-gray-600">Google, Microsoft, etc.</p>
                  </div>
                  <Switch />
                </div>
                <Button className="w-full" variant="outline">
                  <Globe className="w-4 h-4 mr-2" />
                  Configure SSO Providers
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Device Management */}
          <Card>
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSecurityUsers.flatMap(user => user.devices).map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-gray-600">{device.browser} on {device.os}</p>
                        </div>
                      </TableCell>
                      <TableCell>Rajesh Kumar</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>{new Date(device.lastUsed).toLocaleString()}</TableCell>
                      <TableCell>
                        {device.isActive ? (
                          <Badge className="text-green-600 bg-green-50">Active</Badge>
                        ) : (
                          <Badge className="text-gray-600 bg-gray-50">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Events by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Security Events by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Login Attempts', value: 45, color: '#3B82F6' },
                        { name: 'Data Access', value: 23, color: '#10B981' },
                        { name: 'Permission Changes', value: 12, color: '#F59E0B' },
                        { name: 'System Events', value: 8, color: '#EF4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Login Attempts', value: 45, color: '#3B82F6' },
                        { name: 'Data Access', value: 23, color: '#10B981' },
                        { name: 'Permission Changes', value: 12, color: '#F59E0B' },
                        { name: 'System Events', value: 8, color: '#EF4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Security Score Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Security Score Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { day: 'Mon', score: 82 },
                    { day: 'Tue', score: 85 },
                    { day: 'Wed', score: 88 },
                    { day: 'Thu', score: 87 },
                    { day: 'Fri', score: 90 },
                    { day: 'Sat', score: 89 },
                    { day: 'Sun', score: 85 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Two-Factor Setup Dialog */}
      <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication Setup</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <QrCode className="w-32 h-32 mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app
              </p>
            </div>
            <div>
              <Label>Verification Code</Label>
              <Input placeholder="Enter 6-digit code" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTwoFactorDialog(false)}>
                Cancel
              </Button>
              <Button>Verify & Enable</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Policy Dialog */}
      <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Security Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Policy Name</Label>
                <Input placeholder="Enter policy name" />
              </div>
              <div>
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="password">Password</SelectItem>
                    <SelectItem value="session">Session</SelectItem>
                    <SelectItem value="access">Access</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe the policy..." />
            </div>
            <div>
              <Label>Rules</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input placeholder="Condition" />
                  <Input placeholder="Action" />
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPolicyDialog(false)}>
                Cancel
              </Button>
              <Button>Create Policy</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 