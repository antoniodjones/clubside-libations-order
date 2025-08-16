import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OrderStatusHistory {
  id: string;
  status: string;
  previous_status: string | null;
  changed_at: string;
  duration_seconds: number | null;
  notes: string | null;
}

export interface OrderWithTiming {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  table_number: string | null;
  special_instructions: string | null;
  received_at: string | null;
  preparing_at: string | null;
  ready_at: string | null;
  completed_at: string | null;
}

export const useRealtimeOrderStatus = (orderId: string | null) => {
  const [order, setOrder] = useState<OrderWithTiming | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderData = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) {
        throw orderError;
      }

      setOrder(orderData);

      // Fetch order status history
      const { data: historyData, error: historyError } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('changed_at', { ascending: true });

      if (historyError) {
        console.error('Error fetching order history:', historyError);
      } else {
        setOrderHistory(historyData || []);
      }
    } catch (err) {
      console.error('Error fetching order data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch order data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();

    if (!orderId) return;

    // Set up real-time subscription for order updates
    const orderChannel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log('Order updated:', payload);
          setOrder(payload.new as OrderWithTiming);
        }
      )
      .subscribe();

    // Set up real-time subscription for order status history
    const historyChannel = supabase
      .channel('order-history-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          console.log('Order status history updated:', payload);
          setOrderHistory(prev => [...prev, payload.new as OrderStatusHistory]);
        }
      )
      .subscribe();

    return () => {
      orderChannel.unsubscribe();
      historyChannel.unsubscribe();
    };
  }, [orderId]);

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return 'N/A';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getStatusProgress = (currentStatus: string): number => {
    const statusOrder = ['pending', 'received', 'preparing', 'ready', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex >= 0 ? (currentIndex / (statusOrder.length - 1)) * 100 : 0;
  };

  return {
    order,
    orderHistory,
    loading,
    error,
    formatDuration,
    getStatusProgress,
    refetch: fetchOrderData,
  };
};