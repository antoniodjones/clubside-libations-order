import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface CartIconProps {
  onCartClick?: () => void;
}

export const CartIcon = ({ onCartClick }: CartIconProps) => {
  const { cartItemCount } = useCart();

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={onCartClick}
      className="text-white hover:bg-purple-400/10 p-2 relative"
    >
      <ShoppingCart className="w-6 h-6" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cartItemCount > 99 ? '99+' : cartItemCount}
        </span>
      )}
    </Button>
  );
};