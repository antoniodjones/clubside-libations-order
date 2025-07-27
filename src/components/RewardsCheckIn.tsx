import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Gift } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';

interface RewardsCheckInProps {
  venueId: string;
  venueName: string;
}

export const RewardsCheckIn = ({ venueId, venueName }: RewardsCheckInProps) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { checkIn } = useRewards();

  const handleCheckIn = async () => {
    await checkIn(venueId);
    setIsCheckedIn(true);
  };

  if (isCheckedIn) {
    return (
      <div className="flex items-center text-green-400 text-sm">
        <Gift className="w-4 h-4 mr-2" />
        Checked in! +10 points earned
      </div>
    );
  }

  return (
    <Button 
      onClick={handleCheckIn}
      size="sm"
      variant="outline"
      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
    >
      <MapPin className="w-4 h-4 mr-2" />
      Check In (+10 pts)
    </Button>
  );
};