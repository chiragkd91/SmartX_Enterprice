/**
 * Advanced Analytics page with business intelligence and predictive analytics
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Download,
  Plus,
  Calendar,
  Target,
  DollarSign,
  Users,
  Package,
  Activity,
  Zap,
  Brain,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Edit
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
  status: 'on-track' | 'at-risk' | 'behind';
  unit: string;
  category: 'financial' | 'operational' | 'customer' | 'quality';
}

interface SalesAnalytics {
  id: string;
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  customerCount: number;
  growthRate: number;
  topProduct: string;
  topCustomer: string;
}

interface InventoryAnalytics {
  id: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  turnoverRate: number;
  daysOfInventory: number;
  stockoutRisk: 'low' | 'medium' | 'high';
  value: number;
}

interface PredictiveInsight {
  id: string;
  type: 'demand' | 'inventory' | 'revenue' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  timeframe: string;
  status: 'new' | 'reviewed' | 'implemented';
}

interface PerformanceReport {
  id: string;
  reportName: string;
  reportType: 'sales' | 'inventory' | 'financial' | 'operational';
  period: string;
  generatedDate: string;
  status: 'draft' | 'final' | 'scheduled';
  insights: number;
  recommendations: number;
}

const mockKPIMetrics: KPIMetric[] = [
  {
    id: 'KPI-001',
    name: 'Total Revenue',
    value: 1250000,
    previousValue: 1100000,
    change: 150000,
    changePercentage: 13.6,
    trend: 'up',
    target: 1200000,
    status: 'on-track',
    unit: 'USD',
    category: 'financial',
  },
  {
    id: 'KPI-002',
    name: 'Order Fulfillment Rate',
    value: 96.5,
    previousValue: 94.2,
    change: 2.3,
    changePercentage: 2.4,
    trend: 'up',
    target: 95.0,
    status: 'on-track',
    unit: '%',
    category: 'operational',
  },
  {
    id: 'KPI-003',
    name: 'Customer Satisfaction',
    value: 4.3,
    previousValue: 4.1,
    change: 0.2,
    changePercentage: 4.9,
    trend: 'up',
    target: 4.5,
    status: 'at-risk',
    unit: '/5',
    category: 'customer',
  },
  {
    id: 'KPI-004',
    name: 'Inventory Turnover',
    value: 8.5,
    previousValue: 7.8,
    change: 0.7,
    changePercentage: 9.0,
    trend: 'up',
    target: 8.0,
    status: 'on-track',
    unit: 'times/year',
    category: 'operational',
  },
  {
    id: 'KPI-005',
    name: 'Quality Pass Rate',
    value: 98.2,
    previousValue: 97.5,
    change: 0.7,
    changePercentage: 0.7,
    trend: 'up',
    target: 98.0,
    status: 'on-track',
    unit: '%',
    category: 'quality',
  },
  {
    id: 'KPI-006',
    name: 'Average Lead Time',
    value: 3.2,
    previousValue: 3.8,
    change: -0.6,
    changePercentage: -15.8,
    trend: 'down',
    target: 3.5,
    status: 'on-track',
    unit: 'days',
    category: 'operational',
  },
];

const mockSalesAnalytics: SalesAnalytics[] = [
  {
    id: 'SA-001',
    period: 'Q4 2024',
    revenue: 1250000,
    orders: 1250,
    averageOrderValue: 1000,
    customerCount: 450,
    growthRate: 13.6,
    topProduct: 'Product A',
    topCustomer: 'TechNova Solutions',
  },
  {
    id: 'SA-002',
    period: 'Q3 2024',
    revenue: 1100000,
    orders: 1100,
    averageOrderValue: 1000,
    customerCount: 420,
    growthRate: 8.2,
    topProduct: 'Product B',
    topCustomer: 'Global Industries',
  },
  {
    id: 'SA-003',
    period: 'Q2 2024',
    revenue: 1015000,
    orders: 1015,
    averageOrderValue: 1000,
    customerCount: 395,
    growthRate: 12.1,
    topProduct: 'Product A',
    topCustomer: 'TechNova Solutions',
  },
];

const mockInventoryAnalytics: InventoryAnalytics[] = [
  {
    id: 'IA-001',
    productName: 'Product A',
    currentStock: 150,
    reorderPoint: 50,
    maxStock: 200,
    turnoverRate: 12.5,
    daysOfInventory: 29,
    stockoutRisk: 'low',
    value: 15000,
  },
  {
    id: 'IA-002',
    productName: 'Product B',
    currentStock: 25,
    reorderPoint: 30,
    maxStock: 100,
    turnoverRate: 8.2,
    daysOfInventory: 44,
    stockoutRisk: 'high',
    value: 5000,
  },
  {
    id: 'IA-003',
    productName: 'Product C',
    currentStock: 75,
    reorderPoint: 40,
    maxStock: 150,
    turnoverRate: 10.8,
    daysOfInventory: 34,
    stockoutRisk: 'medium',
    value: 11250,
  },
];

const mockPredictiveInsights: PredictiveInsight[] = [
  {
    id: 'PI-001',
    type: 'demand',
    title: 'Seasonal Demand Increase',
    description: 'Product A shows 25% higher demand in Q1 based on historical patterns',
    confidence: 85,
    impact: 'high',
    recommendation: 'Increase production capacity by 20% for Q1',
    timeframe: 'Next 3 months',
    status: 'new',
  },
  {
    id: 'PI-002',
    type: 'inventory',
    title: 'Stockout Risk Alert',
    description: 'Product B inventory levels indicate potential stockout within 2 weeks',
    confidence: 92,
    impact: 'high',
    recommendation: 'Place urgent order for 100 units of Product B',
    timeframe: 'Next 2 weeks',
    status: 'reviewed',
  },
  {
    id: 'PI-003',
    type: 'revenue',
    title: 'Revenue Growth Opportunity',
    description: 'Customer segment analysis shows 15% growth potential in SMB market',
    confidence: 78,
    impact: 'medium',
    recommendation: 'Launch targeted marketing campaign for SMB customers',
    timeframe: 'Next 6 months',
    status: 'new',
  },
];

const mockPerformanceReports: PerformanceReport[] = [
  {
    id: 'PR-001',
    reportName: 'Q4 2024 Sales Performance',
    reportType: 'sales',
    period: 'Q4 2024',
    generatedDate: '2024-01-15T00:00:00Z',
    status: 'final',
    insights: 8,
    recommendations: 5,
  },
  {
    id: 'PR-002',
    reportName: 'Inventory Optimization Report',
    reportType: 'inventory',
    period: 'December 2024',
    generatedDate: '2024-01-10T00:00:00Z',
    status: 'final',
    insights: 12,
    recommendations: 7,
  },
  {
    id: 'PR-003',
    reportName: 'Financial Performance Analysis',
    reportType: 'financial',
    period: 'Q4 2024',
    generatedDate: '2024-01-12T00:00:00Z',
    status: 'draft',
    insights: 6,
    recommendations: 3,
  },
];

export default function AdvancedAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('q4-2024');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredKPIs = mockKPIMetrics.filter(kpi => 
    selectedCategory === 'all' || kpi.category === selectedCategory
  );

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
           trend === 'down' ? <ArrowDownRight className="h-4 w-4 text-red-600" /> : 
           <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'behind': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Business intelligence, predictive analytics, and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="period">Analysis Period</Label>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q4-2024">Q4 2024</SelectItem>
                <SelectItem value="q3-2024">Q3 2024</SelectItem>
                <SelectItem value="q2-2024">Q2 2024</SelectItem>
                <SelectItem value="q1-2024">Q1 2024</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="category">KPI Category</Label>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredKPIs.map((kpi) => (
          <Card key={kpi.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              {getTrendIcon(kpi.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.unit === 'USD' ? formatCurrency(kpi.value) : 
                 kpi.unit === '%' ? `${kpi.value}%` :
                 kpi.unit === '/5' ? `${kpi.value}/5` :
                 `${kpi.value} ${kpi.unit}`}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs ${
                  kpi.changePercentage >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.changePercentage >= 0 ? '+' : ''}{kpi.changePercentage.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">vs previous period</span>
              </div>
              <div className="mt-2">
                <Badge className={getStatusColor(kpi.status)}>
                  {kpi.status.replace('-', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analytics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
          <TabsTrigger value="reports">Performance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSalesAnalytics.map((period) => (
                    <div key={period.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{period.period}</div>
                        <div className="text-sm text-muted-foreground">
                          {period.orders} orders, {period.customerCount} customers
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(period.revenue)}</div>
                        <div className={`text-sm ${
                          period.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {period.growthRate >= 0 ? '+' : ''}{period.growthRate}% growth
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Acquisition Cost</span>
                    <span className="text-sm font-medium">{formatCurrency(150)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Lifetime Value</span>
                    <span className="text-sm font-medium">{formatCurrency(2500)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gross Profit Margin</span>
                    <span className="text-sm font-medium">68.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Employee Productivity</span>
                    <span className="text-sm font-medium">$125K/employee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Avg Order Value</TableHead>
                      <TableHead>Customers</TableHead>
                      <TableHead>Growth Rate</TableHead>
                      <TableHead>Top Product</TableHead>
                      <TableHead>Top Customer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSalesAnalytics.map((period) => (
                      <TableRow key={period.id}>
                        <TableCell className="font-medium">{period.period}</TableCell>
                        <TableCell>{formatCurrency(period.revenue)}</TableCell>
                        <TableCell>{period.orders}</TableCell>
                        <TableCell>{formatCurrency(period.averageOrderValue)}</TableCell>
                        <TableCell>{period.customerCount}</TableCell>
                        <TableCell>
                          <span className={`${
                            period.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {period.growthRate >= 0 ? '+' : ''}{period.growthRate}%
                          </span>
                        </TableCell>
                        <TableCell>{period.topProduct}</TableCell>
                        <TableCell>{period.topCustomer}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Max Stock</TableHead>
                      <TableHead>Turnover Rate</TableHead>
                      <TableHead>Days of Inventory</TableHead>
                      <TableHead>Stockout Risk</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInventoryAnalytics.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>
                          <span className={item.currentStock < item.reorderPoint ? 'text-red-600' : 'text-green-600'}>
                            {item.currentStock}
                          </span>
                        </TableCell>
                        <TableCell>{item.reorderPoint}</TableCell>
                        <TableCell>{item.maxStock}</TableCell>
                        <TableCell>{item.turnoverRate} times/year</TableCell>
                        <TableCell>{item.daysOfInventory} days</TableCell>
                        <TableCell>
                          <Badge className={getStockoutRiskColor(item.stockoutRisk)}>
                            {item.stockoutRisk}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(item.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockPredictiveInsights.map((insight) => (
                  <Card key={insight.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{insight.type} insight</p>
                        </div>
                        <Badge className={getStatusColor(insight.status)}>
                          {insight.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm">{insight.description}</p>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Confidence:</span>
                          <span className="text-sm font-medium">{insight.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Impact:</span>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Timeframe: {insight.timeframe}
                        </div>
                        <div className="text-sm font-medium">
                          Recommendation: {insight.recommendation}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Insights</TableHead>
                      <TableHead>Recommendations</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPerformanceReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.reportName}</TableCell>
                        <TableCell>
                          <Badge className={report.reportType === 'sales' ? 'bg-blue-100 text-blue-800' :
                                           report.reportType === 'inventory' ? 'bg-green-100 text-green-800' :
                                           report.reportType === 'financial' ? 'bg-purple-100 text-purple-800' :
                                           'bg-orange-100 text-orange-800'}>
                            {report.reportType}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>{formatRelativeTime(report.generatedDate)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.insights}</TableCell>
                        <TableCell>{report.recommendations}</TableCell>
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
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Report
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
      </Tabs>
    </div>
  );
} 