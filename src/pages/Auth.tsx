import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Wine, Gift, MapPin, Building } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { OTPForm } from '@/components/auth/OTPForm';
import { countries, formatPhoneWithCountryCode } from '@/utils/phoneFormatting';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState<Date>();
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [joinRewards, setJoinRewards] = useState('yes');
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const [otpSent, setOtpSent] = useState(false);
  const [authType, setAuthType] = useState<'signup' | 'signin'>('signin');
  const referralCode = searchParams.get('ref');

  
  const { sendOTP, verifyOTP, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch cities and venues
  useEffect(() => {
    const fetchCitiesAndVenues = async () => {
      try {
        // Fetch cities
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select('*')
          .order('name');
        
        if (citiesError) throw citiesError;
        setCities(citiesData || []);

        // Fetch venues
        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select('*, cities(name, state)')
          .eq('is_active', true)
          .order('name');
        
        if (venuesError) throw venuesError;
        setVenues(venuesData || []);
      } catch (error) {
        console.error('Error fetching cities and venues:', error);
      }
    };

    fetchCitiesAndVenues();
  }, []);


  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (authType === 'signup' && (!firstName || !lastName)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await sendOTP(email, authType);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setOtpSent(true);
        toast({
          title: "OTP Sent!",
          description: "Check your email for the verification code.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const additionalData = authType === 'signup' ? {
        firstName,
        lastName,
        birthdate: birthdate ? format(birthdate, 'yyyy-MM-dd') : undefined,
        mobileNumber: mobileNumber ? formatPhoneWithCountryCode(mobileNumber, countryCode) : undefined,
        countryCode,
        cityId: selectedCity || undefined,
        venueId: selectedVenue || undefined,
        joinRewards: joinRewards === 'yes',
        referralCode: referralCode || undefined,
      } : undefined;

      const { error } = await verifyOTP(email, otpCode, authType, additionalData);
      
      if (error) {
        // Handle specific error cases
        if (error.message?.includes('already registered') || error.errorCode === 'EMAIL_EXISTS') {
          toast({
            title: "Email Already Registered",
            description: "This email is already registered. Please try signing in instead.",
            variant: "destructive"
          });
          // Switch to sign in mode
          setAuthType('signin');
          setOtpSent(false);
          setOtpCode('');
        } else {
          toast({
            title: "Verification Error",
            description: error.message || "Failed to verify code. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: authType === 'signup' ? "Welcome!" : "Welcome back!",
          description: authType === 'signup' ? "Account created successfully!" : "Successfully signed in",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password Reset Email Sent!",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      <div className="max-w-md mx-auto px-4 py-16">
        {referralCode && (
          <div className="mb-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg backdrop-blur-sm">
            <div className="flex items-center text-yellow-400">
              <Gift className="w-5 h-5 mr-2" />
              <span className="font-medium">You've been referred! Get bonus points when you sign up.</span>
            </div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <Wine className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-gray-300">Sign in or create your account for exclusive benefits</p>
        </div>

        <Card className="bg-gray-900/80 border border-purple-400/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">Get Started</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Access member discounts, loyalty points, and exclusive offers
              {referralCode && (
                <span className="block mt-2 text-yellow-400 font-medium">
                  Referral code: {referralCode}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={referralCode ? "signup" : "signin"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="signin" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                  Sign Up{referralCode && ' & Get Bonus!'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                {!otpSent ? (
                  <SignInForm
                    email={email}
                    setEmail={setEmail}
                    onSubmit={(e) => { setAuthType('signin'); handleSendOTP(e); }}
                    onForgotPassword={handleForgotPassword}
                    isLoading={isLoading}
                  />
                ) : (
                  <OTPForm
                    otpCode={otpCode}
                    setOtpCode={setOtpCode}
                    email={email}
                    onSubmit={handleVerifyOTP}
                    onBack={() => setOtpSent(false)}
                    isLoading={isLoading}
                    isSignUp={false}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                {!otpSent ? (
                  <SignUpForm
                    email={email}
                    setEmail={setEmail}
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    birthdate={birthdate}
                    setBirthdate={setBirthdate}
                    mobileNumber={mobileNumber}
                    setMobileNumber={setMobileNumber}
                    countryCode={countryCode}
                    setCountryCode={setCountryCode}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    selectedVenue={selectedVenue}
                    setSelectedVenue={setSelectedVenue}
                    joinRewards={joinRewards}
                    setJoinRewards={setJoinRewards}
                    cities={cities}
                    venues={venues}
                    onSubmit={(e) => { setAuthType('signup'); handleSendOTP(e); }}
                    isLoading={isLoading}
                    referralCode={referralCode}
                  />
                ) : (
                  <OTPForm
                    otpCode={otpCode}
                    setOtpCode={setOtpCode}
                    email={email}
                    onSubmit={handleVerifyOTP}
                    onBack={() => setOtpSent(false)}
                    isLoading={isLoading}
                    isSignUp={true}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>

      <Footer />
    </div>
  );
};

export default Auth;