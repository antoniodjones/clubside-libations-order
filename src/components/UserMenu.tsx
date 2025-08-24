import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Award, ShoppingBag, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserMenuProps {
  onLoginClick?: () => void;
}

export const UserMenu = ({ onLoginClick }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "See you next time!",
      });
      navigate('/');
    }
  };

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const email = user.email;
    const name = user.user_metadata?.first_name && user.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : email;
    
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Show profile icon when not signed in
  if (!user) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onLoginClick || (() => navigate('/auth'))}
        className="text-white hover:bg-purple-400/10 p-2"
      >
        <User className="w-6 h-6" />
      </Button>
    );
  }

  // Show avatar with dropdown when signed in
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full p-0 hover:bg-purple-400/10"
        >
          <Avatar className="h-9 w-9 border-2 border-purple-400/30">
            <AvatarImage 
              src={user.user_metadata?.avatar_url} 
              alt={user.email || 'User'} 
            />
            <AvatarFallback className="bg-purple-600 text-white font-semibold text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-gray-900 border border-purple-400/20 text-white z-50" 
        align="end"
        side="bottom"
        sideOffset={5}
      >
        <div className="px-3 py-2 border-b border-purple-400/20">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={user.email || 'User'} 
              />
              <AvatarFallback className="bg-purple-600 text-white text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-white">
                {user.user_metadata?.first_name && user.user_metadata?.last_name
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                  : user.email?.split('@')[0]
                }
              </p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
        
        <div className="py-1">
          <DropdownMenuItem 
            className="text-white hover:bg-purple-400/10 cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <Settings className="w-4 h-4 mr-3" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-white hover:bg-purple-400/10 cursor-pointer"
            onClick={() => navigate('/rewards')}
          >
            <Award className="w-4 h-4 mr-3" />
            Rewards
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-white hover:bg-purple-400/10 cursor-pointer"
            onClick={() => navigate('/track-order')}
          >
            <ShoppingBag className="w-4 h-4 mr-3" />
            Order History
          </DropdownMenuItem>
        </div>
        
        <DropdownMenuSeparator className="bg-purple-400/20" />
        
        <div className="py-1">
          <DropdownMenuItem 
            className="text-red-400 hover:bg-red-400/10 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};