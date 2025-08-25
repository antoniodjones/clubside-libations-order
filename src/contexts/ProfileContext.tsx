import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  birthday: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  gender: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => Promise<void>;
  refreshProfile: () => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    birthday: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    gender: ''
  });

  const loadProfileFromDatabase = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          mobile_number: data.mobile_number || '',
          birthday: data.birthday || '',
          address_line_1: data.address_line_1 || '',
          address_line_2: data.address_line_2 || '',
          city: data.city || '',
          state: data.state || '',
          postal_code: data.postal_code || '',
          gender: data.gender || ''
        });
      } else {
        // No profile exists, create one with user metadata
        await createInitialProfile();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to user metadata
      loadProfileFromUser();
    } finally {
      setIsLoading(false);
    }
  };

  const createInitialProfile = async () => {
    if (!user) return;

    const emailUsername = user.email?.split('@')[0] || '';
    let firstName = user.user_metadata?.first_name || '';
    let lastName = user.user_metadata?.last_name || '';
    
    // If names are empty, try to parse from email
    if (!firstName && emailUsername) {
      if (emailUsername.includes('.')) {
        const parts = emailUsername.split('.');
        firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        lastName = parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
      } else {
        firstName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
        lastName = '';
      }
    }

    const initialData = {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      email: user.email || '',
      mobile_number: user.user_metadata?.mobile_number || '',
      birthday: user.user_metadata?.birthdate || null,
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .insert(initialData);

      if (error) throw error;

      setProfile({
        first_name: firstName,
        last_name: lastName,
        email: user.email || '',
        mobile_number: user.user_metadata?.mobile_number || '',
        birthday: user.user_metadata?.birthdate || '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        gender: ''
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      loadProfileFromUser();
    }
  };

  const loadProfileFromUser = () => {
    if (user) {
      const emailUsername = user.email?.split('@')[0] || '';
      let firstName = user.user_metadata?.first_name || '';
      let lastName = user.user_metadata?.last_name || '';
      
      // If names are empty, try to parse from email
      if (!firstName && emailUsername) {
        if (emailUsername.includes('.')) {
          const parts = emailUsername.split('.');
          firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          lastName = parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
        } else {
          firstName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
          lastName = '';
        }
      }

      setProfile({
        first_name: firstName,
        last_name: lastName,
        email: user.email || '',
        mobile_number: user.user_metadata?.mobile_number || '',
        birthday: user.user_metadata?.birthdate || '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        gender: ''
      });
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update local state immediately for better UX
      setProfile(prev => ({ ...prev, ...updates }));

      // Prepare data for database (convert empty birthday to null)
      const updateData = { ...updates };
      if (updateData.birthday === '') {
        updateData.birthday = null as any;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });

      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
      // Revert local state on error
      await loadProfileFromDatabase();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = () => {
    loadProfileFromDatabase();
  };

  useEffect(() => {
    if (user) {
      loadProfileFromDatabase();
    }
  }, [user]);

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadProfileFromDatabase();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, refreshProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};