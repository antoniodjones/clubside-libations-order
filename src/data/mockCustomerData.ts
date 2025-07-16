import { CustomerData, PaymentMethod } from '@/types/profile';

export const mockCustomerData: CustomerData = {
  profile: {
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@email.com',
    mobile_number: '+1 (555) 123-4567',
    birthday: '1985-03-15',
    address_line_1: '123 Main Street',
    address_line_2: '',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94105',
    gender: 'Female'
  },
  rewards: {
    total_points: 2847,
    available_points: 1250,
    tier: 'Gold',
    tier_color: 'hsl(45, 100%, 50%)',
    lifetime_spent: 3456.78,
    anniversary_date: '2023-01-15'
  },
  recentOrders: [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-12',
      venue: 'Downtown Tavern',
      amount: 127.50,
      status: 'completed',
      items: [
        { name: 'Bourbon Old Fashioned', category: 'Cocktails', price: 16.00 },
        { name: 'Truffle Mac & Cheese', category: 'Premium Appetizers', price: 24.00 }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-08',
      venue: 'Sports Bar & Grill',
      amount: 89.25,
      status: 'completed',
      items: [
        { name: 'Cannabis Infused Gummies', category: 'Cannabis Products', price: 35.00 }
      ]
    }
  ],
  preferences: {
    favorite_categories: ['Cocktails', 'Premium Appetizers', 'Cannabis Products'],
    dietary_restrictions: ['Vegetarian Friendly'],
    preferred_venue: 'Downtown Lounge'
  },
  availableRewards: [
    { name: 'Free Appetizer', points_cost: 500, expires: '2024-02-15' },
    { name: '20% Off Next Order', points_cost: 750, expires: '2024-02-20' }
  ],
  aboutCustomer: {
    hobbies: ['Wine Tasting', 'Live Music', 'Cooking', 'Travel'],
    estimatedIncome: '$75,000 - $100,000',
    favoritePlaces: [
      { name: 'Downtown Lounge', city: 'San Francisco', state: 'CA', id: 'venue-1', address: '123 Market St, San Francisco, CA' },
      { name: 'Rooftop Bar & Grill', city: 'San Francisco', state: 'CA', id: 'venue-2', address: '456 Union St, San Francisco, CA' },
      { name: 'The Craft House', city: 'Oakland', state: 'CA', id: 'venue-3', address: '789 Broadway, Oakland, CA' },
      { name: 'Vintage Wine Bar', city: 'Berkeley', state: 'CA', id: 'venue-4', address: '321 Shattuck Ave, Berkeley, CA' },
      { name: 'Sunset Terrace', city: 'San Francisco', state: 'CA', id: 'venue-5', address: '654 Fillmore St, San Francisco, CA' },
      { name: 'Harbor View Lounge', city: 'Sausalito', state: 'CA', id: 'venue-6', address: '987 Bridgeway, Sausalito, CA' }
    ],
    favoriteStaffMembers: [
      { firstName: 'Marcus', lastName: 'Rodriguez', venueName: 'Downtown Lounge', venueAddress: '123 Market St, San Francisco, CA' },
      { firstName: 'Sofia', lastName: 'Chen', venueName: 'Rooftop Bar & Grill', venueAddress: '456 Union St, San Francisco, CA' },
      { firstName: 'Jake', lastName: 'Thompson', venueName: 'The Craft House', venueAddress: '789 Broadway, Oakland, CA' },
      { firstName: 'Maria', lastName: 'Gonzalez', venueName: 'Vintage Wine Bar', venueAddress: '321 Shattuck Ave, Berkeley, CA' },
      { firstName: 'David', lastName: 'Kim', venueName: 'Sunset Terrace', venueAddress: '654 Fillmore St, San Francisco, CA' },
      { firstName: 'Emma', lastName: 'Wilson', venueName: 'Harbor View Lounge', venueAddress: '987 Bridgeway, Sausalito, CA' }
    ],
    favoriteMenuItems: ['Bourbon Old Fashioned', 'Truffle Mac & Cheese', 'Craft Beer Flight'],
    venuesVisited: [
      { name: 'Downtown Lounge', address: '123 Market St, San Francisco, CA', id: 'venue-1', city: 'San Francisco', state: 'CA', lastVisit: '2024-01-12' },
      { name: 'Rooftop Bar & Grill', address: '456 Union St, San Francisco, CA', id: 'venue-2', city: 'San Francisco', state: 'CA', lastVisit: '2024-01-08' },
      { name: 'The Craft House', address: '789 Broadway, Oakland, CA', id: 'venue-3', city: 'Oakland', state: 'CA', lastVisit: '2024-01-05' },
      { name: 'Vintage Wine Bar', address: '321 Shattuck Ave, Berkeley, CA', id: 'venue-4', city: 'Berkeley', state: 'CA', lastVisit: '2023-12-28' },
      { name: 'Sunset Terrace', address: '654 Fillmore St, San Francisco, CA', id: 'venue-5', city: 'San Francisco', state: 'CA', lastVisit: '2023-12-22' },
      { name: 'Harbor View Lounge', address: '987 Bridgeway, Sausalito, CA', id: 'venue-6', city: 'Sausalito', state: 'CA', lastVisit: '2023-12-15' },
      { name: 'The Whiskey Room', address: '111 Pine St, San Francisco, CA', id: 'venue-7', city: 'San Francisco', state: 'CA', lastVisit: '2023-12-10' }
    ]
  }
};

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2025',
    isDefault: true,
    cardholderName: 'John Doe'
  },
  {
    id: '2',
    type: 'debit',
    brand: 'Mastercard',
    last4: '5555',
    expiryMonth: '08',
    expiryYear: '2026',
    isDefault: false,
    cardholderName: 'John Doe'
  }
];

export const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    venue: 'Downtown Tavern',
    amount: 45.50,
    status: 'completed' as const
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-12',
    venue: 'Sports Bar & Grill',
    amount: 67.25,
    status: 'completed' as const
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-10',
    venue: 'Rooftop Lounge',
    amount: 89.75,
    status: 'cancelled' as const
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-01-08',
    venue: 'Craft Beer House',
    amount: 32.00,
    status: 'completed' as const
  }
];