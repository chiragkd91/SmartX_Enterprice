/**
 * User Management Page with User Creation
 * Allows administrators to create, edit, and manage users
 */

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useStore } from '../store/useStore';
import { useRBAC } from '../hooks/useRBAC';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Key,
  Save,
  Plus
} from 'lucide-react';

interface NewUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  department: string;
  phone: string;
  status: 'active' | 'inactive';
}

export default function UserManagement() {
  const { users, loadUsers, currentUser } = useStore();
  const { 
    canManageUsers, 
    canEditRecords, 
    canDeleteRecords, 
    canViewRecords, 
    isAdmin, 
    canPerform 
  } = useRBAC();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    department: '',
    phone: '',
    status: 'active'
  });
  
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    department: '',
    phone: '',
    status: 'active'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const userRoles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access to all modules' },
    { value: 'hrManager', label: 'HR Manager', description: 'Complete HR module management' },
    { value: 'crmManager', label: 'CRM Manager', description: 'Complete CRM module management' },
    { value: 'erpManager', label: 'ERP Manager', description: 'Complete ERP module management' },
    { value: 'itManager', label: 'IT Manager', description: 'IT assets and system management' },
    { value: 'financeManager', label: 'Finance Manager', description: 'Finance and accounting management' },
    { value: 'salesManager', label: 'Sales Manager', description: 'Sales team and CRM management' },
    { value: 'manager', label: 'Department Manager', description: 'General management access' },
    { value: 'salesRep', label: 'Sales Representative', description: 'Sales and customer management' },
    { value: 'accountant', label: 'Accountant', description: 'Financial records management' },
    { value: 'supportAgent', label: 'Support Agent', description: 'Customer support access' },
    { value: 'employee', label: 'Employee', description: 'Basic employee access' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access to reports' }
  ];

  const departments = [
    'HR', 'IT', 'Sales', 'Finance', 'Operations', 'Marketing', 'Engineering', 'Support', 'Management'
  ];

  const handleCreateUser = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Name, email, and password are required');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newUser.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Check if email already exists
    const existingUser = users.find(user => user.email.toLowerCase() === newUser.email.toLowerCase());
    if (existingUser) {
      setError('A user with this email already exists');
      return;
    }

    setLoading(true);

    try {
      // In a real application, this would call an API
      // For now, simulate the creation
      const userToCreate = {
        id: `user_${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department || 'General',
        phone: newUser.phone || '',
        status: newUser.status,
        permissions: [], // Would be determined by role
        created_at: new Date().toISOString(),
        password_hash: 'hashed_' + newUser.password // In real app, this would be properly hashed
      };

      // Here you would typically make an API call
      // await createUser(userToCreate);
      
      setSuccess(`User ${newUser.name} created successfully! Email: ${newUser.email}, Password: ${newUser.password}`);
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee',
        department: '',
        phone: '',
        status: 'active'
      });
      
      setShowCreateDialog(false);
      
      // Reload users
      setTimeout(() => {
        loadUsers();
      }, 1000);

    } catch (err) {
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: any) => {
    if (!canViewRecords('users')) {
      setError('You do not have permission to view user details.');
      return;
    }
    setSelectedUser(user);
    setShowViewDialog(true);
  };

  const handleEditUser = (user: any) => {
    if (!canEditRecords('users')) {
      setError('You do not have permission to edit users.');
      return;
    }
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      password: '', // Don't pre-fill password for security
      confirmPassword: '',
      role: user.role,
      department: user.department || '',
      phone: user.phone || '',
      status: user.status
    });
    setShowEditDialog(true);
  };

  const handleUpdateUser = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!editUser.name || !editUser.email) {
      setError('Name and email are required');
      return;
    }

    if (editUser.password && editUser.password !== editUser.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (editUser.password && editUser.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Check if email already exists (excluding current user)
    const existingUser = users.find(user => 
      user.email.toLowerCase() === editUser.email.toLowerCase() && 
      user.id !== selectedUser?.id
    );
    if (existingUser) {
      setError('A user with this email already exists');
      return;
    }

    setLoading(true);

    try {
      // In a real application, this would call an API
      // For now, simulate the update
      console.log('Updating user:', selectedUser?.id, editUser);
      
      setSuccess(`User ${editUser.name} updated successfully!`);
      
      // Reset form
      setEditUser({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee',
        department: '',
        phone: '',
        status: 'active'
      });
      
      setShowEditDialog(false);
      setSelectedUser(null);
      
      // Reload users
      setTimeout(() => {
        loadUsers();
      }, 1000);

    } catch (err) {
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user: any) => {
    if (!canDeleteRecords('users')) {
      setError('You do not have permission to delete users.');
      return;
    }
    if (user.id === currentUser?.id) {
      setError('You cannot delete your own account.');
      return;
    }
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      // In a real application, this would call an API
      console.log('Deleting user:', selectedUser.id);
      
      setSuccess(`User ${selectedUser.name} deleted successfully!`);
      setShowDeleteDialog(false);
      setSelectedUser(null);
      
      // Reload users
      setTimeout(() => {
        loadUsers();
      }, 1000);
      
    } catch (err) {
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hrManager': return 'bg-blue-100 text-blue-800';
      case 'crmManager': return 'bg-purple-100 text-purple-800';
      case 'employee': return 'bg-green-100 text-green-800';
      case 'itManager': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and their permissions</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Create New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system with appropriate role and permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="Enter phone number (optional)"
                />
              </div>

              {/* Role and Department */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span>{role.label}</span>
                          <span className="text-xs text-gray-500">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Enter password (min 8 characters)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                  placeholder="Confirm password"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newUser.status} onValueChange={(value: 'active' | 'inactive') => setNewUser({...newUser, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  onClick={handleCreateUser} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {userRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>System Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {userRoles.find(r => r.value === user.role)?.label || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <span className="capitalize">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {canViewRecords('users') && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewUser(user)}
                          title="View User Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {canEditRecords('users') && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDeleteRecords('users') && user.id !== currentUser?.id && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800" 
                          onClick={() => handleDeleteUser(user)}
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {!canViewRecords('users') && !canEditRecords('users') && !canDeleteRecords('users') && (
                        <span className="text-sm text-gray-500">No actions available</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick User Creation</CardTitle>
          <CardDescription>Create common user types quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => {
                setNewUser({
                  ...newUser, 
                  role: 'employee',
                  department: 'General',
                  email: `employee${Date.now()}@smartbizflow.com`,
                  password: 'password123'
                });
                setShowCreateDialog(true);
              }}
            >
              <User className="h-6 w-6" />
              <span>Create Employee</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => {
                setNewUser({
                  ...newUser, 
                  role: 'hrManager',
                  department: 'HR',
                  email: `hr${Date.now()}@smartbizflow.com`,
                  password: 'password123'
                });
                setShowCreateDialog(true);
              }}
            >
              <Users className="h-6 w-6" />
              <span>Create HR Manager</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => {
                setNewUser({
                  ...newUser, 
                  role: 'crmManager',
                  department: 'Sales',
                  email: `crm${Date.now()}@smartbizflow.com`,
                  password: 'password123'
                });
                setShowCreateDialog(true);
              }}
            >
              <Shield className="h-6 w-6" />
              <span>Create CRM Manager</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editUser.name}
                onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editUser.phone}
                onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                placeholder="Enter phone number (optional)"
              />
            </div>

            {/* Role and Department */}
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editUser.role} onValueChange={(value) => setEditUser({...editUser, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col">
                        <span>{role.label}</span>
                        <span className="text-xs text-gray-500">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select value={editUser.department} onValueChange={(value) => setEditUser({...editUser, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Optional Password Update */}
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (Optional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editUser.password}
                onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                placeholder="Leave empty to keep current password"
              />
            </div>

            {editUser.password && (
              <div className="space-y-2">
                <Label htmlFor="edit-confirmPassword">Confirm New Password</Label>
                <Input
                  id="edit-confirmPassword"
                  type="password"
                  value={editUser.confirmPassword}
                  onChange={(e) => setEditUser({...editUser, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                />
              </div>
            )}

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editUser.status} onValueChange={(value: 'active' | 'inactive') => setEditUser({...editUser, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                onClick={handleUpdateUser} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Updating...' : 'Update User'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowEditDialog(false);
                  setSelectedUser(null);
                  setEditUser({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'employee',
                    department: '',
                    phone: '',
                    status: 'active'
                  });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View user information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-lg">{selectedUser.name}</div>
                  <div className="text-sm text-gray-500">{selectedUser.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Role</Label>
                  <div className="mt-1">
                    <Badge className={getRoleBadgeColor(selectedUser.role)}>
                      {userRoles.find(r => r.value === selectedUser.role)?.label || selectedUser.role}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department</Label>
                  <div className="mt-1 text-sm">{selectedUser.department || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    {getStatusIcon(selectedUser.status)}
                    <span className="text-sm capitalize">{selectedUser.status}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <div className="mt-1 text-sm">{selectedUser.phone || 'Not provided'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Created</Label>
                  <div className="mt-1 text-sm">
                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Last Login</Label>
                  <div className="mt-1 text-sm">
                    {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                {canEditRecords('users') && (
                  <Button 
                    onClick={() => {
                      setShowViewDialog(false);
                      handleEditUser(selectedUser);
                    }}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit User
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowViewDialog(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-sm text-gray-600">{selectedUser.email}</div>
                </div>
              </div>

              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  This will permanently delete the user account and all associated data.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={confirmDeleteUser} 
                  disabled={loading}
                  variant="destructive"
                  className="flex-1"
                >
                  {loading ? 'Deleting...' : 'Delete User'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
