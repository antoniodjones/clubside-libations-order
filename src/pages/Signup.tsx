import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState<Date>();
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loyaltyOption, setLoyaltyOption] = useState("join");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸", prefix: "+1", format: "(XXX) XXX-XXXX" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", prefix: "+44", format: "XXXX XXX XXX" },
    { code: "CA", name: "Canada", flag: "🇨🇦", prefix: "+1", format: "(XXX) XXX-XXXX" }
  ];

  const formatPhoneNumber = (value: string, countryCode: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    if (countryCode === "US" || countryCode === "CA") {
      // Format: (XXX) XXX-XXXX
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (countryCode === "GB") {
      // Format: XXXX XXX XXX
      if (digits.length <= 4) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    }
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, countryCode);
    setMobileNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (authError) {
        toast({
          title: "Error creating account",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            birthday: birthday ? format(birthday, 'yyyy-MM-dd') : null,
            mobile_number: `${countries.find(c => c.code === countryCode)?.prefix} ${mobileNumber}`,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        // Create loyalty profile if user opted in
        if (loyaltyOption === "join") {
          const { error: loyaltyError } = await supabase
            .from('user_loyalty')
            .insert({
              user_id: authData.user.id,
              birthday: birthday ? format(birthday, 'yyyy-MM-dd') : null,
              referral_code: generateReferralCode(),
            });

          if (loyaltyError) {
            console.error('Loyalty profile creation error:', loyaltyError);
          }
        }

        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });

        navigate("/menu");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
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
              Join us and start ordering your favorite drinks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex space-x-2">
                  <Select value={countryCode} onValueChange={(value) => {
                    setCountryCode(value);
                    setMobileNumber(""); // Reset number when country changes
                  }}>
                    <SelectTrigger className="w-fit bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code} className="text-white hover:bg-white/10 focus:bg-white/10">
                          <div className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.prefix}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder={countries.find(c => c.code === countryCode)?.format || "Enter phone number"}
                    value={mobileNumber}
                    onChange={handlePhoneChange}
                    required
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

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

              <div className="space-y-3">
                <Label className="text-white text-base font-medium">Loyalty Program</Label>
                <RadioGroup value={loyaltyOption} onValueChange={setLoyaltyOption} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value="join" 
                      id="join-loyalty" 
                      className="border-white/20 text-yellow-400 focus:ring-yellow-400"
                    />
                    <Label htmlFor="join-loyalty" className="text-white cursor-pointer">
                      Join Loyalty Program: Buy & Earn{" "}
                      <Link to="/loyalty-info" className="text-yellow-400 hover:text-yellow-300 underline">
                        (Learn More)
                      </Link>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value="opt-out" 
                      id="opt-out-loyalty" 
                      className="border-white/20 text-yellow-400 focus:ring-yellow-400"
                    />
                    <Label htmlFor="opt-out-loyalty" className="text-white cursor-pointer">
                      Opt Out of Loyalty Program
                    </Label>
                  </div>
                </RadioGroup>
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