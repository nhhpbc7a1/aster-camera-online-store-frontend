import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthContext';
import { usePlan } from '@/domains/plan/context/PlanContext';
import planService from '@/domains/plan/services/plan.service.js';
import { Crown, X, CheckCircle, ArrowRight, Lock, AlertTriangle, RefreshCw } from 'lucide-react';

const PlanModal = ({ blocking = true, onClose = null }) => {
  const { user } = useAuth();
  const { availablePlans, loading, plan, refreshPlan } = usePlan();
  const navigate = useNavigate();
  const [subscribingPlanId, setSubscribingPlanId] = useState(null);

  const userRoles = user?.roles || [];
  const userType = userRoles.some(r => r.toUpperCase() === 'SUPPLIER') ? 'supplier' : 'seller';
  const planPath = `/${userType}/plan`;

  // Handle subscribe directly from modal (same logic as plan.jsx)
  const handleSubscribe = async (planId, autoRenew = false) => {
    // Check if this is a renewal (same plan as current)
    const isRenewal = plan && plan.id === planId;

    const confirmMessage = isRenewal
      ? 'Are you sure you want to extend your current plan? The days will be added to your current expiration date.'
      : 'Are you sure you want to subscribe to this plan?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setSubscribingPlanId(planId);
    try {
      const response = await planService.subscribe(planId, autoRenew);
      // Check if request was successful (status 200-299)
      if (response?.status >= 200 && response?.status < 300) {
        alert(isRenewal ? 'Plan extended successfully! Days have been added to your plan.' : 'Successfully subscribed to plan!');

        // Refresh plan state to update UI immediately
        await refreshPlan();

        // If blocking modal, it will automatically disappear when hasActivePlan becomes true
        // If non-blocking, close the modal
        if (!blocking && onClose) {
          onClose();
        }
      } else {
        alert('Failed to subscribe: Unexpected response');
      }
    } catch (error) {
      alert('Failed to subscribe: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setSubscribingPlanId(null);
    }
  };

  const handleGoToplan = () => {
    navigate(planPath);
  };

  const handleClose = () => {
    if (!blocking && onClose) {
      onClose();
    }
  };

  // Format currency (reuse from plan.jsx)
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Determine message based on plan status
  const getMessage = () => {
    if (!plan) {
      return {
        title: 'Plan Required',
        description: 'You need an active plan to access this feature.',
        icon: Lock
      };
    }

    const status = plan.status?.toLowerCase();
    if (status === 'expired') {
      return {
        title: 'plan Expired',
        description: 'Your plan has expired. Please renew to continue using our services.',
        icon: AlertTriangle
      };
    }

    return {
      title: 'Plan Required',
      description: 'You need an active plan to access this feature.',
      icon: Lock
    };
  };

  const message = getMessage();
  const MessageIcon = message.icon;


  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop - không cho đóng nếu blocking */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MessageIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{message.title}</h2>
                <p className="text-blue-100 mt-1">
                  {message.description}
                </p>
              </div>
            </div>
            {!blocking && (
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Message */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-700">
                  To continue using {userType === 'supplier' ? 'supplier' : 'seller'} features,
                  please subscribe to one of our plans below.
                </p>
              </div>

              {/* Available Plans */}
              {availablePlans.length > 0 ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Choose a Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {availablePlans.slice(0, 3).map((plan) => (
                      <div
                        key={plan.id}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition cursor-pointer group"
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {formatCurrency(plan.price)}
                          </div>
                          <div className="text-gray-500 text-sm">per {plan.billingCycle}</div>
                        </div>

                        <ul className="space-y-2 mb-4">
                          {plan.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{feature}</span>
                            </li>
                          ))}
                          {plan.features.length > 4 && (
                            <li className="text-xs text-gray-500 text-center">
                              +{plan.features.length - 4} more features
                            </li>
                          )}
                        </ul>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubscribe(plan.id);
                          }}
                          disabled={subscribingPlanId !== null}
                          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition group-hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                        >
                          {subscribingPlanId === plan.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Subscribing...</span>
                            </>
                          ) : (
                            <span>Subscribe Now</span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No plans available at the moment.</p>
                </div>
              )}

              {/* CTA Button */}
              <div className="flex justify-center pt-4 border-t border-gray-200">
                <button
                  onClick={handleGoToplan}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  <Crown className="w-5 h-5" />
                  View All Plans & Details
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Blocking notice */}
              {blocking && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    You must subscribe to continue using the platform
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanModal;

