-- Add missing profile fields for user management
ALTER TABLE public.profiles 
ADD COLUMN gender TEXT,
ADD COLUMN address_line_1 TEXT,
ADD COLUMN address_line_2 TEXT,
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN postal_code TEXT,
ADD COLUMN home_phone TEXT,
ADD COLUMN work_phone TEXT;