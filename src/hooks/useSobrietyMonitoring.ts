import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface BiometricData {
  heartRate?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  temperature?: number;
  oxygenSaturation?: number;
}

interface DrinkingSession {
  id: string;
  estimated_bac: number;
  total_drinks: number;
  total_alcohol_ml: number;
  status: string;
  started_at: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  venue_id: string;
}

interface SobrietyAlert {
  id: string;
  alert_type: string;
  estimated_bac: number;
  message: string;
  created_at: string;
  acknowledged_at?: string;
  intervention_taken?: string;
  session_id?: string;
  user_id: string;
}

export const useSobrietyMonitoring = (venueId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<DrinkingSession | null>(null);
  const [alerts, setAlerts] = useState<SobrietyAlert[]>([]);
  const [biometrics, setBiometrics] = useState<BiometricData>({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [userBiometrics, setUserBiometrics] = useState<any>(null);

  // Load user biometrics
  useEffect(() => {
    if (user) {
      loadUserBiometrics();
    }
  }, [user]);

  // Monitor active session
  useEffect(() => {
    if (user && isMonitoring) {
      const interval = setInterval(() => {
        checkCurrentSession();
        checkForAlerts();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, isMonitoring]);

  const loadUserBiometrics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_biometrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error loading user biometrics:', error);
        return;
      }

      setUserBiometrics(data);
    } catch (error) {
      console.error('Error loading user biometrics:', error);
    }
  };

  const saveUserBiometrics = async (biometricData: {
    weight_kg: number;
    height_cm: number;
    gender: 'male' | 'female' | 'other';
    body_fat_percentage?: number;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_biometrics')
        .upsert({
          user_id: user.id,
          ...biometricData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving user biometrics:', error);
        toast({
          title: "Error",
          description: "Failed to save biometric data",
          variant: "destructive",
        });
        return;
      }

      setUserBiometrics(data);
      toast({
        title: "Success",
        description: "Biometric data saved successfully",
      });
    } catch (error) {
      console.error('Error saving user biometrics:', error);
    }
  };

  const startDrinkingSession = async () => {
    if (!user || !venueId || !userBiometrics) {
      toast({
        title: "Setup Required",
        description: "Please complete your biometric profile first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('drinking_sessions')
        .insert({
          user_id: user.id,
          venue_id: venueId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting drinking session:', error);
        return;
      }

      setCurrentSession(data);
      setIsMonitoring(true);
      toast({
        title: "Session Started",
        description: "Sobriety monitoring is now active",
      });
    } catch (error) {
      console.error('Error starting drinking session:', error);
    }
  };

  const endDrinkingSession = async () => {
    if (!currentSession) return;

    try {
      const { error } = await supabase
        .from('drinking_sessions')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
        })
        .eq('id', currentSession.id);

      if (error) {
        console.error('Error ending drinking session:', error);
        return;
      }

      setCurrentSession(null);
      setIsMonitoring(false);
      toast({
        title: "Session Ended",
        description: "Sobriety monitoring stopped",
      });
    } catch (error) {
      console.error('Error ending drinking session:', error);
    }
  };

  const recordDrink = async (product: {
    id: string;
    alcohol_content: number;
    volume_ml: number;
  }, orderId?: string) => {
    if (!currentSession || !user) return;

    try {
      const alcoholMl = (product.alcohol_content / 100) * product.volume_ml;

      const { error } = await supabase
        .from('drink_records')
        .insert({
          user_id: user.id,
          session_id: currentSession.id,
          order_id: orderId,
          product_id: product.id,
          alcohol_content: product.alcohol_content,
          volume_ml: product.volume_ml,
          alcohol_ml: alcoholMl,
        });

      if (error) {
        console.error('Error recording drink:', error);
        return;
      }

      // Refresh session data
      checkCurrentSession();
    } catch (error) {
      console.error('Error recording drink:', error);
    }
  };

  const recordBiometrics = async (biometricData: BiometricData) => {
    if (!currentSession || !user) return;

    try {
      const { error } = await supabase
        .from('biometric_readings')
        .insert({
          user_id: user.id,
          session_id: currentSession.id,
          heart_rate: biometricData.heartRate,
          blood_pressure_systolic: biometricData.bloodPressure?.systolic,
          blood_pressure_diastolic: biometricData.bloodPressure?.diastolic,
          temperature_celsius: biometricData.temperature,
          oxygen_saturation: biometricData.oxygenSaturation,
          source: 'manual',
        });

      if (error) {
        console.error('Error recording biometrics:', error);
        return;
      }

      setBiometrics(biometricData);
    } catch (error) {
      console.error('Error recording biometrics:', error);
    }
  };

  const checkCurrentSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('drinking_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking current session:', error);
        return;
      }

      if (data) {
        setCurrentSession(data);
        setIsMonitoring(true);
      } else {
        setCurrentSession(null);
        setIsMonitoring(false);
      }
    } catch (error) {
      console.error('Error checking current session:', error);
    }
  };

  const checkForAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sobriety_alerts')
        .select('*')
        .eq('user_id', user.id)
        .is('acknowledged_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error checking for alerts:', error);
        return;
      }

      setAlerts(data || []);

      // Show toast for new alerts
      data?.forEach((alert) => {
        const isNewAlert = !alerts.find(a => a.id === alert.id);
        if (isNewAlert) {
          toast({
            title: getAlertTitle(alert.alert_type),
            description: alert.message,
            variant: alert.alert_type === 'danger' || alert.alert_type === 'emergency' ? 'destructive' : 'default',
          });
        }
      });
    } catch (error) {
      console.error('Error checking for alerts:', error);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('sobriety_alerts')
        .update({ acknowledged_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) {
        console.error('Error acknowledging alert:', error);
        return;
      }

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getAlertTitle = (alertType: string) => {
    switch (alertType) {
      case 'warning': return 'Drinking Warning';
      case 'limit_reached': return 'Limit Reached';
      case 'danger': return 'Danger Alert';
      case 'emergency': return 'Emergency Alert';
      default: return 'Sobriety Alert';
    }
  };

  const isSafeToOrder = useCallback(() => {
    if (!currentSession) return true;
    
    // Block orders if BAC is above 0.08 (legal limit in most places)
    return currentSession.estimated_bac < 0.08;
  }, [currentSession]);

  const getBAC = useCallback(() => {
    return currentSession?.estimated_bac || 0;
  }, [currentSession]);

  return {
    currentSession,
    alerts,
    biometrics,
    isMonitoring,
    userBiometrics,
    startDrinkingSession,
    endDrinkingSession,
    recordDrink,
    recordBiometrics,
    saveUserBiometrics,
    acknowledgeAlert,
    isSafeToOrder,
    getBAC,
    checkCurrentSession,
  };
};