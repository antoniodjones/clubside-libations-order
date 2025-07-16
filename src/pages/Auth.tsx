import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Wine, Gift, CalendarIcon, MapPin, Building } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState<Date>();
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  // Countries with their codes, flags, and phone formats
  const countries = [
    { code: 'US', flag: '🇺🇸', dialCode: '+1', format: '(XXX) XXX-XXXX', name: 'United States', dbCountry: 'United States' },
    { code: 'CA', flag: '🇨🇦', dialCode: '+1', format: '(XXX) XXX-XXXX', name: 'Canada', dbCountry: 'Canada' },
    { code: 'GB', flag: '🇬🇧', dialCode: '+44', format: 'XXXX XXX XXX', name: 'United Kingdom', dbCountry: 'United Kingdom' },
    { code: 'AU', flag: '🇦🇺', dialCode: '+61', format: 'XXXX XXX XXX', name: 'Australia', dbCountry: 'Australia' },
    { code: 'DE', flag: '🇩🇪', dialCode: '+49', format: 'XXX XXXXXXX', name: 'Germany', dbCountry: 'Germany' },
    { code: 'FR', flag: '🇫🇷', dialCode: '+33', format: 'XX XX XX XX XX', name: 'France', dbCountry: 'France' },
    { code: 'IT', flag: '🇮🇹', dialCode: '+39', format: 'XXX XXX XXXX', name: 'Italy', dbCountry: 'Italy' },
    { code: 'ES', flag: '🇪🇸', dialCode: '+34', format: 'XXX XXX XXX', name: 'Spain', dbCountry: 'Spain' },
    { code: 'MX', flag: '🇲🇽', dialCode: '+52', format: 'XX XXXX XXXX', name: 'Mexico', dbCountry: 'Mexico' },
    { code: 'BR', flag: '🇧🇷', dialCode: '+55', format: '(XX) XXXXX-XXXX', name: 'Brazil', dbCountry: 'Brazil' },
    { code: 'AR', flag: '🇦🇷', dialCode: '+54', format: 'XX XXXX-XXXX', name: 'Argentina', dbCountry: 'Argentina' },
    { code: 'JP', flag: '🇯🇵', dialCode: '+81', format: 'XXX-XXXX-XXXX', name: 'Japan', dbCountry: 'Japan' },
    { code: 'KR', flag: '🇰🇷', dialCode: '+82', format: 'XXX-XXXX-XXXX', name: 'South Korea', dbCountry: 'South Korea' },
    { code: 'CN', flag: '🇨🇳', dialCode: '+86', format: 'XXX XXXX XXXX', name: 'China', dbCountry: 'China' },
    { code: 'IN', flag: '🇮🇳', dialCode: '+91', format: 'XXXXX XXXXX', name: 'India', dbCountry: 'India' },
  ];
  
  const { signUp, signIn, user } = useAuth();
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

  // Format mobile number based on country
  const formatMobileNumber = (value: string, country: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    const selectedCountry = countries.find(c => c.code === country);
    if (!selectedCountry) return digits;
    
    switch (country) {
      case 'US':
      case 'CA':
        // Format: (XXX) XXX-XXXX
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      
      case 'GB':
      case 'AU':
        // Format: XXXX XXX XXX
        if (digits.length <= 4) return digits;
        if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
      
      case 'DE':
        // Format: XXX XXXXXXX
        if (digits.length <= 3) return digits;
        return `${digits.slice(0, 3)} ${digits.slice(3, 10)}`;
      
      case 'FR':
        // Format: XX XX XX XX XX
        if (digits.length <= 2) return digits;
        if (digits.length <= 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
        if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
        if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
        return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
      
      case 'IT':
        // Format: XXX XXX XXXX
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
      
      case 'ES':
        // Format: XXX XXX XXX
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
      
      case 'MX':
        // Format: XX XXXX XXXX
        if (digits.length <= 2) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
        return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
      
      case 'BR':
        // Format: (XX) XXXXX-XXXX
        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
      
      case 'AR':
        // Format: XX XXXX-XXXX
        if (digits.length <= 2) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
        return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
      
      case 'JP':
      case 'KR':
        // Format: XXX-XXXX-XXXX
        if (digits.length <= 3) return digits;
        if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
      
      case 'CN':
        // Format: XXX XXXX XXXX
        if (digits.length <= 3) return digits;
        if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
      
      case 'IN':
        // Format: XXXXX XXXXX
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
      
      default:
        return digits;
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMobileNumber(e.target.value, countryCode);
    setMobileNumber(formatted);
  };

  const handleCountryChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    // Reset city and venue selection when country changes
    setSelectedCity('');
    setSelectedVenue('');
    // Re-format the existing number for the new country
    if (mobileNumber) {
      const formatted = formatMobileNumber(mobileNumber, newCountryCode);
      setMobileNumber(formatted);
    }
  };

  // Filter cities based on selected country
  const filteredCities = cities.filter(city => {
    const selectedCountry = countries.find(c => c.code === countryCode);
    return selectedCountry ? city.country === selectedCountry.dbCountry : true;
  });

  // Filter venues based on selected city
  const filteredVenues = venues.filter(venue => 
    !selectedCity || venue.city_id === selectedCity
  );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !firstName || !lastName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, firstName, lastName);
      
      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Store additional profile data in localStorage for now
        // In a real app, you'd want to update the profile after successful signup
        const additionalData = {
          birthdate: birthdate ? format(birthdate, 'yyyy-MM-dd') : null,
          mobileNumber,
          selectedCity,
          selectedVenue
        };
        localStorage.setItem('pendingProfileData', JSON.stringify(additionalData));
        
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account",
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      });
      navigate('/');
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
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white pr-10"
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  {/* Birthdate Field */}
                  <div className="space-y-2">
                    <Label className="text-white">Birthdate</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full bg-gray-800 border-gray-600 text-white justify-start text-left font-normal hover:bg-gray-700",
                            !birthdate && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {birthdate ? format(birthdate, "PPP") : <span>Select your birthdate</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-yellow-400 border-yellow-500" align="start">
                        <Calendar
                          mode="single"
                          selected={birthdate}
                          onSelect={setBirthdate}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto text-black")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Mobile Number Field with Country Code */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-white">Mobile Number</Label>
                    <div className="flex space-x-2">
                      <Select value={countryCode} onValueChange={handleCountryChange}>
                        <SelectTrigger className="w-24 bg-gray-800 border-gray-600 text-white">
                          <SelectValue>
                            <div className="flex items-center">
                              <span className="text-lg mr-1">
                                {countries.find(c => c.code === countryCode)?.flag}
                              </span>
                              <span className="text-sm">
                                {countries.find(c => c.code === countryCode)?.dialCode}
                              </span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 z-50">
                          {countries.map((country) => (
                            <SelectItem 
                              key={country.code} 
                              value={country.code} 
                              className="text-white hover:bg-gray-700 focus:bg-gray-700"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{country.flag}</span>
                                <span className="text-sm">{country.dialCode}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="mobile"
                        type="tel"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        className="flex-1 bg-gray-800 border-gray-600 text-white"
                        placeholder={countries.find(c => c.code === countryCode)?.format || "Enter phone number"}
                      />
                    </div>
                  </div>

                  {/* City/Province Selection */}
                  <div className="space-y-2">
                    <Label className="text-white">City/Province</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Select your city" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 z-50">
                        {filteredCities.map((city) => (
                          <SelectItem 
                            key={city.id} 
                            value={city.id} 
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            {city.name}, {city.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Venue Selection */}
                  <div className="space-y-2">
                    <Label className="text-white">Preferred Venue</Label>
                    <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                      <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Select a venue" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 z-50">
                        {filteredVenues.map((venue) => (
                          <SelectItem 
                            key={venue.id} 
                            value={venue.id} 
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{venue.name}</span>
                              <span className="text-sm text-gray-400">{venue.address}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password *</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white pr-10"
                        placeholder="Create a password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="border-gray-400/50 text-gray-300 hover:bg-gray-400/10"
          >
            Continue as Guest
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;