/**
 * Customer Management Module - ERP System
 * Complete customer database, credit management, and analytics
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
  Users, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CreditCard, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Zap,
  Shield,
  FileText,
  ShoppingCart,
  Package,
  Truck,
  UserCheck,
  UserX,
  UserPlus
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

// Customer Data Types
interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  customerType: 'individual' | 'business' | 'enterprise';
  industry: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string;
  creditStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'suspended';
  customerSegment: 'premium' | 'gold' | 'silver' | 'bronze';
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate: string;
  lastPaymentDate: string;
  averageOrderValue: number;
  customerSince: string;
  status: 'active' | 'inactive' | 'prospect';
  notes: string;
  assignedTo: string;
  tags: string[];
}

// Mock Data
const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Rajesh Kumar',
    company: 'TechSolutions India',
    email: 'rajesh@techsolutions.in',
    phone: '+91-98765-43210',
    address: '123 Tech Park, Electronic City',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560100',
    website: 'www.techsolutions.in',
    customerType: 'business',
    industry: 'Technology',
    creditLimit: 500000,
    currentBalance: 125000,
    paymentTerms: 'Net 30',
    creditStatus: 'excellent',
    customerSegment: 'premium',
    totalOrders: 45,
    totalRevenue: 2500000,
    lastOrderDate: '2024-12-15',
    lastPaymentDate: '2024-12-10',
    averageOrderValue: 55555,
    customerSince: '2022-03-15',
    status: 'active',
    notes: 'High-value customer, excellent payment history',
    assignedTo: 'Sales Team A',
    tags: ['premium', 'tech', 'enterprise']
  },
  {
    id: 'CUST-002',
    name: 'Priya Sharma',
    company: 'Global Manufacturing Ltd',
    email: 'priya@globalmfg.com',
    phone: '+91-87654-32109',
    address: '456 Industrial Estate, MIDC',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400001',
    website: 'www.globalmfg.com',
    customerType: 'enterprise',
    industry: 'Manufacturing',
    creditLimit: 1000000,
    currentBalance: 450000,
    paymentTerms: 'Net 45',
    creditStatus: 'good',
    customerSegment: 'gold',
    totalOrders: 78,
    totalRevenue: 8500000,
    lastOrderDate: '2024-12-12',
    lastPaymentDate: '2024-12-05',
    averageOrderValue: 108974,
    customerSince: '2021-08-20',
    status: 'active',
    notes: 'Large manufacturing client, regular orders',
    assignedTo: 'Sales Team B',
    tags: ['manufacturing', 'enterprise', 'gold']
  },
  {
    id: 'CUST-003',
    name: 'Amit Patel',
    company: 'Retail Solutions',
    email: 'amit@retailsolutions.co.in',
    phone: '+91-76543-21098',
    address: '789 Mall Road, Connaught Place',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    postalCode: '110001',
    website: 'www.retailsolutions.co.in',
    customerType: 'business',
    industry: 'Retail',
    creditLimit: 250000,
    currentBalance: 75000,
    paymentTerms: 'Net 30',
    creditStatus: 'fair',
    customerSegment: 'silver',
    totalOrders: 23,
    totalRevenue: 1200000,
    lastOrderDate: '2024-12-08',
    lastPaymentDate: '2024-11-25',
    averageOrderValue: 52174,
    customerSince: '2023-01-10',
    status: 'active',
    notes: 'Growing retail business, occasional late payments',
    assignedTo: 'Sales Team A',
    tags: ['retail', 'growing', 'silver']
  },
  {
    id: 'CUST-004',
    name: 'Sneha Reddy',
    company: 'Healthcare Innovations',
    email: 'sneha@healthcareinnovations.in',
    phone: '+91-65432-10987',
    address: '321 Medical Center, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500034',
    website: 'www.healthcareinnovations.in',
    customerType: 'business',
    industry: 'Healthcare',
    creditLimit: 300000,
    currentBalance: 0,
    paymentTerms: 'Net 15',
    creditStatus: 'excellent',
    customerSegment: 'premium',
    totalOrders: 34,
    totalRevenue: 1800000,
    lastOrderDate: '2024-12-18',
    lastPaymentDate: '2024-12-15',
    averageOrderValue: 52941,
    customerSince: '2022-11-05',
    status: 'active',
    notes: 'Healthcare sector client, excellent credit',
    assignedTo: 'Sales Team C',
    tags: ['healthcare', 'premium', 'reliable']
  },
  {
    id: 'CUST-005',
    name: 'Vikram Singh',
    company: 'Construction Dynamics',
    email: 'vikram@constructiondynamics.com',
    phone: '+91-54321-09876',
    address: '654 Builder Plaza, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    postalCode: '201301',
    website: 'www.constructiondynamics.com',
    customerType: 'enterprise',
    industry: 'Construction',
    creditLimit: 750000,
    currentBalance: 300000,
    paymentTerms: 'Net 60',
    creditStatus: 'poor',
    customerSegment: 'bronze',
    totalOrders: 56,
    totalRevenue: 4200000,
    lastOrderDate: '2024-11-20',
    lastPaymentDate: '2024-11-10',
    averageOrderValue: 75000,
    customerSince: '2020-06-15',
    status: 'active',
    notes: 'Large construction projects, payment delays common',
    assignedTo: 'Sales Team B',
    tags: ['construction', 'enterprise', 'payment-issues']
  }
];

// Analytics Data
const customerSegmentsData = [
  { name: 'Premium', value: 25, color: '#10B981' },
  { name: 'Gold', value: 35, color: '#F59E0B' },
  { name: 'Silver', value: 30, color: '#6B7280' },
  { name: 'Bronze', value: 10, color: '#CD7F32' }
];

const revenueTrendData = [
  { month: 'Jan', revenue: 2500000, customers: 45 },
  { month: 'Feb', revenue: 2800000, customers: 48 },
  { month: 'Mar', revenue: 3200000, customers: 52 },
  { month: 'Apr', revenue: 2900000, customers: 50 },
  { month: 'May', revenue: 3500000, customers: 55 },
  { month: 'Jun', revenue: 3800000, customers: 58 },
  { month: 'Jul', revenue: 4200000, customers: 62 },
  { month: 'Aug', revenue: 4500000, customers: 65 },
  { month: 'Sep', revenue: 4800000, customers: 68 },
  { month: 'Oct', revenue: 5200000, customers: 72 },
  { month: 'Nov', revenue: 5500000, customers: 75 },
  { month: 'Dec', revenue: 5800000, customers: 78 }
];

const creditStatusData = [
  { status: 'Excellent', count: 35, color: '#10B981' },
  { status: 'Good', count: 28, color: '#3B82F6' },
  { status: 'Fair', count: 12, color: '#F59E0B' },
  { status: 'Poor', count: 3, color: '#EF4444' }
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCredit, setFilterCredit] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = filterSegment === 'all' || customer.customerSegment === filterSegment;
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    const matchesCredit = filterCredit === 'all' || customer.creditStatus === filterCredit;
    return matchesSearch && matchesSegment && matchesStatus && matchesCredit;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);
  const averageCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0) / customers.length;

  const getCreditStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage customer database, credit limits, and relationships</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Credit Limit</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageCreditLimit)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterSegment} onValueChange={setFilterSegment}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCredit} onValueChange={setFilterCredit}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by credit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Credit Status</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Credit Limit</th>
                  <th className="text-left p-4">Balance</th>
                  <th className="text-left p-4">Segment</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.company}</div>
                        <div className="text-xs text-gray-500">{customer.customerType}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{customer.email}</div>
                        <div>{customer.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">{formatCurrency(customer.creditLimit)}</div>
                        <div className="text-gray-600">{customer.paymentTerms}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">{formatCurrency(customer.currentBalance)}</div>
                        <Badge className={getCreditStatusColor(customer.creditStatus)}>
                          {customer.creditStatus}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getSegmentColor(customer.customerSegment)}>
                        {customer.customerSegment}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
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

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={customerSegmentsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {customerSegmentsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Credit Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={creditStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Average Order Value</span>
                <span className="font-medium">{formatCurrency(65000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Customer Retention Rate</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Credit Utilization</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment On-Time Rate</span>
                <span className="font-medium">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Name</Label>
                <Input placeholder="Enter customer name" />
              </div>
              <div>
                <Label>Company</Label>
                <Input placeholder="Enter company name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="Enter email address" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="Enter phone number" />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Textarea placeholder="Enter full address" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input placeholder="City" />
              </div>
              <div>
                <Label>State</Label>
                <Input placeholder="State" />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input placeholder="Postal code" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Industry</Label>
                <Input placeholder="Enter industry" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Credit Limit</Label>
                <Input type="number" placeholder="Enter credit limit" />
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Add Customer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Customer Name</Label>
                      <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Company</Label>
                      <p className="text-sm text-gray-600">{selectedCustomer.company}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Website</Label>
                      <p className="text-sm text-gray-600">{selectedCustomer.website}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Credit Limit</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedCustomer.creditLimit)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Current Balance</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedCustomer.currentBalance)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Available Credit</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedCustomer.creditLimit - selectedCustomer.currentBalance)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Payment Terms</div>
                        <div className="text-2xl font-bold">{selectedCustomer.paymentTerms}</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="orders" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Total Orders</div>
                        <div className="text-2xl font-bold">{selectedCustomer.totalOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Total Revenue</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedCustomer.totalRevenue)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Average Order Value</div>
                        <div className="text-2xl font-bold">{formatCurrency(selectedCustomer.averageOrderValue)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Last Order Date</div>
                        <div className="text-2xl font-bold">{formatDate(selectedCustomer.lastOrderDate)}</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Customer Since</div>
                        <div className="text-2xl font-bold">{formatDate(selectedCustomer.customerSince)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-600">Last Payment</div>
                        <div className="text-2xl font-bold">{formatDate(selectedCustomer.lastPaymentDate)}</div>
                      </CardContent>
                    </Card>
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