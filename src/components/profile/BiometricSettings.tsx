import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Scale, Ruler } from 'lucide-react';
import { BiometricSetup } from '@/components/sobriety/BiometricSetup';
import { useSobrietyMonitoring } from '@/hooks/useSobrietyMonitoring';
import { useToast } from '@/hooks/use-toast';

export const BiometricSettings = () => {
  const { toast } = useToast();
  const { userBiometrics, saveUserBiometrics } = useSobrietyMonitoring();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (data: {
    weight_kg: number;
    height_cm: number;
    gender: 'male' | 'female' | 'other';
    body_fat_percentage?: number;
  }) => {
    try {
      await saveUserBiometrics(data);
      setIsEditing(false);
      toast({
        title: "Biometric Data Saved",
        description: "Your biometric information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save biometric data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateBMI = () => {
    if (userBiometrics?.weight_kg && userBiometrics?.height_cm) {
      const heightInM = userBiometrics.height_cm / 100;
      return (userBiometrics.weight_kg / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-400' };
    return { text: 'Obese', color: 'text-red-400' };
  };

  if (isEditing || !userBiometrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Biometric Settings</h2>
            <p className="text-gray-400">Configure your biometric data for accurate BAC calculations</p>
          </div>
        </div>

        <BiometricSetup 
          onSave={handleSave}
          existingData={userBiometrics}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="h-8 w-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Biometric Settings</h2>
          <p className="text-gray-400">Your biometric data for sobriety monitoring</p>
        </div>
      </div>

      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5" />
            Current Biometric Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Scale className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Weight</p>
                <p className="text-white text-xl font-semibold">{userBiometrics.weight_kg} kg</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Ruler className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Height</p>
                <p className="text-white text-xl font-semibold">{userBiometrics.height_cm} cm</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <Heart className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Gender</p>
                <p className="text-white text-xl font-semibold capitalize">{userBiometrics.gender}</p>
              </div>
            </div>

            {userBiometrics.body_fat_percentage && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Activity className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-gray-400 text-sm">Body Fat</p>
                  <p className="text-white text-xl font-semibold">{userBiometrics.body_fat_percentage}%</p>
                </div>
              </div>
            )}
          </div>

          {bmi && (
            <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Body Mass Index (BMI)</p>
                  <p className="text-white text-2xl font-bold">{bmi}</p>
                </div>
                {bmiCategory && (
                  <Badge variant="outline" className={`${bmiCategory.color} border-current`}>
                    {bmiCategory.text}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-yellow-300 text-sm mb-2">
              <strong>Why we need this data:</strong>
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Accurate Blood Alcohol Content (BAC) calculations</li>
              <li>• Personalized safety recommendations</li>
              <li>• Better sobriety monitoring and alerts</li>
              <li>• Compliance with responsible service requirements</li>
            </ul>
          </div>

          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-purple-500 hover:bg-purple-600"
          >
            Update Biometric Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};