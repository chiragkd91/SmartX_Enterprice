/**
 * Custom Sidebar Component for SmartBizFlow Portal
 * Displays navigation based on user roles and enabled modules
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRBAC } from '../../hooks/useRBAC';
import { useModules } from '../Customization/ModuleProvider';
import { useTheme } from '../Customization/ThemeProvider';
import { cn } from '../../lib/utils';
import { 
  BarChart3, 
  Users, 
  Package, 
  UserCheck, 
  Monitor, 
  Receipt, 
  TrendingUp, 
  Zap, 
  Folder, 
  Settings, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  Shield,
  GraduationCap,
  UserPlus,
  UserMinus,
  Heart,
  Workflow,
  Database,
  Network,
  Wrench,
  Key,
  Headphones,
  BarChart,
  Cog,
  Menu
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface MenuItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  module: string;
  children?: MenuItem[];
  badge?: string;
}

export const CustomSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { canAccess } = useRBAC();
  const { isModuleEnabled } = useModules();
  const { theme } = useTheme();

  const toggleExpanded = (itemPath: string) => {
    setExpandedItems(prev => 
      prev.includes(itemPath) 
        ? prev.filter(path => path !== itemPath)
        : [...prev, itemPath]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: BarChart3,
      module: 'dashboard'
    },
    {
      title: 'Home',
      path: '/home',
      icon: Home,
      module: 'dashboard'
    },
    {
      title: 'CRM',
      path: '/crm',
      icon: Users,
      module: 'crm',
      children: [
        { title: 'Overview', path: '/crm', icon: Building2, module: 'crm' },
        { title: 'Leads', path: '/crm/leads', icon: UserPlus, module: 'crm' },
        { title: 'Customers', path: '/crm/customers', icon: Users, module: 'crm' }
      ]
    },
    {
      title: 'ERP',
      path: '/erp',
      icon: Package,
      module: 'erp',
      children: [
        { title: 'Overview', path: '/erp', icon: Building2, module: 'erp' },
        { title: 'Products', path: '/erp/products', icon: Package, module: 'erp' },
        { title: 'Orders', path: '/erp/orders', icon: Briefcase, module: 'erp' },
        { title: 'Invoices', path: '/erp/invoices', icon: Receipt, module: 'erp' },
        { title: 'Vendors', path: '/erp/vendors', icon: Building2, module: 'erp' }
      ]
    },
    {
      title: 'HR Management',
      path: '/hr',
      icon: UserCheck,
      module: 'hr',
      children: [
        { title: 'Dashboard', path: '/hr', icon: BarChart3, module: 'hr' },
        { title: 'Employees', path: '/hr/employees', icon: Users, module: 'hr' },
        { title: 'Attendance', path: '/hr/attendance', icon: Calendar, module: 'hr' },
        { title: 'Leave', path: '/hr/leave', icon: Calendar, module: 'hr' },
        { title: 'Payroll', path: '/hr/payroll', icon: DollarSign, module: 'hr' },
        { title: 'Performance', path: '/hr/performance', icon: BarChart, module: 'hr' },
        { title: 'Recruitment', path: '/hr/recruitment', icon: UserPlus, module: 'hr' },
        { title: 'Training', path: '/hr/training', icon: GraduationCap, module: 'hr' },
        { title: 'Self Service', path: '/hr/self-service', icon: UserCheck, module: 'hr' },
        { title: 'Onboarding', path: '/hr/onboarding', icon: UserPlus, module: 'hr' },
        { title: 'Offboarding', path: '/hr/offboarding', icon: UserMinus, module: 'hr' },
        { title: 'Benefits', path: '/hr/benefits', icon: Heart, module: 'hr' },
        { title: 'Workflow', path: '/hr/workflow', icon: Workflow, module: 'hr' },
        { title: 'Reports', path: '/hr/reports', icon: FileText, module: 'hr' }
      ]
    },
    {
      title: 'IT Asset Portal',
      path: '/assets',
      icon: Monitor,
      module: 'itAssets',
      children: [
        { title: 'Dashboard', path: '/assets', icon: BarChart3, module: 'itAssets' },
        { title: 'Asset Management', path: '/assets/management', icon: Database, module: 'itAssets' },
        { title: 'Asset Tracking', path: '/assets/tracking', icon: Network, module: 'itAssets' },
        { title: 'Maintenance', path: '/assets/maintenance', icon: Wrench, module: 'itAssets' },
        { title: 'Software Licenses', path: '/assets/software', icon: Key, module: 'itAssets' },
        { title: 'IT Inventory', path: '/assets/inventory', icon: Database, module: 'itAssets' },
        { title: 'System Management', path: '/assets/system', icon: Cog, module: 'itAssets' },
        { title: 'Access Management', path: '/assets/access', icon: Shield, module: 'itAssets' },
        { title: 'Support Tickets', path: '/assets/support', icon: Headphones, module: 'itAssets' },
        { title: 'Reports', path: '/assets/reports', icon: FileText, module: 'itAssets' }
      ]
    },
    {
      title: 'GST & Compliance',
      path: '/gst',
      icon: Receipt,
      module: 'gst',
      children: [
        { title: 'GST Invoice', path: '/gst', icon: Receipt, module: 'gst' }
      ]
    },
    {
      title: 'Business Intelligence',
      path: '/business-intelligence',
      icon: TrendingUp,
      module: 'businessIntelligence'
    },
    {
      title: 'Automation',
      path: '/automation',
      icon: Zap,
      module: 'automation'
    },
    {
      title: 'File Management',
      path: '/files',
      icon: Folder,
      module: 'fileManagement'
    },
    {
      title: 'User Management',
      path: '/users',
      icon: Users,
      module: 'userManagement'
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: FileText,
      module: 'reports'
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: Settings,
      module: 'settings'
    },
    {
      title: 'Customization',
      path: '/customization',
      icon: Palette,
      module: 'settings'
    }
  ];

  // Filter menu items based on user permissions and module enablement
  const filteredMenuItems = menuItems.filter(item => {
    if (!canAccess(item.module) || !isModuleEnabled(item.module as any)) {
      return false;
    }
    
    if (item.children) {
      item.children = item.children.filter(child => 
        canAccess(child.module) && isModuleEnabled(child.module as any)
      );
      return item.children.length > 0;
    }
    
    return true;
  });

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const Icon = item.icon;
    const isItemActive = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.path);

    if (hasChildren) {
      return (
        <Collapsible
          key={item.path}
          open={isExpanded}
          onOpenChange={() => toggleExpanded(item.path)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between h-10 px-3",
                isItemActive && "bg-primary/10 text-primary",
                level > 0 && "ml-4"
              )}
              style={{
                color: isItemActive ? theme.primary.light : theme.neutral[600],
                backgroundColor: isItemActive ? `${theme.primary.light}1A` : 'transparent'
              }}
            >
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-90"
                )} />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-1">
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.path}
        variant="ghost"
        className={cn(
          "w-full justify-start h-10 px-3",
          isItemActive && "bg-primary/10 text-primary",
          level > 0 && "ml-4"
        )}
        style={{
          color: isItemActive ? theme.primary.light : theme.neutral[600],
          backgroundColor: isItemActive ? `${theme.primary.light}1A` : 'transparent'
        }}
        onClick={() => navigate(item.path)}
      >
        <Icon className="h-4 w-4 mr-2" />
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span>{item.title}</span>
            {item.badge && (
              <span 
                className="ml-auto text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: theme.accent.light,
                  color: theme.accent.contrast
                }}
              >
                {item.badge}
              </span>
            )}
          </div>
        )}
      </Button>
    );
  };

  return (
    <aside 
      className={cn(
        "flex flex-col border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{ 
        backgroundColor: theme.neutral[50],
        borderColor: theme.neutral[200]
      }}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end p-4 border-b" style={{ borderColor: theme.neutral[200] }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ color: theme.neutral[600] }}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          {filteredMenuItems.map(item => renderMenuItem(item))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default CustomSidebar; 