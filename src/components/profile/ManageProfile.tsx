import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';

const mockPreferences = {
  favorite_categories: ['Cocktails', 'Premium Appetizers', 'Cannabis Products'],
  dietary_restrictions: ['Vegetarian Friendly'],
  preferred_venue: 'Downtown Lounge'
};

export const ManageProfile = () => {
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    birthday: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    gender: ''
  });

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    setProfileData(profile);
  }, [profile]);
  
  const [preferences, setPreferences] = useState(mockPreferences);
  const [newCategory, setNewCategory] = useState('');
  const [newRestriction, setNewRestriction] = useState('');

  const handleProfileUpdate = () => {
    // Update profile through context
    updateProfile(profileData);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handlePreferencesUpdate = () => {
    // In real app, this would update preferences via Supabase
    toast({
      title: "Preferences Updated", 
      description: "Your preferences have been updated successfully.",
    });
  };

  const addCategory = () => {
    if (newCategory && !preferences.favorite_categories.includes(newCategory)) {
      setPreferences(prev => ({
        ...prev,
        favorite_categories: [...prev.favorite_categories, newCategory]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      favorite_categories: prev.favorite_categories.filter(c => c !== category)
    }));
  };

  const addRestriction = () => {
    if (newRestriction && !preferences.dietary_restrictions.includes(newRestriction)) {
      setPreferences(prev => ({
        ...prev,
        dietary_restrictions: [...prev.dietary_restrictions, newRestriction]
      }));
      setNewRestriction('');
    }
  };

  const removeRestriction = (restriction: string) => {
    setPreferences(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.filter(r => r !== restriction)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Profile</h2>
          <p className="text-gray-400">Update your personal information and preferences</p>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-gray-300">First Name</Label>
              <Input
                id="first_name"
                value={profileData.first_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="last_name" className="text-gray-300">Last Name</Label>
              <Input
                id="last_name"
                value={profileData.last_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-gray-800/50 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mobile_number" className="text-gray-300">Mobile Number</Label>
              <Input
                id="mobile_number"
                value={profileData.mobile_number}
                onChange={(e) => setProfileData(prev => ({ ...prev, mobile_number: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="birthday" className="text-gray-300">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={profileData.birthday}
                onChange={(e) => setProfileData(prev => ({ ...prev, birthday: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address_line_1" className="text-gray-300">Address Line 1</Label>
            <Input
              id="address_line_1"
              value={profileData.address_line_1}
              onChange={(e) => setProfileData(prev => ({ ...prev, address_line_1: e.target.value }))}
              className="bg-gray-800/50 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="address_line_2" className="text-gray-300">Address Line 2 (Optional)</Label>
            <Input
              id="address_line_2"
              value={profileData.address_line_2}
              onChange={(e) => setProfileData(prev => ({ ...prev, address_line_2: e.target.value }))}
              className="bg-gray-800/50 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-gray-300">City</Label>
              <Input
                id="city"
                value={profileData.city}
                onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-gray-300">State</Label>
              <Input
                id="state"
                value={profileData.state}
                onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="postal_code" className="text-gray-300">Postal Code</Label>
              <Input
                id="postal_code"
                value={profileData.postal_code}
                onChange={(e) => setProfileData(prev => ({ ...prev, postal_code: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="gender" className="text-gray-300">Gender</Label>
            <Select value={profileData.gender} onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground z-50">
                <SelectItem value="Male" className="text-popover-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Male</SelectItem>
                <SelectItem value="Female" className="text-popover-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Female</SelectItem>
                <SelectItem value="Other" className="text-popover-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Other</SelectItem>
                <SelectItem value="Prefer not to say" className="text-popover-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleProfileUpdate} className="bg-purple-500 hover:bg-purple-600">
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="h-5 w-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Favorite Categories */}
          <div>
            <Label className="text-gray-300 text-lg">Favorite Categories</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {preferences.favorite_categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 flex items-center gap-1">
                  {category}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-400" 
                    onClick={() => removeCategory(category)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add favorite category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              />
              <Button onClick={addCategory} size="sm" variant="outline" className="border-purple-500/30 text-purple-300">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Dietary Restrictions */}
          <div>
            <Label className="text-gray-300 text-lg">Dietary Restrictions</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {preferences.dietary_restrictions.map((restriction, index) => (
                <Badge key={index} variant="outline" className="border-yellow-500/30 text-yellow-300 flex items-center gap-1">
                  {restriction}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-400" 
                    onClick={() => removeRestriction(restriction)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add dietary restriction"
                value={newRestriction}
                onChange={(e) => setNewRestriction(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && addRestriction()}
              />
              <Button onClick={addRestriction} size="sm" variant="outline" className="border-yellow-500/30 text-yellow-300">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Preferred Venue */}
          <div>
            <Label htmlFor="preferred_venue" className="text-gray-300 text-lg">Preferred Venue</Label>
            <Select value={preferences.preferred_venue} onValueChange={(value) => setPreferences(prev => ({ ...prev, preferred_venue: value }))}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground z-50">
                <SelectItem value="Downtown Lounge" className="text-popover-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Downtown Lounge</SelectItem>
                <SelectItem value="Uptown Bar" className="text-popover-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Uptown Bar</SelectItem>
                <SelectItem value="Rooftop Venue" className="text-popover-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Rooftop Venue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handlePreferencesUpdate} className="bg-purple-500 hover:bg-purple-600">
            Update Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};