import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { UserProfile, UserRewards } from '@/types/user';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rewards, setRewards] = useState<UserRewards | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch rewards data
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (rewardsError && rewardsError.code !== 'PGRST116') {
        throw rewardsError;
      }

      // If no profile exists, create one from user metadata
      if (!profileData && user.user_metadata) {
        const newProfile = {
          user_id: user.id,
          first_name: user.user_metadata.first_name || '',
          last_name: user.user_metadata.last_name || '',
          email: user.email || '',
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        setProfile(createdProfile);
      } else {
        setProfile(profileData);
      }

      setRewards(rewardsData);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // Only depend on user.id, not the full user object

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.id) {
      return { error: { message: 'No user authenticated' } };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      return { error: null };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      return { error: err };
    }
  }, [user?.id]);

  // Only call fetchProfile when user.id changes, not on every user change
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
      setRewards(null);
      setLoading(false);
    }
  }, [user?.id, fetchProfile]);

  return {
    profile,
    rewards,
    loading,
    error,
    refreshProfile: fetchProfile,
    updateProfile,
  };
};