import { Wine, Beer, Coffee, Utensils, Leaf } from "lucide-react";

export const getCategoryIcon = (categoryName: string) => {
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

export const getCategoryGradient = (categoryName: string) => {
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