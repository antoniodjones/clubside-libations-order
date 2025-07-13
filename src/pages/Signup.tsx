import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarIcon, Mail, Link as LinkIcon, Key } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState<Date>();
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [authMethod, setAuthMethod] = useState<"password" | "magic" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/menu`,
          data: {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            birthday: birthday?.toISOString(),
          }
        }
      });
      
      if (error) throw error;
      toast({ 
        title: "Account created!", 
        description: "Please check your email to verify your account." 
      });
      navigate("/login");
    } catch (error: any) {
      toast({ 
        title: "Signup failed", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkSignup = async () => {
    if (!email || !firstName || !lastName) {
      toast({ 
        title: "Required fields missing", 
        description: "Please fill in your name and email address.",
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/menu`,
          data: {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            birthday: birthday?.toISOString(),
          }
        }
      });
      
      if (error) throw error;
      toast({ 
        title: "Magic link sent!", 
        description: "Check your email to complete signup." 
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

  const handleOtpSignupRequest = async () => {
    if (!email || !firstName || !lastName) {
      toast({ 
        title: "Required fields missing", 
        description: "Please fill in your name and email address.",
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            birthday: birthday?.toISOString(),
          }
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
      toast({ title: "Welcome!", description: "Your account has been created successfully." });
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
          <Link to="/login" className="inline-flex items-center text-white hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-300">
              Join us and start ordering your favorite drinks using the below options:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Auth Method Selection */}
              <div className="flex flex-col space-y-3 mb-4">
                <button
                  type="button"
                  onClick={() => setAuthMethod("password")}
                  className={`flex items-center text-left transition-colors ${
                    authMethod === "password" 
                      ? "text-yellow-400" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Mail className="w-4 h-4 mr-3" />
                  <span className="text-sm">Email+Password (By Default)</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setAuthMethod("magic")}
                  className={`flex items-center text-left transition-colors ${
                    authMethod === "magic" 
                      ? "text-yellow-400" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <LinkIcon className="w-4 h-4 mr-3" />
                  <span className="text-sm">Email+VerifyLink (sent to email)</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setAuthMethod("otp")}
                  className={`flex items-center text-left transition-colors ${
                    authMethod === "otp" 
                      ? "text-yellow-400" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Key className="w-4 h-4 mr-3" />
                  <span className="text-sm">Email+OneTimeCode (sent to email)</span>
                </button>
              </div>

              {/* Common Fields */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Birthday</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full bg-white/10 border-white/20 text-white justify-start text-left font-normal hover:bg-white/20",
                        !birthday && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthday ? format(birthday, "PPP") : <span>Pick your birthday</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthday}
                      onSelect={setBirthday}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-white">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Password Signup Form */}
              {authMethod === "password" && (
                <form onSubmit={handlePasswordSignup} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Create Password</Label>
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
                    {loading ? "Creating Account..." : "Create Account & Start Ordering"}
                  </Button>
                </form>
              )}

              {/* Magic Link Signup */}
              {authMethod === "magic" && (
                <div className="space-y-4">
                  <Button
                    type="button"
                    onClick={handleMagicLinkSignup}
                    disabled={loading || !email || !firstName || !lastName}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    size="lg"
                  >
                    {loading ? "Sending..." : "Send Signup Magic Link"}
                  </Button>
                </div>
              )}

              {/* OTP Signup */}
              {authMethod === "otp" && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <Button
                      type="button"
                      onClick={handleOtpSignupRequest}
                      disabled={loading || !email || !firstName || !lastName}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      size="lg"
                    >
                      {loading ? "Sending..." : "Send OneTimeCode"}
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
                        {loading ? "Verifying..." : "Verify & Create Account"}
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
            </div>
            
            <div className="mt-6 text-center space-y-3">
              <p className="text-gray-300">
                Already have an account?{" "}
                <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Sign in
                </Link>
              </p>
              <p className="text-gray-300">
                <Link to="/menu" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  <span className="underline">Click Here</span>
                </Link>
                <span className="text-white font-normal"> to Order As Guest</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;