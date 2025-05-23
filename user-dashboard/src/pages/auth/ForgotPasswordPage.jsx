// src/components/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/stores/useAuthStore';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      navigate('/reset-password');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request');
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
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-gray-400">Enter your email to reset your password</p>
        </motion.div>

        {/* Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700/50"
        >
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                required
                className={`w-full bg-gray-900/60 border ${error ? 'border-red-500' : 'border-gray-700'} pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="mail@example.com"
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          {/* Submit Button */}
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
                Sending...
              </>
            ) : (
              <>
                Send Instructions
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
          <Link to="/signin" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors inline-flex items-center">
            <FaArrowLeft className="mr-2" />
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;