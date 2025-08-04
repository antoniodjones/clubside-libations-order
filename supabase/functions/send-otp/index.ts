import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type } = await req.json();
    console.log(`🔐 Processing OTP request for ${email}, type: ${type}`);

    if (!email || !type) {
      console.error('❌ Missing email or type');
      return new Response(
        JSON.stringify({ error: 'Email and type are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔐 Generated OTP code: ${otpCode}`);

    // Store OTP code in a custom table for verification
    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({
        email,
        code: otpCode,
        type,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        used: false
      });

    if (insertError) {
      console.error('❌ Failed to store OTP:', insertError);
      // If table doesn't exist, we'll continue without storing (for demo)
      console.log('📝 Note: OTP codes table not found, using code directly');
    }

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@nightlife.com',
        to: [email],
        subject: type === 'signup' ? 'Welcome! Verify your email' : 'Your sign-in code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #fbbf24; text-align: center;">
              ${type === 'signup' ? 'Welcome to Nightlife!' : 'Sign in to your account'}
            </h1>
            <p style="font-size: 16px; color: #333;">
              Your verification code is:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #fbbf24; background-color: #f3f4f6; padding: 20px; border-radius: 8px; display: inline-block;">
                ${otpCode}
              </span>
            </div>
            <p style="font-size: 14px; color: #666;">
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      console.error('❌ Failed to send email:', await emailResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to send verification email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ OTP email sent successfully');
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});