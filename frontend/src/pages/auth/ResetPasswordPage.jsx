import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Loader2, 
  Lock,
  Check,
  X,
  Eye,
  EyeClosed
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, tempEmail, tempOtp, clearTempData } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await resetPassword(
        formData.password,
        formData.confirmPassword
      );
      toast.success('Password reset successfully');
      clearTempData(); // Clear both email and OTP
      navigate('/signin');
    } catch (error) {
      toast.error(error.response?.data?.responseBody || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { text: 'At least 8 characters long', test: pwd => pwd.length >= 8 },
    { text: 'Contains a number', test: pwd => /\d/.test(pwd) },
    // { text: 'Contains an uppercase letter', test: pwd => /[A-Z]/.test(pwd) },
    { text: 'Contains a lowercase letter', test: pwd => /[a-z]/.test(pwd) },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Remove OTP validation since we already have it in tempOtp
    if (passwordRequirements.some(req => !req.test(formData.password))) {
      toast.error('Password does not meet all requirements');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 hover:bg-transparent"
                onClick={() => navigate('/verify-email')}
              >
                <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </Button>
              <CardTitle className="flex-1 text-center text-2xl font-bold">
                Reset Password
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert className="bg-blue-50 text-blue-800 border-blue-100">
                <AlertDescription>
                  Set a new password for your account: <strong>{tempEmail}</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 h-12"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 h-12"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Password Requirements</Label>
                  <div className="space-y-2 text-sm">
                    {passwordRequirements.map((req, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-2"
                      >
                        {req.test(formData.password) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-gray-300" />
                        )}
                        <span className={req.test(formData.password) ? 'text-green-500' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-6 pt-2">
            <Button
              variant="link"
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'} Password {showPassword ? <Eye /> : <EyeClosed />}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;