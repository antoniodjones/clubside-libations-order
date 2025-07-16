import { OrderStatus } from '@/types/profile';

// Utility functions for profile-related operations
export const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'preparing':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'ready':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export const getOrderStatusText = (status: OrderStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const generateCardBrand = (cardNumber: string): string => {
  // Mock implementation - in real app, this would detect brand from card number
  const firstDigit = cardNumber.charAt(0);
  switch (firstDigit) {
    case '4':
      return 'Visa';
    case '5':
      return 'Mastercard';
    case '3':
      return 'American Express';
    default:
      return 'Unknown';
  }
};

export const maskCardNumber = (cardNumber: string): string => {
  return `•••• ${cardNumber.slice(-4)}`;
};

export const truncateList = <T>(list: T[], maxItems: number, showAll: boolean): T[] => {
  return showAll ? list : list.slice(0, maxItems);
};