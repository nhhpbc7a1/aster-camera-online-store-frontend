import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthContext';

export const RoleBasedRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ee4d2d]"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/customer/login" replace />;
  }

  // Get user roles from user object or localStorage as fallback
  let userRoles = user?.roles || [];
  
  // Fallback: try to get roles from localStorage if user object is empty
  if (userRoles.length === 0) {
    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      userRoles = storedUser?.roles || [];
    } catch (error) {
      // no-op
    }
  }
  
  // Redirect based on user role
  if (userRoles.includes('ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRoles.includes('SELLER')) {
    return <Navigate to="/seller/dashboard" replace />;
  } else if (userRoles.includes('SUPPLIER')) {
    return <Navigate to="/supplier/dashboard" replace />;
  } else {
    return <Navigate to="/customer" replace />;
  }
};