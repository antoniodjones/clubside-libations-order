
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  
  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const drinks = [
    { id: "1", name: "Premium Cocktail", price: 15, category: "Cocktails", description: "House special with premium spirits" },
    { id: "2", name: "Craft Beer", price: 8, category: "Beer", description: "Local brewery selection" },
    { id: "3", name: "Wine Glass", price: 12, category: "Wine", description: "Curated wine selection" },
    { id: "4", name: "Energy Shot", price: 6, category: "Shots", description: "Keep the energy high" },
  ];

  const appetizers = [
    { id: "5", name: "Wings Platter", price: 18, category: "Hot", description: "Buffalo or BBQ style" },
    { id: "6", name: "Loaded Nachos", price: 16, category: "Hot", description: "Cheese, jalapeños, sour cream" },
    { id: "7", name: "Sliders Trio", price: 14, category: "Hot", description: "Three mini burgers" },
    { id: "8", name: "Hummus & Chips", price: 10, category: "Cold", description: "Fresh vegetables and pita" },
  ];

  const cartTotal = Object.entries(cart).reduce((total, [itemId, quantity]) => {
    const item = [...drinks, ...appetizers].find(i => i.id === itemId);
    return total + (item?.price || 0) * quantity;
  }, 0);

  const cartItemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Order Menu</h1>
          <p className="text-gray-300 text-lg">Select your drinks and appetizers</p>
        </div>

        {/* Drinks Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">🍹 Drinks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {drinks.map((drink) => (
              <Card key={drink.id} className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-yellow-400/40 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-xl">{drink.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">{drink.category}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">${drink.price}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{drink.description}</p>
                  <div className="flex items-center justify-between">
                    {cart[drink.id] ? (
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(drink.id)}
                          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-white font-semibold text-lg">{cart[drink.id]}</span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(drink.id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => addToCart(drink.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Appetizers Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">🍿 Appetizers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {appetizers.map((appetizer) => (
              <Card key={appetizer.id} className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-yellow-400/40 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-xl">{appetizer.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">{appetizer.category}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">${appetizer.price}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{appetizer.description}</p>
                  <div className="flex items-center justify-between">
                    {cart[appetizer.id] ? (
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(appetizer.id)}
                          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-white font-semibold text-lg">{cart[appetizer.id]}</span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(appetizer.id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => addToCart(appetizer.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
            <Card className="bg-yellow-400 border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-black" />
                    <span className="font-semibold text-black">{cartItemCount} items</span>
                  </div>
                  <div className="text-2xl font-bold text-black">${cartTotal}</div>
                </div>
                <Link to="/track-order">
                  <Button className="w-full bg-black hover:bg-gray-800 text-yellow-400 font-bold text-lg py-3">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
