/**
 * Role Assignment Component
 * Allows administrators to assign and manage user roles dynamically
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useStore } from '../../store/useStore';
import { useRBAC } from '../../hooks/useRBAC';
import { roles, getAvailableRoles } from '../../config/rbac';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck
} from 'lucide-react';

interface RoleAssignmentProps {
  userId?: string;
  onRoleChange?: (userId: string, newRole: string) => void;
}

export const RoleAssignment: React.FC<RoleAssignmentProps> = ({ 
  userId, 
  onRoleChange 
}) => {
  const { users, currentUser } = useStore();
  const { isAdmin, canManageUsers } = useRBAC();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get all available roles
  const availableRoles = getAvailableRoles();

  // Filter users based on permissions
  const manageableUsers = users.filter(user => 
    // Admin can manage all users except themselves
    isAdmin() ? user.id !== currentUser?.id : false
  );

  const handleRoleAssignment = async () => {
    if (!selectedUser || !newRole) {
      setError('Please select a user and role');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would make an API call
      console.log(`Assigning role ${newRole} to user ${selectedUser.id}`);
      
      // Simulate role assignment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Successfully assigned ${roles[newRole]?.displayName} role to ${selectedUser.name}`);
      
      if (onRoleChange) {
        onRoleChange(selectedUser.id, newRole);
      }
      
      setShowAssignDialog(false);
      setSelectedUser(null);
      setNewRole('');
      
    } catch (err) {
      setError('Failed to assign role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    const role = roles[roleName];
    if (!role) return 'bg-gray-100 text-gray-800';
    
    switch (role.priority) {
      case 1000: return 'bg-red-100 text-red-800'; // Super Admin
      case 900: return 'bg-orange-100 text-orange-800'; // Admin
      case 800: return 'bg-blue-100 text-blue-800'; // Manager
      case 700: return 'bg-purple-100 text-purple-800'; // Department Managers
      case 300: return 'bg-yellow-100 text-yellow-800'; // Specialists
      case 200: return 'bg-green-100 text-green-800'; // Regular roles
      case 100: return 'bg-gray-100 text-gray-800'; // Employee
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getModuleAccess = (role: string) => {
    const roleConfig = roles[role];
    if (!roleConfig) return [];
    
    if (roleConfig.modules.includes('*')) {
      return ['All Modules'];
    }
    
    return roleConfig.modules.slice(0, 3); // Show first 3 modules
  };

  if (!canManageUsers()) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to manage user roles.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
          <p className="text-gray-600 mt-1">Assign and manage user roles and permissions</p>
        </div>
        
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserCheck className="mr-2 h-4 w-4" />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign User Role</DialogTitle>
              <DialogDescription>
                Select a user and assign them a new role with appropriate permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* User Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select User</label>
                <Select 
                  value={selectedUser?.id || ''} 
                  onValueChange={(value) => {
                    const user = manageableUsers.find(u => u.id === value);
                    setSelectedUser(user);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {manageableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center space-x-2">
                          <span>{user.name}</span>
                          <Badge className="text-xs">{user.email}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Role</label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.name} value={role.name}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.displayName}</span>
                          <span className="text-xs text-gray-500">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Current vs New Role Comparison */}
              {selectedUser && newRole && (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="text-sm font-medium mb-2">Role Change Summary</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Role:</span>
                      <div className="mt-1">
                        <Badge className={getRoleBadgeColor(selectedUser.role)}>
                          {roles[selectedUser.role]?.displayName || selectedUser.role}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">New Role:</span>
                      <div className="mt-1">
                        <Badge className={getRoleBadgeColor(newRole)}>
                          {roles[newRole]?.displayName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleRoleAssignment} 
                  disabled={loading || !selectedUser || !newRole}
                  className="flex-1"
                >
                  {loading ? 'Assigning...' : 'Assign Role'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAssignDialog(false);
                    setSelectedUser(null);
                    setNewRole('');
                    setError(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Message */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Current User Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Role Assignments</CardTitle>
          <CardDescription>
            Current role assignments for all system users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Module Access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {roles[user.role]?.displayName || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getModuleAccess(user.role).map((module, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                      {roles[user.role]?.modules.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{roles[user.role]?.modules.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="capitalize">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {canManageUsers() && user.id !== currentUser?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role);
                            setShowAssignDialog(true);
                          }}
                          title="Change Role"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {user.id === currentUser?.id && (
                        <span className="text-sm text-gray-500">Current User</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableRoles.map((role) => {
          const userCount = users.filter(u => u.role === role.name).length;
          
          return (
            <Card key={role.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={getRoleBadgeColor(role.name)}>
                    {role.displayName}
                  </Badge>
                  <div className="text-2xl font-bold text-gray-600">
                    {userCount}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Module Access:</div>
                  <div className="flex flex-wrap gap-1">
                    {getModuleAccess(role.name).slice(0, 2).map((module, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {module}
                      </Badge>
                    ))}
                    {role.modules.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.modules.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoleAssignment;
