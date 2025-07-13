import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cannabis, Star, ShoppingCart, Clock, Award } from "lucide-react";

export default function CannabisPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Cannabis Menu & Points</h1>
        <p className="text-muted-foreground">Browse premium cannabis products and earn loyalty points</p>
      </div>

      {/* Points Summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mr-3">
              <Cannabis className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Cannabis Points</CardTitle>
              <CardDescription>Earned this month</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">156</div>
            <Badge variant="secondary">2x multiplier active</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Tier Bonus</CardTitle>
              <CardDescription>Cannabis rewards</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mb-2">Silver</div>
            <p className="text-sm text-muted-foreground">1.5x points on cannabis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
              <Award className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">Next Reward</CardTitle>
              <CardDescription>Points needed</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">94</div>
            <p className="text-sm text-muted-foreground">Free pre-roll at 250pts</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Product Categories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Cannabis className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Flower</h3>
              <p className="text-sm text-muted-foreground mb-2">Premium strains</p>
              <Badge variant="outline">2x points</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Edibles</h3>
              <p className="text-sm text-muted-foreground mb-2">Gummies & chocolates</p>
              <Badge variant="outline">1.5x points</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Concentrates</h3>
              <p className="text-sm text-muted-foreground mb-2">Wax, shatter, live resin</p>
              <Badge variant="outline">3x points</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Pre-Rolls</h3>
              <p className="text-sm text-muted-foreground mb-2">Ready to smoke</p>
              <Badge variant="outline">1x points</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cannabis-Specific Rewards */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Cannabis Rewards</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Cannabis className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Free Pre-Roll</h3>
                    <p className="text-sm text-muted-foreground">Premium strain selection</p>
                  </div>
                </div>
                <Badge variant="outline">250 pts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Edibles Pack</h3>
                    <p className="text-sm text-muted-foreground">Mixed gummy selection</p>
                  </div>
                </div>
                <Badge variant="outline">400 pts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">VIP Budtender Session</h3>
                    <p className="text-sm text-muted-foreground">Personal consultation</p>
                  </div>
                </div>
                <Badge variant="outline">800 pts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Monthly Subscription</h3>
                    <p className="text-sm text-muted-foreground">Curated products delivered</p>
                  </div>
                </div>
                <Badge variant="outline">1200 pts</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button className="flex-1">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Browse Products
        </Button>
        <Button variant="outline" className="flex-1">
          <Award className="w-4 h-4 mr-2" />
          View All Rewards
        </Button>
      </div>
    </div>
  );
}