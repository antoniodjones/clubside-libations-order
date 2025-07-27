
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

const BackOffice = () => {
  const [activeOrders] = useState([
    { id: "ORD-001", table: "Standing Area 1", items: ["2x Premium Cocktail", "1x Wings"], total: 48, status: "preparing", time: "3 min ago" },
    { id: "ORD-002", table: "Bar Section", items: ["1x Craft Beer", "1x Nachos"], total: 24, status: "ready", time: "1 min ago" },
    { id: "ORD-003", table: "VIP Area", items: ["3x Wine Glass", "2x Sliders"], total: 64, status: "received", time: "Just now" },
  ]);

  const stats = {
    totalRevenue: 2840,
    ordersToday: 47,
    avgOrderTime: 8.5,
    customerSatisfaction: 4.8
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received": return "bg-blue-500";
      case "preparing": return "bg-yellow-500";
      case "ready": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received": return <Clock className="w-4 h-4" />;
      case "preparing": return <AlertTriangle className="w-4 h-4" />;
      case "ready": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Back Office Dashboard</h1>
          <p className="text-gray-300 text-lg">Manage your venue operations and orders</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Today's Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.totalRevenue}</div>
              <p className="text-xs text-green-400 mt-1">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Orders Today</CardTitle>
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.ordersToday}</div>
              <p className="text-xs text-blue-400 mt-1">+5 from last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Avg Order Time</CardTitle>
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.avgOrderTime}m</div>
              <p className="text-xs text-yellow-400 mt-1">-2m improvement</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Customer Rating</CardTitle>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.customerSatisfaction}★</div>
              <p className="text-xs text-purple-400 mt-1">Based on 127 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-white text-lg">{order.id}</span>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                        <span className="text-gray-400 text-sm">{order.time}</span>
                      </div>
                      <div className="text-gray-300 mb-2">
                        <strong>Location:</strong> {order.table}
                      </div>
                      <div className="text-gray-300">
                        <strong>Items:</strong> {order.items.join(", ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400 mb-2">${order.total}</div>
                      <div className="space-x-2">
                        {order.status === "received" && (
                          <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                            Start Preparing
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                            Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                            Complete Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackOffice;
