import { useState, useEffect, useMemo } from 'react';

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

export const useCategoryFilter = (categories: ProductCategory[], products: Product[]) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Set first alcohol category as default when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const firstAlcoholCategory = categories.find(cat => 
        ['cocktails', 'beer', 'wine', 'spirits'].includes(cat.name.toLowerCase())
      );
      if (firstAlcoholCategory) {
        setSelectedCategory(firstAlcoholCategory.id);
      }
    }
  }, [categories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return selectedCategory 
      ? products.filter(product => product.category_id === selectedCategory)
      : products;
  }, [selectedCategory, products]);

  const featuredProducts = useMemo(() => {
    return products.filter(product => product.is_featured).slice(0, 4);
  }, [products]);

  return {
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    featuredProducts
  };
};