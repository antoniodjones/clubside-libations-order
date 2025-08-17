import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  product: any;
  quantity: number;
}

interface UseAbandonedCartStorageProps {
  cart: CartItem[];
  selectedVenueId: string | null;
  guestEmail?: string;
  guestPhone?: string;
}

export const useAbandonedCartStorage = ({ 
  cart, 
  selectedVenueId, 
  guestEmail, 
  guestPhone 
}: UseAbandonedCartStorageProps) => {
  const { toast } = useToast();
  const sessionId = useRef<string>(generateSessionId());
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  // Generate a unique session ID for this browser session
  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Save or update abandoned cart
  const saveAbandonedCart = async () => {
    if (cart.length === 0) {
      // If cart is empty, try to delete any existing abandoned cart
      try {
        await supabase
          .from('abandoned_carts')
          .delete()
          .eq('session_id', sessionId.current);
      } catch (error) {
        console.error('Error deleting abandoned cart:', error);
      }
      return;
    }

    if (!selectedVenueId) return;

    try {
      // Check if abandoned cart already exists for this session
      const { data: existingCart } = await supabase
        .from('abandoned_carts')
        .select('id')
        .eq('session_id', sessionId.current)
        .single();

      const cartData = {
        session_id: sessionId.current,
        cart_data: cart as any, // Type as any for JSONB storage
        venue_id: selectedVenueId,
        total_amount: cartTotal,
        guest_email: guestEmail || null,
        guest_phone: guestPhone || null,
      };

      if (existingCart) {
        // Update existing cart
        const { error } = await supabase
          .from('abandoned_carts')
          .update(cartData)
          .eq('id', existingCart.id);

        if (error) {
          console.error('Error updating abandoned cart:', error);
        }
      } else {
        // Create new abandoned cart
        const { error } = await supabase
          .from('abandoned_carts')
          .insert(cartData);

        if (error) {
          console.error('Error creating abandoned cart:', error);
        }
      }
    } catch (error) {
      console.error('Error saving abandoned cart:', error);
    }
  };

  // Debounced save function
  const debouncedSave = () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }
    
    saveTimer.current = setTimeout(() => {
      saveAbandonedCart();
    }, 1000); // Save after 1 second of inactivity
  };

  // Save cart when it changes
  useEffect(() => {
    debouncedSave();
    
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [cart, selectedVenueId, guestEmail, guestPhone]);

  // Mark cart as converted when order is completed
  const markAsConverted = async () => {
    try {
      await supabase
        .from('abandoned_carts')
        .update({ converted_to_order: true })
        .eq('session_id', sessionId.current);
    } catch (error) {
      console.error('Error marking cart as converted:', error);
    }
  };

  // Clear abandoned cart (when user actively clears cart)
  const clearAbandonedCart = async () => {
    try {
      await supabase
        .from('abandoned_carts')
        .delete()
        .eq('session_id', sessionId.current);
    } catch (error) {
      console.error('Error clearing abandoned cart:', error);
    }
  };

  return {
    sessionId: sessionId.current,
    markAsConverted,
    clearAbandonedCart
  };
};