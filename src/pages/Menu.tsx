import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Wine, Beer, Coffee, Utensils, Leaf, ShoppingCart, Star, Plus, Minus, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface CartItem {
  product: Product;
  quantity: number;
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'cocktails':
    case 'wine':
    case 'spirits':
      return Wine;
    case 'beer':
      return Beer;
    case 'non-alcoholic':
      return Coffee;
    case 'appetizers':
    case 'entrees':
    case 'desserts':
      return Utensils;
    case 'cannabis':
      return Leaf;
    default:
      return Coffee;
  }
};

const getCategoryGradient = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'cocktails':
      return 'from-purple-600/20 to-yellow-600/20';
    case 'beer':
      return 'from-yellow-600/20 to-orange-600/20';
    case 'wine':
      return 'from-purple-700/20 to-red-600/20';
    case 'spirits':
      return 'from-gray-700/20 to-yellow-600/20';
    case 'cannabis':
      return 'from-green-600/20 to-yellow-600/20';
    default:
      return 'from-gray-600/20 to-purple-600/20';
  }
};

const Menu = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const { toast } = useToast();

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

  const handleAgeVerification = () => {
    if (!birthDate) {
      toast({
        title: "Date Required",
        description: "Please enter your birth date",
        variant: "destructive"
      });
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age >= 21) {
      localStorage.setItem('age_verified', 'true');
      setIsAgeVerified(true);
      setShowAgeVerification(false);
      toast({
        title: "Welcome!",
        description: "Age verification successful"
      });
    } else {
      toast({
        title: "Access Denied",
        description: "You must be 21+ to access alcoholic beverages",
        variant: "destructive"
      });
    }
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
      
      {/* Age Verification Modal */}
      <Dialog open={showAgeVerification} onOpenChange={() => {}}>
        <DialogContent className="bg-gray-900 border border-purple-400/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-bold text-yellow-400 mb-4">
              Age Verification
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              <div className="mb-6">
                <div className="text-6xl font-black text-yellow-400 mb-2">21+</div>
                <div className="text-lg">Are you over 21 years old?</div>
                <div className="text-sm text-purple-400 mt-2">Or a qualifying patient 18+</div>
              </div>
              <div className="text-xs text-gray-400 mb-6">
                By continuing, you agree to our Terms of Service and Privacy Policy. 
                For alcoholic beverages, you must be 21+.
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Please enter your birthday
              </label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <Button 
              onClick={handleAgeVerification}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            PREMIUM
            <br />
            <span className="text-yellow-400">MENU</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Curated selection of premium cocktails, craft beer, and gourmet food
          </p>
        </div>

        {/* Featured Products Banner */}
        {featuredProducts.length > 0 && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-yellow-400/10 to-purple-400/10 rounded-3xl p-8 border border-yellow-400/20">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Featured Today</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Card key={product.id} className="bg-black/40 border-yellow-400/30 hover:border-yellow-400/60 transition-all">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gradient-to-br from-yellow-400/20 to-purple-400/20 rounded-lg mb-4 flex items-center justify-center">
                        <Wine className="w-12 h-12 text-yellow-400" />
                      </div>
                      <h3 className="font-bold text-white">{product.name}</h3>
                      <p className="text-yellow-400 font-bold">${product.price}</p>
                    </CardContent>
                  </Card>
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
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' 
                      : 'border-purple-400/30 text-white hover:bg-purple-400/10'
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
              {filteredProducts.map((product) => {
                const quantity = getCartItemQuantity(product.id);
                return (
                  <Card key={product.id} className="bg-black/40 backdrop-blur-sm border-purple-400/20 hover:border-yellow-400/40 transition-all duration-300">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-yellow-600/20 rounded-lg mb-4 flex items-center justify-center">
                        <Wine className="w-12 h-12 text-yellow-400" />
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-xl">{product.name}</CardTitle>
                          {product.alcohol_content && (
                            <Badge variant="secondary" className="mt-2">
                              {product.alcohol_content}% ABV
                            </Badge>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-yellow-400">${product.price}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        {quantity > 0 ? (
                          <div className="flex items-center space-x-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(product.id)}
                              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-white font-semibold text-lg">{quantity}</span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(product)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-black"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => addToCart(product)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Cart Summary */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
            <Card className="bg-yellow-400 border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-black" />
                    <span className="font-semibold text-black">{cartItemCount} items</span>
                  </div>
                  <div className="text-2xl font-bold text-black">${cartTotal.toFixed(2)}</div>
                </div>
                <Button className="w-full bg-black hover:bg-gray-800 text-yellow-400 font-bold text-lg py-3">
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Menu;