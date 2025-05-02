import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuthStore from '@/stores/useAuthStore';
import toast from 'react-hot-toast';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, authenticated, user } = useAuthStore();
  
  // Check if user is already authenticated and is an admin
  useEffect(() => {
    if (authenticated && user?.role === 'admin') {
      navigate('/admin');
    }
  }, [authenticated, user, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation errors for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error when user types
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    // Basic client-side validation
    let hasErrors = false;
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      hasErrors = true;
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/admin');
      } else if (result.error) {
        // Handle API validation errors
        if (result.error.includes('email must be an email')) {
          setValidationErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
        } else if (result.error.includes('password must be a string') || result.error.includes('password should not be empty')) {
          setValidationErrors(prev => ({ ...prev, password: 'Password is required' }));
        } else if (result.error.includes('Admin privileges required')) {
          // Handle non-admin access attempt
          setError('Access denied. This portal is for administrators only.');
          toast.error('Access denied. This portal is for administrators only.');
        } else {
          // Set generic error for other cases
          setError(result.error);
          // toast.error(result.error || 'Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
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
            <img src="/Logo.png" alt="Admin Portal" className="h-12" />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Sign in to access the admin dashboard</p>
        </motion.div>

        {/* Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700/50"
        >
          {/* General Error */}
          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-500/20 border border-red-500/40 text-red-200 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
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
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full bg-gray-900/60 border ${validationErrors.email ? 'border-red-500' : 'border-gray-700'} pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="admin@example.com"
              />
            </div>
            {validationErrors.email && <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-emerald-400 hover:emerald-blue-300 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full bg-gray-900/60 border ${validationErrors.password ? 'border-red-500' : 'border-gray-700'} pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500 hover:text-gray-300 transition-colors" />
                ) : (
                  <FaEye className="text-gray-500 hover:text-gray-300 transition-colors" />
                )}
              </button>
            </div>
            {validationErrors.password && <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-6">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-700 rounded bg-gray-900"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-emerald-300">
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </motion.form>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400">
            Admin access only. Return to{' '}
            <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Main Site
            </Link>
          </p>
        </motion.div>
      </div>
      
      {/* Right Side Content - Hidden on Mobile */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="h-full w-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center p-12">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold text-white mb-6">Admin Control Panel</h2>
            <p className="text-lg text-white/90 mb-8">
              Manage users, orders, inventory, and analytics from a single dashboard.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-white rounded-full"></div>
                <span className="text-white">Comprehensive user management</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-white rounded-full"></div>
                <span className="text-white">Real-time order tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-white rounded-full"></div>
                <span className="text-white">Detailed analytics and reports</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-white rounded-full"></div>
                <span className="text-white">Inventory management system</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;