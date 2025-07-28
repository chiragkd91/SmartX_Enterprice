/**
 * Business Intelligence Dashboard - Phase 2 Implementation
 * Advanced analytics, custom reports, and real-time KPI tracking
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart,
  Activity,
  Target,
  Zap,
  Download,
  Share2,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Building2,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Save,
  Play,
  Pause,
  Maximize2,
  Minimize2
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
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';
import { formatCurrency, formatRelativeTime } from '../lib/utils';

// Sample data for comprehensive BI dashboard
const salesPerformanceData = [
  { month: 'Jan', revenue: 4500000, orders: 45, customers: 23, growth: 12.5 },
  { month: 'Feb', revenue: 5200000, orders: 52, customers: 28, growth: 15.6 },
  { month: 'Mar', revenue: 4800000, orders: 48, customers: 25, growth: -7.7 },
  { month: 'Apr', revenue: 6100000, orders: 61, customers: 34, growth: 27.1 },
  { month: 'May', revenue: 5900000, orders: 59, customers: 38, growth: -3.3 },
  { month: 'Jun', revenue: 6800000, orders: 68, customers: 42, growth: 15.3 }
];

const customerSegmentationData = [
  { segment: 'Enterprise', value: 35, revenue: 18000000, color: '#3B82F6' },
  { segment: 'Mid-Market', value: 28, revenue: 14500000, color: '#10B981' },
  { segment: 'SMB', value: 22, revenue: 11500000, color: '#F59E0B' },
  { segment: 'Startup', value: 15, revenue: 7800000, color: '#EF4444' }
];

const regionalPerformanceData = [
  { region: 'North India', revenue: 25000000, growth: 18.5, customers: 156 },
  { region: 'South India', revenue: 22000000, growth: 22.3, customers: 142 },
  { region: 'East India', revenue: 18000000, growth: 15.7, customers: 98 },
  { region: 'West India', revenue: 32000000, growth: 25.1, customers: 203 },
  { region: 'Central India', revenue: 15000000, growth: 12.8, customers: 87 }
];

const productPerformanceData = [
  { product: 'Cloud Services', sales: 45, revenue: 18000000, margin: 68 },
  { product: 'Security Solutions', sales: 38, revenue: 14500000, margin: 72 },
  { product: 'IT Consulting', sales: 32, revenue: 11500000, margin: 65 },
  { product: 'Hardware', sales: 28, revenue: 7800000, margin: 45 },
  { product: 'Software Licenses', sales: 25, revenue: 6200000, margin: 85 }
];

const predictiveAnalyticsData = [
  { month: 'Jul', actual: 6800000, predicted: 6950000, confidence: 92 },
  { month: 'Aug', actual: 0, predicted: 7200000, confidence: 89 },
  { month: 'Sep', actual: 0, predicted: 7450000, confidence: 87 },
  { month: 'Oct', actual: 0, predicted: 7800000, confidence: 85 },
  { month: 'Nov', actual: 0, predicted: 8100000, confidence: 83 },
  { month: 'Dec', actual: 0, predicted: 8400000, confidence: 81 }
];

interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge';
  title: string;
  data: any;
  config: any;
  position: { x: number; y: number; w: number; h: number };
  refreshInterval?: number;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  dataSource: string;
  filters: ReportFilter[];
  visualizations: ChartConfig[];
  schedule: ReportSchedule;
  lastRun?: string;
  nextRun?: string;
}

interface ReportFilter {
  field: string;
  operator: string;
  value: any;
}

interface ChartConfig {
  type: string;
  dataKey: string;
  color: string;
  options: any;
}

interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  recipients: string[];
}

export default function BusinessIntelligence() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [isWidgetBuilderOpen, setIsWidgetBuilderOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<DashboardWidget | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Dashboard widgets state
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'revenue-trend',
      type: 'chart',
      title: 'Revenue Trend Analysis',
      data: salesPerformanceData,
      config: { type: 'area', dataKey: 'revenue' },
      position: { x: 0, y: 0, w: 6, h: 4 }
    },
    {
      id: 'customer-segments',
      type: 'chart',
      title: 'Customer Segmentation',
      data: customerSegmentationData,
      config: { type: 'pie', dataKey: 'value' },
      position: { x: 6, y: 0, w: 6, h: 4 }
    },
    {
      id: 'regional-performance',
      type: 'chart',
      title: 'Regional Performance',
      data: regionalPerformanceData,
      config: { type: 'bar', dataKey: 'revenue' },
      position: { x: 0, y: 4, w: 8, h: 4 }
    },
    {
      id: 'kpi-metrics',
      type: 'metric',
      title: 'Key Performance Indicators',
      data: {
        totalRevenue: 112000000,
        growthRate: 18.5,
        customerCount: 686,
        avgOrderValue: 163265
      },
      config: {},
      position: { x: 8, y: 4, w: 4, h: 4 }
    }
  ]);

  // Custom reports state
  const [customReports, setCustomReports] = useState<CustomReport[]>([
    {
      id: '1',
      name: 'Monthly Sales Report',
      description: 'Comprehensive monthly sales analysis with regional breakdown',
      dataSource: 'sales_data',
      filters: [
        { field: 'date', operator: 'gte', value: '2024-01-01' },
        { field: 'region', operator: 'in', value: ['North', 'South', 'East', 'West'] }
      ],
      visualizations: [
        { type: 'bar', dataKey: 'revenue', color: '#3B82F6', options: {} },
        { type: 'line', dataKey: 'growth', color: '#10B981', options: {} }
      ],
      schedule: {
        frequency: 'monthly',
        time: '09:00',
        recipients: ['management@company.com', 'sales@company.com']
      },
      lastRun: '2024-01-01T09:00:00Z',
      nextRun: '2024-02-01T09:00:00Z'
    }
  ]);

  // Real-time KPI tracking
  const [kpiMetrics, setKpiMetrics] = useState({
    totalRevenue: 112000000,
    growthRate: 18.5,
    customerCount: 686,
    avgOrderValue: 163265,
    conversionRate: 24.6,
    customerSatisfaction: 4.6,
    systemUptime: 99.9,
    activeUsers: 245
  });

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time data updates
      setKpiMetrics(prev => ({
        ...prev,
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 100000),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5
      }));
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const renderChart = (widget: DashboardWidget) => {
    const { type, data, config } = widget;

    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Area type="monotone" dataKey={config.dataKey} stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={config.dataKey}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey={config.dataKey} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={config.dataKey} stroke="#3B82F6" />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  const renderMetricWidget = (widget: DashboardWidget) => {
    const { data } = widget;
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(data.totalRevenue)}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.growthRate}%
          </div>
          <div className="text-sm text-gray-600">Growth Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.customerCount}
          </div>
          <div className="text-sm text-gray-600">Customers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(data.avgOrderValue)}
          </div>
          <div className="text-sm text-gray-600">Avg Order Value</div>
        </div>
      </div>
    );
  };

  const exportReport = (format: string, reportName: string) => {
    console.log(`Exporting ${reportName} as ${format}`);
    // Implementation for actual export functionality
  };

  const createCustomReport = (reportData: Partial<CustomReport>) => {
    const newReport: CustomReport = {
      id: Date.now().toString(),
      name: reportData.name || 'New Report',
      description: reportData.description || '',
      dataSource: reportData.dataSource || 'default',
      filters: reportData.filters || [],
      visualizations: reportData.visualizations || [],
      schedule: reportData.schedule || {
        frequency: 'monthly',
        time: '09:00',
        recipients: []
      }
    };
    
    setCustomReports([...customReports, newReport]);
    setIsCreateReportOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Business Intelligence</h1>
          <p className="text-muted-foreground">Advanced analytics and real-time business insights</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 text-green-700' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
          </Button>
          <Button onClick={() => setIsCreateReportOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Real-time KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(kpiMetrics.totalRevenue)}</p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{kpiMetrics.growthRate}%
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{kpiMetrics.customerCount}</p>
                <div className="flex items-center text-sm text-blue-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{kpiMetrics.conversionRate}%</p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +3.2%
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{kpiMetrics.systemUptime}%</p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Operational
                </div>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Dashboard Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {widgets.map((widget) => (
              <Card key={widget.id} className={`lg:col-span-${widget.position.w}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {widget.type === 'chart' && renderChart(widget)}
                  {widget.type === 'metric' && renderMetricWidget(widget)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Advanced Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={productPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" fill="#3B82F6" name="Sales Count" />
                    <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#10B981" name="Margin %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={regionalPerformanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="region" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Revenue"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Growth"
                      dataKey="growth"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Custom Reports */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Custom Reports</h2>
            <Button onClick={() => setIsCreateReportOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last Run:</span>
                      <span>{report.lastRun ? formatRelativeTime(report.lastRun) : 'Never'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Next Run:</span>
                      <span>{report.nextRun ? formatRelativeTime(report.nextRun) : 'Not scheduled'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Schedule:</span>
                      <span className="capitalize">{report.schedule.frequency}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          {/* Predictive Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecasting</CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-powered revenue predictions with confidence intervals
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsLineChart data={predictiveAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      name="Actual Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Revenue"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Revenue Forecast</h4>
                    <p className="text-blue-700">
                      Expected revenue for next quarter: <strong>₹84.2M</strong>
                    </p>
                    <p className="text-sm text-blue-600">Confidence: 81%</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Growth Opportunity</h4>
                    <p className="text-green-700">
                      West India region shows 25% growth potential
                    </p>
                    <p className="text-sm text-green-600">Based on market analysis</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900">Risk Alert</h4>
                    <p className="text-orange-700">
                      Customer churn risk: 8.5% in next 30 days
                    </p>
                    <p className="text-sm text-orange-600">Focus on retention strategies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Report Dialog */}
      <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Custom Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportName">Report Name</Label>
                <Input id="reportName" placeholder="Enter report name" />
              </div>
              <div>
                <Label htmlFor="dataSource">Data Source</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Data</SelectItem>
                    <SelectItem value="customers">Customer Data</SelectItem>
                    <SelectItem value="products">Product Data</SelectItem>
                    <SelectItem value="financial">Financial Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the report purpose..." />
            </div>
            
            <div>
              <Label>Visualizations</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Bar Chart
                </Button>
                <Button variant="outline" size="sm">
                  <LineChart className="w-4 h-4 mr-2" />
                  Line Chart
                </Button>
                <Button variant="outline" size="sm">
                  <PieChart className="w-4 h-4 mr-2" />
                  Pie Chart
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateReportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => createCustomReport({
                name: 'New Custom Report',
                description: 'Custom report description',
                dataSource: 'sales'
              })}>
                Create Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 