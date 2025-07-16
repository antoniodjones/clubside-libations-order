import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star } from 'lucide-react';
import { Profile, RewardsData } from '@/types/profile';

interface ProfileHeaderProps {
  profile: Profile;
  rewards: RewardsData;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, rewards }) => {
  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
          <AvatarFallback className="text-2xl bg-purple-500/20 text-white">
            {profile.first_name[0]}{profile.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            {profile.first_name} {profile.last_name}
          </h1>
          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span>{rewards.tier} Member</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>{rewards.available_points} pts available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};