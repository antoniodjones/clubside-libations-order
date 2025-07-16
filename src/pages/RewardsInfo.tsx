import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Trophy, Users } from "lucide-react";

const RewardsInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-yellow-400 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
              dranx+ Rewards Program
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join our rewards program and earn points with every order. The more you drink, the more you save!
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Join the Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center">
                  Sign up for a dranx+ account and opt into our rewards program during registration.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-yellow-400" />
                </div>
                <CardTitle className="text-white">Earn Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center">
                  Earn points with every purchase, check-in, and special promotions at participating venues.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Redeem Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center">
                  Use your points for free drinks, exclusive discounts, and VIP experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Member Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-white">Earn Points on Every Purchase</h3>
                  <p className="text-gray-400">Get 1 point for every $1 spent</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-white">Check-in Bonuses</h3>
                  <p className="text-gray-400">Extra points for visiting participating venues</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-white">Birthday Rewards</h3>
                  <p className="text-gray-400">Special treats on your special day</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-white">Tier-Based Rewards</h3>
                  <p className="text-gray-400">Unlock better perks as you level up</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-white">Exclusive Events</h3>
                  <p className="text-gray-400">VIP access to member-only experiences</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-white">Referral Bonuses</h3>
                  <p className="text-gray-400">Earn points when friends join the program</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Tiers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Rewards Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader className="text-center">
                <Badge variant="secondary" className="w-fit mx-auto mb-2">Bronze</Badge>
                <CardTitle className="text-white">New Member</CardTitle>
                <CardDescription>0 - 499 points</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-400">
                  <li>• Earn 1 point per $1 spent</li>
                  <li>• Basic check-in bonuses</li>
                  <li>• Birthday reward</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader className="text-center">
                <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-yellow-500/20 text-yellow-400">Silver</Badge>
                <CardTitle className="text-white">Regular</CardTitle>
                <CardDescription>500 - 1,499 points</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-400">
                  <li>• Earn 1.25 points per $1 spent</li>
                  <li>• Enhanced check-in bonuses</li>
                  <li>• Exclusive promotions</li>
                  <li>• Priority support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader className="text-center">
                <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-purple-500/20 text-purple-400">Gold</Badge>
                <CardTitle className="text-white">VIP</CardTitle>
                <CardDescription>1,500+ points</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-400">
                  <li>• Earn 1.5 points per $1 spent</li>
                  <li>• Maximum check-in bonuses</li>
                  <li>• VIP event access</li>
                  <li>• Concierge service</li>
                  <li>• Exclusive rewards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">How do I join the rewards program?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Simply create a dranx+ account and opt into the rewards program during signup. It's completely free to join!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Do points expire?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Points remain active as long as you make at least one purchase or check-in every 12 months.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Can I use points at any venue?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Points can be redeemed at any participating dranx+ venue. Check the venue details to see available rewards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RewardsInfo;