import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import { OrderDetail } from '@/components/profile/OrderDetail';
import { OrderCard } from '@/components/profile/common/OrderCard';
import { SectionHeader } from '@/components/profile/common/SectionHeader';
import { Order } from '@/types/profile';
import { mockOrders } from '@/data/mockCustomerData';

export const OrderHistory: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const handleViewDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedOrder(null);
  }, []);
  
  if (selectedOrder) {
    return (
      <OrderDetail 
        order={selectedOrder} 
        onBack={handleBack} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={ShoppingBag} 
        title="Order History" 
        description="View all your past orders"
      />

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onViewDetails={handleViewDetails}
          />
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