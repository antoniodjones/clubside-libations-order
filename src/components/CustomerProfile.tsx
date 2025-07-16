import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
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
        { name: 'Truffle Mac & Cheese', category: 'Premium Appetizers', price: 24.00 },
        { name: 'Craft IPA Flight', category: 'Beer', price: 18.00 }
      ]
    },
    {
      id: '2',
      date: '2024-01-08',
      total_amount: 89.25,
      status: 'completed',
      items: [
        { name: 'Cannabis Infused Gummies', category: 'Cannabis Products', price: 35.00 },
        { name: 'Artisanal Cheese Board', category: 'Premium Appetizers', price: 28.00 }
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

export const CustomerProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
              <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                {mockCustomerData.profile.first_name[0]}{mockCustomerData.profile.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {mockCustomerData.profile.first_name} {mockCustomerData.profile.last_name}
              </h1>
              <div className="flex items-center gap-4 text-primary-foreground/80">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>{mockCustomerData.loyalty.tier} Member</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{mockCustomerData.loyalty.available_points} pts available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{mockCustomerData.profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{mockCustomerData.profile.mobile_number}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{mockCustomerData.profile.address_line_1}, {mockCustomerData.profile.city}, {mockCustomerData.profile.state}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Birthday: {new Date(mockCustomerData.profile.birthday).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Loyalty Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge 
                    variant="secondary" 
                    className="text-lg px-4 py-2"
                    style={{ backgroundColor: mockCustomerData.loyalty.tier_color, color: 'black' }}
                  >
                    {mockCustomerData.loyalty.tier} Member
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{mockCustomerData.loyalty.total_points}</p>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{mockCustomerData.loyalty.available_points}</p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(mockCustomerData.loyalty.anniversary_date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Available Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Available Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCustomerData.rewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{reward.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {reward.points_cost} points • Expires {new Date(reward.expires).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Redeem
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spending Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Spending Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">${mockCustomerData.loyalty.lifetime_spent}</p>
                    <p className="text-sm text-muted-foreground">Lifetime Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{mockCustomerData.recentOrders.length}</p>
                    <p className="text-sm text-muted-foreground">Recent Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{mockCustomerData.preferences.favorite_categories.length}</p>
                    <p className="text-sm text-muted-foreground">Favorite Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCustomerData.recentOrders.map((order, index) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {order.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">${order.total_amount}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <span className="text-muted-foreground">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Preferences & Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Favorite Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockCustomerData.preferences.favorite_categories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Dietary Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockCustomerData.preferences.dietary_restrictions.map((restriction, index) => (
                      <Badge key={index} variant="outline">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Preferred Venue</h4>
                  <p className="text-sm text-muted-foreground">
                    {mockCustomerData.preferences.preferred_venue}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};