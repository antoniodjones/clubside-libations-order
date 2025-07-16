import { useCart } from "@/hooks/useCart";
import { Checkout } from "./Checkout";
import { HomeIcon } from "@/components/HomeIcon";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CheckoutPage = () => {
  const { cart, cartTotal, cartItemCount, clearCart } = useCart();
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
      />
    </>
  );
};

export default CheckoutPage;