import React from 'react';
import { Button } from '@/components/ui/button';
import { getCategoryIcon } from '@/utils/categoryHelpers';

interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

interface CategorySelectorProps {
  categories: ProductCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

export const CategorySelector = ({ categories, selectedCategory, onCategorySelect }: CategorySelectorProps) => {
  return (
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
              onClick={() => onCategorySelect(category.id)}
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
  );
};