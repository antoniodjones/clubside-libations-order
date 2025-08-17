import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import { useAuth } from "@/hooks/useAuth";
import { Checkout } from "./Checkout";
import { HomeIcon } from "@/components/HomeIcon";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, cartTotal, cartItemCount, clearCart, deleteFromCart } = useEnhancedCart({
    userId: user?.id,
    selectedVenueId: null, // Will be handled by venue selection in checkout
  });
  const navigate = useNavigate();

  // Redirect to menu if cart is empty
  useEffect(() => {
    if (cartItemCount === 0) {
      navigate("/menu");
    }
  }, [cartItemCount, navigate]);

  const handleClearCart = () => {
    clearCart();
  };

  const handleDeleteFromCart = (productId: string) => {
    deleteFromCart(productId);
  };

  if (cartItemCount === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <HomeIcon />
      <Checkout 
        cart={cart} 
        total={cartTotal} 
        onClearCart={handleClearCart}
        onDeleteFromCart={handleDeleteFromCart}
      />
    </>
  );
};

export default CheckoutPage;