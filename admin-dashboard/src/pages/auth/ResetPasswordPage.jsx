// src/components/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/stores/useAuthStore';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { tempEmail, resetPassword, clearTempData } = useAuthStore();
  
  const [step, setStep] = useState('input'); // 'input', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // References for OTP inputs
  const inputRefs = Array(6).fill(0).map(() => React.createRef());
  
  useEffect(() => {
    // If tempEmail doesn't exist in store, redirect to forgot password
    if (!tempEmail) {
      navigate('/forgot-password');
      toast.error('Please submit your email first');
      return;
    }
    
    // Focus first input on mount
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [tempEmail, navigate]);
  
  // Effect to handle automatic navigation after successful reset
  useEffect(() => {
    if (step === 'success') {
      // Auto navigate to signin after 2 seconds
      const timer = setTimeout(() => {
        clearTempData();
        navigate('/signin');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [step, navigate, clearTempData]);
  
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      // If input is empty and not first input, go to previous
      if (!otp[index] && index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // If pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      // Focus last input
      inputRefs[5].current.focus();
    }
  };
  
  const validateForm = () => {
    if (otp.join('').length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    } else if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear error when user types
    if (error) {
      setError('');
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const otpString = otp.join('');
      await resetPassword(password, otpString);
      setStep('success');
      toast.success('Password reset successfully. Redirecting to sign in...');
      navigate('/signin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFinish = () => {
    clearTempData();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block mb-6">
            <img src="/Logo.png" alt="FuelUp" className="h-12" />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 'input' && 'Reset Password'}
            {step === 'success' && 'Password Reset'}
          </h1>
          <p className="text-gray-400">
            {step === 'input' && `Enter the verification code sent to ${tempEmail} and your new password`}
            {step === 'success' && 'Your password has been reset successfully! Redirecting to sign in...'}
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700/50"
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center">
              <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
              <span className="text-xs text-emerald-500 mt-1">Email</span>
            </div>
            <div className="flex-1 h-1 bg-emerald-500 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-xs text-emerald-500 mt-1">Reset</span>
            </div>
          </div>

          {/* Input Step */}
          {step === 'input' && (
            <form onSubmit={handleResetPassword}>
              {/* OTP Input Fields */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                  Enter 6-digit verification code
                </label>
                <div 
                  className="flex gap-2 justify-center" 
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-900/60 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                    />
                  ))}
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full bg-gray-900/60 border border-gray-700 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <FaCheck className="text-emerald-500 text-4xl" />
                </div>
              </div>
              <p className="text-gray-300 mb-8">
                Your password has been reset successfully. You will be redirected to sign in shortly.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinish}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Sign In Now
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Back to Sign In (Only show on Input step) */}
        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-6"
          >
            <Link to="/signin" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors inline-flex items-center">
              <FaArrowLeft className="mr-2" />
              Back to Sign In
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;