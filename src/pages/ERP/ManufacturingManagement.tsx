/**
 * Manufacturing Management page with BOM, work orders, production scheduling, and quality control
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { 
  Factory, 
  Package, 
  Clock, 
  AlertTriangle,
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Square,
  BarChart3,
  Users,
  Settings,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Wrench,
  Shield,
  Zap,
  DollarSign
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';

interface BillOfMaterials {
  id: string;
  productId: string;
  productName: string;
  version: string;
  status: 'Active' | 'Draft' | 'Obsolete';
  components: BOMComponent[];
  totalCost: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface BOMComponent {
  id: string;
  componentId: string;
  componentName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
  leadTime: number;
  isCritical: boolean;
}

interface WorkOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  bomId: string;
  bomVersion: string;
  quantity: number;
  status: 'Planned' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  startDate: string;
  dueDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  workCenter: string;
  assignedTo: string;
  progress: number;
  completedQuantity: number;
  defects: number;
  totalCost: number;
  notes: string;
}

interface ProductionSchedule {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  productName: string;
  workCenter: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
  assignedTo: string;
  priority: string;
}

interface QualityControl {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  productName: string;
  inspectionType: 'Incoming' | 'In-Process' | 'Final';
  inspector: string;
  inspectionDate: string;
  totalInspected: number;
  passed: number;
  failed: number;
  defectRate: number;
  status: 'Pending' | 'In Progress' | 'Passed' | 'Failed';
  notes: string;
}

interface WorkCenter {
  id: string;
  name: string;
  type: string;
  capacity: number;
  efficiency: number;
  status: 'Active' | 'Maintenance' | 'Inactive';
  manager: string;
  currentLoad: number;
  scheduledHours: number;
  availableHours: number;
}

const mockBOMs: BillOfMaterials[] = [
  {
    id: 'BOM-001',
    productId: 'PROD-001',
    productName: 'Laptop Computer',
    version: '1.0',
    status: 'Active',
    components: [
      {
        id: 'COMP-001',
        componentId: 'CPU-001',
        componentName: 'Intel i7 Processor',
        quantity: 1,
        unitCost: 300,
        totalCost: 300,
        supplier: 'Intel Corp',
        leadTime: 14,
        isCritical: true,
      },
      {
        id: 'COMP-002',
        componentId: 'RAM-001',
        componentName: '16GB DDR4 RAM',
        quantity: 2,
        unitCost: 50,
        totalCost: 100,
        supplier: 'Kingston',
        leadTime: 7,
        isCritical: true,
      },
      {
        id: 'COMP-003',
        componentId: 'SSD-001',
        componentName: '512GB SSD',
        quantity: 1,
        unitCost: 80,
        totalCost: 80,
        supplier: 'Samsung',
        leadTime: 10,
        isCritical: false,
      },
    ],
    totalCost: 480,
    createdBy: 'John Smith',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'BOM-002',
    productId: 'PROD-002',
    productName: 'Office Chair',
    version: '2.1',
    status: 'Active',
    components: [
      {
        id: 'COMP-004',
        componentId: 'FRAME-001',
        componentName: 'Chair Frame',
        quantity: 1,
        unitCost: 120,
        totalCost: 120,
        supplier: 'Metal Works Inc',
        leadTime: 21,
        isCritical: true,
      },
      {
        id: 'COMP-005',
        componentId: 'CUSHION-001',
        componentName: 'Seat Cushion',
        quantity: 1,
        unitCost: 45,
        totalCost: 45,
        supplier: 'Comfort Plus',
        leadTime: 14,
        isCritical: false,
      },
    ],
    totalCost: 165,
    createdBy: 'Sarah Davis',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: 'WO-001',
    orderNumber: 'WO-2024-001',
    productId: 'PROD-001',
    productName: 'Laptop Computer',
    bomId: 'BOM-001',
    bomVersion: '1.0',
    quantity: 50,
    status: 'In Progress',
    priority: 'High',
    startDate: '2024-01-15T08:00:00Z',
    dueDate: '2024-01-25T17:00:00Z',
    actualStartDate: '2024-01-15T08:00:00Z',
    workCenter: 'Assembly Line 1',
    assignedTo: 'Mike Johnson',
    progress: 65,
    completedQuantity: 32,
    defects: 2,
    totalCost: 24000,
    notes: 'Rush order for enterprise client',
  },
  {
    id: 'WO-002',
    orderNumber: 'WO-2024-002',
    productId: 'PROD-002',
    productName: 'Office Chair',
    bomId: 'BOM-002',
    bomVersion: '2.1',
    quantity: 100,
    status: 'Planned',
    priority: 'Medium',
    startDate: '2024-01-20T08:00:00Z',
    dueDate: '2024-01-30T17:00:00Z',
    workCenter: 'Assembly Line 2',
    assignedTo: 'Lisa Wilson',
    progress: 0,
    completedQuantity: 0,
    defects: 0,
    totalCost: 16500,
    notes: 'Regular production order',
  },
  {
    id: 'WO-003',
    orderNumber: 'WO-2024-003',
    productId: 'PROD-001',
    productName: 'Laptop Computer',
    bomId: 'BOM-001',
    bomVersion: '1.0',
    quantity: 25,
    status: 'Completed',
    priority: 'Low',
    startDate: '2024-01-10T08:00:00Z',
    dueDate: '2024-01-18T17:00:00Z',
    actualStartDate: '2024-01-10T08:00:00Z',
    actualEndDate: '2024-01-17T16:30:00Z',
    workCenter: 'Assembly Line 1',
    assignedTo: 'Mike Johnson',
    progress: 100,
    completedQuantity: 25,
    defects: 1,
    totalCost: 12000,
    notes: 'Completed ahead of schedule',
  },
];

const mockProductionSchedule: ProductionSchedule[] = [
  {
    id: 'SCH-001',
    workOrderId: 'WO-001',
    workOrderNumber: 'WO-2024-001',
    productName: 'Laptop Computer',
    workCenter: 'Assembly Line 1',
    startTime: '2024-01-15T08:00:00Z',
    endTime: '2024-01-25T17:00:00Z',
    duration: 80,
    status: 'In Progress',
    assignedTo: 'Mike Johnson',
    priority: 'High',
  },
  {
    id: 'SCH-002',
    workOrderId: 'WO-002',
    workOrderNumber: 'WO-2024-002',
    productName: 'Office Chair',
    workCenter: 'Assembly Line 2',
    startTime: '2024-01-20T08:00:00Z',
    endTime: '2024-01-30T17:00:00Z',
    duration: 80,
    status: 'Scheduled',
    assignedTo: 'Lisa Wilson',
    priority: 'Medium',
  },
];

const mockQualityControl: QualityControl[] = [
  {
    id: 'QC-001',
    workOrderId: 'WO-001',
    workOrderNumber: 'WO-2024-001',
    productName: 'Laptop Computer',
    inspectionType: 'In-Process',
    inspector: 'David Chen',
    inspectionDate: '2024-01-16T14:00:00Z',
    totalInspected: 20,
    passed: 18,
    failed: 2,
    defectRate: 10,
    status: 'In Progress',
    notes: 'Two units failed power-on test, sent for rework',
  },
  {
    id: 'QC-002',
    workOrderId: 'WO-003',
    workOrderNumber: 'WO-2024-003',
    productName: 'Laptop Computer',
    inspectionType: 'Final',
    inspector: 'David Chen',
    inspectionDate: '2024-01-17T16:00:00Z',
    totalInspected: 25,
    passed: 24,
    failed: 1,
    defectRate: 4,
    status: 'Passed',
    notes: 'One unit had minor cosmetic defect, passed with notes',
  },
];

const mockWorkCenters: WorkCenter[] = [
  {
    id: 'WC-001',
    name: 'Assembly Line 1',
    type: 'Assembly',
    capacity: 100,
    efficiency: 85,
    status: 'Active',
    manager: 'Mike Johnson',
    currentLoad: 65,
    scheduledHours: 160,
    availableHours: 40,
  },
  {
    id: 'WC-002',
    name: 'Assembly Line 2',
    type: 'Assembly',
    capacity: 80,
    efficiency: 90,
    status: 'Active',
    manager: 'Lisa Wilson',
    currentLoad: 0,
    scheduledHours: 0,
    availableHours: 160,
  },
  {
    id: 'WC-003',
    name: 'Quality Control Lab',
    type: 'Inspection',
    capacity: 50,
    efficiency: 95,
    status: 'Active',
    manager: 'David Chen',
    currentLoad: 30,
    scheduledHours: 40,
    availableHours: 120,
  },
];

export default function ManufacturingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isBOMDialogOpen, setIsBOMDialogOpen] = useState(false);
  const [isWorkOrderDialogOpen, setIsWorkOrderDialogOpen] = useState(false);
  const [isQualityDialogOpen, setIsQualityDialogOpen] = useState(false);

  const filteredWorkOrders = mockWorkOrders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
    const matchesPriority = filterPriority === 'all' || order.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Planned': return 'secondary';
      case 'In Progress': return 'default';
      case 'On Hold': return 'destructive';
      case 'Completed': return 'default';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalWorkOrders = mockWorkOrders.length;
  const inProgressOrders = mockWorkOrders.filter(order => order.status === 'In Progress').length;
  const completedOrders = mockWorkOrders.filter(order => order.status === 'Completed').length;
  const totalProductionValue = mockWorkOrders.reduce((sum, order) => sum + order.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manufacturing Management</h1>
          <p className="text-muted-foreground">
            Manage production processes, work orders, BOMs, and quality control
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBOMDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Manage BOMs
          </Button>
          <Button variant="outline" onClick={() => setIsQualityDialogOpen(true)}>
            <Shield className="h-4 w-4 mr-2" />
            Quality Control
          </Button>
          <Button onClick={() => setIsWorkOrderDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkOrders}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressOrders} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProductionValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total value in production
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.2%</div>
            <p className="text-xs text-muted-foreground">
              Pass rate this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="workorders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workorders">Work Orders</TabsTrigger>
          <TabsTrigger value="boms">Bill of Materials</TabsTrigger>
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="workcenters">Work Centers</TabsTrigger>
        </TabsList>

        <TabsContent value="workorders" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Work Orders</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by product or order number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="on hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Work Orders Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Work Center</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.quantity}</span>
                            <span className="text-xs text-muted-foreground">
                              Completed: {order.completedQuantity}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)} className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={order.progress} className="w-20" />
                            <span className="text-sm">{order.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{order.workCenter}</TableCell>
                        <TableCell>{formatRelativeTime(order.dueDate)}</TableCell>
                        <TableCell>{formatCurrency(order.totalCost)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Order
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                Start Production
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause Production
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bill of Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Components</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBOMs.map((bom) => (
                      <TableRow key={bom.id}>
                        <TableCell className="font-medium">{bom.productName}</TableCell>
                        <TableCell>{bom.version}</TableCell>
                        <TableCell>
                          <Badge variant={bom.status === 'Active' ? 'default' : 'secondary'}>
                            {bom.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{bom.components.length} components</TableCell>
                        <TableCell>{formatCurrency(bom.totalCost)}</TableCell>
                        <TableCell>{bom.createdBy}</TableCell>
                        <TableCell>{formatRelativeTime(bom.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View BOM
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit BOM
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Create Version
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete BOM
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Order</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Work Center</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProductionSchedule.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{schedule.workOrderNumber}</TableCell>
                        <TableCell>{schedule.productName}</TableCell>
                        <TableCell>{schedule.workCenter}</TableCell>
                        <TableCell>{formatRelativeTime(schedule.startTime)}</TableCell>
                        <TableCell>{formatRelativeTime(schedule.endTime)}</TableCell>
                        <TableCell>{schedule.duration} hours</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{schedule.assignedTo}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(schedule.priority)}>
                            {schedule.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Order</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Inspection Type</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Inspected</TableHead>
                      <TableHead>Passed</TableHead>
                      <TableHead>Failed</TableHead>
                      <TableHead>Defect Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockQualityControl.map((qc) => (
                      <TableRow key={qc.id}>
                        <TableCell className="font-medium">{qc.workOrderNumber}</TableCell>
                        <TableCell>{qc.productName}</TableCell>
                        <TableCell>{qc.inspectionType}</TableCell>
                        <TableCell>{qc.inspector}</TableCell>
                        <TableCell>{qc.totalInspected}</TableCell>
                        <TableCell className="text-green-600">{qc.passed}</TableCell>
                        <TableCell className="text-red-600">{qc.failed}</TableCell>
                        <TableCell>{qc.defectRate}%</TableCell>
                        <TableCell>
                          <Badge className={getQualityStatusColor(qc.status)}>
                            {qc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatRelativeTime(qc.inspectionDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workcenters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockWorkCenters.map((center) => (
                  <Card key={center.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{center.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{center.type}</p>
                        </div>
                        <Badge variant={center.status === 'Active' ? 'default' : 'secondary'}>
                          {center.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Manager:</span>
                          <span className="text-sm font-medium">{center.manager}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Capacity:</span>
                          <span className="text-sm font-medium">{center.capacity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Efficiency:</span>
                          <span className="text-sm font-medium">{center.efficiency}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Load:</span>
                          <span className="text-sm font-medium">{center.currentLoad}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${center.currentLoad}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Available Hours:</span>
                          <span className="text-sm font-medium">{center.availableHours}h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Work Order Dialog */}
      <Dialog open={isWorkOrderDialogOpen} onOpenChange={setIsWorkOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Work Order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptop">Laptop Computer</SelectItem>
                    <SelectItem value="chair">Office Chair</SelectItem>
                    <SelectItem value="monitor">4K Monitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="workCenter">Work Center</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assembly1">Assembly Line 1</SelectItem>
                    <SelectItem value="assembly2">Assembly Line 2</SelectItem>
                    <SelectItem value="qc">Quality Control Lab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="datetime-local" />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="datetime-local" />
              </div>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                  <SelectItem value="lisa">Lisa Wilson</SelectItem>
                  <SelectItem value="david">David Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="workOrderNotes">Notes</Label>
              <Textarea id="workOrderNotes" placeholder="Enter work order notes" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsWorkOrderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsWorkOrderDialogOpen(false)}>
              Create Work Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BOM Management Dialog */}
      <Dialog open={isBOMDialogOpen} onOpenChange={setIsBOMDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Bill of Materials Management</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bomProduct">Product</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptop">Laptop Computer</SelectItem>
                    <SelectItem value="chair">Office Chair</SelectItem>
                    <SelectItem value="monitor">4K Monitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bomVersion">Version</Label>
                <Input id="bomVersion" placeholder="e.g., 1.0" />
              </div>
            </div>
            <div>
              <Label htmlFor="bomDescription">Description</Label>
              <Textarea id="bomDescription" placeholder="Enter BOM description" />
            </div>
            <div>
              <Label>Components</Label>
              <div className="border rounded-md p-4 space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
                  <span>Component</span>
                  <span>Quantity</span>
                  <span>Unit Cost</span>
                  <span>Actions</span>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpu">Intel i7 Processor</SelectItem>
                      <SelectItem value="ram">16GB DDR4 RAM</SelectItem>
                      <SelectItem value="ssd">512GB SSD</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Qty" />
                  <Input type="number" placeholder="Cost" />
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsBOMDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsBOMDialogOpen(false)}>
              Save BOM
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quality Control Dialog */}
      <Dialog open={isQualityDialogOpen} onOpenChange={setIsQualityDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quality Control Inspection</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qcWorkOrder">Work Order</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wo-001">WO-2024-001</SelectItem>
                    <SelectItem value="wo-002">WO-2024-002</SelectItem>
                    <SelectItem value="wo-003">WO-2024-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inspectionType">Inspection Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incoming">Incoming</SelectItem>
                    <SelectItem value="in-process">In-Process</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalInspected">Total Inspected</Label>
                <Input id="totalInspected" type="number" placeholder="Enter quantity" />
              </div>
              <div>
                <Label htmlFor="passed">Passed</Label>
                <Input id="passed" type="number" placeholder="Enter quantity" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="failed">Failed</Label>
                <Input id="failed" type="number" placeholder="Enter quantity" />
              </div>
              <div>
                <Label htmlFor="inspector">Inspector</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inspector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="david">David Chen</SelectItem>
                    <SelectItem value="sarah">Sarah Davis</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="qcNotes">Inspection Notes</Label>
              <Textarea id="qcNotes" placeholder="Enter inspection notes and findings" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsQualityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsQualityDialogOpen(false)}>
              Record Inspection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 