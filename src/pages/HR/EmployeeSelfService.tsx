/**
 * Employee Self-Service Portal - Complete employee self-service platform
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { 
  User, 
  Calendar, 
  FileText, 
  DollarSign, 
  Heart,
  Shield,
  Settings,
  Edit,
  Download,
  Upload,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Building2,
  GraduationCap,
  Award,
  Clock3,
  CalendarDays,
  FileCheck,
  CreditCard,
  PiggyBank,
  Users,
  Star,
  Bell,
  Key,
  Lock,
  Camera
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface EmployeeProfile {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContacts: EmergencyContact[];
  skills: Skill[];
  certifications: Certification[];
  department: string;
  position: string;
  hireDate: string;
  manager: string;
  salary: number;
  avatar?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  verified: boolean;
}

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  status: 'Active' | 'Expired' | 'Pending';
}

interface LeaveRequest {
  id: string;
  type: 'Annual' | 'Sick' | 'Personal' | 'Maternity' | 'Paternity' | 'Bereavement' | 'Other';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

interface Payslip {
  id: string;
  month: string;
  year: number;
  grossPay: number;
  netPay: number;
  deductions: Deduction[];
  allowances: Allowance[];
  status: 'Generated' | 'Paid' | 'Pending';
  paymentDate?: string;
}

interface Deduction {
  name: string;
  amount: number;
  type: 'Tax' | 'Insurance' | 'Retirement' | 'Other';
}

interface Allowance {
  name: string;
  amount: number;
  type: 'Housing' | 'Transport' | 'Meal' | 'Other';
}

interface EmployeeDocument {
  id: string;
  name: string;
  type: 'Contract' | 'ID' | 'Certificate' | 'Policy' | 'Form' | 'Other';
  category: 'Personal' | 'Employment' | 'Training' | 'Benefits' | 'Other';
  uploadDate: string;
  expiryDate?: string;
  status: 'Active' | 'Expired' | 'Pending';
  fileSize: number;
  fileType: string;
}

interface BenefitEnrollment {
  id: string;
  benefitType: 'Health' | 'Dental' | 'Vision' | 'Life' | 'Retirement' | 'Other';
  planName: string;
  coverage: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  premium: number;
  employerContribution: number;
  employeeContribution: number;
}

const mockEmployeeProfile: EmployeeProfile = {
  id: '1',
  employeeId: 'EMP001',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@company.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1990-05-15',
  address: {
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA'
  },
  emergencyContacts: [
    {
      id: '1',
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
      email: 'jane.smith@email.com',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Robert Smith',
      relationship: 'Father',
      phone: '+1 (555) 456-7890',
      email: 'robert.smith@email.com',
      isPrimary: false
    }
  ],
  skills: [
    { id: '1', name: 'React', level: 'Advanced', category: 'Programming', verified: true },
    { id: '2', name: 'TypeScript', level: 'Intermediate', category: 'Programming', verified: true },
    { id: '3', name: 'Project Management', level: 'Advanced', category: 'Management', verified: true },
    { id: '4', name: 'Leadership', level: 'Intermediate', category: 'Soft Skills', verified: false }
  ],
  certifications: [
    {
      id: '1',
      name: 'Certified Scrum Master',
      issuingOrganization: 'Scrum Alliance',
      issueDate: '2023-01-15',
      expiryDate: '2025-01-15',
      credentialId: 'CSM-123456',
      status: 'Active'
    },
    {
      id: '2',
      name: 'AWS Certified Developer',
      issuingOrganization: 'Amazon Web Services',
      issueDate: '2023-06-20',
      credentialId: 'AWS-DEV-789012',
      status: 'Active'
    }
  ],
  department: 'Engineering',
  position: 'Senior Software Engineer',
  hireDate: '2022-03-01',
  manager: 'Sarah Johnson',
  salary: 95000
};

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    type: 'Annual',
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    days: 5,
    reason: 'Family vacation',
    status: 'Approved',
    submittedDate: '2024-01-20',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2024-01-22'
  },
  {
    id: '2',
    type: 'Sick',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    days: 3,
    reason: 'Medical appointment',
    status: 'Approved',
    submittedDate: '2024-01-09',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2024-01-09'
  },
  {
    id: '3',
    type: 'Personal',
    startDate: '2024-03-05',
    endDate: '2024-03-05',
    days: 1,
    reason: 'Personal matter',
    status: 'Pending',
    submittedDate: '2024-01-25'
  }
];

const mockPayslips: Payslip[] = [
  {
    id: '1',
    month: 'January',
    year: 2024,
    grossPay: 9500,
    netPay: 7125,
    deductions: [
      { name: 'Federal Tax', amount: 1425, type: 'Tax' },
      { name: 'State Tax', amount: 475, type: 'Tax' },
      { name: 'Health Insurance', amount: 200, type: 'Insurance' },
      { name: '401(k)', amount: 285, type: 'Retirement' }
    ],
    allowances: [
      { name: 'Housing Allowance', amount: 500, type: 'Housing' },
      { name: 'Transport Allowance', amount: 200, type: 'Transport' }
    ],
    status: 'Paid',
    paymentDate: '2024-01-31'
  },
  {
    id: '2',
    month: 'December',
    year: 2023,
    grossPay: 9500,
    netPay: 7125,
    deductions: [
      { name: 'Federal Tax', amount: 1425, type: 'Tax' },
      { name: 'State Tax', amount: 475, type: 'Tax' },
      { name: 'Health Insurance', amount: 200, type: 'Insurance' },
      { name: '401(k)', amount: 285, type: 'Retirement' }
    ],
    allowances: [
      { name: 'Housing Allowance', amount: 500, type: 'Housing' },
      { name: 'Transport Allowance', amount: 200, type: 'Transport' }
    ],
    status: 'Paid',
    paymentDate: '2023-12-31'
  }
];

const mockDocuments: EmployeeDocument[] = [
  {
    id: '1',
    name: 'Employment Contract',
    type: 'Contract',
    category: 'Employment',
    uploadDate: '2022-03-01',
    status: 'Active',
    fileSize: 2.5,
    fileType: 'PDF'
  },
  {
    id: '2',
    name: 'Driver License',
    type: 'ID',
    category: 'Personal',
    uploadDate: '2022-03-01',
    expiryDate: '2025-05-15',
    status: 'Active',
    fileSize: 1.2,
    fileType: 'PDF'
  },
  {
    id: '3',
    name: 'React Certification',
    type: 'Certificate',
    category: 'Training',
    uploadDate: '2023-06-20',
    status: 'Active',
    fileSize: 0.8,
    fileType: 'PDF'
  }
];

const mockBenefits: BenefitEnrollment[] = [
  {
    id: '1',
    benefitType: 'Health',
    planName: 'Premium Health Plan',
    coverage: 'Family',
    startDate: '2022-03-01',
    status: 'Active',
    premium: 800,
    employerContribution: 600,
    employeeContribution: 200
  },
  {
    id: '2',
    benefitType: 'Dental',
    planName: 'Standard Dental Plan',
    coverage: 'Individual',
    startDate: '2022-03-01',
    status: 'Active',
    premium: 150,
    employerContribution: 120,
    employeeContribution: 30
  },
  {
    id: '3',
    benefitType: 'Retirement',
    planName: '401(k) Plan',
    coverage: 'Individual',
    startDate: '2022-03-01',
    status: 'Active',
    premium: 0,
    employerContribution: 285,
    employeeContribution: 285
  }
];

const leaveBalanceData = [
  { type: 'Annual Leave', total: 25, used: 8, remaining: 17 },
  { type: 'Sick Leave', total: 15, used: 3, remaining: 12 },
  { type: 'Personal Leave', total: 5, used: 1, remaining: 4 },
  { type: 'Maternity Leave', total: 90, used: 0, remaining: 90 }
];

const attendanceData = [
  { month: 'Jan', present: 22, absent: 1, late: 2 },
  { month: 'Feb', present: 20, absent: 0, late: 1 },
  { month: 'Mar', present: 23, absent: 0, late: 0 },
  { month: 'Apr', present: 21, absent: 1, late: 1 }
];

export default function EmployeeSelfService() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLeaveRequestOpen, setIsLeaveRequestOpen] = useState(false);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': case 'Approved': case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': case 'Expired': return 'bg-red-100 text-red-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Self-Service</h1>
          <p className="text-muted-foreground">Manage your profile, leave requests, and benefits</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leave Balance</p>
                <p className="text-2xl font-bold">17 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock3 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">22 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Pay</p>
                <p className="text-2xl font-bold">$7,125</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        {mockEmployeeProfile.avatar ? (
                          <img 
                            src={mockEmployeeProfile.avatar} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {mockEmployeeProfile.firstName} {mockEmployeeProfile.lastName}
                      </h3>
                      <p className="text-muted-foreground">{mockEmployeeProfile.position}</p>
                      <p className="text-sm text-muted-foreground">{mockEmployeeProfile.department}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{mockEmployeeProfile.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{mockEmployeeProfile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Employee ID: {mockEmployeeProfile.employeeId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Hired: {new Date(mockEmployeeProfile.hireDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setIsEditProfileOpen(true)} 
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Skills and Certifications */}
            <div className="lg:col-span-2 space-y-4">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5" />
                    <span>Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockEmployeeProfile.skills.map((skill) => (
                      <div key={skill.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{skill.name}</p>
                          <p className="text-sm text-muted-foreground">{skill.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLevelColor(skill.level)}>
                            {skill.level}
                          </Badge>
                          {skill.verified && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Certifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockEmployeeProfile.certifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                          <p className="text-xs text-muted-foreground">ID: {cert.credentialId}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(cert.status)}>
                            {cert.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            Issued: {new Date(cert.issueDate).toLocaleDateString()}
                          </p>
                          {cert.expiryDate && (
                            <p className="text-sm text-muted-foreground">
                              Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Leave Tab */}
        <TabsContent value="leave" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leave Balance */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leaveBalanceData.map((leave) => (
                    <div key={leave.type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{leave.type}</span>
                        <span className="font-medium">{leave.remaining}/{leave.total} days</span>
                      </div>
                      <Progress 
                        value={(leave.remaining / leave.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                  <Button 
                    onClick={() => setIsLeaveRequestOpen(true)} 
                    className="w-full mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Request Leave
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Leave Requests */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLeaveRequests.map((request) => (
                      <div key={request.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{request.type}</Badge>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="font-medium mt-2">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">{request.days} days</p>
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                          </p>
                          {request.approvedBy && (
                            <p className="text-sm text-muted-foreground">
                              Approved by: {request.approvedBy}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pay Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Pay Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Gross Pay</span>
                      <span className="font-medium">${mockPayslips[0].grossPay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deductions</span>
                      <span className="font-medium text-red-600">
                        -${mockPayslips[0].deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Allowances</span>
                      <span className="font-medium text-green-600">
                        +${mockPayslips[0].allowances.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Net Pay</span>
                        <span>${mockPayslips[0].netPay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payslips */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payslips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPayslips.map((payslip) => (
                      <div key={payslip.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{payslip.month} {payslip.year}</p>
                          <p className="text-sm text-muted-foreground">
                            Net Pay: ${payslip.netPay.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Status: {payslip.status}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Documents</CardTitle>
                <Button onClick={() => setIsDocumentUploadOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDocuments.map((document) => (
                  <div key={document.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">{document.type}</p>
                        <p className="text-sm text-muted-foreground">{document.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(document.fileSize * 1024 * 1024)} • {document.fileType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
                        </p>
                        {document.expiryDate && (
                          <p className="text-sm text-muted-foreground">
                            Expires: {new Date(document.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benefits Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBenefits.map((benefit) => (
                  <div key={benefit.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{benefit.benefitType}</Badge>
                          <Badge className={getStatusColor(benefit.status)}>
                            {benefit.status}
                          </Badge>
                        </div>
                        <p className="font-medium mt-2">{benefit.planName}</p>
                        <p className="text-sm text-muted-foreground">Coverage: {benefit.coverage}</p>
                        <p className="text-sm text-muted-foreground">
                          Start Date: {new Date(benefit.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${benefit.premium.toLocaleString()}/month</p>
                        <p className="text-sm text-muted-foreground">
                          Employer: ${benefit.employerContribution.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Employee: ${benefit.employeeContribution.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={mockEmployeeProfile.firstName} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={mockEmployeeProfile.lastName} />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={mockEmployeeProfile.email} />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue={mockEmployeeProfile.phone} />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                defaultValue={`${mockEmployeeProfile.address.street}, ${mockEmployeeProfile.address.city}, ${mockEmployeeProfile.address.state} ${mockEmployeeProfile.address.zipCode}`}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Request Dialog */}
      <Dialog open={isLeaveRequestOpen} onOpenChange={setIsLeaveRequestOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual">Annual Leave</SelectItem>
                  <SelectItem value="Sick">Sick Leave</SelectItem>
                  <SelectItem value="Personal">Personal Leave</SelectItem>
                  <SelectItem value="Maternity">Maternity Leave</SelectItem>
                  <SelectItem value="Paternity">Paternity Leave</SelectItem>
                  <SelectItem value="Bereavement">Bereavement Leave</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea 
                id="reason" 
                placeholder="Please provide a reason for your leave request..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsLeaveRequestOpen(false)}>
                Cancel
              </Button>
              <Button>Submit Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Upload Dialog */}
      <Dialog open={isDocumentUploadOpen} onOpenChange={setIsDocumentUploadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="documentName">Document Name</Label>
              <Input id="documentName" placeholder="Enter document name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentType">Document Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="ID">ID</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Form">Form</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Employment">Employment</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Benefits">Benefits</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input id="expiryDate" type="date" />
            </div>
            
            <div>
              <Label htmlFor="file">Upload File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Drop files here</p>
                <p className="text-gray-600 mb-4">or click to browse</p>
                <Button variant="outline">Choose Files</Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDocumentUploadOpen(false)}>
                Cancel
              </Button>
              <Button>Upload Document</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 