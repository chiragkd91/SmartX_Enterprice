/**
 * Procurement Management page with purchase orders, requisitions, and vendor management
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { 
  ShoppingCart, 
  FileText, 
  Clock, 
  CheckCircle,
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  Truck,
  Building,
  Star,
  TrendingUp,
  XCircle
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

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Ordered' | 'Received' | 'Closed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  totalAmount: number;
  items: POItem[];
  requester: string;
  approver?: string;
  notes: string;
}

interface POItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  status: 'Pending' | 'Partial' | 'Received';
}

interface Requisition {
  id: string;
  reqNumber: string;
  requester: string;
  department: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Converted to PO' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  requestDate: string;
  items: ReqItem[];
  totalAmount: number;
  justification: string;
  approver?: string;
}

interface ReqItem {
  id: string;
  productName: string;
  quantity: number;
  estimatedPrice: number;
  specifications: string;
}

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  rating: number;
  totalOrders: number;
  totalValue: number;
  paymentTerms: string;
  leadTime: number;
  performance: number;
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2024-001',
    vendorId: 'VEND-001',
    vendorName: 'Tech Supplier Co',
    status: 'Ordered',
    priority: 'High',
    orderDate: '2024-01-15T10:30:00Z',
    expectedDelivery: '2024-01-25T00:00:00Z',
    totalAmount: 48000,
    items: [
      {
        id: 'POI-001',
        productId: 'PROD-001',
        productName: 'Intel i7 Processor',
        quantity: 50,
        unitPrice: 300,
        totalPrice: 15000,
        receivedQuantity: 0,
        status: 'Pending',
      },
      {
        id: 'POI-002',
        productId: 'PROD-002',
        productName: '16GB DDR4 RAM',
        quantity: 100,
        unitPrice: 50,
        totalPrice: 5000,
        receivedQuantity: 0,
        status: 'Pending',
      },
    ],
    requester: 'John Smith',
    notes: 'Components for laptop production',
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2024-002',
    vendorId: 'VEND-002',
    vendorName: 'Furniture Plus',
    status: 'Approved',
    priority: 'Medium',
    orderDate: '2024-01-14T14:20:00Z',
    expectedDelivery: '2024-01-28T00:00:00Z',
    totalAmount: 16500,
    items: [
      {
        id: 'POI-003',
        productId: 'PROD-003',
        productName: 'Chair Frame',
        quantity: 100,
        unitPrice: 120,
        totalPrice: 12000,
        receivedQuantity: 0,
        status: 'Pending',
      },
    ],
    requester: 'Sarah Davis',
    notes: 'Office furniture components',
  },
];

const mockRequisitions: Requisition[] = [
  {
    id: 'REQ-001',
    reqNumber: 'REQ-2024-001',
    requester: 'Mike Johnson',
    department: 'Manufacturing',
    status: 'Converted to PO',
    priority: 'High',
    requestDate: '2024-01-10T09:15:00Z',
    totalAmount: 48000,
    items: [
      {
        id: 'REQI-001',
        productName: 'Intel i7 Processor',
        quantity: 50,
        estimatedPrice: 300,
        specifications: 'Latest generation processor for laptop assembly',
      },
    ],
    justification: 'Required for Q1 production targets',
  },
  {
    id: 'REQ-002',
    reqNumber: 'REQ-2024-002',
    requester: 'Lisa Wilson',
    department: 'Operations',
    status: 'Pending Approval',
    priority: 'Medium',
    requestDate: '2024-01-12T11:30:00Z',
    totalAmount: 5000,
    items: [
      {
        id: 'REQI-002',
        productName: 'Office Supplies',
        quantity: 200,
        estimatedPrice: 25,
        specifications: 'General office supplies for daily operations',
      },
    ],
    justification: 'Monthly office supplies replenishment',
  },
];

const mockVendors: Vendor[] = [
  {
    id: 'VEND-001',
    name: 'Tech Supplier Co',
    contactPerson: 'Robert Johnson',
    email: 'robert@techsupply.com',
    phone: '+1 (555) 123-4567',
    address: '123 Technology Drive, San Francisco, CA 94105',
    category: 'Electronics',
    status: 'Active',
    rating: 4.8,
    totalOrders: 145,
    totalValue: 485000,
    paymentTerms: 'Net 30',
    leadTime: 7,
    performance: 98,
  },
  {
    id: 'VEND-002',
    name: 'Furniture Plus',
    contactPerson: 'Maria Rodriguez',
    email: 'maria@furnitureplus.com',
    phone: '+1 (555) 234-5678',
    address: '456 Furniture Ave, Los Angeles, CA 90210',
    category: 'Furniture',
    status: 'Active',
    rating: 4.5,
    totalOrders: 89,
    totalValue: 125000,
    paymentTerms: 'Net 45',
    leadTime: 14,
    performance: 92,
  },
];

export default function ProcurementManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const [isReqDialogOpen, setIsReqDialogOpen] = useState(false);
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);

  const filteredPOs = mockPurchaseOrders.filter(po => {
    const matchesSearch = po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || po.status.toLowerCase() === filterStatus;
    const matchesPriority = filterPriority === 'all' || po.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Pending Approval': return 'default';
      case 'Approved': return 'default';
      case 'Ordered': return 'default';
      case 'Received': return 'default';
      case 'Closed': return 'default';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Ordered': return 'bg-blue-100 text-blue-800';
      case 'Received': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
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

  const totalPOs = mockPurchaseOrders.length;
  const pendingPOs = mockPurchaseOrders.filter(po => po.status === 'Pending Approval').length;
  const totalPOValue = mockPurchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  const activeVendors = mockVendors.filter(vendor => vendor.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procurement Management</h1>
          <p className="text-muted-foreground">
            Manage purchase orders, requisitions, and vendor relationships
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsReqDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Create Requisition
          </Button>
          <Button variant="outline" onClick={() => setIsVendorDialogOpen(true)}>
            <Building className="h-4 w-4 mr-2" />
            Manage Vendors
          </Button>
          <Button onClick={() => setIsPODialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create PO
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchase Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPOs}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPOs} pending approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PO Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPOValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total value of all POs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVendors}</div>
            <p className="text-xs text-muted-foreground">
              Approved suppliers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.5 days</div>
            <p className="text-xs text-muted-foreground">
              Average delivery time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="purchaseorders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="purchaseorders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="purchaseorders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search POs</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by vendor or PO number..."
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending approval">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
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

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPOs.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.poNumber}</TableCell>
                        <TableCell>{po.vendorName}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(po.status)} className={getStatusColor(po.status)}>
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(po.priority)}>
                            {po.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatRelativeTime(po.orderDate)}</TableCell>
                        <TableCell>{formatRelativeTime(po.expectedDelivery)}</TableCell>
                        <TableCell>{formatCurrency(po.totalAmount)}</TableCell>
                        <TableCell>{po.requester}</TableCell>
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
                                Edit PO
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve PO
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Truck className="mr-2 h-4 w-4" />
                                Receive Items
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel PO
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

        <TabsContent value="requisitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Requisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Req #</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Justification</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequisitions.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.reqNumber}</TableCell>
                        <TableCell>{req.requester}</TableCell>
                        <TableCell>{req.department}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(req.status)}>
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(req.priority)}>
                            {req.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatRelativeTime(req.requestDate)}</TableCell>
                        <TableCell>{formatCurrency(req.totalAmount)}</TableCell>
                        <TableCell className="max-w-xs truncate">{req.justification}</TableCell>
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
                                Edit Requisition
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Convert to PO
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
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

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockVendors.map((vendor) => (
                  <Card key={vendor.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{vendor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{vendor.category}</p>
                        </div>
                        <Badge variant={vendor.status === 'Active' ? 'default' : 'secondary'}>
                          {vendor.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Contact:</span>
                          <span className="text-sm font-medium">{vendor.contactPerson}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Rating:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{vendor.rating}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Orders:</span>
                          <span className="text-sm font-medium">{vendor.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Value:</span>
                          <span className="text-sm font-medium">{formatCurrency(vendor.totalValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Performance:</span>
                          <span className="text-sm font-medium">{vendor.performance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Lead Time:</span>
                          <span className="text-sm font-medium">{vendor.leadTime} days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>PO Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Draft</span>
                    <span className="text-sm font-medium">
                      {mockPurchaseOrders.filter(po => po.status === 'Draft').length} POs
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Approval</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {mockPurchaseOrders.filter(po => po.status === 'Pending Approval').length} POs
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approved</span>
                    <span className="text-sm font-medium text-green-600">
                      {mockPurchaseOrders.filter(po => po.status === 'Approved').length} POs
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ordered</span>
                    <span className="text-sm font-medium text-blue-600">
                      {mockPurchaseOrders.filter(po => po.status === 'Ordered').length} POs
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVendors.map(vendor => (
                    <div key={vendor.id} className="flex justify-between items-center">
                      <span className="text-sm">{vendor.name}</span>
                      <span className="text-sm font-medium">{vendor.performance}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create PO Dialog */}
      <Dialog open={isPODialogOpen} onOpenChange={setIsPODialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor">Vendor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech-supplier">Tech Supplier Co</SelectItem>
                    <SelectItem value="furniture-plus">Furniture Plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderDate">Order Date</Label>
                <Input id="orderDate" type="date" />
              </div>
              <div>
                <Label htmlFor="expectedDelivery">Expected Delivery</Label>
                <Input id="expectedDelivery" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="poNotes">Notes</Label>
              <Textarea id="poNotes" placeholder="Enter PO notes" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPODialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsPODialogOpen(false)}>
              Create PO
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Requisition Dialog */}
      <Dialog open={isReqDialogOpen} onOpenChange={setIsReqDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Requisition</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reqPriority">Priority</Label>
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
            </div>
            <div>
              <Label htmlFor="justification">Justification</Label>
              <Textarea id="justification" placeholder="Explain why this requisition is needed" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReqDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsReqDialogOpen(false)}>
              Create Requisition
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vendor Management Dialog */}
      <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input id="vendorName" placeholder="Enter vendor name" />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" placeholder="Enter contact person" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendorEmail">Email</Label>
                <Input id="vendorEmail" type="email" placeholder="Enter email" />
              </div>
              <div>
                <Label htmlFor="vendorPhone">Phone</Label>
                <Input id="vendorPhone" placeholder="Enter phone number" />
              </div>
            </div>
            <div>
              <Label htmlFor="vendorAddress">Address</Label>
              <Textarea id="vendorAddress" placeholder="Enter vendor address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendorCategory">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="office-supplies">Office Supplies</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                    <SelectItem value="net-45">Net 45</SelectItem>
                    <SelectItem value="net-60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsVendorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsVendorDialogOpen(false)}>
              Add Vendor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 