import React, { useState } from 'react';
import { authService } from '../../service/auth.service';

const RegisterWithOTP = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState('register'); // 'register' | 'verify' | 'success'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleName: 'CUSTOMER'
  });
  const [otp, setOtp] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register(
        formData.username,
        formData.email,
        formData.password,
        {},
        formData.roleName
      );

      if (result.success) {
        console.log('Register result:', result);
        console.log('TokenId from result:', result.data?.tokenId);
        setTokenId(result.data?.tokenId || '');
        setStep('verify');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Verifying OTP with:', { tokenId, otp });
    try {
      const result = await authService.verifySignupOtp(tokenId, otp);

      if (result.success) {
        setStep('success');
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setError(result.message || 'OTP verification failed');
      }
    } catch (error) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authService.resendOtp(tokenId);
      if (result.success) {
        setError(''); // Clear any previous errors
        alert('OTP resent successfully!');
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'register') {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="roleName"
              value={formData.roleName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="SELLER">Seller</option>
              <option value="SUPPLIER">Supplier</option>
            </select>
          </div>

          {error && (
            <div className="text-black text-sm bg-black-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Verification Email'}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            We've sent a 6-digit verification code to:
          </p>
          <p className="font-semibold text-blue-600">{formData.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            Please check your email and enter the code below.
          </p>
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              required
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
            />
          </div>

          {error && (
            <div className="text-black text-sm bg-black-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Complete Registration'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-4 text-green-600">Registration Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your account has been created and you are now logged in.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    );
  }

  return null;
};

export default RegisterWithOTP;
