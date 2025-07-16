import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp
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
  ]
};

export const ProfileSummary = () => {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          {/* Basic Information */}
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
                <span>Birthday: {new Date(mockCustomerData.profile.birthday).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Status */}
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5" />
                Loyalty Status
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

          {/* Available Rewards (Read-only) */}
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Gift className="h-5 w-5" />
                Available Rewards (View Only)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockCustomerData.rewards.map((reward, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div>
                    <p className="font-medium text-white">{reward.name}</p>
                    <p className="text-sm text-gray-400">
                      {reward.points_cost} points • Expires {new Date(reward.expires).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-gray-400">
                    Auto-managed
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity & Orders (Read-only) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Spending Summary */}
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5" />
                Spending Summary (Auto-calculated)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">${mockCustomerData.loyalty.lifetime_spent}</p>
                  <p className="text-sm text-gray-400">Lifetime Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{mockCustomerData.recentOrders.length}</p>
                  <p className="text-sm text-gray-400">Recent Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{mockCustomerData.preferences.favorite_categories.length}</p>
                  <p className="text-sm text-gray-400">Favorite Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders (Read-only) */}
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ShoppingBag className="h-5 w-5" />
                Order History (View Only)
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
      </div>
    </div>
  );
};