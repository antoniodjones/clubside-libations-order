import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { OrderWithItems } from '@/types/profile';
import { formatDate, formatCurrency } from '@/utils/profile';

interface OrderHistoryCardProps {
  orders: OrderWithItems[];
}

export const OrderHistoryCard: React.FC<OrderHistoryCardProps> = React.memo(({ orders }) => {
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ShoppingBag className="h-5 w-5" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  {order.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-400">
                  {formatDate(order.date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="font-semibold text-white">{formatCurrency(order.amount)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">{item.name}</span>
                    <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                      {item.category}
                    </Badge>
                  </div>
                  <span className="text-gray-400">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});