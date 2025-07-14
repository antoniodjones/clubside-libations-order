-- Create loyalty system tables

-- Loyalty tiers table
CREATE TABLE public.loyalty_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  minimum_points INTEGER NOT NULL DEFAULT 0,
  benefits JSONB,
  color TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User loyalty profiles
CREATE TABLE public.user_loyalty (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  available_points INTEGER NOT NULL DEFAULT 0,
  tier_id UUID REFERENCES public.loyalty_tiers(id),
  lifetime_spent NUMERIC NOT NULL DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES auth.users(id),
  birthday DATE,
  anniversary_date DATE,
  social_sharing_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Points transactions
CREATE TABLE public.points_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'earned', 'redeemed', 'expired', 'bonus'
  reason TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  reward_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rewards catalog
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  reward_type TEXT NOT NULL, -- 'discount', 'free_item', 'cashback', 'experience'
  reward_value NUMERIC, -- discount amount or cashback value
  product_id UUID REFERENCES public.products(id),
  venue_id UUID REFERENCES public.venues(id),
  minimum_tier_id UUID REFERENCES public.loyalty_tiers(id),
  max_redemptions INTEGER,
  current_redemptions INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reward redemptions
CREATE TABLE public.reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id),
  points_spent INTEGER NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'used', 'expired'
  expires_at TIMESTAMP WITH TIME ZONE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Referral tracking
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'expired'
  referrer_points INTEGER NOT NULL DEFAULT 0,
  referred_points INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referred_id)
);

-- Check-in bonuses
CREATE TABLE public.check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES public.venues(id),
  points_earned INTEGER NOT NULL DEFAULT 0,
  bonus_type TEXT, -- 'first_visit', 'consecutive', 'special_event'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.loyalty_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- Create policies for loyalty_tiers
CREATE POLICY "Loyalty tiers are publicly readable" 
ON public.loyalty_tiers 
FOR SELECT 
USING (is_active = true);

-- Create policies for user_loyalty
CREATE POLICY "Users can view their own loyalty profile" 
ON public.user_loyalty 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own loyalty profile" 
ON public.user_loyalty 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loyalty profile" 
ON public.user_loyalty 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for points_transactions
CREATE POLICY "Users can view their own points transactions" 
ON public.points_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policies for rewards
CREATE POLICY "Rewards are publicly readable" 
ON public.rewards 
FOR SELECT 
USING (is_active = true);

-- Create policies for reward_redemptions
CREATE POLICY "Users can view their own redemptions" 
ON public.reward_redemptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions" 
ON public.reward_redemptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for referrals
CREATE POLICY "Users can view referrals they're involved in" 
ON public.referrals 
FOR SELECT 
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals as referrer" 
ON public.referrals 
FOR INSERT 
WITH CHECK (auth.uid() = referrer_id);

-- Create policies for check_ins
CREATE POLICY "Users can view their own check-ins" 
ON public.check_ins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins" 
ON public.check_ins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_loyalty_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_loyalty_tiers_updated_at
BEFORE UPDATE ON public.loyalty_tiers
FOR EACH ROW
EXECUTE FUNCTION public.update_loyalty_updated_at_column();

CREATE TRIGGER update_user_loyalty_updated_at
BEFORE UPDATE ON public.user_loyalty
FOR EACH ROW
EXECUTE FUNCTION public.update_loyalty_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
BEFORE UPDATE ON public.rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_loyalty_updated_at_column();

-- Insert default loyalty tiers
INSERT INTO public.loyalty_tiers (name, minimum_points, benefits, color, display_order) VALUES
('Bronze', 0, '{"perks": ["1 point per $1 spent", "Birthday drink"], "multiplier": 1}', '#CD7F32', 1),
('Silver', 500, '{"perks": ["1.5 points per $1 spent", "Birthday drink", "Skip line occasionally"], "multiplier": 1.5}', '#C0C0C0', 2),
('Gold', 1500, '{"perks": ["2 points per $1 spent", "Birthday drink", "Skip line always", "Exclusive events"], "multiplier": 2}', '#FFD700', 3),
('VIP', 5000, '{"perks": ["3 points per $1 spent", "Birthday drink", "Skip line always", "Exclusive events", "Personal concierge", "Private events"], "multiplier": 3}', '#8A2BE2', 4);

-- Insert sample rewards
INSERT INTO public.rewards (name, description, points_cost, reward_type, reward_value) VALUES
('$5 Off Order', 'Get $5 off your next order', 500, 'discount', 5.00),
('$10 Off Order', 'Get $10 off your next order', 1000, 'discount', 10.00),
('Free Appetizer', 'Get a free appetizer of your choice', 750, 'free_item', NULL),
('Free Cocktail', 'Get a free house cocktail', 1200, 'free_item', NULL),
('$20 Cashback', 'Get $20 credited to your account', 2000, 'cashback', 20.00),
('VIP Table Upgrade', 'Free upgrade to VIP table (when available)', 3000, 'experience', NULL);

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create loyalty profile when user signs up
CREATE OR REPLACE FUNCTION public.create_user_loyalty_profile()
RETURNS TRIGGER AS $$
DECLARE
  bronze_tier_id UUID;
BEGIN
  -- Get Bronze tier ID
  SELECT id INTO bronze_tier_id FROM public.loyalty_tiers WHERE name = 'Bronze' LIMIT 1;
  
  -- Create loyalty profile
  INSERT INTO public.user_loyalty (
    user_id, 
    tier_id, 
    referral_code
  ) VALUES (
    NEW.id, 
    bronze_tier_id,
    public.generate_referral_code()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create loyalty profile for new users
CREATE TRIGGER on_user_created_loyalty
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_user_loyalty_profile();