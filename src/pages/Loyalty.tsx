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

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user loyalty profile with tier info
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('user_loyalty')
        .select(`
          *,
          loyalty_tiers (
            id,
            name,
            minimum_points,
            benefits,
            color
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (loyaltyError) throw loyaltyError;

      // Fetch all tiers for progression display
      const { data: tiersData, error: tiersError } = await supabase
        .from('loyalty_tiers')
        .select('*')
        .order('minimum_points');

      if (tiersError) throw tiersError;

      // Fetch available rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_cost');

      if (rewardsError) throw rewardsError;

      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;

      setUserLoyalty({
        total_points: loyaltyData.total_points,
        available_points: loyaltyData.available_points,
        tier: loyaltyData.loyalty_tiers,
        referral_code: loyaltyData.referral_code,
        lifetime_spent: loyaltyData.lifetime_spent
      });
      setAllTiers(tiersData);
      setRewards(rewardsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      toast({
        title: "Error",
        description: "Failed to load loyalty information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (rewardId: string, pointsCost: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has enough points
      if (!userLoyalty || userLoyalty.available_points < pointsCost) {
        toast({
          title: "Insufficient Points",
          description: "You don't have enough points for this reward",
          variant: "destructive"
        });
        return;
      }

      // Create redemption
      const { error } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          points_spent: pointsCost,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        });

      if (error) throw error;

      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been added to your account. Check your profile for details.",
      });

      // Refresh data
      fetchLoyaltyData();
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
        url: `${window.location.origin}/signup?ref=${userLoyalty.referral_code}`
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
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  if (!userLoyalty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto bg-black/40 border-purple-500/20">
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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            LOYALTY <span className="text-purple-400">REWARDS</span>
          </h1>
          <p className="text-xl text-gray-300">Earn points, unlock rewards, enjoy exclusive perks</p>
        </div>

        {/* Current Status Card */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/40 to-yellow-900/40 border-purple-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl">
                  {userLoyalty.tier.name} Member
                </CardTitle>
                <Badge 
                  style={{ backgroundColor: userLoyalty.tier.color }}
                  className="text-white"
                >
                  <Star className="w-4 h-4 mr-1" />
                  {userLoyalty.tier.name}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">
                  {userLoyalty.available_points.toLocaleString()}
                </div>
                <div className="text-gray-300">Available Points</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getNextTier() && (
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Progress to {getNextTier()?.name}</span>
                    <span>
                      {userLoyalty.total_points} / {getNextTier()?.minimum_points} points
                    </span>
                  </div>
                  <Progress value={getProgressToNextTier()} className="h-2" />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {userLoyalty.total_points.toLocaleString()}
                  </div>
                  <div className="text-gray-300">Total Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    ${userLoyalty.lifetime_spent.toFixed(2)}
                  </div>
                  <div className="text-gray-300">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {userLoyalty.tier.benefits?.multiplier || 1}x
                  </div>
                  <div className="text-gray-300">Points Multiplier</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="rewards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/40">
            <TabsTrigger value="rewards" className="text-white">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="tiers" className="text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Tiers
            </TabsTrigger>
            <TabsTrigger value="referrals" className="text-white">
              <Users className="w-4 h-4 mr-2" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-white">
              <Clock className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <Card key={reward.id} className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">{reward.name}</CardTitle>
                    <p className="text-gray-300">{reward.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-yellow-400">
                        {reward.points_cost} pts
                      </div>
                      {reward.reward_value && (
                        <div className="text-green-400 font-semibold">
                          ${reward.reward_value}
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full"
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
                      ? 'border-purple-400 bg-purple-900/20' 
                      : 'border-gray-600 bg-black/40'
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
                          <Badge variant="secondary">Current Tier</Badge>
                        )}
                      </div>
                      <div className="text-white font-bold">
                        {tier.minimum_points.toLocaleString()} pts
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tier.benefits?.perks?.map((perk: string, idx: number) => (
                        <div key={idx} className="flex items-center text-gray-300">
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
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Refer Friends & Earn</CardTitle>
                <p className="text-gray-300">Share your referral code and both you and your friend earn bonus points!</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-900/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-300 mb-2">Your Referral Code</div>
                      <div className="text-3xl font-mono font-bold text-purple-400 mb-4">
                        {userLoyalty.referral_code}
                      </div>
                      <Button onClick={shareReferralCode} className="w-full">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Code
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">100 pts</div>
                      <div className="text-gray-300">You earn when friend signs up</div>
                    </div>
                    <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">50 pts</div>
                      <div className="text-gray-300">Friend earns welcome bonus</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-900/20 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{transaction.reason}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.transaction_type === 'earned' ? 'text-green-400' : 'text-red-400'
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