import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, User, ChefHat } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useRealtimeOrderStatus } from "@/hooks/useRealtimeOrderStatus";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Mock order data for fallback
const mockOrder = {
  id: "ORD-2024-001",
  status: "preparing",
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
  const { toast } = useToast();
  const orderId = searchParams.get('orderId');
  const [orderItems, setOrderItems] = useState([]);
  
  const { 
    order, 
    orderHistory, 
    loading, 
    error, 
    formatDuration, 
    getStatusProgress 
  } = useRealtimeOrderStatus(orderId);

  // Fetch order items when order is loaded
  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!order?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('order_items')
          .select(`
            *,
            products:product_id (
              name,
              price,
              image_url,
              description
            )
          `)
          .eq('order_id', order.id);

        if (error) throw error;
        setOrderItems(data || []);
      } catch (err) {
        console.error('Error fetching order items:', err);
      }
    };

    fetchOrderItems();
  }, [order?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading order...</div>
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error loading order",
      description: "Could not load order details. Please try again.",
      variant: "destructive"
    });
  }

  // Use real order data if available, otherwise fallback to mock
  const displayOrder = order || mockOrder;

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
            <p className="text-xl text-gray-300 font-light">
              Order #{displayOrder.id}
            </p>
            {order && (order.guest_name || order.guest_email) && (
              <p className="text-lg text-gray-400 mt-2">
                Guest Order: {order.guest_name || order.guest_email}
              </p>
            )}
          </div>

          {/* Real-time Order Status Timeline */}
          {order ? (
            <OrderStatusTimeline
              order={order}
              orderHistory={orderHistory}
              formatDuration={formatDuration}
              getStatusProgress={getStatusProgress}
            />
          ) : (
            <Card className="bg-black/40 backdrop-blur-sm border-yellow-400/30">
              <CardContent className="p-8 text-center">
                <p className="text-white text-lg mb-4">
                  {orderId ? 'Order not found' : 'Demo Order - No tracking available'}
                </p>
                <p className="text-gray-400">
                  {orderId 
                    ? 'Please check your order ID and try again.' 
                    : 'This is a demo order for testing purposes.'
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card className="bg-black/40 border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.length > 0 ? (
                  orderItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                      {item.products?.image_url && (
                        <img 
                          src={item.products.image_url} 
                          alt={item.products?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-lg">{item.products?.name}</h4>
                        {item.products?.description && (
                          <p className="text-gray-400 text-sm">{item.products.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-gray-300">Qty: {item.quantity}</span>
                          <span className="text-gray-300">@${item.unit_price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold text-xl">${item.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : order ? (
                  <div className="text-gray-400 text-center py-4">
                    Loading order items...
                  </div>
                ) : (
                  // Show mock items for demo
                  mockOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-yellow-400 font-bold">{item.total}</p>
                    </div>
                  ))
                )}
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-400">
                      {order ? `$${order.total_amount?.toFixed(2)}` : mockOrder.total}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bartender & Service Information */}
          {order && (
            <Card className="bg-black/40 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(order as any).assigned_bartender ? (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">Your Bartender</p>
                        <p className="text-yellow-400 text-lg font-semibold">{(order as any).assigned_bartender}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Bartender Assignment</p>
                        <p className="text-gray-400">Will be assigned when order preparation begins</p>
                      </div>
                    </div>
                  )}
                  
                  {(order as any).bartender_notes && (
                    <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                      <p className="text-blue-300 font-medium mb-2">Bartender Notes:</p>
                      <p className="text-sm text-white">{(order as any).bartender_notes}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">
                      ✨ Our expert bartenders craft each drink with precision and care. 
                      Your order will be prepared by one of our certified mixologists.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                    <p>Main Venue - Downtown Location</p>
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

                {order?.special_instructions && (
                  <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                    <p className="text-blue-300 font-medium mb-2">Special Instructions:</p>
                    <p className="text-sm">{order.special_instructions}</p>
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
              onClick={() => window.open('tel:(555)123-4567')}
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