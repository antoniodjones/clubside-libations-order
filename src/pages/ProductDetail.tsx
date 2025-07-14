import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, ChevronDown, Wine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
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
  fine_print: string | null;
  allergy_information: string | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [finePrintOpen, setFinePrintOpen] = useState(false);
  const [allergyInfoOpen, setAllergyInfoOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
        navigate('/menu');
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = () => {
    if (!product) return null;
    const localImage = productImageMap[product.name as keyof typeof productImageMap];
    return localImage || product.image_url || null;
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-yellow-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-yellow-900 flex items-center justify-center">
        <div className="text-white text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-yellow-900">
      {/* Header with back button */}
      <div className="p-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/menu')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Menu
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <Card className="bg-black/40 backdrop-blur-sm border-purple-400/20 max-w-2xl mx-auto">
          {/* Product Image */}
          <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-yellow-600/20 rounded-t-lg flex items-center justify-center overflow-hidden">
            {getProductImage() ? (
              <img 
                src={getProductImage()!} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Wine className="w-16 h-16 text-yellow-400" />
            )}
          </div>

          <CardContent className="p-6">
            {/* Product Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-yellow-400">${product.price}</div>
                {product.alcohol_content && (
                  <div className="bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full text-sm">
                    {product.alcohol_content}% ABV
                  </div>
                )}
              </div>
              {product.description && (
                <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
              )}
              {product.volume_ml && (
                <p className="text-gray-400 mt-2">{product.volume_ml}ml</p>
              )}
            </div>

            {/* Start Order Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-3 mb-6"
            >
              START AN ORDER
            </Button>

            {/* Fine Print Section */}
            {product.fine_print && (
              <Collapsible open={finePrintOpen} onOpenChange={setFinePrintOpen} className="mb-4">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-white hover:bg-white/10 p-4 h-auto"
                  >
                    <span className="font-semibold">OUR FINE PRINT</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${finePrintOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">{product.fine_print}</p>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Allergy Information Section */}
            {product.allergy_information && (
              <Collapsible open={allergyInfoOpen} onOpenChange={setAllergyInfoOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-white hover:bg-white/10 p-4 h-auto"
                  >
                    <span className="font-semibold">ALLERGY INFORMATION</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${allergyInfoOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">{product.allergy_information}</p>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;