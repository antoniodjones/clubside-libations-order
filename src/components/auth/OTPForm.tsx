import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

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
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : `Verify & ${isSignUp ? 'Sign Up' : 'Sign In'}`}
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