import React from 'react';
import { ProductCard } from '@/components/ProductCard';

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

interface FeaturedProductsSectionProps {
  featuredProducts: Product[];
  getCartItemQuantity: (id: string) => number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
}

export const FeaturedProductsSection = ({ 
  featuredProducts, 
  getCartItemQuantity, 
  addToCart, 
  removeFromCart 
}: FeaturedProductsSectionProps) => {
  if (featuredProducts.length === 0) return null;

  return (
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
  );
};