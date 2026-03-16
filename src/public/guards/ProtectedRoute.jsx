import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthContext';
import UnauthorizedAccess from './UnauthorizedAccess';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  console.log('🛡️ [ProtectedRoute] Rendering...', { requiredRoles });

  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('🛡️ [ProtectedRoute] Auth state:', {
    isAuthenticated,
    loading,
    userId: user?.userId,
    userRoles: user?.roles,
    pathname: location.pathname
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('🛡️ [ProtectedRoute] Still loading auth...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ee4d2d]"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🛡️ [ProtectedRoute] ⛔ Not authenticated, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRoles.length > 0) {
    const userRolesRaw = user?.roles || [];
    const userRoles = userRolesRaw.map((r) => String(r).toUpperCase());
    const required = requiredRoles.map((r) => String(r).toUpperCase());

    console.log('🛡️ [ProtectedRoute] Role check:', { userRoles, required });

    // Admin bypass: full access
    if (!userRoles.includes('ADMIN')) {
      const hasRequiredRole = required.some((role) => userRoles.includes(role));
      if (!hasRequiredRole) {
        console.log('🛡️ [ProtectedRoute] ⛔ No required role, redirecting');
        const lower = requiredRoles[0]?.toLowerCase();
        if (lower === 'seller' || lower === 'supplier') {
          return <Navigate to={`/customer/signup?role=${lower}`} replace />;
        }
        return <UnauthorizedAccess />;
      }
    }
  }

  console.log('🛡️ [ProtectedRoute] ✅ Access granted, rendering children');
  return children;
};

export default ProtectedRoute;
