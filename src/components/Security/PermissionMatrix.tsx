/**
 * Permission Matrix Component
 * Provides detailed view and management of role permissions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { useStore } from '../../store/useStore';
import { useRBAC } from '../../hooks/useRBAC';
import { 
  roles, 
  permissions, 
  getAvailableRoles, 
  canElevateRole,
  isRoleElevated,
  Role,
  Permission
} from '../../config/rbac';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock,
  Edit,
  Eye,
  Plus,
  Settings,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

interface PermissionGroup {
  name: string;
  displayName: string;
  permissions: Permission[];
  color: string;
}

export const PermissionMatrix: React.FC = () => {
  const { currentUser } = useStore();
  const { isAdmin, isSuperAdmin, canManageUsers, canElevateUserRole } = useRBAC();

  const [selectedRole, setSelectedRole] = useState<string>('');
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [matrixView, setMatrixView] = useState<'role' | 'permission'>('role');
  const [filterLevel, setFilterLevel] = useState<'all' | 'elevated' | 'standard'>('all');
  const [editMode, setEditMode] = useState(false);

  const availableRoles = getAvailableRoles();
  
  useEffect(() => {
    groupPermissions();
  }, []);

  const groupPermissions = () => {
    const groups: PermissionGroup[] = [
      {
        name: 'dashboard',
        displayName: 'Dashboard & Analytics',
        permissions: Object.values(permissions).filter(p => p.resource === 'dashboard'),
        color: 'bg-blue-100 text-blue-800'
      },
      {
        name: 'users',
        displayName: 'User Management',
        permissions: Object.values(permissions).filter(p => p.resource === 'users'),
        color: 'bg-purple-100 text-purple-800'
      },
      {
        name: 'hr',
        displayName: 'Human Resources',
        permissions: Object.values(permissions).filter(p => p.resource === 'hr'),
        color: 'bg-green-100 text-green-800'
      },
      {
        name: 'crm',
        displayName: 'Customer Relations',
        permissions: Object.values(permissions).filter(p => p.resource === 'crm'),
        color: 'bg-orange-100 text-orange-800'
      },
      {
        name: 'erp',
        displayName: 'Enterprise Resources',
        permissions: Object.values(permissions).filter(p => p.resource === 'erp'),
        color: 'bg-indigo-100 text-indigo-800'
      },
      {
        name: 'assets',
        displayName: 'IT Asset Management',
        permissions: Object.values(permissions).filter(p => p.resource === 'assets'),
        color: 'bg-cyan-100 text-cyan-800'
      },
      {
        name: 'gst',
        displayName: 'GST & Compliance',
        permissions: Object.values(permissions).filter(p => p.resource === 'gst'),
        color: 'bg-yellow-100 text-yellow-800'
      },
      {
        name: 'files',
        displayName: 'File Management',
        permissions: Object.values(permissions).filter(p => p.resource === 'files'),
        color: 'bg-pink-100 text-pink-800'
      },
      {
        name: 'reports',
        displayName: 'Reports & Analytics',
        permissions: Object.values(permissions).filter(p => p.resource === 'reports'),
        color: 'bg-teal-100 text-teal-800'
      },
      {
        name: 'settings',
        displayName: 'System Settings',
        permissions: Object.values(permissions).filter(p => p.resource === 'settings'),
        color: 'bg-gray-100 text-gray-800'
      }
    ];

    setPermissionGroups(groups);
  };

  const getFilteredRoles = () => {
    return availableRoles.filter(role => {
      if (filterLevel === 'all') return true;
      if (filterLevel === 'elevated') return isRoleElevated(role.name);
      return !isRoleElevated(role.name);
    });
  };

  const hasRolePermission = (role: Role, permission: Permission): boolean => {
    return role.permissions.some(p => 
      p.resource === permission.resource && p.action === permission.action
    );
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'read': return <Eye className="h-4 w-4" />;
      case 'create': return <Plus className="h-4 w-4" />;
      case 'update': return <Edit className="h-4 w-4" />;
      case 'delete': return <XCircle className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'read': return 'text-blue-600';
      case 'create': return 'text-green-600';
      case 'update': return 'text-yellow-600';
      case 'delete': return 'text-red-600';
      case 'admin': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getRolePriorityBadge = (priority: number) => {
    if (priority >= 1000) return { color: 'bg-red-100 text-red-800', label: 'Super Admin' };
    if (priority >= 900) return { color: 'bg-orange-100 text-orange-800', label: 'Admin' };
    if (priority >= 800) return { color: 'bg-purple-100 text-purple-800', label: 'Manager' };
    if (priority >= 700) return { color: 'bg-blue-100 text-blue-800', label: 'Specialist' };
    if (priority >= 300) return { color: 'bg-green-100 text-green-800', label: 'Professional' };
    return { color: 'bg-gray-100 text-gray-800', label: 'Standard' };
  };

  const exportPermissionMatrix = () => {
    const data = availableRoles.map(role => ({
      role: role.displayName,
      permissions: permissionGroups.map(group => 
        group.permissions.map(permission => ({
          resource: permission.resource,
          action: permission.action,
          granted: hasRolePermission(role, permission)
        }))
      ).flat()
    }));

    const csv = [
      ['Role', 'Resource', 'Action', 'Granted'],
      ...data.flatMap(role => 
        role.permissions.map(p => [
          role.role,
          p.resource,
          p.action,
          p.granted ? 'Yes' : 'No'
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permission-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!canManageUsers() && !isAdmin()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to view the permission matrix.
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
            Permission Matrix
          </h2>
          <p className="text-gray-600 mt-1">Detailed role and permission management</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={exportPermissionMatrix}
            className="border-gray-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Matrix
          </Button>
          
          {isSuperAdmin() && (
            <Button
              onClick={() => setEditMode(!editMode)}
              className={editMode ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
            >
              {editMode ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Edit
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Permissions
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <label className="text-sm font-medium">View:</label>
          <Select value={matrixView} onValueChange={(value: 'role' | 'permission') => setMatrixView(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="role">By Role</SelectItem>
              <SelectItem value="permission">By Permission</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Filter:</label>
          <Select value={filterLevel} onValueChange={(value: 'all' | 'elevated' | 'standard') => setFilterLevel(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="elevated">Elevated Only</SelectItem>
              <SelectItem value="standard">Standard Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {editMode && (
          <Alert className="border-orange-200 bg-orange-50 flex-1">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Edit mode enabled. Changes will affect user access permissions.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getFilteredRoles().slice(0, 4).map((role) => {
          const badge = getRolePriorityBadge(role.priority);
          const permissionCount = role.permissions.length;
          const moduleCount = role.modules.includes('*') ? 'All' : role.modules.length;

          return (
            <Card key={role.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{role.displayName}</CardTitle>
                  <Badge className={badge.color}>{badge.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Permissions:</span>
                    <span className="font-bold">{permissionCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Modules:</span>
                    <span className="font-bold">{moduleCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>System Role:</span>
                    <span>{role.isSystem ? '✓' : '✗'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>
            {matrixView === 'role' ? 'Permissions by role' : 'Roles by permission'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white z-10 min-w-[200px]">
                    {matrixView === 'role' ? 'Role' : 'Permission'}
                  </TableHead>
                  {matrixView === 'role' ? (
                    permissionGroups.map((group) => (
                      <TableHead key={group.name} className="text-center min-w-[120px]">
                        <div className="flex flex-col items-center space-y-1">
                          <Badge className={group.color}>{group.displayName}</Badge>
                          <div className="text-xs text-gray-500">{group.permissions.length} perms</div>
                        </div>
                      </TableHead>
                    ))
                  ) : (
                    getFilteredRoles().map((role) => (
                      <TableHead key={role.name} className="text-center min-w-[120px]">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="font-medium">{role.displayName}</div>
                          <Badge className={getRolePriorityBadge(role.priority).color}>
                            {getRolePriorityBadge(role.priority).label}
                          </Badge>
                        </div>
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrixView === 'role' ? (
                  getFilteredRoles().map((role) => (
                    <TableRow key={role.name}>
                      <TableCell className="sticky left-0 bg-white z-10 font-medium">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-bold">{role.displayName}</div>
                            <div className="text-sm text-gray-500">{role.description}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getRolePriorityBadge(role.priority).color}>
                                Priority: {role.priority}
                              </Badge>
                              {isRoleElevated(role.name) && (
                                <Badge variant="outline" className="border-red-300 text-red-700">
                                  Elevated
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {permissionGroups.map((group) => (
                        <TableCell key={group.name} className="text-center">
                          <div className="grid grid-cols-2 gap-1">
                            {group.permissions.map((permission) => {
                              const hasPermission = hasRolePermission(role, permission);
                              return (
                                <div
                                  key={`${permission.resource}-${permission.action}`}
                                  className={`p-1 rounded flex items-center justify-center ${
                                    hasPermission 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-400'
                                  }`}
                                  title={`${permission.action} ${permission.resource}`}
                                >
                                  <div className={`${getActionColor(permission.action)} ${!hasPermission && 'opacity-30'}`}>
                                    {getActionIcon(permission.action)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  permissionGroups.map((group) => (
                    <React.Fragment key={group.name}>
                      <TableRow className="bg-gray-50">
                        <TableCell className="sticky left-0 bg-gray-50 z-10 font-bold" colSpan={getFilteredRoles().length + 1}>
                          <Badge className={group.color}>{group.displayName}</Badge>
                        </TableCell>
                      </TableRow>
                      {group.permissions.map((permission) => (
                        <TableRow key={`${permission.resource}-${permission.action}`}>
                          <TableCell className="sticky left-0 bg-white z-10">
                            <div className="flex items-center space-x-2">
                              <div className={getActionColor(permission.action)}>
                                {getActionIcon(permission.action)}
                              </div>
                              <div>
                                <div className="font-medium capitalize">{permission.action}</div>
                                <div className="text-sm text-gray-500">{permission.resource}</div>
                              </div>
                            </div>
                          </TableCell>
                          {getFilteredRoles().map((role) => (
                            <TableCell key={role.name} className="text-center">
                              <div className="flex justify-center">
                                {hasRolePermission(role, permission) ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-300" />
                                )}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Permission Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Permission Coverage</CardTitle>
            <CardDescription>Percentage of roles with each permission type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['read', 'create', 'update', 'delete', 'admin'].map((action) => {
                const totalPermissions = Object.values(permissions).filter(p => p.action === action).length;
                const rolesWithAction = availableRoles.filter(role =>
                  role.permissions.some(p => p.action === action)
                ).length;
                const percentage = (rolesWithAction / availableRoles.length) * 100;

                return (
                  <div key={action} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={getActionColor(action)}>
                        {getActionIcon(action)}
                      </div>
                      <span className="font-medium capitalize">{action}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Risk Assessment</CardTitle>
            <CardDescription>Analysis of role-based security risks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>Critical Risk Roles</span>
                </div>
                <span className="font-bold text-red-600">
                  {availableRoles.filter(r => r.priority >= 900).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span>High Risk Roles</span>
                </div>
                <span className="font-bold text-orange-600">
                  {availableRoles.filter(r => r.priority >= 700 && r.priority < 900).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span>Medium Risk Roles</span>
                </div>
                <span className="font-bold text-yellow-600">
                  {availableRoles.filter(r => r.priority >= 300 && r.priority < 700).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Low Risk Roles</span>
                </div>
                <span className="font-bold text-green-600">
                  {availableRoles.filter(r => r.priority < 300).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PermissionMatrix;
