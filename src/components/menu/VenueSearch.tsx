import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Venue {
  id: string;
  name: string;
  address: string;
  description: string | null;
  rating: number | null;
  review_count: number | null;
  price_range: number | null;
  latitude: number;
  longitude: number;
  hours_monday: string | null;
  hours_tuesday: string | null;
  hours_wednesday: string | null;
  hours_thursday: string | null;
  hours_friday: string | null;
  hours_saturday: string | null;
  hours_sunday: string | null;
  phone: string | null;
  city: {
    name: string;
    state: string;
  };
}

interface VenueSearchProps {
  onVenueSelect: (venueId: string, venueName: string) => void;
  selectedVenueId: string | null;
}

export const VenueSearch = ({ onVenueSelect, selectedVenueId }: VenueSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        searchNearbyVenues(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLoading(false);
        toast({
          title: "Location access denied",
          description: "Please enable location access or search manually",
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Search for venues near user's location
  const searchNearbyVenues = async (lat: number, lng: number) => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          city:cities(name, state)
        `)
        .eq('is_active', true);

      if (error) throw error;

      // Calculate distances and sort by proximity
      const venuesWithDistance = data.map(venue => ({
        ...venue,
        distance: calculateDistance(lat, lng, venue.latitude, venue.longitude)
      })).sort((a, b) => a.distance - b.distance);

      setVenues(venuesWithDistance.slice(0, 20)); // Show top 20 nearest venues
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast({
        title: "Error",
        description: "Failed to load nearby venues",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Search venues by text query
  const searchVenues = async (query: string) => {
    if (!query.trim()) {
      setVenues([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          city:cities(name, state)
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${query}%, address.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;

      setVenues(data || []);
    } catch (error) {
      console.error('Error searching venues:', error);
      toast({
        title: "Error",
        description: "Failed to search venues",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchVenues(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const getPriceRange = (priceRange: number | null) => {
    if (!priceRange) return '';
    return '$'.repeat(priceRange);
  };

  const getTodayHours = (venue: Venue) => {
    const today = new Date().getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = `hours_${days[today]}` as keyof Venue;
    return venue[todayKey] as string || 'Hours not available';
  };

  return (
    <div className="mb-8">
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Find Venues Near You</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search venues by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {loading ? 'Finding...' : 'Near Me'}
          </Button>
        </div>

        {venues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venues.map((venue) => (
              <Card 
                key={venue.id} 
                className={`bg-gray-800/50 border-gray-600 hover:border-purple-500/50 transition-colors cursor-pointer ${
                  selectedVenueId === venue.id ? 'border-purple-500 bg-purple-500/10' : ''
                }`}
                onClick={() => onVenueSelect(venue.id, venue.name)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-white">{venue.name}</h4>
                    {venue.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">{venue.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-3 h-3" />
                      <span>{venue.address}, {venue.city.name}, {venue.city.state}</span>
                    </div>
                    
                    {venue.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">{venue.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {venue.price_range && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-400" />
                            <span className="text-sm text-green-400">{getPriceRange(venue.price_range)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-400" />
                          <span className="text-xs text-blue-400">{getTodayHours(venue)}</span>
                        </div>
                      </div>
                      
                      {(venue as any).distance && (
                        <Badge variant="secondary" className="text-xs">
                          {(venue as any).distance.toFixed(1)} km
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {searchQuery && venues.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">No venues found for "{searchQuery}"</p>
          </div>
        )}

        {!searchQuery && venues.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">Search for venues or click "Near Me" to find venues nearby</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <p className="text-white">Loading venues...</p>
          </div>
        )}
      </div>
    </div>
  );
};