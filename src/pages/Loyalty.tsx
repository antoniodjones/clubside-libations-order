import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Star, Award, Crown, Wine, Utensils, Cannabis, TrendingUp, Calendar, Target } from "lucide-react";

export default function Loyalty() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Unified Loyalty Program</h1>
        <p className="text-muted-foreground">Earn points across all categories and unlock exclusive rewards</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Current Status */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Your Status</CardTitle>
              <CardDescription>Current tier level</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mb-2">Silver Member</div>
            <Badge variant="secondary">1,250 total points</Badge>
          </CardContent>
        </Card>

        {/* Total Points Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
              <Star className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">Total Points</CardTitle>
              <CardDescription>Available to redeem</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">2,450</div>
            <p className="text-sm text-muted-foreground">750 points to Gold tier</p>
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">This Month</CardTitle>
              <CardDescription>Points earned</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">186</div>
            <p className="text-sm text-muted-foreground">+23% vs last month</p>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
              <Gift className="w-4 h-4 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">Available Rewards</CardTitle>
              <CardDescription>Ready to claim</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">7</div>
            <p className="text-sm text-muted-foreground">Rewards unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Points Breakdown by Category */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Points by Category</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Wine className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Drinks</h3>
                    <p className="text-sm text-muted-foreground">2x points</p>
                  </div>
                </div>
                <Badge variant="outline">1,240 pts</Badge>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>This month:</span>
                  <span>95 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg per visit:</span>
                  <span>12 pts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Food</h3>
                    <p className="text-sm text-muted-foreground">1.5x points</p>
                  </div>
                </div>
                <Badge variant="outline">890 pts</Badge>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>This month:</span>
                  <span>67 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg per visit:</span>
                  <span>18 pts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Cannabis className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Cannabis</h3>
                    <p className="text-sm text-muted-foreground">3x points</p>
                  </div>
                </div>
                <Badge variant="outline">320 pts</Badge>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>This month:</span>
                  <span>24 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg per visit:</span>
                  <span>8 pts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Tier Benefits</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900 mb-1">Bronze</h3>
              <p className="text-xs text-amber-700 mb-2">0-999 points</p>
              <Badge variant="outline" className="text-xs">Base rate</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-300 bg-gray-50/50">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Silver</h3>
              <p className="text-xs text-gray-700 mb-2">1,000-2,999 points</p>
              <Badge className="text-xs bg-gray-600">Current</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-300 bg-yellow-50/50">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-yellow-900 mb-1">Gold</h3>
              <p className="text-xs text-yellow-700 mb-2">3,000-4,999 points</p>
              <Badge variant="outline" className="text-xs">750 pts to go</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-300 bg-purple-50/50">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-purple-900 mb-1">Platinum</h3>
              <p className="text-xs text-purple-700 mb-2">5,000+ points</p>
              <Badge variant="outline" className="text-xs">VIP perks</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Unified Rewards */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Available Rewards</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Wine className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Free Premium Drink</h3>
                    <p className="text-sm text-muted-foreground">Top-shelf cocktail or craft beer</p>
                  </div>
                </div>
                <Badge variant="outline">500 pts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Appetizer Comp</h3>
                    <p className="text-sm text-muted-foreground">Choice of signature appetizers</p>
                  </div>
                </div>
                <Badge variant="outline">750 pts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Cannabis className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Cannabis Sample</h3>
                    <p className="text-sm text-muted-foreground">Premium strain tasting (where legal)</p>
                  </div>
                </div>
                <Badge variant="outline">600 pts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">VIP Entry & Skip Line</h3>
                    <p className="text-sm text-muted-foreground">Priority access to any venue</p>
                  </div>
                </div>
                <Badge variant="outline">1000 pts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Birthday Experience</h3>
                    <p className="text-sm text-muted-foreground">Complete celebration package</p>
                  </div>
                </div>
                <Badge variant="outline">1500 pts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Guest Pass</h3>
                    <p className="text-sm text-muted-foreground">Bring a friend for free</p>
                  </div>
                </div>
                <Badge variant="outline">2000 pts</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1">
          <Gift className="w-4 h-4 mr-2" />
          Redeem Rewards
        </Button>
        <Button variant="outline" className="flex-1">
          <TrendingUp className="w-4 h-4 mr-2" />
          View History
        </Button>
      </div>
    </div>
  );
}