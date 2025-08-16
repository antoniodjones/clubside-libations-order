import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useRealtimeOrderStatus } from "@/hooks/useRealtimeOrderStatus";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import { useToast } from "@/hooks/use-toast";

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
  
  const { 
    order, 
    orderHistory, 
    loading, 
    error, 
    formatDuration, 
    getStatusProgress 
  } = useRealtimeOrderStatus(orderId);

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

          {/* Order Details */}
          <Card className="bg-black/40 border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order ? (
                  // Show actual order items if available
                  <div className="text-white">
                    <p>Total Amount: <span className="text-yellow-400 font-bold">${order.total_amount?.toFixed(2)}</span></p>
                    {order.table_number && (
                      <p>Table Number: <span className="text-yellow-400">{order.table_number}</span></p>
                    )}
                  </div>
                ) : (
                  // Show mock items
                  mockOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-yellow-400 font-bold">{item.total}</p>
                    </div>
                  ))
                )}
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-400">
                      {order ? `$${order.total_amount?.toFixed(2)}` : mockOrder.total}
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