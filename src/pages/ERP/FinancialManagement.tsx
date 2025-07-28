/**
 * Financial Management Module - ERP System
 * Complete financial accounting, reporting, and budget management
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
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  PiggyBank,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Save,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Building2,
  Users,
  Package,
  ShoppingCart,
  Truck,
  Wrench,
  Lightbulb,
  Shield,
  Heart
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

// Financial Data Types
interface ChartOfAccounts {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
  subcategory: string;
  balance: number;
  status: 'active' | 'inactive';
  description: string;
}

interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed';
  createdBy: string;
  approvedBy: string;
  lines: JournalEntryLine[];
}

interface JournalEntryLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

interface CostCenter {
  id: string;
  code: string;
  name: string;
  department: string;
  manager: string;
  budget: number;
  actual: number;
  variance: number;
  status: 'active' | 'inactive';
}

interface Budget {
  id: string;
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  actualSpent: number;
  remaining: number;
  status: 'draft' | 'approved' | 'active' | 'closed';
  categories: BudgetCategory[];
}

interface BudgetCategory {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
}

// Mock Data
const mockChartOfAccounts: ChartOfAccounts[] = [
  {
    id: 'ACC-001',
    accountCode: '1000',
    accountName: 'Cash and Cash Equivalents',
    accountType: 'asset',
    category: 'Current Assets',
    subcategory: 'Cash',
    balance: 2500000,
    status: 'active',
    description: 'Cash on hand and in bank accounts'
  },
  {
    id: 'ACC-002',
    accountCode: '1100',
    accountName: 'Accounts Receivable',
    accountType: 'asset',
    category: 'Current Assets',
    subcategory: 'Receivables',
    balance: 1800000,
    status: 'active',
    description: 'Amounts owed by customers'
  },
  {
    id: 'ACC-003',
    accountCode: '1200',
    accountName: 'Inventory',
    accountType: 'asset',
    category: 'Current Assets',
    subcategory: 'Inventory',
    balance: 3200000,
    status: 'active',
    description: 'Raw materials, work in progress, finished goods'
  },
  {
    id: 'ACC-004',
    accountCode: '2000',
    accountName: 'Accounts Payable',
    accountType: 'liability',
    category: 'Current Liabilities',
    subcategory: 'Payables',
    balance: 1500000,
    status: 'active',
    description: 'Amounts owed to suppliers'
  },
  {
    id: 'ACC-005',
    accountCode: '3000',
    accountName: 'Common Stock',
    accountType: 'equity',
    category: 'Shareholders Equity',
    subcategory: 'Capital',
    balance: 5000000,
    status: 'active',
    description: 'Share capital issued'
  },
  {
    id: 'ACC-006',
    accountCode: '4000',
    accountName: 'Sales Revenue',
    accountType: 'revenue',
    category: 'Revenue',
    subcategory: 'Sales',
    balance: 8500000,
    status: 'active',
    description: 'Revenue from product sales'
  },
  {
    id: 'ACC-007',
    accountCode: '5000',
    accountName: 'Cost of Goods Sold',
    accountType: 'expense',
    category: 'Expenses',
    subcategory: 'Cost of Sales',
    balance: 5200000,
    status: 'active',
    description: 'Direct costs of producing goods'
  },
  {
    id: 'ACC-008',
    accountCode: '5100',
    accountName: 'Operating Expenses',
    accountType: 'expense',
    category: 'Expenses',
    subcategory: 'Operating',
    balance: 1800000,
    status: 'active',
    description: 'General and administrative expenses'
  }
];

const mockJournalEntries: JournalEntry[] = [
  {
    id: 'JE-001',
    entryNumber: 'JE-2024-001',
    date: '2024-12-20',
    reference: 'INV-001',
    description: 'Sale of products to customer',
    totalDebit: 125000,
    totalCredit: 125000,
    status: 'posted',
    createdBy: 'John Doe',
    approvedBy: 'Jane Smith',
    lines: [
      {
        id: 'JEL-001',
        accountCode: '1100',
        accountName: 'Accounts Receivable',
        debit: 125000,
        credit: 0,
        description: 'Amount owed by customer'
      },
      {
        id: 'JEL-002',
        accountCode: '4000',
        accountName: 'Sales Revenue',
        debit: 0,
        credit: 125000,
        description: 'Revenue from sale'
      }
    ]
  },
  {
    id: 'JE-002',
    entryNumber: 'JE-2024-002',
    date: '2024-12-19',
    reference: 'PO-001',
    description: 'Purchase of raw materials',
    totalDebit: 75000,
    totalCredit: 75000,
    status: 'posted',
    createdBy: 'John Doe',
    approvedBy: 'Jane Smith',
    lines: [
      {
        id: 'JEL-003',
        accountCode: '1200',
        accountName: 'Inventory',
        debit: 75000,
        credit: 0,
        description: 'Raw materials purchased'
      },
      {
        id: 'JEL-004',
        accountCode: '2000',
        accountName: 'Accounts Payable',
        debit: 0,
        credit: 75000,
        description: 'Amount owed to supplier'
      }
    ]
  }
];

const mockCostCenters: CostCenter[] = [
  {
    id: 'CC-001',
    code: 'CC-ADMIN',
    name: 'Administration',
    department: 'Administration',
    manager: 'John Smith',
    budget: 500000,
    actual: 480000,
    variance: 20000,
    status: 'active'
  },
  {
    id: 'CC-002',
    code: 'CC-SALES',
    name: 'Sales & Marketing',
    department: 'Sales',
    manager: 'Sarah Johnson',
    budget: 800000,
    actual: 820000,
    variance: -20000,
    status: 'active'
  },
  {
    id: 'CC-003',
    code: 'CC-PROD',
    name: 'Production',
    department: 'Operations',
    manager: 'Mike Wilson',
    budget: 1200000,
    actual: 1150000,
    variance: 50000,
    status: 'active'
  },
  {
    id: 'CC-004',
    code: 'CC-R&D',
    name: 'Research & Development',
    department: 'R&D',
    manager: 'Lisa Brown',
    budget: 600000,
    actual: 580000,
    variance: 20000,
    status: 'active'
  }
];

const mockBudgets: Budget[] = [
  {
    id: 'BUD-001',
    name: 'FY 2024 Budget',
    period: '2024',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalBudget: 5000000,
    actualSpent: 4200000,
    remaining: 800000,
    status: 'active',
    categories: [
      {
        id: 'BUD-CAT-001',
        category: 'Personnel',
        budgeted: 2500000,
        actual: 2200000,
        variance: 300000,
        variancePercent: 12
      },
      {
        id: 'BUD-CAT-002',
        category: 'Operations',
        budgeted: 1500000,
        actual: 1300000,
        variance: 200000,
        variancePercent: 13.33
      },
      {
        id: 'BUD-CAT-003',
        category: 'Marketing',
        budgeted: 800000,
        actual: 600000,
        variance: 200000,
        variancePercent: 25
      },
      {
        id: 'BUD-CAT-004',
        category: 'IT & Systems',
        budgeted: 200000,
        actual: 100000,
        variance: 100000,
        variancePercent: 50
      }
    ]
  }
];

// Analytics Data
const financialTrendData = [
  { month: 'Jan', revenue: 650000, expenses: 450000, profit: 200000 },
  { month: 'Feb', revenue: 720000, expenses: 480000, profit: 240000 },
  { month: 'Mar', revenue: 680000, expenses: 460000, profit: 220000 },
  { month: 'Apr', revenue: 750000, expenses: 500000, profit: 250000 },
  { month: 'May', revenue: 820000, expenses: 520000, profit: 300000 },
  { month: 'Jun', revenue: 780000, expenses: 490000, profit: 290000 },
  { month: 'Jul', revenue: 850000, expenses: 540000, profit: 310000 },
  { month: 'Aug', revenue: 900000, expenses: 560000, profit: 340000 },
  { month: 'Sep', revenue: 870000, expenses: 530000, profit: 340000 },
  { month: 'Oct', revenue: 920000, expenses: 580000, profit: 340000 },
  { month: 'Nov', revenue: 950000, expenses: 590000, profit: 360000 },
  { month: 'Dec', revenue: 1000000, expenses: 620000, profit: 380000 }
];

const accountTypeData = [
  { type: 'Assets', balance: 7500000, color: '#10B981' },
  { type: 'Liabilities', balance: 3000000, color: '#EF4444' },
  { type: 'Equity', balance: 8000000, color: '#3B82F6' },
  { type: 'Revenue', balance: 8500000, color: '#F59E0B' },
  { type: 'Expenses', balance: 7000000, color: '#8B5CF6' }
];

const costCenterData = [
  { center: 'Administration', budget: 500000, actual: 480000, variance: 20000 },
  { center: 'Sales & Marketing', budget: 800000, actual: 820000, variance: -20000 },
  { center: 'Production', budget: 1200000, actual: 1150000, variance: 50000 },
  { center: 'R&D', budget: 600000, actual: 580000, variance: 20000 }
];

export default function FinancialManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [isAddJournalDialogOpen, setIsAddJournalDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isViewEntryDialogOpen, setIsViewEntryDialogOpen] = useState(false);

  const totalAssets = mockChartOfAccounts.filter(acc => acc.accountType === 'asset').reduce((sum, acc) => sum + acc.balance, 0);
  const totalLiabilities = mockChartOfAccounts.filter(acc => acc.accountType === 'liability').reduce((sum, acc) => sum + acc.balance, 0);
  const totalEquity = mockChartOfAccounts.filter(acc => acc.accountType === 'equity').reduce((sum, acc) => sum + acc.balance, 0);
  const totalRevenue = mockChartOfAccounts.filter(acc => acc.accountType === 'revenue').reduce((sum, acc) => sum + acc.balance, 0);
  const totalExpenses = mockChartOfAccounts.filter(acc => acc.accountType === 'expense').reduce((sum, acc) => sum + acc.balance, 0);
  const netIncome = totalRevenue - totalExpenses;

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'bg-green-100 text-green-800';
      case 'liability': return 'bg-red-100 text-red-800';
      case 'equity': return 'bg-blue-100 text-blue-800';
      case 'revenue': return 'bg-yellow-100 text-yellow-800';
      case 'expense': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'posted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600">Chart of accounts, journal entries, and financial reporting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddJournalDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Journal Entry
          </Button>
          <Button onClick={() => setIsAddAccountDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAssets)}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalLiabilities)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Equity</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalEquity)}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(netIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="costcenters">Cost Centers</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Financial Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={financialTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Expenses" />
                    <Area type="monotone" dataKey="profit" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={accountTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="balance"
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    >
                      {accountTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Financial Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalAssets)}</div>
                  <div className="text-sm text-gray-600">Total Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalLiabilities)}</div>
                  <div className="text-sm text-gray-600">Total Liabilities</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart of Accounts Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Account Code</th>
                      <th className="text-left p-4">Account Name</th>
                      <th className="text-left p-4">Type</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-left p-4">Balance</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockChartOfAccounts.map((account) => (
                      <tr key={account.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono">{account.accountCode}</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{account.accountName}</div>
                            <div className="text-sm text-gray-600">{account.description}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getAccountTypeColor(account.accountType)}>
                            {account.accountType}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>{account.category}</div>
                            <div className="text-gray-600">{account.subcategory}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{formatCurrency(account.balance)}</div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(account.status)}>
                            {account.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
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
        </TabsContent>

        {/* Journal Entries Tab */}
        <TabsContent value="journal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Journal Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Entry #</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Reference</th>
                      <th className="text-left p-4">Description</th>
                      <th className="text-left p-4">Debit</th>
                      <th className="text-left p-4">Credit</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockJournalEntries.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono">{entry.entryNumber}</td>
                        <td className="p-4">{formatDate(entry.date)}</td>
                        <td className="p-4">{entry.reference}</td>
                        <td className="p-4">
                          <div className="max-w-xs truncate">{entry.description}</div>
                        </td>
                        <td className="p-4">{formatCurrency(entry.totalDebit)}</td>
                        <td className="p-4">{formatCurrency(entry.totalCredit)}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(entry.status)}>
                            {entry.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedEntry(entry);
                                setIsViewEntryDialogOpen(true);
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
        </TabsContent>

        {/* Cost Centers Tab */}
        <TabsContent value="costcenters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Code</th>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Department</th>
                      <th className="text-left p-4">Manager</th>
                      <th className="text-left p-4">Budget</th>
                      <th className="text-left p-4">Actual</th>
                      <th className="text-left p-4">Variance</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCostCenters.map((center) => (
                      <tr key={center.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono">{center.code}</td>
                        <td className="p-4 font-medium">{center.name}</td>
                        <td className="p-4">{center.department}</td>
                        <td className="p-4">{center.manager}</td>
                        <td className="p-4">{formatCurrency(center.budget)}</td>
                        <td className="p-4">{formatCurrency(center.actual)}</td>
                        <td className={`p-4 font-medium ${getVarianceColor(center.variance)}`}>
                          {formatCurrency(center.variance)}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(center.status)}>
                            {center.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Cost Center Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Center Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costCenterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="center" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                  <Bar dataKey="actual" fill="#10B981" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budgets Tab */}
        <TabsContent value="budgets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Budget Name</th>
                      <th className="text-left p-4">Period</th>
                      <th className="text-left p-4">Total Budget</th>
                      <th className="text-left p-4">Actual Spent</th>
                      <th className="text-left p-4">Remaining</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBudgets.map((budget) => (
                      <tr key={budget.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{budget.name}</td>
                        <td className="p-4">{budget.period}</td>
                        <td className="p-4">{formatCurrency(budget.totalBudget)}</td>
                        <td className="p-4">{formatCurrency(budget.actualSpent)}</td>
                        <td className={`p-4 font-medium ${getVarianceColor(budget.remaining)}`}>
                          {formatCurrency(budget.remaining)}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(budget.status)}>
                            {budget.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
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

          {/* Budget Categories */}
          {mockBudgets.map((budget) => (
            <Card key={budget.id}>
              <CardHeader>
                <CardTitle>{budget.name} - Budget Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Budgeted</th>
                        <th className="text-left p-4">Actual</th>
                        <th className="text-left p-4">Variance</th>
                        <th className="text-left p-4">Variance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budget.categories.map((category) => (
                        <tr key={category.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{category.category}</td>
                          <td className="p-4">{formatCurrency(category.budgeted)}</td>
                          <td className="p-4">{formatCurrency(category.actual)}</td>
                          <td className={`p-4 font-medium ${getVarianceColor(category.variance)}`}>
                            {formatCurrency(category.variance)}
                          </td>
                          <td className={`p-4 ${getVarianceColor(category.variance)}`}>
                            {category.variancePercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Add Account Dialog */}
      <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Code</Label>
                <Input placeholder="Enter account code" />
              </div>
              <div>
                <Label>Account Name</Label>
                <Input placeholder="Enter account name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset">Asset</SelectItem>
                    <SelectItem value="liability">Liability</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Input placeholder="Enter category" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Enter account description" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddAccountDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Add Account</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Journal Entry Dialog */}
      <Dialog open={isAddJournalDialogOpen} onOpenChange={setIsAddJournalDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Reference</Label>
                <Input placeholder="Enter reference" />
              </div>
              <div>
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="posted">Posted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Enter journal entry description" />
            </div>
            <div>
              <Label>Journal Entry Lines</Label>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm">Account</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockChartOfAccounts.map(account => (
                          <SelectItem key={account.id} value={account.accountCode}>
                            {account.accountCode} - {account.accountName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Debit</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label className="text-sm">Credit</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label className="text-sm">Description</Label>
                    <Input placeholder="Line description" />
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddJournalDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Create Entry</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Journal Entry Dialog */}
      <Dialog open={isViewEntryDialogOpen} onOpenChange={setIsViewEntryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Journal Entry Details</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Entry Number</Label>
                  <p className="text-sm text-gray-600">{selectedEntry.entryNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-gray-600">{formatDate(selectedEntry.date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reference</Label>
                  <p className="text-sm text-gray-600">{selectedEntry.reference}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedEntry.status)}>
                    {selectedEntry.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600">{selectedEntry.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Journal Entry Lines</Label>
                <div className="border rounded-lg p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Account</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-right p-2">Debit</th>
                        <th className="text-right p-2">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEntry.lines.map((line) => (
                        <tr key={line.id} className="border-b">
                          <td className="p-2">
                            <div className="font-mono text-sm">{line.accountCode}</div>
                            <div className="text-xs text-gray-600">{line.accountName}</div>
                          </td>
                          <td className="p-2 text-sm">{line.description}</td>
                          <td className="p-2 text-right font-mono text-sm">
                            {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                          </td>
                          <td className="p-2 text-right font-mono text-sm">
                            {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t font-medium">
                        <td colSpan={2} className="p-2">Total</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(selectedEntry.totalDebit)}</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(selectedEntry.totalCredit)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 