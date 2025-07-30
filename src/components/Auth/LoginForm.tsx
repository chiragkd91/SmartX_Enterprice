/**
 * Comprehensive HRMS + CRM Login Form
 * Supports multiple user types with role-based access
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useStore } from '../../store/useStore';
import LoginDebug from './LoginDebug';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  Target,
  UserPlus,
  BarChart3,
  GraduationCap,
  User,
  UserMinus,
  Heart,
  GitBranch,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
  MapPin,
  Globe,
  Zap,
  Database,
  Settings,
  LogOut,
  ArrowRight,
  Briefcase,
  CreditCard,
  FileText,
  ShoppingCart,
  Package,
  Monitor,
  Wrench,
  QrCode,
  HardDrive,
  Brain,
  Activity,
  FolderOpen,
  Bell,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Share,
  Lock,
  Unlock,
  RefreshCw,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Menu,
  Home,
  Info,
  HelpCircle,
  ExternalLink,
  Link,
  Image,
  Video,
  Music,
  File,
  Folder,
  Archive,
  Bookmark,
  Flag,
  Heart as HeartIcon,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MessageCircle,
  Phone as PhoneIcon,
  Laptop
} from 'lucide-react';

type AuthScreen = 'login' | 'forgot-password' | 'reset-success';
type UserType = 'admin' | 'hr_manager' | 'employee' | 'crm_manager' | 'sales_rep' | 'customer_support' | 'finance_manager' | 'it_admin' | 'viewer';

interface ForgotPasswordData {
  email: string;
  phone: string;
  userType: UserType;
}

export default function LoginForm() {
  const [email, setEmail] = useState('admin@smartbizflow.com');
  const [password, setPassword] = useState('password123');
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [logoutReason, setLogoutReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>('admin');
  const [forgotData, setForgotData] = useState<ForgotPasswordData>({
    email: '',
    phone: '',
    userType: 'admin'
  });
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { login } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Login form submitted:', { email, password });
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(email, password);
      console.log('🔐 Login result:', success);
      
      if (success) {
        console.log('✅ Login successful, user should be redirected');
        // The login function should update the store state
        // and the App component should re-render and show the main layout
      } else {
        console.log('❌ Login failed');
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('🚨 Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      setForgotSuccess(true);
    } catch (err) {
      setError('Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForgotForm = () => {
    setForgotData({ email: '', phone: '', userType: 'admin' });
    setForgotSuccess(false);
    setCurrentScreen('login');
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    console.log('🚀 Quick login clicked:', { userEmail, userPassword });
    setEmail(userEmail);
    setPassword(userPassword);
    
    // Automatically submit the login form
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(userEmail, userPassword);
      console.log('🔐 Quick login result:', success);
      
      if (success) {
        console.log('✅ Quick login successful, user should be redirected');
        // The login function should update the store state
        // and the App component should re-render and show the main layout
      } else {
        console.log('❌ Quick login failed');
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('🚨 Quick login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const userTypes: { value: UserType; label: string; icon: any; color: string; description: string }[] = [
    { value: 'admin', label: 'System Administrator', icon: Shield, color: 'bg-red-500', description: 'Full system access and management' },
    { value: 'hr_manager', label: 'HR Manager', icon: Users, color: 'bg-blue-500', description: 'HR operations and employee management' },
    { value: 'employee', label: 'Employee', icon: UserCheck, color: 'bg-green-500', description: 'Self-service and personal information' },
    { value: 'crm_manager', label: 'CRM Manager', icon: TrendingUp, color: 'bg-purple-500', description: 'Customer relationship management' },
    { value: 'sales_rep', label: 'Sales Representative', icon: Target, color: 'bg-orange-500', description: 'Sales operations and lead management' },
    { value: 'customer_support', label: 'Customer Support', icon: MessageSquare, color: 'bg-pink-500', description: 'Customer service and support' },
    { value: 'finance_manager', label: 'Finance Manager', icon: DollarSign, color: 'bg-yellow-500', description: 'Financial operations and reporting' },
    { value: 'it_admin', label: 'IT Administrator', icon: Monitor, color: 'bg-indigo-500', description: 'IT infrastructure and support' },
    { value: 'viewer', label: 'Viewer', icon: Eye, color: 'bg-gray-500', description: 'Read-only access to reports' }
  ];

  const quickLoginUsers = [
    { email: 'admin@smartbizflow.com', password: 'password123', type: 'admin', name: 'System Admin', color: 'red' },
    { email: 'hr@smartbizflow.com', password: 'password123', type: 'hr_manager', name: 'HR Manager', color: 'blue' },
    { email: 'john.smith@smartbizflow.com', password: 'password123', type: 'employee', name: 'John Smith', color: 'green' },
    { email: 'crm@smartbizflow.com', password: 'password123', type: 'crm_manager', name: 'CRM Manager', color: 'purple' },
    { email: 'sales@smartbizflow.com', password: 'password123', type: 'sales_rep', name: 'Sales Rep', color: 'orange' },
    { email: 'support@smartbizflow.com', password: 'password123', type: 'customer_support', name: 'Support Agent', color: 'pink' },
    { email: 'finance@smartbizflow.com', password: 'password123', type: 'finance_manager', name: 'Finance Manager', color: 'yellow' },
    { email: 'it@smartbizflow.com', password: 'password123', type: 'it_admin', name: 'IT Admin', color: 'indigo' },
    { email: 'viewer@smartbizflow.com', password: 'password123', type: 'viewer', name: 'Viewer', color: 'gray' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <LoginDebug />
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              SmartX Solution Enterprise
            </h1>
            <p className="text-xl text-gray-600">
              Complete SmartX CRM + ERP + HRMS + IT Asset Solution
            </p>
            <div className="flex justify-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">SmartX CRM</Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">SmartX ERP</Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">SmartX HRMS</Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">SmartX IT Asset</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <h3 className="font-semibold text-gray-800">SmartX CRM</h3>
              </div>
              <p className="text-sm text-gray-600">
                Customer relationship management with lead tracking, sales pipeline, and analytics
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <Package className="h-8 w-8 text-purple-600" />
                <h3 className="font-semibold text-gray-800">SmartX ERP</h3>
              </div>
              <p className="text-sm text-gray-600">
                Enterprise resource planning with inventory, orders, invoices, and vendor management
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-8 w-8 text-green-600" />
                <h3 className="font-semibold text-gray-800">SmartX HRMS</h3>
              </div>
              <p className="text-sm text-gray-600">
                Complete employee lifecycle management with payroll, attendance, and performance tracking
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <Laptop className="h-8 w-8 text-orange-600" />
                <h3 className="font-semibold text-gray-800">SmartX IT Asset</h3>
              </div>
              <p className="text-sm text-gray-600">
                IT asset management with tracking, maintenance, software licenses, and support tickets
              </p>
            </div>
          </div>

          {/* System Stats */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">SmartX Solution Overview</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">SmartX CRM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-purple-600" />
                <span className="text-gray-600">SmartX ERP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">SmartX HRMS</span>
              </div>
              <div className="flex items-center space-x-2">
                <Laptop className="h-4 w-4 text-orange-600" />
                <span className="text-gray-600">SmartX IT Asset</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            {/* Login Screen */}
            {currentScreen === 'login' && (
              <>
                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-4 lg:hidden">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Sign in to your SmartX Solution Enterprise Portal
                  </CardDescription>
                  
                  {/* Logout Reason Alert */}
                  {logoutReason === 'session_timeout' && (
                    <Alert className="border-yellow-200 bg-yellow-50 mt-4">
                      <Clock className="h-4 w-4" />
                      <AlertDescription className="text-yellow-800">
                        Your session has expired. Please log in again.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User Type Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="userType">User Type</Label>
                      <Select value={selectedUserType} onValueChange={(value: UserType) => setSelectedUserType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          {userTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <type.icon className="h-4 w-4" />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Login Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Quick Login Section */}
                  <div className="mt-8 space-y-4">
                    <h4 className="font-medium text-gray-800 text-center">Quick Login Options:</h4>
                    
                    <Tabs defaultValue="admin" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                        <TabsTrigger value="hr">HR</TabsTrigger>
                        <TabsTrigger value="crm">CRM</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="admin" className="space-y-2">
                        <div className="grid grid-cols-1 gap-2">
                          {quickLoginUsers.filter(user => ['admin', 'it_admin', 'viewer'].includes(user.type)).map((user) => (
                            <div key={user.email} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full bg-${user.color}-500`}></div>
                                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => quickLogin(user.email, user.password)}
                                  className="text-xs"
                                >
                                  Login
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="hr" className="space-y-2">
                        <div className="grid grid-cols-1 gap-2">
                          {quickLoginUsers.filter(user => ['hr_manager', 'employee', 'finance_manager'].includes(user.type)).map((user) => (
                            <div key={user.email} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full bg-${user.color}-500`}></div>
                                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => quickLogin(user.email, user.password)}
                                  className="text-xs"
                                >
                                  Login
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="crm" className="space-y-2">
                        <div className="grid grid-cols-1 gap-2">
                          {quickLoginUsers.filter(user => ['crm_manager', 'sales_rep', 'customer_support'].includes(user.type)).map((user) => (
                            <div key={user.email} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full bg-${user.color}-500`}></div>
                                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => quickLogin(user.email, user.password)}
                                  className="text-xs"
                                >
                                  Login
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="mt-6 text-center">
                    <Button
                      variant="link"
                      onClick={() => setCurrentScreen('forgot-password')}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Forgot your password?
                    </Button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                      © 2024 SmartX Solution Enterprise. All rights reserved.
                    </p>
                  </div>
                </CardContent>
              </>
            )}

            {/* Forgot Password Screen */}
            {currentScreen === 'forgot-password' && (
              <>
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <Key className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Enter your details to reset your password
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    {/* User Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Account Type</Label>
                      <Select 
                        value={forgotData.userType} 
                        onValueChange={(value: UserType) => setForgotData({...forgotData, userType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          {userTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <type.icon className="h-4 w-4" />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="Enter your email"
                          value={forgotData.email}
                          onChange={(e) => setForgotData({...forgotData, email: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                      <Label htmlFor="forgot-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="forgot-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={forgotData.phone}
                          onChange={(e) => setForgotData({...forgotData, phone: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Reset Link...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>

                    {/* Back to Login */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={resetForgotForm}
                    >
                      Back to Login
                    </Button>
                  </form>
                </CardContent>
              </>
            )}

            {/* Reset Success Screen */}
            {currentScreen === 'reset-success' && (
              <>
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Reset Link Sent
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Check your email and phone for password reset instructions
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <Alert className="border-green-200 bg-green-50 mb-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-800">
                      Password reset instructions have been sent to your email and phone number.
                    </AlertDescription>
                  </Alert>
                  
                  <Button
                    onClick={resetForgotForm}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Back to Login
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
