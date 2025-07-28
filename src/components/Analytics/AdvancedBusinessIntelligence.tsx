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
  AreaChart, Area, ScatterChart, Scatter, ComposedChart
} from 'recharts';
import { 
  Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Zap, Target, Activity, BarChart3, PieChart as PieChartIcon,
  LineChart as LineChartIcon, ScatterChart as ScatterChartIcon,
  Download, RefreshCw, Eye, Settings, Bell, Shield
} from 'lucide-react';

interface MLModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering' | 'forecasting';
  accuracy: number;
  status: 'active' | 'training' | 'deployed' | 'monitoring';
  lastUpdated: Date;
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
  };
  features: string[];
  predictions: number;
}

interface TrendForecast {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
  factors: string[];
  impact: 'high' | 'medium' | 'low';
}

interface AnomalyDetection {
  id: string;
  metric: string;
  timestamp: Date;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive';
  description: string;
  recommendations: string[];
}

interface AutomatedInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: Date;
  actionable: boolean;
  actions: string[];
}

const AdvancedBusinessIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ml-models');
  const [loading, setLoading] = useState(false);
  const [mlModels, setMlModels] = useState<MLModel[]>([]);
  const [trendForecasts, setTrendForecasts] = useState<TrendForecast[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [insights, setInsights] = useState<AutomatedInsight[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMlModels([
        {
          id: 'ml-001',
          name: 'Employee Turnover Predictor',
          type: 'classification',
          accuracy: 94.2,
          status: 'active',
          lastUpdated: new Date('2024-01-15'),
          performance: {
            precision: 0.91,
            recall: 0.89,
            f1Score: 0.90,
            auc: 0.94
          },
          features: ['engagement_score', 'performance_rating', 'tenure', 'salary_ratio'],
          predictions: 1247
        },
        {
          id: 'ml-002',
          name: 'Sales Revenue Forecaster',
          type: 'forecasting',
          accuracy: 87.5,
          status: 'deployed',
          lastUpdated: new Date('2024-01-10'),
          performance: {
            precision: 0.85,
            recall: 0.88,
            f1Score: 0.86,
            auc: 0.87
          },
          features: ['historical_sales', 'seasonality', 'marketing_spend', 'competition'],
          predictions: 892
        },
        {
          id: 'ml-003',
          name: 'Customer Churn Analyzer',
          type: 'classification',
          accuracy: 91.8,
          status: 'monitoring',
          lastUpdated: new Date('2024-01-12'),
          performance: {
            precision: 0.89,
            recall: 0.93,
            f1Score: 0.91,
            auc: 0.92
          },
          features: ['usage_frequency', 'support_tickets', 'payment_history', 'satisfaction'],
          predictions: 2156
        }
      ]);

      setTrendForecasts([
        {
          metric: 'Employee Retention Rate',
          currentValue: 87.5,
          predictedValue: 89.2,
          confidence: 92,
          trend: 'up',
          timeframe: 'Next 3 months',
          factors: ['Improved engagement programs', 'Better compensation', 'Career development'],
          impact: 'high'
        },
        {
          metric: 'Sales Conversion Rate',
          currentValue: 23.4,
          predictedValue: 26.8,
          confidence: 88,
          trend: 'up',
          timeframe: 'Next 2 months',
          factors: ['Enhanced sales training', 'New product launch', 'Market expansion'],
          impact: 'high'
        },
        {
          metric: 'Customer Satisfaction Score',
          currentValue: 4.2,
          predictedValue: 4.1,
          confidence: 85,
          trend: 'down',
          timeframe: 'Next month',
          factors: ['Service delays', 'Product issues', 'Competition pressure'],
          impact: 'medium'
        }
      ]);

      setAnomalies([
        {
          id: 'anom-001',
          metric: 'System Response Time',
          timestamp: new Date('2024-01-20T10:30:00'),
          value: 2.8,
          expectedValue: 0.8,
          deviation: 250,
          severity: 'critical',
          status: 'investigating',
          description: 'Unusual spike in system response time affecting user experience',
          recommendations: ['Check server load', 'Review recent deployments', 'Monitor database performance']
        },
        {
          id: 'anom-002',
          metric: 'Employee Absenteeism',
          timestamp: new Date('2024-01-19T09:15:00'),
          value: 15.2,
          expectedValue: 8.5,
          deviation: 79,
          severity: 'high',
          status: 'detected',
          description: 'Significant increase in employee absenteeism rate',
          recommendations: ['Investigate health trends', 'Review work conditions', 'Check for burnout indicators']
        },
        {
          id: 'anom-003',
          metric: 'Customer Support Tickets',
          timestamp: new Date('2024-01-18T14:45:00'),
          value: 156,
          expectedValue: 85,
          deviation: 84,
          severity: 'medium',
          status: 'resolved',
          description: 'Unusual surge in customer support tickets',
          recommendations: ['Analyze ticket patterns', 'Check for product issues', 'Review recent changes']
        }
      ]);

      setInsights([
        {
          id: 'insight-001',
          type: 'correlation',
          title: 'Strong Correlation: Employee Engagement & Productivity',
          description: 'Analysis reveals 0.87 correlation between engagement scores and productivity metrics',
          confidence: 94,
          impact: 'high',
          category: 'HR Analytics',
          timestamp: new Date('2024-01-20T08:00:00'),
          actionable: true,
          actions: ['Implement engagement surveys', 'Develop retention strategies', 'Create feedback loops']
        },
        {
          id: 'insight-002',
          type: 'trend',
          title: 'Declining Customer Satisfaction Trend',
          description: 'Customer satisfaction has decreased by 12% over the last quarter',
          confidence: 89,
          impact: 'high',
          category: 'Customer Analytics',
          timestamp: new Date('2024-01-19T16:30:00'),
          actionable: true,
          actions: ['Review customer feedback', 'Analyze support tickets', 'Improve product quality']
        },
        {
          id: 'insight-003',
          type: 'prediction',
          title: 'Revenue Growth Prediction: +18% Next Quarter',
          description: 'ML model predicts 18% revenue growth based on current trends and market conditions',
          confidence: 87,
          impact: 'high',
          category: 'Financial Analytics',
          timestamp: new Date('2024-01-18T12:15:00'),
          actionable: true,
          actions: ['Scale operations', 'Increase marketing spend', 'Prepare for growth']
        }
      ]);

      setLoading(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'deployed': return 'bg-purple-100 text-purple-800';
      case 'monitoring': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'anomaly': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'correlation': return <BarChart3 className="h-4 w-4 text-purple-600" />;
      case 'prediction': return <Brain className="h-4 w-4 text-green-600" />;
      case 'recommendation': return <Target className="h-4 w-4 text-orange-600" />;
      default: return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Business Intelligence</h1>
          <p className="text-gray-600 mt-2">
            AI-powered analytics, machine learning models, and automated insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Brain className="h-4 w-4" />
            <span>ML Powered</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <span>Real-time</span>
          </Badge>
        </div>
      </div>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          This system uses advanced machine learning models to provide predictive analytics, 
          anomaly detection, and automated insights. All models are continuously monitored and updated.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ml-models" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>ML Models</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trend Forecasts</span>
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Anomaly Detection</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Automated Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ml-models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Active Models</span>
                </CardTitle>
                <CardDescription>
                  Currently deployed ML models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {mlModels.filter(m => m.status === 'active' || m.status === 'deployed').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Models in production
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Avg Accuracy</span>
                </CardTitle>
                <CardDescription>
                  Average model accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {mlModels.length > 0 ? (mlModels.reduce((sum, m) => sum + m.accuracy, 0) / mlModels.length).toFixed(1) : 0}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Across all models
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>Total Predictions</span>
                </CardTitle>
                <CardDescription>
                  Predictions made today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {mlModels.reduce((sum, m) => sum + m.predictions, 0)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Real-time predictions
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Machine Learning Models</CardTitle>
              <CardDescription>
                Performance and status of deployed ML models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mlModels.map((model) => (
                  <div key={model.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{model.name}</h3>
                            <Badge className={getStatusColor(model.status)}>
                              {model.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Type: {model.type} | Last Updated: {model.lastUpdated.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {model.accuracy}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Accuracy
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Precision</div>
                        <div className="text-lg font-semibold">{(model.performance.precision * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Recall</div>
                        <div className="text-lg font-semibold">{(model.performance.recall * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">F1 Score</div>
                        <div className="text-lg font-semibold">{(model.performance.f1Score * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">AUC</div>
                        <div className="text-lg font-semibold">{(model.performance.auc * 100).toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Features Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {model.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Today's Predictions</h4>
                        <div className="text-2xl font-bold text-blue-600">{model.predictions}</div>
                        <p className="text-sm text-gray-600">Predictions made</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Positive Trends</span>
                </CardTitle>
                <CardDescription>
                  Metrics showing improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {trendForecasts.filter(t => t.trend === 'up').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Improving metrics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <span>Negative Trends</span>
                </CardTitle>
                <CardDescription>
                  Metrics requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {trendForecasts.filter(t => t.trend === 'down').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Declining metrics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Avg Confidence</span>
                </CardTitle>
                <CardDescription>
                  Prediction confidence level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {trendForecasts.length > 0 ? (trendForecasts.reduce((sum, t) => sum + t.confidence, 0) / trendForecasts.length).toFixed(1) : 0}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Model confidence
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trend Forecasting</CardTitle>
              <CardDescription>
                AI-powered trend predictions and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trendForecasts.map((forecast, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{forecast.metric}</h3>
                            {getTrendIcon(forecast.trend)}
                            <Badge className={getImpactColor(forecast.impact)}>
                              {forecast.impact.toUpperCase()} IMPACT
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Timeframe: {forecast.timeframe} | Confidence: {forecast.confidence}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {forecast.predictedValue}
                        </div>
                        <div className="text-sm text-gray-600">
                          Predicted Value
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Current Value</span>
                          <span>{forecast.currentValue}</span>
                        </div>
                        <Progress value={forecast.currentValue} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Predicted Value</span>
                          <span>{forecast.predictedValue}</span>
                        </div>
                        <Progress 
                          value={forecast.predictedValue} 
                          className="h-2"
                          style={{
                            backgroundColor: forecast.trend === 'up' ? '#dcfce7' : '#fef2f2'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Contributing Factors</h4>
                      <div className="flex flex-wrap gap-2">
                        {forecast.factors.map((factor, factorIndex) => (
                          <Badge key={factorIndex} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Critical Anomalies</span>
                </CardTitle>
                <CardDescription>
                  High severity anomalies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {anomalies.filter(a => a.severity === 'critical').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <span>Active Investigations</span>
                </CardTitle>
                <CardDescription>
                  Anomalies being investigated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {anomalies.filter(a => a.status === 'investigating').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Under investigation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Resolved Today</span>
                </CardTitle>
                <CardDescription>
                  Anomalies resolved today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {anomalies.filter(a => a.status === 'resolved').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Successfully resolved
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>
                AI-powered anomaly detection and alerting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {anomalies.map((anomaly) => (
                  <div key={anomaly.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{anomaly.metric}</h3>
                            <Badge className={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {anomaly.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Detected: {anomaly.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {anomaly.deviation}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Deviation
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Actual Value</div>
                        <div className="text-lg font-semibold">{anomaly.value}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Expected Value</div>
                        <div className="text-lg font-semibold">{anomaly.expectedValue}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Deviation</div>
                        <div className="text-lg font-semibold text-red-600">{anomaly.deviation}%</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Description</h4>
                      <p className="text-sm text-gray-700">{anomaly.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                      <div className="space-y-1">
                        {anomaly.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <Shield className="h-3 w-3 text-blue-600" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span>Total Insights</span>
                </CardTitle>
                <CardDescription>
                  Automated insights generated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{insights.length}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Today's insights
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Actionable Insights</span>
                </CardTitle>
                <CardDescription>
                  Insights requiring action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {insights.filter(i => i.actionable).length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Avg Confidence</span>
                </CardTitle>
                <CardDescription>
                  Average insight confidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {insights.length > 0 ? (insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length).toFixed(1) : 0}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  AI confidence level
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Automated Insights</CardTitle>
              <CardDescription>
                AI-generated insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getInsightIcon(insight.type)}
                            <h3 className="font-semibold">{insight.title}</h3>
                            <Badge className={getImpactColor(insight.impact)}>
                              {insight.impact.toUpperCase()} IMPACT
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                ACTIONABLE
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Category: {insight.category} | Confidence: {insight.confidence}% | 
                            Generated: {insight.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {insight.confidence}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Confidence
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Description</h4>
                      <p className="text-sm text-gray-700">{insight.description}</p>
                    </div>

                    {insight.actionable && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Recommended Actions</h4>
                        <div className="space-y-1">
                          {insight.actions.map((action, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Target className="h-3 w-3 text-green-600" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Model Settings
        </Button>
        <Button>
          <Brain className="h-4 w-4 mr-2" />
          Generate Insights
        </Button>
      </div>
    </div>
  );
};

export default AdvancedBusinessIntelligence; 