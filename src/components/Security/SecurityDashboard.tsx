/**
 * Security Dashboard Component
 * Provides comprehensive security oversight and management for administrators
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useStore } from '../../store/useStore';
import { useRBAC } from '../../hooks/useRBAC';
import { securitySettings } from '../../config/rbac';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Lock,
  Key,
  Eye,
  Activity,
  TrendingUp,
  TrendingDown,
  UserX,
  Bell,
  Settings,
  Ban
} from 'lucide-react';

interface SecurityMetrics {
  activeUsers: number;
  lockedUsers: number;
  elevatedRoles: number;
  mfaEnabled: number;
  recentFailedLogins: number;
  afterHoursAccess: number;
  criticalActions: number;
  sensitiveDataAccess: number;
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'blocked';
  ipAddress: string;
  userAgent: string;
}

export const SecurityDashboard: React.FC = () => {
  const { users, currentUser } = useStore();
  const { 
    isAdmin, 
    isSuperAdmin, 
    canManageSecuritySettings, 
    canAccessAuditLogs,
    isElevatedRole,
    userRequiresMFA,
    assessActionRisk,
    isWithinBusinessHours
  } = useRBAC();

  const [metrics, setMetrics] = useState<SecurityMetrics>({
    activeUsers: 0,
    lockedUsers: 0,
    elevatedRoles: 0,
    mfaEnabled: 0,
    recentFailedLogins: 0,
    afterHoursAccess: 0,
    criticalActions: 0,
    sensitiveDataAccess: 0
  });

  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadSecurityMetrics();
    loadRecentEvents();
    checkSecurityAlerts();
  }, [users]);

  const loadSecurityMetrics = () => {
    const activeUsers = users.filter(u => u.status === 'active').length;
    const lockedUsers = users.filter(u => u.status === 'locked').length;
    const elevatedRoles = users.filter(u => isElevatedRoleUser(u.role)).length;
    const mfaEnabled = users.filter(u => securitySettings.mfaRequired.includes(u.role)).length;

    setMetrics({
      activeUsers,
      lockedUsers,
      elevatedRoles,
      mfaEnabled,
      recentFailedLogins: Math.floor(Math.random() * 10), // Simulated
      afterHoursAccess: Math.floor(Math.random() * 5), // Simulated
      criticalActions: Math.floor(Math.random() * 3), // Simulated
      sensitiveDataAccess: Math.floor(Math.random() * 15) // Simulated
    });
  };

  const loadRecentEvents = () => {
    // Simulated security events
    const events: SecurityEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        user: 'admin@smartbizflow.com',
        action: 'role_assignment',
        resource: 'users',
        risk: 'high',
        status: 'success',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        user: 'hr@smartbizflow.com',
        action: 'bulk_export',
        resource: 'employees',
        risk: 'medium',
        status: 'success',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0...'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        user: 'unknown@example.com',
        action: 'login',
        resource: 'authentication',
        risk: 'medium',
        status: 'failed',
        ipAddress: '203.0.113.1',
        userAgent: 'Mozilla/5.0...'
      }
    ];

    setRecentEvents(events);
  };

  const checkSecurityAlerts = () => {
    const alerts: string[] = [];

    // Check for users without MFA in elevated roles
    const elevatedWithoutMFA = users.filter(u => 
      isElevatedRoleUser(u.role) && !securitySettings.mfaRequired.includes(u.role)
    );
    if (elevatedWithoutMFA.length > 0) {
      alerts.push(`${elevatedWithoutMFA.length} elevated users don't have MFA enabled`);
    }

    // Check for weak passwords (simulated)
    const weakPasswords = Math.floor(users.length * 0.1);
    if (weakPasswords > 0) {
      alerts.push(`${weakPasswords} users may have weak passwords`);
    }

    // Check for inactive admin accounts
    const inactiveAdmins = users.filter(u => 
      ['admin', 'superAdmin'].includes(u.role) && 
      u.last_login && 
      new Date(u.last_login) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    if (inactiveAdmins.length > 0) {
      alerts.push(`${inactiveAdmins.length} admin accounts inactive for 30+ days`);
    }

    setSecurityAlerts(alerts);
  };

  const isElevatedRoleUser = (role: string): boolean => {
    return ['superAdmin', 'admin', 'hrManager', 'financeManager', 'itManager'].includes(role);
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'blocked': return <Ban className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!canAccessAuditLogs() && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access the security dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="mr-3 h-8 w-8 text-blue-600" />
            Security Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Monitor and manage system security</p>
        </div>
        
        {canManageSecuritySettings() && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="mr-2 h-4 w-4" />
            Security Settings
          </Button>
        )}
      </div>

      {/* Security Alerts */}
      {securityAlerts.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Security Alerts Detected:</div>
            <ul className="list-disc list-inside space-y-1">
              {securityAlerts.map((alert, index) => (
                <li key={index} className="text-sm">{alert}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Security Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.lockedUsers} locked accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Elevated Roles</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.elevatedRoles}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.mfaEnabled} with MFA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.recentFailedLogins}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.criticalActions}</div>
            <p className="text-xs text-muted-foreground">
              Requiring approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Security Configuration</CardTitle>
          <CardDescription>Current security policy settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Session Timeout</div>
                <div className="text-sm text-gray-500">{securitySettings.sessionTimeout} minutes</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Password Policy</div>
                <div className="text-sm text-gray-500">
                  {securitySettings.passwordPolicy.minLength}+ chars, complex
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Ban className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Account Lockout</div>
                <div className="text-sm text-gray-500">
                  {securitySettings.maxFailedLogins} attempts, {securitySettings.lockoutDuration}m lockout
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">MFA Required</div>
                <div className="text-sm text-gray-500">
                  {securitySettings.mfaRequired.length} role types
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Audit Logging</div>
                <div className="text-sm text-gray-500">
                  {securitySettings.auditLogging ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Business Hours</div>
                <div className="text-sm text-gray-500">
                  {isWithinBusinessHours() ? 'Active' : 'After hours'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Latest security-related activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-sm">
                    {event.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{event.user}</div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {event.action}
                    </code>
                  </TableCell>
                  <TableCell>{event.resource}</TableCell>
                  <TableCell>
                    <Badge className={getRiskBadgeColor(event.risk)}>
                      {event.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(event.status)}
                      <span className="capitalize">{event.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {event.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>Current user role assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                users.reduce((acc, user) => {
                  acc[user.role] = (acc[user.role] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([role, count]) => {
                const percentage = (count / users.length) * 100;
                const isElevated = isElevatedRoleUser(role);
                
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          isElevated ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                      />
                      <span className="font-medium capitalize">{role}</span>
                      {isElevated && <Badge variant="outline">Elevated</Badge>}
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{count}</div>
                      <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Health Score</CardTitle>
            <CardDescription>Overall security posture assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">87%</div>
                      <div className="text-sm text-gray-500">Good</div>
                    </div>
                  </div>
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - 0.87)}
                      className="text-green-600"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>MFA Coverage</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Good</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Password Policy</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Strong</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Failed Login Rate</span>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Low</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Privilege Escalation</span>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Monitor</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityDashboard;
