/**
 * Logistics Management page with shipping, receiving, and route optimization
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock,
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
  Calendar,
  Route,
  Car,
  Ship,
  Plane,
  CheckCircle,
  XCircle,
  AlertTriangle
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

interface Shipment {
  id: string;
  shipmentNumber: string;
  orderNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  carrier: string;
  service: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Exception';
  trackingNumber: string;
  weight: number;
  dimensions: string;
  shippingDate: string;
  deliveryDate?: string;
  cost: number;
  insurance: number;
  notes: string;
}

interface Receiving {
  id: string;
  receivingNumber: string;
  poNumber: string;
  supplierName: string;
  expectedDate: string;
  receivedDate?: string;
  status: 'Expected' | 'Received' | 'Partial' | 'Overdue';
  items: number;
  totalValue: number;
  warehouse: string;
  notes: string;
}

interface Carrier {
  id: string;
  name: string;
  type: 'Ground' | 'Air' | 'Ocean' | 'Rail';
  serviceLevel: 'Economy' | 'Standard' | 'Express' | 'Premium';
  coverage: string[];
  rating: number;
  costPerMile: number;
  transitTime: number;
  status: 'Active' | 'Inactive';
}

interface Route {
  id: string;
  routeName: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  fuelCost: number;
  tolls: number;
  totalCost: number;
  status: 'Active' | 'Inactive';
}

const mockShipments: Shipment[] = [
  {
    id: 'SHIP-001',
    shipmentNumber: 'SH-2024-001',
    orderNumber: 'SO-2024-001',
    customerName: 'TechNova Solutions',
    origin: 'Warehouse A, San Francisco',
    destination: 'TechNova HQ, New York',
    carrier: 'FedEx',
    service: 'Ground',
    status: 'In Transit',
    trackingNumber: '794658123456',
    weight: 45.5,
    dimensions: '24x18x12 inches',
    shippingDate: '2024-01-15T08:00:00Z',
    cost: 125.50,
    insurance: 500,
    notes: 'Fragile items - handle with care',
  },
  {
    id: 'SHIP-002',
    shipmentNumber: 'SH-2024-002',
    orderNumber: 'SO-2024-002',
    customerName: 'Global Industries',
    origin: 'Warehouse B, Chicago',
    destination: 'Global HQ, Los Angeles',
    carrier: 'UPS',
    service: 'Express',
    status: 'Delivered',
    trackingNumber: '1Z999AA1234567890',
    weight: 32.0,
    dimensions: '20x16x10 inches',
    shippingDate: '2024-01-12T10:30:00Z',
    deliveryDate: '2024-01-14T15:45:00Z',
    cost: 89.75,
    insurance: 300,
    notes: 'Delivered on time',
  },
];

const mockReceiving: Receiving[] = [
  {
    id: 'REC-001',
    receivingNumber: 'RC-2024-001',
    poNumber: 'PO-2024-001',
    supplierName: 'ABC Suppliers',
    expectedDate: '2024-01-16T00:00:00Z',
    status: 'Expected',
    items: 25,
    totalValue: 15000,
    warehouse: 'Warehouse A',
    notes: 'Electronic components',
  },
  {
    id: 'REC-002',
    receivingNumber: 'RC-2024-002',
    poNumber: 'PO-2024-002',
    supplierName: 'XYZ Manufacturing',
    expectedDate: '2024-01-14T00:00:00Z',
    receivedDate: '2024-01-14T14:30:00Z',
    status: 'Received',
    items: 15,
    totalValue: 8500,
    warehouse: 'Warehouse B',
    notes: 'Raw materials received',
  },
];

const mockCarriers: Carrier[] = [
  {
    id: 'CAR-001',
    name: 'FedEx',
    type: 'Ground',
    serviceLevel: 'Standard',
    coverage: ['Domestic', 'International'],
    rating: 4.5,
    costPerMile: 2.50,
    transitTime: 3,
    status: 'Active',
  },
  {
    id: 'CAR-002',
    name: 'UPS',
    type: 'Ground',
    serviceLevel: 'Express',
    coverage: ['Domestic', 'International'],
    rating: 4.3,
    costPerMile: 3.75,
    transitTime: 1,
    status: 'Active',
  },
];

const mockRoutes: Route[] = [
  {
    id: 'ROUTE-001',
    routeName: 'SF to NY',
    origin: 'San Francisco, CA',
    destination: 'New York, NY',
    distance: 2900,
    estimatedTime: 48,
    fuelCost: 580,
    tolls: 45,
    totalCost: 625,
    status: 'Active',
  },
  {
    id: 'ROUTE-002',
    routeName: 'Chicago to LA',
    origin: 'Chicago, IL',
    destination: 'Los Angeles, CA',
    distance: 2000,
    estimatedTime: 36,
    fuelCost: 400,
    tolls: 30,
    totalCost: 430,
    status: 'Active',
  },
];

export default function LogisticsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isShipmentDialogOpen, setIsShipmentDialogOpen] = useState(false);
  const [isReceivingDialogOpen, setIsReceivingDialogOpen] = useState(false);

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesSearch = shipment.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shipment.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Exception': return 'bg-red-100 text-red-800';
      case 'Expected': return 'bg-yellow-100 text-yellow-800';
      case 'Received': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-orange-100 text-orange-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalShipments = mockShipments.length;
  const inTransitShipments = mockShipments.filter(s => s.status === 'In Transit').length;
  const totalShippingCost = mockShipments.reduce((sum, s) => sum + s.cost, 0);
  const averageTransitTime = 2.5; // days

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logistics Management</h1>
          <p className="text-muted-foreground">
            Manage shipping, receiving, and route optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsReceivingDialogOpen(true)}>
            <Package className="h-4 w-4 mr-2" />
            Create Receiving
          </Button>
          <Button onClick={() => setIsShipmentDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShipments}</div>
            <p className="text-xs text-muted-foreground">
              {inTransitShipments} in transit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipping Cost</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalShippingCost)}</div>
            <p className="text-xs text-muted-foreground">
              Total shipping expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transit Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTransitTime} days</div>
            <p className="text-xs text-muted-foreground">
              Average delivery time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRoutes.length}</div>
            <p className="text-xs text-muted-foreground">
              Optimized routes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="shipments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="receiving">Receiving</TabsTrigger>
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Shipments</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by shipment number, customer, or tracking..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="exception">Exception</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.shipmentNumber}</TableCell>
                        <TableCell>{shipment.customerName}</TableCell>
                        <TableCell className="max-w-xs truncate">{shipment.origin}</TableCell>
                        <TableCell className="max-w-xs truncate">{shipment.destination}</TableCell>
                        <TableCell>{shipment.carrier}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{shipment.trackingNumber}</TableCell>
                        <TableCell>{formatCurrency(shipment.cost)}</TableCell>
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
                                Track Shipment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Shipment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Label
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Shipment
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

        <TabsContent value="receiving" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receiving Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receiving #</TableHead>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Expected Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReceiving.map((receiving) => (
                      <TableRow key={receiving.id}>
                        <TableCell className="font-medium">{receiving.receivingNumber}</TableCell>
                        <TableCell>{receiving.poNumber}</TableCell>
                        <TableCell>{receiving.supplierName}</TableCell>
                        <TableCell>{formatRelativeTime(receiving.expectedDate)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(receiving.status)}>
                            {receiving.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{receiving.items}</TableCell>
                        <TableCell>{formatCurrency(receiving.totalValue)}</TableCell>
                        <TableCell>{receiving.warehouse}</TableCell>
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
                                Edit Receiving
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Received
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Receiving
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

        <TabsContent value="carriers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carrier Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockCarriers.map((carrier) => (
                  <Card key={carrier.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{carrier.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{carrier.serviceLevel} Service</p>
                        </div>
                        <Badge className={carrier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {carrier.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Type:</span>
                          <span className="text-sm font-medium">{carrier.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Rating:</span>
                          <span className="text-sm font-medium">{carrier.rating}/5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Cost/Mile:</span>
                          <span className="text-sm font-medium">{formatCurrency(carrier.costPerMile)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Transit Time:</span>
                          <span className="text-sm font-medium">{carrier.transitTime} days</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Coverage: {carrier.coverage.join(', ')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route Name</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Fuel Cost</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">{route.routeName}</TableCell>
                        <TableCell>{route.origin}</TableCell>
                        <TableCell>{route.destination}</TableCell>
                        <TableCell>{route.distance} miles</TableCell>
                        <TableCell>{route.estimatedTime} hours</TableCell>
                        <TableCell>{formatCurrency(route.fuelCost)}</TableCell>
                        <TableCell>{formatCurrency(route.totalCost)}</TableCell>
                        <TableCell>
                          <Badge className={route.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {route.status}
                          </Badge>
                        </TableCell>
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
                                View Route
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Route
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Route className="mr-2 h-4 w-4" />
                                Optimize Route
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Route
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-Time Delivery</span>
                    <span className="text-sm font-medium text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Transit Time</span>
                    <span className="text-sm font-medium">2.5 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost per Shipment</span>
                    <span className="text-sm font-medium">{formatCurrency(107.63)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Exception Rate</span>
                    <span className="text-sm font-medium text-red-600">2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Carrier Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCarriers.map(carrier => (
                    <div key={carrier.id} className="flex justify-between items-center">
                      <span className="text-sm">{carrier.name}</span>
                      <span className="text-sm font-medium">{carrier.rating}/5.0</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Shipment Dialog */}
      <Dialog open={isShipmentDialogOpen} onOpenChange={setIsShipmentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Shipment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input id="orderNumber" placeholder="Enter order number" />
              </div>
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" placeholder="Enter customer name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">Origin</Label>
                <Input id="origin" placeholder="Enter origin address" />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="Enter destination address" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carrier">Carrier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fedex">FedEx</SelectItem>
                    <SelectItem value="ups">UPS</SelectItem>
                    <SelectItem value="usps">USPS</SelectItem>
                    <SelectItem value="dhl">DHL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="service">Service Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input id="weight" type="number" placeholder="0.0" />
              </div>
              <div>
                <Label htmlFor="length">Length (in)</Label>
                <Input id="length" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="width">Width (in)</Label>
                <Input id="width" type="number" placeholder="0" />
              </div>
            </div>
            <div>
              <Label htmlFor="shipmentNotes">Notes</Label>
              <Textarea id="shipmentNotes" placeholder="Enter shipment notes" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsShipmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsShipmentDialogOpen(false)}>
              Create Shipment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Receiving Dialog */}
      <Dialog open={isReceivingDialogOpen} onOpenChange={setIsReceivingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Receiving</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="poNumber">PO Number</Label>
                <Input id="poNumber" placeholder="Enter PO number" />
              </div>
              <div>
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input id="supplierName" placeholder="Enter supplier name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedDate">Expected Date</Label>
                <Input id="expectedDate" type="date" />
              </div>
              <div>
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                    <SelectItem value="warehouse-c">Warehouse C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="items">Number of Items</Label>
                <Input id="items" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="totalValue">Total Value</Label>
                <Input id="totalValue" type="number" placeholder="0.00" />
              </div>
            </div>
            <div>
              <Label htmlFor="receivingNotes">Notes</Label>
              <Textarea id="receivingNotes" placeholder="Enter receiving notes" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReceivingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsReceivingDialogOpen(false)}>
              Create Receiving
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 