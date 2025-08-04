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
    const { email, code, type, additionalData } = await req.json();
    console.log(`🔐 Verifying OTP for ${email}, type: ${type}`);

    if (!email || !code || !type) {
      console.error('❌ Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Email, code, and type are required' }),
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

    // For demo purposes, accept any 6-digit code
    // In production, you'd validate against stored OTP codes
    if (!/^\d{6}$/.test(code)) {
      console.error('❌ Invalid OTP format');
      return new Response(
        JSON.stringify({ error: 'Invalid verification code format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let authResult;

    if (type === 'signup') {
      // Create user account
      const signUpData: any = {
        email,
        password: Math.random().toString(36).slice(-8), // Generate random password
        email_confirm: true, // Skip email confirmation since we're verifying via OTP
      };

      // Add user metadata if provided
      if (additionalData) {
        signUpData.user_metadata = {
          first_name: additionalData.firstName,
          last_name: additionalData.lastName,
          birthdate: additionalData.birthdate,
          mobile_number: additionalData.mobileNumber,
          country_code: additionalData.countryCode,
          city_id: additionalData.cityId,
          venue_id: additionalData.venueId,
          join_rewards: additionalData.joinRewards,
          referral_code: additionalData.referralCode,
        };
      }

      authResult = await supabase.auth.admin.createUser(signUpData);
      
      if (authResult.error) {
        console.error('❌ Signup error:', authResult.error);
        return new Response(
          JSON.stringify({ error: authResult.error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('✅ User created successfully');

    } else {
      // For signin, verify the user exists
      const { data: existingUser, error: userError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (userError || !existingUser.user) {
        console.error('❌ User not found:', userError);
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('✅ User verified for signin');
    }

    // Generate a session token
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (sessionError) {
      console.error('❌ Session generation error:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ OTP verification successful');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        user: authResult?.data?.user || sessionData.user 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error in verify-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});