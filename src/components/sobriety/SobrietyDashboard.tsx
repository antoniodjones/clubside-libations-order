import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Play, 
  Square,
  Settings,
  Users
} from 'lucide-react';
import { useSobrietyMonitoring } from '@/hooks/useSobrietyMonitoring';
import { BiometricSetup } from './BiometricSetup';
import { BiometricInput } from './BiometricInput';

interface SobrietyDashboardProps {
  venueId?: string;
}

export const SobrietyDashboard: React.FC<SobrietyDashboardProps> = ({ venueId }) => {
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [showBiometricInput, setShowBiometricInput] = useState(false);
  
  const {
    currentSession,
    alerts,
    isMonitoring,
    userBiometrics,
    startDrinkingSession,
    endDrinkingSession,
    saveUserBiometrics,
    acknowledgeAlert,
    isSafeToOrder,
    getBAC,
  } = useSobrietyMonitoring(venueId);

  const bacLevel = getBAC();
  const safeToOrder = isSafeToOrder();

  const getBACStatus = () => {
    if (bacLevel === 0) return { color: 'green', text: 'Sober', level: 'safe' };
    if (bacLevel < 0.03) return { color: 'yellow', text: 'Light', level: 'caution' };
    if (bacLevel < 0.08) return { color: 'orange', text: 'Moderate', level: 'warning' };
    return { color: 'red', text: 'High', level: 'danger' };
  };

  const bacStatus = getBACStatus();

  const formatBAC = (bac: number) => {
    return (bac * 100).toFixed(3) + '%';
  };

  const getSessionDuration = () => {
    if (!currentSession) return '0h 0m';
    
    const start = new Date(currentSession.started_at);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (!userBiometrics && !showBiometricSetup) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sobriety Monitoring Setup
          </CardTitle>
          <CardDescription className="text-gray-400">
            Set up your biometric profile to enable accurate BAC monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="bg-purple-500/10 rounded-lg p-6">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">
                Sobriety monitoring uses your physical characteristics to calculate 
                accurate blood alcohol content estimates based on your drink consumption.
              </p>
              <Button 
                onClick={() => setShowBiometricSetup(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Setup Biometrics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showBiometricSetup) {
    return (
      <BiometricSetup
        onSave={(data) => {
          saveUserBiometrics(data);
          setShowBiometricSetup(false);
        }}
        existingData={userBiometrics}
        onCancel={() => setShowBiometricSetup(false)}
      />
    );
  }

  if (showBiometricInput) {
    return (
      <BiometricInput
        onSave={() => setShowBiometricInput(false)}
        onCancel={() => setShowBiometricInput(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert 
              key={alert.id} 
              className={`border-2 ${
                alert.alert_type === 'danger' || alert.alert_type === 'emergency' 
                  ? 'border-red-500 bg-red-500/10' 
                  : 'border-yellow-500 bg-yellow-500/10'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-white">
                {alert.alert_type === 'emergency' ? 'EMERGENCY ALERT' : 
                 alert.alert_type === 'danger' ? 'DANGER ALERT' :
                 alert.alert_type === 'limit_reached' ? 'LIMIT REACHED' : 'WARNING'}
              </AlertTitle>
              <AlertDescription className="text-gray-300 flex justify-between items-center">
                <span>{alert.message}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="ml-4"
                >
                  Acknowledge
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BAC Monitor */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Blood Alcohol Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold text-${bacStatus.color}-400`}>
                {formatBAC(bacLevel)}
              </div>
              <Badge 
                variant={bacStatus.level === 'safe' ? 'default' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                {bacStatus.text}
              </Badge>
              <Progress 
                value={Math.min(bacLevel * 1250, 100)} // Scale to 0.08 = 100%
                className="w-full h-3"
              />
              <p className="text-sm text-gray-400">
                Legal limit: 0.080%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Session Info */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentSession ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                    {isMonitoring ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{getSessionDuration()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Drinks:</span>
                  <span className="text-white">{currentSession.total_drinks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alcohol Consumed:</span>
                  <span className="text-white">{currentSession.total_alcohol_ml.toFixed(1)}ml</span>
                </div>
                <Button
                  onClick={endDrinkingSession}
                  variant="destructive"
                  className="w-full mt-4"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-400">No active monitoring session</p>
                <Button
                  onClick={startDrinkingSession}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!venueId}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Monitoring
                </Button>
                {!venueId && (
                  <p className="text-sm text-gray-500">
                    Select a venue to start monitoring
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Safety */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Order Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className={`text-4xl font-bold ${safeToOrder ? 'text-green-400' : 'text-red-400'}`}>
                {safeToOrder ? '✓' : '✗'}
              </div>
              <p className={`text-lg ${safeToOrder ? 'text-green-400' : 'text-red-400'}`}>
                {safeToOrder ? 'Safe to Order' : 'Order Blocked'}
              </p>
              <p className="text-sm text-gray-400">
                {safeToOrder 
                  ? 'Your current BAC level allows new orders' 
                  : 'Please wait for your BAC to decrease before ordering more alcohol'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => setShowBiometricInput(true)}
                variant="outline"
                className="w-full"
              >
                <Heart className="h-4 w-4 mr-2" />
                Record Biometrics
              </Button>
              <Button
                onClick={() => setShowBiometricSetup(true)}
                variant="outline"
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};