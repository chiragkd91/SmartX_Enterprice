import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  Users, 
  Clock, 
  DollarSign, 
  Target, 
  Award, 
  FileText,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  reportTitle: string;
}

export default function ReportModal({ isOpen, onClose, reportType, reportTitle }: ReportModalProps) {
  // Sample data for different report types
  const getReportData = (type: string) => {
    switch (type) {
      case 'Employee Directory':
        return {
          summary: {
            totalEmployees: 270,
            activeEmployees: 265,
            onLeave: 5,
            newHires: 12
          },
          employees: [
            { id: 'EMP001', name: 'John Doe', email: 'john.doe@company.com', department: 'IT', position: 'Software Engineer', phone: '+1-555-0101', hireDate: '2023-01-15', status: 'Active', location: 'New York' },
            { id: 'EMP002', name: 'Jane Smith', email: 'jane.smith@company.com', department: 'HR', position: 'HR Manager', phone: '+1-555-0102', hireDate: '2022-03-10', status: 'Active', location: 'California' },
            { id: 'EMP003', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Sales', position: 'Sales Executive', phone: '+1-555-0103', hireDate: '2023-06-20', status: 'Active', location: 'Texas' },
            { id: 'EMP004', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Marketing', position: 'Marketing Manager', phone: '+1-555-0104', hireDate: '2022-11-08', status: 'Active', location: 'Florida' },
            { id: 'EMP005', name: 'David Brown', email: 'david.brown@company.com', department: 'Finance', position: 'Financial Analyst', phone: '+1-555-0105', hireDate: '2023-02-14', status: 'On Leave', location: 'Illinois' }
          ],
          departmentBreakdown: [
            { department: 'IT', count: 85, color: '#3B82F6' },
            { department: 'Sales', count: 65, color: '#10B981' },
            { department: 'Marketing', count: 45, color: '#F59E0B' },
            { department: 'HR', count: 35, color: '#EF4444' },
            { department: 'Finance', count: 40, color: '#8B5CF6' }
          ]
        };

      case 'Attendance Summary':
        return {
          summary: {
            overallAttendance: 95.2,
            onTime: 92.1,
            lateArrivals: 3.1,
            absences: 4.8
          },
          attendanceData: [
            { date: '2024-01-15', present: 250, late: 8, absent: 12 },
            { date: '2024-01-16', present: 255, late: 6, absent: 9 },
            { date: '2024-01-17', present: 248, late: 10, absent: 12 },
            { date: '2024-01-18', present: 260, late: 5, absent: 5 },
            { date: '2024-01-19', present: 252, late: 9, absent: 9 }
          ],
          departmentAttendance: [
            { department: 'IT', attendance: 96.5, color: '#10B981' },
            { department: 'Sales', attendance: 94.2, color: '#3B82F6' },
            { department: 'Marketing', attendance: 93.8, color: '#F59E0B' },
            { department: 'HR', attendance: 98.1, color: '#8B5CF6' },
            { department: 'Finance', attendance: 95.7, color: '#EF4444' }
          ]
        };

      case 'Payroll Report':
        return {
          summary: {
            totalPayroll: 21545000,
            avgSalary: 79800,
            taxDeductions: 3231750,
            netPayout: 18313250
          },
          salaryData: [
            { level: 'Entry', min: 300000, avg: 450000, max: 600000, count: 85 },
            { level: 'Mid', min: 600000, avg: 850000, max: 1200000, count: 95 },
            { level: 'Senior', min: 1200000, avg: 1650000, max: 2500000, count: 65 },
            { level: 'Lead', min: 2000000, avg: 2800000, max: 3500000, count: 20 },
            { level: 'Manager', min: 2500000, avg: 3200000, max: 4000000, count: 5 }
          ],
          payrollTrends: [
            { month: 'Aug', amount: 20500000, employees: 242 },
            { month: 'Sep', amount: 20800000, employees: 248 },
            { month: 'Oct', amount: 21200000, employees: 255 },
            { month: 'Nov', amount: 21400000, employees: 263 },
            { month: 'Dec', amount: 21545000, employees: 270 }
          ]
        };

      case 'Performance Reviews':
        return {
          summary: {
            reviewsCompleted: 245,
            totalEmployees: 270,
            avgRating: 4.2,
            excellent: 35,
            good: 40,
            needsImprovement: 5
          },
          performanceData: [
            { rating: 'Excellent (4.5-5.0)', count: 85, percentage: 35, color: '#10B981' },
            { rating: 'Good (3.5-4.4)', count: 98, percentage: 40, color: '#3B82F6' },
            { rating: 'Average (2.5-3.4)', count: 49, percentage: 20, color: '#F59E0B' },
            { rating: 'Needs Improvement (<2.5)', count: 13, percentage: 5, color: '#EF4444' }
          ],
          departmentPerformance: [
            { department: 'IT', avgRating: 4.3, reviews: 85 },
            { department: 'Sales', avgRating: 4.1, reviews: 65 },
            { department: 'Marketing', avgRating: 4.0, reviews: 45 },
            { department: 'HR', avgRating: 4.5, reviews: 35 },
            { department: 'Finance', avgRating: 4.2, reviews: 40 }
          ]
        };

      case 'Training Records':
        return {
          summary: {
            coursesAvailable: 25,
            totalEnrollments: 450,
            completionRate: 82,
            avgSatisfaction: 4.2
          },
          trainingData: [
            { program: 'Leadership Skills', enrolled: 100, completed: 85, satisfaction: 4.5, status: 'Active' },
            { program: 'Technical Skills', enrolled: 150, completed: 120, satisfaction: 4.2, status: 'Active' },
            { program: 'Compliance Training', enrolled: 220, completed: 200, satisfaction: 3.8, status: 'Mandatory' },
            { program: 'Soft Skills', enrolled: 110, completed: 95, satisfaction: 4.3, status: 'Active' },
            { program: 'Safety Training', enrolled: 270, completed: 245, satisfaction: 4.0, status: 'Mandatory' }
          ],
          completionTrends: [
            { month: 'Aug', completed: 180, enrolled: 220 },
            { month: 'Sep', completed: 200, enrolled: 250 },
            { month: 'Oct', completed: 240, enrolled: 290 },
            { month: 'Nov', completed: 280, enrolled: 340 },
            { month: 'Dec', completed: 320, enrolled: 380 }
          ]
        };

      case 'Compliance Report':
        return {
          summary: {
            complianceRate: 95,
            validDocuments: 256,
            totalRequired: 270,
            expiringSoon: 8,
            actionRequired: 14
          },
          complianceData: [
            { type: 'Data Protection Certificate', valid: 245, expired: 15, expiring: 10, total: 270 },
            { type: 'Safety Training', valid: 260, expired: 5, expiring: 5, total: 270 },
            { type: 'Code of Conduct', valid: 268, expired: 2, expiring: 0, total: 270 },
            { type: 'Background Check', valid: 270, expired: 0, expiring: 0, total: 270 }
          ],
          complianceStatus: [
            { status: 'Compliant', count: 245, percentage: 91, color: '#10B981' },
            { status: 'Expiring Soon', count: 14, percentage: 5, color: '#F59E0B' },
            { status: 'Non-Compliant', count: 11, percentage: 4, color: '#EF4444' }
          ]
        };

      default:
        return null;
    }
  };

  const data = getReportData(reportType);
  if (!data) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderEmployeeDirectory = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{data.summary.totalEmployees}</p>
                <p className="text-sm text-gray-600">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{data.summary.activeEmployees}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{data.summary.onLeave}</p>
                <p className="text-sm text-gray-600">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{data.summary.newHires}</p>
                <p className="text-sm text-gray-600">New Hires</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Department Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="count"
                  data={data.departmentBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ department, count }) => `${department}: ${count}`}
                >
                  {data.departmentBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Department</th>
                  <th className="text-left p-2">Position</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.employees?.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{emp.id}</td>
                    <td className="p-2">{emp.name}</td>
                    <td className="p-2">{emp.department}</td>
                    <td className="p-2">{emp.position}</td>
                    <td className="p-2">{emp.email}</td>
                    <td className="p-2">
                      <Badge variant={emp.status === 'Active' ? 'default' : 'secondary'}>
                        {emp.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAttendanceSummary = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{data.summary.overallAttendance}%</p>
                <p className="text-sm text-gray-600">Overall Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{data.summary.onTime}%</p>
                <p className="text-sm text-gray-600">On Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{data.summary.lateArrivals}%</p>
                <p className="text-sm text-gray-600">Late Arrivals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{data.summary.absences}%</p>
                <p className="text-sm text-gray-600">Absences</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="present" stackId="1" stroke="#10B981" fill="#10B981" />
                <Area type="monotone" dataKey="late" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                <Area type="monotone" dataKey="absent" stackId="1" stroke="#EF4444" fill="#EF4444" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Department Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Attendance Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.departmentAttendance?.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between">
                <span className="font-medium">{dept.department}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${dept.attendance}%`,
                        backgroundColor: dept.color
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{dept.attendance}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (reportType) {
      case 'Employee Directory':
        return renderEmployeeDirectory();
      case 'Attendance Summary':
        return renderAttendanceSummary();
      // Add other report types here...
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Report content is being loaded...</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">{reportTitle}</DialogTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
