import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Award, Crown } from "lucide-react";

export default function Loyalty() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Customer Loyalty Program</h1>
        <p className="text-muted-foreground">Earn points, unlock rewards, and enjoy exclusive benefits</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <Badge variant="secondary">1,250 points</Badge>
          </CardContent>
        </Card>

        {/* Points Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
              <Star className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">Points Balance</CardTitle>
              <CardDescription>Available to redeem</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">2,450</div>
            <p className="text-sm text-muted-foreground">750 points to Gold tier</p>
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
            <div className="text-2xl font-bold text-foreground mb-2">3</div>
            <p className="text-sm text-muted-foreground">Rewards unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Available Rewards</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Free Drink</h3>
                    <p className="text-sm text-muted-foreground">Complimentary beverage</p>
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
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Gift className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">VIP Entry</h3>
                    <p className="text-sm text-muted-foreground">Skip the line access</p>
                  </div>
                </div>
                <Badge variant="outline">1000 pts</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}