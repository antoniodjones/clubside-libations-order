import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoyaltyData {
  total_points: number;
  available_points: number;
  tier_name: string;
  tier_color: string;
  tier_multiplier: number;
  referral_code: string;
}

export const useLoyalty = () => {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLoyaltyData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoyaltyData(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_loyalty')
        .select(`
          total_points,
          available_points,
          referral_code,
          loyalty_tiers (
            name,
            color,
            benefits
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          throw error;
        }
        setLoyaltyData(null);
        return;
      }

      setLoyaltyData({
        total_points: data.total_points,
        available_points: data.available_points,
        tier_name: data.loyalty_tiers?.name || 'Bronze',
        tier_color: data.loyalty_tiers?.color || '#CD7F32',
        tier_multiplier: (data.loyalty_tiers?.benefits as any)?.multiplier || 1,
        referral_code: data.referral_code
      });
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const awardPoints = async (points: number, reason: string, orderId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !loyaltyData) return;

      // Calculate points with tier multiplier
      const multipliedPoints = Math.floor(points * loyaltyData.tier_multiplier);

      // Create points transaction
      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert({
          user_id: user.id,
          points: multipliedPoints,
          transaction_type: 'earned',
          reason,
          order_id: orderId
        });

      if (transactionError) throw transactionError;

      // Update user loyalty points
      const { error: updateError } = await supabase
        .from('user_loyalty')
        .update({
          total_points: loyaltyData.total_points + multipliedPoints,
          available_points: loyaltyData.available_points + multipliedPoints
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Refresh loyalty data
      await fetchLoyaltyData();

      toast({
        title: "Points Earned!",
        description: `You earned ${multipliedPoints} points for ${reason}`,
      });

      return multipliedPoints;
    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        title: "Error",
        description: "Failed to award points",
        variant: "destructive"
      });
      return 0;
    }
  };

  const checkIn = async (venueId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user already checked in today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingCheckIn } = await supabase
        .from('check_ins')
        .select('id')
        .eq('user_id', user.id)
        .eq('venue_id', venueId)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .single();

      if (existingCheckIn) {
        toast({
          title: "Already Checked In",
          description: "You've already checked in today!",
        });
        return;
      }

      // Create check-in record
      const { error } = await supabase
        .from('check_ins')
        .insert({
          user_id: user.id,
          venue_id: venueId,
          points_earned: 10,
          bonus_type: 'daily_checkin'
        });

      if (error) throw error;

      // Award check-in points
      await awardPoints(10, 'Daily check-in bonus');

    } catch (error) {
      console.error('Error checking in:', error);
      toast({
        title: "Error",
        description: "Failed to check in",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchLoyaltyData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchLoyaltyData();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    loyaltyData,
    loading,
    awardPoints,
    checkIn,
    refetch: fetchLoyaltyData
  };
};