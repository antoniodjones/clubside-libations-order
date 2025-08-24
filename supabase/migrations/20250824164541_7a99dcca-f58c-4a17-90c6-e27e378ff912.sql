-- Fix security warnings by setting search_path for functions

-- Update the BAC calculation function with secure search path
CREATE OR REPLACE FUNCTION calculate_bac(
  alcohol_grams NUMERIC,
  weight_kg NUMERIC,
  gender TEXT,
  hours_elapsed NUMERIC DEFAULT 0
) RETURNS NUMERIC 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  body_water_ratio NUMERIC;
  bac NUMERIC;
BEGIN
  -- Body water ratio varies by gender
  body_water_ratio := CASE 
    WHEN gender = 'male' THEN 0.58
    WHEN gender = 'female' THEN 0.49
    ELSE 0.53 -- average for other
  END;
  
  -- Widmark formula: BAC = (alcohol_grams / (weight_kg * body_water_ratio * 1000)) - (0.015 * hours_elapsed)
  bac := (alcohol_grams / (weight_kg * body_water_ratio * 1000)) - (0.015 * hours_elapsed);
  
  -- BAC cannot be negative
  RETURN GREATEST(bac, 0);
END;
$$;

-- Update the session BAC update function with secure search path
CREATE OR REPLACE FUNCTION update_session_bac(session_id_param UUID)
RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_record RECORD;
  user_bio RECORD;
  total_alcohol_grams NUMERIC := 0;
  hours_elapsed NUMERIC;
  new_bac NUMERIC;
BEGIN
  -- Get session info
  SELECT * INTO session_record FROM public.drinking_sessions WHERE id = session_id_param;
  
  -- Get user biometrics
  SELECT * INTO user_bio FROM public.user_biometrics WHERE user_id = session_record.user_id;
  
  -- Calculate total alcohol consumed in grams (alcohol_ml * 0.789 g/ml)
  SELECT COALESCE(SUM(alcohol_ml * 0.789), 0) INTO total_alcohol_grams
  FROM public.drink_records 
  WHERE session_id = session_id_param;
  
  -- Calculate hours elapsed since session start
  hours_elapsed := EXTRACT(EPOCH FROM (now() - session_record.started_at)) / 3600;
  
  -- Calculate current BAC
  new_bac := calculate_bac(total_alcohol_grams, user_bio.weight_kg, user_bio.gender, hours_elapsed);
  
  -- Update session
  UPDATE public.drinking_sessions 
  SET 
    estimated_bac = new_bac,
    total_alcohol_ml = COALESCE((SELECT SUM(alcohol_ml) FROM public.drink_records WHERE session_id = session_id_param), 0),
    total_drinks = COALESCE((SELECT COUNT(*) FROM public.drink_records WHERE session_id = session_id_param), 0),
    updated_at = now()
  WHERE id = session_id_param;
END;
$$;

-- Update the trigger function with secure search path
CREATE OR REPLACE FUNCTION trigger_update_session_bac()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM update_session_bac(NEW.session_id);
  RETURN NEW;
END;
$$;