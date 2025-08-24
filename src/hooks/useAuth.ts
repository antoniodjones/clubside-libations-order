import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendOTP = async (email: string, type: 'signup' | 'signin' = 'signin') => {
    console.log('🔐 Sending OTP to:', email);
    const { error } = await supabase.functions.invoke('send-otp', {
      body: { email, type }
    }).catch(error => ({ error }));
    
    console.log('🔐 OTP send result:', { error });
    return { error };
  };

  const verifyOTP = async (
    email: string, 
    code: string, 
    type: 'signup' | 'signin' = 'signin',
    additionalData?: {
      firstName?: string;
      lastName?: string;
      birthdate?: string;
      mobileNumber?: string;
      countryCode?: string;
      cityId?: string;
      venueId?: string;
      joinRewards?: boolean;
      referralCode?: string;
    }
  ) => {
    console.log('🔐 Verifying OTP for:', email);
    
    try {
      const response = await supabase.functions.invoke('verify-otp', {
        body: { email, code, type, additionalData }
      });
      
      // If there's an error from the function call itself
      if (response.error) {
        console.log('🔐 OTP verify result:', { error: response.error });
        return { error: response.error };
      }
      
      // Check if the function returned success: false (our error case)
      if (response.data?.success === false) {
        console.log('🔐 OTP verify result:', { error: response.data });
        return { 
          error: {
            message: response.data.error,
            errorCode: response.data.errorCode
          }
        };
      }
      
      // Check for any other error in the response
      if (response.data?.error) {
        console.log('🔐 OTP verify result:', { error: response.data });
        return { 
          error: {
            message: response.data.error,
            errorCode: response.data.errorCode
          }
        };
      }
      
      console.log('🔐 OTP verify result:', { error: null });
      return { error: null };
      
    } catch (error) {
      console.log('🔐 OTP verify result:', { error });
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    console.log('🔐 Sending password reset to:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?tab=reset-password`,
    });
    
    console.log('🔐 Password reset result:', { error });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    console.log('🔐 Updating password');
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    console.log('🔐 Password update result:', { error });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    sendOTP,
    verifyOTP,
    resetPassword,
    updatePassword,
    signOut,
  };
};