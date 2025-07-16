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
    try {
      const { error } = await supabase.functions.invoke('send-otp', {
        body: { email, type }
      });
      
      console.log('🔐 OTP send result:', { error });
      return { error };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { error };
    }
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
      const { error } = await supabase.functions.invoke('verify-otp', {
        body: { email, code, type, additionalData }
      });
      
      console.log('🔐 OTP verify result:', { error });
      return { error };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { error };
    }
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
    signOut,
  };
};