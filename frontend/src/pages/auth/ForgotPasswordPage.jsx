import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuthStore();
  const navigate = useNavigate(); // Add this

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success('Reset code sent successfully!');
      // Replace the setSubmitted with direct navigation
      navigate('/verify-otp'); // Navigate to verify email page
    } catch (error) {
      toast.error(error.response.data.responseBody  || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
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
                onClick={handleBackToLogin}
              >
                <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </Button>
              <CardTitle className="flex-1 text-center text-2xl font-bold">
                Reset Password
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            {!submitted ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <Alert className="bg-blue-50 text-blue-800 border-blue-100">
                  <AlertDescription>
                    Enter your email address below and we'll send you code to reset your password.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-12 text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
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
                      Sending Reset Code...
                    </>
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Alert className="bg-green-50 text-green-800 border-green-100">
                  <AlertDescription>
                    We've sent a password reset code to <strong>{email}</strong>. 
                    Please check your email and follow the instructions to reset your password.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  className="w-full h-12 text-base font-medium"
                  onClick={() => window.location.href = '/verify-email'}
                >
                  Enter Reset Code
                </Button>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center pb-6 pt-2">
            <Button
              variant="link"
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={handleBackToLogin}
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;