/**
 * Inventory Management page with comprehensive stock tracking and warehouse management
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { 
  Package, 
  Warehouse, 
  TrendingUp, 
  AlertTriangle,
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
  MapPin,
  Truck,
  ArrowLeftRight,
  Clock,
  DollarSign,
  CheckCircle,
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

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  warehouse: string;
  location: string;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstocked';
  supplier: string;
  reorderPoint: number;
  leadTime: number;
}

interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'In' | 'Out' | 'Transfer' | 'Adjustment';
  quantity: number;
  fromLocation: string;
  toLocation: string;
  reference: string;
  date: string;
  user: string;
  notes: string;
}

interface Warehouse {
  id: string;
  name: string;
  address: string;
  capacity: number;
  usedCapacity: number;
  manager: string;
  status: 'Active' | 'Inactive';
  totalItems: number;
  totalValue: number;
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: 'INV-001',
    sku: 'LAP-001',
    name: 'Laptop Computer',
    category: 'Electronics',
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    unitCost: 800,
    totalValue: 36000,
    warehouse: 'Main Warehouse',
    location: 'A1-B2-C3',
    lastUpdated: '2024-01-15T10:30:00Z',
    status: 'In Stock',
    supplier: 'Tech Supplier Co',
    reorderPoint: 15,
    leadTime: 7,
  },
  {
    id: 'INV-002',
    sku: 'CHR-001',
    name: 'Office Chair',
    category: 'Furniture',
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unitCost: 200,
    totalValue: 1600,
    warehouse: 'Main Warehouse',
    location: 'D4-E5-F6',
    lastUpdated: '2024-01-14T14:20:00Z',
    status: 'Low Stock',
    supplier: 'Furniture Plus',
    reorderPoint: 20,
    leadTime: 14,
  },
  {
    id: 'INV-003',
    sku: 'MOU-001',
    name: 'Wireless Mouse',
    category: 'Electronics',
    currentStock: 120,
    minStock: 50,
    maxStock: 200,
    unitCost: 25,
    totalValue: 3000,
    warehouse: 'Main Warehouse',
    location: 'G7-H8-I9',
    lastUpdated: '2024-01-13T09:15:00Z',
    status: 'In Stock',
    supplier: 'Tech Supplier Co',
    reorderPoint: 60,
    leadTime: 5,
  },
  {
    id: 'INV-004',
    sku: 'DSK-001',
    name: 'Standing Desk',
    category: 'Furniture',
    currentStock: 3,
    minStock: 8,
    maxStock: 25,
    unitCost: 450,
    totalValue: 1350,
    warehouse: 'Secondary Warehouse',
    location: 'J10-K11-L12',
    lastUpdated: '2024-01-12T16:45:00Z',
    status: 'Low Stock',
    supplier: 'Office Solutions',
    reorderPoint: 12,
    leadTime: 10,
  },
  {
    id: 'INV-005',
    sku: 'MON-001',
    name: '4K Monitor',
    category: 'Electronics',
    currentStock: 0,
    minStock: 5,
    maxStock: 30,
    unitCost: 300,
    totalValue: 0,
    warehouse: 'Main Warehouse',
    location: 'M13-N14-O15',
    lastUpdated: '2024-01-11T11:20:00Z',
    status: 'Out of Stock',
    supplier: 'Tech Supplier Co',
    reorderPoint: 8,
    leadTime: 7,
  },
];

const mockStockMovements: StockMovement[] = [
  {
    id: 'MOV-001',
    itemId: 'INV-001',
    itemName: 'Laptop Computer',
    type: 'In',
    quantity: 50,
    fromLocation: 'Supplier',
    toLocation: 'Main Warehouse',
    reference: 'PO-2024-001',
    date: '2024-01-15T10:30:00Z',
    user: 'John Smith',
    notes: 'Initial stock received from supplier',
  },
  {
    id: 'MOV-002',
    itemId: 'INV-002',
    itemName: 'Office Chair',
    type: 'Out',
    quantity: 5,
    fromLocation: 'Main Warehouse',
    toLocation: 'Customer',
    reference: 'SO-2024-002',
    date: '2024-01-14T14:20:00Z',
    user: 'Sarah Davis',
    notes: 'Order fulfillment for customer',
  },
  {
    id: 'MOV-003',
    itemId: 'INV-003',
    itemName: 'Wireless Mouse',
    type: 'Transfer',
    quantity: 20,
    fromLocation: 'Main Warehouse',
    toLocation: 'Secondary Warehouse',
    reference: 'TR-2024-001',
    date: '2024-01-13T09:15:00Z',
    user: 'Mike Johnson',
    notes: 'Stock transfer to secondary location',
  },
  {
    id: 'MOV-004',
    itemId: 'INV-004',
    itemName: 'Standing Desk',
    type: 'Adjustment',
    quantity: -2,
    fromLocation: 'Secondary Warehouse',
    toLocation: 'Secondary Warehouse',
    reference: 'ADJ-2024-001',
    date: '2024-01-12T16:45:00Z',
    user: 'Lisa Wilson',
    notes: 'Damage adjustment - items damaged during handling',
  },
];

const mockWarehouses: Warehouse[] = [
  {
    id: 'WH-001',
    name: 'Main Warehouse',
    address: '123 Industrial Blvd, Business District, City, State 12345',
    capacity: 10000,
    usedCapacity: 7500,
    manager: 'John Smith',
    status: 'Active',
    totalItems: 156,
    totalValue: 125000,
  },
  {
    id: 'WH-002',
    name: 'Secondary Warehouse',
    address: '456 Logistics Ave, Industrial Zone, City, State 12345',
    capacity: 5000,
    usedCapacity: 3200,
    manager: 'Sarah Davis',
    status: 'Active',
    totalItems: 89,
    totalValue: 45000,
  },
  {
    id: 'WH-003',
    name: 'Regional Distribution Center',
    address: '789 Supply Chain Rd, Distribution Park, City, State 12345',
    capacity: 8000,
    usedCapacity: 0,
    manager: 'Mike Johnson',
    status: 'Inactive',
    totalItems: 0,
    totalValue: 0,
  },
];

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWarehouse, setFilterWarehouse] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState(false);

  const filteredInventory = mockInventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category.toLowerCase() === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status.toLowerCase() === filterStatus;
    const matchesWarehouse = filterWarehouse === 'all' || item.warehouse.toLowerCase() === filterWarehouse;
    return matchesSearch && matchesCategory && matchesStatus && matchesWarehouse;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'In Stock': return 'default';
      case 'Low Stock': return 'destructive';
      case 'Out of Stock': return 'destructive';
      case 'Overstocked': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-red-100 text-red-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      case 'Overstocked': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockLevel = (current: number, min: number) => {
    if (current === 0) return 'Out of Stock';
    if (current <= min) return 'Low Stock';
    if (current > min * 2) return 'Overstocked';
    return 'In Stock';
  };

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'In': return <ArrowLeftRight className="h-4 w-4 text-green-600" />;
      case 'Out': return <ArrowLeftRight className="h-4 w-4 text-red-600" />;
      case 'Transfer': return <Truck className="h-4 w-4 text-blue-600" />;
      case 'Adjustment': return <Edit className="h-4 w-4 text-orange-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'In': return 'bg-green-100 text-green-800';
      case 'Out': return 'bg-red-100 text-red-800';
      case 'Transfer': return 'bg-blue-100 text-blue-800';
      case 'Adjustment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalInventoryValue = mockInventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = mockInventoryItems.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = mockInventoryItems.filter(item => item.status === 'Out of Stock').length;
  const totalItems = mockInventoryItems.reduce((sum, item) => sum + item.currentStock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage stock levels, track movements, and optimize warehouse operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsMovementDialogOpen(true)}>
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Stock Movement
          </Button>
          <Button variant="outline" onClick={() => setIsWarehouseDialogOpen(true)}>
            <Warehouse className="h-4 w-4 mr-2" />
            Manage Warehouses
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
            <p className="text-xs text-muted-foreground">
              Across {mockInventoryItems.length} items
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              In stock across all warehouses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Need reordering
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Immediate attention required
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Items</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="category">Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in stock">In Stock</SelectItem>
                      <SelectItem value="low stock">Low Stock</SelectItem>
                      <SelectItem value="out of stock">Out of Stock</SelectItem>
                      <SelectItem value="overstocked">Overstocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Warehouses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      <SelectItem value="main warehouse">Main Warehouse</SelectItem>
                      <SelectItem value="secondary warehouse">Secondary Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.currentStock}</span>
                            <span className="text-xs text-muted-foreground">
                              Min: {item.minStock} | Max: {item.maxStock}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(item.totalValue)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.warehouse}</span>
                            <span className="text-xs text-muted-foreground">{item.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(item.status)} className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatRelativeTime(item.lastUpdated)}</TableCell>
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
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowLeftRight className="mr-2 h-4 w-4" />
                                Record Movement
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Item
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

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStockMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{formatRelativeTime(movement.date)}</TableCell>
                        <TableCell className="font-medium">{movement.itemName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMovementTypeIcon(movement.type)}
                            <Badge className={getMovementTypeColor(movement.type)}>
                              {movement.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </TableCell>
                        <TableCell>{movement.fromLocation}</TableCell>
                        <TableCell>{movement.toLocation}</TableCell>
                        <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
                        <TableCell>{movement.user}</TableCell>
                        <TableCell className="max-w-xs truncate">{movement.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockWarehouses.map((warehouse) => (
                  <Card key={warehouse.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{warehouse.address}</p>
                        </div>
                        <Badge variant={warehouse.status === 'Active' ? 'default' : 'secondary'}>
                          {warehouse.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Manager:</span>
                          <span className="text-sm font-medium">{warehouse.manager}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Capacity:</span>
                          <span className="text-sm font-medium">
                            {warehouse.usedCapacity.toLocaleString()} / {warehouse.capacity.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(warehouse.usedCapacity / warehouse.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Items:</span>
                          <span className="text-sm font-medium">{warehouse.totalItems}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Value:</span>
                          <span className="text-sm font-medium">{formatCurrency(warehouse.totalValue)}</span>
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
                <CardTitle>Stock Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Stock</span>
                    <span className="text-sm font-medium">
                      {mockInventoryItems.filter(item => item.status === 'In Stock').length} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low Stock</span>
                    <span className="text-sm font-medium text-red-600">
                      {mockInventoryItems.filter(item => item.status === 'Low Stock').length} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Out of Stock</span>
                    <span className="text-sm font-medium text-red-600">
                      {mockInventoryItems.filter(item => item.status === 'Out of Stock').length} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overstocked</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {mockInventoryItems.filter(item => item.status === 'Overstocked').length} items
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(mockInventoryItems.map(item => item.category))).map(category => {
                    const categoryItems = mockInventoryItems.filter(item => item.category === category);
                    const categoryValue = categoryItems.reduce((sum, item) => sum + item.totalValue, 0);
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm font-medium">{formatCurrency(categoryValue)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="Enter SKU" />
              </div>
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" placeholder="Enter item name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="office-supplies">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Enter supplier name" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input id="currentStock" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="minStock">Min Stock</Label>
                <Input id="minStock" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="maxStock">Max Stock</Label>
                <Input id="maxStock" type="number" placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unitCost">Unit Cost</Label>
                <Input id="unitCost" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g., A1-B2-C3" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter item description" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Movement Dialog */}
      <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="movementItem">Item</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventoryItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="movementType">Movement Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" />
              </div>
              <div>
                <Label htmlFor="reference">Reference</Label>
                <Input id="reference" placeholder="e.g., PO-2024-001" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromLocation">From Location</Label>
                <Input id="fromLocation" placeholder="Enter source location" />
              </div>
              <div>
                <Label htmlFor="toLocation">To Location</Label>
                <Input id="toLocation" placeholder="Enter destination location" />
              </div>
            </div>
            <div>
              <Label htmlFor="movementNotes">Notes</Label>
              <Textarea id="movementNotes" placeholder="Enter movement notes" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsMovementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsMovementDialogOpen(false)}>
              Record Movement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Warehouse Management Dialog */}
      <Dialog open={isWarehouseDialogOpen} onOpenChange={setIsWarehouseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Warehouse Management</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="warehouseName">Warehouse Name</Label>
                <Input id="warehouseName" placeholder="Enter warehouse name" />
              </div>
              <div>
                <Label htmlFor="warehouseManager">Manager</Label>
                <Input id="warehouseManager" placeholder="Enter manager name" />
              </div>
            </div>
            <div>
              <Label htmlFor="warehouseAddress">Address</Label>
              <Textarea id="warehouseAddress" placeholder="Enter warehouse address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" placeholder="Enter capacity" />
              </div>
              <div>
                <Label htmlFor="warehouseStatus">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsWarehouseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsWarehouseDialogOpen(false)}>
              Add Warehouse
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 