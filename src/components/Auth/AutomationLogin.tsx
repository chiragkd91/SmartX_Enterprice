import React, { useState } from 'react';
import { Eye, EyeOff, Zap, Bot, Lock, Mail, Workflow } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useStore } from '../../store/useStore';

interface AutomationLoginProps {
  onLoginSuccess?: (module: string, user: any) => void;
}

export default function AutomationLogin({ onLoginSuccess }: AutomationLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const { login, loading, error } = useStore();

  // Automation-specific user types
  const automationUsers = [
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'admin', name: 'System Administrator' },
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'it_admin', name: 'IT Administrator' },
    { email: 'hr@smartbizflow.com', password: 'hr123', role: 'hr_manager', name: 'HR Manager' },
    { email: 'admin@smartbizflow.com', password: 'admin123', role: 'viewer', name: 'Automation Viewer' }
  ];

  const handleQuickLogin = async (user: typeof automationUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedUserType(user.role);
    
    // Auto-login after setting credentials
    const success = await login(user.email, user.password, 'automation');
    if (success && onLoginSuccess) {
      onLoginSuccess('automation', { email: user.email, role: user.role });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password, 'automation');
    if (success && onLoginSuccess) {
      onLoginSuccess('automation', { email, role: selectedUserType });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Automation Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 to-pink-600 p-12 flex-col justify-center text-white">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">SmartBizFlow</h1>
                <p className="text-violet-100">Automation Hub</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Business Process Automation</h2>
              <p className="text-violet-100 text-lg">
                Streamline workflows, automate processes, and boost productivity across all systems.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 rounded-lg p-4">
                <Bot className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Workflow Automation</h3>
                <p className="text-sm text-violet-100">Smart process flows</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Workflow className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Integration Hub</h3>
                <p className="text-sm text-violet-100">Connect all systems</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Automation Login</h2>
              <p className="text-gray-600 mt-2">Access your automation and workflow portal</p>
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
                className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In to Automation'}
              </Button>
            </form>

            {/* Quick Login Options */}
            <div className="mt-8">
              <div className="text-center text-sm text-gray-600 mb-4">Quick Login Options</div>
              <div className="grid grid-cols-2 gap-3">
                {automationUsers.map((user, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin(user)}
                    className="text-xs border-violet-200 hover:bg-violet-50"
                  >
                    {user.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Access URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5173/#/automation/login</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}