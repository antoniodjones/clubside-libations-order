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

  const signUp = async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string,
    additionalData?: {
      birthdate?: string;
      mobileNumber?: string;
      countryCode?: string;
      cityId?: string;
      venueId?: string;
      joinRewards?: boolean;
      referralCode?: string;
    }
  ) => {
    console.log('🔐 Attempting signup for:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          ...additionalData
        }
      }
    });

    console.log('🔐 Signup result:', { error, userId: data.user?.id });

    // If signup successful and we have a user, save additional profile data
    if (!error && data.user && additionalData) {
      console.log('🔐 Saving additional profile data:', additionalData);
      try {
        // Update profile with additional data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            birthday: additionalData.birthdate || null,
            mobile_number: additionalData.mobileNumber || null,
            country_code: additionalData.countryCode || null,
          })
          .eq('user_id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }

        // Create or update rewards profile if user opted in
        if (additionalData.joinRewards) {
          const { error: rewardsError } = await supabase
            .from('user_rewards')
            .upsert({
              user_id: data.user.id,
              birthday: additionalData.birthdate || null,
              referred_by: additionalData.referralCode || null,
              referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
            });

          if (rewardsError) {
            console.error('Rewards profile error:', rewardsError);
          }
        }
      } catch (err) {
        console.error('Error saving additional profile data:', err);
      }
    }

    return { error, data };
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting signin for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('🔐 Signin result:', { error });
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
    signUp,
    signIn,
    signOut,
  };
};