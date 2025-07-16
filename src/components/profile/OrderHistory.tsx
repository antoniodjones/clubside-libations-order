import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Calendar, MapPin, DollarSign, Eye } from 'lucide-react';
import { OrderDetail } from '@/components/profile/OrderDetail';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  venue: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

// Mock data - replace with real data from Supabase
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    venue: 'Downtown Tavern',
    amount: 45.50,
    status: 'completed'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-12',
    venue: 'Sports Bar & Grill',
    amount: 67.25,
    status: 'completed'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-10',
    venue: 'Rooftop Lounge',
    amount: 89.75,
    status: 'cancelled'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-01-08',
    venue: 'Craft Beer House',
    amount: 32.00,
    status: 'completed'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'preparing':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'ready':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  if (selectedOrder) {
    return (
      <OrderDetail 
        order={selectedOrder} 
        onBack={() => setSelectedOrder(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="h-8 w-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Order History</h2>
          <p className="text-gray-400">View all your past orders</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <Card key={order.id} className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-purple-400 hover:text-purple-300 font-semibold text-lg underline"
                    >
                      {order.orderNumber}
                    </button>
                    <div className="flex items-center gap-4 mt-2 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{order.venue}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${order.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockOrders.length === 0 && (
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Orders Yet</h3>
            <p className="text-gray-400">Your order history will appear here once you make your first order.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};