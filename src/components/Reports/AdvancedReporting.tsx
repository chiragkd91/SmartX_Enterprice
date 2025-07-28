import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter, ComposedChart, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, 
  ScatterChart as ScatterChartIcon, Download, Plus, Settings, Eye,
  Calendar, Filter, Search, RefreshCw, Share2, Printer, FileText,
  TrendingUp, TrendingDown, Target, Users, DollarSign, Activity,
  Zap, Shield, Database, Save
} from 'lucide-react';

interface ExecutiveDashboard {
  id: string;
  name: string;
  type: 'financial' | 'operational' | 'hr' | 'sales' | 'custom';
  lastUpdated: Date;
  status: 'active' | 'draft' | 'archived';
  metrics: DashboardMetric[];
  charts: DashboardChart[];
}

interface DashboardMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
  unit: string;
}

interface DashboardChart {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar';
  title: string;
  data: any[];
  config: any;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  category: string;
  createdBy: string;
  createdAt: Date;
  lastRun: Date;
  schedule: 'daily' | 'weekly' | 'monthly' | 'manual';
  status: 'active' | 'paused' | 'error';
  recipients: string[];
}

const AdvancedReporting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const [loading, setLoading] = useState(false);
  const [dashboards, setDashboards] = useState<ExecutiveDashboard[]>([]);
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<string>('');

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setDashboards([
        {
          id: 'exec-001',
          name: 'Executive Overview',
          type: 'financial',
          lastUpdated: new Date('2024-01-20T10:00:00'),
          status: 'active',
          metrics: [
            {
              name: 'Revenue',
              value: 2450000,
              change: 12.5,
              trend: 'up',
              target: 2500000,
              unit: 'USD'
            },
            {
              name: 'Profit Margin',
              value: 18.5,
              change: -2.1,
              trend: 'down',
              target: 20.0,
              unit: '%'
            },
            {
              name: 'Employee Count',
              value: 1250,
              change: 5.2,
              trend: 'up',
              target: 1300,
              unit: ''
            },
            {
              name: 'Customer Satisfaction',
              value: 4.6,
              change: 0.3,
              trend: 'up',
              target: 4.8,
              unit: '/5'
            }
          ],
          charts: [
            {
              id: 'chart-001',
              type: 'line',
              title: 'Revenue Trend',
              data: [
                { month: 'Jan', revenue: 1800000, target: 2000000 },
                { month: 'Feb', revenue: 1950000, target: 2000000 },
                { month: 'Mar', revenue: 2100000, target: 2000000 },
                { month: 'Apr', revenue: 2200000, target: 2000000 },
                { month: 'May', revenue: 2350000, target: 2000000 },
                { month: 'Jun', revenue: 2450000, target: 2000000 }
              ],
              config: {}
            },
            {
              id: 'chart-002',
              type: 'bar',
              title: 'Department Performance',
              data: [
                { dept: 'Sales', performance: 85, target: 80 },
                { dept: 'Marketing', performance: 78, target: 75 },
                { dept: 'Engineering', performance: 92, target: 85 },
                { dept: 'Support', performance: 88, target: 90 }
              ],
              config: {}
            }
          ]
        },
        {
          id: 'exec-002',
          name: 'HR Analytics',
          type: 'hr',
          lastUpdated: new Date('2024-01-20T09:30:00'),
          status: 'active',
          metrics: [
            {
              name: 'Turnover Rate',
              value: 8.5,
              change: -1.2,
              trend: 'down',
              target: 10.0,
              unit: '%'
            },
            {
              name: 'Employee Engagement',
              value: 87.3,
              change: 3.1,
              trend: 'up',
              target: 85.0,
              unit: '%'
            },
            {
              name: 'Training Completion',
              value: 94.2,
              change: 2.8,
              trend: 'up',
              target: 90.0,
              unit: '%'
            },
            {
              name: 'Time to Hire',
              value: 28,
              change: -5,
              trend: 'down',
              target: 30,
              unit: 'days'
            }
          ],
          charts: [
            {
              id: 'chart-003',
              type: 'pie',
              title: 'Employee Distribution',
              data: [
                { category: 'Engineering', value: 35 },
                { category: 'Sales', value: 25 },
                { category: 'Marketing', value: 15 },
                { category: 'Support', value: 20 },
                { category: 'Other', value: 5 }
              ],
              config: {}
            }
          ]
        }
      ]);

      setCustomReports([
        {
          id: 'report-001',
          name: 'Monthly Sales Report',
          description: 'Comprehensive sales performance analysis',
          category: 'Sales',
          createdBy: 'John Smith',
          createdAt: new Date('2024-01-01'),
          lastRun: new Date('2024-01-20T08:00:00'),
          schedule: 'monthly',
          status: 'active',
          recipients: ['sales@company.com', 'management@company.com']
        },
        {
          id: 'report-002',
          name: 'Employee Performance Review',
          description: 'Quarterly employee performance metrics',
          category: 'HR',
          createdBy: 'Sarah Johnson',
          createdAt: new Date('2024-01-05'),
          lastRun: new Date('2024-01-15T10:00:00'),
          schedule: 'weekly',
          status: 'active',
          recipients: ['hr@company.com']
        },
        {
          id: 'report-003',
          name: 'Financial Summary',
          description: 'Daily financial performance summary',
          category: 'Finance',
          createdBy: 'Mike Davis',
          createdAt: new Date('2024-01-10'),
          lastRun: new Date('2024-01-20T06:00:00'),
          schedule: 'daily',
          status: 'active',
          recipients: ['finance@company.com', 'executives@company.com']
        }
      ]);

      setSelectedDashboard('exec-001');
      setLoading(false);
    }, 2000);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
    return `${value}${unit}`;
  };

  const renderChart = (chart: DashboardChart) => {
    switch (chart.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="performance" fill="#8884d8" />
              <Bar dataKey="target" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ category, value }) => `${category}: ${value}%`}
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Chart type not supported</div>;
    }
  };

  const selectedDashboardData = dashboards.find(d => d.id === selectedDashboard);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Reporting</h1>
          <p className="text-gray-600 mt-2">
            Executive dashboards, custom reports, and advanced analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
                            <BarChart3 className="h-4 w-4" />
            <span>Real-time</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <span>Interactive</span>
          </Badge>
        </div>
      </div>

      <Alert>
        <BarChart3 className="h-4 w-4" />
        <AlertDescription>
          Advanced reporting system with executive dashboards, custom report builder, 
          and interactive data visualizations. All data is updated in real-time.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="executive" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Executive Dashboards</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Custom Reports</span>
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Report Builder</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Total Dashboards</span>
                </CardTitle>
                <CardDescription>
                  Available executive dashboards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{dashboards.length}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Active dashboards
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  <span>Active Views</span>
                </CardTitle>
                <CardDescription>
                  Currently active dashboard views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {dashboards.filter(d => d.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  In use
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span>Last Updated</span>
                </CardTitle>
                <CardDescription>
                  Most recent dashboard update
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {dashboards.length > 0 ? 
                    new Date(Math.max(...dashboards.map(d => d.lastUpdated.getTime()))).toLocaleDateString() : 
                    'N/A'
                  }
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Latest update
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5 text-orange-600" />
                  <span>Shared Reports</span>
                </CardTitle>
                <CardDescription>
                  Reports shared with stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">12</div>
                <p className="text-sm text-gray-600 mt-2">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Selection</CardTitle>
                <CardDescription>
                  Choose a dashboard to view
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboards.map((dashboard) => (
                    <div
                      key={dashboard.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDashboard === dashboard.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDashboard(dashboard.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{dashboard.name}</h3>
                          <p className="text-sm text-gray-600">{dashboard.type}</p>
                        </div>
                        <Badge className={getStatusColor(dashboard.status)}>
                          {dashboard.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Last updated: {dashboard.lastUpdated.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedDashboardData && (
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedDashboardData.name}</CardTitle>
                    <CardDescription>
                      Executive dashboard with key performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {selectedDashboardData.metrics.map((metric, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                            {getTrendIcon(metric.trend)}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatValue(metric.value, metric.unit)}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={metric.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {metric.change >= 0 ? '+' : ''}{metric.change}%
                            </span>
                            <span className="text-gray-500">Target: {formatValue(metric.target, metric.unit)}</span>
                          </div>
                          <div className="mt-2">
                            <Progress 
                              value={(metric.value / metric.target) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {selectedDashboardData.charts.map((chart) => (
                        <Card key={chart.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{chart.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {renderChart(chart)}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Total Reports</span>
                </CardTitle>
                <CardDescription>
                  Custom reports created
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{customReports.length}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Available reports
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span>Scheduled Reports</span>
                </CardTitle>
                <CardDescription>
                  Automatically scheduled reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {customReports.filter(r => r.schedule !== 'manual').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Automated delivery
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Recipients</span>
                </CardTitle>
                <CardDescription>
                  Total report recipients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {customReports.reduce((sum, r) => sum + r.recipients.length, 0)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Active subscribers
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Manage and view custom reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{report.name}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {report.schedule.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created by {report.createdBy} on {report.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Category</div>
                        <div className="font-medium">{report.category}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Last Run</div>
                        <div className="font-medium">{report.lastRun.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Recipients</div>
                        <div className="font-medium">{report.recipients.length} people</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Report Library
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Builder</CardTitle>
              <CardDescription>
                Create custom reports with drag-and-drop interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Data Sources</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="font-medium">Employee Data</div>
                      <div className="text-sm text-gray-600">HR and employee information</div>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="font-medium">Sales Data</div>
                      <div className="text-sm text-gray-600">Sales and revenue metrics</div>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="font-medium">Financial Data</div>
                      <div className="text-sm text-gray-600">Financial performance metrics</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Chart Types</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-center">
                      <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Bar Chart</div>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-center">
                      <LineChart className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Line Chart</div>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-center">
                      <PieChart className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Pie Chart</div>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-center">
                      <ScatterChart className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Scatter Plot</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Filters & Options</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Date Range</div>
                      <div className="text-sm text-gray-600">Last 30 days</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Department</div>
                      <div className="text-sm text-gray-600">All departments</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Metrics</div>
                      <div className="text-sm text-gray-600">Revenue, Profit, Growth</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Drag and drop to build your report</h3>
                <p className="text-gray-600 mb-4">
                  Select data sources, choose chart types, and configure filters to create custom reports
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Building
                </Button>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
        <Button variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print Reports
        </Button>
        <Button>
          <Share2 className="h-4 w-4 mr-2" />
          Share Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AdvancedReporting; 