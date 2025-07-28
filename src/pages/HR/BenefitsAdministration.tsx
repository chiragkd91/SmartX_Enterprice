/**
 * Benefits Administration System - Complete benefits management platform
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { 
  Heart, 
  Shield, 
  CreditCard, 
  FileText, 
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  FileCheck,
  UserCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Calculator,
  Receipt,
  PiggyBank,
  Briefcase,
  GraduationCap
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
  Line
} from 'recharts';

interface BenefitPlan {
  id: string;
  name: string;
  type: 'Health' | 'Dental' | 'Vision' | 'Life' | 'Disability' | 'Retirement' | 'Other';
  provider: string;
  planCode: string;
  coverage: string;
  monthlyPremium: number;
  employerContribution: number;
  employeeContribution: number;
  deductible: number;
  coPay: number;
  maxOutOfPocket: number;
  effectiveDate: string;
  renewalDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
  features: string[];
  documents: BenefitDocument[];
}

interface BenefitDocument {
  id: string;
  name: string;
  type: 'Summary' | 'Certificate' | 'Policy' | 'Form' | 'Other';
  url: string;
  uploadDate: string;
  fileSize: number;
}

interface EmployeeEnrollment {
  id: string;
  employeeId: string;
  employeeName: string;
  planId: string;
  planName: string;
  enrollmentDate: string;
  effectiveDate: string;
  status: 'Active' | 'Pending' | 'Terminated' | 'Suspended';
  dependents: Dependent[];
  totalCost: number;
  employeeCost: number;
  employerCost: number;
}

interface Dependent {
  id: string;
  name: string;
  relationship: 'Spouse' | 'Child' | 'Parent' | 'Other';
  dateOfBirth: string;
  ssn?: string;
  coverage: boolean;
  cost: number;
}

interface Claim {
  id: string;
  employeeId: string;
  employeeName: string;
  planId: string;
  planName: string;
  claimType: 'Medical' | 'Dental' | 'Vision' | 'Pharmacy' | 'Other';
  provider: string;
  serviceDate: string;
  amount: number;
  approvedAmount: number;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Denied' | 'Paid';
  submissionDate: string;
  processedDate?: string;
  notes: string;
  documents: ClaimDocument[];
}

interface ClaimDocument {
  id: string;
  name: string;
  type: 'Bill' | 'Receipt' | 'Prescription' | 'Referral' | 'Other';
  url: string;
  uploadDate: string;
}

interface OpenEnrollment {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Active' | 'Closed' | 'Processing';
  eligibleEmployees: number;
  enrolledEmployees: number;
  plans: string[];
  announcements: string[];
}

const mockBenefitPlans: BenefitPlan[] = [
  {
    id: '1',
    name: 'Premium Health Plan',
    type: 'Health',
    provider: 'Blue Cross Blue Shield',
    planCode: 'BCBS-PREMIUM',
    coverage: 'Comprehensive medical coverage with low deductibles',
    monthlyPremium: 850,
    employerContribution: 680,
    employeeContribution: 170,
    deductible: 500,
    coPay: 25,
    maxOutOfPocket: 3000,
    effectiveDate: '2024-01-01',
    renewalDate: '2024-12-31',
    status: 'Active',
    features: [
      'Preventive care covered 100%',
      'Prescription drug coverage',
      'Mental health services',
      'Telemedicine services',
      'Dental and vision included'
    ],
    documents: [
      {
        id: '1',
        name: 'Summary of Benefits',
        type: 'Summary',
        url: '/documents/health-plan-summary.pdf',
        uploadDate: '2024-01-01',
        fileSize: 245760
      }
    ]
  },
  {
    id: '2',
    name: 'Basic Health Plan',
    type: 'Health',
    provider: 'Aetna',
    planCode: 'AETNA-BASIC',
    coverage: 'Standard medical coverage with higher deductibles',
    monthlyPremium: 650,
    employerContribution: 520,
    employeeContribution: 130,
    deductible: 1500,
    coPay: 35,
    maxOutOfPocket: 5000,
    effectiveDate: '2024-01-01',
    renewalDate: '2024-12-31',
    status: 'Active',
    features: [
      'Preventive care covered 100%',
      'Prescription drug coverage',
      'Basic dental coverage'
    ],
    documents: []
  }
];

const mockEnrollments: EmployeeEnrollment[] = [
  {
    id: '1',
    employeeId: 'GCI001',
    employeeName: 'Rajesh Kumar',
    planId: '1',
    planName: 'Premium Health Plan',
    enrollmentDate: '2024-01-15',
    effectiveDate: '2024-02-01',
    status: 'Active',
    dependents: [
      {
        id: '1',
        name: 'Priya Kumar',
        relationship: 'Spouse',
        dateOfBirth: '1985-03-15',
        coverage: true,
        cost: 200
      },
      {
        id: '2',
        name: 'Arjun Kumar',
        relationship: 'Child',
        dateOfBirth: '2010-07-22',
        coverage: true,
        cost: 150
      }
    ],
    totalCost: 1200,
    employeeCost: 320,
    employerCost: 880
  }
];

const mockClaims: Claim[] = [
  {
    id: '1',
    employeeId: 'GCI001',
    employeeName: 'Rajesh Kumar',
    planId: '1',
    planName: 'Premium Health Plan',
    claimType: 'Medical',
    provider: 'City General Hospital',
    serviceDate: '2024-01-20',
    amount: 2500,
    approvedAmount: 2200,
    status: 'Approved',
    submissionDate: '2024-01-25',
    processedDate: '2024-01-30',
    notes: 'Annual physical examination',
    documents: [
      {
        id: '1',
        name: 'Medical Bill',
        type: 'Bill',
        url: '/documents/claim-1-bill.pdf',
        uploadDate: '2024-01-25'
      }
    ]
  }
];

const mockOpenEnrollment: OpenEnrollment = {
  id: '1',
  name: '2024 Annual Benefits Enrollment',
  startDate: '2024-11-01',
  endDate: '2024-11-30',
  status: 'Upcoming',
  eligibleEmployees: 247,
  enrolledEmployees: 0,
  plans: ['1', '2'],
  announcements: [
    'New dental plan options available',
    'Increased employer contribution for health plans',
    'New wellness program benefits'
  ]
};

export default function BenefitsAdministration() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlan, setSelectedPlan] = useState<BenefitPlan | null>(null);
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
  const [showClaimDialog, setShowClaimDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Terminated': return 'text-red-600 bg-red-50';
      case 'Suspended': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-50';
      case 'Paid': return 'text-blue-600 bg-blue-50';
      case 'Under Review': return 'text-yellow-600 bg-yellow-50';
      case 'Denied': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Health': return 'text-blue-600 bg-blue-50';
      case 'Dental': return 'text-green-600 bg-green-50';
      case 'Vision': return 'text-purple-600 bg-purple-50';
      case 'Life': return 'text-red-600 bg-red-50';
      case 'Retirement': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const benefitsMetrics = {
    totalPlans: mockBenefitPlans.length,
    activeEnrollments: mockEnrollments.filter(e => e.status === 'Active').length,
    totalClaims: mockClaims.length,
    pendingClaims: mockClaims.filter(c => c.status === 'Under Review').length,
    totalCost: mockEnrollments.reduce((sum, e) => sum + e.totalCost, 0),
    employerCost: mockEnrollments.reduce((sum, e) => sum + e.employerCost, 0),
    employeeCost: mockEnrollments.reduce((sum, e) => sum + e.employeeCost, 0)
  };

  const enrollmentData = [
    { month: 'Jan', enrollments: 45, cost: 54000 },
    { month: 'Feb', enrollments: 52, cost: 62400 },
    { month: 'Mar', enrollments: 48, cost: 57600 },
    { month: 'Apr', enrollments: 61, cost: 73200 },
    { month: 'May', enrollments: 59, cost: 70800 },
    { month: 'Jun', enrollments: 68, cost: 81600 }
  ];

  const claimData = [
    { month: 'Jan', claims: 12, amount: 15000 },
    { month: 'Feb', claims: 15, amount: 18500 },
    { month: 'Mar', claims: 18, amount: 22000 },
    { month: 'Apr', claims: 14, amount: 17000 },
    { month: 'May', claims: 16, amount: 19500 },
    { month: 'Jun', claims: 20, amount: 24500 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Benefits Administration</h1>
          <p className="text-gray-600">Manage employee benefits, enrollments, and claims</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowEnrollmentDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Enrollment
          </Button>
          <Button onClick={() => setShowClaimDialog(true)} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Submit Claim
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefitsMetrics.totalPlans}</div>
            <p className="text-xs text-muted-foreground">Active benefit plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefitsMetrics.activeEnrollments}</div>
            <p className="text-xs text-muted-foreground">Employees enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefitsMetrics.totalClaims}</div>
            <p className="text-xs text-muted-foreground">Claims this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${benefitsMetrics.totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total monthly cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Benefit Plans</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="enrollment">Open Enrollment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="enrollments" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Claims Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Claims Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={claimData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClaims.slice(0, 5).map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{claim.employeeName}</p>
                        <p className="text-sm text-gray-600">{claim.claimType} claim - {claim.provider}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${claim.amount.toLocaleString()}</p>
                      <Badge className={getClaimStatusColor(claim.status)}>{claim.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefit Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefit Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Monthly Premium</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBenefitPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(plan.type)}>{plan.type}</Badge>
                      </TableCell>
                      <TableCell>{plan.provider}</TableCell>
                      <TableCell>${plan.monthlyPremium.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrollments Tab */}
        <TabsContent value="enrollments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Dependents</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">{enrollment.employeeName}</TableCell>
                      <TableCell>{enrollment.planName}</TableCell>
                      <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{enrollment.dependents.length}</TableCell>
                      <TableCell>${enrollment.totalCost.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(enrollment.status)}>{enrollment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claims Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Claim Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.employeeName}</TableCell>
                      <TableCell>{claim.claimType}</TableCell>
                      <TableCell>{claim.provider}</TableCell>
                      <TableCell>${claim.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getClaimStatusColor(claim.status)}>{claim.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(claim.submissionDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Open Enrollment Tab */}
        <TabsContent value="enrollment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="text-lg font-semibold text-blue-900">{mockOpenEnrollment.name}</h3>
                  <p className="text-blue-700">
                    {new Date(mockOpenEnrollment.startDate).toLocaleDateString()} - {new Date(mockOpenEnrollment.endDate).toLocaleDateString()}
                  </p>
                  <Badge className="mt-2">{mockOpenEnrollment.status}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{mockOpenEnrollment.eligibleEmployees}</div>
                      <p className="text-sm text-gray-600">Eligible Employees</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{mockOpenEnrollment.enrolledEmployees}</div>
                      <p className="text-sm text-gray-600">Enrolled Employees</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{mockOpenEnrollment.plans.length}</div>
                      <p className="text-sm text-gray-600">Available Plans</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Announcements</h4>
                  <div className="space-y-2">
                    {mockOpenEnrollment.announcements.map((announcement, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{announcement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Employer Cost', value: benefitsMetrics.employerCost, color: '#3B82F6' },
                        { name: 'Employee Cost', value: benefitsMetrics.employeeCost, color: '#10B981' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Employer Cost', value: benefitsMetrics.employerCost, color: '#3B82F6' },
                        { name: 'Employee Cost', value: benefitsMetrics.employeeCost, color: '#10B981' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claims by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { type: 'Medical', claims: 45, amount: 55000 },
                    { type: 'Dental', claims: 28, amount: 12000 },
                    { type: 'Vision', claims: 15, amount: 8000 },
                    { type: 'Pharmacy', claims: 32, amount: 18000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enrollment Dialog */}
      <Dialog open={showEnrollmentDialog} onOpenChange={setShowEnrollmentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Employee Enrollment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gci001">Rajesh Kumar</SelectItem>
                    <SelectItem value="gci002">Priya Sharma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Benefit Plan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBenefitPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Effective Date</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Dependents</Label>
              <Textarea placeholder="List dependents to be covered..." />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEnrollmentDialog(false)}>
                Cancel
              </Button>
              <Button>Enroll Employee</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Claim Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit New Claim</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gci001">Rajesh Kumar</SelectItem>
                    <SelectItem value="gci002">Priya Sharma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Claim Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                    <SelectItem value="vision">Vision</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Provider</Label>
                <Input placeholder="Provider name" />
              </div>
              <div>
                <Label>Service Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" placeholder="Claim amount" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes..." />
            </div>
            <div>
              <Label>Documents</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload supporting documents</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
                Cancel
              </Button>
              <Button>Submit Claim</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 