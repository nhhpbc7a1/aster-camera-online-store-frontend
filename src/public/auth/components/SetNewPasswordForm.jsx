import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Assumed from previous code
import { CheckCircle, XCircle } from 'lucide-react'; // For validation icons

const SetNewPasswordForm = ({ onPasswordSet }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation States
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const isLengthValid = password.length >= 8 && password.length <= 16;
  const hasNoInvalidChars = /^[a-zA-Z0-9.,?!@#$%^&*()_+-=|]+$/.test(password);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For this example, we'll just check if all conditions are met
    if (hasLowercase && hasUppercase && isLengthValid && hasNoInvalidChars) {
      alert('Password has been successfully reset!');
      onPasswordSet(password);
    } else {
      alert('Please meet all password requirements.');
    }
  };

  const renderValidationIcon = (isValid) => {
    return isValid ? (
      <CheckCircle size={16} className="text-green-500 mr-2" />
    ) : (
      <XCircle size={16} className="text-gray-400 mr-2" />
    );
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Set your password</h2>
        <p className="text-gray-500 mt-2">Create a new password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
          </span>
        </div>

        {/* Password Rules */}
        <div className="text-sm text-gray-500">
          <div className="flex items-center mt-2">
            {renderValidationIcon(hasLowercase)}
            <p>At least one lowercase character</p>
          </div>
          <div className="flex items-center mt-2">
            {renderValidationIcon(hasUppercase)}
            <p>At least one uppercase character</p>
          </div>
          <div className="flex items-center mt-2">
            {renderValidationIcon(isLengthValid)}
            <p>8-16 characters</p>
          </div>
          <div className="flex items-center mt-2">
            {renderValidationIcon(hasNoInvalidChars)}
            <p>Only letters, numbers, and common punctuation can be used</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-8 bg-gradient-to-r from-[#FF8282] to-[#ff0844] text-white font-semibold rounded-md hover:bg-black transition-colors"
        >
          NEXT
        </button>
      </form>
    </>
  );
};

export default SetNewPasswordForm;