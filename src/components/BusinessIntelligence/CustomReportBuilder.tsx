/**
 * Custom Report Builder - Drag and Drop Interface
 * Advanced report creation with multiple visualization options
 */

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Zap,
  Table,
  Download,
  Save,
  Eye,
  Settings,
  Plus,
  Trash2,
  Move,
  Filter,
  Calendar,
  Database,
  Palette,
  Layout,
  Type,
  Grid3X3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ScatterChart as RechartsScatterChart,
  Scatter as RechartsScatter
} from 'recharts';

interface ChartComponent {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'table';
  title: string;
  data: any[];
  config: ChartConfig;
  position: { x: number; y: number; w: number; h: number };
}

interface ChartConfig {
  dataKey: string;
  color: string;
  title: string;
  xAxis?: string;
  yAxis?: string;
  options: any;
}

interface DataSource {
  id: string;
  name: string;
  description: string;
  fields: DataField[];
  sampleData: any[];
}

interface DataField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  label: string;
}

const AVAILABLE_CHARTS = [
  { type: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
  { type: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { type: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
  { type: 'scatter', name: 'Scatter Plot', icon: Zap, description: 'Show correlation between variables' },
  { type: 'table', name: 'Data Table', icon: Table, description: 'Display data in tabular format' }
];

const DATA_SOURCES: DataSource[] = [
  {
    id: 'sales',
    name: 'Sales Data',
    description: 'Revenue, orders, and customer information',
    fields: [
      { name: 'date', type: 'date', label: 'Date' },
      { name: 'revenue', type: 'number', label: 'Revenue' },
      { name: 'orders', type: 'number', label: 'Orders' },
      { name: 'customers', type: 'number', label: 'Customers' },
      { name: 'region', type: 'string', label: 'Region' },
      { name: 'product', type: 'string', label: 'Product' }
    ],
    sampleData: [
      { date: '2024-01', revenue: 4500000, orders: 45, customers: 23, region: 'North', product: 'Cloud' },
      { date: '2024-02', revenue: 5200000, orders: 52, customers: 28, region: 'South', product: 'Security' },
      { date: '2024-03', revenue: 4800000, orders: 48, customers: 25, region: 'East', product: 'Consulting' }
    ]
  },
  {
    id: 'customers',
    name: 'Customer Data',
    description: 'Customer demographics and behavior',
    fields: [
      { name: 'customerId', type: 'string', label: 'Customer ID' },
      { name: 'name', type: 'string', label: 'Name' },
      { name: 'segment', type: 'string', label: 'Segment' },
      { name: 'lifetimeValue', type: 'number', label: 'Lifetime Value' },
      { name: 'joinDate', type: 'date', label: 'Join Date' },
      { name: 'status', type: 'string', label: 'Status' }
    ],
    sampleData: [
      { customerId: 'C001', name: 'ABC Corp', segment: 'Enterprise', lifetimeValue: 2500000, joinDate: '2023-01-15', status: 'Active' },
      { customerId: 'C002', name: 'XYZ Ltd', segment: 'Mid-Market', lifetimeValue: 1200000, joinDate: '2023-03-20', status: 'Active' },
      { customerId: 'C003', name: 'DEF Inc', segment: 'SMB', lifetimeValue: 450000, joinDate: '2023-06-10', status: 'Inactive' }
    ]
  }
];

export default function CustomReportBuilder() {
  const [reportName, setReportName] = useState('');
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [charts, setCharts] = useState<ChartComponent[]>([]);
  const [isChartConfigOpen, setIsChartConfigOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<ChartComponent | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [filters, setFilters] = useState<any[]>([]);

  const addChart = (chartType: string) => {
    const newChart: ChartComponent = {
      id: Date.now().toString(),
      type: chartType as any,
      title: `New ${chartType} Chart`,
      data: selectedDataSource?.sampleData || [],
      config: {
        dataKey: selectedDataSource?.fields[0]?.name || '',
        color: '#3B82F6',
        title: `New ${chartType} Chart`,
        options: {}
      },
      position: { x: 0, y: 0, w: 6, h: 4 }
    };
    
    setCharts([...charts, newChart]);
  };

  const updateChart = (chartId: string, updates: Partial<ChartComponent>) => {
    setCharts(charts.map(chart => 
      chart.id === chartId ? { ...chart, ...updates } : chart
    ));
  };

  const deleteChart = (chartId: string) => {
    setCharts(charts.filter(chart => chart.id !== chartId));
  };

  const renderChart = (chart: ChartComponent) => {
    const { type, data, config } = chart;

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis || 'date'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={config.dataKey} fill={config.color} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis || 'date'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={config.dataKey} stroke={config.color} />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={config.dataKey}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={config.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis || 'date'} />
              <YAxis />
              <Tooltip />
              <RechartsScatter dataKey={config.dataKey} fill={config.color} />
            </RechartsScatterChart>
          </ResponsiveContainer>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {selectedDataSource?.fields.map(field => (
                    <th key={field.name} className="text-left p-2 font-medium">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row: any, index: number) => (
                  <tr key={index} className="border-b">
                    {selectedDataSource?.fields.map(field => (
                      <td key={field.name} className="p-2">
                        {row[field.name]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  const saveReport = () => {
    const report = {
      name: reportName,
      dataSource: selectedDataSource?.id,
      charts,
      filters,
      layout,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving report:', report);
    // Implementation for saving report
  };

  const exportReport = (format: string) => {
    console.log(`Exporting report as ${format}`);
    // Implementation for exporting report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Custom Report Builder</h1>
          <p className="text-muted-foreground">Create interactive reports with drag-and-drop interface</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={saveReport}>
            <Save className="w-4 h-4 mr-2" />
            Save Report
          </Button>
          <Button onClick={exportReport.bind(null, 'pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Chart Library */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chart Library</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {AVAILABLE_CHARTS.map(chart => (
                <Button
                  key={chart.type}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addChart(chart.type)}
                  disabled={!selectedDataSource}
                >
                  <chart.icon className="w-4 h-4 mr-2" />
                  {chart.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Data Source Selection */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Data Source</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => {
                const source = DATA_SOURCES.find(s => s.id === value);
                setSelectedDataSource(source || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {DATA_SOURCES.map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedDataSource && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Available Fields:</h4>
                  <div className="space-y-1">
                    {selectedDataSource.fields.map(field => (
                      <div key={field.name} className="text-sm text-muted-foreground">
                        {field.label} ({field.type})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Enter report name..."
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {charts.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No charts added yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a data source and add charts from the library to start building your report
                  </p>
                  <Button onClick={() => addChart('bar')} disabled={!selectedDataSource}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Chart
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-4 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {charts.map(chart => (
                    <Card key={chart.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm">{chart.title}</CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedChart(chart);
                                setIsChartConfigOpen(true);
                              }}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteChart(chart.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {renderChart(chart)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chart Configuration Dialog */}
      <Dialog open={isChartConfigOpen} onOpenChange={setIsChartConfigOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Chart</DialogTitle>
          </DialogHeader>
          {selectedChart && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="chartTitle">Chart Title</Label>
                <Input
                  id="chartTitle"
                  value={selectedChart.config.title}
                  onChange={(e) => updateChart(selectedChart.id, {
                    config: { ...selectedChart.config, title: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataKey">Data Field</Label>
                  <Select
                    value={selectedChart.config.dataKey}
                    onValueChange={(value) => updateChart(selectedChart.id, {
                      config: { ...selectedChart.config, dataKey: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDataSource?.fields.map(field => (
                        <SelectItem key={field.name} value={field.name}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={selectedChart.config.color}
                    onChange={(e) => updateChart(selectedChart.id, {
                      config: { ...selectedChart.config, color: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsChartConfigOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsChartConfigOpen(false)}>
                  Apply Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Preview: {reportName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {charts.map(chart => (
              <Card key={chart.id}>
                <CardHeader>
                  <CardTitle>{chart.config.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderChart(chart)}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 