-- Insert sample venues for major US cities
-- First, let's get city and category IDs for reference
WITH city_data AS (
  SELECT id, name, state, latitude, longitude FROM cities
),
category_data AS (
  SELECT id, name FROM venue_categories
)

-- Insert venues for New York
INSERT INTO public.venues (
  name, description, address, city_id, latitude, longitude, 
  phone, rating, review_count, price_range, category_id,
  hours_friday, hours_saturday
) VALUES 
-- New York Bars
((SELECT id FROM city_data WHERE name = 'New York'), 'The Dead Rabbit', 'Award-winning Irish bar with craft cocktails and tapas', '30 Water St', 40.7040, -74.0114, '(646) 422-7906', 4.5, 2847, 3, (SELECT id FROM category_data WHERE name = 'Bar'), '5:00 PM - 2:00 AM', '5:00 PM - 2:00 AM'),
((SELECT id FROM city_data WHERE name = 'New York'), 'Employees Only', 'Upscale cocktail bar with a speakeasy vibe', '510 Hudson St', 40.7340, -74.0065, '(212) 242-3021', 4.4, 1923, 3, (SELECT id FROM category_data WHERE name = 'Bar'), '6:00 PM - 2:00 AM', '6:00 PM - 2:00 AM'),
((SELECT id FROM city_data WHERE name = 'New York'), 'Death & Co', 'Innovative cocktails in a dark, intimate setting', '433 E 6th St', 40.7252, -73.9832, '(212) 388-0882', 4.3, 1654, 3, (SELECT id FROM category_data WHERE name = 'Lounge'), '6:00 PM - 2:00 AM', '6:00 PM - 2:00 AM'),

-- New York Clubs  
((SELECT id FROM city_data WHERE name = 'New York'), 'Marquee', 'Premier nightclub with top DJs and VIP service', '289 10th Ave', 40.7505, -74.0014, '(646) 473-0202', 4.2, 2156, 4, (SELECT id FROM category_data WHERE name = 'Club'), '10:00 PM - 4:00 AM', '10:00 PM - 4:00 AM'),
((SELECT id FROM city_data WHERE name = 'New York'), 'House of Yes', 'Artistic nightclub known for performances and parties', '2 Wyckoff Ave', 40.7056, -73.9242, '(929) 726-8262', 4.1, 1876, 3, (SELECT id FROM category_data WHERE name = 'Club'), '9:00 PM - 4:00 AM', '9:00 PM - 4:00 AM');

-- Insert venues for Los Angeles
WITH la_city AS (SELECT id FROM city_data WHERE name = 'Los Angeles')
INSERT INTO public.venues (
  name, description, address, city_id, latitude, longitude, 
  phone, rating, review_count, price_range, category_id,
  hours_friday, hours_saturday
) VALUES 
('The Edison', 'Industrial-themed cocktail lounge in downtown LA', '108 W 2nd St', (SELECT id FROM la_city), 34.0522, -118.2500, '(213) 613-0000', 4.2, 1654, 3, (SELECT id FROM category_data WHERE name = 'Lounge'), '6:00 PM - 2:00 AM', '6:00 PM - 2:00 AM'),
('Avalon Hollywood', 'Historic nightclub with multiple dance floors', '1735 Vine St', (SELECT id FROM la_city), 34.1021, -118.3267, '(323) 462-8900', 4.0, 2341, 3, (SELECT id FROM category_data WHERE name = 'Club'), '9:00 PM - 3:00 AM', '9:00 PM - 3:00 AM'),
('Rooftop at The Standard', 'Stylish rooftop bar with city views', '550 S Flower St', (SELECT id FROM la_city), 34.0478, -118.2583, '(213) 892-8080', 4.3, 1876, 4, (SELECT id FROM category_data WHERE name = 'Rooftop'), '6:00 PM - 2:00 AM', '6:00 PM - 2:00 AM');

-- Insert venues for Miami
WITH miami_city AS (SELECT id FROM city_data WHERE name = 'Miami')
INSERT INTO public.venues (
  name, description, address, city_id, latitude, longitude, 
  phone, rating, review_count, price_range, category_id,
  hours_friday, hours_saturday
) VALUES 
('LIV', 'Ultra-premium nightclub at Fontainebleau', '4441 Collins Ave', (SELECT id FROM miami_city), 25.8209, -80.1234, '(305) 674-4680', 4.1, 3124, 4, (SELECT id FROM category_data WHERE name = 'Club'), '11:00 PM - 5:00 AM', '11:00 PM - 5:00 AM'),
('Ball & Chain', 'Historic Cuban bar with live salsa music', '1513 SW 8th St', (SELECT id FROM miami_city), 25.7654, -80.2156, '(305) 643-7820', 4.4, 2156, 2, (SELECT id FROM category_data WHERE name = 'Live Music'), '8:00 PM - 3:00 AM', '8:00 PM - 3:00 AM'),
('Sugar', 'Asian-inspired rooftop bar with harbor views', '788 Brickell Plaza', (SELECT id FROM miami_city), 25.7654, -80.1897, '(786) 805-9593', 4.2, 1987, 4, (SELECT id FROM category_data WHERE name = 'Rooftop'), '6:00 PM - 2:00 AM', '6:00 PM - 2:00 AM');

-- Insert venues for Chicago
WITH chicago_city AS (SELECT id FROM city_data WHERE name = 'Chicago')
INSERT INTO public.venues (
  name, description, address, city_id, latitude, longitude, 
  phone, rating, review_count, price_range, category_id,
  hours_friday, hours_saturday
) VALUES 
('Green Mill Cocktail Lounge', 'Historic jazz club with live music nightly', '4802 N Broadway', (SELECT id FROM chicago_city), 41.9692, -87.6595, '(773) 878-5552', 4.5, 2234, 2, (SELECT id FROM category_data WHERE name = 'Live Music'), '8:00 PM - 2:00 AM', '8:00 PM - 3:00 AM'),
('Cindy''s Rooftop', 'Sophisticated rooftop with skyline views', '12 S Michigan Ave', (SELECT id FROM chicago_city), 41.8818, -87.6243, '(312) 792-3502', 4.3, 1876, 3, (SELECT id FROM category_data WHERE name = 'Rooftop'), '4:00 PM - 1:00 AM', '11:00 AM - 2:00 AM'),
('Sound-Bar', 'Multi-level nightclub with electronic music', '226 W Ontario St', (SELECT id FROM chicago_city), 41.8936, -87.6351, '(312) 787-4480', 3.9, 1654, 3, (SELECT id FROM category_data WHERE name = 'Club'), '10:00 PM - 4:00 AM', '10:00 PM - 5:00 AM');

-- Insert venues for Las Vegas
WITH vegas_city AS (SELECT id FROM city_data WHERE name = 'Las Vegas')
INSERT INTO public.venues (
  name, description, address, city_id, latitude, longitude, 
  phone, rating, review_count, price_range, category_id,
  hours_friday, hours_saturday
) VALUES 
('Omnia', 'Ultra-modern nightclub at Caesars Palace', '3570 Las Vegas Blvd S', (SELECT id FROM vegas_city), 36.1162, -115.1745, '(702) 785-6200', 4.0, 2876, 4, (SELECT id FROM category_data WHERE name = 'Club'), '10:30 PM - 4:00 AM', '10:30 PM - 4:00 AM'),  
('The Chandelier', 'Three-story bar inside crystal chandelier', '3708 Las Vegas Blvd S', (SELECT id FROM vegas_city), 36.1146, -115.1723, '(877) 230-2742', 4.2, 2341, 3, (SELECT id FROM category_data WHERE name = 'Lounge'), '24 Hours', '24 Hours'),
('Fremont Street Experience', 'Historic downtown entertainment district', '425 Fremont St', (SELECT id FROM vegas_city), 36.1699, -115.1416, '(702) 678-5600', 4.1, 3456, 2, (SELECT id FROM category_data WHERE name = 'Bar'), '24 Hours', '24 Hours');