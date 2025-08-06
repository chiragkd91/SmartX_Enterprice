/**
 * Fully responsive application layout with mobile-first design
 */

import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useSessionManager } from '../../hooks/useSessionManager';
import SessionWarningDialog from '../Auth/SessionWarningDialog';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { loading } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { sessionState, extendSession, getSessionConfig } = useSessionManager();
  const { currentUser, logout } = useStore();

  console.log('🏠 AppLayout render - loading:', loading);

  // Close mobile menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mobile menu toggle
  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Enterprise HR System...</p>
          <p className="text-sm text-gray-500 mt-2">Loading modules and user permissions...</p>
        </div>
      </div>
    );
  }

  const sessionConfig = getSessionConfig();

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          open={isMobileMenuOpen} 
          onClose={handleMobileMenuClose}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header 
          onMenuToggle={handleMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {/* Session Warning Dialog */}
          <SessionWarningDialog
            isOpen={sessionState.showWarning}
            timeRemaining={sessionConfig.warningMinutes * 60}
            warningMinutes={sessionConfig.warningMinutes}
            onExtend={extendSession}
            onLogout={logout}
            userRole={currentUser?.role || 'user'}
          />
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
