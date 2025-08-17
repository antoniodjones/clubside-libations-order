import React from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HomeIcon } from "@/components/HomeIcon";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import { CartSummary } from "@/components/CartSummary";
import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import { useMenuData } from "@/hooks/useMenuData";
import { useAgeVerification } from "@/hooks/useAgeVerification";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { useAbandonedCart } from "@/hooks/useAbandonedCart";
import { useAuth } from "@/hooks/useAuth";
import { MenuHero } from "@/components/menu/MenuHero";
import { VenueSearch } from "@/components/menu/VenueSearch";
import { FeaturedProductsSection } from "@/components/menu/FeaturedProductsSection";
import { CategorySelector } from "@/components/menu/CategorySelector";
import { ProductsGrid } from "@/components/menu/ProductsGrid";

const Menu = () => {
  const navigate = useNavigate();
  const [selectedVenue, setSelectedVenue] = React.useState<string | null>(null);
  const [selectedVenueName, setSelectedVenueName] = React.useState<string>('');
  
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, getCartItemQuantity, cartTotal, cartItemCount, deleteFromCart } = useEnhancedCart({
    userId: user?.id,
    selectedVenueId: selectedVenue,
  });
  
  const { categories, products, loading } = useMenuData();
  const { showAgeVerification, handleAgeVerified } = useAgeVerification();
  const { selectedCategory, setSelectedCategory, filteredProducts, featuredProducts } = useCategoryFilter(categories, products);
  const { clearAbandonedCartTimers } = useAbandonedCart({ 
    cartItemCount, 
    onNudgeClick: () => navigate("/checkout") 
  });

  const handleCheckout = () => {
    clearAbandonedCartTimers();
    navigate('/checkout');
  };

  const handleVenueSelect = (venueId: string, venueName: string) => {
    setSelectedVenue(venueId);
    setSelectedVenueName(venueName);
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
      <HomeIcon />
      <Navigation />
      
      <AgeVerificationModal 
        open={showAgeVerification} 
        onVerified={handleAgeVerified} 
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <MenuHero />

        <VenueSearch 
          onVenueSelect={handleVenueSelect}
          selectedVenueId={selectedVenue}
        />

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