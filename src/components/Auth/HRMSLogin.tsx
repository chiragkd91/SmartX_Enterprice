/**
 * HRMS-Specific Login Component with Rate Limiting
 * Provides dedicated login interface for HRMS users
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { useStore } from '../../store/useStore';
import { 
  Users, 
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
  CheckCircle,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  Key,
  Mail,
  Lock,
  ArrowRight,
  Building2
} from 'lucide-react';

export default function HRMSLogin() {
  const [email, setEmail] = useState('hr@smartbizflow.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [cooldownActive, setCooldownActive] = useState(false);

  const { login } = useStore();
  const navigate = useNavigate();

  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (retryAfter && retryAfter > 0) {
      setCooldownActive(true);
      timer = setInterval(() => {
        setRetryAfter(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            setCooldownActive(false);
            return null;
          }
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [retryAfter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldownActive) {
      setError(`Please wait ${retryAfter} seconds before trying again.`);
      return;
    }
    
    console.log('🚀 HRMS Login form submitted:', { email, password });
    setLoading(true);
    setError(null);
    
    try {
      // Force HRMS module for this login
      const success = await login(email, password, 'hr');
      console.log('🔐 HRMS Login result:', success);
      
      if (success) {
        console.log('✅ HRMS Login successful, redirecting to HRMS dashboard');
        // Reset cooldown on successful login
        setRetryAfter(null);
        setCooldownActive(false);
        
        // Navigate to HR dashboard
        console.log('🚀 Navigating to HR dashboard...');
        navigate('/hr/dashboard', { replace: true });
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      console.error('❌ HRMS Login error:', err);
      
      // Handle rate limiting errors
      if (err?.response?.status === 429) {
        const retryAfterSeconds = err?.response?.data?.retryAfter || 60;
        setRetryAfter(retryAfterSeconds);
        setError(`Too many login attempts. Please wait ${retryAfterSeconds} seconds before trying again.`);
      } else if (err?.message?.includes('429') || err?.message?.includes('rate limit')) {
        setRetryAfter(60); // Default 1 minute cooldown
        setError('Too many login attempts. Please wait 1 minute before trying again.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const hrmsFeatures = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Employee Management",
      description: "Complete employee lifecycle management"
    },
    {
      icon: <Calendar className="h-6 w-6 text-green-600" />,
      title: "Attendance & Leave",
      description: "Track attendance and manage leave requests"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-yellow-600" />,
      title: "Payroll Management",
      description: "Automated payroll processing and reports"
    },
    {
      icon: <Target className="h-6 w-6 text-purple-600" />,
      title: "Performance Tracking",
      description: "Employee performance and goal management"
    },
    {
      icon: <UserPlus className="h-6 w-6 text-indigo-600" />,
      title: "Recruitment",
      description: "End-to-end recruitment and onboarding"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-red-600" />,
      title: "HR Analytics",
      description: "Comprehensive HR reports and insights"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - HRMS Features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 rounded-full p-3">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SmartX <span className="text-blue-600">HRMS</span>
            </h1>
            <p className="text-lg text-gray-600">
              Complete Human Resource Management System
            </p>
            <Badge className="mt-2 bg-blue-100 text-blue-800">
              Enterprise Grade • Secure • Scalable
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {hrmsFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-2">
                  {feature.icon}
                  <h3 className="font-semibold text-sm text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              HRMS Capabilities
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">Compliance Ready</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">15+</div>
                <div className="text-sm text-gray-600">HR Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                HRMS Portal Login
              </CardTitle>
              <CardDescription className="text-gray-600">
                Access your Human Resources Management System
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className={`border-red-200 bg-red-50 ${cooldownActive ? 'border-orange-200 bg-orange-50' : ''}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className={`${cooldownActive ? 'text-orange-800' : 'text-red-800'}`}>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 h-12"
                      required
                      disabled={loading || cooldownActive}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12"
                      required
                      disabled={loading || cooldownActive}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={loading || cooldownActive}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full h-12 font-semibold transition-all duration-200 ${
                    cooldownActive 
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                  disabled={loading || cooldownActive}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : cooldownActive ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Wait {retryAfter}s
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Sign in to HRMS
                    </>
                  )}
                </Button>
              </form>

              {/* Default Credentials */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Test Credentials
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">HR Manager:</span> hr@smartbizflow.com / password123
                  </div>
                  <div>
                    <span className="font-medium">Employee:</span> employee@smartbizflow.com / password123
                  </div>
                </div>
              </div>

              {cooldownActive && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center text-orange-800 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Please wait {retryAfter} seconds before next attempt</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}