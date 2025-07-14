import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import { ProductCard } from "@/components/ProductCard";
import { CartSummary } from "@/components/CartSummary";
import { supabase } from "@/integrations/supabase/client";
import { Wine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { getCategoryIcon } from "@/utils/categoryHelpers";

interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

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


const Menu = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getCartItemQuantity, cartTotal, cartItemCount } = useCart();

  useEffect(() => {
    fetchData();
    checkAgeVerification();
  }, []);

  const checkAgeVerification = () => {
    const verified = localStorage.getItem('age_verified');
    if (!verified) {
      setShowAgeVerification(true);
    } else {
      setIsAgeVerified(true);
    }
  };

  const handleAgeVerified = () => {
    setIsAgeVerified(true);
    setShowAgeVerification(false);
  };

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true);

      if (productsError) throw productsError;

      setCategories(categoriesData || []);
      setProducts(productsData || []);
      
      // Set first alcohol category as default
      const firstAlcoholCategory = categoriesData?.find(cat => 
        ['cocktails', 'beer', 'wine', 'spirits'].includes(cat.name.toLowerCase())
      );
      if (firstAlcoholCategory) {
        setSelectedCategory(firstAlcoholCategory.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category_id === selectedCategory)
    : products;

  const featuredProducts = products.filter(product => product.is_featured).slice(0, 4);

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
        {/* Hero Banner */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            PREMIUM
            <br />
            <span className="text-yellow-400">MENU</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Curated selection of premium cocktails, craft beer, gourmet appetizers, and more
          </p>
        </div>

        {/* Featured Products Banner */}
        {featuredProducts.length > 0 && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-yellow-400/10 to-purple-400/10 rounded-3xl p-8 border border-yellow-400/20">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Featured Today</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {featuredProducts.map((product) => (
                   <ProductCard
                     key={product.id}
                     product={product}
                     quantity={getCartItemQuantity(product.id)}
                     onAddToCart={addToCart}
                     onRemoveFromCart={removeFromCart}
                   />
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Category Navigation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              const isSelected = selectedCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`h-24 flex flex-col items-center justify-center space-y-2 ${
                    isSelected 
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-black font-semibold' 
                      : 'border-purple-400/30 text-gray-900 hover:bg-purple-400/10 hover:text-white bg-white/90'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-sm font-medium">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {selectedCategory && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-8">
              {categories.find(cat => cat.id === selectedCategory)?.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={getCartItemQuantity(product.id)}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                />
              ))}
            </div>
          </div>
        )}

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