import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Gift, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { ProfileHeader } from '@/components/profile/common/ProfileHeader';
import { ProfileInfo } from '@/components/profile/sections/ProfileInfo';
import { RewardsStatusCard } from '@/components/profile/sections/RewardsStatusCard';
import { OrderHistoryCard } from '@/components/profile/sections/OrderHistoryCard';
import { AvailableOffersCard } from '@/components/profile/sections/AvailableOffersCard';
import { ExpandableSection } from '@/components/profile/common/ExpandableSection';
import { mockCustomerData } from '@/data/mockCustomerData';
import { truncateList } from '@/utils/profile';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/contexts/ProfileContext';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfileSummary: React.FC = React.memo(() => {
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [showAllVenues, setShowAllVenues] = useState(false);

  const maxDisplayItems = 5;

  // Use profile data from context with fallbacks
  const profileData = useMemo(() => {
    // If we have profile data from context, use it
    if (profile?.first_name || profile?.last_name || profile?.email) {
      return {
        ...mockCustomerData.profile,
        first_name: profile.first_name || 'Antonio',
        last_name: profile.last_name || 'djones',
        email: profile.email || user?.email || mockCustomerData.profile.email,
        mobile_number: profile.mobile_number || '',
        birthday: profile.birthday || '',
        address_line_1: profile.address_line_1 || '',
        city: profile.city || '',
        state: profile.state || '',
        postal_code: profile.postal_code || '',
        gender: profile.gender || ''
      };
    }
    
    // Fallback to mock data but with Antonio djones
    return {
      ...mockCustomerData.profile,
      first_name: 'Antonio',
      last_name: 'djones'
    };
  }, [profile, user?.email]);

  // Use mock rewards for now to prevent complexity
  const rewardsData = useMemo(() => mockCustomerData.rewards, []);

  const displayedPlaces = useMemo(() => 
    truncateList(mockCustomerData.aboutCustomer.favoritePlaces, maxDisplayItems, showAllPlaces),
    [showAllPlaces]
  );

  const displayedStaff = useMemo(() => 
    truncateList(mockCustomerData.aboutCustomer.favoriteStaffMembers, maxDisplayItems, showAllStaff),
    [showAllStaff]
  );

  const displayedVenues = useMemo(() => 
    truncateList(mockCustomerData.aboutCustomer.venuesVisited, maxDisplayItems, showAllVenues),
    [showAllVenues]
  );

  const togglePlaces = React.useCallback(() => setShowAllPlaces(prev => !prev), []);
  const toggleStaff = React.useCallback(() => setShowAllStaff(prev => !prev), []);
  const toggleVenues = React.useCallback(() => setShowAllVenues(prev => !prev), []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProfileHeader 
        profile={profileData} 
        rewards={rewardsData} 
      />

      <div className="space-y-6">
        {/* Top Section - Profile and Loyalty */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileInfo profile={profileData} />
          <RewardsStatusCard rewards={rewardsData} />
          <OrderHistoryCard orders={mockCustomerData.recentOrders} />
        </div>

        {/* Available Offers Section */}
        <AvailableOffersCard rewards={mockCustomerData.availableRewards} />

        {/* About Customer Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              About {profileData.first_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hobbies & Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Hobbies & Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockCustomerData.aboutCustomer.hobbies.map((hobby, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Favorite Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockCustomerData.aboutCustomer.favoriteMenuItems.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-yellow-400 border-yellow-400">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Venues and Staff */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpandableSection
                title="Venues Visited"
                totalCount={mockCustomerData.aboutCustomer.venuesVisited.length}
                isExpanded={showAllVenues}
                onToggle={toggleVenues}
                maxDisplayItems={maxDisplayItems}
              >
                <div className="space-y-2">
                  {displayedVenues.map((venue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-medium">{venue.name}</p>
                        <p className="text-gray-400 text-sm">{venue.address}</p>
                        {venue.lastVisit && (
                          <p className="text-gray-500 text-xs">Last visit: {new Date(venue.lastVisit).toLocaleDateString()}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ExpandableSection>

              <ExpandableSection
                title="Favorite Staff"
                totalCount={mockCustomerData.aboutCustomer.favoriteStaffMembers.length}
                isExpanded={showAllStaff}
                onToggle={toggleStaff}
                maxDisplayItems={maxDisplayItems}
              >
                <div className="space-y-2">
                  {displayedStaff.map((staff, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-medium">{staff.firstName} {staff.lastName}</p>
                        <p className="text-gray-400 text-sm">{staff.venueName}</p>
                        <p className="text-gray-500 text-xs">{staff.venueAddress}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ExpandableSection>
            </div>

            {/* Favorite Places */}
            <ExpandableSection
              title="Favorite Places"
              totalCount={mockCustomerData.aboutCustomer.favoritePlaces.length}
              isExpanded={showAllPlaces}
              onToggle={togglePlaces}
              maxDisplayItems={maxDisplayItems}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedPlaces.map((place, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex-1">
                      <p className="text-white font-medium">{place.name}</p>
                      <p className="text-gray-400 text-sm">{place.city}, {place.state}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ExpandableSection>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

ProfileSummary.displayName = 'ProfileSummary';