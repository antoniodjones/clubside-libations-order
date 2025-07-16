import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Gift, 
  Star, 
  Users, 
  MapPin, 
  Trophy, 
  Share2,
  Calendar,
  Clock,
  Award,
  Zap
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { HomeIcon } from "@/components/HomeIcon";
import { Footer } from "@/components/Footer";

interface LoyaltyTier {
  id: string;
  name: string;
  minimum_points: number;
  benefits: any; // JSONB from database
  color: string;
}

interface UserLoyalty {
  total_points: number;
  available_points: number;
  tier: LoyaltyTier;
  referral_code: string;
  lifetime_spent: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  reward_type: string;
  reward_value?: number;
}

interface PointsTransaction {
  id: string;
  points: number;
  transaction_type: string;
  reason: string;
  created_at: string;
}

const Loyalty = () => {
  const [userLoyalty, setUserLoyalty] = useState<UserLoyalty | null>(null);
  const [allTiers, setAllTiers] = useState<LoyaltyTier[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock data for demo purposes (remove when authentication is implemented)
  const mockData = {
    userLoyalty: {
      total_points: 2847,
      available_points: 1250,
      tier: {
        id: '1',
        name: 'Gold',
        minimum_points: 2000,
        benefits: {
          multiplier: 2,
          perks: [
            'Double points on all purchases',
            'Priority customer support',
            'Exclusive access to premium products',
            'Free delivery on orders over $50'
          ]
        },
        color: '#FFD700'
      },
      referral_code: 'SARAH2024',
      lifetime_spent: 3456.78
    },
    allTiers: [
      {
        id: '1',
        name: 'Bronze',
        minimum_points: 0,
        benefits: {
          multiplier: 1,
          perks: ['Earn 1 point per $1 spent', 'Birthday bonus points']
        },
        color: '#CD7F32'
      },
      {
        id: '2',
        name: 'Silver',
        minimum_points: 500,
        benefits: {
          multiplier: 1.5,
          perks: ['1.5x points on all purchases', 'Early access to sales', 'Free appetizer on birthday']
        },
        color: '#C0C0C0'
      },
      {
        id: '3',
        name: 'Gold',
        minimum_points: 2000,
        benefits: {
          multiplier: 2,
          perks: ['Double points on all purchases', 'Priority customer support', 'Exclusive access to premium products', 'Free delivery on orders over $50']
        },
        color: '#FFD700'
      },
      {
        id: '4',
        name: 'Platinum',
        minimum_points: 5000,
        benefits: {
          multiplier: 3,
          perks: ['Triple points on all purchases', 'Personal concierge service', 'VIP events access', 'Complimentary premium tastings']
        },
        color: '#E5E4E2'
      }
    ],
    rewards: [
      {
        id: '1',
        name: 'Free Appetizer',
        description: 'Choose any appetizer from our premium selection',
        points_cost: 500,
        reward_type: 'product',
        reward_value: 25
      },
      {
        id: '2',
        name: '20% Off Next Order',
        description: 'Valid on your next purchase, minimum $50',
        points_cost: 750,
        reward_type: 'discount',
        reward_value: 0
      },
      {
        id: '3',
        name: 'Cannabis Sample Pack',
        description: '3 premium cannabis products sampler',
        points_cost: 1000,
        reward_type: 'product',
        reward_value: 75
      },
      {
        id: '4',
        name: 'Free Craft Cocktail',
        description: 'Any craft cocktail from our signature menu',
        points_cost: 600,
        reward_type: 'product',
        reward_value: 18
      }
    ],
    transactions: [
      {
        id: '1',
        points: 127,
        transaction_type: 'earned',
        reason: 'Purchase at Downtown Lounge',
        created_at: '2024-01-12T19:30:00Z'
      },
      {
        id: '2',
        points: -500,
        transaction_type: 'redeemed',
        reason: 'Free Appetizer Reward',
        created_at: '2024-01-10T18:15:00Z'
      },
      {
        id: '3',
        points: 89,
        transaction_type: 'earned',
        reason: 'Purchase at Downtown Lounge',
        created_at: '2024-01-08T20:45:00Z'
      },
      {
        id: '4',
        points: 50,
        transaction_type: 'earned',
        reason: 'Birthday bonus points',
        created_at: '2024-01-05T12:00:00Z'
      }
    ]
  };

  useEffect(() => {
    // Simulate loading for demo
    const timer = setTimeout(() => {
      setUserLoyalty(mockData.userLoyalty);
      setAllTiers(mockData.allTiers);
      setRewards(mockData.rewards);
      setTransactions(mockData.transactions);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchLoyaltyData = async () => {
    // This will be implemented when authentication is added
    console.log('fetchLoyaltyData called - will be implemented with authentication');
  };

  const redeemReward = async (rewardId: string, pointsCost: number) => {
    try {
      // Mock redemption for demo purposes
      if (!userLoyalty || userLoyalty.available_points < pointsCost) {
        toast({
          title: "Insufficient Points",
          description: "You don't have enough points for this reward",
          variant: "destructive"
        });
        return;
      }

      // Update mock data
      setUserLoyalty(prev => prev ? {
        ...prev,
        available_points: prev.available_points - pointsCost
      } : null);

      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been added to your account. Check your profile for details.",
      });
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "Failed to redeem reward",
        variant: "destructive"
      });
    }
  };

  const shareReferralCode = async () => {
    if (!userLoyalty) return;
    
    try {
      await navigator.share({
        title: 'Join dranx+ and get rewards!',
        text: `Use my referral code ${userLoyalty.referral_code} to get bonus points when you sign up for dranx+!`,
        url: `${window.location.origin}/auth?ref=${userLoyalty.referral_code}`
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(userLoyalty.referral_code);
      toast({
        title: "Referral Code Copied!",
        description: "Share your code with friends to earn bonus points",
      });
    }
  };

  const getNextTier = () => {
    if (!userLoyalty || !allTiers) return null;
    const currentTierIndex = allTiers.findIndex(tier => tier.id === userLoyalty.tier.id);
    return currentTierIndex < allTiers.length - 1 ? allTiers[currentTierIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTier();
    if (!nextTier || !userLoyalty) return 100;
    
    const currentPoints = userLoyalty.total_points;
    const currentTierMin = userLoyalty.tier.minimum_points;
    const nextTierMin = nextTier.minimum_points;
    
    return ((currentPoints - currentTierMin) / (nextTierMin - currentTierMin)) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  if (!userLoyalty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6 text-center">
              <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Join the Loyalty Program</h2>
              <p className="text-gray-300 mb-4">Sign up or log in to start earning rewards!</p>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <HomeIcon />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight">
            LOYALTY
            <br />
            <span className="text-yellow-400">REWARDS</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
            Earn points, unlock rewards, enjoy exclusive perks
          </p>
        </div>

        {/* Current Status Card */}
        <Card className="mb-12 bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tight">
                  {userLoyalty.tier.name} Member
                </CardTitle>
                <Badge 
                  style={{ backgroundColor: userLoyalty.tier.color }}
                  className="text-white text-lg px-4 py-2 font-bold"
                >
                  <Star className="w-5 h-5 mr-2" />
                  {userLoyalty.tier.name}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-6xl md:text-7xl font-black text-yellow-400 leading-none">
                  {userLoyalty.available_points.toLocaleString()}
                </div>
                <div className="text-xl text-gray-300 font-light mt-2">Available Points</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {getNextTier() && (
                <div>
                  <div className="flex justify-between text-lg text-gray-300 mb-4 font-medium">
                    <span>Progress to {getNextTier()?.name}</span>
                    <span>
                      {userLoyalty.total_points} / {getNextTier()?.minimum_points} points
                    </span>
                  </div>
                  <Progress value={getProgressToNextTier()} className="h-4" />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-purple-400 leading-none">
                    {userLoyalty.total_points.toLocaleString()}
                  </div>
                  <div className="text-lg text-gray-300 font-light mt-2">Total Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-green-400 leading-none">
                    ${userLoyalty.lifetime_spent.toFixed(2)}
                  </div>
                  <div className="text-lg text-gray-300 font-light mt-2">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-yellow-400 leading-none">
                    {userLoyalty.tier.benefits?.multiplier || 1}x
                  </div>
                  <div className="text-lg text-gray-300 font-light mt-2">Points Multiplier</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="rewards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-sm border-purple-500/20">
            <TabsTrigger value="rewards" className="text-gray-300 data-[state=active]:text-white">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="tiers" className="text-gray-300 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Tiers
            </TabsTrigger>
            <TabsTrigger value="referrals" className="text-gray-300 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-gray-300 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <Card key={reward.id} className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{reward.name}</CardTitle>
                    <p className="text-gray-400">{reward.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xl font-bold text-yellow-400">
                        {reward.points_cost} pts
                      </div>
                      {reward.reward_value && (
                        <div className="text-yellow-400 font-bold">
                          ${reward.reward_value}
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
                      disabled={userLoyalty.available_points < reward.points_cost}
                      onClick={() => redeemReward(reward.id, reward.points_cost)}
                    >
                      {userLoyalty.available_points >= reward.points_cost ? 'Redeem' : 'Not Enough Points'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tiers">
            <div className="space-y-6">
              {allTiers.map((tier, index) => (
                <Card 
                  key={tier.id} 
                  className={`border-2 ${
                    tier.id === userLoyalty.tier.id 
                      ? 'border-yellow-400 bg-black/40 backdrop-blur-sm' 
                      : 'border-gray-600 bg-black/40 backdrop-blur-sm'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge 
                          style={{ backgroundColor: tier.color }}
                          className="text-white"
                        >
                          {tier.name}
                        </Badge>
                        {tier.id === userLoyalty.tier.id && (
                          <Badge className="bg-yellow-400 text-black font-bold">Current Tier</Badge>
                        )}
                      </div>
                      <div className="text-yellow-400 font-bold text-lg">
                        {tier.minimum_points.toLocaleString()} pts
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tier.benefits?.perks?.map((perk: string, idx: number) => (
                        <div key={idx} className="flex items-center text-gray-400">
                          <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                          {perk}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="referrals">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white text-xl">Refer Friends & Earn</CardTitle>
                <p className="text-gray-400">Share your referral code and both you and your friend earn bonus points!</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">Your Referral Code</div>
                      <div className="text-3xl font-mono font-bold text-yellow-400 mb-4">
                        {userLoyalty.referral_code}
                      </div>
                      <Button onClick={shareReferralCode} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Code
                      </Button>
                    </div>
                  </div>
                  
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="text-2xl font-bold text-yellow-400">100 pts</div>
                      <div className="text-gray-400">You earn when friend signs up</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="text-2xl font-bold text-yellow-400">50 pts</div>
                      <div className="text-gray-400">Friend earns welcome bonus</div>
                    </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div>
                        <div className="font-medium text-white">{transaction.reason}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.transaction_type === 'earned' ? 'text-yellow-400' : 'text-yellow-400'
                      }`}>
                        {transaction.transaction_type === 'earned' ? '+' : '-'}{Math.abs(transaction.points)} pts
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      No activity yet. Start ordering to earn points!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Loyalty;