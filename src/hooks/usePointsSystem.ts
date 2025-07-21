import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePointsSystem = () => {
  const { toast } = useToast();

  const awardPoints = async (
    points: number, 
    reason: string, 
    tierMultiplier: number = 1,
    orderId?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      // Calculate points with tier multiplier
      const multipliedPoints = Math.floor(points * tierMultiplier);

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

      // Update user rewards points
      const { data: currentRewards } = await supabase
        .from('user_rewards')
        .select('total_points, available_points')
        .eq('user_id', user.id)
        .single();

      if (currentRewards) {
        const { error: updateError } = await supabase
          .from('user_rewards')
          .update({
            total_points: currentRewards.total_points + multipliedPoints,
            available_points: currentRewards.available_points + multipliedPoints
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      }

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

  return { awardPoints };
};