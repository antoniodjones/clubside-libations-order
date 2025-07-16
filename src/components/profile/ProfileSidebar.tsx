import React from 'react';
import { User, Lock, Settings, BarChart3, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'summary', label: 'Profile Summary', icon: User },
  { id: 'orders-history', label: 'Orders History', icon: ShoppingBag },
  { id: 'rewards', label: 'Rewards', icon: BarChart3 },
  { id: 'manage', label: 'Manage Profile', icon: Settings },
  { id: 'manage-payments', label: 'Manage Payments', icon: CreditCard },
  { id: 'password', label: 'Update Password', icon: Lock },
];

export const ProfileSidebar = ({ activeSection, onSectionChange }: ProfileSidebarProps) => {
  return (
    <div className="w-64 bg-black/40 backdrop-blur-sm border-r border-purple-500/20 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
        <p className="text-gray-400">Manage your account settings</p>
      </div>
      
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start text-left ${
                isActive 
                  ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};