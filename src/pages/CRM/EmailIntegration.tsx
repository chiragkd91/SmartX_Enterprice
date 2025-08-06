/**
 * Email Integration - Complete email management and automation platform
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Switch } from '../../components/ui/switch';
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  Eye as EyeIcon,
  EyeOff,
  Link,
  FileText,
  Image,
  Video,
  Paperclip,
  Smile,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Undo,
  Redo,
  Save,
  Share,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Brain,
  Star,
  Heart,
  MessageSquare,
  Phone,
  User,
  UserCheck,
  UserX,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin,
  Globe,
  Wifi,
  Shield,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Tablet,
  Laptop
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Paused' | 'Cancelled';
  type: 'Newsletter' | 'Promotional' | 'Transactional' | 'Follow-up' | 'Welcome';
  recipientCount: number;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  unsubscribedCount: number;
  openRate: number;
  clickRate: number;
  scheduledDate?: string;
  sentDate?: string;
  createdBy: string;
  createdAt: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'Marketing' | 'Sales' | 'Support' | 'General';
  variables: string[];
  usageCount: number;
  lastUsed: string;
  createdBy: string;
  createdAt: string;
}

interface EmailActivity {
  id: string;
  emailId: string;
  recipient: string;
  action: 'Sent' | 'Delivered' | 'Opened' | 'Clicked' | 'Bounced' | 'Unsubscribed' | 'Spam';
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  device?: string;
  link?: string;
}

interface EmailAutomation {
  id: string;
  name: string;
  trigger: 'Lead Created' | 'Lead Status Changed' | 'Deal Won' | 'Deal Lost' | 'Contact Added' | 'Custom';
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  status: 'Active' | 'Inactive' | 'Draft';
  performance: {
    totalTriggers: number;
    emailsSent: number;
    openRate: number;
    clickRate: number;
  };
  createdBy: string;
  createdAt: string;
}

interface AutomationCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
  value: string;
}

interface AutomationAction {
  id: string;
  type: 'send_email' | 'update_field' | 'create_task' | 'send_notification';
  config: any;
  delay?: number;
}

const mockEmailCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Q4 Product Launch',
    subject: 'Introducing Our New Enterprise Solution',
    status: 'Sent',
    type: 'Promotional',
    recipientCount: 2500,
    sentCount: 2480,
    openedCount: 1240,
    clickedCount: 372,
    unsubscribedCount: 25,
    openRate: 50.0,
    clickRate: 15.0,
    sentDate: '2024-01-15T10:00:00Z',
    createdBy: 'Marketing Team',
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '2',
    name: 'Welcome Series - Day 1',
    subject: 'Welcome to Our Platform!',
    status: 'Sending',
    type: 'Welcome',
    recipientCount: 500,
    sentCount: 320,
    openedCount: 160,
    clickedCount: 48,
    unsubscribedCount: 5,
    openRate: 50.0,
    clickRate: 15.0,
    createdBy: 'Marketing Team',
    createdAt: '2024-01-18T09:00:00Z'
  }
];

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to {{company_name}}!',
    content: '<p>Hi {{first_name}},</p><p>Welcome to {{company_name}}! We\'re excited to have you on board.</p>',
    category: 'Marketing',
    variables: ['first_name', 'company_name'],
    usageCount: 45,
    lastUsed: '2024-01-18T09:00:00Z',
    createdBy: 'Marketing Team',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Follow-up Email',
    subject: 'Following up on our conversation',
    content: '<p>Hi {{first_name}},</p><p>I wanted to follow up on our recent conversation about {{topic}}.</p>',
    category: 'Sales',
    variables: ['first_name', 'topic'],
    usageCount: 23,
    lastUsed: '2024-01-17T15:30:00Z',
    createdBy: 'Sales Team',
    createdAt: '2024-01-05T00:00:00Z'
  }
];

const mockEmailActivities: EmailActivity[] = [
  {
    id: '1',
    emailId: '1',
    recipient: 'john.doe@example.com',
    action: 'Opened',
    timestamp: '2024-01-20T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'New York, NY',
    device: 'Desktop'
  },
  {
    id: '2',
    emailId: '1',
    recipient: 'jane.smith@example.com',
    action: 'Clicked',
    timestamp: '2024-01-20T11:15:00Z',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    location: 'San Francisco, CA',
    device: 'Mobile',
    link: 'https://example.com/product'
  }
];

const mockEmailAutomations: EmailAutomation[] = [
  {
    id: '1',
    name: 'Lead Nurturing Series',
    trigger: 'Lead Created',
    conditions: [
      {
        id: '1-1',
        field: 'lead_source',
        operator: 'equals',
        value: 'website'
      }
    ],
    actions: [
      {
        id: '1-1',
        type: 'send_email',
        config: { templateId: '1', delay: 0 }
      },
      {
        id: '1-2',
        type: 'send_email',
        config: { templateId: '2', delay: 86400 }
      }
    ],
    status: 'Active',
    performance: {
      totalTriggers: 150,
      emailsSent: 300,
      openRate: 45.2,
      clickRate: 12.8
    },
    createdBy: 'Marketing Team',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export default function EmailIntegration() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showAutomationDialog, setShowAutomationDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'text-green-600 bg-green-50';
      case 'Sending': return 'text-blue-600 bg-blue-50';
      case 'Scheduled': return 'text-yellow-600 bg-yellow-50';
      case 'Draft': return 'text-gray-600 bg-gray-50';
      case 'Paused': return 'text-orange-600 bg-orange-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Promotional': return 'text-purple-600 bg-purple-50';
      case 'Welcome': return 'text-blue-600 bg-blue-50';
      case 'Transactional': return 'text-green-600 bg-green-50';
      case 'Follow-up': return 'text-orange-600 bg-orange-50';
      case 'Newsletter': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const emailMetrics = {
    totalCampaigns: mockEmailCampaigns.length,
    activeCampaigns: mockEmailCampaigns.filter(c => c.status === 'Sending' || c.status === 'Scheduled').length,
    totalEmailsSent: mockEmailCampaigns.reduce((sum, c) => sum + c.sentCount, 0),
    averageOpenRate: mockEmailCampaigns.reduce((sum, c) => sum + c.openRate, 0) / mockEmailCampaigns.length,
    totalTemplates: mockEmailTemplates.length,
    activeAutomations: mockEmailAutomations.filter(a => a.status === 'Active').length
  };

  const emailData = [
    { day: 'Mon', sent: 120, opened: 60, clicked: 18 },
    { day: 'Tue', sent: 150, opened: 75, clicked: 22 },
    { day: 'Wed', sent: 180, opened: 90, clicked: 27 },
    { day: 'Thu', sent: 200, opened: 100, clicked: 30 },
    { day: 'Fri', sent: 160, opened: 80, clicked: 24 },
    { day: 'Sat', sent: 80, opened: 40, clicked: 12 },
    { day: 'Sun', sent: 60, opened: 30, clicked: 9 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Integration</h1>
          <p className="text-gray-600">Email campaigns, automation, and tracking</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowCampaignDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
          <Button onClick={() => setShowTemplateDialog(true)} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailMetrics.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">{emailMetrics.activeCampaigns} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailMetrics.totalEmailsSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailMetrics.averageOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Industry avg: 21.5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailMetrics.activeAutomations}</div>
            <p className="text-xs text-muted-foreground">Running workflows</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmailCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-gray-600">{campaign.subject}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(campaign.type)}>{campaign.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell>{campaign.recipientCount.toLocaleString()}</TableCell>
                      <TableCell>{campaign.openRate}%</TableCell>
                      <TableCell>{campaign.clickRate}%</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {campaign.status === 'Sending' && (
                            <Button variant="ghost" size="sm">
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmailTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-gray-600">{template.subject}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-blue-600 bg-blue-50">{template.category}</Badge>
                      </TableCell>
                      <TableCell>{template.usageCount}</TableCell>
                      <TableCell>{new Date(template.lastUsed).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
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

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Automations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Automation Name</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Emails Sent</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmailAutomations.map((automation) => (
                    <TableRow key={automation.id}>
                      <TableCell className="font-medium">{automation.name}</TableCell>
                      <TableCell>{automation.trigger}</TableCell>
                      <TableCell>
                        <Badge className={automation.status === 'Active' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'}>
                          {automation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{automation.performance.emailsSent}</TableCell>
                      <TableCell>{automation.performance.openRate}%</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            {automation.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmailActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.recipient}</TableCell>
                      <TableCell>
                        <Badge className={
                          activity.action === 'Opened' ? 'text-green-600 bg-green-50' :
                          activity.action === 'Clicked' ? 'text-blue-600 bg-blue-50' :
                          activity.action === 'Bounced' ? 'text-red-600 bg-red-50' :
                          'text-gray-600 bg-gray-50'
                        }>
                          {activity.action}
                        </Badge>
                      </TableCell>
                      <TableCell>Q4 Product Launch</TableCell>
                      <TableCell>{activity.device}</TableCell>
                      <TableCell>{activity.location}</TableCell>
                      <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Email Performance (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={emailData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sent" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="opened" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="clicked" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockEmailCampaigns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="openRate" fill="#3B82F6" name="Open Rate %" />
                    <Bar dataKey="clickRate" fill="#10B981" name="Click Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Campaign Dialog */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Email Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Campaign Name</Label>
                <Input placeholder="Enter campaign name" />
              </div>
              <div>
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="welcome">Welcome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Subject Line</Label>
              <Input placeholder="Enter email subject" />
            </div>
            <div>
              <Label>Email Content</Label>
              <Textarea placeholder="Enter email content..." rows={10} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
                Cancel
              </Button>
              <Button>Create Campaign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Template Name</Label>
                <Input placeholder="Enter template name" />
              </div>
              <div>
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Subject Line</Label>
              <Input placeholder="Enter subject line with variables like {{name}}" />
            </div>
            <div>
              <Label>Email Content</Label>
              <Textarea placeholder="Enter email content with variables..." rows={10} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                Cancel
              </Button>
              <Button>Create Template</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 