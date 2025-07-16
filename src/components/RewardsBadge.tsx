import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Zap } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';
import { Link } from 'react-router-dom';

export const RewardsBadge = () => {
  const { rewardsData, loading } = useRewards();

  if (loading || !rewardsData) {
    return null;
  }

  return (
    <Link to="/rewards" className="flex items-center space-x-2 group">
      <Badge 
        style={{ backgroundColor: rewardsData.tier_color }}
        className="text-white hover:scale-105 transition-transform duration-200"
      >
        <Star className="w-3 h-3 mr-1" />
        {rewardsData.tier_name}
      </Badge>
      <div className="flex items-center space-x-1 text-yellow-400 group-hover:text-yellow-300 transition-colors">
        <Zap className="w-4 h-4" />
        <span className="font-medium">{rewardsData.available_points.toLocaleString()}</span>
      </div>
    </Link>
  );
};