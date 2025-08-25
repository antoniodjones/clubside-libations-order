import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface DemoSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const checkDemoSession = (): boolean => {
    const demoSession = localStorage.getItem('demo-session');
    if (demoSession) {
      try {
        const parsedSession = JSON.parse(demoSession) as DemoSession;
        console.log('🔐 Found demo session:', parsedSession.user?.email);
        setSession(parsedSession as any);
        setUser(parsedSession.user);
        setLoading(false);
        return true;
      } catch (error) {
        console.log('🔐 Invalid demo session, clearing...');
        localStorage.removeItem('demo-session');
      }
    }
    return false;
  };

  const clearAuthState = () => {
    localStorage.removeItem('demo-session');
    setSession(null);
    setUser(null);
  };

  const setAuthState = (session: Session | DemoSession, user: User) => {
    setSession(session as any);
    setUser(user);
  };

  useEffect(() => {
    let mounted = true;
    console.log('🔐 Setting up auth state listener...');
    
    // Check demo session first
    if (checkDemoSession()) {
      return () => { mounted = false; }; 
    }
    
    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        console.log('🔐 Auth state changed:', event, session?.user?.email || 'no user');
        if (!session) {
          checkDemoSession();
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      console.log('🔐 Initial session check:', session?.user?.email || 'no session');
      if (!session) {
        checkDemoSession();
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    checkDemoSession,
    clearAuthState,
    setAuthState
  };
};