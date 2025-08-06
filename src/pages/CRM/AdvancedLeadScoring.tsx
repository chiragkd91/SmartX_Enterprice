/**
 * Advanced Lead Scoring - Behavioral scoring and predictive lead qualification
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Switch } from '../../components/ui/switch';
import { 
  Target, 
  TrendingUp, 
  Brain, 
  Zap,
  Star,
  Award,
  Trophy,
  Users,
  Activity,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  MapPin,
  Globe,
  Building,
  User,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  Link,
  FileText,
  Image,
  Video,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Copy,
  Share,
  Lock,
  Unlock,
  Shield,
  Key,
  Database,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Wifi,
  Signal,
  Battery,
  WifiOff
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
  LineChart as RechartsLineChart,
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

interface LeadScore {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  email: string;
  phone: string;
  totalScore: number;
  behavioralScore: number;
  demographicScore: number;
  engagementScore: number;
  fitScore: number;
  status: 'Hot' | 'Warm' | 'Cold' | 'Qualified' | 'Disqualified';
  lastActivity: string;
  nextAction: string;
  assignedTo: string;
  probability: number;
  estimatedValue: number;
  behaviors: LeadBehavior[];
  demographics: LeadDemographics;
  engagement: LeadEngagement;
}

interface LeadBehavior {
  id: string;
  type: 'Website Visit' | 'Email Open' | 'Email Click' | 'Form Submission' | 'Phone Call' | 'Meeting' | 'Demo Request' | 'Trial Signup' | 'Purchase';
  value: number;
  timestamp: string;
  source: string;
  details: string;
}

interface LeadDemographics {
  companySize: string;
  industry: string;
  location: string;
  jobTitle: string;
  department: string;
  budget: string;
  timeline: string;
  decisionMaker: boolean;
}

interface LeadEngagement {
  emailOpens: number;
  emailClicks: number;
  websiteVisits: number;
  formSubmissions: number;
  phoneCalls: number;
  meetings: number;
  lastEngagement: string;
  engagementFrequency: number;
}

interface ScoringRule {
  id: string;
  name: string;
  category: 'Behavioral' | 'Demographic' | 'Engagement' | 'Fit';
  condition: string;
  points: number;
  weight: number;
  enabled: boolean;
  description: string;
}

interface ScoringModel {
  id: string;
  name: string;
  description: string;
  rules: ScoringRule[];
  thresholds: {
    hot: number;
    warm: number;
    cold: number;
    qualified: number;
  };
  accuracy: number;
  status: 'Active' | 'Training' | 'Draft';
  lastUpdated: string;
}

const mockLeadScores: LeadScore[] = [
  {
    id: '1',
    leadId: 'L001',
    leadName: 'John Smith',
    company: 'TechCorp Solutions',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-0123',
    totalScore: 85,
    behavioralScore: 30,
    demographicScore: 25,
    engagementScore: 20,
    fitScore: 10,
    status: 'Hot',
    lastActivity: '2024-01-20T10:30:00Z',
    nextAction: 'Schedule Demo',
    assignedTo: 'Sarah Johnson',
    probability: 85,
    estimatedValue: 150000,
    behaviors: [
      {
        id: '1-1',
        type: 'Website Visit',
        value: 10,
        timestamp: '2024-01-20T10:30:00Z',
        source: 'Direct',
        details: 'Visited pricing page 3 times'
      },
      {
        id: '1-2',
        type: 'Email Click',
        value: 5,
        timestamp: '2024-01-19T15:45:00Z',
        source: 'Marketing Campaign',
        details: 'Clicked on product demo link'
      }
    ],
    demographics: {
      companySize: '100-500',
      industry: 'Technology',
      location: 'San Francisco, CA',
      jobTitle: 'CTO',
      department: 'Engineering',
      budget: '$100K-$500K',
      timeline: '1-3 months',
      decisionMaker: true
    },
    engagement: {
      emailOpens: 8,
      emailClicks: 3,
      websiteVisits: 12,
      formSubmissions: 2,
      phoneCalls: 1,
      meetings: 1,
      lastEngagement: '2024-01-20T10:30:00Z',
      engagementFrequency: 2.5
    }
  }
];

const mockScoringRules: ScoringRule[] = [
  {
    id: '1',
    name: 'Website Visit',
    category: 'Behavioral',
    condition: 'Lead visits website > 5 times',
    points: 10,
    weight: 1.2,
    enabled: true,
    description: 'Award points for multiple website visits'
  },
  {
    id: '2',
    name: 'Email Engagement',
    category: 'Engagement',
    condition: 'Lead opens emails > 3 times',
    points: 15,
    weight: 1.0,
    enabled: true,
    description: 'Award points for email engagement'
  },
  {
    id: '3',
    name: 'Decision Maker',
    category: 'Demographic',
    condition: 'Job title contains C-level or VP',
    points: 20,
    weight: 1.5,
    enabled: true,
    description: 'Award points for decision makers'
  }
];

const mockScoringModels: ScoringModel[] = [
  {
    id: '1',
    name: 'Enterprise Lead Scoring',
    description: 'Advanced scoring model for enterprise leads',
    rules: mockScoringRules,
    thresholds: {
      hot: 80,
      warm: 60,
      cold: 30,
      qualified: 70
    },
    accuracy: 92.5,
    status: 'Active',
    lastUpdated: '2024-01-15T10:30:00Z'
  }
];

export default function AdvancedLeadScoring() {
  const [activeTab, setActiveTab] = useState('leads');
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showModelDialog, setShowModelDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'text-red-600 bg-red-50';
      case 'Warm': return 'text-orange-600 bg-orange-50';
      case 'Cold': return 'text-blue-600 bg-blue-50';
      case 'Qualified': return 'text-green-600 bg-green-50';
      case 'Disqualified': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-gray-600';
  };

  const leadScoringMetrics = {
    totalLeads: mockLeadScores.length,
    hotLeads: mockLeadScores.filter(l => l.status === 'Hot').length,
    qualifiedLeads: mockLeadScores.filter(l => l.status === 'Qualified').length,
    averageScore: mockLeadScores.reduce((sum, l) => sum + l.totalScore, 0) / mockLeadScores.length,
    totalValue: mockLeadScores.reduce((sum, l) => sum + l.estimatedValue, 0),
    conversionRate: 23.4
  };

  const scoringData = [
    { score: '0-20', leads: 15, percentage: 15 },
    { score: '21-40', leads: 25, percentage: 25 },
    { score: '41-60', leads: 30, percentage: 30 },
    { score: '61-80', leads: 20, percentage: 20 },
    { score: '81-100', leads: 10, percentage: 10 }
  ];

  const behaviorData = [
    { behavior: 'Website Visit', frequency: 45, impact: 8.5 },
    { behavior: 'Email Open', frequency: 38, impact: 6.2 },
    { behavior: 'Email Click', frequency: 22, impact: 9.1 },
    { behavior: 'Form Submission', frequency: 15, impact: 12.5 },
    { behavior: 'Phone Call', frequency: 8, impact: 15.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Lead Scoring</h1>
          <p className="text-gray-600">AI-powered lead qualification and behavioral scoring</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowRuleDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Rule
          </Button>
          <Button onClick={() => setShowModelDialog(true)} variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Scoring Models
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadScoringMetrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">{leadScoringMetrics.hotLeads} hot leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadScoringMetrics.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadScoringMetrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">qualified leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(leadScoringMetrics.totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">pipeline value</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scored Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeadScores.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.leadName}</p>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${getScoreColor(lead.totalScore)}`}>
                            {lead.totalScore}
                          </span>
                          <Progress value={lead.totalScore} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      </TableCell>
                      <TableCell>{lead.probability}%</TableCell>
                      <TableCell>${lead.estimatedValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Target className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scoring Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockScoringRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-blue-600 bg-blue-50">{rule.category}</Badge>
                      </TableCell>
                      <TableCell>{rule.points}</TableCell>
                      <TableCell>{rule.weight}</TableCell>
                      <TableCell>
                        <Switch checked={rule.enabled} />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scoring Models</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Rules</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockScoringModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{model.name}</p>
                          <p className="text-sm text-gray-600">{model.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={model.status === 'Active' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'}>
                          {model.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{model.accuracy}%</TableCell>
                      <TableCell>{model.rules.length} rules</TableCell>
                      <TableCell>{new Date(model.lastUpdated).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Brain className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Behavior Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Behavior Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={behaviorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="behavior" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="impact" fill="#3B82F6" name="Impact Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoringData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="leads"
                      label={({ score, percentage }) => `${score}: ${percentage}%`}
                    >
                      {scoringData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scoring Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Scoring Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={[
                    { month: 'Jan', avgScore: 45, qualifiedLeads: 25 },
                    { month: 'Feb', avgScore: 52, qualifiedLeads: 30 },
                    { month: 'Mar', avgScore: 48, qualifiedLeads: 28 },
                    { month: 'Apr', avgScore: 58, qualifiedLeads: 35 },
                    { month: 'May', avgScore: 62, qualifiedLeads: 38 },
                    { month: 'Jun', avgScore: 65, qualifiedLeads: 42 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" name="Avg Score" />
                    <Line type="monotone" dataKey="qualifiedLeads" stroke="#10B981" name="Qualified Leads" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Model Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Enterprise Model</h4>
                      <Badge className="text-green-600 bg-green-50">92.5% Accuracy</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Advanced scoring for enterprise leads</p>
                    <Progress value={92.5} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Last updated: 2 days ago</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">SMB Model</h4>
                      <Badge className="text-yellow-600 bg-yellow-50">Training</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Scoring model for small business leads</p>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Training progress: 75%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rule Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Scoring Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rule Name</Label>
                <Input placeholder="Enter rule name" />
              </div>
              <div>
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="demographic">Demographic</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="fit">Fit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Condition</Label>
              <Input placeholder="Enter scoring condition" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Points</Label>
                <Input type="number" placeholder="Enter points" />
              </div>
              <div>
                <Label>Weight</Label>
                <Input type="number" step="0.1" placeholder="Enter weight" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input placeholder="Enter rule description" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRuleDialog(false)}>
                Cancel
              </Button>
              <Button>Create Rule</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Model Dialog */}
      <Dialog open={showModelDialog} onOpenChange={setShowModelDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Scoring Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Model Name</Label>
              <Input placeholder="Enter model name" />
            </div>
            <div>
              <Label>Description</Label>
              <Input placeholder="Enter model description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hot Threshold</Label>
                <Input type="number" placeholder="80" />
              </div>
              <div>
                <Label>Warm Threshold</Label>
                <Input type="number" placeholder="60" />
              </div>
              <div>
                <Label>Cold Threshold</Label>
                <Input type="number" placeholder="30" />
              </div>
              <div>
                <Label>Qualified Threshold</Label>
                <Input type="number" placeholder="70" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowModelDialog(false)}>
                Cancel
              </Button>
              <Button>Create Model</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 