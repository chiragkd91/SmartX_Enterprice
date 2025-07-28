/**
 * Real-time KPI Dashboard - Live Metrics and Alerts
 * Advanced monitoring with real-time updates and predictive insights
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  Zap,
  RefreshCw,
  Bell,
  Settings,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  BarChart3,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Globe,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Circle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from 'recharts';

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
  chartData: any[];
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

const SAMPLE_KPI_DATA: KPIMetric[] = [
  {
    id: 'revenue',
    name: 'Total Revenue',
    value: 112000000,
    target: 100000000,
    unit: '₹',
    trend: 'up',
    change: 18.5,
    status: 'good',
    lastUpdated: new Date().toISOString(),
    chartData: [
      { time: '09:00', value: 110000000 },
      { time: '10:00', value: 111000000 },
      { time: '11:00', value: 111500000 },
      { time: '12:00', value: 112000000 }
    ]
  },
  {
    id: 'customers',
    name: 'Active Customers',
    value: 686,
    target: 700,
    unit: '',
    trend: 'up',
    change: 12.5,
    status: 'good',
    lastUpdated: new Date().toISOString(),
    chartData: [
      { time: '09:00', value: 680 },
      { time: '10:00', value: 682 },
      { time: '11:00', value: 684 },
      { time: '12:00', value: 686 }
    ]
  },
  {
    id: 'conversion',
    name: 'Conversion Rate',
    value: 24.6,
    target: 25.0,
    unit: '%',
    trend: 'down',
    change: -2.1,
    status: 'warning',
    lastUpdated: new Date().toISOString(),
    chartData: [
      { time: '09:00', value: 25.2 },
      { time: '10:00', value: 25.0 },
      { time: '11:00', value: 24.8 },
      { time: '12:00', value: 24.6 }
    ]
  },
  {
    id: 'orders',
    name: 'Orders Today',
    value: 847,
    target: 900,
    unit: '',
    trend: 'up',
    change: 8.3,
    status: 'good',
    lastUpdated: new Date().toISOString(),
    chartData: [
      { time: '09:00', value: 820 },
      { time: '10:00', value: 830 },
      { time: '11:00', value: 840 },
      { time: '12:00', value: 847 }
    ]
  }
];

const SAMPLE_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Conversion Rate Below Target',
    message: 'Current conversion rate (24.6%) is below target (25.0%). Consider reviewing marketing campaigns.',
    timestamp: new Date().toISOString(),
    acknowledged: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Revenue Target Achieved',
    message: 'Monthly revenue target has been exceeded by 12%. Great performance!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    acknowledged: true
  },
  {
    id: '3',
    type: 'info',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance will occur tonight at 2:00 AM. Expected downtime: 30 minutes.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    acknowledged: false
  }
];

export default function RealTimeKPIDashboard() {
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>(SAMPLE_KPI_DATA);
  const [alerts, setAlerts] = useState<Alert[]>(SAMPLE_ALERTS);
  const [isLive, setIsLive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState<KPIMetric | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const intervalRef = useRef<NodeJS.Timeout>();

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    intervalRef.current = setInterval(() => {
      setKpiMetrics(prev => prev.map(metric => {
        const randomChange = (Math.random() - 0.5) * 0.02; // ±1% change
        const newValue = metric.value * (1 + randomChange);
        
        return {
          ...metric,
          value: Math.round(newValue),
          change: parseFloat((randomChange * 100).toFixed(1)),
          trend: randomChange > 0 ? 'up' : randomChange < 0 ? 'down' : 'stable',
          status: newValue >= metric.target ? 'good' : newValue >= metric.target * 0.9 ? 'warning' : 'critical',
          lastUpdated: new Date().toISOString(),
          chartData: [
            ...metric.chartData.slice(1),
            { time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), value: Math.round(newValue) }
          ]
        };
      }));
      
      setLastUpdate(new Date());
    }, refreshInterval * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Circle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '₹') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return `${value.toLocaleString()}${unit}`;
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Real-time KPI Dashboard</h1>
          <p className="text-muted-foreground">
            Live monitoring of key business metrics
            {isLive && (
              <span className="ml-2 inline-flex items-center text-green-600">
                <Activity className="w-4 h-4 mr-1 animate-pulse" />
                Live
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsLive(!isLive)}
            className={isLive ? 'bg-green-50 text-green-700' : ''}
          >
            {isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isLive ? 'Pause' : 'Start'} Live Updates
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Manual Refresh
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <span>Refresh interval: {refreshInterval}s</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Active alerts: {alerts.filter(a => !a.acknowledged).length}</span>
          <Bell className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Metrics */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpiMetrics.map(metric => (
              <Card key={metric.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">Target: {formatValue(metric.target, metric.unit)}</p>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">
                        {formatValue(metric.value, metric.unit)}
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                    
                    <Progress 
                      value={getProgressPercentage(metric.value, metric.target)} 
                      className="h-2"
                    />
                    
                    <div className="h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metric.chartData}>
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={metric.status === 'good' ? '#10B981' : metric.status === 'warning' ? '#F59E0B' : '#EF4444'}
                            fill={metric.status === 'good' ? '#10B981' : metric.status === 'warning' ? '#F59E0B' : '#EF4444'}
                            fillOpacity={0.1}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Live Alerts
                <Badge variant="secondary">{alerts.filter(a => !a.acknowledged).length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <Alert key={alert.id} className={alert.acknowledged ? 'opacity-60' : ''}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {!alert.acknowledged && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                Set Targets
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Zap className="w-4 h-4 mr-2" />
                Configure Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {kpiMetrics.filter(m => m.status === 'good').length}
              </div>
              <div className="text-sm text-muted-foreground">On Target</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {kpiMetrics.filter(m => m.status === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Warning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {kpiMetrics.filter(m => m.status === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(kpiMetrics.reduce((sum, m) => sum + getProgressPercentage(m.value, m.target), 0) / kpiMetrics.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 