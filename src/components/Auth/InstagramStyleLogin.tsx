/**
 * Instagram-Style Login Form for SmartX Solution
 * Features RBAC policy and department name display
 */

import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useStore } from '../../store/useStore';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  UserCheck, 
  Target,
  MessageSquare,
  DollarSign,
  Monitor,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Briefcase,
  GraduationCap,
  Heart,
  Star,
  Zap,
  Database,
  Settings,
  ArrowRight,
  Home,
  Search,
  Bell,
  Plus,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
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
  ThumbsUp,
  ThumbsDown,
  Phone as PhoneIcon,
  MapPin,
  Globe,
  CreditCard,
  FileText,
  ShoppingCart,
  Package,
  Wrench,
  QrCode,
  HardDrive,
  Brain,
  Activity,
  FolderOpen,
  Copy,
  Share,
  Unlock,
  RefreshCw,
  Save,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  LogOut
} from 'lucide-react';

type AuthScreen = 'login' | 'forgot-password' | 'reset-success';
type UserType = 'admin' | 'hr_manager' | 'employee' | 'crm_manager' | 'sales_rep' | 'customer_support' | 'finance_manager' | 'it_admin' | 'viewer';

interface ForgotPasswordData {
  email: string;
  phone: string;
  userType: UserType;
}

export default function InstagramStyleLogin() {
  const { login, currentUser, loading, error } = useStore();
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<UserType>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [logoutReason, setLogoutReason] = useState<string | null>(null);
  
  // Forgot password form
  const [forgotPasswordData, setForgotPasswordData] = useState<ForgotPasswordData>({
    email: '',
    phone: '',
    userType: 'employee'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !selectedUserType) {
      return;
    }
    
    try {
      const success = await login(email, password);
      if (success) {
        // Login successful - redirect handled by store
        console.log('✅ Login successful');
      }
    } catch (err) {
      console.error('🚨 Login error:', err);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement forgot password logic
    setCurrentScreen('reset-success');
  };

  const resetForgotForm = () => {
    setForgotPasswordData({ email: '', phone: '', userType: 'employee' });
    setCurrentScreen('login');
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    try {
      const success = await login(userEmail, userPassword);
      if (success) {
        console.log('✅ Quick login successful');
      }
    } catch (err) {
      console.error('🚨 Quick login error:', err);
    }
  };

  const userTypes: { value: UserType; label: string; icon: any; color: string; description: string; department: string }[] = [
    { value: 'admin', label: 'System Administrator', icon: Shield, color: 'bg-red-500', description: 'Full system access and management', department: 'IT Administration' },
    { value: 'hr_manager', label: 'HR Manager', icon: Users, color: 'bg-blue-500', description: 'HR operations and employee management', department: 'Human Resources' },
    { value: 'employee', label: 'Employee', icon: UserCheck, color: 'bg-green-500', description: 'Self-service and personal information', department: 'General' },
    { value: 'crm_manager', label: 'CRM Manager', icon: TrendingUp, color: 'bg-purple-500', description: 'Customer relationship management', department: 'Customer Relations' },
    { value: 'sales_rep', label: 'Sales Representative', icon: Target, color: 'bg-orange-500', description: 'Sales operations and lead management', department: 'Sales' },
    { value: 'customer_support', label: 'Customer Support', icon: MessageSquare, color: 'bg-pink-500', description: 'Customer service and support', department: 'Customer Support' },
    { value: 'finance_manager', label: 'Finance Manager', icon: DollarSign, color: 'bg-yellow-500', description: 'Financial operations and reporting', department: 'Finance' },
    { value: 'it_admin', label: 'IT Administrator', icon: Monitor, color: 'bg-indigo-500', description: 'IT infrastructure and support', department: 'Information Technology' },
    { value: 'viewer', label: 'Viewer', icon: Eye, color: 'bg-gray-500', description: 'Read-only access to reports', department: 'General' }
  ];

  const quickLoginUsers = [
    { email: 'admin@smartbizflow.com', password: 'password123', type: 'admin', name: 'System Admin', color: 'red', department: 'IT Administration' },
    { email: 'hr@smartbizflow.com', password: 'password123', type: 'hr_manager', name: 'HR Manager', color: 'blue', department: 'Human Resources' },
    { email: 'john.smith@smartbizflow.com', password: 'password123', type: 'employee', name: 'John Smith', color: 'green', department: 'Engineering' },
    { email: 'crm@smartbizflow.com', password: 'password123', type: 'crm_manager', name: 'CRM Manager', color: 'purple', department: 'Customer Relations' },
    { email: 'sales@smartbizflow.com', password: 'password123', type: 'sales_rep', name: 'Sales Rep', color: 'orange', department: 'Sales' },
    { email: 'support@smartbizflow.com', password: 'password123', type: 'customer_support', name: 'Support Agent', color: 'pink', department: 'Customer Support' },
    { email: 'finance@smartbizflow.com', password: 'password123', type: 'finance_manager', name: 'Finance Manager', color: 'yellow', department: 'Finance' },
    { email: 'it@smartbizflow.com', password: 'password123', type: 'it_admin', name: 'IT Admin', color: 'indigo', department: 'Information Technology' },
    { email: 'viewer@smartbizflow.com', password: 'password123', type: 'viewer', name: 'Viewer', color: 'gray', department: 'General' }
  ];

  const selectedUserTypeData = userTypes.find(type => type.value === selectedUserType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Instagram-Style Card */}
        <Card className="shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
          {/* Header with SmartX Logo */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              SmartX Solution
            </h1>
            <p className="text-blue-100 text-sm">
              Enterprise Portal Access
            </p>
          </div>

          {/* Login Form */}
          {currentScreen === 'login' && (
            <CardContent className="p-8">
                            {/* Department Badge */}
              {selectedUserTypeData && (
                <div className="text-center mb-6">
                  <Badge 
                    variant="secondary" 
                    className={`${selectedUserTypeData.color} text-white px-4 py-2 rounded-full text-sm font-medium`}
                  >
                    <Briefcase className="h-3 w-3 mr-2" />
                    {selectedUserTypeData.department}
                  </Badge>
                </div>
              )}

              {/* User Type Selection */}
              <div className="space-y-3 mb-6">
                <Label htmlFor="userType" className="text-sm font-medium text-gray-700">
                  Select Your Role
                </Label>
                <Select value={selectedUserType} onValueChange={(value: UserType) => setSelectedUserType(value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-3">
                          <div className={`h-6 w-6 rounded-full ${type.color} flex items-center justify-center`}>
                            <type.icon className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.department}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              {/* Forgot Password Link */}
              <div className="text-center mt-6">
                <button
                  onClick={() => setCurrentScreen('forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Quick Login Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">
                  Quick Access (Demo)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {quickLoginUsers.slice(0, 6).map((user) => (
                    <button
                      key={user.email}
                      onClick={() => quickLogin(user.email, user.password)}
                      className={`p-2 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:scale-105 bg-gradient-to-r ${
                        user.color === 'red' ? 'from-red-500 to-red-600' :
                        user.color === 'blue' ? 'from-blue-500 to-blue-600' :
                        user.color === 'green' ? 'from-green-500 to-green-600' :
                        user.color === 'purple' ? 'from-purple-500 to-purple-600' :
                        user.color === 'orange' ? 'from-orange-500 to-orange-600' :
                        user.color === 'pink' ? 'from-pink-500 to-pink-600' :
                        user.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                        user.color === 'indigo' ? 'from-indigo-500 to-indigo-600' :
                        'from-gray-500 to-gray-600'
                      }`}
                      title={`${user.name} - ${user.department}`}
                    >
                      {user.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          )}

          {/* Forgot Password Screen */}
          {currentScreen === 'forgot-password' && (
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Reset Password</h2>
                <p className="text-gray-600 text-sm">
                  Enter your details to reset your password
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgotEmail">Email Address</Label>
                  <Input
                    id="forgotEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={forgotPasswordData.email}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                    className="h-12 border-2 border-gray-200 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forgotPhone">Phone Number</Label>
                  <Input
                    id="forgotPhone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={forgotPasswordData.phone}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, phone: e.target.value })}
                    className="h-12 border-2 border-gray-200 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forgotUserType">User Type</Label>
                  <Select 
                    value={forgotPasswordData.userType} 
                    onValueChange={(value: UserType) => setForgotPasswordData({ ...forgotPasswordData, userType: value })}
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl"
                >
                  Reset Password
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForgotForm}
                  className="w-full h-12 border-2 border-gray-200 rounded-xl"
                >
                  Back to Login
                </Button>
              </form>
            </CardContent>
          )}

          {/* Reset Success Screen */}
          {currentScreen === 'reset-success' && (
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Sent</h2>
                <p className="text-gray-500 text-sm">
                  We've sent password reset instructions to your email address.
                </p>
              </div>

              <Button
                onClick={resetForgotForm}
                className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-sm text-sm transition-colors duration-200"
              >
                Back to Login
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            © 2024 SmartX Solution. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Terms of Service</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
} 