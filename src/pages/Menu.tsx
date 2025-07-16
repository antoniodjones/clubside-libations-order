import React from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import { CartSummary } from "@/components/CartSummary";
import { useCart } from "@/hooks/useCart";
import { useMenuData } from "@/hooks/useMenuData";
import { useAgeVerification } from "@/hooks/useAgeVerification";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { MenuHero } from "@/components/menu/MenuHero";
import { FeaturedProductsSection } from "@/components/menu/FeaturedProductsSection";
import { CategorySelector } from "@/components/menu/CategorySelector";
import { ProductsGrid } from "@/components/menu/ProductsGrid";

const Menu = () => {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getCartItemQuantity, cartTotal, cartItemCount } = useCart();
  
  // Custom hooks for data and state management
  const { categories, products, loading } = useMenuData();
  const { showAgeVerification, handleAgeVerified } = useAgeVerification();
  const { selectedCategory, setSelectedCategory, filteredProducts, featuredProducts } = useCategoryFilter(categories, products);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-xl">Loading menu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      <AgeVerificationModal 
        open={showAgeVerification} 
        onVerified={handleAgeVerified} 
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <MenuHero />

        <FeaturedProductsSection
          featuredProducts={featuredProducts}
          getCartItemQuantity={getCartItemQuantity}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />

        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <ProductsGrid
          filteredProducts={filteredProducts}
          categories={categories}
          selectedCategory={selectedCategory}
          getCartItemQuantity={getCartItemQuantity}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />

        <CartSummary
          itemCount={cartItemCount}
          total={cartTotal}
          onCheckout={handleCheckout}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Menu;