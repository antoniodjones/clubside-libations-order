import { AuthError, OTPVerificationResponse } from '@/types/auth';

// Standard response creator for edge functions
export const createSuccessResponse = (data: any) => ({
  status: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  },
  body: JSON.stringify({ success: true, ...data })
});

export const createErrorResponse = (error: string, errorCode?: string) => ({
  status: 200, // Use 200 to prevent Supabase client from throwing
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  },
  body: JSON.stringify({ success: false, error, errorCode })
});

// Parse edge function response consistently
export const parseEdgeFunctionResponse = (response: any): { error: AuthError | null } => {
  // If there's an error from the function call itself
  if (response.error) {
    return { error: response.error };
  }
  
  // Check if the function returned success: false (our error case)
  if (response.data?.success === false) {
    return { 
      error: {
        message: response.data.error,
        errorCode: response.data.errorCode
      }
    };
  }
  
  // Check for any other error in the response
  if (response.data?.error) {
    return { 
      error: {
        message: response.data.error,
        errorCode: response.data.errorCode
      }
    };
  }
  
  return { error: null };
};

// Timer utilities
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getExpirationTime = (minutes: number = 5): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};