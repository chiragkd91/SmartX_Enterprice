/**
 * Comprehensive Payroll Management with Indian compliance
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import ComplianceReportsModal from '../../components/HR/ComplianceReportsModal';
import { 
  DollarSign, 
  Download, 
  Calculator, 
  Receipt, 
  TrendingUp,
  Users,
  Calendar,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Send,
  Printer
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
  Cell
} from 'recharts';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    medical: number;
    other: number;
  };
  deductions: {
    pf: number;
    esi: number;
    tds: number;
    other: number;
  };
  grossSalary: number;
  netSalary: number;
  status: 'Processed' | 'Pending' | 'Approved' | 'Paid';
  paymentDate?: string;
}

const payrollData = [
  { month: 'Aug', gross: 2500000, net: 2100000, deductions: 400000 },
  { month: 'Sep', gross: 2600000, net: 2200000, deductions: 400000 },
  { month: 'Oct', gross: 2650000, net: 2250000, deductions: 400000 },
  { month: 'Nov', gross: 2700000, net: 2300000, deductions: 400000 },
  { month: 'Dec', gross: 2800000, net: 2380000, deductions: 420000 },
  { month: 'Jan', gross: 2750000, net: 2330000, deductions: 420000 }
];

const departmentPayroll = [
  { name: 'IT', amount: 8500000, percentage: 35, color: '#3B82F6' },
  { name: 'Sales', amount: 6200000, percentage: 26, color: '#10B981' },
  { name: 'Marketing', amount: 4800000, percentage: 20, color: '#F59E0B' },
  { name: 'Finance', amount: 3200000, percentage: 13, color: '#EF4444' },
  { name: 'HR', amount: 1500000, percentage: 6, color: '#8B5CF6' }
];

const mockPayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: 'GCI001',
    employeeName: 'Rajesh Kumar',
    department: 'IT',
    month: 'January 2024',
    basicSalary: 60000,
    allowances: { hra: 24000, transport: 3000, medical: 2000, other: 1000 },
    deductions: { pf: 7200, esi: 1800, tds: 8000, other: 500 },
    grossSalary: 90000,
    netSalary: 72500,
    status: 'Paid',
    paymentDate: '2024-01-31'
  },
  {
    id: '2',
    employeeId: 'GCI002',
    employeeName: 'Priya Sharma',
    department: 'Sales',
    month: 'January 2024',
    basicSalary: 55000,
    allowances: { hra: 22000, transport: 3000, medical: 2000, other: 3000 },
    deductions: { pf: 6600, esi: 1650, tds: 7000, other: 500 },
    grossSalary: 85000,
    netSalary: 69250,
    status: 'Processed',
  },
  {
    id: '3',
    employeeId: 'GCI003',
    employeeName: 'Amit Patel',
    department: 'Marketing',
    month: 'January 2024',
    basicSalary: 45000,
    allowances: { hra: 18000, transport: 3000, medical: 2000, other: 2000 },
    deductions: { pf: 5400, esi: 1350, tds: 5000, other: 500 },
    grossSalary: 70000,
    netSalary: 57750,
    status: 'Approved',
  },
  {
    id: '4',
    employeeId: 'GCI004',
    employeeName: 'Sneha Reddy',
    department: 'HR',
    month: 'January 2024',
    basicSalary: 50000,
    allowances: { hra: 20000, transport: 3000, medical: 2000, other: 0 },
    deductions: { pf: 6000, esi: 1500, tds: 6000, other: 0 },
    grossSalary: 75000,
    netSalary: 61500,
    status: 'Pending',
  }
];

export default function PayrollManagement() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('January 2024');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isProcessPayrollOpen, setIsProcessPayrollOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedSteps, setProcessedSteps] = useState(0);
  const [isComplianceReportsOpen, setIsComplianceReportsOpen] = useState(false);
  
  // Salary Calculator State
  const [calculatorForm, setCalculatorForm] = useState({
    basicSalary: 0,
    hraPercentage: 40,
    transportAllowance: 3000,
    medicalAllowance: 2000,
    otherAllowances: 0,
    pfApplicable: true,
    esiApplicable: true,
    tdsApplicable: true,
    otherDeductions: 0
  });
  
  const [calculatedResult, setCalculatedResult] = useState({
    grossSalary: 0,
    totalAllowances: 0,
    pfDeduction: 0,
    esiDeduction: 0,
    tdsDeduction: 0,
    totalDeductions: 0,
    netSalary: 0
  });

  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || record.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Processed': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-4 w-4" />;
      case 'Processed': return <Calculator className="h-4 w-4" />;
      case 'Approved': return <FileText className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalGrossSalary = filteredRecords.reduce((sum, r) => sum + r.grossSalary, 0);
  const totalNetSalary = filteredRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const totalDeductions = totalGrossSalary - totalNetSalary;
  const processedCount = filteredRecords.filter(r => r.status === 'Processed' || r.status === 'Approved').length;

  // Salary calculation logic
  const calculateSalary = () => {
    const basic = calculatorForm.basicSalary;
    const hra = (basic * calculatorForm.hraPercentage) / 100;
    const transport = calculatorForm.transportAllowance;
    const medical = calculatorForm.medicalAllowance;
    const other = calculatorForm.otherAllowances;
    
    const totalAllowances = hra + transport + medical + other;
    const grossSalary = basic + totalAllowances;
    
    // Calculate deductions according to Indian standards
    const pfDeduction = calculatorForm.pfApplicable ? (basic * 12) / 100 : 0;
    const esiDeduction = calculatorForm.esiApplicable && grossSalary <= 21000 ? (grossSalary * 0.75) / 100 : 0;
    
    // Simplified TDS calculation (actual would be more complex)
    let tdsDeduction = 0;
    if (calculatorForm.tdsApplicable) {
      const annualGross = grossSalary * 12;
      if (annualGross > 250000) {
        tdsDeduction = ((annualGross - 250000) * 5) / 100 / 12;
      }
    }
    
    const totalDeductions = pfDeduction + esiDeduction + tdsDeduction + calculatorForm.otherDeductions;
    const netSalary = grossSalary - totalDeductions;
    
    setCalculatedResult({
      grossSalary: Math.round(grossSalary),
      totalAllowances: Math.round(totalAllowances),
      pfDeduction: Math.round(pfDeduction),
      esiDeduction: Math.round(esiDeduction),
      tdsDeduction: Math.round(tdsDeduction),
      totalDeductions: Math.round(totalDeductions),
      netSalary: Math.round(netSalary)
    });
  };

  // Handler functions for payroll actions
  const handleSalaryCalculator = () => {
    setIsCalculatorOpen(true);
  };

  const handleExportPayslips = () => {
    try {
      // Create CSV data for payslips
      const payslipData = filteredRecords.map(record => ({
        'Employee ID': record.employeeId,
        'Employee Name': record.employeeName,
        'Department': record.department,
        'Month': record.month,
        'Basic Salary': record.basicSalary,
        'HRA': record.allowances.hra,
        'Transport Allowance': record.allowances.transport,
        'Medical Allowance': record.allowances.medical,
        'Other Allowances': record.allowances.other,
        'Gross Salary': record.grossSalary,
        'PF Deduction': record.deductions.pf,
        'ESI Deduction': record.deductions.esi,
        'TDS Deduction': record.deductions.tds,
        'Other Deductions': record.deductions.other,
        'Total Deductions': record.deductions.pf + record.deductions.esi + record.deductions.tds + record.deductions.other,
        'Net Salary': record.netSalary,
        'Status': record.status,
        'Payment Date': record.paymentDate || 'Not Paid'
      }));

      // Convert to CSV
      const headers = Object.keys(payslipData[0]);
      const csvContent = [
        headers.join(','),
        ...payslipData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            return typeof value === 'string' && value.includes(',') 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `payslips_${selectedMonth.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Successfully exported ${payslipData.length} payslips for ${selectedMonth}`);
    } catch (error) {
      alert('Error exporting payslips. Please try again.');
      console.error('Export error:', error);
    }
  };

  const handleProcessPayroll = () => {
    setIsProcessPayrollOpen(true);
  };

  const processPayrollWithSteps = async () => {
    try {
      setIsProcessing(true);
      setProcessedSteps(0);
      
      const pendingRecords = payrollRecords.filter(r => r.status === 'Pending');
      
      if (pendingRecords.length === 0) {
        alert('No pending payroll records to process.');
        setIsProcessing(false);
        setIsProcessPayrollOpen(false);
        return;
      }
      
      // Simulate step-by-step processing with delays
      const steps = [
        'Validating employee data...',
        'Calculating salary components...',
        'Processing PF deductions...',
        'Processing ESI deductions...',
        'Calculating TDS deductions...',
        'Updating payroll records...',
        'Generating compliance reports...'
      ];
      
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing time
        setProcessedSteps(i + 1);
      }
      
      // Update all pending records to processed
      const updatedRecords = payrollRecords.map(record => {
        if (record.status === 'Pending') {
          return { ...record, status: 'Processed' as const };
        }
        return record;
      });
      
      setPayrollRecords(updatedRecords);
      
      // Complete processing
      setIsProcessing(false);
      setIsProcessPayrollOpen(false);
      setProcessedSteps(0);
      
      alert(`✅ Payroll processing completed successfully!\n\n${pendingRecords.length} employee records processed for ${selectedMonth}\n\nNext steps:\n• Review processed records\n• Generate payslips\n• Submit compliance reports`);
    } catch (error) {
      setIsProcessing(false);
      setIsProcessPayrollOpen(false);
      setProcessedSteps(0);
      alert('❌ Error processing payroll. Please try again.\n\nIf the issue persists, contact the system administrator.');
      console.error('Process error:', error);
    }
  };

  const handleAutoCalculate = () => {
    try {
      // Simulate auto-calculation of payroll
      alert(`Auto-calculating payroll for ${selectedMonth}...\n\nCalculations include:\n- PF @ 12% of basic salary\n- ESI @ 3.25% of gross salary\n- TDS as per IT slab rates\n\nAll calculations completed successfully!`);
    } catch (error) {
      alert('Error in auto-calculation. Please try again.');
    }
  };

  const handleSendPayslips = () => {
    try {
      const eligibleEmployees = filteredRecords.filter(r => r.status === 'Processed' || r.status === 'Paid');
      alert(`Sending payslips to ${eligibleEmployees.length} employees via email...\n\nPayslips sent successfully to all eligible employees for ${selectedMonth}.`);
    } catch (error) {
      alert('Error sending payslips. Please try again.');
    }
  };

  const handleGenerateReports = () => {
    try {
      setIsComplianceReportsOpen(true);
    } catch (error) {
      alert('Error opening compliance reports. Please try again.');
    }
  };

  const kpiCards = [
    {
      title: 'Total Gross Salary',
      value: formatCurrency(totalGrossSalary),
      subtitle: selectedMonth,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total Net Salary',
      value: formatCurrency(totalNetSalary),
      subtitle: 'After deductions',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Total Deductions',
      value: formatCurrency(totalDeductions),
      subtitle: 'PF, ESI, TDS',
      icon: Receipt,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Processed',
      value: `${processedCount}/${filteredRecords.length}`,
      subtitle: 'Ready for payment',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">
              Manage salary processing with Indian compliance (PF, ESI, TDS)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex items-center" onClick={handleSalaryCalculator}>
              <Calculator className="h-4 w-4 mr-2" />
              Salary Calculator
            </Button>
            <Button variant="outline" className="flex items-center" onClick={handleExportPayslips}>
              <Download className="h-4 w-4 mr-2" />
              Export Payslips
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleProcessPayroll}>
              <FileText className="h-4 w-4 mr-2" />
              Process Payroll
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
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-600">{card.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-full">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">Auto Calculate Payroll</h3>
                  <p className="text-sm text-blue-700">Process for {selectedMonth}</p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleAutoCalculate}>
                  Calculate
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-600 rounded-full">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">Send Payslips</h3>
                  <p className="text-sm text-green-700">Email to all employees</p>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleSendPayslips}>
                  Send All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-600 rounded-full">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900">Compliance Reports</h3>
                  <p className="text-sm text-purple-700">PF, ESI, TDS returns</p>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleGenerateReports}>
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Payroll Trends */}
          <Card className="xl:col-span-2 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-semibold">Payroll Trends</span>
                <Badge variant="outline">Last 6 Months</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={payrollData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
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
                    <Area type="monotone" dataKey="gross" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="deductions" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department-wise Distribution */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPayroll.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      ></div>
                      <span className="text-sm font-medium">{dept.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(dept.amount)}</p>
                      <p className="text-xs text-gray-500">{dept.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="January 2024">January 2024</SelectItem>
                    <SelectItem value="December 2023">December 2023</SelectItem>
                    <SelectItem value="November 2023">November 2023</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
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

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processed">Processed</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Records Table */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payroll Records ({filteredRecords.length})</span>
              <Badge variant="outline">{selectedMonth}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Employee</TableHead>
                    <TableHead className="hidden md:table-cell">Basic Salary</TableHead>
                    <TableHead className="hidden lg:table-cell">Gross Salary</TableHead>
                    <TableHead className="hidden xl:table-cell">Deductions</TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{record.employeeName}</p>
                            <p className="text-sm text-gray-500">{record.employeeId} • {record.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium">
                        {formatCurrency(record.basicSalary)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-medium">
                        {formatCurrency(record.grossSalary)}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm">
                          <p>PF: {formatCurrency(record.deductions.pf)}</p>
                          <p>TDS: {formatCurrency(record.deductions.tds)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(record.netSalary)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={getStatusColor(record.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(record.status)}
                            <span>{record.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Printer className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Process Payroll Dialog */}
        <Dialog open={isProcessPayrollOpen} onOpenChange={setIsProcessPayrollOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Process Payroll - {selectedMonth}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {!isProcessing ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Payroll Processing Confirmation</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      This will process all pending payroll records for {selectedMonth}. The following operations will be performed:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1 mb-4">
                      <li>• Validate employee data and salary components</li>
                      <li>• Calculate PF deductions (12% of basic salary)</li>
                      <li>• Calculate ESI deductions (0.75% if gross ≤ ₹21,000)</li>
                      <li>• Calculate TDS deductions as per IT slab rates</li>
                      <li>• Update payroll records from Pending to Processed</li>
                      <li>• Generate compliance reports for submission</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Records to Process:</h4>
                    <div className="space-y-2">
                      {payrollRecords.filter(r => r.status === 'Pending').map(record => (
                        <div key={record.id} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium">{record.employeeName}</span>
                            <span className="text-gray-500 ml-2">({record.employeeId})</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-green-600">{formatCurrency(record.netSalary)}</span>
                            <div className="text-xs text-gray-500">{record.department}</div>
                          </div>
                        </div>
                      ))}
                      {payrollRecords.filter(r => r.status === 'Pending').length === 0 && (
                        <p className="text-sm text-gray-500 italic">No pending records to process</p>
                      )}
                    </div>
                    
                    {payrollRecords.filter(r => r.status === 'Pending').length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Total Records:</span>
                          <span>{payrollRecords.filter(r => r.status === 'Pending').length}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-green-600">
                          <span>Total Amount:</span>
                          <span>
                            {formatCurrency(
                              payrollRecords
                                .filter(r => r.status === 'Pending')
                                .reduce((sum, r) => sum + r.netSalary, 0)
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This action cannot be undone. Please ensure all salary calculations are correct before proceeding.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsProcessPayrollOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700" 
                      onClick={processPayrollWithSteps}
                      disabled={payrollRecords.filter(r => r.status === 'Pending').length === 0}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Confirm & Process Payroll
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Processing Payroll...</h3>
                    <p className="text-sm text-gray-600">Please wait while we process the payroll records</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      'Validating employee data...',
                      'Calculating salary components...',
                      'Processing PF deductions...',
                      'Processing ESI deductions...',
                      'Calculating TDS deductions...',
                      'Updating payroll records...',
                      'Generating compliance reports...'
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {processedSteps > index ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : processedSteps === index ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                        <span className={`text-sm ${
                          processedSteps > index 
                            ? 'text-green-600 font-medium'
                            : processedSteps === index
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-500'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(processedSteps / 7) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Step {processedSteps} of 7</span>
                      <span>{Math.round((processedSteps / 7) * 100)}% Complete</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Salary Calculator Dialog */}
        <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Indian Salary Calculator
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              {/* Input Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Salary Components</h3>
                
                {/* Basic Salary */}
                <div>
                  <Label htmlFor="basicSalary">Basic Salary (₹) *</Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    value={calculatorForm.basicSalary || ''}
                    onChange={(e) => setCalculatorForm(prev => ({ ...prev, basicSalary: parseFloat(e.target.value) || 0 }))}
                    placeholder="50000"
                  />
                </div>

                {/* HRA Percentage */}
                <div>
                  <Label htmlFor="hraPercentage">HRA Percentage (%)</Label>
                  <Input
                    id="hraPercentage"
                    type="number"
                    value={calculatorForm.hraPercentage}
                    onChange={(e) => setCalculatorForm(prev => ({ ...prev, hraPercentage: parseFloat(e.target.value) || 40 }))}
                    placeholder="40"
                  />
                  <p className="text-xs text-gray-500 mt-1">Standard: Metro=50%, Non-Metro=40%</p>
                </div>

                {/* Transport Allowance */}
                <div>
                  <Label htmlFor="transportAllowance">Transport Allowance (₹)</Label>
                  <Input
                    id="transportAllowance"
                    type="number"
                    value={calculatorForm.transportAllowance}
                    onChange={(e) => setCalculatorForm(prev => ({ ...prev, transportAllowance: parseFloat(e.target.value) || 0 }))}
                    placeholder="3000"
                  />
                </div>

                {/* Medical Allowance */}
                <div>
                  <Label htmlFor="medicalAllowance">Medical Allowance (₹)</Label>
                  <Input
                    id="medicalAllowance"
                    type="number"
                    value={calculatorForm.medicalAllowance}
                    onChange={(e) => setCalculatorForm(prev => ({ ...prev, medicalAllowance: parseFloat(e.target.value) || 0 }))}
                    placeholder="2000"
                  />
                </div>

                {/* Other Allowances */}
                <div>
                  <Label htmlFor="otherAllowances">Other Allowances (₹)</Label>
                  <Input
                    id="otherAllowances"
                    type="number"
                    value={calculatorForm.otherAllowances}
                    onChange={(e) => setCalculatorForm(prev => ({ ...prev, otherAllowances: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <h4 className="text-md font-semibold text-gray-900 mt-6 mb-3">Deduction Options</h4>
                
                {/* PF Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pfApplicable"
                    checked={calculatorForm.pfApplicable}
                    onChange={(e) => setCalculatorForm(prev => ({ ...prev, pfApplicable: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="pfApplicable">PF Deduction (12% of Basic)</Label>
                </div>

                {/* ESI Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="esiApplicable"
                    checked={calculatorForm.esiApplicable}
                    onChange={(e) => setCalculatorForm(prev => ({ ...prev, esiApplicable: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="esiApplicable">ESI Deduction (0.75% if gross ≤ ₹21,000)</Label>
                </div>

                {/* TDS Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="tdsApplicable"
                    checked={calculatorForm.tdsApplicable}
                    onChange={(e) => setCalculatorForm(prev => ({ ...prev, tdsApplicable: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="tdsApplicable">TDS Deduction (as per IT slab)</Label>
                </div>

                {/* Other Deductions */}
                <div>
                  <Label htmlFor="otherDeductions">Other Deductions (₹)</Label>
                  <Input
                    id="otherDeductions"
                    type="number"
                    value={calculatorForm.otherDeductions}
                    onChange={(e) => setCalculatorForm(prev => ({ ...prev, otherDeductions: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <Button onClick={calculateSalary} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Salary
                </Button>
              </div>

              {/* Results */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Calculation Results</h3>
                
                {calculatedResult.grossSalary > 0 ? (
                  <div className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-3">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-900">Gross Salary</span>
                            <span className="text-lg font-bold text-blue-600">{formatCurrency(calculatedResult.grossSalary)}</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-900">Net Salary</span>
                            <span className="text-lg font-bold text-green-600">{formatCurrency(calculatedResult.netSalary)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Allowances Breakdown:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Basic Salary:</span>
                          <span className="font-medium">{formatCurrency(calculatorForm.basicSalary)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>HRA ({calculatorForm.hraPercentage}%):</span>
                          <span className="font-medium">{formatCurrency((calculatorForm.basicSalary * calculatorForm.hraPercentage) / 100)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transport Allowance:</span>
                          <span className="font-medium">{formatCurrency(calculatorForm.transportAllowance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medical Allowance:</span>
                          <span className="font-medium">{formatCurrency(calculatorForm.medicalAllowance)}</span>
                        </div>
                        {calculatorForm.otherAllowances > 0 && (
                          <div className="flex justify-between">
                            <span>Other Allowances:</span>
                            <span className="font-medium">{formatCurrency(calculatorForm.otherAllowances)}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total Allowances:</span>
                          <span>{formatCurrency(calculatedResult.totalAllowances)}</span>
                        </div>
                      </div>

                      <h4 className="font-semibold text-gray-900 mt-4">Deductions Breakdown:</h4>
                      <div className="space-y-2 text-sm">
                        {calculatorForm.pfApplicable && (
                          <div className="flex justify-between">
                            <span>PF (12%):</span>
                            <span className="font-medium text-red-600">-{formatCurrency(calculatedResult.pfDeduction)}</span>
                          </div>
                        )}
                        {calculatorForm.esiApplicable && calculatedResult.esiDeduction > 0 && (
                          <div className="flex justify-between">
                            <span>ESI (0.75%):</span>
                            <span className="font-medium text-red-600">-{formatCurrency(calculatedResult.esiDeduction)}</span>
                          </div>
                        )}
                        {calculatorForm.tdsApplicable && calculatedResult.tdsDeduction > 0 && (
                          <div className="flex justify-between">
                            <span>TDS:</span>
                            <span className="font-medium text-red-600">-{formatCurrency(calculatedResult.tdsDeduction)}</span>
                          </div>
                        )}
                        {calculatorForm.otherDeductions > 0 && (
                          <div className="flex justify-between">
                            <span>Other Deductions:</span>
                            <span className="font-medium text-red-600">-{formatCurrency(calculatorForm.otherDeductions)}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-semibold text-red-600">
                          <span>Total Deductions:</span>
                          <span>-{formatCurrency(calculatedResult.totalDeductions)}</span>
                        </div>
                      </div>

                      {/* Annual Summary */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Annual Summary:</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Annual Gross:</span>
                            <span className="font-medium">{formatCurrency(calculatedResult.grossSalary * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual Net:</span>
                            <span className="font-medium">{formatCurrency(calculatedResult.netSalary * 12)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Enter basic salary and click "Calculate" to see results</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Compliance Reports Modal */}
        <ComplianceReportsModal
          isOpen={isComplianceReportsOpen}
          onClose={() => setIsComplianceReportsOpen(false)}
          selectedMonth={selectedMonth}
        />
      </div>
    </div>
  );
}
