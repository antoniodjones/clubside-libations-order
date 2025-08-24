-- Create sobriety monitoring tables

-- Table to track user's physical characteristics for BAC calculation
CREATE TABLE public.user_biometrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg NUMERIC NOT NULL,
  height_cm NUMERIC NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  body_fat_percentage NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Table to track drinking sessions
CREATE TABLE public.drinking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES public.venues(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  estimated_bac NUMERIC DEFAULT 0,
  total_drinks INTEGER DEFAULT 0,
  total_alcohol_ml NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table to track individual drinks consumed
CREATE TABLE public.drink_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.drinking_sessions(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  alcohol_content NUMERIC NOT NULL,
  volume_ml NUMERIC NOT NULL,
  alcohol_ml NUMERIC NOT NULL,
  consumed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  estimated_bac_after NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table to track biometric readings during drinking sessions
CREATE TABLE public.biometric_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.drinking_sessions(id) ON DELETE CASCADE,
  heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  temperature_celsius NUMERIC,
  oxygen_saturation NUMERIC,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'device', 'wearable')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table for sobriety alerts and interventions
CREATE TABLE public.sobriety_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.drinking_sessions(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('warning', 'limit_reached', 'danger', 'emergency')),
  estimated_bac NUMERIC NOT NULL,
  message TEXT NOT NULL,
  intervention_taken TEXT,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_biometrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drinking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drink_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sobriety_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_biometrics
CREATE POLICY "Users can manage their own biometrics" ON public.user_biometrics
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for drinking_sessions
CREATE POLICY "Users can manage their own drinking sessions" ON public.drinking_sessions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for drink_records
CREATE POLICY "Users can view their own drink records" ON public.drink_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own drink records" ON public.drink_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for biometric_readings
CREATE POLICY "Users can manage their own biometric readings" ON public.biometric_readings
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for sobriety_alerts
CREATE POLICY "Users can view their own sobriety alerts" ON public.sobriety_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can acknowledge their own alerts" ON public.sobriety_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create sobriety alerts" ON public.sobriety_alerts
  FOR INSERT WITH CHECK (true);

-- Create function to calculate BAC using Widmark formula
CREATE OR REPLACE FUNCTION calculate_bac(
  alcohol_grams NUMERIC,
  weight_kg NUMERIC,
  gender TEXT,
  hours_elapsed NUMERIC DEFAULT 0
) RETURNS NUMERIC AS $$
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
$$ LANGUAGE plpgsql;

-- Create function to update session BAC
CREATE OR REPLACE FUNCTION update_session_bac(session_id_param UUID)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to update BAC when drinks are added
CREATE OR REPLACE FUNCTION trigger_update_session_bac()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_session_bac(NEW.session_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bac_on_drink_insert
  AFTER INSERT ON public.drink_records
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_session_bac();

-- Create indexes for performance
CREATE INDEX idx_drinking_sessions_user_id ON public.drinking_sessions(user_id);
CREATE INDEX idx_drinking_sessions_status ON public.drinking_sessions(status);
CREATE INDEX idx_drink_records_session_id ON public.drink_records(session_id);
CREATE INDEX idx_drink_records_user_id ON public.drink_records(user_id);
CREATE INDEX idx_biometric_readings_session_id ON public.biometric_readings(session_id);
CREATE INDEX idx_sobriety_alerts_user_id ON public.sobriety_alerts(user_id);