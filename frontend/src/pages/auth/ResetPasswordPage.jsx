// src/components/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/stores/useAuthStore';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { tempEmail, tempOtp, verifyOtp, resetPassword, clearTempData } = useAuthStore();
  
  const [step, setStep] = useState('otp'); // 'otp', 'password', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  
  // References for OTP inputs
  const inputRefs = Array(6).fill(0).map(() => React.createRef());
  
  useEffect(() => {
    // If tempEmail doesn't exist in store, redirect to forgot password
    if (!tempEmail) {
      navigate('/forgot-password');
      toast.error('Please submit your email first');
      return;
    }
    
    // If tempOtp exists, go straight to password reset step
    if (tempOtp) {
      setStep('password');
    } else {
      // Focus first input on mount for OTP step
      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }
    }
  }, [tempEmail, tempOtp, navigate]);
  
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
  
  const validateOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return false;
    }
    return true;
  };
  
  const validatePassword = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;
    
    setIsLoading(true);
    
    try {
      const otpString = otp.join('');
      await verifyOtp(tempEmail, otpString);
      setStep('password');
      toast.success('OTP verified successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setIsLoading(true);
    
    try {
      await resetPassword(formData.password, formData.confirmPassword);
      setStep('success');
      toast.success('Password reset successfully');
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
            {step === 'otp' && 'Verify Code'}
            {step === 'password' && 'Reset Password'}
            {step === 'success' && 'Password Reset'}
          </h1>
          <p className="text-gray-400">
            {step === 'otp' && `Enter the verification code sent to ${tempEmail}`}
            {step === 'password' && 'Create a new secure password'}
            {step === 'success' && 'Your password has been reset successfully!'}
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
              <div className={`${step === 'otp' ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white'} w-8 h-8 rounded-full flex items-center justify-center font-bold`}>
                2
              </div>
              <span className={`text-xs ${step === 'otp' ? 'text-emerald-500' : 'text-emerald-500'} mt-1`}>Verify</span>
            </div>
            <div className={`flex-1 h-1 ${step === 'otp' ? 'bg-gray-700' : 'bg-emerald-500'} mx-2`}></div>
            <div className="flex flex-col items-center">
              <div className={`${step === 'success' ? 'bg-emerald-500 text-white' : step === 'password' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400'} w-8 h-8 rounded-full flex items-center justify-center font-bold`}>
                3
              </div>
              <span className={`text-xs ${step === 'success' ? 'text-emerald-500' : step === 'password' ? 'text-emerald-500' : 'text-gray-500'} mt-1`}>Reset</span>
            </div>
          </div>

          {/* OTP Step */}
          {step === 'otp' && (
            <>
              {/* OTP Input Fields */}
              <div className="mb-8">
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

              {/* Verify Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyOtp}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                disabled={isLoading || otp.join('').length !== 6}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Code
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>
            </>
          )}

          {/* Password Reset Step */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword}>
              {/* New Password Field */}
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
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-900/60 border ${errors.password ? 'border-red-500' : 'border-gray-700'} pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="mb-8">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-900/60 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              {/* Reset Password Button */}
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
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinish}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Sign In
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Back to Sign In (Only show on OTP and Password steps) */}
        {step !== 'success' && (
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

export default ResetPassword;