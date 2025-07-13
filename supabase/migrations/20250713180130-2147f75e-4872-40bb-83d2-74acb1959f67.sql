-- Create cities table for venue locations
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, state, country)
);

-- Create venue categories table
CREATE TABLE public.venue_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create venues table
CREATE TABLE public.venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone TEXT,
  website TEXT,
  rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  price_range INTEGER CHECK (price_range >= 1 AND price_range <= 4), -- 1=$ to 4=$$$$
  category_id UUID REFERENCES public.venue_categories(id) ON DELETE SET NULL,
  hours_monday TEXT,
  hours_tuesday TEXT,
  hours_wednesday TEXT,
  hours_thursday TEXT,
  hours_friday TEXT,
  hours_saturday TEXT,
  hours_sunday TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public venues - everyone can read)
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Cities are publicly readable" 
ON public.cities FOR SELECT 
USING (true);

CREATE POLICY "Venue categories are publicly readable" 
ON public.venue_categories FOR SELECT 
USING (true);

CREATE POLICY "Active venues are publicly readable" 
ON public.venues FOR SELECT 
USING (is_active = true);

-- Create trigger for venues updated_at
CREATE TRIGGER update_venues_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert venue categories
INSERT INTO public.venue_categories (name, description) VALUES
('Bar', 'Traditional bars and pubs'),
('Club', 'Nightclubs and dance venues'),
('Sports Bar', 'Sports-focused bars with TVs and games'),
('Lounge', 'Upscale lounges and cocktail bars'),
('Rooftop', 'Rooftop bars and venues'),
('Live Music', 'Venues featuring live music performances');

-- Insert major US cities with coordinates
INSERT INTO public.cities (name, state, latitude, longitude) VALUES
('New York', 'NY', 40.7128, -74.0060),
('Chicago', 'IL', 41.8781, -87.6298),
('Miami', 'FL', 25.7617, -80.1918),
('Atlanta', 'GA', 33.7490, -84.3880),
('Boston', 'MA', 42.3601, -71.0589),
('San Francisco', 'CA', 37.7749, -122.4194),
('Dallas', 'TX', 32.7767, -96.7970),
('Houston', 'TX', 29.7604, -95.3698),
('New Orleans', 'LA', 29.9511, -90.0715),
('Las Vegas', 'NV', 36.1699, -115.1398),
('Seattle', 'WA', 47.6062, -122.3321),
('Los Angeles', 'CA', 34.0522, -118.2437),
('Washington', 'DC', 38.9072, -77.0369),
('Philadelphia', 'PA', 39.9526, -75.1652);