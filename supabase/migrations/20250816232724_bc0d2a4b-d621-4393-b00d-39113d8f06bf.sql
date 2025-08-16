-- Allow NULL user_id for guest orders
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to handle NULL user_id properly
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;  
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Recreate policies with proper guest order support
CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND guest_email IS NOT NULL AND guest_email <> '')
);

CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND guest_email IS NOT NULL AND guest_email <> '')
);

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND guest_email IS NOT NULL AND guest_email <> '')
);