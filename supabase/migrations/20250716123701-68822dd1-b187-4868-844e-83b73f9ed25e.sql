-- Rename user_loyalty table to user_rewards
ALTER TABLE public.user_loyalty RENAME TO user_rewards;

-- Rename loyalty_tiers table to reward_tiers
ALTER TABLE public.loyalty_tiers RENAME TO reward_tiers;

-- Update foreign key references in user_rewards table
ALTER TABLE public.user_rewards RENAME COLUMN tier_id TO reward_tier_id;

-- Update function that references loyalty
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  
  -- Insert into user_rewards table with default values
  INSERT INTO public.user_rewards (user_id, total_points, available_points)
  VALUES (NEW.id, 0, 0);
  
  RETURN NEW;
END;
$function$;

-- Update trigger name for user_rewards table
DROP TRIGGER IF EXISTS update_loyalty_updated_at ON public.user_rewards;
CREATE TRIGGER update_rewards_updated_at
BEFORE UPDATE ON public.user_rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update RLS policies for user_rewards table
DROP POLICY IF EXISTS "Users can create their own loyalty profile" ON public.user_rewards;
DROP POLICY IF EXISTS "Users can update their own loyalty profile" ON public.user_rewards;
DROP POLICY IF EXISTS "Users can view their own loyalty profile" ON public.user_rewards;

CREATE POLICY "Users can create their own rewards profile" 
ON public.user_rewards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards profile" 
ON public.user_rewards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own rewards profile" 
ON public.user_rewards 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update RLS policies for reward_tiers table
DROP POLICY IF EXISTS "Loyalty tiers are publicly readable" ON public.reward_tiers;
CREATE POLICY "Reward tiers are publicly readable" 
ON public.reward_tiers 
FOR SELECT 
USING (is_active = true);

-- Update foreign key constraint in rewards table
ALTER TABLE public.rewards DROP CONSTRAINT IF EXISTS rewards_minimum_tier_id_fkey;
ALTER TABLE public.rewards ADD CONSTRAINT rewards_minimum_tier_id_fkey 
FOREIGN KEY (minimum_tier_id) REFERENCES public.reward_tiers(id);