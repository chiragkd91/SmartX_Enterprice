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
  AreaChart, Area, ScatterChart, Scatter
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, UserCheck, UserX, 
  Target, AlertTriangle, CheckCircle, Clock, DollarSign,
  Brain, BarChart3, Calendar, Zap, Shield, Activity
} from 'lucide-react';

interface TurnoverPrediction {
  employeeId: string;
  name: string;
  department: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  predictedDate?: Date;
  confidence: number;
}

interface PerformanceForecast {
  employeeId: string;
  name: string;
  currentScore: number;
  predictedScore: number;
  trend: 'improving' | 'declining' | 'stable';
  factors: string[];
  recommendations: string[];
}

interface RecruitmentAnalytics {
  source: string;
  applications: number;
  interviews: number;
  hires: number;
  costPerHire: number;
  timeToFill: number;
  qualityScore: number;
  conversionRate: number;
}

interface WorkforcePlanning {
  department: string;
  currentHeadcount: number;
  projectedHeadcount: number;
  gap: number;
  timeline: number;
  cost: number;
  priority: 'low' | 'medium' | 'high';
}

const PredictiveAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('turnover');
  const [loading, setLoading] = useState(false);
  const [turnoverData, setTurnoverData] = useState<TurnoverPrediction[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceForecast[]>([]);
  const [recruitmentData, setRecruitmentData] = useState<RecruitmentAnalytics[]>([]);
  const [workforceData, setWorkforceData] = useState<WorkforcePlanning[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTurnoverData([
        {
          employeeId: 'EMP001',
          name: 'John Smith',
          department: 'Engineering',
          riskScore: 85,
          riskLevel: 'high',
          factors: ['Low engagement', 'Recent performance decline', 'Market competition'],
          predictedDate: new Date('2024-03-15'),
          confidence: 87
        },
        {
          employeeId: 'EMP002',
          name: 'Sarah Johnson',
          department: 'Marketing',
          riskScore: 45,
          riskLevel: 'medium',
          factors: ['Work-life balance concerns'],
          confidence: 72
        },
        {
          employeeId: 'EMP003',
          name: 'Mike Davis',
          department: 'Sales',
          riskScore: 92,
          riskLevel: 'critical',
          factors: ['High stress levels', 'Competing offers', 'Role dissatisfaction'],
          predictedDate: new Date('2024-02-28'),
          confidence: 94
        }
      ]);

      setPerformanceData([
        {
          employeeId: 'EMP004',
          name: 'Lisa Chen',
          currentScore: 78,
          predictedScore: 85,
          trend: 'improving',
          factors: ['Training completion', 'Mentor support', 'Clear goals'],
          recommendations: ['Continue current development plan', 'Assign stretch projects']
        },
        {
          employeeId: 'EMP005',
          name: 'David Wilson',
          currentScore: 82,
          predictedScore: 75,
          trend: 'declining',
          factors: ['Workload stress', 'Lack of feedback', 'Role ambiguity'],
          recommendations: ['Reduce workload', 'Provide regular feedback', 'Clarify role expectations']
        }
      ]);

      setRecruitmentData([
        {
          source: 'LinkedIn',
          applications: 150,
          interviews: 25,
          hires: 8,
          costPerHire: 2500,
          timeToFill: 45,
          qualityScore: 8.5,
          conversionRate: 5.3
        },
        {
          source: 'Indeed',
          applications: 200,
          interviews: 30,
          hires: 6,
          costPerHire: 1800,
          timeToFill: 38,
          qualityScore: 7.8,
          conversionRate: 3.0
        },
        {
          source: 'Referrals',
          applications: 50,
          interviews: 15,
          hires: 12,
          costPerHire: 1200,
          timeToFill: 25,
          qualityScore: 9.2,
          conversionRate: 24.0
        }
      ]);

      setWorkforceData([
        {
          department: 'Engineering',
          currentHeadcount: 45,
          projectedHeadcount: 52,
          gap: 7,
          timeline: 6,
          cost: 840000,
          priority: 'high'
        },
        {
          department: 'Sales',
          currentHeadcount: 28,
          projectedHeadcount: 35,
          gap: 7,
          timeline: 4,
          cost: 560000,
          priority: 'high'
        },
        {
          department: 'Marketing',
          currentHeadcount: 15,
          projectedHeadcount: 18,
          gap: 3,
          timeline: 3,
          cost: 180000,
          priority: 'medium'
        }
      ]);

      setLoading(false);
    }, 2000);
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics</h1>
          <p className="text-gray-600 mt-2">
            AI-powered insights for workforce planning and decision making
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Brain className="h-4 w-4" />
            <span>AI Powered</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <span>Real-time</span>
          </Badge>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          These predictions are based on AI models trained on historical data. 
          Always validate insights with human judgment and current context.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="turnover" className="flex items-center space-x-2">
            <UserX className="h-4 w-4" />
            <span>Turnover Prediction</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Performance Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="recruitment" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Recruitment Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="workforce" className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4" />
            <span>Workforce Planning</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="turnover" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>High Risk Employees</span>
                </CardTitle>
                <CardDescription>
                  Employees with high turnover risk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {turnoverData.filter(e => e.riskLevel === 'high' || e.riskLevel === 'critical').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>Predicted Timeline</span>
                </CardTitle>
                <CardDescription>
                  Average time to potential turnover
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">45 days</div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on current trends
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Potential Savings</span>
                </CardTitle>
                <CardDescription>
                  If retention strategies are successful
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">$2.4M</div>
                <p className="text-sm text-gray-600 mt-2">
                  Annual cost savings
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Turnover Risk Analysis</CardTitle>
              <CardDescription>
                AI-powered prediction of employee turnover risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {turnoverData.map((employee) => (
                  <div key={employee.employeeId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{employee.name}</h3>
                            <Badge className={getRiskColor(employee.riskLevel)}>
                              {employee.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{employee.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {employee.riskScore}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {employee.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Risk Factors:</span>
                        <span>{employee.factors.length} factors identified</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {employee.factors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {employee.predictedDate && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            Predicted turnover date: {employee.predictedDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Improving Performance</span>
                </CardTitle>
                <CardDescription>
                  Employees showing positive trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {performanceData.filter(e => e.trend === 'improving').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Employees on track
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <span>Declining Performance</span>
                </CardTitle>
                <CardDescription>
                  Employees needing support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {performanceData.filter(e => e.trend === 'declining').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Require intervention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Average Prediction</span>
                </CardTitle>
                <CardDescription>
                  Confidence in forecasts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">89%</div>
                <p className="text-sm text-gray-600 mt-2">
                  Model accuracy
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Forecasting</CardTitle>
              <CardDescription>
                AI-powered performance predictions and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceData.map((employee) => (
                  <div key={employee.employeeId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-sm text-gray-600">Employee ID: {employee.employeeId}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(employee.trend)}
                        <span className="text-sm font-medium capitalize">{employee.trend}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Current Performance</span>
                          <span>{employee.currentScore}/100</span>
                        </div>
                        <Progress value={employee.currentScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Predicted Performance</span>
                          <span>{employee.predictedScore}/100</span>
                        </div>
                        <Progress 
                          value={employee.predictedScore} 
                          className="h-2"
                          style={{
                            backgroundColor: employee.trend === 'improving' ? '#dcfce7' : '#fef2f2'
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Contributing Factors</h4>
                        <div className="space-y-1">
                          {employee.factors.map((factor, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">AI Recommendations</h4>
                        <div className="space-y-1">
                          {employee.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Shield className="h-3 w-3 text-blue-600" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Total Applications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {recruitmentData.reduce((sum, item) => sum + item.applications, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <span>Total Hires</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {recruitmentData.reduce((sum, item) => sum + item.hires, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                  <span>Avg Cost/Hire</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  ${Math.round(recruitmentData.reduce((sum, item) => sum + item.costPerHire, 0) / recruitmentData.length)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>Avg Time to Fill</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(recruitmentData.reduce((sum, item) => sum + item.timeToFill, 0) / recruitmentData.length)} days
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Source Effectiveness</CardTitle>
                <CardDescription>
                  Performance by recruitment source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recruitmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                    <Bar dataKey="hires" fill="#10b981" name="Hires" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality vs Cost Analysis</CardTitle>
                <CardDescription>
                  Quality score vs cost per hire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={recruitmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="costPerHire" name="Cost per Hire" />
                    <YAxis dataKey="qualityScore" name="Quality Score" />
                    <Tooltip />
                    <Scatter dataKey="qualityScore" fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recruitment Source Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of recruitment channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Source</th>
                      <th className="text-left p-2">Applications</th>
                      <th className="text-left p-2">Interviews</th>
                      <th className="text-left p-2">Hires</th>
                      <th className="text-left p-2">Conversion Rate</th>
                      <th className="text-left p-2">Cost/Hire</th>
                      <th className="text-left p-2">Time to Fill</th>
                      <th className="text-left p-2">Quality Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recruitmentData.map((source, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{source.source}</td>
                        <td className="p-2">{source.applications}</td>
                        <td className="p-2">{source.interviews}</td>
                        <td className="p-2">{source.hires}</td>
                        <td className="p-2">{source.conversionRate}%</td>
                        <td className="p-2">${source.costPerHire}</td>
                        <td className="p-2">{source.timeToFill} days</td>
                        <td className="p-2">{source.qualityScore}/10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workforce" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Total Gap</span>
                </CardTitle>
                <CardDescription>
                  Workforce shortage across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {workforceData.reduce((sum, item) => sum + item.gap, 0)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Positions to fill
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Total Investment</span>
                </CardTitle>
                <CardDescription>
                  Required budget for hiring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${(workforceData.reduce((sum, item) => sum + item.cost, 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Annual cost
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span>Avg Timeline</span>
                </CardTitle>
                <CardDescription>
                  Average time to fill positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {Math.round(workforceData.reduce((sum, item) => sum + item.timeline, 0) / workforceData.length)} months
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Recruitment timeline
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Workforce Planning Analysis</CardTitle>
              <CardDescription>
                AI-powered workforce planning and gap analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workforceData.map((dept, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{dept.department}</h3>
                        <p className="text-sm text-gray-600">
                          Current: {dept.currentHeadcount} | Projected: {dept.projectedHeadcount}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(dept.priority)}>
                        {dept.priority.toUpperCase()} PRIORITY
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Gap</div>
                        <div className="text-2xl font-bold text-red-600">{dept.gap}</div>
                        <div className="text-xs text-gray-500">positions</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Timeline</div>
                        <div className="text-2xl font-bold text-orange-600">{dept.timeline}</div>
                        <div className="text-xs text-gray-500">months</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Cost</div>
                        <div className="text-2xl font-bold text-green-600">
                          ${(dept.cost / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-500">annual</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Growth</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(((dept.projectedHeadcount - dept.currentHeadcount) / dept.currentHeadcount) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">increase</div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          AI Recommendation: Focus on {dept.department} hiring with {dept.priority} priority. 
                          Estimated {dept.timeline} months to fill {dept.gap} positions at ${(dept.cost / 1000).toFixed(0)}K annual cost.
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Headcount Projection</CardTitle>
                <CardDescription>
                  Current vs projected workforce by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workforceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="currentHeadcount" fill="#3b82f6" name="Current" />
                    <Bar dataKey="projectedHeadcount" fill="#10b981" name="Projected" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment by Priority</CardTitle>
                <CardDescription>
                  Hiring budget allocation by priority level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workforceData}
                      dataKey="cost"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ department, cost }) => `${department}: $${(cost / 1000).toFixed(0)}K`}
                    >
                      {workforceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, 'Cost']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Shield className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button>
          <Brain className="h-4 w-4 mr-2" />
          Generate Insights
        </Button>
      </div>
    </div>
  );
};

export default PredictiveAnalytics; 