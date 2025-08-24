import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { useSobrietyMonitoring } from '@/hooks/useSobrietyMonitoring';

interface SobrietyCheckoutWrapperProps {
  children: React.ReactNode;
  venueId: string;
  cart: any[];
  onOrderComplete?: (orderData: any) => void;
}

export const SobrietyCheckoutWrapper: React.FC<SobrietyCheckoutWrapperProps> = ({
  children,
  venueId,
  cart,
  onOrderComplete,
}) => {
  const {
    currentSession,
    isSafeToOrder,
    getBAC,
    recordDrink,
    startDrinkingSession,
    userBiometrics,
  } = useSobrietyMonitoring(venueId);

  const safeToOrder = isSafeToOrder();
  const bacLevel = getBAC();
  const hasAlcoholicItems = cart.some(item => item.product.alcohol_content && item.product.alcohol_content > 0);

  const handleOrderComplete = async (orderData: any) => {
    // Record drinks in sobriety monitoring system
    if (currentSession && hasAlcoholicItems) {
      for (const item of cart) {
        if (item.product.alcohol_content && item.product.alcohol_content > 0) {
          for (let i = 0; i < item.quantity; i++) {
            await recordDrink({
              id: item.product.id,
              alcohol_content: item.product.alcohol_content,
              volume_ml: item.product.volume_ml || 330, // Default to 330ml if not specified
            }, orderData.id);
          }
        }
      }
    }

    if (onOrderComplete) {
      onOrderComplete(orderData);
    }
  };

  // If user hasn't set up biometrics and cart has alcohol, show setup prompt
  if (!userBiometrics && hasAlcoholicItems) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Sobriety Monitoring Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-yellow-500 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-yellow-200">Biometric Setup Required</AlertTitle>
              <AlertDescription className="text-yellow-100">
                Your cart contains alcoholic beverages. Please set up your biometric profile 
                to enable sobriety monitoring and ensure responsible drinking.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                Sobriety monitoring helps ensure your safety by:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Calculating your estimated Blood Alcohol Content (BAC)</li>
                <li>Preventing over-ordering when you've reached safe limits</li>
                <li>Tracking your drinking patterns for health insights</li>
                <li>Providing safety alerts and recommendations</li>
              </ul>
              
              <Button 
                onClick={() => window.location.href = '/profile?setup=biometrics'}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Set Up Biometric Profile
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                This helps us provide personalized safety features and is required for alcohol orders.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no active session and cart has alcohol, prompt to start monitoring
  if (!currentSession && hasAlcoholicItems && userBiometrics) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Start Sobriety Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-blue-500 bg-blue-500/10">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle className="text-blue-200">Safety Monitoring Available</AlertTitle>
              <AlertDescription className="text-blue-100">
                Start a monitoring session to track your consumption and ensure responsible drinking.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                Your cart contains alcoholic beverages. Starting a monitoring session will:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Track your BAC throughout the evening</li>
                <li>Prevent ordering when you've reached safe limits</li>
                <li>Provide safety recommendations</li>
                <li>Monitor your biometric data if available</li>
              </ul>
              
              <Button 
                onClick={startDrinkingSession}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Start Monitoring Session
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/menu'}
                className="w-full"
              >
                Back to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not safe to order alcoholic items, show blocking message
  if (!safeToOrder && hasAlcoholicItems) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-black/40 backdrop-blur-sm border-red-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Order Blocked for Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-red-500 bg-red-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-red-200">BAC Limit Reached</AlertTitle>
              <AlertDescription className="text-red-100">
                Your current estimated BAC is {(bacLevel * 100).toFixed(3)}%, which exceeds safe ordering limits.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                For your safety, we cannot process orders containing alcohol at this time.
              </p>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="text-red-200 font-semibold mb-2">Safety Recommendations:</h4>
                <ul className="list-disc list-inside text-red-100 space-y-1 text-sm">
                  <li>Wait for your BAC to decrease before ordering more alcohol</li>
                  <li>Consider ordering food or non-alcoholic beverages</li>
                  <li>Stay hydrated with water</li>
                  <li>Consider ending your drinking session for the evening</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => window.location.href = '/menu?category=food'}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Order Food Instead
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/menu'}
                  className="flex-1"
                >
                  Back to Menu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show safety status for orders with alcohol
  if (hasAlcoholicItems && currentSession) {
    return (
      <div className="space-y-6">
        <Card className="bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-semibold">Order Approved</p>
                  <p className="text-sm text-gray-400">
                    Current BAC: {(bacLevel * 100).toFixed(3)}% - Safe to order
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">Session Active</p>
                <p className="text-sm text-gray-400">
                  {currentSession.total_drinks} drinks tracked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {React.cloneElement(children as React.ReactElement, {
          onOrderComplete: handleOrderComplete,
        })}
      </div>
    );
  }

  // For orders without alcohol, pass through normally
  return <>{children}</>;
};