/**
 * Responsive sidebar navigation for SmartSuite X Portal
 * Includes role-based navigation and mobile-friendly design
 */

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useStore } from '../../store/useStore';
import { useRBAC } from '../../hooks/useRBAC';
import {
  LayoutDashboard,
  Users,
  Package,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Building2,
  ShoppingCart,
  UserCheck,
  Receipt,
  BarChart3,
  Zap,
  FolderOpen,
  Shield,
  Calendar,
  DollarSign,
  Target,
  Award,
  UserPlus,
  ClipboardList,
  Laptop,
  Monitor,
  Wrench,
  Key,
  HardDrive,
  QrCode,
  Database,
  Brain,
  Activity,
  GraduationCap,
  User,
  UserMinus,
  Heart,
  GitBranch,
  Mail,
  Bell,
  Smartphone,
  Cloud,
  CreditCard,
  MessageCircle,
  Link,
  Cpu,
  Globe,
  Server,
  Lock,
  Truck,
  Home,
  FileSearch,
  ShieldCheck
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  children?: NavItem[];
  permissions?: string[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permissions: ['dashboard.view']
  },
  {
    title: 'SmartX CRM',
    href: '/crm',
    icon: TrendingUp,
    badge: 'CRM',
    permissions: ['crm.view'],
    children: [
      { title: 'CRM Overview', href: '/crm', icon: BarChart3, permissions: ['crm.view'] },
      { title: 'Leads Management', href: '/crm/leads', icon: Users, permissions: ['leads.view'] },
      { title: 'Customer Management', href: '/crm/customers', icon: UserCheck, permissions: ['customers.view'] },
      { title: 'Advanced Analytics', href: '/crm/analytics', icon: BarChart3, permissions: ['crm.view'] },
      { title: 'Email Integration', href: '/crm/email', icon: Mail, permissions: ['crm.view'] },
      { title: 'Lead Scoring', href: '/crm/scoring', icon: Target, permissions: ['crm.view'] },
      { title: 'Notifications', href: '/crm/notifications', icon: Bell, permissions: ['crm.view'] }
    ]
  },
  {
    title: 'SmartX ERP',
    href: '/erp',
    icon: Package,
    badge: 'ERP',
    permissions: ['erp.view'],
    children: [
      { title: 'ERP Overview', href: '/erp', icon: BarChart3, permissions: ['erp.view'] },
      { title: 'Products Management', href: '/erp/products', icon: Package, permissions: ['products.view'] },
      { title: 'Orders Management', href: '/erp/orders', icon: ShoppingCart, permissions: ['orders.view'] },
      { title: 'Invoice Management', href: '/erp/invoices', icon: Receipt, permissions: ['invoices.view'] },
      { title: 'Vendor Management', href: '/erp/vendors', icon: Building2, permissions: ['vendors.view'] },
      { title: 'Inventory Management', href: '/erp/inventory', icon: Database, permissions: ['inventory.view'] },
      { title: 'Manufacturing Management', href: '/erp/manufacturing', icon: Cpu, permissions: ['manufacturing.view'] },
      { title: 'Procurement Management', href: '/erp/procurement', icon: ShoppingCart, permissions: ['procurement.view'] },
      { title: 'Customer Management', href: '/erp/customers', icon: UserCheck, permissions: ['customers.view'] },
      { title: 'Financial Management', href: '/erp/financial', icon: DollarSign, permissions: ['financial.view'] },
      { title: 'Logistics Management', href: '/erp/logistics', icon: Truck, permissions: ['logistics.view'] },
      { title: 'Quality Management', href: '/erp/quality', icon: Shield, permissions: ['quality.view'] },
      { title: 'Advanced Analytics', href: '/erp/analytics', icon: Brain, permissions: ['analytics.view'] }
    ]
  },
  {
    title: 'SmartX HRMS',
    href: '/hr',
    icon: Users,
    badge: 'HR',
    permissions: ['hr.view'],
    children: [
      { title: 'HR Dashboard', href: '/hr', icon: LayoutDashboard, permissions: ['hr.view'] },
      { title: 'Employees', href: '/hr/employees', icon: Users, permissions: ['employees.view'] },
      { title: 'Attendance', href: '/hr/attendance', icon: Calendar, permissions: ['attendance.view'] },
      { title: 'Leave Management', href: '/hr/leave', icon: ClipboardList, permissions: ['leave.view'] },
      { title: 'Payroll', href: '/hr/payroll', icon: DollarSign, permissions: ['payroll.view'] },
      { title: 'Performance', href: '/hr/performance', icon: Target, permissions: ['performance.view'] },
      { title: 'Recruitment', href: '/hr/recruitment', icon: UserPlus, permissions: ['recruitment.view'] },
      { title: 'ATS System', href: '/hr/ats', icon: FileSearch, permissions: ['hr.view'] },
      { title: 'Background Verification', href: '/hr/bgv', icon: ShieldCheck, permissions: ['hr.view'] },
      { title: 'HR Reports', href: '/hr/reports', icon: BarChart3, permissions: ['hr.view'] },
      { title: 'Training', href: '/hr/training', icon: GraduationCap, permissions: ['hr.view'] },
      { title: 'Self Service', href: '/hr/self-service', icon: User, permissions: ['hr.view'] },
      { title: 'Onboarding', href: '/hr/onboarding', icon: UserPlus, permissions: ['hr.view'] },
      { title: 'Offboarding', href: '/hr/offboarding', icon: UserMinus, permissions: ['hr.view'] },
      { title: 'Benefits', href: '/hr/benefits', icon: Heart, permissions: ['hr.view'] },
      { title: 'Workflow', href: '/hr/workflow', icon: GitBranch, permissions: ['hr.view'] },
      { title: 'Security', href: '/hr/security', icon: Shield, permissions: ['hr.view'] },
      { title: 'Predictive Analytics', href: '/hr/predictive-analytics', icon: Brain, permissions: ['hr.view'] }
    ]
  },
  {
    title: 'SmartX IT Asset',
    href: '/assets',
    icon: Laptop,
    badge: 'IT',
    permissions: ['assets.view'],
    children: [
      { title: 'Asset Dashboard', href: '/assets', icon: LayoutDashboard, permissions: ['assets.view'] },
      { title: 'Asset Management', href: '/assets/management', icon: Monitor, permissions: ['assets.view'] },
      { title: 'Asset Tracking', href: '/assets/tracking', icon: QrCode, permissions: ['assets.view'] },
      { title: 'Maintenance', href: '/assets/maintenance', icon: Wrench, permissions: ['assets.view'] },
      { title: 'Software Licenses', href: '/assets/software', icon: Key, permissions: ['assets.view'] },
      { title: 'IT Inventory', href: '/assets/inventory', icon: HardDrive, permissions: ['assets.view'] },
      { title: 'Asset Reports', href: '/assets/reports', icon: BarChart3, permissions: ['assets.view'] },
      { title: 'System Management', href: '/assets/system', icon: Settings, permissions: ['assets.view'] },
      { title: 'Access Management', href: '/assets/access', icon: Shield, permissions: ['assets.view'] },
      { title: 'Support Tickets', href: '/assets/support', icon: MessageCircle, permissions: ['assets.view'] }
    ]
  },
  {
    title: 'GST & Invoicing',
    href: '/gst',
    icon: FileText,
    badge: 'GST',
    permissions: ['gst.view']
  },
  {
    title: 'Business Intelligence',
    href: '/business-intelligence',
    icon: Brain,
    badge: 'BI',
    permissions: ['business.intelligence'],
    children: [
      { title: 'BI Dashboard', href: '/business-intelligence', icon: Activity, permissions: ['business.intelligence'] },
      { title: 'Custom Reports', href: '/business-intelligence/reports', icon: BarChart3, permissions: ['business.intelligence'] },
      { title: 'Real-time KPIs', href: '/business-intelligence/kpis', icon: Activity, permissions: ['business.intelligence'] },
      { title: 'Predictive Analytics', href: '/business-intelligence/predictive', icon: Brain, permissions: ['analytics.predictive'] },
      { title: 'Advanced BI', href: '/business-intelligence/advanced', icon: Brain, permissions: ['business.intelligence.advanced'] }
    ]
  },
  {
    title: 'Reports & Analytics',
    href: '/reports',
    icon: BarChart3,
    permissions: ['reports.view'],
    children: [
      { title: 'Standard Reports', href: '/reports', icon: BarChart3, permissions: ['reports.view'] },
      { title: 'Advanced Reporting', href: '/reports/advanced', icon: BarChart3, permissions: ['reports.view'] }
    ]
  },
  {
    title: 'Automation Hub',
    href: '/automation',
    icon: Zap,
    permissions: ['automation.view'],
    children: [
      { title: 'Workflow Automation', href: '/automation', icon: Zap, permissions: ['automation.view'] },
      { title: 'Mobile Features', href: '/mobile/features', icon: Smartphone, permissions: ['automation.view'] },
      { title: 'Advanced Integrations', href: '/integrations/advanced', icon: Cloud, permissions: ['automation.view'] }
    ]
  },
  {
    title: 'Future Enhancements',
    href: '/future',
    icon: Brain,
    permissions: ['admin'],
    children: [
      { title: 'Blockchain Integration', href: '/blockchain/integration', icon: Link, permissions: ['admin'] },
      { title: 'IoT Connectivity', href: '/iot/connectivity', icon: Cpu, permissions: ['admin'] },
      { title: 'Multi-language Support', href: '/internationalization/languages', icon: Globe, permissions: ['admin'] },
      { title: 'Cloud Deployment', href: '/cloud/deployment', icon: Server, permissions: ['admin'] },
      { title: 'Advanced Security', href: '/security/advanced', icon: Lock, permissions: ['admin'] }
    ]
  },
  {
    title: 'File Management',
    href: '/files',
    icon: FolderOpen,
    permissions: ['files.view']
  },
  {
    title: 'User Management',
    href: '/users',
    icon: Shield,
    permissions: ['users.view']
  },
  {
    title: 'User Profile',
    href: '/profile',
    icon: User,
    permissions: ['profile.view']
  },
  {
    title: 'Customization',
    href: '/customization',
    icon: Settings,
    permissions: ['settings.view']
  },
  {
    title: 'Pricing',
    href: '/pricing',
    icon: DollarSign,
    permissions: ['pricing.view']
  },
  {
    title: 'Home',
    href: '/home',
    icon: Home,
    permissions: ['home.view']
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    permissions: ['settings.view']
  }
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, allowedModules, currentModule } = useStore();
  // Set default expanded state to show all modules
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'SmartX CRM', 'SmartX ERP', 'SmartX HRMS', 'SmartX IT Asset', 
    'Business Intelligence', 'Reports & Analytics', 'Automation Hub', 'Future Enhancements'
  ]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const hasPermission = (permissions: string[] = []) => {
    if (!currentUser) {
      return false;
    }
    
    // Check if user has admin role (full access to everything)
    if (currentUser.role === 'admin' || currentUser.role === 'superAdmin') {
      console.log(`👑 Admin user has access to all features:`, permissions);
      return true;
    }
    
    // Use the RBAC system for non-admin users
    const { canAccess } = useRBAC();
    
    // Check specific permissions for non-admin users
    if (permissions.length > 0) {
      const hasAccess = permissions.some(permission => {
        // Check if user has the exact permission
        if (currentUser.permissions?.includes(permission)) {
          return true;
        }
        // Check using RBAC system
        const [resource, action] = permission.split('.');
        return canAccess(resource);
      });
      
      console.log(`🔑 Permission check for ${currentUser.role}:`, {
        permissions,
        userPermissions: currentUser.permissions?.slice(0, 5),
        hasAccess
      });
      
      return hasAccess;
    }
    
    // Default to false for security
    return false;
  };

  const isActive = (href: string) => {
    if (href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href));
  };

  // Filter navigation items based on user permissions AND allowed modules
  const filteredNavItems = navigationItems.filter(item => {
    // First check permissions
    if (!hasPermission(item.permissions)) {
      return false;
    }
    
    // Then check if module is allowed for this user
    if (allowedModules && allowedModules.length > 0) {
      return allowedModules.includes(item.title);
    }
    
    // Default to showing all items if no module restrictions
    return true;
  });
  
  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-40 lg:relative lg:translate-x-0 lg:transform-none ${
        open ? 'translate-x-0' : '-translate-x-full'
      } w-72 lg:w-64 xl:w-72`}
    >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">SmartSuite X Portal</h2>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.name}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={currentUser?.role === 'admin' ? 'default' : 'secondary'} 
                    className="text-xs capitalize"
                  >
                    {currentUser?.role}
                  </Badge>
                  {currentModule && (
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                      {currentModule.toUpperCase()}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">{currentUser?.department}</span>
                </div>
              </div>
            </div>
            {/* Module Access Info */}
            {allowedModules && allowedModules.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                <span className="font-medium">Access:</span> {allowedModules.join(', ')}
              </div>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.title);

                return (
                  <div key={item.title}>
                    <Button
                      variant={active && !hasChildren ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-3 ${
                        active && !hasChildren
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpanded(item.title);
                        } else {
                          navigate(item.href);
                          onClose();
                        }
                      }}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 text-xs bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {hasChildren && (
                        <ChevronRight 
                          className={`ml-2 h-4 w-4 transition-transform ${
                            isExpanded ? 'transform rotate-90' : ''
                          }`} 
                        />
                      )}
                    </Button>

                    {/* Children */}
                    {hasChildren && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isActive(child.href);

                          return (
                            <Button
                              key={child.title}
                              variant={childActive ? "default" : "ghost"}
                              className={`w-full justify-start h-auto p-2 ${
                                childActive
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                navigate(child.href);
                                onClose();
                              }}
                            >
                              <ChildIcon className="mr-3 h-4 w-4" />
                              <span className="text-sm">{child.title}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
  );
}
