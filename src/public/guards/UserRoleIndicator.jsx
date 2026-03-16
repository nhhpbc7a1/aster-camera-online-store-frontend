import React from 'react';
import { useAuth } from '@/core/auth/AuthContext';

const UserRoleIndicator = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const userRoles = user?.roles || [];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-black-100 text-red-800';
      case 'seller':
        return 'bg-blue-100 text-blue-800';
      case 'supplier':
        return 'bg-green-100 text-green-800';
      case 'customer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'seller':
        return 'Seller';
      case 'supplier':
        return 'Supplier';
      case 'customer':
        return 'Customer';
      default:
        return 'User';
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* User Info */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#ee4d2d] rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-900">{user.username || 'User'}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Role Badges */}
      <div className="flex space-x-1">
        {userRoles.map((role, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
          >
            {getRoleDisplayName(role)}
          </span>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="px-3 py-1 text-sm text-gray-600 hover:text-black hover:bg-black-50 rounded-md transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default UserRoleIndicator;
