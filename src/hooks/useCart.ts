import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

const CART_STORAGE_KEY = 'cart_items';

// Helper functions for localStorage
const getStoredCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setStoredCart = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('cartChanged', { detail: cart }));
  } catch {
    // Handle localStorage errors silently
  }
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const { toast } = useToast();

  // Listen for cart changes from other components
  useEffect(() => {
    const handleCartChange = (event: CustomEvent) => {
      setCart(event.detail);
    };

    window.addEventListener('cartChanged', handleCartChange as EventListener);
    
    return () => {
      window.removeEventListener('cartChanged', handleCartChange as EventListener);
    };
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    setStoredCart(cart);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prev, { product, quantity: 1 }];
      }
      
      console.log('Adding to cart, new count:', newCart.reduce((sum, item) => sum + item.quantity, 0));
      return newCart;
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} added successfully`
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === productId);
      let newCart;
      if (existingItem && existingItem.quantity > 1) {
        newCart = prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        newCart = prev.filter(item => item.product.id !== productId);
      }
      
      console.log('Removing from cart, new count:', newCart.reduce((sum, item) => sum + item.quantity, 0));
      return newCart;
    });
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    return item?.quantity || 0;
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const clearCart = () => {
    setCart([]);
  };

  // Debug log
  console.log('Cart hook - current item count:', cartItemCount);

  return {
    cart,
    addToCart,
    removeFromCart,
    getCartItemQuantity,
    cartTotal,
    cartItemCount,
    clearCart
  };
};