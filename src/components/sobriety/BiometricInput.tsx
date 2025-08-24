import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSobrietyMonitoring } from '@/hooks/useSobrietyMonitoring';
import { Heart, Activity, Thermometer } from 'lucide-react';

interface BiometricInputProps {
  onSave: () => void;
  onCancel?: () => void;
}

export const BiometricInput: React.FC<BiometricInputProps> = ({ onSave, onCancel }) => {
  const { toast } = useToast();
  const { recordBiometrics } = useSobrietyMonitoring();
  const [formData, setFormData] = useState({
    heartRate: '',
    systolic: '',
    diastolic: '',
    temperature: '',
    oxygenSaturation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one field is filled
    const hasData = Object.values(formData).some(value => value.trim() !== '');
    if (!hasData) {
      toast({
        title: "No Data",
        description: "Please enter at least one biometric measurement",
        variant: "destructive",
      });
      return;
    }

    const biometricData: any = {};

    if (formData.heartRate) {
      biometricData.heartRate = parseInt(formData.heartRate);
    }

    if (formData.systolic && formData.diastolic) {
      biometricData.bloodPressure = {
        systolic: parseInt(formData.systolic),
        diastolic: parseInt(formData.diastolic),
      };
    }

    if (formData.temperature) {
      biometricData.temperature = parseFloat(formData.temperature);
    }

    if (formData.oxygenSaturation) {
      biometricData.oxygenSaturation = parseFloat(formData.oxygenSaturation);
    }

    await recordBiometrics(biometricData);
    
    toast({
      title: "Success",
      description: "Biometric data recorded successfully",
    });

    onSave();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Record Biometrics
        </CardTitle>
        <CardDescription className="text-gray-400">
          Enter your current biometric readings to help monitor your condition.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="heartRate" className="text-white flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Heart Rate (BPM)
            </Label>
            <Input
              id="heartRate"
              type="number"
              value={formData.heartRate}
              onChange={(e) => handleInputChange('heartRate', e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
              placeholder="72"
              min="40"
              max="200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="systolic" className="text-white">Systolic BP</Label>
              <Input
                id="systolic"
                type="number"
                value={formData.systolic}
                onChange={(e) => handleInputChange('systolic', e.target.value)}
                className="bg-black/20 border-purple-500/30 text-white"
                placeholder="120"
                min="70"
                max="250"
              />
            </div>
            <div>
              <Label htmlFor="diastolic" className="text-white">Diastolic BP</Label>
              <Input
                id="diastolic"
                type="number"
                value={formData.diastolic}
                onChange={(e) => handleInputChange('diastolic', e.target.value)}
                className="bg-black/20 border-purple-500/30 text-white"
                placeholder="80"
                min="40"
                max="150"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="temperature" className="text-white flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Temperature (°C)
            </Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => handleInputChange('temperature', e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
              placeholder="36.5"
              min="35"
              max="42"
            />
          </div>

          <div>
            <Label htmlFor="oxygenSaturation" className="text-white">
              Oxygen Saturation (%)
            </Label>
            <Input
              id="oxygenSaturation"
              type="number"
              step="0.1"
              value={formData.oxygenSaturation}
              onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
              placeholder="98.0"
              min="70"
              max="100"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
              Record
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-200">
            <strong>Note:</strong> Biometric readings help improve the accuracy of BAC calculations 
            and can detect potential health risks. All fields are optional.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};