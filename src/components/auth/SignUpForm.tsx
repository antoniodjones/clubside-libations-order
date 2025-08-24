import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimpleDateInput } from '@/components/ui/simple-date-input';
import { MapPin, Building } from 'lucide-react';
import { countries, formatMobileNumber } from '@/utils/phoneFormatting';

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  birthdate: Date | undefined;
  setBirthdate: (date: Date | undefined) => void;
  mobileNumber: string;
  setMobileNumber: (number: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedVenue: string;
  setSelectedVenue: (venue: string) => void;
  joinRewards: string;
  setJoinRewards: (join: string) => void;
  cities: any[];
  venues: any[];
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  referralCode?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthdate,
  setBirthdate,
  mobileNumber,
  setMobileNumber,
  countryCode,
  setCountryCode,
  selectedCity,
  setSelectedCity,
  selectedVenue,
  setSelectedVenue,
  joinRewards,
  setJoinRewards,
  cities,
  venues,
  onSubmit,
  isLoading,
  referralCode
}) => {
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMobileNumber(e.target.value, countryCode);
    setMobileNumber(formatted);
  };

  const handleCountryChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    setSelectedCity('');
    setSelectedVenue('');
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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-white">Email *</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white">First Name *</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="First name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white">Last Name *</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Date of Birth *</Label>
        <SimpleDateInput
          value={birthdate}
          onChange={setBirthdate}
          placeholder="MM/DD/YYYY"
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Country</Label>
        <Select value={countryCode} onValueChange={handleCountryChange}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center">
                  <span className="mr-2">{country.flag}</span>
                  {country.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Mobile Number</Label>
        <div className="flex">
          <div className="flex items-center px-3 bg-gray-700 border border-gray-600 rounded-l-md border-r-0">
            <span className="text-white text-sm">
              {countries.find(c => c.code === countryCode)?.dialCode}
            </span>
          </div>
          <Input
            type="tel"
            value={mobileNumber}
            onChange={handleMobileChange}
            className="bg-gray-800 border-gray-600 text-white rounded-l-none"
            placeholder={countries.find(c => c.code === countryCode)?.format || "Phone number"}
          />
        </div>
      </div>

      {filteredCities.length > 0 && (
        <div className="space-y-2">
          <Label className="text-white flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            City
          </Label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent>
              {filteredCities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}, {city.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredVenues.length > 0 && (
        <div className="space-y-2">
          <Label className="text-white flex items-center">
            <Building className="w-4 h-4 mr-1" />
            Venue
          </Label>
          <Select value={selectedVenue} onValueChange={setSelectedVenue}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Select your venue" />
            </SelectTrigger>
            <SelectContent>
              {filteredVenues.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-white">Join Rewards Program</Label>
        <Select value={joinRewards} onValueChange={setJoinRewards}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes, I want to earn rewards!</SelectItem>
            <SelectItem value="no">No thanks</SelectItem>
          </SelectContent>
        </Select>
        {referralCode && (
          <p className="text-sm text-yellow-400">
            ✨ You'll get bonus points for being referred!
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Sending Code..." : "Send Verification Code"}
      </Button>
    </form>
  );
};