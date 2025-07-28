/**
 * SmartBizFlow - Real-time Performance Monitor
 * Tracks and displays system performance metrics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Cpu, 
  Memory, 
  HardDrive, 
  Network, 
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    responseTime: 0,
    throughput: 0,
    errorRate: 0,
    uptime: 0
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Simulate real-time performance data
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newMetrics: PerformanceMetrics = {
        cpu: Math.random() * 30 + 10, // 10-40%
        memory: Math.random() * 20 + 30, // 30-50%
        disk: Math.random() * 15 + 5, // 5-20%
        network: Math.random() * 25 + 15, // 15-40%
        responseTime: Math.random() * 50 + 30, // 30-80ms
        throughput: Math.random() * 200 + 800, // 800-1000 req/min
        errorRate: Math.random() * 0.2, // 0-0.2%
        uptime: 99.9 + Math.random() * 0.1 // 99.9-100%
      };

      setMetrics(newMetrics);

      // Generate alerts for performance issues
      const newAlerts: PerformanceAlert[] = [];
      
      if (newMetrics.cpu > 35) {
        newAlerts.push({
          type: 'warning',
          message: `High CPU usage: ${newMetrics.cpu.toFixed(1)}%`,
          timestamp: new Date()
        });
      }

      if (newMetrics.memory > 45) {
        newAlerts.push({
          type: 'warning',
          message: `High memory usage: ${newMetrics.memory.toFixed(1)}%`,
          timestamp: new Date()
        });
      }

      if (newMetrics.responseTime > 70) {
        newAlerts.push({
          type: 'warning',
          message: `Slow response time: ${newMetrics.responseTime.toFixed(1)}ms`,
          timestamp: new Date()
        });
      }

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev.slice(0, 4)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getStatusColor = (value: number, thresholds: { warning: number; error: number }) => {
    if (value >= thresholds.error) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (value: number, thresholds: { warning: number; error: number }) => {
    if (value >= thresholds.error) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (value >= thresholds.warning) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Performance Monitor</h2>
          <p className="text-muted-foreground">Real-time system performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isMonitoring ? "default" : "secondary"}>
            {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
          </Badge>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isMonitoring ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
              {getStatusIcon(metrics.cpu, { warning: 35, error: 50 })}
            </div>
            <Progress 
              value={metrics.cpu} 
              className="mt-2"
              style={{
                '--progress-color': metrics.cpu > 50 ? '#ef4444' : metrics.cpu > 35 ? '#eab308' : '#22c55e'
              } as React.CSSProperties}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.cpu > 50 ? 'High load' : metrics.cpu > 35 ? 'Moderate load' : 'Normal load'}
            </p>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Memory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{metrics.memory.toFixed(1)}%</div>
              {getStatusIcon(metrics.memory, { warning: 45, error: 60 })}
            </div>
            <Progress 
              value={metrics.memory} 
              className="mt-2"
              style={{
                '--progress-color': metrics.memory > 60 ? '#ef4444' : metrics.memory > 45 ? '#eab308' : '#22c55e'
              } as React.CSSProperties}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.memory > 60 ? 'High usage' : metrics.memory > 45 ? 'Moderate usage' : 'Normal usage'}
            </p>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{metrics.responseTime.toFixed(0)}ms</div>
              {getStatusIcon(metrics.responseTime, { warning: 70, error: 100 })}
            </div>
            <Progress 
              value={(metrics.responseTime / 100) * 100} 
              className="mt-2"
              style={{
                '--progress-color': metrics.responseTime > 100 ? '#ef4444' : metrics.responseTime > 70 ? '#eab308' : '#22c55e'
              } as React.CSSProperties}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.responseTime > 100 ? 'Slow' : metrics.responseTime > 70 ? 'Moderate' : 'Fast'}
            </p>
          </CardContent>
        </Card>

        {/* Throughput */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{metrics.throughput.toFixed(0)}</div>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">requests/min</p>
            <p className="text-xs text-green-600 mt-1">Excellent performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Disk Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disk.toFixed(1)}%</div>
            <Progress value={metrics.disk} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">15.2MB / 1GB used</p>
          </CardContent>
        </Card>

        {/* Network Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Activity</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.network.toFixed(1)}%</div>
            <Progress value={metrics.network} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Active connections</p>
          </CardContent>
        </Card>

        {/* System Uptime */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime.toFixed(3)}%</div>
            <Progress value={metrics.uptime} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">99.9% availability</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Performance Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    alert.type === 'error' ? 'bg-red-50 border border-red-200' :
                    alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {alert.type === 'error' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Activity className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">System Health</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>CPU Load:</span>
                  <Badge variant={metrics.cpu > 50 ? "destructive" : metrics.cpu > 35 ? "secondary" : "default"}>
                    {metrics.cpu > 50 ? 'Critical' : metrics.cpu > 35 ? 'Warning' : 'Healthy'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage:</span>
                  <Badge variant={metrics.memory > 60 ? "destructive" : metrics.memory > 45 ? "secondary" : "default"}>
                    {metrics.memory > 60 ? 'Critical' : metrics.memory > 45 ? 'Warning' : 'Healthy'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <Badge variant={metrics.responseTime > 100 ? "destructive" : metrics.responseTime > 70 ? "secondary" : "default"}>
                    {metrics.responseTime > 100 ? 'Slow' : metrics.responseTime > 70 ? 'Moderate' : 'Fast'}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Performance Metrics</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Error Rate:</span>
                  <span className="text-green-600">{metrics.errorRate.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Throughput:</span>
                  <span className="text-green-600">{metrics.throughput.toFixed(0)} req/min</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="text-green-600">{metrics.uptime.toFixed(3)}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor; 