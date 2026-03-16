import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { hydrateFromStorage } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const user = params.get('user');
      const message = params.get('message');

      if (!token || !user) {
        setError(message || 'OAuth failed');
        return;
      }

      // Persist token and user
      localStorage.setItem('authToken', token);
      try {
        const userObj = JSON.parse(decodeURIComponent(user));
        localStorage.setItem('userInfo', JSON.stringify(userObj));
      } catch (e) {
        // fallback: store raw
        localStorage.setItem('userInfo', user);
      }

      // Update app auth state immediately
      hydrateFromStorage();

      // Decide redirect by role
      let userData;
      try {
        userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
      } catch (_) {
        userData = {};
      }

      if (userData?.roles?.includes('ADMIN')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (userData?.roles?.includes('SELLER')) {
        navigate('/seller/dashboard', { replace: true });
      } else if (userData?.roles?.includes('SUPPLIER')) {
        navigate('/supplier/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } catch (e) {
      setError('Unexpected error during OAuth');
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 rounded-lg border bg-white shadow">
          <p className="text-black font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded-lg border bg-white shadow">
        <p className="text-gray-700">Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;


