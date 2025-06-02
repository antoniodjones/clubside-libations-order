
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Package, Utensils } from "lucide-react";

const TrackOrder = () => {
  const orderStatus = "preparing"; // received, preparing, ready, completed
  
  const statusSteps = [
    { id: "received", label: "Order Received", icon: CheckCircle, completed: true },
    { id: "preparing", label: "Being Prepared", icon: Utensils, completed: orderStatus === "preparing" || orderStatus === "ready" || orderStatus === "completed" },
    { id: "ready", label: "Ready for Pickup", icon: Package, completed: orderStatus === "ready" || orderStatus === "completed" },
    { id: "completed", label: "Order Complete", icon: CheckCircle, completed: orderStatus === "completed" },
  ];

  const currentOrder = {
    id: "ORD-001",
    venue: "Downtown Club",
    items: [
      { name: "Premium Cocktail", quantity: 2, price: 30 },
      { name: "Wings Platter", quantity: 1, price: 18 },
    ],
    total: 48,
    estimatedTime: "8-12 minutes",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Track Your Order</h1>
          <p className="text-gray-300 text-lg">Order #{currentOrder.id} at {currentOrder.venue}</p>
        </div>

        {/* Order Status */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {statusSteps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-gray-600 text-gray-400'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${step.completed ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {step.label}
                    </div>
                    {step.id === orderStatus && (
                      <div className="text-sm text-gray-300 mt-1">
                        Estimated: {currentOrder.estimatedTime}
                      </div>
                    )}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`w-0.5 h-8 ml-6 ${step.completed ? 'bg-yellow-400' : 'bg-gray-600'}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
                  <div>
                    <div className="text-white font-semibold">{item.name}</div>
                    <div className="text-gray-400">Quantity: {item.quantity}</div>
                  </div>
                  <div className="text-yellow-400 font-bold">${item.price}</div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold text-white">Total</div>
                  <div className="text-2xl font-bold text-yellow-400">${currentOrder.total}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Instructions */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Pickup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span>Show this screen to the bartender when picking up</span>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-yellow-400" />
                <span>Pick up at the designated LibrationsPLUS counter</span>
              </div>
              <div className="p-4 bg-yellow-400/20 rounded-lg border border-yellow-400/30">
                <p className="text-yellow-400 font-semibold">
                  ✨ Your order will be ready soon! You'll receive a notification when it's ready for pickup.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackOrder;
