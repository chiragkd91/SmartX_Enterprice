/**
 * Fully responsive header component with mobile menu support
 */

import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import SessionStatus from '../Auth/SessionStatus';
import ChangePasswordModal from '../Auth/ChangePasswordModal';
import { Badge } from '../ui/badge';
import { Bell, Search, Settings, LogOut, User, Menu, X, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const { currentUser, logout, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const sessionConfig = {
    timeoutMinutes: 120, // Default - get actual from session
    warningMinutes: 5,
    extendMinutes: 30
  }; // Replace with actual session config
  const [notifications] = useState(3); // Mock notification count
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button + Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center space-x-2">
            <h2 className="text-lg font-bold text-gray-800">SmartSuite X Portal</h2>
          </div>
        </div>

        {/* Search - Hidden on small screens */}
        <div className="hidden md:flex flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees, reports, analytics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Desktop Logo - Center */}
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-xs">
          <h2 className="text-lg font-bold text-gray-800 opacity-60">SmartSuite X Portal</h2>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Session Status */}
          {isAuthenticated && currentUser && (
          <SessionStatus 
            timeRemaining={currentUser.timeRemaining || 60}
            userRole={currentUser.role}
            isActive={currentUser.isActive || true}
            showWarning={currentUser.showWarning || false}
            sessionConfig={sessionConfig}
          />
        )}

        {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar || ''} alt={currentUser?.name || 'User'} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                    {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="w-fit text-xs">
                      {currentUser?.role}
                    </Badge>
                    {currentUser?.department && (
                      <Badge variant="outline" className="w-fit text-xs">
                        {currentUser?.department}
                      </Badge>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePasswordChange} data-password-change>
                <Key className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Password Change Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        userId={currentUser?.id || ''}
      />
    </header>
  );
}
