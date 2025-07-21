// Phone number formatting utilities
export interface Country {
  code: string;
  flag: string;
  dialCode: string;
  format: string;
  name: string;
  dbCountry: string;
}

export const countries: Country[] = [
  { code: 'US', flag: '🇺🇸', dialCode: '+1', format: '(XXX) XXX-XXXX', name: 'United States', dbCountry: 'United States' },
  { code: 'CA', flag: '🇨🇦', dialCode: '+1', format: '(XXX) XXX-XXXX', name: 'Canada', dbCountry: 'Canada' },
  { code: 'GB', flag: '🇬🇧', dialCode: '+44', format: 'XXXX XXX XXX', name: 'United Kingdom', dbCountry: 'United Kingdom' },
  { code: 'AU', flag: '🇦🇺', dialCode: '+61', format: 'XXXX XXX XXX', name: 'Australia', dbCountry: 'Australia' },
  { code: 'DE', flag: '🇩🇪', dialCode: '+49', format: 'XXX XXXXXXX', name: 'Germany', dbCountry: 'Germany' },
  { code: 'FR', flag: '🇫🇷', dialCode: '+33', format: 'XX XX XX XX XX', name: 'France', dbCountry: 'France' },
  { code: 'IT', flag: '🇮🇹', dialCode: '+39', format: 'XXX XXX XXXX', name: 'Italy', dbCountry: 'Italy' },
  { code: 'ES', flag: '🇪🇸', dialCode: '+34', format: 'XXX XXX XXX', name: 'Spain', dbCountry: 'Spain' },
  { code: 'MX', flag: '🇲🇽', dialCode: '+52', format: 'XX XXXX XXXX', name: 'Mexico', dbCountry: 'Mexico' },
  { code: 'BR', flag: '🇧🇷', dialCode: '+55', format: '(XX) XXXXX-XXXX', name: 'Brazil', dbCountry: 'Brazil' },
];

export const formatMobileNumber = (value: string, countryCode: string): string => {
  const digits = value.replace(/\D/g, '');
  
  switch (countryCode) {
    case 'US':
    case 'CA':
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    
    case 'GB':
    case 'AU':
      if (digits.length <= 4) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    
    case 'DE':
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)} ${digits.slice(3, 10)}`;
    
    case 'FR':
      if (digits.length <= 2) return digits;
      if (digits.length <= 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
      if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
    
    default:
      return digits;
  }
};

export const formatPhoneWithCountryCode = (phone: string, countryCode: string): string => {
  const country = countries.find(c => c.code === countryCode);
  return country ? `${country.dialCode} ${phone}` : phone;
};