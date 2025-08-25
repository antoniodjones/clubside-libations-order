import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { calculateAge, formatDate } from '@/utils/profile';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  birthday: string;
  address_line_1: string;
  city: string;
  state: string;
}

interface ProfileInfoProps {
  profile: ProfileData;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = React.memo(({ profile }) => {
  const age = calculateAge(profile.birthday);
  const birthday = formatDate(profile.birthday);
  
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Mail className="h-4 w-4 text-gray-400" />
          <span>{profile.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{profile.mobile_number}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{profile.address_line_1}, {profile.city}, {profile.state}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>Age: {age} • Birthday: {birthday}</span>
        </div>
      </CardContent>
    </Card>
  );
});