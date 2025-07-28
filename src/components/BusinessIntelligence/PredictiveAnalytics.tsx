/**
 * Predictive Analytics - AI-powered Forecasting and Insights
 * Advanced machine learning models for business predictions
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Zap,
  RefreshCw,
  Download,
  Share2,
  Settings,
  Eye,
  BrainCircuit,
  Lightbulb,
  Calculator,
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
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts';

interface PredictionModel {
  id: string;
  name: string;
  type: 'revenue' | 'customer' | 'inventory' | 'churn' | 'demand';
  accuracy: number;
  confidence: number;
  lastUpdated: string;
  status: 'active' | 'training' | 'error';
  predictions: Prediction[];
}

interface Prediction {
  date: string;
  actual?: number;
  predicted: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
}

interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  actionable: boolean;
}

const SAMPLE_PREDICTIONS: PredictionModel[] = [
  {
    id: 'revenue-forecast',
    name: 'Revenue Forecasting Model',
    type: 'revenue',
    accuracy: 94.2,
    confidence: 89.5,
    lastUpdated: new Date().toISOString(),
    status: 'active',
    predictions: [
      { date: '2024-01', actual: 4500000, predicted: 4550000, confidence: 92, upperBound: 4850000, lowerBound: 4250000 },
      { date: '2024-02', actual: 5200000, predicted: 5180000, confidence: 91, upperBound: 5480000, lowerBound: 4880000 },
      { date: '2024-03', actual: 4800000, predicted: 4820000, confidence: 90, upperBound: 5120000, lowerBound: 4520000 },
      { date: '2024-04', actual: 6100000, predicted: 6050000, confidence: 89, upperBound: 6350000, lowerBound: 5750000 },
      { date: '2024-05', actual: 5900000, predicted: 5950000, confidence: 88, upperBound: 6250000, lowerBound: 5650000 },
      { date: '2024-06', actual: 6800000, predicted: 6850000, confidence: 87, upperBound: 7150000, lowerBound: 6550000 },
      { date: '2024-07', predicted: 7200000, confidence: 86, upperBound: 7500000, lowerBound: 6900000 },
      { date: '2024-08', predicted: 7450000, confidence: 85, upperBound: 7750000, lowerBound: 7150000 },
      { date: '2024-09', predicted: 7800000, confidence: 84, upperBound: 8100000, lowerBound: 7500000 },
      { date: '2024-10', predicted: 8100000, confidence: 83, upperBound: 8400000, lowerBound: 7800000 },
      { date: '2024-11', predicted: 8400000, confidence: 82, upperBound: 8700000, lowerBound: 8100000 },
      { date: '2024-12', predicted: 8700000, confidence: 81, upperBound: 9000000, lowerBound: 8400000 }
    ]
  },
  {
    id: 'customer-churn',
    name: 'Customer Churn Prediction',
    type: 'churn',
    accuracy: 87.3,
    confidence: 82.1,
    lastUpdated: new Date().toISOString(),
    status: 'active',
    predictions: [
      { date: '2024-01', actual: 5.2, predicted: 5.1, confidence: 85, upperBound: 6.1, lowerBound: 4.1 },
      { date: '2024-02', actual: 4.8, predicted: 4.9, confidence: 84, upperBound: 5.9, lowerBound: 3.9 },
      { date: '2024-03', actual: 5.5, predicted: 5.3, confidence: 83, upperBound: 6.3, lowerBound: 4.3 },
      { date: '2024-04', actual: 4.2, predicted: 4.4, confidence: 82, upperBound: 5.4, lowerBound: 3.4 },
      { date: '2024-05', actual: 4.9, predicted: 4.7, confidence: 81, upperBound: 5.7, lowerBound: 3.7 },
      { date: '2024-06', actual: 3.8, predicted: 4.1, confidence: 80, upperBound: 5.1, lowerBound: 3.1 },
      { date: '2024-07', predicted: 4.3, confidence: 79, upperBound: 5.3, lowerBound: 3.3 },
      { date: '2024-08', predicted: 4.6, confidence: 78, upperBound: 5.6, lowerBound: 3.6 },
      { date: '2024-09', predicted: 4.9, confidence: 77, upperBound: 5.9, lowerBound: 3.9 },
      { date: '2024-10', predicted: 5.2, confidence: 76, upperBound: 6.2, lowerBound: 4.2 },
      { date: '2024-11', predicted: 5.5, confidence: 75, upperBound: 6.5, lowerBound: 4.5 },
      { date: '2024-12', predicted: 5.8, confidence: 74, upperBound: 6.8, lowerBound: 4.8 }
    ]
  }
];

const SAMPLE_INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Revenue Growth Opportunity',
    description: 'West India region shows 25% growth potential based on market analysis and customer behavior patterns.',
    confidence: 89.5,
    impact: 'high',
    timestamp: new Date().toISOString(),
    actionable: true
  },
  {
    id: '2',
    type: 'risk',
    title: 'Customer Churn Risk',
    description: '8.5% of customers show high churn probability in next 30 days. Focus on retention strategies.',
    confidence: 87.2,
    impact: 'high',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actionable: true
  },
  {
    id: '3',
    type: 'trend',
    title: 'Seasonal Demand Pattern',
    description: 'Q4 typically shows 15% higher demand. Consider inventory planning and marketing campaigns.',
    confidence: 92.1,
    impact: 'medium',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    actionable: true
  },
  {
    id: '4',
    type: 'anomaly',
    title: 'Unusual Sales Spike',
    description: 'Product category "Cloud Services" shows 40% increase vs expected 15%. Investigate cause.',
    confidence: 78.9,
    impact: 'medium',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    actionable: false
  }
];

export default function PredictiveAnalytics() {
  const [selectedModel, setSelectedModel] = useState<PredictionModel>(SAMPLE_PREDICTIONS[0]);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [timeHorizon, setTimeHorizon] = useState('6months');
  const [isModelTraining, setIsModelTraining] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(300);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-green-600 bg-green-50';
      case 'risk': return 'text-red-600 bg-red-50';
      case 'trend': return 'text-blue-600 bg-blue-50';
      case 'anomaly': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const trainModel = () => {
    setIsModelTraining(true);
    // Simulate model training
    setTimeout(() => {
      setIsModelTraining(false);
    }, 5000);
  };

  const renderPredictionChart = (model: PredictionModel) => {
    const data = model.predictions.map(p => ({
      date: p.date,
      actual: p.actual,
      predicted: p.predicted,
      upperBound: p.upperBound,
      lowerBound: p.lowerBound
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: any) => model.type === 'revenue' ? formatCurrency(value) : `${value}%`}
          />
          <Legend />
          
          {/* Confidence Interval */}
          <Area
            dataKey="upperBound"
            stroke="none"
            fill="#3B82F6"
            fillOpacity={0.1}
          />
          <Area
            dataKey="lowerBound"
            stroke="none"
            fill="#3B82F6"
            fillOpacity={0.1}
          />
          
          {/* Actual Values */}
          {model.type === 'revenue' ? (
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10B981"
              strokeWidth={3}
              name="Actual Revenue"
              connectNulls={false}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10B981"
              strokeWidth={3}
              name="Actual Churn Rate"
              connectNulls={false}
            />
          )}
          
          {/* Predicted Values */}
          {model.type === 'revenue' ? (
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#3B82F6"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Revenue"
            />
          ) : (
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#3B82F6"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Churn Rate"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Predictive Analytics</h1>
          <p className="text-muted-foreground">AI-powered forecasting and business insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={trainModel} disabled={isModelTraining}>
            <Brain className="w-4 h-4 mr-2" />
            {isModelTraining ? 'Training...' : 'Retrain Models'}
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Insights
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Selection and Metrics */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Models</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {SAMPLE_PREDICTIONS.map(model => (
                <div
                  key={model.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedModel.id === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedModel(model)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{model.name}</h4>
                    <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy:</span>
                      <span className="font-medium">{model.accuracy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidence:</span>
                      <span className="font-medium">{model.confidence}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Model Performance */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mean Absolute Error</span>
                    <span className="font-medium">2.3%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>R² Score</span>
                    <span className="font-medium">0.94</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Training Time</span>
                    <span className="font-medium">2.5 min</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Prediction Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedModel.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {selectedModel.confidence}% | Last updated: {new Date(selectedModel.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="12months">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderPredictionChart(selectedModel)}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_INSIGHTS.map(insight => (
              <div
                key={insight.id}
                className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge className={getImpactColor(insight.impact)}>
                    {insight.impact} impact
                  </Badge>
                </div>
                
                <p className="text-sm mb-3">{insight.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Confidence:</span>
                    <span className="font-medium">{insight.confidence}%</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {insight.actionable && (
                      <Button variant="outline" size="sm">
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Take Action
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prediction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(8700000)}
              </div>
              <div className="text-sm text-muted-foreground">Predicted Revenue (Dec 2024)</div>
              <div className="flex items-center justify-center text-sm text-green-600 mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                +28% vs current
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                5.8%
              </div>
              <div className="text-sm text-muted-foreground">Predicted Churn Rate (Dec 2024)</div>
              <div className="flex items-center justify-center text-sm text-red-600 mt-2">
                <TrendingDown className="w-4 h-4 mr-1" />
                +0.3% vs current
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                89.5%
              </div>
              <div className="text-sm text-muted-foreground">Average Model Confidence</div>
              <div className="flex items-center justify-center text-sm text-green-600 mt-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                High reliability
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 