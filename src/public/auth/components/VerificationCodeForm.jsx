import React, { useState } from 'react';

const VerificationCodeForm = ({ email, onVerify }) => {
  const [code, setCode] = useState(new Array(6).fill(''));
  const [seconds, setSeconds] = useState(60);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    // You would typically send this code to a backend for verification
    if (fullCode.length === 6) {
      onVerify();
    } else {
      alert('Please enter the full 6-digit code.');
    }
  };

  // Add a simple countdown timer (you'll need to use useEffect for a real timer)
  // For this example, we'll just display a static message
  const renderCountdown = () => {
    if (seconds > 0) {
      return <p className="text-center text-sm text-gray-500 mt-4">Please wait {seconds} seconds to resend.</p>;
    }
    return <p className="text-center text-sm text-blue-500 cursor-pointer mt-4" onClick={() => setSeconds(60)}>Resend code</p>;
  };

  // You would use useEffect for this:
  /*
  useEffect(() => {
    let interval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);
  */

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Enter Verification Code</h2>
      </div>
      <p className="text-center font-semibold text-gray-600 mb-6">
        Your verification code is sent to <br />
        <span className=" text-[#ee4d2d] font-medium"> {email}</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2">
          {code.map((data, index) => {
            return (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-10 h-12 text-center text-2xl font-bold border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-[#ee4d2d] transition-colors"
              />
            );
          })}
        </div>

        {renderCountdown()}

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

export default VerificationCodeForm;