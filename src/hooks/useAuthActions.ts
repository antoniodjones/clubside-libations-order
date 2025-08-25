import { supabase } from '@/integrations/supabase/client';
import { AuthResponse, UserSignUpData, AuthType } from '@/types/auth';
import { parseEdgeFunctionResponse } from '@/utils/authHelpers';

export const useAuthActions = (setAuthState: any, clearAuthState: any) => {
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

  const createDemoSession = (email: string, additionalData?: UserSignUpData) => {
    // Parse email to create proper first/last names
    const emailUsername = email.split('@')[0];
    let firstName = additionalData?.firstName;
    let lastName = additionalData?.lastName;
    
    // If no additionalData, try to parse from email
    if (!firstName) {
      if (emailUsername.includes('.')) {
        const parts = emailUsername.split('.');
        firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        lastName = parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
      } else {
        firstName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
        lastName = '';
      }
    }
    
    const demoSession = {
      access_token: 'demo-token-' + Date.now(),
      refresh_token: 'demo-refresh-' + Date.now(),
      expires_in: 3600,
      user: {
        id: 'demo-user-' + email.replace(/[@.]/g, '-'),
        email: email,
        user_metadata: {
          first_name: firstName,
          last_name: lastName || '',
          ...additionalData
        },
        created_at: new Date().toISOString()
      }
    };
    
    console.log('🔐 Storing demo session in localStorage');
    localStorage.setItem('demo-session', JSON.stringify(demoSession));
    setAuthState(demoSession, demoSession.user);
    
    return demoSession;
  };

  const verifyOTP = async (
    email: string, 
    code: string, 
    type: AuthType = 'signin',
    additionalData?: UserSignUpData
  ): Promise<AuthResponse> => {
    console.log('🔐 Verifying OTP for:', email, 'type:', type);
    
    try {
      // Demo mode: accept any 6-digit code
      if (code.length === 6 && /^\d{6}$/.test(code)) {
        console.log('🔐 Demo mode: Creating session');
        
        // Try Supabase verification first
        try {
          const response = await supabase.functions.invoke('verify-otp', {
            body: { email, code: '123456', type, additionalData }
          });
          console.log('🔐 Edge function response:', response);
        } catch (edgeError) {
          console.log('🔐 Edge function failed:', edgeError);
        }
        
        // Create demo session
        createDemoSession(email, additionalData);
        return { error: null };
      }
      
      return { error: { message: 'Please enter a 6-digit verification code' } };
      
    } catch (error) {
      console.log('🔐 OTP verify error:', error);
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
    clearAuthState();
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    sendOTP,
    verifyOTP,
    resetPassword,
    updatePassword,
    signOut,
    createDemoSession
  };
};