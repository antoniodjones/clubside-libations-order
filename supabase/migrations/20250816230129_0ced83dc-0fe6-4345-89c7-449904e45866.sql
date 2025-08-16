-- Add timestamp columns for each order status phase
ALTER TABLE public.orders 
ADD COLUMN received_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN preparing_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN ready_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;

-- Update existing orders to set received_at to created_at for pending orders
UPDATE public.orders 
SET received_at = created_at 
WHERE status = 'pending';

-- Create order status history table for detailed tracking
CREATE TABLE public.order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  status TEXT NOT NULL,
  previous_status TEXT,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_seconds INTEGER,
  notes TEXT,
  changed_by_user_id UUID
);

-- Enable RLS on order status history
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their order status history
CREATE POLICY "Users can view their order status history" 
ON public.order_status_history 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_status_history.order_id 
  AND (orders.user_id = auth.uid() OR orders.guest_email IS NOT NULL)
));

-- Create function to update order status with timing
CREATE OR REPLACE FUNCTION public.update_order_status(
  order_id_param UUID,
  new_status TEXT,
  notes_param TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  current_order RECORD;
  duration_calc INTEGER;
  previous_timestamp TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current order details
  SELECT * INTO current_order FROM public.orders WHERE id = order_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  -- Calculate duration based on status transition
  CASE new_status
    WHEN 'preparing' THEN
      previous_timestamp := current_order.received_at;
      UPDATE public.orders SET preparing_at = now() WHERE id = order_id_param;
    WHEN 'ready' THEN
      previous_timestamp := current_order.preparing_at;
      UPDATE public.orders SET ready_at = now() WHERE id = order_id_param;
    WHEN 'completed' THEN
      previous_timestamp := current_order.ready_at;
      UPDATE public.orders SET completed_at = now() WHERE id = order_id_param;
  END CASE;
  
  -- Calculate duration if we have a previous timestamp
  IF previous_timestamp IS NOT NULL THEN
    duration_calc := EXTRACT(EPOCH FROM (now() - previous_timestamp))::INTEGER;
  END IF;
  
  -- Update the order status
  UPDATE public.orders SET 
    status = new_status,
    updated_at = now()
  WHERE id = order_id_param;
  
  -- Insert into status history
  INSERT INTO public.order_status_history (
    order_id, 
    status, 
    previous_status, 
    duration_seconds, 
    notes
  ) VALUES (
    order_id_param, 
    new_status, 
    current_order.status, 
    duration_calc, 
    notes_param
  );
END;
$$;

-- Enable realtime for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Enable realtime for order status history
ALTER TABLE public.order_status_history REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;

-- Create trigger to automatically set received_at when order is created
CREATE OR REPLACE FUNCTION public.set_order_received_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'pending' OR NEW.status = 'received' THEN
    NEW.received_at := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_received_timestamp_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_received_timestamp();