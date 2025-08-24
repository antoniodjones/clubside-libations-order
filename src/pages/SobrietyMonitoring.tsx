import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HomeIcon } from '@/components/HomeIcon';
import { SobrietyDashboard } from '@/components/sobriety/SobrietyDashboard';
import { useSearchParams } from 'react-router-dom';

const SobrietyMonitoring = () => {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('venue');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <HomeIcon />
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Sobriety Monitoring
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your alcohol consumption and stay safe with real-time BAC monitoring 
            and biometric analysis.
          </p>
        </div>

        <SobrietyDashboard venueId={venueId} />
      </main>

      <Footer />
    </div>
  );
};

export default SobrietyMonitoring;