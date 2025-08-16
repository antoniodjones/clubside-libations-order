import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, ChefHat, Package, PartyPopper } from 'lucide-react';
import { OrderWithTiming, OrderStatusHistory } from '@/hooks/useRealtimeOrderStatus';

interface OrderStatusTimelineProps {
  order: OrderWithTiming;
  orderHistory: OrderStatusHistory[];
  formatDuration: (seconds: number | null) => string;
  getStatusProgress: (status: string) => number;
}

const statusIcons = {
  pending: Clock,
  received: CheckCircle,
  preparing: ChefHat,
  ready: Package,
  completed: PartyPopper,
};

const statusLabels = {
  pending: 'Order Received',
  received: 'Order Confirmed', 
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  completed: 'Completed',
};

const statusColors = {
  pending: 'text-yellow-500',
  received: 'text-blue-500',
  preparing: 'text-orange-500',
  ready: 'text-green-500',
  completed: 'text-purple-500',
};

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  order,
  orderHistory,
  formatDuration,
  getStatusProgress,
}) => {
  const currentProgress = getStatusProgress(order.status);

  const getStatusTime = (status: string): string | null => {
    switch (status) {
      case 'received':
        return order.received_at;
      case 'preparing':
        return order.preparing_at;
      case 'ready':
        return order.ready_at;
      case 'completed':
        return order.completed_at;
      default:
        return order.created_at;
    }
  };

  const formatTime = (timestamp: string | null): string => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCurrentEstimate = (): string => {
    const avgPrepTime = 15; // minutes
    const avgReadyTime = 5; // minutes
    
    switch (order.status) {
      case 'pending':
      case 'received':
        return `Est. ${avgPrepTime + avgReadyTime} minutes`;
      case 'preparing':
        return `Est. ${avgReadyTime} minutes`;
      case 'ready':
        return 'Ready now!';
      case 'completed':
        return 'Thank you!';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Order Status</span>
            <span className="text-sm font-normal text-muted-foreground">
              {getCurrentEstimate()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={currentProgress} className="h-3" />
            <div className="flex items-center space-x-3">
              {React.createElement(statusIcons[order.status as keyof typeof statusIcons], {
                className: `h-6 w-6 ${statusColors[order.status as keyof typeof statusColors]}`,
              })}
              <div>
                <p className="font-semibold">
                  {statusLabels[order.status as keyof typeof statusLabels]}
                </p>
                <p className="text-sm text-muted-foreground">
                  Updated: {formatTime(order.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(statusLabels).map(([status, label], index) => {
              const statusTime = getStatusTime(status);
              const isCompleted = getStatusProgress(status) <= currentProgress;
              const isCurrent = order.status === status;
              const historyItem = orderHistory.find(h => h.status === status);
              
              const IconComponent = statusIcons[status as keyof typeof statusIcons];
              
              return (
                <div key={status} className="flex items-start space-x-4">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2
                    ${isCompleted 
                      ? `bg-primary text-primary-foreground border-primary` 
                      : 'bg-muted border-muted-foreground/20'
                    }
                    ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {label}
                      </p>
                      {statusTime && (
                        <span className="text-sm text-muted-foreground">
                          {formatTime(statusTime)}
                        </span>
                      )}
                    </div>
                    
                    {historyItem?.duration_seconds && (
                      <p className="text-sm text-muted-foreground">
                        Duration: {formatDuration(historyItem.duration_seconds)}
                      </p>
                    )}
                    
                    {historyItem?.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        {historyItem.notes}
                      </p>
                    )}
                  </div>
                  
                  {index < Object.keys(statusLabels).length - 1 && (
                    <div className={`
                      absolute left-4 mt-8 w-0.5 h-6 
                      ${isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};