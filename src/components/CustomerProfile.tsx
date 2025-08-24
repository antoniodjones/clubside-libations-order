import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { ProfileSummary } from '@/components/profile/ProfileSummary';
import { ManageProfile } from '@/components/profile/ManageProfile';
import { UpdatePassword } from '@/components/profile/UpdatePassword';
import { OrderHistory } from '@/components/profile/OrderHistory';
import { ManagePayments } from '@/components/profile/ManagePayments';
import { RewardsSection } from '@/components/profile/RewardsSection';
import { BiometricSettings } from '@/components/profile/BiometricSettings';
import { HomeIcon } from '@/components/HomeIcon';
import { ProfileSectionProps } from '@/types/profile';

const SECTIONS = {
  SUMMARY: 'summary',
  ORDERS_HISTORY: 'orders-history',
  REWARDS: 'rewards',
  MANAGE: 'manage',
  BIOMETRICS: 'biometrics',
  MANAGE_PAYMENTS: 'manage-payments',
  PASSWORD: 'password'
} as const;

export const CustomerProfile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<string>(SECTIONS.SUMMARY);

  // Check URL parameters on component mount
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && Object.values(SECTIONS).includes(section as any)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  const renderActiveSection = useCallback(() => {
    switch (activeSection) {
      case SECTIONS.SUMMARY:
        return <ProfileSummary />;
      case SECTIONS.ORDERS_HISTORY:
        return <OrderHistory />;
      case SECTIONS.REWARDS:
        return <RewardsSection />;
      case SECTIONS.MANAGE:
        return <ManageProfile />;
      case SECTIONS.BIOMETRICS:
        return <BiometricSettings />;
      case SECTIONS.MANAGE_PAYMENTS:
        return <ManagePayments />;
      case SECTIONS.PASSWORD:
        return <UpdatePassword />;
      default:
        return <ProfileSummary />;
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <HomeIcon />
      
      <div className="flex">
        <ProfileSidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange} 
        />
        
        <div className="flex-1 p-8">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};