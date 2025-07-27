import { useState, useEffect } from 'react';

export const useAgeVerification = () => {
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const checkAgeVerification = () => {
    const verified = localStorage.getItem('age_verified');
    if (!verified) {
      setShowAgeVerification(true);
    } else {
      setIsAgeVerified(true);
    }
  };

  const handleAgeVerified = () => {
    setIsAgeVerified(true);
    setShowAgeVerification(false);
  };

  useEffect(() => {
    checkAgeVerification();
  }, []);

  return {
    showAgeVerification,
    isAgeVerified,
    handleAgeVerified
  };
};