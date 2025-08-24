import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AuthType } from '@/types/auth';
import { formatTime, getExpirationTime } from '@/utils/authHelpers';

interface OTPFormProps {
  otpCode: string;
  setOtpCode: (code: string) => void;
  email: string;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
  isSignUp?: boolean;
}

export const OTPForm: React.FC<OTPFormProps> = ({
  otpCode,
  setOtpCode,
  email,
  onSubmit,
  onBack,
  isLoading,
  isSignUp = false
}) => {
  const { sendOTP } = useAuth();
  const { toast } = useToast();
  const [codeExpiredAt, setCodeExpiredAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isResending, setIsResending] = useState(false);

  // Memoize auth type
  const authType: AuthType = useMemo(() => isSignUp ? 'signup' : 'signin', [isSignUp]);

  // Set expiration time when component mounts (5 minutes from now)
  useEffect(() => {
    setCodeExpiredAt(getExpirationTime(5));
  }, []);

  // Update countdown timer with useCallback for performance
  useEffect(() => {
    if (!codeExpiredAt) return;

    const timer = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((codeExpiredAt.getTime() - now.getTime()) / 1000));
      setTimeLeft(remaining);
      
      // Clear timer when expired to prevent unnecessary updates
      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [codeExpiredAt]);

  const handleResendCode = useCallback(async () => {
    setIsResending(true);
    try {
      const { error } = await sendOTP(email, authType);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend verification code",
          variant: "destructive",
        });
      } else {
        // Reset expiration time
        setCodeExpiredAt(getExpirationTime(5));
        
        toast({
          title: "Code sent",
          description: "A new verification code has been sent to your email",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification code",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  }, [email, authType, sendOTP, toast]);

  const isCodeExpired = timeLeft === 0;
  const buttonText = useMemo(() => {
    if (isResending) return "Sending...";
    return isCodeExpired ? "Send New Code" : "Resend Code";
  }, [isResending, isCodeExpired]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Verification Code</Label>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-sm text-gray-400 text-center">
          Enter the 6-digit code sent to {email}
        </p>
        {!isCodeExpired && timeLeft > 0 && (
          <p className="text-sm text-yellow-400 text-center">
            Code expires in {formatTime(timeLeft)}
          </p>
        )}
        {isCodeExpired && (
          <p className="text-sm text-red-400 text-center">
            Verification code has expired
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : `Verify & ${isSignUp ? 'Sign Up' : 'Sign In'}`}
      </Button>

      {/* Resend or Send New Code Button */}
      <Button 
        type="button"
        variant="outline"
        onClick={handleResendCode}
        disabled={isResending}
        className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
      >
        {buttonText}
      </Button>
      
      <Button 
        type="button"
        variant="outline"
        onClick={onBack}
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
      >
        Back
      </Button>
    </form>
  );
};