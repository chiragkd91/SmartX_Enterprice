import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, Calendar, Mail, MessageSquare, Cloud, Database,
  CheckCircle, AlertTriangle, Settings, RefreshCw, Plus, Eye,
  Zap, Shield, Lock, Unlock, Activity, TrendingUp, TrendingDown,
  DollarSign, Users, Clock, Bell, ExternalLink, Key, Wifi
} from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'credit_card' | 'digital_wallet' | 'bank_transfer' | 'crypto';
  status: 'active' | 'inactive' | 'pending' | 'error';
  transactionVolume: number;
  successRate: number;
  processingTime: number;
  fees: number;
  features: string[];
  lastSync: Date;
  apiStatus: 'healthy' | 'warning' | 'error';
}

interface CalendarIntegration {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'custom';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  eventsSynced: number;
  lastSync: Date;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  permissions: string[];
  features: string[];
  apiStatus: 'healthy' | 'warning' | 'error';
}

interface EmailMarketing {
  id: string;
  name: string;
  type: 'newsletter' | 'automation' | 'transactional' | 'campaign';
  status: 'active' | 'paused' | 'draft' | 'scheduled';
  subscribers: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  lastSent: Date;
  nextScheduled: Date;
  templates: number;
  automationWorkflows: number;
}

interface IntegrationMetrics {
  totalIntegrations: number;
  activeIntegrations: number;
  totalTransactions: number;
  totalRevenue: number;
  averageResponseTime: number;
  uptime: number;
}

const AdditionalThirdPartyIntegrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [loading, setLoading] = useState(false);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [calendarIntegrations, setCalendarIntegrations] = useState<CalendarIntegration[]>([]);
  const [emailMarketing, setEmailMarketing] = useState<EmailMarketing[]>([]);
  const [metrics, setMetrics] = useState<IntegrationMetrics>({
    totalIntegrations: 0,
    activeIntegrations: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    averageResponseTime: 0,
    uptime: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPaymentGateways([
        {
          id: 'stripe',
          name: 'Stripe',
          type: 'credit_card',
          status: 'active',
          transactionVolume: 1250000,
          successRate: 98.5,
          processingTime: 2.3,
          fees: 2.9,
          features: ['Credit Cards', 'Digital Wallets', 'International Payments', 'Subscription Billing'],
          lastSync: new Date('2024-01-20T10:30:00'),
          apiStatus: 'healthy'
        },
        {
          id: 'paypal',
          name: 'PayPal',
          type: 'digital_wallet',
          status: 'active',
          transactionVolume: 850000,
          successRate: 97.2,
          processingTime: 3.1,
          fees: 3.5,
          features: ['Digital Wallet', 'Buy Now Pay Later', 'International Transfers', 'Business Accounts'],
          lastSync: new Date('2024-01-20T10:25:00'),
          apiStatus: 'healthy'
        },
        {
          id: 'square',
          name: 'Square',
          type: 'credit_card',
          status: 'active',
          transactionVolume: 450000,
          successRate: 99.1,
          processingTime: 1.8,
          fees: 2.6,
          features: ['Point of Sale', 'Invoicing', 'Inventory Management', 'Analytics'],
          lastSync: new Date('2024-01-20T10:20:00'),
          apiStatus: 'healthy'
        },
        {
          id: 'bitcoin',
          name: 'Bitcoin Payments',
          type: 'crypto',
          status: 'inactive',
          transactionVolume: 25000,
          successRate: 95.8,
          processingTime: 15.2,
          fees: 1.0,
          features: ['Cryptocurrency', 'Decentralized', 'Low Fees', 'Global Access'],
          lastSync: new Date('2024-01-19T16:45:00'),
          apiStatus: 'warning'
        }
      ]);

      setCalendarIntegrations([
        {
          id: 'google-calendar',
          name: 'Google Calendar',
          type: 'google',
          status: 'connected',
          eventsSynced: 1250,
          lastSync: new Date('2024-01-20T10:30:00'),
          syncFrequency: 'realtime',
          permissions: ['Read Events', 'Create Events', 'Update Events', 'Delete Events'],
          features: ['Event Scheduling', 'Meeting Rooms', 'Video Conferencing', 'Reminders'],
          apiStatus: 'healthy'
        },
        {
          id: 'outlook-calendar',
          name: 'Outlook Calendar',
          type: 'outlook',
          status: 'connected',
          eventsSynced: 890,
          lastSync: new Date('2024-01-20T10:25:00'),
          syncFrequency: 'hourly',
          permissions: ['Read Events', 'Create Events', 'Update Events'],
          features: ['Email Integration', 'Team Calendars', 'Resource Booking', 'Mobile Sync'],
          apiStatus: 'healthy'
        },
        {
          id: 'apple-calendar',
          name: 'Apple Calendar',
          type: 'apple',
          status: 'syncing',
          eventsSynced: 450,
          lastSync: new Date('2024-01-20T10:20:00'),
          syncFrequency: 'daily',
          permissions: ['Read Events', 'Create Events'],
          features: ['iCloud Sync', 'Siri Integration', 'Family Sharing', 'Privacy Focused'],
          apiStatus: 'warning'
        }
      ]);

      setEmailMarketing([
        {
          id: 'mailchimp',
          name: 'Mailchimp',
          type: 'newsletter',
          status: 'active',
          subscribers: 25000,
          openRate: 24.5,
          clickRate: 3.2,
          conversionRate: 1.8,
          lastSent: new Date('2024-01-20T09:00:00'),
          nextScheduled: new Date('2024-01-22T10:00:00'),
          templates: 45,
          automationWorkflows: 12
        },
        {
          id: 'sendgrid',
          name: 'SendGrid',
          type: 'transactional',
          status: 'active',
          subscribers: 15000,
          openRate: 18.7,
          clickRate: 2.1,
          conversionRate: 0.9,
          lastSent: new Date('2024-01-20T08:30:00'),
          nextScheduled: new Date('2024-01-20T14:00:00'),
          templates: 28,
          automationWorkflows: 8
        },
        {
          id: 'hubspot',
          name: 'HubSpot',
          type: 'automation',
          status: 'active',
          subscribers: 18000,
          openRate: 31.2,
          clickRate: 4.8,
          conversionRate: 2.5,
          lastSent: new Date('2024-01-20T07:15:00'),
          nextScheduled: new Date('2024-01-21T11:00:00'),
          templates: 62,
          automationWorkflows: 25
        }
      ]);

      setMetrics({
        totalIntegrations: 10,
        activeIntegrations: 8,
        totalTransactions: 2575000,
        totalRevenue: 125000,
        averageResponseTime: 2.8,
        uptime: 99.7
      });

      setLoading(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
      case 'syncing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApiStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'digital_wallet':
      case 'bank_transfer':
      case 'crypto':
        return <CreditCard className="h-4 w-4" />;
      case 'google':
      case 'outlook':
      case 'apple':
      case 'custom':
        return <Calendar className="h-4 w-4" />;
      case 'newsletter':
      case 'automation':
      case 'transactional':
      case 'campaign':
        return <Mail className="h-4 w-4" />;
      default:
        return <Cloud className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Additional Third-party Integrations</h1>
          <p className="text-gray-600 mt-2">
            Enhanced payment gateways, calendar integrations, and email marketing platforms
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Cloud className="h-4 w-4" />
            <span>API Connected</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <span>Real-time</span>
          </Badge>
        </div>
      </div>

      {/* Alert Section */}
      <Alert>
        <Cloud className="h-4 w-4" />
        <AlertDescription>
          Advanced third-party integrations for enhanced functionality. All integrations are 
          secured with OAuth 2.0 and API key authentication.
        </AlertDescription>
      </Alert>

      {/* Integration Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalIntegrations}</p>
              </div>
              <Cloud className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Connected services</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeIntegrations}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${(metrics.totalTransactions / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.uptime}%</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">System availability</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Payment Gateways</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email Marketing</span>
          </TabsTrigger>
        </TabsList>

        {/* Payment Gateways Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <span>Active Gateways</span>
                </CardTitle>
                <CardDescription>
                  Currently active payment gateways
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {paymentGateways.filter(p => p.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Processing payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Total Volume</span>
                </CardTitle>
                <CardDescription>
                  Monthly transaction volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  ${(paymentGateways.reduce((sum, p) => sum + p.transactionVolume, 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>Success Rate</span>
                </CardTitle>
                <CardDescription>
                  Average transaction success rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {paymentGateways.length > 0 ? 
                    (paymentGateways.reduce((sum, p) => sum + p.successRate, 0) / paymentGateways.length).toFixed(1) : 
                    0}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Across all gateways
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Integrations</CardTitle>
              <CardDescription>
                Manage and monitor payment gateway connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {paymentGateways.map((gateway) => (
                  <div key={gateway.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{gateway.name}</h3>
                            <Badge className={getStatusColor(gateway.status)}>
                              {gateway.status.toUpperCase()}
                            </Badge>
                            <Badge className={getApiStatusColor(gateway.apiStatus)}>
                              API {gateway.apiStatus.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Type: {gateway.type.replace('_', ' ')} | 
                            Last Sync: {gateway.lastSync.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${(gateway.transactionVolume / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-600">
                          Monthly volume
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Success Rate</div>
                        <div className="text-lg font-semibold">{gateway.successRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Processing Time</div>
                        <div className="text-lg font-semibold">{gateway.processingTime}s</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Fees</div>
                        <div className="text-lg font-semibold">{gateway.fees}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Features</div>
                        <div className="text-lg font-semibold">{gateway.features.length}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Available Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {gateway.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gateway
                </Button>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Gateway Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Integrations Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Connected Calendars</span>
                </CardTitle>
                <CardDescription>
                  Active calendar integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {calendarIntegrations.filter(c => c.status === 'connected').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Syncing events
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Events Synced</span>
                </CardTitle>
                <CardDescription>
                  Total events synchronized
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {calendarIntegrations.reduce((sum, c) => sum + c.eventsSynced, 0)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Across all calendars
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>Sync Frequency</span>
                </CardTitle>
                <CardDescription>
                  Real-time sync status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {calendarIntegrations.filter(c => c.syncFrequency === 'realtime').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Real-time sync
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Calendar Integrations</CardTitle>
              <CardDescription>
                Manage calendar synchronization and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {calendarIntegrations.map((calendar) => (
                  <div key={calendar.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{calendar.name}</h3>
                            <Badge className={getStatusColor(calendar.status)}>
                              {calendar.status.toUpperCase()}
                            </Badge>
                            <Badge className={getApiStatusColor(calendar.apiStatus)}>
                              API {calendar.apiStatus.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Type: {calendar.type} | 
                            Last Sync: {calendar.lastSync.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {calendar.eventsSynced}
                        </div>
                        <div className="text-sm text-gray-600">
                          Events synced
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Permissions</h4>
                        <div className="flex flex-wrap gap-2">
                          {calendar.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {calendar.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Sync Frequency:</span>
                        <Badge variant="outline">{calendar.syncFrequency}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={calendar.status === 'connected'} />
                        <span className="text-sm text-gray-600">Enable Sync</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Calendar
                </Button>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Sync Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Marketing Tab */}
        <TabsContent value="email" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>Active Campaigns</span>
                </CardTitle>
                <CardDescription>
                  Currently running email campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {emailMarketing.filter(e => e.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Active campaigns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Total Subscribers</span>
                </CardTitle>
                <CardDescription>
                  Combined subscriber count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {emailMarketing.reduce((sum, e) => sum + e.subscribers, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Across all platforms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span>Avg Open Rate</span>
                </CardTitle>
                <CardDescription>
                  Average email open rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {emailMarketing.length > 0 ? 
                    (emailMarketing.reduce((sum, e) => sum + e.openRate, 0) / emailMarketing.length).toFixed(1) : 
                    0}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Industry average
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Marketing Platforms</CardTitle>
              <CardDescription>
                Manage email marketing campaigns and automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {emailMarketing.map((platform) => (
                  <div key={platform.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{platform.name}</h3>
                            <Badge className={getStatusColor(platform.status)}>
                              {platform.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {platform.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Last Sent: {platform.lastSent.toLocaleString()} | 
                            Next Scheduled: {platform.nextScheduled.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {platform.subscribers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Subscribers
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Open Rate</div>
                        <div className="text-lg font-semibold">{platform.openRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Click Rate</div>
                        <div className="text-lg font-semibold">{platform.clickRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
                        <div className="text-lg font-semibold">{platform.conversionRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Templates</div>
                        <div className="text-lg font-semibold">{platform.templates}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Automation Workflows:</span>
                        <Badge variant="outline">{platform.automationWorkflows}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Campaigns
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Platform
                </Button>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Integration Settings
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>
    </div>
  );
};

export default AdditionalThirdPartyIntegrations; 