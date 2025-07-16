// Shared types for profile-related components
export interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  birthday: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  gender: string;
}

export interface LoyaltyData {
  total_points: number;
  available_points: number;
  tier: string;
  tier_color: string;
  lifetime_spent: number;
  anniversary_date: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  venue: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

export interface OrderItem {
  name: string;
  category: string;
  price: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  cardholderName: string;
}

export interface Reward {
  name: string;
  points_cost: number;
  expires: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lastVisit?: string;
}

export interface StaffMember {
  firstName: string;
  lastName: string;
  venueName: string;
  venueAddress: string;
}

export interface CustomerPreferences {
  favorite_categories: string[];
  dietary_restrictions: string[];
  preferred_venue: string;
}

export interface CustomerData {
  profile: Profile;
  loyalty: LoyaltyData;
  recentOrders: OrderWithItems[];
  preferences: CustomerPreferences;
  rewards: Reward[];
  aboutCustomer: {
    hobbies: string[];
    estimatedIncome: string;
    favoritePlaces: Venue[];
    favoriteStaffMembers: StaffMember[];
    favoriteMenuItems: string[];
    venuesVisited: Venue[];
  };
}

export interface ProfileSectionProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export type OrderStatus = Order['status'];