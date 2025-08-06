import React, { useState } from 'react';
import { Eye, EyeOff, Monitor, Server, Lock, Mail, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useStore } from '../../store/useStore';

interface ITAssetLoginProps {
  onLoginSuccess?: (module: string, user: any) => void;
}

export default function ITAssetLogin({ onLoginSuccess }: ITAssetLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const { login, loading, error } = useStore();

  // IT Asset-specific user types
  const itAssetUsers = [
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'it_admin', name: 'IT Administrator' },
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'admin', name: 'System Administrator' },
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'customer_support', name: 'IT Support' },
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'viewer', name: 'Asset Viewer' }
  ];

  const handleQuickLogin = async (user: typeof itAssetUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedUserType(user.role);
    
    // Auto-login after setting credentials
    const success = await login(user.email, user.password, 'it-asset');
    if (success && onLoginSuccess) {
      onLoginSuccess('it-asset', { email: user.email, role: user.role });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password, 'it-asset');
    if (success && onLoginSuccess) {
      onLoginSuccess('it-asset', { email, role: selectedUserType });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - IT Asset Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-cyan-600 p-12 flex-col justify-center text-white">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Monitor className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">SmartBizFlow</h1>
                <p className="text-indigo-100">IT Asset Portal</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">IT Asset Management System</h2>
              <p className="text-indigo-100 text-lg">
                Complete IT infrastructure management for hardware, software, and support.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 rounded-lg p-4">
                <Server className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Asset Tracking</h3>
                <p className="text-sm text-indigo-100">Monitor IT equipment</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Shield className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Security Management</h3>
                <p className="text-sm text-indigo-100">Access control & compliance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">IT Asset Login</h2>
              <p className="text-gray-600 mt-2">Access your IT infrastructure portal</p>
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
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In to IT Assets'}
              </Button>
            </form>

            {/* Quick Login Options */}
            <div className="mt-8">
              <div className="text-center text-sm text-gray-600 mb-4">Quick Login Options</div>
              <div className="grid grid-cols-2 gap-3">
                {itAssetUsers.map((user, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin(user)}
                    className="text-xs border-indigo-200 hover:bg-indigo-50"
                  >
                    {user.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Access URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5173/#/assets/login</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}