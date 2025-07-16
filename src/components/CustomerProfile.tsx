import React, { useState } from 'react';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { ProfileSummary } from '@/components/profile/ProfileSummary';
import { ManageProfile } from '@/components/profile/ManageProfile';
import { UpdatePassword } from '@/components/profile/UpdatePassword';
import { OrderHistory } from '@/components/profile/OrderHistory';
import { ManagePayments } from '@/components/profile/ManagePayments';
import { HomeIcon } from '@/components/HomeIcon';

export const CustomerProfile = () => {
  const [activeSection, setActiveSection] = useState('summary');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'summary':
        return <ProfileSummary />;
      case 'orders-history':
        return <OrderHistory />;
      case 'rewards':
        return <div className="text-white">Rewards detail page coming soon...</div>;
      case 'manage':
        return <ManageProfile />;
      case 'manage-payments':
        return <ManagePayments />;
      case 'password':
        return <UpdatePassword />;
      default:
        return <ProfileSummary />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <HomeIcon />
      
      <div className="flex">
        <ProfileSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <div className="flex-1 p-8">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};