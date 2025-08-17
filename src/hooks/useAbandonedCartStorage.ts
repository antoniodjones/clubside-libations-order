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
  userId?: string | null;
  guestEmail?: string;
  guestPhone?: string;
}

export const useAbandonedCartStorage = ({ 
  cart, 
  selectedVenueId, 
  userId,
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
        if (userId) {
          await supabase
            .from('abandoned_carts')
            .delete()
            .eq('user_id', userId);
        } else {
          await supabase
            .from('abandoned_carts')
            .delete()
            .eq('session_id', sessionId.current);
        }
      } catch (error) {
        console.error('Error deleting abandoned cart:', error);
      }
      return;
    }

    if (!selectedVenueId) return;

    try {
      let existingCart;
      
      // Check for existing cart based on user_id or session_id
      if (userId) {
        const { data } = await supabase
          .from('abandoned_carts')
          .select('id')
          .eq('user_id', userId)
          .single();
        existingCart = data;
      } else {
        const { data } = await supabase
          .from('abandoned_carts')
          .select('id')
          .eq('session_id', sessionId.current)
          .is('user_id', null)
          .single();
        existingCart = data;
      }

      const cartData = {
        user_id: userId || null,
        session_id: userId ? null : sessionId.current, // Only use session_id for guest carts
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
  }, [cart, selectedVenueId, userId, guestEmail, guestPhone]);

  // Mark cart as converted when order is completed
  const markAsConverted = async () => {
    try {
      if (userId) {
        await supabase
          .from('abandoned_carts')
          .update({ converted_to_order: true })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('abandoned_carts')
          .update({ converted_to_order: true })
          .eq('session_id', sessionId.current);
      }
    } catch (error) {
      console.error('Error marking cart as converted:', error);
    }
  };

  // Clear abandoned cart (when user actively clears cart)
  const clearAbandonedCart = async () => {
    try {
      if (userId) {
        await supabase
          .from('abandoned_carts')
          .delete()
          .eq('user_id', userId);
      } else {
        await supabase
          .from('abandoned_carts')
          .delete()
          .eq('session_id', sessionId.current);
      }
    } catch (error) {
      console.error('Error clearing abandoned cart:', error);
    }
  };

  // Restore cart from database for authenticated users
  const restoreCart = async (): Promise<CartItem[]> => {
    if (!userId) return [];
    
    try {
      const { data: abandonedCart } = await supabase
        .from('abandoned_carts')
        .select('cart_data')
        .eq('user_id', userId)
        .eq('converted_to_order', false)
        .single();

      return (abandonedCart?.cart_data as unknown as CartItem[]) || [];
    } catch (error) {
      console.error('Error restoring cart:', error);
      return [];
    }
  };

  // Transfer guest cart to user account when they sign in
  const transferGuestCartToUser = async (newUserId: string) => {
    try {
      const { data: guestCart } = await supabase
        .from('abandoned_carts')
        .select('*')
        .eq('session_id', sessionId.current)
        .is('user_id', null)
        .single();

      if (guestCart) {
        // Check if user already has a cart
        const { data: existingUserCart } = await supabase
          .from('abandoned_carts')
          .select('id')
          .eq('user_id', newUserId)
          .single();

        if (existingUserCart) {
          // Delete the guest cart since user already has one
          await supabase
            .from('abandoned_carts')
            .delete()
            .eq('id', guestCart.id);
        } else {
          // Transfer guest cart to user
          await supabase
            .from('abandoned_carts')
            .update({ 
              user_id: newUserId, 
              session_id: null 
            })
            .eq('id', guestCart.id);
        }
      }
    } catch (error) {
      console.error('Error transferring guest cart:', error);
    }
  };

  return {
    sessionId: sessionId.current,
    markAsConverted,
    clearAbandonedCart,
    restoreCart,
    transferGuestCartToUser
  };
};