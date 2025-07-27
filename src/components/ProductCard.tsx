import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wine, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { productImageMap } from "../assets/images";

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

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
}

export const ProductCard = ({ product, quantity, onAddToCart, onRemoveFromCart }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const getProductImage = () => {
    const localImage = productImageMap[product.name as keyof typeof productImageMap];
    return localImage || product.image_url || null;
  };

  const handleCardClick = () => {
    navigate(`/menu/product/${product.id}`);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-purple-400/20 hover:border-yellow-400/40 transition-all duration-300 cursor-pointer">
      <div onClick={handleCardClick}>
        <CardHeader>
          <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-yellow-600/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            {getProductImage() ? (
              <img 
                src={getProductImage()!} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Wine className="w-12 h-12 text-yellow-400" />
            )}
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
        </CardContent>
      </div>
      <CardContent>
        <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
          {quantity > 0 ? (
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRemoveFromCart(product.id)}
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-white font-semibold text-lg">{quantity}</span>
              <Button
                size="sm"
                onClick={() => onAddToCart(product)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onAddToCart(product)}
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
};