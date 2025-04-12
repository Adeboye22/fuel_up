import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { verifyEmail, resendOtp, tempEmail, setTempOtp } = useAuthStore();

  // Timer countdown effect
  useEffect(() => {
    const timer = resendTimer > 0 && setInterval(() => {
      setResendTimer((current) => current - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

    // Set initial timer when component mounts
    // useEffect(() => {
    //   setResendTimer(60);
    // }, []);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(tempEmail, otp);
      setTempOtp(otp);
      toast.success('Code verified successfully');
      navigate('/signin');
    } catch (error) {
      toast.error(error.response.data.responseBody || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setResendLoading(true);
    try {
      await resendOtp(tempEmail);
      toast.success('New verification code sent');
      setResendTimer(60); // Start 60 second cooldown
    } catch (error) {
      toast.error(error.response.data.responseBody  || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Verify Email</CardTitle>
          <CardDescription className="text-center">
            Enter the verification code we sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="pl-10"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={handleVerify} 
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
            <div className="text-center">
              <Button
                variant="ghost"
                className="text-sm"
                onClick={handleResendOtp}
                disabled={resendLoading || resendTimer > 0}
              >
                {resendLoading ? 'Sending...' : 
                 resendTimer > 0 ? `Resend code in ${resendTimer}s` : 
                 "Didn't receive the code? Resend"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;