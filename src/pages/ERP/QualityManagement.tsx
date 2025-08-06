/**
 * Quality Management page with inspection, standards, and compliance tracking
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  BarChart3,
  Calendar,
  Shield,
  FileText,
  Clock,
  Users,
  Target,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface QualityInspection {
  id: string;
  inspectionNumber: string;
  productName: string;
  batchNumber: string;
  inspector: string;
  inspectionDate: string;
  status: 'Pending' | 'In Progress' | 'Passed' | 'Failed' | 'Conditional';
  result: 'Pass' | 'Fail' | 'Conditional';
  defects: number;
  sampleSize: number;
  passRate: number;
  notes: string;
}

interface QualityStandard {
  id: string;
  standardCode: string;
  standardName: string;
  category: 'Product' | 'Process' | 'System' | 'Safety';
  version: string;
  effectiveDate: string;
  status: 'Active' | 'Draft' | 'Obsolete';
  complianceLevel: 'Required' | 'Recommended' | 'Optional';
  description: string;
}

interface Defect {
  id: string;
  defectNumber: string;
  productName: string;
  defectType: 'Critical' | 'Major' | 'Minor';
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  reportedBy: string;
  reportedDate: string;
  assignedTo: string;
  resolutionDate?: string;
  cost: number;
  description: string;
}

interface ComplianceAudit {
  id: string;
  auditNumber: string;
  auditType: 'Internal' | 'External' | 'Regulatory';
  auditor: string;
  auditDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  score: number;
  findings: number;
  nonConformities: number;
  recommendations: number;
  nextAuditDate: string;
}

const mockQualityInspections: QualityInspection[] = [
  {
    id: 'QI-001',
    inspectionNumber: 'QI-2024-001',
    productName: 'Product A',
    batchNumber: 'BATCH-2024-001',
    inspector: 'John Smith',
    inspectionDate: '2024-01-15T10:00:00Z',
    status: 'Passed',
    result: 'Pass',
    defects: 2,
    sampleSize: 100,
    passRate: 98.0,
    notes: 'Minor cosmetic defects found, within acceptable limits',
  },
  {
    id: 'QI-002',
    inspectionNumber: 'QI-2024-002',
    productName: 'Product B',
    batchNumber: 'BATCH-2024-002',
    inspector: 'Sarah Davis',
    inspectionDate: '2024-01-14T14:30:00Z',
    status: 'Failed',
    result: 'Fail',
    defects: 15,
    sampleSize: 50,
    passRate: 70.0,
    notes: 'Multiple critical defects found, batch rejected',
  },
  {
    id: 'QI-003',
    inspectionNumber: 'QI-2024-003',
    productName: 'Product C',
    batchNumber: 'BATCH-2024-003',
    inspector: 'Mike Johnson',
    inspectionDate: '2024-01-16T09:15:00Z',
    status: 'In Progress',
    result: 'Conditional',
    defects: 5,
    sampleSize: 75,
    passRate: 93.3,
    notes: 'Inspection in progress, preliminary results show minor issues',
  },
];

const mockQualityStandards: QualityStandard[] = [
  {
    id: 'QS-001',
    standardCode: 'ISO-9001',
    standardName: 'Quality Management System',
    category: 'System',
    version: '2015',
    effectiveDate: '2023-01-01T00:00:00Z',
    status: 'Active',
    complianceLevel: 'Required',
    description: 'International standard for quality management systems',
  },
  {
    id: 'QS-002',
    standardCode: 'ISO-14001',
    standardName: 'Environmental Management',
    category: 'System',
    version: '2015',
    effectiveDate: '2023-06-01T00:00:00Z',
    status: 'Active',
    complianceLevel: 'Required',
    description: 'Environmental management system standard',
  },
  {
    id: 'QS-003',
    standardCode: 'PROD-STD-001',
    standardName: 'Product Quality Standards',
    category: 'Product',
    version: '2.1',
    effectiveDate: '2023-03-15T00:00:00Z',
    status: 'Active',
    complianceLevel: 'Required',
    description: 'Internal product quality standards and specifications',
  },
];

const mockDefects: Defect[] = [
  {
    id: 'DEF-001',
    defectNumber: 'DEF-2024-001',
    productName: 'Product A',
    defectType: 'Minor',
    severity: 'Low',
    status: 'Resolved',
    reportedBy: 'John Smith',
    reportedDate: '2024-01-10T08:30:00Z',
    assignedTo: 'Sarah Davis',
    resolutionDate: '2024-01-12T16:45:00Z',
    cost: 250,
    description: 'Cosmetic defect in packaging',
  },
  {
    id: 'DEF-002',
    defectNumber: 'DEF-2024-002',
    productName: 'Product B',
    defectType: 'Critical',
    severity: 'High',
    status: 'In Progress',
    reportedBy: 'Mike Johnson',
    reportedDate: '2024-01-14T11:20:00Z',
    assignedTo: 'Quality Team',
    cost: 1500,
    description: 'Functional defect affecting product performance',
  },
  {
    id: 'DEF-003',
    defectNumber: 'DEF-2024-003',
    productName: 'Product C',
    defectType: 'Major',
    severity: 'Medium',
    status: 'Open',
    reportedBy: 'Lisa Rodriguez',
    reportedDate: '2024-01-15T14:15:00Z',
    assignedTo: 'Unassigned',
    cost: 750,
    description: 'Component failure during testing',
  },
];

const mockComplianceAudits: ComplianceAudit[] = [
  {
    id: 'AUDIT-001',
    auditNumber: 'AUDIT-2024-001',
    auditType: 'Internal',
    auditor: 'Internal Audit Team',
    auditDate: '2024-01-15T00:00:00Z',
    status: 'Completed',
    score: 92,
    findings: 3,
    nonConformities: 1,
    recommendations: 5,
    nextAuditDate: '2024-04-15T00:00:00Z',
  },
  {
    id: 'AUDIT-002',
    auditNumber: 'AUDIT-2024-002',
    auditType: 'External',
    auditor: 'Certification Body',
    auditDate: '2024-02-15T00:00:00Z',
    status: 'Scheduled',
    score: 0,
    findings: 0,
    nonConformities: 0,
    recommendations: 0,
    nextAuditDate: '2024-02-15T00:00:00Z',
  },
  {
    id: 'AUDIT-003',
    auditNumber: 'AUDIT-2024-003',
    auditType: 'Regulatory',
    auditor: 'Regulatory Agency',
    auditDate: '2024-03-15T00:00:00Z',
    status: 'Scheduled',
    score: 0,
    findings: 0,
    nonConformities: 0,
    recommendations: 0,
    nextAuditDate: '2024-03-15T00:00:00Z',
  },
];

export default function QualityManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isInspectionDialogOpen, setIsInspectionDialogOpen] = useState(false);
  const [isDefectDialogOpen, setIsDefectDialogOpen] = useState(false);

  const filteredInspections = mockQualityInspections.filter(inspection => {
    const matchesSearch = inspection.inspectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inspection.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Conditional': return 'bg-orange-100 text-orange-800';
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Obsolete': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDefectTypeColor = (type: string) => {
    switch (type) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Major': return 'bg-orange-100 text-orange-800';
      case 'Minor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalInspections = mockQualityInspections.length;
  const passedInspections = mockQualityInspections.filter(i => i.result === 'Pass').length;
  const passRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0;
  const openDefects = mockDefects.filter(d => d.status === 'Open' || d.status === 'In Progress').length;
  const totalDefectCost = mockDefects.reduce((sum, defect) => sum + defect.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Management</h1>
          <p className="text-muted-foreground">
            Manage quality inspections, standards, and compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsDefectDialogOpen(true)}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Defect
          </Button>
          <Button onClick={() => setIsInspectionDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Inspection
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInspections}</div>
            <p className="text-xs text-muted-foreground">
              {passedInspections} passed inspections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Quality performance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Defects</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openDefects}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defect Cost</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDefectCost)}</div>
            <p className="text-xs text-muted-foreground">
              Total defect costs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inspections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inspections">Quality Inspections</TabsTrigger>
          <TabsTrigger value="standards">Quality Standards</TabsTrigger>
          <TabsTrigger value="defects">Defect Management</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Audits</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Inspections</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by inspection number, product, or inspector..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Inspection #</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Defects</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">{inspection.inspectionNumber}</TableCell>
                        <TableCell>{inspection.productName}</TableCell>
                        <TableCell className="font-mono text-sm">{inspection.batchNumber}</TableCell>
                        <TableCell>{inspection.inspector}</TableCell>
                        <TableCell>{formatRelativeTime(inspection.inspectionDate)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(inspection.status)}>
                            {inspection.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={inspection.result === 'Pass' ? 'bg-green-100 text-green-800' : 
                                           inspection.result === 'Fail' ? 'bg-red-100 text-red-800' : 
                                           'bg-orange-100 text-orange-800'}>
                            {inspection.result}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{inspection.passRate}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  inspection.passRate >= 95 ? 'bg-green-500' :
                                  inspection.passRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${inspection.passRate}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={inspection.defects > 10 ? 'text-red-600' : 
                                         inspection.defects > 5 ? 'text-yellow-600' : 'text-green-600'}>
                            {inspection.defects}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Inspection
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Inspection
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockQualityStandards.map((standard) => (
                  <Card key={standard.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{standard.standardCode}</CardTitle>
                          <p className="text-sm text-muted-foreground">{standard.standardName}</p>
                        </div>
                        <Badge className={getStatusColor(standard.status)}>
                          {standard.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Category:</span>
                          <span className="text-sm font-medium">{standard.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Version:</span>
                          <span className="text-sm font-medium">{standard.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Compliance:</span>
                          <Badge className={standard.complianceLevel === 'Required' ? 'bg-red-100 text-red-800' : 
                                          standard.complianceLevel === 'Recommended' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-green-100 text-green-800'}>
                            {standard.complianceLevel}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Effective: {formatRelativeTime(standard.effectiveDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {standard.description}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Defect Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Defect #</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDefects.map((defect) => (
                      <TableRow key={defect.id}>
                        <TableCell className="font-medium">{defect.defectNumber}</TableCell>
                        <TableCell>{defect.productName}</TableCell>
                        <TableCell>
                          <Badge className={getDefectTypeColor(defect.defectType)}>
                            {defect.defectType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(defect.severity)}>
                            {defect.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(defect.status)}>
                            {defect.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{defect.reportedBy}</TableCell>
                        <TableCell>{defect.assignedTo}</TableCell>
                        <TableCell>{formatCurrency(defect.cost)}</TableCell>
                        <TableCell>{formatRelativeTime(defect.reportedDate)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Defect
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                Assign To
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Defect
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Auditor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead>Non-Conformities</TableHead>
                      <TableHead>Next Audit</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockComplianceAudits.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-medium">{audit.auditNumber}</TableCell>
                        <TableCell>
                          <Badge className={audit.auditType === 'Internal' ? 'bg-blue-100 text-blue-800' :
                                           audit.auditType === 'External' ? 'bg-green-100 text-green-800' :
                                           'bg-purple-100 text-purple-800'}>
                            {audit.auditType}
                          </Badge>
                        </TableCell>
                        <TableCell>{audit.auditor}</TableCell>
                        <TableCell>{formatRelativeTime(audit.auditDate)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(audit.status)}>
                            {audit.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{audit.score}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  audit.score >= 90 ? 'bg-green-500' :
                                  audit.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${audit.score}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{audit.findings}</TableCell>
                        <TableCell>
                          <span className={audit.nonConformities > 0 ? 'text-red-600' : 'text-green-600'}>
                            {audit.nonConformities}
                          </span>
                        </TableCell>
                        <TableCell>{formatRelativeTime(audit.nextAuditDate)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Report
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Audit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Follow-up
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quality Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pass Rate Trend</span>
                    <span className="text-sm font-medium text-green-600">↗ +2.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Inspection Time</span>
                    <span className="text-sm font-medium">2.3 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Defect Rate</span>
                    <span className="text-sm font-medium text-red-600">3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compliance Score</span>
                    <span className="text-sm font-medium text-green-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Defect Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical Defects</span>
                    <span className="text-sm font-medium text-red-600">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Major Defects</span>
                    <span className="text-sm font-medium text-orange-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Minor Defects</span>
                    <span className="text-sm font-medium text-yellow-600">28</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resolution Time</span>
                    <span className="text-sm font-medium">3.5 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Inspection Dialog */}
      <Dialog open={isInspectionDialogOpen} onOpenChange={setIsInspectionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Quality Inspection</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" placeholder="Enter product name" />
              </div>
              <div>
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input id="batchNumber" placeholder="Enter batch number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inspector">Inspector</Label>
                <Input id="inspector" placeholder="Enter inspector name" />
              </div>
              <div>
                <Label htmlFor="inspectionDate">Inspection Date</Label>
                <Input id="inspectionDate" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sampleSize">Sample Size</Label>
                <Input id="sampleSize" type="number" placeholder="Enter sample size" />
              </div>
              <div>
                <Label htmlFor="defects">Number of Defects</Label>
                <Input id="defects" type="number" placeholder="Enter defect count" />
              </div>
            </div>
            <div>
              <Label htmlFor="inspectionNotes">Notes</Label>
              <Textarea id="inspectionNotes" placeholder="Enter inspection notes" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsInspectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsInspectionDialogOpen(false)}>
              Create Inspection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Defect Dialog */}
      <Dialog open={isDefectDialogOpen} onOpenChange={setIsDefectDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Quality Defect</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defectProduct">Product Name</Label>
                <Input id="defectProduct" placeholder="Enter product name" />
              </div>
              <div>
                <Label htmlFor="defectType">Defect Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignedTo">Assign To</Label>
                <Input id="assignedTo" placeholder="Enter assignee" />
              </div>
            </div>
            <div>
              <Label htmlFor="defectDescription">Description</Label>
              <Textarea id="defectDescription" placeholder="Enter defect description" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDefectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDefectDialogOpen(false)}>
              Report Defect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 