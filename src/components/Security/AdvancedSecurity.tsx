import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, Lock, Unlock, Eye, EyeOff, AlertTriangle, CheckCircle, 
  Settings, RefreshCw, Plus, Zap, Database, Users, Clock, 
  DollarSign, TrendingUp, Cpu, HardDrive, Wifi, Key, 
  Fingerprint, Camera, Bell, Activity, Target, Crosshair, Code
} from 'lucide-react';

interface SecurityThreat {
  id: string;
  type: 'malware' | 'phishing' | 'ddos' | 'brute_force' | 'sql_injection' | 'xss';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'contained' | 'resolved' | 'false_positive';
  source: string;
  target: string;
  timestamp: Date;
  description: string;
  affectedUsers: number;
  impact: string;
  mitigation: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  type: 'authentication' | 'authorization' | 'network' | 'data' | 'compliance';
  status: 'active' | 'inactive' | 'draft' | 'review';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  rules: string[];
  lastUpdated: Date;
  compliance: string[];
  enforcement: 'automatic' | 'manual' | 'semi-automatic';
}

interface SecurityMetrics {
  totalThreats: number;
  activeThreats: number;
  securityScore: number;
  complianceRate: number;
  lastScan: Date;
  vulnerabilities: number;
  blockedAttacks: number;
  securityStatus: 'secure' | 'warning' | 'breach' | 'maintenance';
}

const AdvancedSecurity: React.FC = () => {
  const [activeTab, setActiveTab] = useState('threats');
  const [loading, setLoading] = useState(false);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalThreats: 0,
    activeThreats: 0,
    securityScore: 0,
    complianceRate: 0,
    lastScan: new Date(),
    vulnerabilities: 0,
    blockedAttacks: 0,
    securityStatus: 'secure'
  });

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setThreats([
        {
          id: 'threat-001',
          type: 'phishing',
          severity: 'high',
          status: 'contained',
          source: '192.168.1.100',
          target: 'admin@smartbizflow.com',
          timestamp: new Date('2024-01-20T10:30:00'),
          description: 'Suspicious email detected with malicious attachment',
          affectedUsers: 1,
          impact: 'Potential data breach prevented',
          mitigation: 'Email quarantined, user notified, security scan completed'
        },
        {
          id: 'threat-002',
          type: 'brute_force',
          severity: 'medium',
          status: 'resolved',
          source: '203.45.67.89',
          target: 'Login API',
          timestamp: new Date('2024-01-20T09:15:00'),
          description: 'Multiple failed login attempts detected',
          affectedUsers: 0,
          impact: 'Account temporarily locked',
          mitigation: 'IP blocked, account locked for 30 minutes'
        },
        {
          id: 'threat-003',
          type: 'ddos',
          severity: 'critical',
          status: 'investigating',
          source: 'Multiple IPs',
          target: 'Web Server',
          timestamp: new Date('2024-01-20T08:45:00'),
          description: 'Distributed denial of service attack detected',
          affectedUsers: 150,
          impact: 'Service degradation',
          mitigation: 'DDoS protection activated, traffic filtering enabled'
        },
        {
          id: 'threat-004',
          type: 'sql_injection',
          severity: 'high',
          status: 'detected',
          source: '185.76.43.21',
          target: 'Database API',
          timestamp: new Date('2024-01-20T08:30:00'),
          description: 'SQL injection attempt detected in user input',
          affectedUsers: 0,
          impact: 'Attack blocked',
          mitigation: 'Input sanitization enhanced, WAF rules updated'
        }
      ]);

      setPolicies([
        {
          id: 'policy-001',
          name: 'Multi-Factor Authentication',
          type: 'authentication',
          status: 'active',
          priority: 'critical',
          description: 'Require MFA for all user accounts',
          rules: [
            'All users must enable 2FA within 7 days',
            'SMS or authenticator app required',
            'Backup codes must be generated',
            'MFA bypass requires admin approval'
          ],
          lastUpdated: new Date('2024-01-20T10:00:00'),
          compliance: ['GDPR', 'SOX', 'HIPAA'],
          enforcement: 'automatic'
        },
        {
          id: 'policy-002',
          name: 'Password Policy',
          type: 'authentication',
          status: 'active',
          priority: 'high',
          description: 'Strong password requirements',
          rules: [
            'Minimum 12 characters',
            'Must include uppercase, lowercase, numbers, symbols',
            'No common passwords allowed',
            'Password history of last 5 passwords'
          ],
          lastUpdated: new Date('2024-01-19T16:30:00'),
          compliance: ['GDPR', 'SOX'],
          enforcement: 'automatic'
        },
        {
          id: 'policy-003',
          name: 'Data Encryption',
          type: 'data',
          status: 'active',
          priority: 'critical',
          description: 'Encrypt all sensitive data',
          rules: [
            'AES-256 encryption for data at rest',
            'TLS 1.3 for data in transit',
            'Encrypt database backups',
            'Key rotation every 90 days'
          ],
          lastUpdated: new Date('2024-01-18T14:15:00'),
          compliance: ['GDPR', 'SOX', 'HIPAA', 'PCI-DSS'],
          enforcement: 'automatic'
        },
        {
          id: 'policy-004',
          name: 'Access Control',
          type: 'authorization',
          status: 'active',
          priority: 'high',
          description: 'Role-based access control',
          rules: [
            'Principle of least privilege',
            'Regular access reviews',
            'Session timeout after 30 minutes',
            'IP whitelisting for admin access'
          ],
          lastUpdated: new Date('2024-01-17T11:45:00'),
          compliance: ['GDPR', 'SOX'],
          enforcement: 'semi-automatic'
        }
      ]);

      setMetrics({
        totalThreats: 4,
        activeThreats: 2,
        securityScore: 92,
        complianceRate: 98,
        lastScan: new Date('2024-01-20T10:30:00'),
        vulnerabilities: 3,
        blockedAttacks: 156,
        securityStatus: 'secure'
      });

      setLoading(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'contained':
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'detected':
        return 'bg-orange-100 text-orange-800';
      case 'false_positive':
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware':
        return <Target className="h-4 w-4" />;
      case 'phishing':
        return <Eye className="h-4 w-4" />;
      case 'ddos':
        return <Activity className="h-4 w-4" />;
      case 'brute_force':
        return <Crosshair className="h-4 w-4" />;
      case 'sql_injection':
        return <Database className="h-4 w-4" />;
      case 'xss':
        return <Code className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'authentication':
        return <Key className="h-4 w-4" />;
      case 'authorization':
        return <Shield className="h-4 w-4" />;
      case 'network':
        return <Wifi className="h-4 w-4" />;
      case 'data':
        return <Lock className="h-4 w-4" />;
      case 'compliance':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getSecurityStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'breach': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Security</h1>
          <p className="text-gray-600 mt-2">
            Enhanced security protocols, threat detection, and security management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span>Advanced Security</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Lock className="h-4 w-4" />
            <span>Enhanced Protocols</span>
          </Badge>
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Advanced security features provide comprehensive threat detection, 
          automated response systems, and enhanced security protocols for enterprise-grade protection.
        </AlertDescription>
      </Alert>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.securityScore}%</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Overall security rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Threats</p>
                <p className="text-2xl font-bold text-red-600">{metrics.activeThreats}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Current threats</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked Attacks</p>
                <p className="text-2xl font-bold text-green-600">{metrics.blockedAttacks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Today's blocked attacks</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.complianceRate}%</p>
              </div>
              <div className={`p-2 rounded-full ${getSecurityStatusColor(metrics.securityStatus)}`}>
                <Shield className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Regulatory compliance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="threats" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Security Threats</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security Policies</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Active Threats</span>
                </CardTitle>
                <CardDescription>
                  Currently active security threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {threats.filter(t => t.status === 'detected' || t.status === 'investigating').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Active threats
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Resolved</span>
                </CardTitle>
                <CardDescription>
                  Successfully resolved threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {threats.filter(t => t.status === 'resolved').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Resolved threats
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Total Threats</span>
                </CardTitle>
                <CardDescription>
                  All detected threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{threats.length}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Total threats
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Threats</CardTitle>
              <CardDescription>
                Recent security threats and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {threats.map((threat) => (
                  <div key={threat.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getThreatIcon(threat.type)}
                            <h3 className="font-semibold">
                              {threat.type.replace('_', ' ').toUpperCase()}
                            </h3>
                            <Badge className={getStatusColor(threat.status)}>
                              {threat.status.toUpperCase()}
                            </Badge>
                            <Badge className={getSeverityColor(threat.severity)}>
                              {threat.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Source: {threat.source} | Target: {threat.target}
                          </p>
                          <p className="text-xs text-gray-500">
                            Detected: {threat.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {threat.affectedUsers}
                        </div>
                        <div className="text-sm text-gray-600">
                          Affected Users
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Description</h4>
                      <p className="text-sm text-gray-700">{threat.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Impact</h4>
                        <p className="text-sm text-gray-700">{threat.impact}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Mitigation</h4>
                        <p className="text-sm text-gray-700">{threat.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Active Policies</span>
                </CardTitle>
                <CardDescription>
                  Currently active security policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {policies.filter(p => p.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Active policies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Critical Policies</span>
                </CardTitle>
                <CardDescription>
                  Critical security policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {policies.filter(p => p.priority === 'critical').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Critical policies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <span>Auto Enforcement</span>
                </CardTitle>
                <CardDescription>
                  Automatically enforced policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {policies.filter(p => p.enforcement === 'automatic').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Auto-enforced
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>
                Security policies and their enforcement status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {policies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getPolicyIcon(policy.type)}
                            <h3 className="font-semibold">{policy.name}</h3>
                            <Badge className={getStatusColor(policy.status)}>
                              {policy.status.toUpperCase()}
                            </Badge>
                            <Badge className={getSeverityColor(policy.priority)}>
                              {policy.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {policy.enforcement.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Type: {policy.type} | Last Updated: {policy.lastUpdated.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Description</h4>
                      <p className="text-sm text-gray-700">{policy.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Rules</h4>
                        <div className="space-y-1">
                          {policy.rules.map((rule, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Compliance</h4>
                        <div className="flex flex-wrap gap-2">
                          {policy.compliance.map((comp, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Security Scan
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Security Settings
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSecurity; 