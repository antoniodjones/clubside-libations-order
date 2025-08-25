import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  customer_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number?: string;
  birthday?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  gender?: string;
  country_code?: string;
  home_phone?: string;
  work_phone?: string;
  external_id?: string;
  id_document_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRewards {
  id: string;
  user_id: string;
  total_points: number;
  available_points: number;
  reward_tier_id?: string;
  lifetime_spent: number;
  referred_by?: string;
  birthday?: string;
  anniversary_date?: string;
  social_sharing_enabled: boolean;
  referral_code?: string;
  created_at: string;
  updated_at: string;
}

export interface EnhancedUser extends SupabaseUser {
  profile?: UserProfile;
  rewards?: UserRewards;
}

export interface UserContextType {
  user: EnhancedUser | null;
  profile: UserProfile | null;
  rewards: UserRewards | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
}