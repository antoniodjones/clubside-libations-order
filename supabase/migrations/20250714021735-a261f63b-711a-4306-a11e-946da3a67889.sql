-- Add fine print and allergy information fields to products table
ALTER TABLE public.products 
ADD COLUMN fine_print TEXT,
ADD COLUMN allergy_information TEXT;