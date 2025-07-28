/**
 * Custom Header Component for SmartBizFlow Portal
 * Displays company branding and user information
 */

import React from 'react';
import { useTheme } from '../Customization/ThemeProvider';
import { useRBAC } from '../../hooks/useRBAC';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, User, LogOut, Palette } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

export const CustomHeader: React.FC = () => {
  const { branding, theme } = useTheme();
  const { currentUser, logout } = useStore();
  const { isAdmin, isManager, getHighestRole } = useRBAC();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'superAdmin': 'Super Admin',
      'admin': 'Administrator',
      'manager': 'Manager',
      'crmManager': 'CRM Manager',
      'hrManager': 'HR Manager',
      'itManager': 'IT Manager',
      'employee': 'Employee',
      'salesRep': 'Sales Representative',
      'accountant': 'Accountant',
      'guest': 'Guest'
    };
    return roleMap[role] || role;
  };

  return (
    <header 
      className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm"
      style={{ 
        backgroundColor: theme.neutral[50],
        borderColor: theme.neutral[200]
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src={branding.logo.url} 
              alt={branding.logo.alt}
              width={branding.logo.width}
              height={branding.logo.height}
              className="h-8 w-auto"
              onError={(e) => {
                // Fallback to text if logo fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'text-xl font-bold text-blue-600';
                  fallback.textContent = branding.appName;
                  parent.appendChild(fallback);
                }
              }}
            />
            <div className="hidden md:block">
              <h1 
                className="text-xl font-semibold"
                style={{ color: theme.neutral[900] }}
              >
                {branding.appName}
              </h1>
              <p 
                className="text-sm"
                style={{ color: theme.neutral[600] }}
              >
                {branding.appDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right Section - User Info and Actions */}
        <div className="flex items-center space-x-4">
          {/* Customization Button */}
          {(isAdmin() || isManager()) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/customization')}
              style={{ color: theme.neutral[600] }}
              title="Portal Customization"
            >
              <Palette className="h-5 w-5" />
            </Button>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            style={{ color: theme.neutral[600] }}
          >
            <Bell className="h-5 w-5" />
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              style={{ 
                backgroundColor: theme.error.light,
                color: theme.error.contrast
              }}
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback 
                    style={{ 
                      backgroundColor: theme.primary.light,
                      color: theme.primary.contrast
                    }}
                  >
                    {getUserInitials(currentUser?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email || 'user@example.com'}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className="w-fit mt-1"
                    style={{ 
                      backgroundColor: theme.secondary.light,
                      color: theme.secondary.contrast
                    }}
                  >
                    {getRoleDisplayName(getHighestRole() || 'employee')}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              {isAdmin() && (
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader; 