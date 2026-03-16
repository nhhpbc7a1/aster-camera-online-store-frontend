import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthContext';
import iconGoogle from '@/public/assets/icon/icon_google.png';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're on /auth routes or /customer routes
  const isAuthRoute = location.pathname.startsWith('/auth');
  const signupPath = isAuthRoute ? '/auth/signup' : '/customer/signup';
  const forgotPasswordPath = isAuthRoute ? '/auth/forgot-password' : '/customer/forgot-password';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoBack = () => {
    navigate('/'); // Điều hướng về trang chủ
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    console.log('[LoginForm] Form submitted!');
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('[LoginForm] Form data:', formData);

    // Basic validation
    if (!formData.email || !formData.password) {
      console.log('[LoginForm] Validation failed: missing email or password');
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      setIsLoading(false);
      return;
    }

    try {
      console.log('[LoginForm] Attempting login with:', { email: formData.email, password: formData.password });

      const result = await login(formData.email, formData.password);

      console.log('[LoginForm] Login result:', result);

      if (result.success) {
        console.log('[LoginForm] Login successful!');
        console.log('[LoginForm] Full result:', result);
        console.log('[LoginForm] result.user:', result.user);
        console.log('[LoginForm] result.data:', result.data);

        // Get user data from result.user (set by AuthContext)
        let userData = result.user;

        // If still no user data, try localStorage as fallback
        if (!userData) {
          try {
            userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
            console.log('[LoginForm] Using localStorage user data:', userData);
          } catch (error) {
            console.log('[LoginForm] Error parsing localStorage:', error);
            userData = {};
          }
        }

        console.log('[LoginForm] Final user data for redirect:', userData);
        console.log('[LoginForm] User roles:', userData?.roles);
        console.log('[LoginForm] User roles type:', typeof userData?.roles);
        console.log('[LoginForm] User roles array check:', Array.isArray(userData?.roles));

        // Add small delay to ensure AuthContext has updated
        setTimeout(() => {
          // Redirect based on user role immediately
          if (userData?.roles?.includes('ADMIN')) {
            console.log('[LoginForm] Redirecting to admin dashboard');
            navigate('/admin/dashboard');
          } else if (userData?.roles?.includes('SELLER')) {
            console.log('[LoginForm] Redirecting to seller dashboard');
            navigate('/seller/dashboard');
          } else if (userData?.roles?.includes('SUPPLIER')) {
            console.log('[LoginForm] Redirecting to supplier dashboard');
            navigate('/supplier/dashboard');
          } else {
            console.log('[LoginForm] Redirecting to customer dashboard (default)');
            navigate('/customer/dashboard');
          }
        }, 100);
      } else {
        console.log('[LoginForm] Login failed:', result.message);
        setError(result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('[LoginForm] Login error:', error);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const redirectUri = `${window.location.origin}/customer/oauth/callback`;
    const oauthPath = import.meta.env.VITE_GOOGLE_OAUTH_PATH || '/users/oauth/google';
    const url = `${apiBase}${oauthPath}?redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  return (
    <div className=" p-10 w-1/3 flex flex-col rounded-sm bg-white justify-center">
      <button onClick={handleGoBack} className="flex border-none items-center font-semibold hover:text-gray-800">
        <ArrowLeft size={20} className="mr-2" />
      </button>

      <div className=" text-center mb-6">
        <h2 className="text-2xl font-bold">Sign in</h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Error message */}
        {error && (
          <div className="bg-black-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
          required
        />
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword}
          </span>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 bg-gradient-to-r from-[#1c2c5b] to-[#283e83] text-white font-semibold rounded-md hover:bg-black transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Sign in'}
        </button>
      </form>

      <div className=" mt-4 text-sm">
        <Link to={forgotPasswordPath} className="text-gray-500 hover:underline">
          Forgot your password
        </Link>
      </div>

      <div className="flex items-center my-5">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex justify-center space-x-4">
        <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full py-2 font-semibold gap-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
          <img src={iconGoogle} alt="" className='w-5' />Google
        </button>
      </div>

      <div className="text-center mt-6 text-sm font-semibold text-gray-500">
        Don't have an account?{" "}
        <Link to={signupPath} className="text-[#283e83] hover:underline font-semibold">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;