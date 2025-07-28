/**
 * Support Tickets Management - Complete IT support ticket system
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  Tag,
  AlertCircle,
  MessageCircle,
  FileText,
  Download,
  Send,
  Archive
} from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: 'hardware' | 'software' | 'network' | 'access' | 'email' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  requesterName: string;
  requesterId: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionTime?: number; // in hours
  comments: TicketComment[];
}

interface TicketComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

const TICKET_CATEGORIES = [
  { value: 'hardware', label: 'Hardware Issue', icon: 'Monitor' },
  { value: 'software', label: 'Software Problem', icon: 'Code' },
  { value: 'network', label: 'Network Issue', icon: 'Wifi' },
  { value: 'access', label: 'Access Request', icon: 'Key' },
  { value: 'email', label: 'Email Problem', icon: 'Mail' },
  { value: 'other', label: 'Other', icon: 'HelpCircle' }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
];

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'waiting', label: 'Waiting', color: 'bg-gray-100 text-gray-800' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
];

export default function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      ticketNumber: 'TKT-2024-001',
      title: 'Laptop not connecting to WiFi',
      description: 'My laptop is unable to connect to the office WiFi network. It shows "Authentication failed" error.',
      category: 'network',
      priority: 'high',
      status: 'in_progress',
      requesterName: 'John Smith',
      requesterId: 'EMP001',
      assignedTo: 'IT Support Team',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      comments: [
        {
          id: '1',
          author: 'John Smith',
          content: 'Issue started this morning when I tried to connect.',
          timestamp: '2024-01-15T10:30:00Z',
          isInternal: false
        },
        {
          id: '2',
          author: 'IT Support Team',
          content: 'We are investigating the network configuration. Please try connecting to the guest network temporarily.',
          timestamp: '2024-01-15T11:15:00Z',
          isInternal: false
        }
      ]
    },
    {
      id: '2',
      ticketNumber: 'TKT-2024-002',
      title: 'Software license expired',
      description: 'Adobe Creative Suite license has expired and I cannot access the applications.',
      category: 'software',
      priority: 'medium',
      status: 'open',
      requesterName: 'Sarah Johnson',
      requesterId: 'EMP002',
      createdAt: '2024-01-15T09:15:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
      comments: [
        {
          id: '3',
          author: 'Sarah Johnson',
          content: 'Need this resolved urgently for ongoing design projects.',
          timestamp: '2024-01-15T09:15:00Z',
          isInternal: false
        }
      ]
    },
    {
      id: '3',
      ticketNumber: 'TKT-2024-003',
      title: 'Access to CRM system',
      description: 'I need access to the CRM system for managing customer relationships.',
      category: 'access',
      priority: 'low',
      status: 'waiting',
      requesterName: 'Mike Wilson',
      requesterId: 'EMP003',
      assignedTo: 'System Admin',
      createdAt: '2024-01-14T16:45:00Z',
      updatedAt: '2024-01-15T08:30:00Z',
      comments: [
        {
          id: '4',
          author: 'Mike Wilson',
          content: 'Manager has approved the access request.',
          timestamp: '2024-01-14T16:45:00Z',
          isInternal: false
        },
        {
          id: '5',
          author: 'System Admin',
          content: 'Waiting for HR approval before granting access.',
          timestamp: '2024-01-15T08:30:00Z',
          isInternal: true
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityOption = PRIORITY_LEVELS.find(p => p.value === priority);
    return priorityOption?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const categoryOption = TICKET_CATEGORIES.find(c => c.value === category);
    return categoryOption?.icon || 'HelpCircle';
  };

  const handleCreateTicket = (ticketData: Partial<SupportTicket>) => {
    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      ticketNumber: `TKT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
      title: ticketData.title || '',
      description: ticketData.description || '',
      category: ticketData.category || 'other',
      priority: ticketData.priority || 'medium',
      status: 'open',
      requesterName: 'Current User', // This would come from auth context
      requesterId: 'CURRENT_USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    
    setTickets([newTicket, ...tickets]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus as any, updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  const handleAssignTicket = (ticketId: string, assignee: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, assignedTo: assignee, updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    critical: tickets.filter(t => t.priority === 'critical').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Manage IT support requests and track resolutions</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STATUS_OPTIONS.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {PRIORITY_LEVELS.map(priority => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {TICKET_CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.ticketNumber}</div>
                      <div className="text-sm text-muted-foreground">{ticket.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ticket.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{ticket.requesterName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTo || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatRelativeTime(ticket.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          setSelectedTicket(ticket);
                          setIsViewDialogOpen(true);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Add Comment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Brief description of the issue" />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Detailed description of the problem..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
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
                    {PRIORITY_LEVELS.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleCreateTicket({
                title: 'New Ticket',
                description: 'Ticket description',
                category: 'other',
                priority: 'medium'
              })}>
                Create Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{selectedTicket.ticketNumber}</h3>
                  <p className="text-lg">{selectedTicket.title}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              {/* Ticket Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Requester</Label>
                  <p>{selectedTicket.requesterName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p>{selectedTicket.assignedTo || 'Unassigned'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p>{selectedTicket.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p>{formatRelativeTime(selectedTicket.createdAt)}</p>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="mt-2 p-3 bg-muted rounded-md">{selectedTicket.description}</p>
              </div>
              
              {/* Comments */}
              <div>
                <Label className="text-sm font-medium">Comments</Label>
                <div className="mt-2 space-y-3">
                  {selectedTicket.comments.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{comment.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatRelativeTime(comment.timestamp)}
                        </div>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                      {comment.isInternal && (
                        <Badge variant="secondary" className="mt-2">Internal</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Add Comment</Button>
                <Button>Update Status</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 