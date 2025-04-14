// src/components/auth/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/stores/useAuthStore';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { tempEmail, verifyEmail, resendOtp } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [verificationEmail, setVerificationEmail] = useState('');
  
  // References for OTP inputs
  const inputRefs = Array(6).fill(0).map(() => React.createRef());
  
  useEffect(() => {
    // If tempEmail exists in store, use it
    if (tempEmail) {
      setVerificationEmail(tempEmail);
    } else {
      // Redirect if no email to verify
      navigate('/signin');
      toast.error('Please sign in first');
    }
    
    // Focus first input on mount
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [tempEmail, navigate]);
  
  // Handle countdown for resend OTP
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);
  
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
  
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    
    try {
      await resendOtp(verificationEmail);
      setResendCountdown(60);
      toast.success('Verification code sent!');
    } catch (error) {
      toast.error('Failed to resend verification code');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await verifyEmail(verificationEmail, otpString);
      toast.success('Email verified successfully!');
      navigate('/signin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-400">
            We've sent a verification code to <br />
            <span className="text-emerald-400 font-medium">{verificationEmail}</span>
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700/50"
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center">
              <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                <FaEnvelope size={14} />
              </div>
              <span className="text-xs text-emerald-500 mt-1">Account</span>
            </div>
            <div className="flex-1 h-1 bg-emerald-500 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <span className="text-xs text-emerald-500 mt-1">Verification</span>
            </div>
            <div className="flex-1 h-1 bg-gray-700 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-700 text-gray-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
              <span className="text-xs text-gray-500 mt-1">Complete</span>
            </div>
          </div>

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

          {/* Resend Code */}
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              Didn't receive a code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCountdown > 0}
                className={`${
                  resendCountdown > 0 ? 'text-gray-500' : 'text-emerald-400 hover:text-emerald-300'
                } font-medium transition-colors`}
              >
                {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
              </button>
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
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
                Verify Email
                <FaArrowRight className="ml-2" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Back to Sign In */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400">
            Return to{' '}
            <Link to="/signin" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;