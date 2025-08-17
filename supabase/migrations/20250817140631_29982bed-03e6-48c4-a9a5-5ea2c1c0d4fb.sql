-- Fix the generate_opt_out_token function with proper search_path
CREATE OR REPLACE FUNCTION generate_opt_out_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;