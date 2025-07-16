import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, DollarSign, Clock, User } from 'lucide-react';

interface OrderDetailProps {
  order: {
    id: string;
    orderNumber: string;
    date: string;
    venue: string;
    amount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  };
  onBack: () => void;
}

// Mock order items - replace with real data from Supabase
const mockOrderItems = [
  {
    id: '1',
    name: 'Craft IPA',
    quantity: 2,
    price: 8.50,
    total: 17.00
  },
  {
    id: '2',
    name: 'Buffalo Wings',
    quantity: 1,
    price: 12.50,
    total: 12.50
  },
  {
    id: '3',
    name: 'Loaded Nachos',
    quantity: 1,
    price: 16.00,
    total: 16.00
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

export const OrderDetail = ({ order, onBack }: OrderDetailProps) => {
  const subtotal = mockOrderItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>

      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white">{order.orderNumber}</CardTitle>
              <p className="text-gray-400 mt-1">Order Details</p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Order Date:</span>
                <span>{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Venue:</span>
                <span>{order.venue}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Estimated Time:</span>
                <span>15-20 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <User className="h-4 w-4" />
                <span className="font-medium">Table:</span>
                <span>Table 7</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-purple-500/20 last:border-b-0">
                <div className="flex items-center gap-4">
                  <div className="text-white font-medium">{item.name}</div>
                  <div className="text-gray-400">x{item.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="text-white">${item.total.toFixed(2)}</div>
                  <div className="text-sm text-gray-400">${item.price.toFixed(2)} each</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-purple-500/20 space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Special Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            Extra sauce on the side for wings. Please make sure the nachos are extra crispy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};