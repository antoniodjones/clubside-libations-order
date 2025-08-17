import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAbandonedCartStorage } from "./useAbandonedCartStorage";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  alcohol_content: number | null;
  volume_ml: number | null;
  is_featured: boolean;
  tags: string[] | null;
  category_id: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface UseEnhancedCartProps {
  userId?: string | null;
  selectedVenueId: string | null;
  guestEmail?: string;
  guestPhone?: string;
}

const CART_STORAGE_KEY = 'cart_items';

const getStoredCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useEnhancedCart = ({ 
  userId, 
  selectedVenueId, 
  guestEmail, 
  guestPhone 
}: UseEnhancedCartProps) => {
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  // Initialize abandoned cart storage
  const { 
    markAsConverted, 
    clearAbandonedCart,
    restoreCart,
    transferGuestCartToUser
  } = useAbandonedCartStorage({
    cart,
    selectedVenueId,
    userId,
    guestEmail,
    guestPhone
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Restore cart when user logs in
  useEffect(() => {
    if (userId && !isRestoring) {
      setIsRestoring(true);
      
      const restoreUserCart = async () => {
        try {
          // First, transfer any guest cart to user account
          await transferGuestCartToUser(userId);
          
          // Then restore user's cart from database
          const restoredCart = await restoreCart();
          
          if (restoredCart.length > 0) {
            // Merge with current cart or replace it
            const currentCart = getStoredCart();
            if (currentCart.length === 0) {
              setCart(restoredCart);
              toast({
                title: "Cart Restored",
                description: "Your previous cart has been restored"
              });
            } else {
              // Merge carts - combine quantities for same products
              const mergedCart = [...currentCart];
              restoredCart.forEach(restoredItem => {
                const existingIndex = mergedCart.findIndex(
                  item => item.product.id === restoredItem.product.id
                );
                if (existingIndex >= 0) {
                  mergedCart[existingIndex].quantity += restoredItem.quantity;
                } else {
                  mergedCart.push(restoredItem);
                }
              });
              setCart(mergedCart);
              toast({
                title: "Carts Merged",
                description: "Your saved cart has been merged with your current cart"
              });
            }
          }
        } catch (error) {
          console.error('Error restoring cart:', error);
        } finally {
          setIsRestoring(false);
        }
      };

      restoreUserCart();
    }
  }, [userId]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} added successfully`
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    return item?.quantity || 0;
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const deleteFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart"
    });
  };

  const clearCart = () => {
    setCart([]);
    clearAbandonedCart();
  };

  // Mark cart as converted when order is completed
  const completeOrder = async () => {
    await markAsConverted();
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getCartItemQuantity,
    cartTotal,
    cartItemCount,
    clearCart,
    completeOrder,
    isRestoring
  };
};