-- Remove automatic loyalty profile creation trigger
DROP TRIGGER IF EXISTS on_user_created_loyalty ON auth.users;

-- Drop the automatic loyalty profile creation function
DROP FUNCTION IF EXISTS public.create_user_loyalty_profile();