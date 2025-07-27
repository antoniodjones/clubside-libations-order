import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign, Eye } from 'lucide-react';
import { Order } from '@/types/profile';
import { getOrderStatusColor, formatCurrency, formatDate, getOrderStatusText } from '@/utils/profile';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = React.memo(({ order, onViewDetails }) => {
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <button
                onClick={() => onViewDetails(order)}
                className="text-purple-400 hover:text-purple-300 font-semibold text-lg underline"
              >
                {order.orderNumber}
              </button>
              <div className="flex items-center gap-4 mt-2 text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(order.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{order.venue}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(order.amount)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={getOrderStatusColor(order.status)}>
              {getOrderStatusText(order.status)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(order)}
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});