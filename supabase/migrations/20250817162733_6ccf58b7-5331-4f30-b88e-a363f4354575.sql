-- Add user_id to abandoned_carts table to support authenticated users
ALTER TABLE public.abandoned_carts 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for better performance when querying by user_id
CREATE INDEX idx_abandoned_carts_user_id ON public.abandoned_carts(user_id);

-- Update RLS policy to be more specific for authenticated vs guest users
DROP POLICY IF EXISTS "Abandoned carts are publicly accessible" ON public.abandoned_carts;

-- Allow authenticated users to manage their own carts
CREATE POLICY "Users can manage their own abandoned carts" 
ON public.abandoned_carts 
FOR ALL 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND session_id IS NOT NULL)
) 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND session_id IS NOT NULL)
);

-- Allow public access for guest carts (session-based)
CREATE POLICY "Guest carts are accessible by session" 
ON public.abandoned_carts 
FOR ALL 
USING (user_id IS NULL AND session_id IS NOT NULL) 
WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);