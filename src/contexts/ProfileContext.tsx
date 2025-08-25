import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
  updateProfile: (updates: Partial<ProfileData>) => void;
  refreshProfile: () => void;
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

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    
    // Update the demo session in localStorage
    const demoSession = localStorage.getItem('demo-session');
    if (demoSession) {
      try {
        const session = JSON.parse(demoSession);
        session.user.user_metadata = {
          ...session.user.user_metadata,
          first_name: updates.first_name || profile.first_name,
          last_name: updates.last_name || profile.last_name,
          mobile_number: updates.mobile_number || profile.mobile_number,
          birthdate: updates.birthday || profile.birthday
        };
        localStorage.setItem('demo-session', JSON.stringify(session));
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('profileUpdated'));
      } catch (error) {
        console.error('Error updating demo session:', error);
      }
    }
  };

  const refreshProfile = () => {
    loadProfileFromUser();
  };

  useEffect(() => {
    loadProfileFromUser();
  }, [user]);

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadProfileFromUser();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};