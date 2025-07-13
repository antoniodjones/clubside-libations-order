import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [authMethod, setAuthMethod] = useState<"password" | "magic" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      navigate("/menu");
      toast({ title: "Welcome back!", description: "You've been signed in successfully." });
    } catch (error: any) {
      toast({ 
        title: "Sign in failed", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
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
          emailRedirectTo: `${window.location.origin}/menu`
        }
      });
      
      if (error) throw error;
      toast({ 
        title: "Magic link sent!", 
        description: "Check your email for the sign-in link." 
      });
    } catch (error: any) {
      toast({ 
        title: "Failed to send magic link", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to start ordering your favorite drinks with of the following options below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Auth Method Selection */}
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={authMethod === "password" ? "default" : "outline"}
                  onClick={() => setAuthMethod("password")}
                  className="flex-1 text-sm"
                  size="sm"
                >
                  Use Email+Password
                </Button>
                <Button
                  type="button"
                  variant={authMethod === "magic" ? "default" : "outline"}
                  onClick={() => setAuthMethod("magic")}
                  className="flex-1 text-sm"
                  size="sm"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Use Email+ConfirmationLink
                </Button>
                <Button
                  type="button"
                  variant={authMethod === "otp" ? "default" : "outline"}
                  onClick={() => setAuthMethod("otp")}
                  className="flex-1 text-sm"
                  size="sm"
                >
                  <KeyRound className="w-4 h-4 mr-1" />
                  Use Email+OnetimePasscode
                </Button>
              </div>

              {/* Email Field - Always Required */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Password Login Form */}
              {authMethod === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    size="lg"
                  >
                    {loading ? "Signing In..." : "Sign In & Order"}
                  </Button>
                </form>
              )}

              {/* Magic Link */}
              {authMethod === "magic" && (
                <div className="space-y-4">
                  <Button
                    type="button"
                    onClick={handleMagicLink}
                    disabled={loading || !email}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    size="lg"
                  >
                    {loading ? "Sending..." : "Send Magic Link"}
                  </Button>
                </div>
              )}

              {/* OTP */}
              {authMethod === "otp" && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <Button
                      type="button"
                      onClick={handleOtpRequest}
                      disabled={loading || !email}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      size="lg"
                    >
                      {loading ? "Sending..." : "Send OTP Code"}
                    </Button>
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
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        className="w-full text-white border-white/20"
                      >
                        Resend OTP
                      </Button>
                    </>
                  )}
                </div>
              )}

              <Separator className="bg-white/20" />
              
              <Link to="/menu" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-2 border-white/30 text-white hover:bg-white hover:text-black font-semibold backdrop-blur-sm transition-all duration-300"
                  size="lg"
                >
                  Order as Guest
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;