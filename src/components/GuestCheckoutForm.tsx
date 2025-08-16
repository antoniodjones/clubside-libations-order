import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GuestCheckoutFormProps {
  onSubmit: (guestData: GuestData) => void;
  isLoading?: boolean;
}

export interface GuestData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const GuestCheckoutForm: React.FC<GuestCheckoutFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<GuestData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Partial<GuestData>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<GuestData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast({
        title: "Please fix the errors below",
        description: "All fields are required for guest checkout",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof GuestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <User className="h-6 w-6" />
          Guest Information
        </CardTitle>
        <p className="text-gray-400">
          Continue as guest - we'll send order updates to your email
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-white">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                placeholder="Enter your first name"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="text-white">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                placeholder="Enter your last name"
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-white flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                errors.email ? 'border-red-500' : ''
              }`}
              placeholder="your.email@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
            <p className="text-gray-400 text-sm mt-1">
              We'll send your order confirmation and updates here
            </p>
          </div>

          <div>
            <Label htmlFor="phone" className="text-white flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                errors.phone ? 'border-red-500' : ''
              }`}
              placeholder="(555) 123-4567"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue with Guest Checkout'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};