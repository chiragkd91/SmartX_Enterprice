/**
 * VAPT Dashboard - Vulnerability Assessment and Penetration Testing
 * Comprehensive security testing and monitoring interface
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  Shield, Lock, Unlock, Eye, EyeOff, AlertTriangle, CheckCircle, 
  Settings, RefreshCw, Plus, Zap, Database, Users, Clock, 
  DollarSign, TrendingUp, Cpu, HardDrive, Wifi, Key, 
  Fingerprint, Camera, Bell, Activity, Target, Crosshair, Code,
  Bug, Search, FileText, Download, Upload, Play, Stop, 
  BarChart3, ShieldCheck, AlertCircle, XCircle, Info, Edit
} from 'lucide-react';
import { format } from 'date-fns';

interface VulnerabilityScan {
  id: string;
  name: string;
  target: string;
  type: 'automated' | 'manual' | 'penetration';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startDate: Date;
  endDate?: Date;
  vulnerabilities: Vulnerability[];
  securityScore: number;
  compliance: ComplianceStatus;
}

interface Vulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'sql_injection' | 'xss' | 'csrf' | 'authentication' | 'authorization' | 'data_exposure' | 'configuration' | 'encryption';
  title: string;
  description: string;
  cve?: string;
  cvss?: number;
  affectedComponent: string;
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
  discoveredAt: Date;
  resolvedAt?: Date;
  proofOfConcept?: string;
}

interface PenetrationTest {
  id: string;
  name: string;
  type: 'web_application' | 'network' | 'social_engineering' | 'physical' | 'mobile';
  scope: string[];
  methodology: string;
  status: 'planned' | 'in_progress' | 'completed' | 'reported';
  startDate: Date;
  endDate?: Date;
  findings: PenetrationFinding[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface PenetrationFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  proofOfConcept: string;
  impact: string;
  remediation: string;
  references: string[];
  discoveredAt: Date;
}

interface ComplianceStatus {
  owasp: boolean;
  gdpr: boolean;
  sox: boolean;
  hipaa: boolean;
  pci_dss: boolean;
  iso27001: boolean;
}

interface SecurityTool {
  id: string;
  name: string;
  type: 'scanner' | 'analyzer' | 'monitor' | 'reporter';
  status: 'active' | 'inactive' | 'error';
  lastRun: Date;
  nextRun: Date;
  configuration: any;
}

const VAPTDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [scans, setScans] = useState<VulnerabilityScan[]>([]);
  const [penetrationTests, setPenetrationTests] = useState<PenetrationTest[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [securityTools, setSecurityTools] = useState<SecurityTool[]>([]);
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [isPenTestDialogOpen, setIsPenTestDialogOpen] = useState(false);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [selectedScan, setSelectedScan] = useState<VulnerabilityScan | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockScans: VulnerabilityScan[] = [
      {
        id: '1',
        name: 'Web Application Security Scan',
        target: 'https://smartbizflow.com',
        type: 'automated',
        status: 'completed',
        startDate: new Date('2024-01-20T10:00:00'),
        endDate: new Date('2024-01-20T11:30:00'),
        vulnerabilities: [
          {
            id: 'vuln-1',
            severity: 'high',
            category: 'sql_injection',
            title: 'SQL Injection in Login Form',
            description: 'Login form is vulnerable to SQL injection attacks',
            cve: 'CVE-2024-1234',
            cvss: 8.5,
            affectedComponent: '/api/auth/login',
            remediation: 'Use parameterized queries and input validation',
            status: 'open',
            discoveredAt: new Date('2024-01-20T11:00:00'),
            proofOfConcept: "'; DROP TABLE users; --"
          },
          {
            id: 'vuln-2',
            severity: 'medium',
            category: 'xss',
            title: 'Cross-Site Scripting in User Input',
            description: 'User input is not properly sanitized',
            cve: 'CVE-2024-5678',
            cvss: 6.1,
            affectedComponent: '/api/users/profile',
            remediation: 'Implement proper input sanitization and output encoding',
            status: 'in_progress',
            discoveredAt: new Date('2024-01-20T11:15:00')
          }
        ],
        securityScore: 72,
        compliance: {
          owasp: false,
          gdpr: true,
          sox: true,
          hipaa: false,
          pci_dss: false,
          iso27001: false
        }
      }
    ];

    const mockPenTests: PenetrationTest[] = [
      {
        id: '1',
        name: 'Comprehensive Web Application Penetration Test',
        type: 'web_application',
        scope: ['Authentication', 'Authorization', 'Data Validation', 'Session Management'],
        methodology: 'OWASP Testing Guide v4.0',
        status: 'completed',
        startDate: new Date('2024-01-15T09:00:00'),
        endDate: new Date('2024-01-17T17:00:00'),
        findings: [
          {
            id: 'finding-1',
            severity: 'critical',
            category: 'Authentication Bypass',
            title: 'Authentication Bypass via Session Manipulation',
            description: 'Attackers can bypass authentication by manipulating session tokens',
            proofOfConcept: 'Modify session cookie to access admin panel',
            impact: 'Complete system compromise possible',
            remediation: 'Implement secure session management and token validation',
            references: ['OWASP Session Management', 'CWE-384'],
            discoveredAt: new Date('2024-01-16T14:30:00')
          }
        ],
        riskLevel: 'high'
      }
    ];

    const mockTools: SecurityTool[] = [
      {
        id: '1',
        name: 'OWASP ZAP',
        type: 'scanner',
        status: 'active',
        lastRun: new Date('2024-01-20T10:00:00'),
        nextRun: new Date('2024-01-27T10:00:00'),
        configuration: {
          target: 'https://smartbizflow.com',
          scanType: 'full',
          alertThreshold: 'medium'
        }
      },
      {
        id: '2',
        name: 'Nmap Network Scanner',
        type: 'scanner',
        status: 'active',
        lastRun: new Date('2024-01-19T15:00:00'),
        nextRun: new Date('2024-01-26T15:00:00'),
        configuration: {
          target: '192.168.1.0/24',
          scanType: 'network',
          ports: '1-1000'
        }
      },
      {
        id: '3',
        name: 'Burp Suite Professional',
        type: 'analyzer',
        status: 'active',
        lastRun: new Date('2024-01-20T09:00:00'),
        nextRun: new Date('2024-01-27T09:00:00'),
        configuration: {
          target: 'https://smartbizflow.com',
          scanType: 'passive',
          spider: true
        }
      }
    ];

    setScans(mockScans);
    setPenetrationTests(mockPenTests);
    setVulnerabilities(mockScans.flatMap(scan => scan.vulnerabilities));
    setSecurityTools(mockTools);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getToolStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatus = (compliance: ComplianceStatus) => {
    const total = Object.keys(compliance).length;
    const compliant = Object.values(compliance).filter(Boolean).length;
    return { total, compliant, percentage: (compliant / total) * 100 };
  };

  const stats = {
    totalScans: scans.length,
    activeScans: scans.filter(s => s.status === 'running').length,
    totalVulnerabilities: vulnerabilities.length,
    criticalVulnerabilities: vulnerabilities.filter(v => v.severity === 'critical').length,
    highVulnerabilities: vulnerabilities.filter(v => v.severity === 'high').length,
    openVulnerabilities: vulnerabilities.filter(v => v.status === 'open').length,
    totalPenTests: penetrationTests.length,
    completedPenTests: penetrationTests.filter(p => p.status === 'completed').length,
    activeTools: securityTools.filter(t => t.status === 'active').length,
    averageSecurityScore: scans.length > 0 ? scans.reduce((acc, scan) => acc + scan.securityScore, 0) / scans.length : 0
  };

  const complianceStats = scans.length > 0 ? getComplianceStatus(scans[0].compliance) : { total: 6, compliant: 2, percentage: 33.3 };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">VAPT Dashboard</h1>
          <p className="text-gray-600 mt-2">Vulnerability Assessment and Penetration Testing Management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsScanDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Scan
          </Button>
          <Button variant="outline" onClick={() => setIsPenTestDialogOpen(true)}>
            <Target className="w-4 h-4 mr-2" />
            New Pen Test
          </Button>
          <Button variant="outline" onClick={() => setIsToolDialogOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configure Tools
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Security Score</p>
                <p className="text-2xl font-bold">{stats.averageSecurityScore.toFixed(1)}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bug className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Critical Vulnerabilities</p>
                <p className="text-2xl font-bold">{stats.criticalVulnerabilities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-2xl font-bold">{complianceStats.percentage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Active Tools</p>
                <p className="text-2xl font-bold">{stats.activeTools}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scans">Vulnerability Scans</TabsTrigger>
          <TabsTrigger value="pentests">Penetration Tests</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="tools">Security Tools</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Recent Vulnerability Scans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scans.slice(0, 5).map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{scan.name}</h4>
                        <p className="text-sm text-gray-600">{scan.target}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(scan.status)}>{scan.status}</Badge>
                          <span className="text-xs text-gray-500">Score: {scan.securityScore}/100</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Penetration Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Recent Penetration Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {penetrationTests.slice(0, 5).map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-gray-600">{test.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                          <Badge className={getSeverityColor(test.riskLevel)}>{test.riskLevel} risk</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Security Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Vulnerability Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Critical</span>
                      <span className="font-medium">{stats.criticalVulnerabilities}</span>
                    </div>
                    <Progress value={(stats.criticalVulnerabilities / Math.max(stats.totalVulnerabilities, 1)) * 100} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span>High</span>
                      <span className="font-medium">{stats.highVulnerabilities}</span>
                    </div>
                    <Progress value={(stats.highVulnerabilities / Math.max(stats.totalVulnerabilities, 1)) * 100} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span>Medium</span>
                      <span className="font-medium">{vulnerabilities.filter(v => v.severity === 'medium').length}</span>
                    </div>
                    <Progress value={(vulnerabilities.filter(v => v.severity === 'medium').length / Math.max(stats.totalVulnerabilities, 1)) * 100} className="h-2" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Compliance Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>OWASP</span>
                      <Badge className={scans[0]?.compliance.owasp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {scans[0]?.compliance.owasp ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>GDPR</span>
                      <Badge className={scans[0]?.compliance.gdpr ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {scans[0]?.compliance.gdpr ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>SOX</span>
                      <Badge className={scans[0]?.compliance.sox ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {scans[0]?.compliance.sox ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tool Status</h4>
                  <div className="space-y-2">
                    {securityTools.map((tool) => (
                      <div key={tool.id} className="flex justify-between items-center">
                        <span className="text-sm">{tool.name}</span>
                        <Badge className={getToolStatusColor(tool.status)}>
                          {tool.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vulnerability Scans Tab */}
        <TabsContent value="scans" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Input placeholder="Search scans..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsScanDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Scan
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scan Name</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Security Score</TableHead>
                    <TableHead>Vulnerabilities</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell className="font-medium">{scan.name}</TableCell>
                      <TableCell>{scan.target}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{scan.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(scan.status)}>
                          {scan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{scan.securityScore}/100</span>
                          <Progress value={scan.securityScore} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge className="bg-red-100 text-red-800">
                            {scan.vulnerabilities.filter(v => v.severity === 'critical').length} Critical
                          </Badge>
                          <Badge className="bg-orange-100 text-orange-800">
                            {scan.vulnerabilities.filter(v => v.severity === 'high').length} High
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{scan.startDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Penetration Tests Tab */}
        <TabsContent value="pentests" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Input placeholder="Search tests..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="web_application">Web Application</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="social_engineering">Social Engineering</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsPenTestDialogOpen(true)}>
              <Target className="w-4 h-4 mr-2" />
              New Pen Test
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Findings</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {penetrationTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{test.type.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(test.riskLevel)}>
                          {test.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge className="bg-red-100 text-red-800">
                            {test.findings.filter(f => f.severity === 'critical').length} Critical
                          </Badge>
                          <Badge className="bg-orange-100 text-orange-800">
                            {test.findings.filter(f => f.severity === 'high').length} High
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {test.endDate ? 
                          `${Math.ceil((test.endDate.getTime() - test.startDate.getTime()) / (1000 * 60 * 60 * 24))} days` : 
                          'In Progress'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vulnerabilities Tab */}
        <TabsContent value="vulnerabilities" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Input placeholder="Search vulnerabilities..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Affected Component</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>CVSS</TableHead>
                    <TableHead>Discovered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vulnerabilities.map((vuln) => (
                    <TableRow key={vuln.id}>
                      <TableCell className="font-medium">{vuln.title}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {vuln.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vuln.category.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{vuln.affectedComponent}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vuln.status)}>
                          {vuln.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{vuln.cvss || 'N/A'}</TableCell>
                      <TableCell>{vuln.discoveredAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="scanner">Scanner</SelectItem>
                  <SelectItem value="analyzer">Analyzer</SelectItem>
                  <SelectItem value="monitor">Monitor</SelectItem>
                  <SelectItem value="reporter">Reporter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsToolDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tool
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityTools.map((tool) => (
              <Card key={tool.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{tool.name}</span>
                    <Badge className={getToolStatusColor(tool.status)}>
                      {tool.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {tool.type.charAt(0).toUpperCase() + tool.type.slice(1)} Tool
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Last Run:</span>
                      <span>{tool.lastRun.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Next Run:</span>
                      <span>{tool.nextRun.toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-4 h-4 mr-1" />
                        Config
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Overall Compliance</span>
                    <span className="text-2xl font-bold">{complianceStats.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={complianceStats.percentage} className="h-3" />
                  <div className="text-sm text-gray-600">
                    {complianceStats.compliant} of {complianceStats.total} standards compliant
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Standards */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(scans[0]?.compliance || {}).map(([standard, compliant]) => (
                    <div key={standard} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{standard.toUpperCase()}</span>
                        <p className="text-sm text-gray-600">
                          {standard === 'owasp' && 'OWASP Top 10 Security Risks'}
                          {standard === 'gdpr' && 'General Data Protection Regulation'}
                          {standard === 'sox' && 'Sarbanes-Oxley Act'}
                          {standard === 'hipaa' && 'Health Insurance Portability and Accountability Act'}
                          {standard === 'pci_dss' && 'Payment Card Industry Data Security Standard'}
                          {standard === 'iso27001' && 'ISO 27001 Information Security Management'}
                        </p>
                      </div>
                      <Badge className={compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {compliant ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>OWASP Compliance:</strong> Implement OWASP Top 10 security controls to address web application vulnerabilities.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>HIPAA Compliance:</strong> Implement data encryption, access controls, and audit logging for healthcare data protection.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>PCI-DSS Compliance:</strong> Implement secure payment processing, data encryption, and regular security assessments.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Scan Dialog */}
      <Dialog open={isScanDialogOpen} onOpenChange={setIsScanDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Vulnerability Scan</DialogTitle>
            <DialogDescription>
              Configure and start a new vulnerability assessment scan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="scan-name">Scan Name</Label>
              <Input id="scan-name" placeholder="Enter scan name" />
            </div>
            <div>
              <Label htmlFor="scan-target">Target URL/IP</Label>
              <Input id="scan-target" placeholder="https://example.com or 192.168.1.1" />
            </div>
            <div>
              <Label htmlFor="scan-type">Scan Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automated">Automated Scan</SelectItem>
                  <SelectItem value="manual">Manual Assessment</SelectItem>
                  <SelectItem value="penetration">Penetration Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scan-config">Scan Configuration</Label>
              <Textarea id="scan-config" placeholder="Additional configuration options..." rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsScanDialogOpen(false)}>
                Cancel
              </Button>
              <Button>
                <Play className="w-4 h-4 mr-2" />
                Start Scan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Penetration Test Dialog */}
      <Dialog open={isPenTestDialogOpen} onOpenChange={setIsPenTestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Penetration Test</DialogTitle>
            <DialogDescription>
              Configure and start a new penetration testing engagement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-name">Test Name</Label>
              <Input id="test-name" placeholder="Enter test name" />
            </div>
            <div>
              <Label htmlFor="test-type">Test Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web_application">Web Application</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="social_engineering">Social Engineering</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="mobile">Mobile Application</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="test-scope">Scope</Label>
              <Textarea id="test-scope" placeholder="Define the scope of testing..." rows={3} />
            </div>
            <div>
              <Label htmlFor="test-methodology">Methodology</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select methodology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owasp">OWASP Testing Guide</SelectItem>
                  <SelectItem value="nist">NIST Cybersecurity Framework</SelectItem>
                  <SelectItem value="ptes">PTES (Penetration Testing Execution Standard)</SelectItem>
                  <SelectItem value="custom">Custom Methodology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsPenTestDialogOpen(false)}>
                Cancel
              </Button>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Start Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configure Tools Dialog */}
      <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Security Tools</DialogTitle>
            <DialogDescription>
              Add and configure security testing tools
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tool-name">Tool Name</Label>
              <Input id="tool-name" placeholder="Enter tool name" />
            </div>
            <div>
              <Label htmlFor="tool-type">Tool Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tool type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scanner">Vulnerability Scanner</SelectItem>
                  <SelectItem value="analyzer">Security Analyzer</SelectItem>
                  <SelectItem value="monitor">Security Monitor</SelectItem>
                  <SelectItem value="reporter">Report Generator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tool-config">Configuration</Label>
              <Textarea id="tool-config" placeholder="Tool configuration parameters..." rows={4} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsToolDialogOpen(false)}>
                Cancel
              </Button>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Add Tool
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VAPTDashboard; 