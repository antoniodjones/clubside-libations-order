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

interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

interface ProductsGridProps {
  filteredProducts: Product[];
  categories: ProductCategory[];
  selectedCategory: string | null;
  getCartItemQuantity: (id: string) => number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
}

export const ProductsGrid = ({ 
  filteredProducts, 
  categories, 
  selectedCategory, 
  getCartItemQuantity, 
  addToCart, 
  removeFromCart 
}: ProductsGridProps) => {
  if (!selectedCategory) return null;

  return (
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
  );
};