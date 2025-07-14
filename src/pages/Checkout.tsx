import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

interface CheckoutProps {
  cart: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      image_url: string | null;
    };
    quantity: number;
  }>;
  total: number;
  onClearCart: () => void;
}

export const Checkout = ({ cart, total, onClearCart }: CheckoutProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleMockPayment = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get current user (if logged in) or use guest info
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create order in database
      const orderData = {
        user_id: user?.id || "00000000-0000-0000-0000-000000000000", // Guest user placeholder
        venue_id: "00000000-0000-0000-0000-000000000001", // Default venue placeholder
        total_amount: total,
        status: "received",
        special_instructions: `Guest order - ${customerInfo.name} (${customerInfo.email})`
      };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Success - clear cart and navigate
      onClearCart();
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully"
      });
      
      navigate(`/track-order?orderId=${order.id}`);

    } catch (error) {
      console.error("Order creation failed:", error);
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/menu")}
              className="text-white hover:text-yellow-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="bg-black/40 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{item.product.name}</p>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-yellow-400 font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-yellow-400">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="bg-black/40 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Mock Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-black/60 border-gray-600 text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-black/60 border-gray-600 text-white"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-black/60 border-gray-600 text-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mt-6">
                  <p className="text-blue-300 text-sm">
                    🧪 <strong>Development Mode:</strong> This is a mock payment system. 
                    No real payment will be processed.
                  </p>
                </div>

                <Button
                  onClick={handleMockPayment}
                  disabled={isProcessing}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Complete Mock Payment - $${total.toFixed(2)}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};