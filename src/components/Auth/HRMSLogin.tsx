import React, { useState } from 'react';
import { Eye, EyeOff, Users, UserCheck, Lock, Mail, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useStore } from '../../store/useStore';

interface HRMSLoginProps {
  onLoginSuccess?: (module: string, user: any) => void;
}

export default function HRMSLogin({ onLoginSuccess }: HRMSLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const { login, loading, error } = useStore();

  // HRMS-specific user types with static password
  const STATIC_PASSWORD = 'password123';
  const hrmsUsers = [
    { email: 'hr@smartbizflow.com', password: STATIC_PASSWORD, role: 'hr_manager', name: 'HR Manager' },
    { email: 'john.smith@smartbizflow.com', password: STATIC_PASSWORD, role: 'employee', name: 'Employee' },
    { email: 'finance@smartbizflow.com', password: STATIC_PASSWORD, role: 'finance_manager', name: 'Finance Manager' },
    { email: 'admin@smartbizflow.com', password: STATIC_PASSWORD, role: 'admin', name: 'System Administrator' }
  ];

  const handleQuickLogin = async (user: typeof hrmsUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedUserType(user.role);
    
    // Auto-login after setting credentials
    const success = await login(user.email, user.password, 'hrms');
    if (success && onLoginSuccess) {
      onLoginSuccess('hrms', { email: user.email, role: user.role });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password, 'hrms');
    if (success && onLoginSuccess) {
      onLoginSuccess('hrms', { email, role: selectedUserType });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - HRMS Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-green-600 p-12 flex-col justify-center text-white">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">SmartBizFlow</h1>
                <p className="text-blue-100">HRMS Portal</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Human Resource Management System</h2>
              <p className="text-blue-100 text-lg">
                Complete HR solution for managing employees, payroll, attendance, and more.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 rounded-lg p-4">
                <Building2 className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Employee Management</h3>
                <p className="text-sm text-blue-100">Complete employee lifecycle</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <UserCheck className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Attendance & Leave</h3>
                <p className="text-sm text-blue-100">Track time and manage leaves</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">HRMS Login</h2>
              <p className="text-gray-600 mt-2">Access your HR management portal</p>
            </div>

            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In to HRMS'}
              </Button>
            </form>

            {/* Quick Login Options */}
            <div className="mt-8">
              <div className="text-center text-sm text-gray-600 mb-4">Quick Login Options</div>
              <div className="grid grid-cols-2 gap-3">
                {hrmsUsers.map((user, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin(user)}
                    className="text-xs border-blue-200 hover:bg-blue-50"
                  >
                    {user.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Access URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5173/#/hrms/login</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}