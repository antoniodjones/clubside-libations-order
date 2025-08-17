import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAbandonedCartProps {
  cartItemCount: number;
  onNudgeClick: () => void;
}

export const useAbandonedCart = ({ cartItemCount, onNudgeClick }: UseAbandonedCartProps) => {
  const { toast } = useToast();
  const fiveMinuteTimer = useRef<NodeJS.Timeout | null>(null);
  const tenMinuteTimer = useRef<NodeJS.Timeout | null>(null);
  const hasShownFiveMinute = useRef(false);
  const hasShownTenMinute = useRef(false);

  const clearTimers = () => {
    if (fiveMinuteTimer.current) {
      clearTimeout(fiveMinuteTimer.current);
      fiveMinuteTimer.current = null;
    }
    if (tenMinuteTimer.current) {
      clearTimeout(tenMinuteTimer.current);
      tenMinuteTimer.current = null;
    }
  };

  const resetFlags = () => {
    hasShownFiveMinute.current = false;
    hasShownTenMinute.current = false;
  };

  const showFiveMinuteNudge = () => {
    if (hasShownFiveMinute.current) return;
    hasShownFiveMinute.current = true;
    
    toast({
      title: "Still thinking it over?",
      description: "Your drinks are waiting! Complete your order now.",
      duration: 8000,
    });
  };

  const showTenMinuteNudge = () => {
    if (hasShownTenMinute.current) return;
    hasShownTenMinute.current = true;
    
    toast({
      title: "Don't miss out!",
      description: "Your cart will expire soon. Secure your order before it's too late!",
      duration: 10000,
    });
  };

  useEffect(() => {
    clearTimers();
    resetFlags();

    if (cartItemCount > 0) {
      // Set 5-minute timer
      fiveMinuteTimer.current = setTimeout(() => {
        showFiveMinuteNudge();
      }, 5 * 60 * 1000); // 5 minutes

      // Set 10-minute timer
      tenMinuteTimer.current = setTimeout(() => {
        showTenMinuteNudge();
      }, 10 * 60 * 1000); // 10 minutes
    }

    return clearTimers;
  }, [cartItemCount]);

  // Clear timers when component unmounts
  useEffect(() => {
    return clearTimers;
  }, []);

  return {
    clearAbandonedCartTimers: clearTimers,
    resetAbandonedCartFlags: resetFlags
  };
};