-- Add bartender information to orders table
ALTER TABLE public.orders 
ADD COLUMN assigned_bartender TEXT,
ADD COLUMN bartender_notes TEXT;