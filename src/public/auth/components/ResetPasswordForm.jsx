import React, { useState } from 'react';

const ResetPasswordForm = ({ onNext }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(email);
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Reset Password</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#FF8282] to-[#ff0844] text-white font-semibold rounded-md hover:bg-black transition-colors"
        >
          NEXT
        </button>
      </form>
    </>
  );
};

export default ResetPasswordForm;