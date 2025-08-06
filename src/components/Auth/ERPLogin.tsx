import React, { useState } from 'react';
import { Eye, EyeOff, Package, Factory, Lock, Mail, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useStore } from '../../store/useStore';

interface ERPLoginProps {
  onLoginSuccess?: (module: string, user: any) => void;
}

export default function ERPLogin({ onLoginSuccess }: ERPLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const { login, loading, error } = useStore();

  // ERP-specific user types
  const erpUsers = [
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'finance_manager', name: 'Finance Manager' },
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'admin', name: 'System Administrator' },
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'viewer', name: 'ERP Viewer' },
    { email: 'hr@smartbizflow.com', password: 'hr123', role: 'hr_manager', name: 'HR Manager' }
  ];

  const handleQuickLogin = async (user: typeof erpUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedUserType(user.role);
    
    // Auto-login after setting credentials
    const success = await login(user.email, user.password, 'erp');
    if (success && onLoginSuccess) {
      onLoginSuccess('erp', { email: user.email, role: user.role });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password, 'erp');
    if (success && onLoginSuccess) {
      onLoginSuccess('erp', { email, role: selectedUserType });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-red-50 p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - ERP Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-yellow-600 to-red-600 p-12 flex-col justify-center text-white">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Factory className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">SmartBizFlow</h1>
                <p className="text-yellow-100">ERP Portal</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Enterprise Resource Planning</h2>
              <p className="text-yellow-100 text-lg">
                Complete business management solution for inventory, finance, and operations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 rounded-lg p-4">
                <Package className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Inventory Management</h3>
                <p className="text-sm text-yellow-100">Stock and warehouse control</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <BarChart3 className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Financial Management</h3>
                <p className="text-sm text-yellow-100">Accounting and reporting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">ERP Login</h2>
              <p className="text-gray-600 mt-2">Access your enterprise resource portal</p>
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
                className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In to ERP'}
              </Button>
            </form>

            {/* Quick Login Options */}
            <div className="mt-8">
              <div className="text-center text-sm text-gray-600 mb-4">Quick Login Options</div>
              <div className="grid grid-cols-2 gap-3">
                {erpUsers.map((user, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin(user)}
                    className="text-xs border-yellow-200 hover:bg-yellow-50"
                  >
                    {user.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Access URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5173/#/erp/login</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}