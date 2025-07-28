/**
 * GST Returns Filing Module
 * Complete GST compliance and returns filing system
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  FileText, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Building2,
  Users,
  Calculator,
  Shield,
  Target,
  Zap,
  RefreshCw,
  Save,
  Send,
  FileCheck,
  FileX,
  FileClock,
  FileAlert,
  FileSearch,
  FileSpreadsheet,
  FilePdf,
  FileArchive
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';
import { formatCurrency, formatDate } from '../../lib/utils';

// GST Data Types
interface GSTReturn {
  id: string;
  returnType: 'GSTR-1' | 'GSTR-3B' | 'GSTR-2A' | 'GSTR-9' | 'GSTR-9C';
  period: string;
  dueDate: string;
  filingDate?: string;
  status: 'pending' | 'filed' | 'accepted' | 'rejected' | 'late';
  totalTaxableValue: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalTax: number;
  lateFees: number;
  interest: number;
  totalAmount: number;
  acknowledgmentNumber?: string;
  notes: string;
  attachments: string[];
}

interface GSTInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerGSTIN: string;
  customerName: string;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  totalAmount: number;
  placeOfSupply: string;
  reverseCharge: boolean;
  eCommerceOperator: boolean;
  returnType: 'GSTR-1' | 'GSTR-3B';
  status: 'pending' | 'included' | 'excluded';
}

interface GSTCompliance {
  id: string;
  period: string;
  returnType: string;
  dueDate: string;
  filingDate?: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  lateFees: number;
  interest: number;
  totalPenalty: number;
  complianceScore: number;
}

// Mock Data
const mockGSTReturns: GSTReturn[] = [
  {
    id: 'GSTR-001',
    returnType: 'GSTR-1',
    period: 'December 2024',
    dueDate: '2024-12-31',
    filingDate: '2024-12-28',
    status: 'filed',
    totalTaxableValue: 2500000,
    totalCGST: 225000,
    totalSGST: 225000,
    totalIGST: 0,
    totalTax: 450000,
    lateFees: 0,
    interest: 0,
    totalAmount: 450000,
    acknowledgmentNumber: 'ACK-2024-12-28-001',
    notes: 'Filed on time',
    attachments: ['invoice_summary.pdf', 'gst_calculation.xlsx']
  },
  {
    id: 'GSTR-002',
    returnType: 'GSTR-3B',
    period: 'December 2024',
    dueDate: '2024-12-20',
    filingDate: '2024-12-22',
    status: 'late',
    totalTaxableValue: 2500000,
    totalCGST: 225000,
    totalSGST: 225000,
    totalIGST: 0,
    totalTax: 450000,
    lateFees: 200,
    interest: 50,
    totalAmount: 450250,
    acknowledgmentNumber: 'ACK-2024-12-22-002',
    notes: 'Filed 2 days late',
    attachments: ['gstr3b_summary.pdf']
  },
  {
    id: 'GSTR-003',
    returnType: 'GSTR-1',
    period: 'November 2024',
    dueDate: '2024-11-30',
    filingDate: '2024-11-25',
    status: 'accepted',
    totalTaxableValue: 2200000,
    totalCGST: 198000,
    totalSGST: 198000,
    totalIGST: 0,
    totalTax: 396000,
    lateFees: 0,
    interest: 0,
    totalAmount: 396000,
    acknowledgmentNumber: 'ACK-2024-11-25-003',
    notes: 'Accepted by department',
    attachments: ['invoice_summary.pdf', 'gst_calculation.xlsx']
  },
  {
    id: 'GSTR-004',
    returnType: 'GSTR-3B',
    period: 'November 2024',
    dueDate: '2024-11-20',
    filingDate: '2024-11-18',
    status: 'accepted',
    totalTaxableValue: 2200000,
    totalCGST: 198000,
    totalSGST: 198000,
    totalIGST: 0,
    totalTax: 396000,
    lateFees: 0,
    interest: 0,
    totalAmount: 396000,
    acknowledgmentNumber: 'ACK-2024-11-18-004',
    notes: 'Filed on time',
    attachments: ['gstr3b_summary.pdf']
  },
  {
    id: 'GSTR-005',
    returnType: 'GSTR-1',
    period: 'January 2025',
    dueDate: '2025-01-31',
    status: 'pending',
    totalTaxableValue: 0,
    totalCGST: 0,
    totalSGST: 0,
    totalIGST: 0,
    totalTax: 0,
    lateFees: 0,
    interest: 0,
    totalAmount: 0,
    notes: 'Due for filing',
    attachments: []
  }
];

const mockGSTInvoices: GSTInvoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '2024-12-15',
    customerGSTIN: '27AABCS1234Z1Z5',
    customerName: 'TechSolutions India',
    taxableValue: 100000,
    cgstRate: 9,
    cgstAmount: 9000,
    sgstRate: 9,
    sgstAmount: 9000,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 18000,
    totalAmount: 118000,
    placeOfSupply: 'Maharashtra',
    reverseCharge: false,
    eCommerceOperator: false,
    returnType: 'GSTR-1',
    status: 'included'
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2024-002',
    invoiceDate: '2024-12-18',
    customerGSTIN: '29AABCS5678Z1Z5',
    customerName: 'Global Manufacturing Ltd',
    taxableValue: 150000,
    cgstRate: 0,
    cgstAmount: 0,
    sgstRate: 0,
    sgstAmount: 0,
    igstRate: 18,
    igstAmount: 27000,
    totalTax: 27000,
    totalAmount: 177000,
    placeOfSupply: 'Karnataka',
    reverseCharge: false,
    eCommerceOperator: false,
    returnType: 'GSTR-1',
    status: 'included'
  }
];

const mockGSTCompliance: GSTCompliance[] = [
  {
    id: 'COMP-001',
    period: 'December 2024',
    returnType: 'GSTR-1',
    dueDate: '2024-12-31',
    filingDate: '2024-12-28',
    status: 'compliant',
    lateFees: 0,
    interest: 0,
    totalPenalty: 0,
    complianceScore: 100
  },
  {
    id: 'COMP-002',
    period: 'December 2024',
    returnType: 'GSTR-3B',
    dueDate: '2024-12-20',
    filingDate: '2024-12-22',
    status: 'non-compliant',
    lateFees: 200,
    interest: 50,
    totalPenalty: 250,
    complianceScore: 85
  }
];

// Analytics Data
const gstTrendData = [
  { month: 'Jul', gst1: 180000, gst3b: 180000, total: 360000 },
  { month: 'Aug', gst1: 200000, gst3b: 200000, total: 400000 },
  { month: 'Sep', gst1: 220000, gst3b: 220000, total: 440000 },
  { month: 'Oct', gst1: 240000, gst3b: 240000, total: 480000 },
  { month: 'Nov', gst1: 198000, gst3b: 198000, total: 396000 },
  { month: 'Dec', gst1: 225000, gst3b: 225000, total: 450000 }
];

const returnTypeData = [
  { type: 'GSTR-1', count: 12, color: '#10B981' },
  { type: 'GSTR-3B', count: 12, color: '#3B82F6' },
  { type: 'GSTR-2A', count: 12, color: '#F59E0B' },
  { type: 'GSTR-9', count: 1, color: '#8B5CF6' },
  { type: 'GSTR-9C', count: 1, color: '#EF4444' }
];

const complianceData = [
  { status: 'Compliant', count: 20, color: '#10B981' },
  { status: 'Non-Compliant', count: 3, color: '#EF4444' },
  { status: 'Pending', count: 2, color: '#F59E0B' }
];

export default function GSTReturns() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFileReturnDialogOpen, setIsFileReturnDialogOpen] = useState(false);
  const [isViewReturnDialogOpen, setIsViewReturnDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<GSTReturn | null>(null);

  const filteredReturns = mockGSTReturns.filter(return_ => {
    const matchesSearch = return_.returnType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         return_.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         return_.acknowledgmentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || return_.returnType === filterType;
    const matchesStatus = filterStatus === 'all' || return_.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalReturns = mockGSTReturns.length;
  const filedReturns = mockGSTReturns.filter(r => r.status === 'filed' || r.status === 'accepted').length;
  const pendingReturns = mockGSTReturns.filter(r => r.status === 'pending').length;
  const totalTaxLiability = mockGSTReturns.reduce((sum, r) => sum + r.totalTax, 0);
  const totalLateFees = mockGSTReturns.reduce((sum, r) => sum + r.lateFees, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'filed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReturnTypeColor = (type: string) => {
    switch (type) {
      case 'GSTR-1': return 'bg-green-100 text-green-800';
      case 'GSTR-3B': return 'bg-blue-100 text-blue-800';
      case 'GSTR-2A': return 'bg-yellow-100 text-yellow-800';
      case 'GSTR-9': return 'bg-purple-100 text-purple-800';
      case 'GSTR-9C': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GST Returns Filing</h1>
          <p className="text-gray-600">Manage GST compliance and file returns</p>
        </div>
        <Button onClick={() => setIsFileReturnDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          File Return
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold text-gray-900">{totalReturns}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filed Returns</p>
                <p className="text-2xl font-bold text-gray-900">{filedReturns}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Returns</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReturns}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tax Liability</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTaxLiability)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* GST Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>GST Filing Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={gstTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="gst1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="GSTR-1" />
                    <Area type="monotone" dataKey="gst3b" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="GSTR-3B" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={returnTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {returnTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-600">Compliance Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{formatCurrency(totalLateFees)}</div>
                  <div className="text-sm text-gray-600">Total Late Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-gray-600">Pending Returns</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Returns Tab */}
        <TabsContent value="returns" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search returns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="GSTR-1">GSTR-1</SelectItem>
                    <SelectItem value="GSTR-3B">GSTR-3B</SelectItem>
                    <SelectItem value="GSTR-2A">GSTR-2A</SelectItem>
                    <SelectItem value="GSTR-9">GSTR-9</SelectItem>
                    <SelectItem value="GSTR-9C">GSTR-9C</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="filed">Filed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Returns Table */}
          <Card>
            <CardHeader>
              <CardTitle>GST Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Return Type</th>
                      <th className="text-left p-4">Period</th>
                      <th className="text-left p-4">Due Date</th>
                      <th className="text-left p-4">Filing Date</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Total Tax</th>
                      <th className="text-left p-4">Late Fees</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReturns.map((return_) => (
                      <tr key={return_.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <Badge className={getReturnTypeColor(return_.returnType)}>
                            {return_.returnType}
                          </Badge>
                        </td>
                        <td className="p-4">{return_.period}</td>
                        <td className="p-4">{formatDate(return_.dueDate)}</td>
                        <td className="p-4">
                          {return_.filingDate ? formatDate(return_.filingDate) : '-'}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(return_.status)}>
                            {return_.status}
                          </Badge>
                        </td>
                        <td className="p-4">{formatCurrency(return_.totalTax)}</td>
                        <td className="p-4">{formatCurrency(return_.lateFees)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReturn(return_);
                                setIsViewReturnDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GST Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Invoice #</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">GSTIN</th>
                      <th className="text-left p-4">Taxable Value</th>
                      <th className="text-left p-4">CGST</th>
                      <th className="text-left p-4">SGST</th>
                      <th className="text-left p-4">IGST</th>
                      <th className="text-left p-4">Total Tax</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockGSTInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono">{invoice.invoiceNumber}</td>
                        <td className="p-4">{formatDate(invoice.invoiceDate)}</td>
                        <td className="p-4">{invoice.customerName}</td>
                        <td className="p-4 font-mono text-sm">{invoice.customerGSTIN}</td>
                        <td className="p-4">{formatCurrency(invoice.taxableValue)}</td>
                        <td className="p-4">{formatCurrency(invoice.cgstAmount)}</td>
                        <td className="p-4">{formatCurrency(invoice.sgstAmount)}</td>
                        <td className="p-4">{formatCurrency(invoice.igstAmount)}</td>
                        <td className="p-4">{formatCurrency(invoice.totalTax)}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Period</th>
                      <th className="text-left p-4">Return Type</th>
                      <th className="text-left p-4">Due Date</th>
                      <th className="text-left p-4">Filing Date</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Late Fees</th>
                      <th className="text-left p-4">Interest</th>
                      <th className="text-left p-4">Total Penalty</th>
                      <th className="text-left p-4">Compliance Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockGSTCompliance.map((compliance) => (
                      <tr key={compliance.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{compliance.period}</td>
                        <td className="p-4">{compliance.returnType}</td>
                        <td className="p-4">{formatDate(compliance.dueDate)}</td>
                        <td className="p-4">
                          {compliance.filingDate ? formatDate(compliance.filingDate) : '-'}
                        </td>
                        <td className="p-4">
                          <Badge className={getComplianceColor(compliance.status)}>
                            {compliance.status}
                          </Badge>
                        </td>
                        <td className="p-4">{formatCurrency(compliance.lateFees)}</td>
                        <td className="p-4">{formatCurrency(compliance.interest)}</td>
                        <td className="p-4">{formatCurrency(compliance.totalPenalty)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{compliance.complianceScore}%</div>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${compliance.complianceScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* File Return Dialog */}
      <Dialog open={isFileReturnDialogOpen} onOpenChange={setIsFileReturnDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>File GST Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Return Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select return type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GSTR-1">GSTR-1 (Outward Supplies)</SelectItem>
                    <SelectItem value="GSTR-3B">GSTR-3B (Summary Return)</SelectItem>
                    <SelectItem value="GSTR-2A">GSTR-2A (Inward Supplies)</SelectItem>
                    <SelectItem value="GSTR-9">GSTR-9 (Annual Return)</SelectItem>
                    <SelectItem value="GSTR-9C">GSTR-9C (Reconciliation)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Period</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jan-2025">January 2025</SelectItem>
                    <SelectItem value="dec-2024">December 2024</SelectItem>
                    <SelectItem value="nov-2024">November 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Upload Return File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">CSV, Excel, or JSON files</p>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea placeholder="Enter any additional notes" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsFileReturnDialogOpen(false)}>
                Cancel
              </Button>
              <Button>File Return</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Return Dialog */}
      <Dialog open={isViewReturnDialogOpen} onOpenChange={setIsViewReturnDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>GST Return Details</DialogTitle>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-6">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="taxes">Tax Details</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Return Type</Label>
                      <p className="text-sm text-gray-600">{selectedReturn.returnType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Period</Label>
                      <p className="text-sm text-gray-600">{selectedReturn.period}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Due Date</Label>
                      <p className="text-sm text-gray-600">{formatDate(selectedReturn.dueDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Filing Date</Label>
                      <p className="text-sm text-gray-600">
                        {selectedReturn.filingDate ? formatDate(selectedReturn.filingDate) : 'Not filed'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedReturn.status)}>
                        {selectedReturn.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Acknowledgment Number</Label>
                      <p className="text-sm text-gray-600">
                        {selectedReturn.acknowledgmentNumber || 'Not available'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="taxes" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Total Taxable Value</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedReturn.totalTaxableValue)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Total Tax</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedReturn.totalTax)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">CGST</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedReturn.totalCGST)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">SGST</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedReturn.totalSGST)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">IGST</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedReturn.totalIGST)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Late Fees</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedReturn.lateFees)}</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="attachments" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Attached Files</Label>
                    <div className="space-y-2 mt-2">
                      {selectedReturn.attachments.length > 0 ? (
                        selectedReturn.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{file}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No attachments</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 