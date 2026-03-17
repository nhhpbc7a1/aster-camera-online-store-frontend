import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthContext';
import UnauthorizedAccess from './UnauthorizedAccess';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRoles.length > 0) {
    // Support both 'role' (string) and 'roles' (array)
    let userRoles = [];

    // If user has 'role' as string, convert to array
    if (user?.role && typeof user.role === 'string') {
      userRoles = [user.role];
    }

    // If user has 'roles' as array, use it
    if (user?.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      userRoles = user.roles;
    }

    const userRolesNormalized = userRoles.map((r) => String(r).toUpperCase());
    const required = requiredRoles.map((r) => String(r).toUpperCase());

    // Admin bypass: full access
    if (!userRolesNormalized.includes('ADMIN')) {
      const hasRequiredRole = required.some((role) => userRolesNormalized.includes(role));
      if (!hasRequiredRole) {
        return <UnauthorizedAccess />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
