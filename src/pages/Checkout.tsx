import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CreditCard, Loader2, Minus, Plus, Trash2 } from "lucide-react";

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
  onDeleteFromCart: (productId: string) => void;
  onAddToCart: (product: any) => void;
  onRemoveFromCart: (productId: string) => void;
  onGuestInfoChange: (info: { email: string; phone: string }) => void;
}

export const Checkout = ({ cart, total, onClearCart, onDeleteFromCart, onAddToCart, onRemoveFromCart, onGuestInfoChange }: CheckoutProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [tipPercentage, setTipPercentage] = useState(18);
  const [customTip, setCustomTip] = useState("");
  const [isCustomTip, setIsCustomTip] = useState(false);
  const [venueInfo, setVenueInfo] = useState<{
    state: string;
    taxRate: number;
    stateName: string;
  } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // State tax rates mapping
  const STATE_TAX_RATES = {
    'NY': { rate: 0.08875, name: 'New York' },
    'CA': { rate: 0.0725, name: 'California' },
    'TX': { rate: 0.0625, name: 'Texas' },
    'FL': { rate: 0.06, name: 'Florida' },
    'WA': { rate: 0.065, name: 'Washington' },
    'NV': { rate: 0.0685, name: 'Nevada' },
    'IL': { rate: 0.0625, name: 'Illinois' },
    // Add more states as needed
  } as const;

  // Fetch venue information on component mount
  useEffect(() => {
    const fetchVenueInfo = async () => {
      try {
        const { data: venue, error: venueError } = await supabase
          .from('venues')
          .select(`
            id,
            name,
            cities!inner(state)
          `)
          .eq('id', '01cf9bb6-9bee-4926-af17-a0d4fe01cf38')
          .single();

        if (venueError) throw venueError;

        const state = venue.cities.state as keyof typeof STATE_TAX_RATES;
        const taxInfo = STATE_TAX_RATES[state] || { rate: 0.08, name: state };
        
        setVenueInfo({
          state: state,
          taxRate: taxInfo.rate,
          stateName: taxInfo.name
        });
      } catch (error) {
        console.error('Error fetching venue info:', error);
        // Fallback to NY tax rate
        setVenueInfo({
          state: 'NY',
          taxRate: 0.08875,
          stateName: 'New York'
        });
      }
    };

    fetchVenueInfo();
  }, []);

  // Calculate tax and tip
  const taxAmount = venueInfo ? total * venueInfo.taxRate : 0;
  const tipAmount = isCustomTip ? parseFloat(customTip) || 0 : total * (tipPercentage / 100);
  const finalTotal = total + taxAmount + tipAmount;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => {
      const updated = { ...prev, [field]: value };
      // Update guest info for abandoned cart tracking
      onGuestInfoChange({
        email: updated.email,
        phone: updated.phone
      });
      return updated;
    });
  };

  const handleTipSelect = (percentage: number) => {
    setTipPercentage(percentage);
    setIsCustomTip(false);
    setCustomTip("");
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    setIsCustomTip(true);
  };

  const handleMockPayment = async () => {
    // Validate required fields
    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email",
        variant: "destructive"
      });
      return;
    }

    // Validate empty cart
    if (!cart || cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Validate cart items are still available
      const productIds = cart.map(item => item.product.id);
      const { data: availableProducts, error: productError } = await supabase
        .from("products")
        .select("id, name, is_available")
        .in("id", productIds);

      if (productError) throw productError;

      // Check if any products are no longer available
      const unavailableProducts = cart.filter(item => {
        const product = availableProducts?.find(p => p.id === item.product.id);
        return !product || !product.is_available;
      });

      if (unavailableProducts.length > 0) {
        toast({
          title: "Items No Longer Available",
          description: `${unavailableProducts.map(item => item.product.name).join(", ")} are no longer available. Please remove them from your cart.`,
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Server-side email validation
      const { error: emailValidationError } = await supabase.functions.invoke('validate-email', {
        body: { email: customerInfo.email }
      });

      if (emailValidationError) {
        console.warn("Email validation failed:", emailValidationError);
        // Continue with checkout even if email validation fails (non-blocking)
      }
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get current user (if logged in) or use guest info
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create order in database
      const orderData = user?.id ? {
        // Authenticated user order
        user_id: user.id,
        venue_id: "01cf9bb6-9bee-4926-af17-a0d4fe01cf38", // The Dead Rabbit venue
        total_amount: finalTotal,
        status: "pending"
      } : {
        // Guest order - use null for user_id
        user_id: null,
        venue_id: "01cf9bb6-9bee-4926-af17-a0d4fe01cf38", // The Dead Rabbit venue
        total_amount: finalTotal,
        status: "pending",
        guest_name: customerInfo.name,
        guest_email: customerInfo.email,
        guest_phone: customerInfo.phone || null
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
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
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-white font-bold text-lg">{item.product.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-yellow-400 font-bold text-xl">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRemoveFromCart(item.product.id)}
                            className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddToCart(item.product)}
                          className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteFromCart(item.product.id)}
                          className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator className="bg-gray-700" />
                
                {/* Subtotal */}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                
                {/* Tax */}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-300">
                    Tax ({venueInfo?.state} - {(venueInfo?.taxRate * 100 || 0).toFixed(3)}%)
                  </span>
                  <span className="text-white">${taxAmount.toFixed(2)}</span>
                </div>
                
                {/* Tip */}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-300">
                    Tip {isCustomTip ? "(Custom)" : `(${tipPercentage}%)`}
                  </span>
                  <span className="text-white">${tipAmount.toFixed(2)}</span>
                </div>
                
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-yellow-400">${finalTotal.toFixed(2)}</span>
                </div>
                
                {/* Tip Selection */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-white font-semibold text-lg">Add Tip</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[15, 18, 20].map((percentage) => (
                      <Button
                        key={percentage}
                        variant={tipPercentage === percentage && !isCustomTip ? "default" : "outline"}
                        onClick={() => handleTipSelect(percentage)}
                        className={`${
                          tipPercentage === percentage && !isCustomTip
                            ? "bg-yellow-400 text-black hover:bg-yellow-500"
                            : "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {percentage}%
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customTip" className="text-gray-400">Custom Tip Amount ($)</Label>
                    <Input
                      id="customTip"
                      type="number"
                      step="0.01"
                      min="0"
                      value={customTip}
                      onChange={(e) => handleCustomTipChange(e.target.value)}
                      className="bg-black/60 border-gray-600 text-white"
                      placeholder="Enter custom tip amount"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  <CreditCard className="w-6 h-6 mr-3" />
                  Mock Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-400">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-black/60 border-gray-600 text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-400">Email *</Label>
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
                  <Label htmlFor="phone" className="text-gray-400">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-black/60 border-gray-600 text-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mt-6">
                  <p className="text-gray-300 text-sm">
                    🧪 <strong>Development Mode:</strong> This is a mock payment system. 
                    No real payment will be processed.
                  </p>
                </div>

                <Button
                  onClick={handleMockPayment}
                  disabled={isProcessing}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Complete Mock Payment - $${finalTotal.toFixed(2)}`
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