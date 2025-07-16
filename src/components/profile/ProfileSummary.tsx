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

export const ProfileSummary: React.FC = () => {
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [showAllVenues, setShowAllVenues] = useState(false);

  const maxDisplayItems = 5;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProfileHeader 
        profile={mockCustomerData.profile} 
        rewards={mockCustomerData.rewards} 
      />

      <div className="space-y-6">
        {/* Top Section - Profile and Loyalty */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileInfo profile={mockCustomerData.profile} />
          <RewardsStatusCard rewards={mockCustomerData.rewards} />
          <OrderHistoryCard orders={mockCustomerData.recentOrders} />
        </div>

        {/* Available Offers Section */}
        <AvailableOffersCard rewards={mockCustomerData.availableRewards} />

        {/* About Customer Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              About {mockCustomerData.profile.first_name}
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
                onToggle={() => setShowAllVenues(!showAllVenues)}
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
                onToggle={() => setShowAllStaff(!showAllStaff)}
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
              onToggle={() => setShowAllPlaces(!showAllPlaces)}
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
};