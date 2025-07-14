import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Zap } from 'lucide-react';
import { useLoyalty } from '@/hooks/useLoyalty';
import { Link } from 'react-router-dom';

export const LoyaltyBadge = () => {
  const { loyaltyData, loading } = useLoyalty();

  if (loading || !loyaltyData) {
    return null;
  }

  return (
    <Link to="/loyalty" className="flex items-center space-x-2 group">
      <Badge 
        style={{ backgroundColor: loyaltyData.tier_color }}
        className="text-white hover:scale-105 transition-transform duration-200"
      >
        <Star className="w-3 h-3 mr-1" />
        {loyaltyData.tier_name}
      </Badge>
      <div className="flex items-center space-x-1 text-yellow-400 group-hover:text-yellow-300 transition-colors">
        <Zap className="w-4 h-4" />
        <span className="font-medium">{loyaltyData.available_points.toLocaleString()}</span>
      </div>
    </Link>
  );
};