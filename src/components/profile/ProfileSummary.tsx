import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Trophy, 
  ShoppingBag, 
  Calendar,
  CreditCard,
  Gift,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Mock data based on our database schema
const mockCustomerData = {
  profile: {
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@email.com',
    mobile_number: '+1 (555) 123-4567',
    birthday: '1985-03-15',
    address_line_1: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94105',
    gender: 'Female'
  },
  loyalty: {
    total_points: 2847,
    available_points: 1250,
    tier: 'Gold',
    tier_color: 'hsl(45, 100%, 50%)',
    lifetime_spent: 3456.78,
    anniversary_date: '2023-01-15'
  },
  recentOrders: [
    {
      id: '1',
      date: '2024-01-12',
      total_amount: 127.50,
      status: 'completed',
      items: [
        { name: 'Bourbon Old Fashioned', category: 'Cocktails', price: 16.00 },
        { name: 'Truffle Mac & Cheese', category: 'Premium Appetizers', price: 24.00 }
      ]
    },
    {
      id: '2',
      date: '2024-01-08',
      total_amount: 89.25,
      status: 'completed',
      items: [
        { name: 'Cannabis Infused Gummies', category: 'Cannabis Products', price: 35.00 }
      ]
    }
  ],
  preferences: {
    favorite_categories: ['Cocktails', 'Premium Appetizers', 'Cannabis Products'],
    dietary_restrictions: ['Vegetarian Friendly'],
    preferred_venue: 'Downtown Lounge'
  },
  rewards: [
    { name: 'Free Appetizer', points_cost: 500, expires: '2024-02-15' },
    { name: '20% Off Next Order', points_cost: 750, expires: '2024-02-20' }
  ],
  aboutCustomer: {
    hobbies: ['Wine Tasting', 'Live Music', 'Cooking', 'Travel'],
    estimatedIncome: '$75,000 - $100,000',
    favoritePlaces: [
      { name: 'Downtown Lounge', city: 'San Francisco', state: 'CA', id: 'venue-1' },
      { name: 'Rooftop Bar & Grill', city: 'San Francisco', state: 'CA', id: 'venue-2' },
      { name: 'The Craft House', city: 'Oakland', state: 'CA', id: 'venue-3' },
      { name: 'Vintage Wine Bar', city: 'Berkeley', state: 'CA', id: 'venue-4' },
      { name: 'Sunset Terrace', city: 'San Francisco', state: 'CA', id: 'venue-5' },
      { name: 'Harbor View Lounge', city: 'Sausalito', state: 'CA', id: 'venue-6' }
    ],
    favoriteStaffMembers: [
      { firstName: 'Marcus', lastName: 'Rodriguez', venueName: 'Downtown Lounge', venueAddress: '123 Market St, San Francisco, CA' },
      { firstName: 'Sofia', lastName: 'Chen', venueName: 'Rooftop Bar & Grill', venueAddress: '456 Union St, San Francisco, CA' },
      { firstName: 'Jake', lastName: 'Thompson', venueName: 'The Craft House', venueAddress: '789 Broadway, Oakland, CA' },
      { firstName: 'Maria', lastName: 'Gonzalez', venueName: 'Vintage Wine Bar', venueAddress: '321 Shattuck Ave, Berkeley, CA' },
      { firstName: 'David', lastName: 'Kim', venueName: 'Sunset Terrace', venueAddress: '654 Fillmore St, San Francisco, CA' },
      { firstName: 'Emma', lastName: 'Wilson', venueName: 'Harbor View Lounge', venueAddress: '987 Bridgeway, Sausalito, CA' }
    ],
    favoriteMenuItems: ['Bourbon Old Fashioned', 'Truffle Mac & Cheese', 'Craft Beer Flight'],
    venuesVisited: [
      { name: 'Downtown Lounge', address: '123 Market St, San Francisco, CA', lastVisit: '2024-01-12' },
      { name: 'Rooftop Bar & Grill', address: '456 Union St, San Francisco, CA', lastVisit: '2024-01-08' },
      { name: 'The Craft House', address: '789 Broadway, Oakland, CA', lastVisit: '2024-01-05' },
      { name: 'Vintage Wine Bar', address: '321 Shattuck Ave, Berkeley, CA', lastVisit: '2023-12-28' },
      { name: 'Sunset Terrace', address: '654 Fillmore St, San Francisco, CA', lastVisit: '2023-12-22' },
      { name: 'Harbor View Lounge', address: '987 Bridgeway, Sausalito, CA', lastVisit: '2023-12-15' },
      { name: 'The Whiskey Room', address: '111 Pine St, San Francisco, CA', lastVisit: '2023-12-10' }
    ]
  }
};

// Calculate age from birthday
const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const ProfileSummary = () => {
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [showAllVenues, setShowAllVenues] = useState(false);

  const maxDisplayItems = 5;

  const displayedPlaces = showAllPlaces 
    ? mockCustomerData.aboutCustomer.favoritePlaces 
    : mockCustomerData.aboutCustomer.favoritePlaces.slice(0, maxDisplayItems);

  const displayedStaff = showAllStaff 
    ? mockCustomerData.aboutCustomer.favoriteStaffMembers 
    : mockCustomerData.aboutCustomer.favoriteStaffMembers.slice(0, maxDisplayItems);

  const displayedVenues = showAllVenues 
    ? mockCustomerData.aboutCustomer.venuesVisited 
    : mockCustomerData.aboutCustomer.venuesVisited.slice(0, maxDisplayItems);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
            <AvatarFallback className="text-2xl bg-purple-500/20 text-white">
              {mockCustomerData.profile.first_name[0]}{mockCustomerData.profile.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              {mockCustomerData.profile.first_name} {mockCustomerData.profile.last_name}
            </h1>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>{mockCustomerData.loyalty.tier} Member</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{mockCustomerData.loyalty.available_points} pts available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Section - Profile and Loyalty */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{mockCustomerData.profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{mockCustomerData.profile.mobile_number}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{mockCustomerData.profile.address_line_1}, {mockCustomerData.profile.city}, {mockCustomerData.profile.state}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Age: {calculateAge(mockCustomerData.profile.birthday)} • Birthday: {new Date(mockCustomerData.profile.birthday).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Status (Details) */}
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5" />
                Rewards Status (Details)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge 
                  variant="secondary" 
                  className="text-lg px-4 py-2 bg-yellow-500 text-black"
                >
                  {mockCustomerData.loyalty.tier} Member
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{mockCustomerData.loyalty.total_points}</p>
                  <p className="text-sm text-gray-400">Total Points</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{mockCustomerData.loyalty.available_points}</p>
                  <p className="text-sm text-gray-400">Available</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Member since {new Date(mockCustomerData.loyalty.anniversary_date).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ShoppingBag className="h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCustomerData.recentOrders.map((order, index) => (
                <div key={order.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                        {order.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-white">${order.total_amount}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">{item.name}</span>
                          <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                            {item.category}
                          </Badge>
                        </div>
                        <span className="text-gray-400">${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Full Width Offers Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Gift className="h-5 w-5" />
              Available Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockCustomerData.rewards.map((reward, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex-1">
                    <p className="font-medium text-white">{reward.name}</p>
                    <p className="text-sm text-gray-400">
                      {reward.points_cost} points • Expires {new Date(reward.expires).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      // Handle offer redemption
                      console.log('Redeeming offer:', reward.name);
                    }}
                  >
                    Redeem
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Full Width About Customer Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              About {mockCustomerData.profile.first_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Top Row - Hobbies & Menu Items Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hobbies & Interests Card */}
              <Card className="bg-gray-800/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Hobbies & Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockCustomerData.aboutCustomer.hobbies.map((hobby, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Favorite Menu Items Card */}
              <Card className="bg-gray-800/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Favorite Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockCustomerData.aboutCustomer.favoriteMenuItems.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-yellow-400 border-yellow-400">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Row - Rewards */}
            <Card className="bg-gray-800/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Available Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCustomerData.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{reward.name}</p>
                        <p className="text-xs text-gray-400">
                          {reward.points_cost} points • Expires {new Date(reward.expires).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
                        onClick={() => {
                          console.log('Redeeming reward:', reward.name);
                        }}
                      >
                        Redeem
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Row - Venues and Staff */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Venues Visited */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">Venues Visited ({mockCustomerData.aboutCustomer.venuesVisited.length})</h4>
                  {mockCustomerData.aboutCustomer.venuesVisited.length > maxDisplayItems && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllVenues(!showAllVenues)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      {showAllVenues ? (
                        <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                      ) : (
                        <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
                      )}
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {displayedVenues.map((venue, index) => (
                    <div key={index} className="p-2 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-white text-sm truncate">{venue.name}</p>
                        <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{new Date(venue.lastVisit).toLocaleDateString()}</p>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{venue.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Favorite Venue Staff Members */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">Favorite Venue Staff Members</h4>
                  {mockCustomerData.aboutCustomer.favoriteStaffMembers.length > maxDisplayItems && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllStaff(!showAllStaff)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      {showAllStaff ? (
                        <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                      ) : (
                        <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
                      )}
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {displayedStaff.map((staff, index) => (
                    <div key={index} className="p-2 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-white text-sm truncate">{staff.firstName} {staff.lastName}</p>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs ml-2 flex-shrink-0">
                          Staff
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mb-1 truncate">{staff.venueName}</p>
                      <p className="text-xs text-gray-500 truncate">{staff.venueAddress}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};