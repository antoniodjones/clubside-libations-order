import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import { useAuth } from "@/hooks/useAuth";
import { Checkout } from "./Checkout";
import { HomeIcon } from "@/components/HomeIcon";
import { SobrietyCheckoutWrapper } from "@/components/sobriety/SobrietyCheckoutWrapper";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CheckoutPage = () => {
  const { user } = useAuth();
  const [guestInfo, setGuestInfo] = useState({ email: "", phone: "" });
  
  const { cart, cartTotal, cartItemCount, clearCart, deleteFromCart, addToCart, removeFromCart } = useEnhancedCart({
    userId: user?.id,
    selectedVenueId: "01cf9bb6-9bee-4926-af17-a0d4fe01cf38", // The Dead Rabbit venue
    guestEmail: guestInfo.email,
    guestPhone: guestInfo.phone
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
      <SobrietyCheckoutWrapper
        venueId="01cf9bb6-9bee-4926-af17-a0d4fe01cf38"
        cart={cart}
      >
        <Checkout 
          cart={cart} 
          total={cartTotal} 
          onClearCart={handleClearCart}
          onDeleteFromCart={handleDeleteFromCart}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onGuestInfoChange={setGuestInfo}
        />
      </SobrietyCheckoutWrapper>
    </>
  );
};

export default CheckoutPage;