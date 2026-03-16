import React from 'react';
import { useAuth } from '@/core/auth/AuthContext';

const UnauthorizedAccess = () => {
  const { user } = useAuth();
  const userRoles = user?.roles || [];

  const getDashboardUrl = () => {
    if (userRoles.includes('ADMIN')) {
      return '/admin/dashboard';
    } else if (userRoles.includes('SELLER')) {
      return '/seller/dashboard';
    } else if (userRoles.includes('SUPPLIER')) {
      return '/supplier/dashboard';
    } else {
      return '/customer/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-black-100 mb-4">
            <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href={getDashboardUrl()}
            className="w-full bg-[#ee4d2d] text-white py-2 px-4 rounded-lg hover:bg-[#d73502] transition-colors inline-block"
          >
            Go to Your Dashboard
          </a>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Your current role: <span className="font-medium">{userRoles.join(', ') || 'Customer'}</span></p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
