import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePointsSystem } from './usePointsSystem';

export const useCheckIn = () => {
  const { toast } = useToast();
  const { awardPoints } = usePointsSystem();

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

  return { checkIn };
};