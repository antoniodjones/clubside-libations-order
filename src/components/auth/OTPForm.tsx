import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface OTPFormProps {
  email: string;
  onEmailChange: (email: string) => void;
}

export const OTPForm = ({ email, onEmailChange }: OTPFormProps) => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOtpRequest = async () => {
    if (!email) {
      toast({ 
        title: "Email required", 
        description: "Please enter your email address first.",
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });
      
      if (error) throw error;
      setOtpSent(true);
      toast({ 
        title: "OTP sent!", 
        description: "Check your email for the 6-digit code." 
      });
    } catch (error: any) {
      toast({ 
        title: "Failed to send OTP", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      toast({ 
        title: "Invalid OTP", 
        description: "Please enter the complete 6-digit code.",
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      
      if (error) throw error;
      navigate("/menu");
      toast({ title: "Welcome!", description: "You've been signed in successfully." });
    } catch (error: any) {
      toast({ 
        title: "Verification failed", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtpSent(false);
    setOtp("");
  };

  return (
    <div className="space-y-4">
      {!otpSent ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <Button
            type="button"
            onClick={handleOtpRequest}
            disabled={loading || !email}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            size="lg"
          >
            {loading ? "Sending..." : "Send OTP Code"}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-white">Enter 6-digit code</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
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
          </div>
          <Button
            type="button"
            onClick={handleOtpVerify}
            disabled={loading || otp.length !== 6}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            size="lg"
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleResendOtp}
            className="w-full text-white border-white/20"
          >
            Resend OTP
          </Button>
        </>
      )}
    </div>
  );
};