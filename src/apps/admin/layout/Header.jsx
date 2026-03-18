import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  User,
  ChevronDown
} from 'lucide-react';
import LogoutButton from '@/public/auth/components/LogoutButton';

const Header = ({
  isCollapsed,
  onToggleSidebar,
  theme,
  onToggleTheme
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 max-[850px]:px-4 relative z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4 min-w-0 flex-1 overflow-x-hidden">
        {/* Mobile Menu Toggle - only show on mobile */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors max-[850px]:block min-[851px]:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative hidden md:block max-[850px]:block max-[850px]:flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 lg:w-80 max-[850px]:w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-w-full"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 max-[850px]:gap-1">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors max-[850px]:hidden"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative max-[850px]:hidden">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        {/* User Menu */}
        <div className="relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 max-[850px]:gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <User className="w-8 h-8 max-[850px]:w-6 max-[850px]:h-6 text-gray-400" />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 max-[850px]:hidden text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">asterproduction333@gmail.com</p>
              </div>
              <div className="py-1">
                <LogoutButton className="w-full justify-start" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

