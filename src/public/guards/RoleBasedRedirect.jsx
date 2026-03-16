import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthContext';

export const RoleBasedRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log('[RoleBasedRedirect] State:', { 
    isAuthenticated, 
    loading, 
    user: user ? { 
      userId: user.userId, 
      username: user.username, 
      email: user.email, 
      roles: user.roles 
    } : null 
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('[RoleBasedRedirect] Loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ee4d2d]"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('[RoleBasedRedirect] Not authenticated, redirecting to login');
    return <Navigate to="/customer/login" replace />;
  }

  // Get user roles from user object or localStorage as fallback
  let userRoles = user?.roles || [];
  
  // Fallback: try to get roles from localStorage if user object is empty
  if (userRoles.length === 0) {
    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      userRoles = storedUser?.roles || [];
      console.log('[RoleBasedRedirect] Using roles from localStorage:', userRoles);
    } catch (error) {
      console.log('[RoleBasedRedirect] Error parsing localStorage userInfo:', error);
    }
  }
  
  console.log('[RoleBasedRedirect] User roles:', userRoles);
  
  // Redirect based on user role
  if (userRoles.includes('ADMIN')) {
    console.log('[RoleBasedRedirect] Admin user - redirecting to admin dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRoles.includes('SELLER')) {
    console.log('[RoleBasedRedirect] Redirecting to seller dashboard');
    return <Navigate to="/seller/dashboard" replace />;
  } else if (userRoles.includes('SUPPLIER')) {
    console.log('[RoleBasedRedirect] Redirecting to supplier dashboard');
    return <Navigate to="/supplier/dashboard" replace />;
  } else {
    console.log('[RoleBasedRedirect] Redirecting to customer dashboard (default)');
    return <Navigate to="/customer" replace />;
  }
};