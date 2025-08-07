/**
 * Comprehensive HR Reports and Analytics Dashboard
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import ReportModal from '../../components/ReportModal';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar as CalendarIcon,
  Download,
  FileText,
  PieChart,
  Target,
  Award,
  Clock,
  DollarSign,
  UserCheck,
  AlertTriangle,
  Building2,
  Filter,
  Eye
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { format } from 'date-fns';

// Sample data for various HR reports
const headcountTrends = [
  { month: 'Jul', total: 235, hires: 8, departures: 5, netGrowth: 3 },
  { month: 'Aug', total: 242, hires: 12, departures: 5, netGrowth: 7 },
  { month: 'Sep', total: 248, hires: 10, departures: 4, netGrowth: 6 },
  { month: 'Oct', total: 255, hires: 15, departures: 8, netGrowth: 7 },
  { month: 'Nov', total: 263, hires: 18, departures: 10, netGrowth: 8 },
  { month: 'Dec', total: 270, hires: 12, departures: 5, netGrowth: 7 }
];

const attendanceData = [
  { department: 'IT', present: 95, late: 3, absent: 2 },
  { department: 'Sales', present: 92, late: 5, absent: 3 },
  { department: 'Marketing', present: 94, late: 4, absent: 2 },
  { department: 'HR', present: 98, late: 1, absent: 1 },
  { department: 'Finance', present: 96, late: 2, absent: 2 }
];

const performanceDistribution = [
  { name: 'Excellent', value: 35, color: '#10B981' },
  { name: 'Good', value: 40, color: '#3B82F6' },
  { name: 'Average', value: 20, color: '#F59E0B' },
  { name: 'Needs Improvement', value: 5, color: '#EF4444' }
];

const salaryAnalysis = [
  { level: 'Entry', min: 300000, avg: 450000, max: 600000 },
  { level: 'Mid', min: 600000, avg: 850000, max: 1200000 },
  { level: 'Senior', min: 1200000, avg: 1650000, max: 2500000 },
  { level: 'Lead', min: 2000000, avg: 2800000, max: 3500000 },
  { level: 'Manager', min: 2500000, avg: 3200000, max: 4000000 }
];

const turnoverData = [
  { month: 'Jul', voluntary: 3, involuntary: 1, rate: 1.7 },
  { month: 'Aug', voluntary: 4, involuntary: 1, rate: 2.1 },
  { month: 'Sep', voluntary: 2, involuntary: 2, rate: 1.6 },
  { month: 'Oct', voluntary: 5, involuntary: 3, rate: 3.1 },
  { month: 'Nov', voluntary: 6, involuntary: 4, rate: 3.8 },
  { month: 'Dec', voluntary: 3, involuntary: 2, rate: 1.9 }
];

const trainingMetrics = [
  { program: 'Leadership', completed: 85, enrolled: 100, satisfaction: 4.5 },
  { program: 'Technical Skills', completed: 120, enrolled: 150, satisfaction: 4.2 },
  { program: 'Compliance', completed: 200, enrolled: 220, satisfaction: 3.8 },
  { program: 'Soft Skills', completed: 95, enrolled: 110, satisfaction: 4.3 }
];

export default function HRReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState<{start: Date | undefined, end: Date | undefined}>({
    start: undefined,
    end: undefined
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{type: string, title: string}>({ type: '', title: '' });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportReport = (reportType: string) => {
    try {
      // Generate CSV data based on report type
      let csvData = '';
      let filename = '';
      
      switch (reportType) {
        case 'directory':
          csvData = generateEmployeeDirectoryCSV();
          filename = 'employee_directory.csv';
          break;
        case 'attendance':
          csvData = generateAttendanceReportCSV();
          filename = 'attendance_summary.csv';
          break;
        case 'payroll':
          csvData = generatePayrollReportCSV();
          filename = 'payroll_report.csv';
          break;
        case 'performance':
          csvData = generatePerformanceReviewCSV();
          filename = 'performance_reviews.csv';
          break;
        case 'training':
          csvData = generateTrainingRecordsCSV();
          filename = 'training_records.csv';
          break;
        case 'compliance':
          csvData = generateComplianceReportCSV();
          filename = 'compliance_report.csv';
          break;
        default:
          console.log(`Unknown report type: ${reportType}`);
          return;
      }
      
      // Create and trigger download
      downloadCSV(csvData, filename);
      
      // Show success message (you can integrate with a toast notification)
      console.log(`Successfully exported ${reportType} report as ${filename}`);
    } catch (error) {
      console.error(`Error exporting ${reportType} report:`, error);
    }
  };
  
  const downloadCSV = (csvData: string, filename: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const generateEmployeeDirectoryCSV = () => {
    const headers = ['Employee ID', 'Full Name', 'Email', 'Department', 'Position', 'Phone', 'Hire Date', 'Status'];
    const sampleEmployees = [
      ['EMP001', 'John Doe', 'john.doe@company.com', 'IT', 'Software Engineer', '+1-555-0101', '2023-01-15', 'Active'],
      ['EMP002', 'Jane Smith', 'jane.smith@company.com', 'HR', 'HR Manager', '+1-555-0102', '2022-03-10', 'Active'],
      ['EMP003', 'Mike Johnson', 'mike.johnson@company.com', 'Sales', 'Sales Executive', '+1-555-0103', '2023-06-20', 'Active'],
      ['EMP004', 'Sarah Wilson', 'sarah.wilson@company.com', 'Marketing', 'Marketing Manager', '+1-555-0104', '2022-11-08', 'Active'],
      ['EMP005', 'David Brown', 'david.brown@company.com', 'Finance', 'Financial Analyst', '+1-555-0105', '2023-02-14', 'Active']
    ];
    
    return [headers, ...sampleEmployees]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };
  
  const generateAttendanceReportCSV = () => {
    const headers = ['Date', 'Employee Name', 'Department', 'Check In', 'Check Out', 'Total Hours', 'Status'];
    const sampleData = [
      ['2024-01-15', 'John Doe', 'IT', '09:00 AM', '06:00 PM', '9.0', 'Present'],
      ['2024-01-15', 'Jane Smith', 'HR', '09:15 AM', '06:00 PM', '8.75', 'Late'],
      ['2024-01-15', 'Mike Johnson', 'Sales', '09:00 AM', '06:00 PM', '9.0', 'Present'],
      ['2024-01-15', 'Sarah Wilson', 'Marketing', '--', '--', '0', 'Absent'],
      ['2024-01-15', 'David Brown', 'Finance', '10:00 AM', '02:00 PM', '4.0', 'Half Day']
    ];
    
    return [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };
  
  const generatePayrollReportCSV = () => {
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Pay Date'];
    const sampleData = [
      ['EMP001', 'John Doe', 'IT', '₹75,000', '₹15,000', '₹8,500', '₹81,500', '2024-01-31'],
      ['EMP002', 'Jane Smith', 'HR', '₹65,000', '₹12,000', '₹7,200', '₹69,800', '2024-01-31'],
      ['EMP003', 'Mike Johnson', 'Sales', '₹55,000', '₹18,000', '₹6,800', '₹66,200', '2024-01-31'],
      ['EMP004', 'Sarah Wilson', 'Marketing', '₹60,000', '₹14,000', '₹7,000', '₹67,000', '2024-01-31'],
      ['EMP005', 'David Brown', 'Finance', '₹70,000', '₹13,000', '₹7,800', '₹75,200', '2024-01-31']
    ];
    
    return [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };
  
  const generatePerformanceReviewCSV = () => {
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Review Period', 'Overall Rating', 'Goals Achieved', 'Manager Rating', 'Comments'];
    const sampleData = [
      ['EMP001', 'John Doe', 'IT', 'Q4 2023', '4.5/5', '8/10', 'Excellent', 'Outstanding performance and technical skills'],
      ['EMP002', 'Jane Smith', 'HR', 'Q4 2023', '4.8/5', '9/10', 'Excellent', 'Exceptional leadership and team management'],
      ['EMP003', 'Mike Johnson', 'Sales', 'Q4 2023', '4.2/5', '7/8', 'Good', 'Strong sales performance, exceeded targets'],
      ['EMP004', 'Sarah Wilson', 'Marketing', 'Q4 2023', '4.0/5', '6/8', 'Good', 'Creative campaigns, good results'],
      ['EMP005', 'David Brown', 'Finance', 'Q4 2023', '4.3/5', '7/9', 'Good', 'Accurate reporting and analysis']
    ];
    
    return [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };
  
  const generateTrainingRecordsCSV = () => {
    const headers = ['Employee Name', 'Training Program', 'Start Date', 'Completion Date', 'Status', 'Score', 'Certification'];
    const sampleData = [
      ['John Doe', 'Leadership Skills', '2023-10-01', '2023-11-15', 'Completed', '95%', 'Certified'],
      ['Jane Smith', 'Technical Skills', '2023-09-15', '2023-10-30', 'Completed', '88%', 'Certified'],
      ['Mike Johnson', 'Sales Training', '2023-11-01', 'In Progress', 'In Progress', '--', 'Pending'],
      ['Sarah Wilson', 'Digital Marketing', '2023-08-20', '2023-09-25', 'Completed', '92%', 'Certified'],
      ['David Brown', 'Financial Analysis', '2023-10-15', '2023-12-01', 'Completed', '90%', 'Certified']
    ];
    
    return [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };
  
  const generateComplianceReportCSV = () => {
    const headers = ['Employee Name', 'Department', 'Document Type', 'Status', 'Expiry Date', 'Compliance Score', 'Action Required'];
    const sampleData = [
      ['John Doe', 'IT', 'Data Protection Certificate', 'Valid', '2024-12-31', '100%', 'None'],
      ['Jane Smith', 'HR', 'HR Compliance Training', 'Valid', '2024-06-30', '100%', 'None'],
      ['Mike Johnson', 'Sales', 'Sales Ethics Certificate', 'Expired', '2023-12-31', '75%', 'Renewal Required'],
      ['Sarah Wilson', 'Marketing', 'GDPR Compliance', 'Valid', '2024-08-15', '100%', 'None'],
      ['David Brown', 'Finance', 'Financial Regulations', 'Valid', '2024-10-30', '100%', 'None']
    ];
    
    return [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };
  
  const viewReport = (reportTitle: string) => {
    console.log(`Opening ${reportTitle} report for viewing...`);
    setSelectedReport({ type: reportTitle, title: reportTitle });
    setModalOpen(true);
  };

  // Calculate key metrics
  const currentHeadcount = headcountTrends[headcountTrends.length - 1].total;
  const monthlyGrowth = headcountTrends[headcountTrends.length - 1].netGrowth;
  const avgAttendance = attendanceData.reduce((sum, dept) => sum + dept.present, 0) / attendanceData.length;
  const currentTurnover = turnoverData[turnoverData.length - 1].rate;

  const kpiCards = [
    {
      title: 'Total Headcount',
      value: currentHeadcount.toString(),
      change: `+${monthlyGrowth} this month`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Attendance Rate',
      value: `${avgAttendance.toFixed(1)}%`,
      change: '+2.1% vs last month',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Turnover Rate',
      value: `${currentTurnover}%`,
      change: '-0.8% vs last month',
      changeType: 'negative' as const,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Performance Score',
      value: '4.2/5',
      change: '+0.3 improvement',
      changeType: 'positive' as const,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const reportCards = [
    {
      title: 'Employee Directory',
      description: 'Complete list of all employees with contact information',
      icon: Users,
      action: () => exportReport('directory')
    },
    {
      title: 'Attendance Summary',
      description: 'Monthly attendance report by department and individual',
      icon: Clock,
      action: () => exportReport('attendance')
    },
    {
      title: 'Payroll Report',
      description: 'Salary breakdown, deductions, and tax calculations',
      icon: DollarSign,
      action: () => exportReport('payroll')
    },
    {
      title: 'Performance Reviews',
      description: 'Employee performance ratings and goal achievements',
      icon: Target,
      action: () => exportReport('performance')
    },
    {
      title: 'Training Records',
      description: 'Training completion status and certification tracking',
      icon: Award,
      action: () => exportReport('training')
    },
    {
      title: 'Compliance Report',
      description: 'Regulatory compliance status and documentation',
      icon: FileText,
      action: () => exportReport('compliance')
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">HR Reports & Analytics</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">
              Comprehensive insights into workforce metrics and trends
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.start}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export All Reports
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className={`${card.bgColor} ${card.borderColor} border shadow-sm hover:shadow-md transition-shadow`}>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      card.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {card.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-600">{card.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                    <SelectItem value="thisQuarter">This Quarter</SelectItem>
                    <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                    <SelectItem value="thisYear">This Year</SelectItem>
                    <SelectItem value="lastYear">Last Year</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Headcount Trends */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-semibold">Headcount Trends</span>
                <Badge variant="outline">Last 6 Months</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={headcountTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="hires" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Performance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={performanceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {performanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Attendance */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Department Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="department" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="present" fill="#10B981" />
                    <Bar dataKey="late" fill="#F59E0B" />
                    <Bar dataKey="absent" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Turnover Analysis */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Turnover Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={turnoverData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="voluntary" stroke="#F59E0B" strokeWidth={2} />
                    <Line type="monotone" dataKey="involuntary" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary Analysis */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Salary Analysis by Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="level" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [formatCurrency(value), '']}
                  />
                  <Bar dataKey="min" fill="#94A3B8" />
                  <Bar dataKey="avg" fill="#3B82F6" />
                  <Bar dataKey="max" fill="#1E40AF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportCards.map((report) => {
                const Icon = report.icon;
                return (
                  <div
                    key={report.title}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={report.action}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        <div className="flex items-center space-x-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click event
                              report.action();
                            }}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                          <Button 
                            size="sm" 
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click event
                              viewReport(report.title);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Report Modal */}
      <ReportModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        reportType={selectedReport.type} 
        reportTitle={selectedReport.title} 
      />
    </div>
  );
}
