import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { LoyaltyData } from '@/types/profile';
import { formatDate } from '@/utils/profile';

interface RewardsStatusCardProps {
  loyalty: LoyaltyData;
}

export const RewardsStatusCard: React.FC<RewardsStatusCardProps> = React.memo(({ loyalty }) => {
  const memberSince = formatDate(loyalty.anniversary_date);
  
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Trophy className="h-5 w-5" />
          Rewards Status (Details)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge 
            variant="secondary" 
            className="text-lg px-4 py-2 bg-yellow-500 text-black"
          >
            {loyalty.tier} Member
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-yellow-400">{loyalty.total_points}</p>
            <p className="text-sm text-gray-400">Total Points</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">{loyalty.available_points}</p>
            <p className="text-sm text-gray-400">Available</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Member since {memberSince}
          </p>
        </div>
      </CardContent>
    </Card>
  );
});