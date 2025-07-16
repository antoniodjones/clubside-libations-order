import React from 'react';
import { Button } from '@/components/ui/button';
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-purple-400/30 text-white hover:bg-purple-400/10">
          <User className="w-4 h-4 mr-2" />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-gray-900 border border-purple-400/20 text-white" 
        align="end"
      >
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">{user.email}</div>
          <div className="text-gray-400 text-xs">Member Account</div>
        </div>
        <DropdownMenuSeparator className="bg-purple-400/20" />
        <DropdownMenuItem 
          className="text-white hover:bg-purple-400/10 cursor-pointer"
          onClick={() => navigate('/rewards')}
        >
          <Award className="w-4 h-4 mr-2" />
          Rewards
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-white hover:bg-purple-400/10 cursor-pointer"
          onClick={() => navigate('/track-order')}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Order History
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-white hover:bg-purple-400/10 cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-purple-400/20" />
        <DropdownMenuItem 
          className="text-red-400 hover:bg-red-400/10 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};