import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BiometricSetupProps {
  onSave: (data: {
    weight_kg: number;
    height_cm: number;
    gender: 'male' | 'female' | 'other';
    body_fat_percentage?: number;
  }) => void;
  existingData?: any;
  onCancel?: () => void;
}

export const BiometricSetup: React.FC<BiometricSetupProps> = ({ onSave, existingData, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    weight_kg: existingData?.weight_kg || '',
    height_cm: existingData?.height_cm || '',
    gender: existingData?.gender || '',
    body_fat_percentage: existingData?.body_fat_percentage || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.weight_kg || !formData.height_cm || !formData.gender) {
      toast({
        title: "Required Fields",
        description: "Please fill in weight, height, and gender",
        variant: "destructive",
      });
      return;
    }

    const data = {
      weight_kg: parseFloat(formData.weight_kg),
      height_cm: parseFloat(formData.height_cm),
      gender: formData.gender as 'male' | 'female' | 'other',
      body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : undefined,
    };

    onSave(data);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Biometric Setup</CardTitle>
        <CardDescription className="text-gray-400">
          Your biometric data is used to calculate accurate blood alcohol content (BAC) estimates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="weight" className="text-white">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight_kg}
              onChange={(e) => handleInputChange('weight_kg', e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
              placeholder="70.0"
            />
          </div>

          <div>
            <Label htmlFor="height" className="text-white">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={formData.height_cm}
              onChange={(e) => handleInputChange('height_cm', e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
              placeholder="175.0"
            />
          </div>

          <div>
            <Label htmlFor="gender" className="text-white">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="body_fat" className="text-white">Body Fat % (optional)</Label>
            <Input
              id="body_fat"
              type="number"
              step="0.1"
              value={formData.body_fat_percentage}
              onChange={(e) => handleInputChange('body_fat_percentage', e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
              placeholder="15.0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
              Save
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};