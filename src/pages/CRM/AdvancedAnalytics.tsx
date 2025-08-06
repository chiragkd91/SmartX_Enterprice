/**
 * Advanced Analytics & Reporting - Comprehensive CRM analytics platform
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Activity,
  Target,
  DollarSign,
  Users,
  Calendar,
  Eye,
  Download,
  Filter,
  Search,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Award,
  Trophy,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Legend
} from 'recharts';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  target: number;
  period: string;
  trend: number[];
}

interface PredictiveInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  action: string;
  timestamp: string;
}

interface ExecutiveReport {
  id: string;
  title: string;
  type: 'sales' | 'revenue' | 'performance' | 'forecast';
  data: any[];
  insights: string[];
  recommendations: string[];
  lastUpdated: string;
}

const mockAnalyticsMetrics: AnalyticsMetric[] = [
  {
    id: '1',
    name: 'Total Revenue',
    value: 2845000,
    change: 12.5,
    changeType: 'increase',
    target: 3000000,
    period: 'Q4 2024',
    trend: [2500000, 2650000, 2750000, 2845000]
  },
  {
    id: '2',
    name: 'Lead Conversion Rate',
    value: 23.4,
    change: -2.1,
    changeType: 'decrease',
    target: 25.0,
    period: 'Q4 2024',
    trend: [25.5, 24.8, 24.1, 23.4]
  },
  {
    id: '3',
    name: 'Average Deal Size',
    value: 45000,
    change: 8.7,
    changeType: 'increase',
    target: 50000,
    period: 'Q4 2024',
    trend: [41000, 42000, 43500, 45000]
  },
  {
    id: '4',
    name: 'Sales Cycle Length',
    value: 45,
    change: -5.2,
    changeType: 'increase',
    target: 40,
    period: 'Q4 2024',
    trend: [50, 48, 46, 45]
  }
];

const mockPredictiveInsights: PredictiveInsight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'High-Value Lead Opportunity',
    description: 'Lead "TechCorp Solutions" shows 85% probability of conversion with estimated value of $150K',
    confidence: 85,
    impact: 'high',
    action: 'Prioritize follow-up within 24 hours',
    timestamp: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    type: 'risk',
    title: 'Deal Risk Alert',
    description: 'Opportunity "Enterprise Software License" at risk of delay due to budget constraints',
    confidence: 78,
    impact: 'medium',
    action: 'Schedule stakeholder meeting to address concerns',
    timestamp: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    type: 'trend',
    title: 'Market Trend Analysis',
    description: 'Increasing demand for cloud solutions in Q1 2025 - 23% growth expected',
    confidence: 92,
    impact: 'high',
    action: 'Adjust sales strategy to focus on cloud offerings',
    timestamp: '2024-01-20T08:45:00Z'
  }
];

const salesData = [
  { month: 'Jan', revenue: 450000, leads: 120, conversions: 28, deals: 15 },
  { month: 'Feb', revenue: 520000, leads: 135, conversions: 32, deals: 18 },
  { month: 'Mar', revenue: 480000, leads: 110, conversions: 26, deals: 14 },
  { month: 'Apr', revenue: 610000, leads: 150, conversions: 35, deals: 20 },
  { month: 'May', revenue: 580000, leads: 140, conversions: 33, deals: 19 },
  { month: 'Jun', revenue: 720000, leads: 180, conversions: 42, deals: 24 }
];

const leadSourceData = [
  { source: 'Website', leads: 45, conversions: 12, revenue: 180000 },
  { source: 'Social Media', leads: 32, conversions: 8, revenue: 120000 },
  { source: 'Email Campaign', leads: 28, conversions: 7, revenue: 105000 },
  { source: 'Referrals', leads: 25, conversions: 6, revenue: 90000 },
  { source: 'Events', leads: 20, conversions: 5, revenue: 75000 }
];

const performanceData = [
  { rep: 'John Smith', quota: 500000, actual: 485000, deals: 12, conversion: 24.5 },
  { rep: 'Sarah Johnson', quota: 500000, actual: 520000, deals: 14, conversion: 26.8 },
  { rep: 'Mike Davis', quota: 500000, actual: 460000, deals: 11, conversion: 22.1 },
  { rep: 'Lisa Wilson', quota: 500000, actual: 535000, deals: 15, conversion: 28.2 },
  { rep: 'Tom Brown', quota: 500000, actual: 475000, deals: 13, conversion: 25.3 }
];

export default function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('q4');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'decrease': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-green-600 bg-green-50';
      case 'risk': return 'text-red-600 bg-red-50';
      case 'trend': return 'text-blue-600 bg-blue-50';
      case 'recommendation': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Predictive insights, executive reporting, and real-time analytics</p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q4">Q4 2024</SelectItem>
              <SelectItem value="q3">Q3 2024</SelectItem>
              <SelectItem value="q2">Q2 2024</SelectItem>
              <SelectItem value="q1">Q1 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockAnalyticsMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getChangeIcon(metric.changeType)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.name.includes('Revenue') || metric.name.includes('Deal') 
                  ? formatCurrency(metric.value)
                  : metric.name.includes('Rate') || metric.name.includes('Length')
                  ? formatPercentage(metric.value)
                  : metric.value.toLocaleString()
                }
              </div>
              <div className={`flex items-center text-sm ${getChangeColor(metric.changeType)}`}>
                {metric.change > 0 ? '+' : ''}{formatPercentage(metric.change)} vs last period
              </div>
              <div className="mt-2">
                <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">Target: {formatCurrency(metric.target)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lead Source Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Source Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="revenue"
                      label={({ source, revenue }) => `${source}: ${formatCurrency(revenue)}`}
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sales Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="leads" fill="#3B82F6" name="Leads" />
                  <Bar yAxisId="left" dataKey="conversions" fill="#10B981" name="Conversions" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#EF4444" name="Revenue" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Tab */}
        <TabsContent value="predictive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Predictive Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPredictiveInsights.map((insight) => (
                    <div key={insight.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getInsightColor(insight.type)}>
                              {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                            </Badge>
                            <Badge variant="outline">{insight.confidence}% confidence</Badge>
                          </div>
                          <h4 className="font-semibold mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                          <p className="text-sm font-medium text-blue-600">{insight.action}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(insight.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Predictive Models */}
            <Card>
              <CardHeader>
                <CardTitle>Predictive Models</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Lead Scoring Model</h4>
                      <Badge className="text-green-600 bg-green-50">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">AI-powered lead scoring with 92% accuracy</p>
                    <Progress value={92} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Model Accuracy: 92%</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Revenue Forecasting</h4>
                      <Badge className="text-green-600 bg-green-50">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Predictive revenue forecasting with 88% accuracy</p>
                    <Progress value={88} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Model Accuracy: 88%</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Churn Prediction</h4>
                      <Badge className="text-yellow-600 bg-yellow-50">Training</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Customer churn prediction model in training</p>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Training Progress: 65%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rep" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'quota' || name === 'actual' ? formatCurrency(Number(value)) : value,
                    name === 'quota' ? 'Quota' : name === 'actual' ? 'Actual' : name === 'deals' ? 'Deals' : 'Conversion %'
                  ]} />
                  <Legend />
                  <Bar dataKey="quota" fill="#E5E7EB" name="Quota" />
                  <Bar dataKey="actual" fill="#3B82F6" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">$2.85M</div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+12.5%</div>
                    <p className="text-sm text-gray-600">Growth Rate</p>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">156</div>
                    <p className="text-sm text-gray-600">Total Deals</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">23.4%</div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">835</div>
                    <p className="text-sm text-gray-600">Total Leads</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">45</div>
                    <p className="text-sm text-gray-600">Avg. Deal Size (K)</p>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { metric: 'Demand', value: 85 },
                    { metric: 'Competition', value: 65 },
                    { metric: 'Pricing', value: 75 },
                    { metric: 'Technology', value: 90 },
                    { metric: 'Regulation', value: 70 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Top Performing Segments</h4>
                    <p className="text-sm text-blue-700">Enterprise customers show 35% higher lifetime value</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Growth Opportunities</h4>
                    <p className="text-sm text-green-700">SaaS market expected to grow 23% in Q1 2025</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Risk Factors</h4>
                    <p className="text-sm text-yellow-700">Economic uncertainty may impact Q1 sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 