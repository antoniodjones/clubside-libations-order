import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RewardsData {
  total_points: number;
  available_points: number;
  tier_name: string;
  tier_color: string;
  tier_multiplier: number;
  referral_code: string;
}

export const useRewardsData = () => {
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRewardsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRewardsData(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          total_points,
          available_points,
          referral_code,
          reward_tiers (
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
        setRewardsData(null);
        return;
      }

      setRewardsData({
        total_points: data.total_points,
        available_points: data.available_points,
        tier_name: data.reward_tiers?.name || 'Bronze',
        tier_color: data.reward_tiers?.color || '#CD7F32',
        tier_multiplier: (data.reward_tiers?.benefits as any)?.multiplier || 1,
        referral_code: data.referral_code
      });
    } catch (error) {
      console.error('Error fetching rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchRewardsData();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    rewardsData,
    loading,
    refetch: fetchRewardsData
  };
};