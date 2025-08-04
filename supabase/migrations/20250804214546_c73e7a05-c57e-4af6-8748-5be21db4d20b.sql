-- Create table for storing OTP verification codes
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('signin', 'signup')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_otp_codes_email_code ON public.otp_codes(email, code);
CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- Enable Row Level Security
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Create policies (no user access needed as this is server-side only)
CREATE POLICY "Service role only access" ON public.otp_codes
FOR ALL USING (false);

-- Create function to clean up expired OTP codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM public.otp_codes 
  WHERE expires_at < now() - INTERVAL '1 hour';
END;
$function$;