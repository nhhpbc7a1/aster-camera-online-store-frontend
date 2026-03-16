import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import ResetPasswordForm from './ResetPasswordForm';
import VerificationCodeForm from './VerificationCodeForm';
import SetNewPasswordForm from './SetNewPasswordForm'; // Import component mới

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Reset Password, 2: Verification Code, 3: Set New Password
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (step === 1) {
      navigate('/customer/login');
    } else {
      setStep(step - 1);
    }
  };

  const handleNextStep = (email) => {
    setEmail(email);
    setStep(2);
  };

  const handleVerifyCode = () => {
    setStep(3); // Chuyển sang bước 3 sau khi xác minh code thành công
  };

  const handlePasswordSet = () => {
    // Logic để lưu mật khẩu mới vào cơ sở dữ liệu
    alert('Mật khẩu của bạn đã được cập nhật thành công!');
    navigate('/login'); // Quay lại trang đăng nhập sau khi hoàn tất
  };

  return (
      
      <div className="p-10 w-1/3 flex flex-col rounded-sm bg-white justify-center relative">
        <button
          onClick={handleGoBack}
          className="absolute top-4 left-4 flex items-center font-semibold hover:text-gray-800"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        {step === 1 ? (
          <ResetPasswordForm onNext={handleNextStep} />
        ) : step === 2 ? (
          <VerificationCodeForm email={email} onVerify={handleVerifyCode} />
        ) : (
          <SetNewPasswordForm onPasswordSet={handlePasswordSet} />
        )}
      </div>
    
  );
};

export default ForgotPassword;