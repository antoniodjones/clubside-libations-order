import { useRewardsData } from './useRewardsData';
import { usePointsSystem } from './usePointsSystem';
import { useCheckIn } from './useCheckIn';

export const useRewards = () => {
  const { rewardsData, loading, refetch } = useRewardsData();
  const { awardPoints: baseAwardPoints } = usePointsSystem();
  const { checkIn } = useCheckIn();

  // Enhanced award points that uses tier multiplier and refreshes data
  const awardPoints = async (points: number, reason: string, orderId?: string) => {
    if (!rewardsData) return 0;
    
    const result = await baseAwardPoints(
      points, 
      reason, 
      rewardsData.tier_multiplier, 
      orderId
    );
    
    // Refresh rewards data after awarding points
    if (result > 0) {
      await refetch();
    }
    
    return result;
  };

  return {
    rewardsData,
    loading,
    awardPoints,
    checkIn,
    refetch
  };
};