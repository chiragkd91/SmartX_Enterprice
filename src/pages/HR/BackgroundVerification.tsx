/**
 * Background Verification (BGV) Module
 * Comprehensive background verification and compliance management system
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
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Users, 
  Target, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Star, 
  FileText, 
  Shield, 
  UserCheck, 
  Building, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  Globe, 
  Zap,
  Calendar,
  FileCheck,
  AlertTriangle,
  CheckSquare,
  Square,
  Clock4,
  CalendarDays,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  FileX,
  FileSearch,
  UserX,
  UserCheck2,
  Database,
  Lock,
  Unlock,
  RefreshCw,
  Send,
  Archive,
  Flag,
  Star as StarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface BGVCase {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  department: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed' | 'On Hold' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  initiatedDate: Date;
  completedDate?: Date;
  assignedTo: string;
  progress: number;
  documents: BGVDocument[];
  verifications: BGVVerification[];
  notes: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Pending Review';
}

interface BGVDocument {
  id: string;
  name: string;
  type: 'Identity' | 'Education' | 'Employment' | 'Address' | 'Criminal' | 'Reference' | 'Other';
  status: 'Pending' | 'Submitted' | 'Verified' | 'Rejected' | 'Expired';
  uploadedDate: Date;
  verifiedDate?: Date;
  verifiedBy?: string;
  fileUrl: string;
  notes: string;
  isRequired: boolean;
}

interface BGVVerification {
  id: string;
  type: 'Education' | 'Employment' | 'Address' | 'Criminal' | 'Reference' | 'Identity' | 'Credit' | 'Drug Test';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed' | 'On Hold';
  initiatedDate: Date;
  completedDate?: Date;
  verifiedBy: string;
  result: 'Pass' | 'Fail' | 'Pending' | 'Inconclusive';
  notes: string;
  documents: string[];
  externalAgency?: string;
  cost: number;
}

interface BGVTemplate {
  id: string;
  name: string;
  description: string;
  position: string;
  department: string;
  requiredDocuments: string[];
  requiredVerifications: string[];
  estimatedDuration: number;
  cost: number;
  isActive: boolean;
}

const BackgroundVerification: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bgvCases, setBGVCases] = useState<BGVCase[]>([]);
  const [templates, setTemplates] = useState<BGVTemplate[]>([]);
  const [selectedCase, setSelectedCase] = useState<BGVCase | null>(null);
  const [isCaseDialogOpen, setIsCaseDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock data
  useEffect(() => {
    const mockBGVCases: BGVCase[] = [
      {
        id: '1',
        candidateId: 'C001',
        candidateName: 'Rahul Sharma',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        status: 'In Progress',
        priority: 'High',
        initiatedDate: new Date('2024-01-20'),
        assignedTo: 'Priya Patel',
        progress: 65,
        documents: [
          {
            id: '1',
            name: 'Aadhar Card',
            type: 'Identity',
            status: 'Verified',
            uploadedDate: new Date('2024-01-21'),
            verifiedDate: new Date('2024-01-22'),
            verifiedBy: 'Priya Patel',
            fileUrl: '/documents/aadhar_card.pdf',
            notes: 'Identity verified successfully',
            isRequired: true
          },
          {
            id: '2',
            name: 'Engineering Degree',
            type: 'Education',
            status: 'In Progress',
            uploadedDate: new Date('2024-01-21'),
            fileUrl: '/documents/degree.pdf',
            notes: 'Pending verification from university',
            isRequired: true
          }
        ],
        verifications: [
          {
            id: '1',
            type: 'Education',
            status: 'In Progress',
            initiatedDate: new Date('2024-01-22'),
            verifiedBy: 'Priya Patel',
            result: 'Pending',
            notes: 'Contacted university for verification',
            documents: ['degree.pdf'],
            externalAgency: 'University Verification Services',
            cost: 500
          },
          {
            id: '2',
            type: 'Employment',
            status: 'Completed',
            initiatedDate: new Date('2024-01-22'),
            completedDate: new Date('2024-01-25'),
            verifiedBy: 'Priya Patel',
            result: 'Pass',
            notes: 'Previous employment verified successfully',
            documents: ['employment_letter.pdf'],
            externalAgency: 'Employment Verification Co.',
            cost: 300
          }
        ],
        notes: 'Candidate has good track record, education verification in progress',
        riskLevel: 'Low',
        complianceStatus: 'Pending Review'
      },
      {
        id: '2',
        candidateId: 'C002',
        candidateName: 'Anjali Desai',
        position: 'Product Manager',
        department: 'Product',
        status: 'Completed',
        priority: 'Medium',
        initiatedDate: new Date('2024-01-15'),
        completedDate: new Date('2024-01-28'),
        assignedTo: 'Rajesh Kumar',
        progress: 100,
        documents: [
          {
            id: '3',
            name: 'PAN Card',
            type: 'Identity',
            status: 'Verified',
            uploadedDate: new Date('2024-01-16'),
            verifiedDate: new Date('2024-01-17'),
            verifiedBy: 'Rajesh Kumar',
            fileUrl: '/documents/pan_card.pdf',
            notes: 'Identity verified successfully',
            isRequired: true
          }
        ],
        verifications: [
          {
            id: '3',
            type: 'Education',
            status: 'Completed',
            initiatedDate: new Date('2024-01-17'),
            completedDate: new Date('2024-01-20'),
            verifiedBy: 'Rajesh Kumar',
            result: 'Pass',
            notes: 'MBA degree verified from IIM',
            documents: ['mba_degree.pdf'],
            externalAgency: 'Education Verification Services',
            cost: 800
          }
        ],
        notes: 'All verifications completed successfully',
        riskLevel: 'Low',
        complianceStatus: 'Compliant'
      }
    ];

    const mockTemplates: BGVTemplate[] = [
      {
        id: '1',
        name: 'Standard BGV Package',
        description: 'Basic background verification for entry-level positions',
        position: 'Entry Level',
        department: 'All Departments',
        requiredDocuments: ['Identity Proof', 'Address Proof', 'Educational Certificates'],
        requiredVerifications: ['Education', 'Address', 'Identity'],
        estimatedDuration: 7,
        cost: 1500,
        isActive: true
      },
      {
        id: '2',
        name: 'Comprehensive BGV Package',
        description: 'Complete background verification for senior positions',
        position: 'Senior Level',
        department: 'All Departments',
        requiredDocuments: ['Identity Proof', 'Address Proof', 'Educational Certificates', 'Employment Letters', 'Reference Letters'],
        requiredVerifications: ['Education', 'Employment', 'Address', 'Identity', 'Reference', 'Criminal'],
        estimatedDuration: 14,
        cost: 3500,
        isActive: true
      }
    ];

    setBGVCases(mockBGVCases);
    setTemplates(mockTemplates);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'On Hold': return 'bg-orange-100 text-orange-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-green-100 text-green-800';
      case 'Non-Compliant': return 'bg-red-100 text-red-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCases = bgvCases.filter(bgvCase => {
    const matchesSearch = bgvCase.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bgvCase.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bgvCase.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || bgvCase.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    totalCases: bgvCases.length,
    pendingCases: bgvCases.filter(c => c.status === 'Pending').length,
    inProgressCases: bgvCases.filter(c => c.status === 'In Progress').length,
    completedCases: bgvCases.filter(c => c.status === 'Completed').length,
    failedCases: bgvCases.filter(c => c.status === 'Failed').length,
    averageCompletionTime: 12, // days
    complianceRate: 85, // percentage
    totalCost: bgvCases.reduce((sum, c) => sum + c.verifications.reduce((vSum, v) => vSum + v.cost, 0), 0)
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Background Verification</h1>
          <p className="text-gray-600 mt-2">Manage background verification processes and compliance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsCaseDialogOpen(true)}>
            <UserCheck className="w-4 h-4 mr-2" />
            New BGV Case
          </Button>
          <Button variant="outline" onClick={() => setIsTemplateDialogOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Manage Templates
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold">{stats.totalCases}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock4 className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgressCases}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completedCases}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold">{stats.complianceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cases">BGV Cases</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent BGV Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Recent BGV Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bgvCases.slice(0, 5).map((bgvCase) => (
                    <div key={bgvCase.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{bgvCase.candidateName}</h4>
                        <p className="text-sm text-gray-600">{bgvCase.position} • {bgvCase.department}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(bgvCase.status)}>{bgvCase.status}</Badge>
                          <Badge className={getPriorityColor(bgvCase.priority)}>{bgvCase.priority}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{bgvCase.progress}%</div>
                        <Progress value={bgvCase.progress} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Compliance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Compliant Cases</span>
                    <span className="font-medium text-green-600">
                      {bgvCases.filter(c => c.complianceStatus === 'Compliant').length}
                    </span>
                  </div>
                  <Progress 
                    value={(bgvCases.filter(c => c.complianceStatus === 'Compliant').length / bgvCases.length) * 100} 
                    className="h-2" 
                  />
                  
                  <div className="flex justify-between items-center">
                    <span>Non-Compliant Cases</span>
                    <span className="font-medium text-red-600">
                      {bgvCases.filter(c => c.complianceStatus === 'Non-Compliant').length}
                    </span>
                  </div>
                  <Progress 
                    value={(bgvCases.filter(c => c.complianceStatus === 'Non-Compliant').length / bgvCases.length) * 100} 
                    className="h-2 bg-red-100" 
                  />
                  
                  <div className="flex justify-between items-center">
                    <span>Pending Review</span>
                    <span className="font-medium text-yellow-600">
                      {bgvCases.filter(c => c.complianceStatus === 'Pending Review').length}
                    </span>
                  </div>
                  <Progress 
                    value={(bgvCases.filter(c => c.complianceStatus === 'Pending Review').length / bgvCases.length) * 100} 
                    className="h-2 bg-yellow-100" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {bgvCases.filter(c => c.riskLevel === 'Low').length}
                  </div>
                  <div className="text-sm text-gray-600">Low Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {bgvCases.filter(c => c.riskLevel === 'Medium').length}
                  </div>
                  <div className="text-sm text-gray-600">Medium Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {bgvCases.filter(c => c.riskLevel === 'High').length}
                  </div>
                  <div className="text-sm text-gray-600">High Risk</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BGV Cases Tab */}
        <TabsContent value="cases" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((bgvCase) => (
                    <TableRow key={bgvCase.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bgvCase.candidateName}</div>
                          <div className="text-sm text-gray-500">ID: {bgvCase.candidateId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bgvCase.position}</div>
                          <div className="text-sm text-gray-500">{bgvCase.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bgvCase.status)}>
                          {bgvCase.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(bgvCase.priority)}>
                          {bgvCase.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={bgvCase.progress} className="w-20 h-2" />
                          <span className="text-sm">{bgvCase.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskLevelColor(bgvCase.riskLevel)}>
                          {bgvCase.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getComplianceStatusColor(bgvCase.complianceStatus)}>
                          {bgvCase.complianceStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
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

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">BGV Templates</h3>
            <Button onClick={() => setIsTemplateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{template.name}</span>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Position:</span>
                      <p className="font-medium">{template.position}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <p className="font-medium">{template.department}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">{template.estimatedDuration} days</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost:</span>
                      <p className="font-medium">₹{template.cost.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Required Documents:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.requiredDocuments.map((doc, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Required Verifications:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.requiredVerifications.map((verification, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {verification}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
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
                    <span>Overall Compliance Rate</span>
                    <span className="text-2xl font-bold text-green-600">{stats.complianceRate}%</span>
                  </div>
                  <Progress value={stats.complianceRate} className="h-3" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {bgvCases.filter(c => c.complianceStatus === 'Compliant').length}
                      </div>
                      <div className="text-gray-600">Compliant</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {bgvCases.filter(c => c.complianceStatus === 'Non-Compliant').length}
                      </div>
                      <div className="text-gray-600">Non-Compliant</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Compliance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      3 cases require immediate attention due to compliance issues
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      5 cases are approaching deadline and need review
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <FileX className="h-4 w-4" />
                    <AlertDescription>
                      2 cases have missing documents that need to be collected
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Compliance Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Cases</TableHead>
                    <TableHead>Compliant</TableHead>
                    <TableHead>Non-Compliant</TableHead>
                    <TableHead>Compliance Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from(new Set(bgvCases.map(c => c.department))).map((department) => {
                    const deptCases = bgvCases.filter(c => c.department === department);
                    const compliantCount = deptCases.filter(c => c.complianceStatus === 'Compliant').length;
                    const complianceRate = (compliantCount / deptCases.length) * 100;
                    
                    return (
                      <TableRow key={department}>
                        <TableCell className="font-medium">{department}</TableCell>
                        <TableCell>{deptCases.length}</TableCell>
                        <TableCell className="text-green-600">{compliantCount}</TableCell>
                        <TableCell className="text-red-600">{deptCases.length - compliantCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={complianceRate} className="w-20 h-2" />
                            <span className="text-sm">{complianceRate.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Verification Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Verification Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Completion Time</span>
                    <span className="font-medium">{stats.averageCompletionTime} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Cost</span>
                    <span className="font-medium">₹{stats.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <span className="font-medium text-green-600">
                      {((stats.completedCases / stats.totalCases) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Verification Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Education', 'Employment', 'Address', 'Identity', 'Criminal', 'Reference'].map((type) => (
                    <div key={type} className="flex justify-between items-center">
                      <span>{type}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.random() * 100} className="w-20 h-2" />
                        <span className="text-sm">{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₹{stats.totalCost.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{(stats.totalCost / stats.totalCases).toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Average per Case</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">₹{(stats.totalCost / stats.completedCases).toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Cost per Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">₹{(stats.totalCost / 12).toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Monthly Average</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* BGV Case Dialog */}
      <Dialog open={isCaseDialogOpen} onOpenChange={setIsCaseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New BGV Case</DialogTitle>
            <DialogDescription>
              Initiate a new background verification case for a candidate
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidate-name">Candidate Name</Label>
                <Input id="candidate-name" placeholder="Enter candidate name" />
              </div>
              <div>
                <Label htmlFor="candidate-id">Candidate ID</Label>
                <Input id="candidate-id" placeholder="Enter candidate ID" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" placeholder="Enter position" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="template">BGV Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="assigned-to">Assigned To</Label>
              <Input id="assigned-to" placeholder="Enter assignee name" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Add any additional notes..." rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCaseDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Create BGV Case</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New BGV Template</DialogTitle>
            <DialogDescription>
              Create a new background verification template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input id="template-name" placeholder="Enter template name" />
              </div>
              <div>
                <Label htmlFor="template-position">Position Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="template-description">Description</Label>
              <Textarea id="template-description" placeholder="Enter template description..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-duration">Estimated Duration (days)</Label>
                <Input id="template-duration" type="number" placeholder="7" />
              </div>
              <div>
                <Label htmlFor="template-cost">Estimated Cost (₹)</Label>
                <Input id="template-cost" type="number" placeholder="1500" />
              </div>
            </div>
            <div>
              <Label>Required Documents</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Identity Proof', 'Address Proof', 'Educational Certificates', 'Employment Letters', 'Reference Letters', 'Criminal Record'].map((doc) => (
                  <div key={doc} className="flex items-center space-x-2">
                    <Checkbox id={doc} />
                    <Label htmlFor={doc} className="text-sm">{doc}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Required Verifications</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Education', 'Employment', 'Address', 'Identity', 'Criminal', 'Reference', 'Credit', 'Drug Test'].map((verification) => (
                  <div key={verification} className="flex items-center space-x-2">
                    <Checkbox id={verification} />
                    <Label htmlFor={verification} className="text-sm">{verification}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Create Template</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackgroundVerification; 