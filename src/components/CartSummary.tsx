import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface CartSummaryProps {
  itemCount: number;
  total: number;
  onCheckout: () => void;
}

export const CartSummary = ({ itemCount, total, onCheckout }: CartSummaryProps) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
      <Card className="bg-yellow-400 border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-black" />
              <span className="font-semibold text-black">{itemCount} items</span>
            </div>
            <div className="text-2xl font-bold text-black">${total.toFixed(2)}</div>
          </div>
          <Button 
            onClick={onCheckout}
            className="w-full bg-black hover:bg-gray-800 text-yellow-400 font-bold text-lg py-3"
          >
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};