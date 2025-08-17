-- Create abandoned carts table
CREATE TABLE public.abandoned_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  cart_data JSONB NOT NULL,
  venue_id UUID,
  total_amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  first_reminder_sent_at TIMESTAMP WITH TIME ZONE,
  second_reminder_sent_at TIMESTAMP WITH TIME ZONE,
  opted_out BOOLEAN NOT NULL DEFAULT false,
  opt_out_token TEXT UNIQUE,
  converted_to_order BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (no auth required for abandoned carts)
CREATE POLICY "Abandoned carts are publicly accessible"
ON public.abandoned_carts
FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_abandoned_carts_session_id ON public.abandoned_carts(session_id);
CREATE INDEX idx_abandoned_carts_email ON public.abandoned_carts(guest_email);
CREATE INDEX idx_abandoned_carts_created_at ON public.abandoned_carts(created_at);
CREATE INDEX idx_abandoned_carts_opt_out_token ON public.abandoned_carts(opt_out_token);

-- Create trigger for updating timestamps
CREATE TRIGGER update_abandoned_carts_updated_at
BEFORE UPDATE ON public.abandoned_carts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate opt-out tokens
CREATE OR REPLACE FUNCTION generate_opt_out_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;