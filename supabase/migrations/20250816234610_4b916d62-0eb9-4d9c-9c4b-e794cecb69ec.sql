
-- Update the RLS policy for order_items to allow guest orders
DROP POLICY IF EXISTS "Users can create their own order items" ON public.order_items;

CREATE POLICY "Users can create their own order items" ON public.order_items
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR (orders.user_id IS NULL AND orders.guest_email IS NOT NULL AND orders.guest_email <> '')
    )
  )
);

-- Also update the SELECT policy for consistency
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;

CREATE POLICY "Users can view their own order items" ON public.order_items
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR (orders.user_id IS NULL AND orders.guest_email IS NOT NULL AND orders.guest_email <> '')
    )
  )
);
