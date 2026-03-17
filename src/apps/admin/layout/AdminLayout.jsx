import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/apps/admin/layout/Sidebar';
import Header from '@/apps/admin/layout/Header';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={handleToggleSidebar}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobile={handleToggleMobileMenu}
      />

      <div className={`
        transition-all duration-300
        ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        max-[850px]:ml-0
      `}>
        <Header
          isCollapsed={isCollapsed}
          onToggleSidebar={handleToggleMobileMenu}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        <main className="p-6 max-[850px]:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

