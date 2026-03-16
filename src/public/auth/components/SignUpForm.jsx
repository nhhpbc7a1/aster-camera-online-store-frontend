import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS của datepicker
import { ArrowLeft, X } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthContext';
import { authService } from '@/core/auth';
const SignUpForm = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Thêm state cho ngày sinh
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    retypePassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpTokenId, setOtpTokenId] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const location = useLocation();

  // Determine if we're on /auth routes or /customer routes
  const isAuthRoute = location.pathname.startsWith('/auth');
  const loginPath = isAuthRoute ? '/auth/login' : '/customer/login';

  // Get initial role from URL or default to empty
  const initialRoleFromUrl = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const r = (params.get('role') || '').toLowerCase();
    if (r === 'seller' || r === 'supplier') return r.toUpperCase();
    return '';
  }, [location.search]);

  const [selectedRole, setSelectedRole] = useState(initialRoleFromUrl);

  // Update selectedRole when URL changes
  useEffect(() => {
    if (initialRoleFromUrl) {
      setSelectedRole(initialRoleFromUrl);
    }
  }, [initialRoleFromUrl]);
  const handleGoBack = () => {
    navigate(loginPath); // Điều hướng về trang login tương ứng
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!selectedRole) {
      setError('Vui lòng chọn role (Seller hoặc Supplier)');
      setIsLoading(false);
      return;
    }

    if (!formData.username || !formData.email || !formData.password || !formData.retypePassword) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.retypePassword) {
      setError('Mật khẩu nhập lại không khớp');
      setIsLoading(false);
      return;
    }

    try {
      const profile = {
        phone: formData.phone || undefined,
        birthday: selectedDate ? selectedDate.toISOString() : undefined
      };

      const result = await register(
        formData.username,
        formData.email,
        formData.password,
        profile,
        selectedRole
      );

      console.log('Register result:', result);
      if (result?.success && result?.data?.message === 'verification_required') {
        console.log('Setting otpTokenId:', result?.data?.tokenId);
        setOtpTokenId(result?.data?.tokenId || '');
        setOtpModalOpen(true);
      } else if (!result?.success) {
        const errorMessage = result?.message || 'Đăng ký thất bại';
        setError(errorMessage);
        // Show alert for all registration errors
        alert(`Lỗi đăng ký: ${errorMessage}`);
      } else {
        // fallback
        setShowSuccess(true);
        requestAnimationFrame(() => setProgressWidth(100));
        setTimeout(() => navigate(loginPath), 1400);
      }
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra';
      setError(errorMessage);
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 w-1/2 flex flex-col rounded-sm bg-white justify-center">
      <button onClick={handleGoBack} className="flex items-center font-semibold hover:text-gray-800">
        <ArrowLeft size={20} className="mr-2" />
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Sign up</h2>
      </div>

      {/* Role Selection */}
      <div className="mb-6">

        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="role"
              value="SELLER"
              checked={selectedRole === 'SELLER'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-4 h-4 text-[#283e83] border-gray-300 focus:ring-[#283e83] focus:ring-2"
            />
            <span className="ml-2 text-gray-700 font-medium">Seller</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="role"
              value="SUPPLIER"
              checked={selectedRole === 'SUPPLIER'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-4 h-4 text-[#283e83] border-gray-300 focus:ring-[#283e83] focus:ring-2"
            />
            <span className="ml-2 text-gray-700 font-medium">Supplier</span>
          </label>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-black-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className='flex gap-5'>
          <div className='space-y-5 flex-1'>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
            />
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
            />
          </div>
          <div className='space-y-5 flex-1'>
            <div className="relative  flex items-center">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Birthday"
                dateFormat="dd/MM/yyyy"
                wrapperClassName="w-full"
                className="w-full p-3 pr-25 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
              />
              <FaCalendarAlt className="absolute right-3 text-[#[#283e83]" />

            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword}
              </span>
            </div>
            <div className="relative">
              <input
                name="retypePassword"
                type={showRetypePassword ? "text" : "password"}
                value={formData.retypePassword}
                onChange={handleInputChange}
                placeholder="Retype Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={toggleRetypePasswordVisibility}
              >
                {showRetypePassword}
              </span>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 mt-5 bg-gradient-to-r from-[#1c2c5b] to-[#283e83] text-white font-semibold rounded-md hover:bg-black transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isLoading ? 'Đang đăng ký...' : 'SIGN UP'}
        </button>
      </form>

      {showSuccess && (
        <div
          className="fixed top-5 right-5 z-50 w-[320px] max-w-[90vw]"
          role="status"
          aria-live="polite"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-green-200/60 shadow-2xl ring-1 ring-green-500/10">
            <div className="flex items-start gap-3 p-4">
              <div className="shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                  <FaCheckCircle className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Registration successful</p>
                <p className="text-xs text-gray-600 mt-0.5">You will be redirected to sign in.</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowSuccess(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-4 pb-3">
              <div className="h-1 w-full bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-[width] duration-[1200ms] ease-out"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100">
            <div className="px-6 pt-6 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Xác thực email</h3>
              <p className="mt-1 text-sm text-gray-600">Nhập mã OTP đã gửi đến email của bạn.</p>
            </div>
            {otpError && (
              <div className="mx-6 mb-2 rounded-md bg-black-50 border border-red-200 px-4 py-2 text-black text-sm">{otpError}</div>
            )}
            <div className="px-6 pb-4">
              <input
                value={otpValue}
                onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6)); if (otpError) setOtpError(''); }}
                placeholder="Nhập mã 6 số"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d] tracking-widest text-center text-lg"
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={async () => {
                    if (otpValue.length !== 6) { setOtpError('Mã OTP gồm 6 số'); return; }
                    console.log('Verifying OTP with:', { otpTokenId, otpValue });
                    setOtpLoading(true);
                    const resp = await authService.verifySignupOtp(otpTokenId, otpValue);
                    setOtpLoading(false);
                    if (resp?.success) {
                      setOtpModalOpen(false);
                      setShowSuccess(true);
                      requestAnimationFrame(() => setProgressWidth(100));
                      setTimeout(() => navigate(loginPath), 1200);
                    } else {
                      const errorMessage = resp?.message || 'OTP không hợp lệ';
                      setOtpError(errorMessage);
                      alert(`Lỗi xác thực: ${errorMessage}`);
                    }
                  }}
                  disabled={otpLoading}
                  className={`px-4 py-2 rounded-md text-white font-semibold bg-gradient-to-r from-[#FF8282] to-[#ff0844] hover:opacity-95 ${otpLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >{otpLoading ? 'Đang xác thực...' : 'Xác nhận'}</button>
                <button
                  onClick={async () => {
                    if (resendLoading) return; // Prevent multiple clicks
                    console.log('Resending OTP for tokenId:', otpTokenId);
                    setResendLoading(true);
                    const resp = await authService.resendOtp(otpTokenId);
                    console.log('Resend OTP response:', resp);
                    if (resp?.success) {
                      setOtpError(''); // Clear any previous errors
                      alert('OTP đã được gửi lại thành công!');
                    } else {
                      setOtpError(resp?.message || 'Không gửi lại được OTP');
                    }
                    setResendLoading(false);
                  }}
                  disabled={resendLoading}
                  className={`px-4 py-2 rounded-md border font-semibold text-gray-700 hover:bg-gray-50 ${resendLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >{resendLoading ? 'Đang gửi...' : 'Gửi lại mã'}</button>
                <button
                  onClick={() => setOtpModalOpen(false)}
                  className="ml-auto px-3 py-2 text-gray-500 hover:text-gray-700"
                >Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-6 text-sm font-semibold text-gray-500">
        Already have an account?{" "}
        <Link to={loginPath} className="text-[#283e83] hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;