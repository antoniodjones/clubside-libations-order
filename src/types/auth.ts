export interface AuthError {
  message: string;
  errorCode?: string;
}

export interface AuthResponse {
  error: AuthError | null;
}

export interface OTPVerificationResponse extends AuthResponse {
  success?: boolean;
  user?: any;
}

export interface UserSignUpData {
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

export type AuthType = 'signup' | 'signin';