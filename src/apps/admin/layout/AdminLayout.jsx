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
    <div className={`min-h-screen bg-gray-50 overflow-x-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={handleToggleSidebar}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobile={handleToggleMobileMenu}
      />

      <div className={`
        transition-all duration-300
        ${isCollapsed ? 'min-[851px]:ml-20' : 'min-[851px]:ml-64'}
        max-[850px]:ml-0
        relative
      `}>
        <Header
          isCollapsed={isCollapsed}
          onToggleSidebar={handleToggleMobileMenu}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        <main className="p-6 max-[850px]:p-4 w-full overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

