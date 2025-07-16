import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { Reward } from '@/types/profile';
import { formatDate } from '@/utils/profile';

interface AvailableOffersCardProps {
  rewards: Reward[];
}

export const AvailableOffersCard: React.FC<AvailableOffersCardProps> = React.memo(({ rewards }) => {
  const handleOfferRedemption = useCallback((rewardName: string) => {
    // Handle offer redemption
    console.log('Redeeming offer:', rewardName);
  }, []);

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Gift className="h-5 w-5" />
          Available Offers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewards.map((reward, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="flex-1">
                <p className="font-medium text-white">{reward.name}</p>
                <p className="text-sm text-gray-400">
                  {reward.points_cost} points • Expires {formatDate(reward.expires)}
                </p>
              </div>
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => handleOfferRedemption(reward.name)}
              >
                Redeem
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});