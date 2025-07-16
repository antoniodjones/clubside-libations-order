import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Coffee, MapPin, Phone } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "received" | "preparing" | "ready" | "completed";

const getStepCompleted = (stepId: OrderStatus, currentStatus: OrderStatus): boolean => {
  const statusOrder = ["received", "preparing", "ready", "completed"];
  const stepIndex = statusOrder.indexOf(stepId);
  const currentIndex = statusOrder.indexOf(currentStatus);
  return stepIndex <= currentIndex;
};

const statusSteps = [
  { id: "received" as OrderStatus, label: "Order Received", icon: <CheckCircle className="w-6 h-6" /> },
  { id: "preparing" as OrderStatus, label: "Preparing", icon: <Coffee className="w-6 h-6" /> },
  { id: "ready" as OrderStatus, label: "Ready for Pickup", icon: <Clock className="w-6 h-6" /> },
  { id: "completed" as OrderStatus, label: "Completed", icon: <CheckCircle className="w-6 h-6" /> },
];

// Mock order data for fallback
const currentOrder = {
  id: "ORD-2024-001",
  status: "preparing" as OrderStatus,
  items: [
    { name: "Espresso Martini", quantity: 2, total: "$32.00" },
    { name: "Truffle Arancini", quantity: 1, total: "$16.00" },
  ],
  total: "$48.00",
  estimatedTime: "15-20 minutes",
  venue: "Downtown Location"
};

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        // Use mock data if no order ID
        setOrder(currentOrder);
        setLoading(false);
        return;
      }

      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        // Fetch order items with product details
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              name,
              price,
              image_url
            )
          `)
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        setOrder(orderData);
        setOrderItems(itemsData || []);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast({
          title: "Error loading order",
          description: "Could not load order details. Showing demo order.",
          variant: "destructive"
        });
        setOrder(currentOrder);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading order...</div>
      </div>
    );
  }

  const displayOrder = order || currentOrder;
  const displayItems = orderItems.length > 0 ? orderItems : currentOrder.items;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight">
              TRACK YOUR
              <br />
              <span className="text-yellow-400">ORDER</span>
            </h1>
            <p className="text-xl text-gray-300 font-light">Order #{displayOrder.id}</p>
          </div>

          {/* Order Status */}
          <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Coffee className="w-5 h-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                {statusSteps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      getStepCompleted(step.id, displayOrder.status || 'received') 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {step.icon}
                    </div>
                    <span className={`text-sm font-medium ${
                      getStepCompleted(step.id, displayOrder.status || 'received') 
                        ? 'text-yellow-400' 
                        : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                    {index < statusSteps.length - 1 && (
                      <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                        getStepCompleted(statusSteps[index + 1].id, displayOrder.status || 'received')
                          ? 'bg-yellow-400' 
                          : 'bg-gray-600'
                      }`} style={{ 
                        transform: `translateX(${50 + (100 / statusSteps.length)}%)`,
                        width: `${100 / statusSteps.length}%`
                      }} />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                  Estimated pickup: {displayOrder.estimatedTime || "15-20 minutes"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="bg-black/40 border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayItems.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">
                        {item.products?.name || item.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-yellow-400 font-bold">
                      ${item.total_price?.toFixed(2) || item.total}
                    </p>
                  </div>
                ))}
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-400">
                      ${displayOrder.total_amount?.toFixed(2) || displayOrder.total}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pickup Information */}
          <Card className="bg-black/40 border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white">Pickup Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-medium">Pickup Location</p>
                    <p>{displayOrder.venue || "Main Venue"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p>(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
                  <p className="text-yellow-300 font-medium mb-2">Pickup Instructions:</p>
                  <p className="text-sm">
                    Please show your order confirmation when you arrive. 
                    If you have any issues, please call the venue directly.
                  </p>
                </div>

                {displayOrder.special_instructions && (
                  <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                    <p className="text-blue-300 font-medium mb-2">Special Instructions:</p>
                    <p className="text-sm">{displayOrder.special_instructions}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="text-center">
            <Button 
              variant="outline" 
              className="bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              Call Venue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;