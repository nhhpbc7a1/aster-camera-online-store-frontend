import React from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { usePlan } from '@/domains/plan/context/PlanContext';
import PlanModal from '@/public/guards/PlanModal.jsx';

/**
 * PlanGuard - Component to protect routes that require active plan
 * 
 * Usage:
 * <PlanGuard>
 *   <YourProtectedComponent />
 * </PlanGuard>
 * 
 * Props:
 * - requireActive: boolean (default: true) - If true, requires active plan
 * - children: React components to render if plan check passes
 */
const PlanGuard = ({ children, requireActive = true }) => {
  const { user } = useAuth();
  const { hasActivePlan, isExpired, loading } = usePlan();

  // ✅ FIX: hasActivePlan is already a boolean from context, not a function
  const hasActive = hasActivePlan === true;

  // Check if user needs plan
  const userRoles = user?.roles || [];
  const needsplan = userRoles.some(role =>
    ['SELLER', 'SUPPLIER'].includes(role.toUpperCase())
  );

  // Don't block if:
  // 1. Not a seller/supplier (Customer/Admin don't need plan)
  // 2. Still loading plan data
  if (!needsplan || loading) {
    return children;
  }

  // Check if plan is required and user doesn't have active plan
  if (requireActive && !hasActive) {
    // Show blocking modal overlay on top of the page
    return (
      <>
        {/* Render children but make them non-interactive */}
        <div className="pointer-events-none opacity-50">
          {children}
        </div>

        {/* Show blocking modal */}
        <PlanModal blocking={true} />
      </>
    );
  }

  // User has active plan or doesn't require one
  return children;
};

export default PlanGuard;

