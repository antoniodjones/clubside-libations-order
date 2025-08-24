import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthResponse, UserSignUpData, AuthType } from '@/types/auth';
import { parseEdgeFunctionResponse } from '@/utils/authHelpers';

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

  const sendOTP = async (email: string, type: AuthType = 'signin'): Promise<AuthResponse> => {
    console.log('🔐 Sending OTP to:', email);
    try {
      const response = await supabase.functions.invoke('send-otp', {
        body: { email, type }
      });
      
      const result = parseEdgeFunctionResponse(response);
      console.log('🔐 OTP send result:', result);
      return result;
    } catch (error) {
      console.log('🔐 OTP send error:', error);
      return { error: error as any };
    }
  };

  const verifyOTP = async (
    email: string, 
    code: string, 
    type: AuthType = 'signin',
    additionalData?: UserSignUpData
  ): Promise<AuthResponse> => {
    console.log('🔐 Verifying OTP for:', email);
    
    try {
      // Use Supabase's built-in OTP verification instead of edge function
      console.log('🔐 Using Supabase native OTP verification');
      
      const { data: authData, error: authError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: type === 'signup' ? 'signup' : 'email'
      });
      
      console.log('🔐 Supabase OTP verification result:', { authData, authError });
      
      if (authError) {
        // If native verification fails, fall back to edge function
        console.log('🔐 Native OTP failed, trying edge function...');
        return await verifyOTPWithEdgeFunction(email, code, type, additionalData);
      }
      
      if (authData.session) {
        console.log('🔐 Native OTP verification successful, session created');
        return { error: null };
      }
      
      return { error: { message: 'Verification failed' } };
      
    } catch (error) {
      console.log('🔐 OTP verify error:', error);
      return { error: error as any };
    }
  };

  // Fallback to edge function method
  const verifyOTPWithEdgeFunction = async (
    email: string, 
    code: string, 
    type: AuthType,
    additionalData?: UserSignUpData
  ): Promise<AuthResponse> => {
    console.log('🔐 Falling back to edge function verification');
    
    try {
      const response = await supabase.functions.invoke('verify-otp', {
        body: { email, code, type, additionalData }
      });
      
      console.log('🔐 Raw edge function response:', response);
      
      // Check for successful response with session data
      if (response.data?.success && response.data?.session) {
        console.log('🔐 Setting session from OTP verification:', response.data.session);
        
        // Set the session in Supabase client
        const { data: sessionResult, error: sessionError } = await supabase.auth.setSession({
          access_token: response.data.session.access_token,
          refresh_token: response.data.session.refresh_token
        });
        
        console.log('🔐 setSession result:', { sessionResult, sessionError });
        
        if (sessionError) {
          console.error('🔐 Failed to set session:', sessionError);
          return { error: { message: 'Failed to establish session' } };
        }
        
        console.log('🔐 OTP verify result: success');
        return { error: null };
      }
      
      const result = parseEdgeFunctionResponse(response);
      console.log('🔐 OTP verify result:', result);
      return result;
    } catch (error) {
      console.log('🔐 Edge function OTP verify error:', error);
      return { error: error as any };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    console.log('🔐 Sending password reset to:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?tab=reset-password`,
    });
    
    console.log('🔐 Password reset result:', { error });
    return { error };
  };

  const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
    console.log('🔐 Updating password');
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    console.log('🔐 Password update result:', { error });
    return { error };
  };

  const signOut = async (): Promise<AuthResponse> => {
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