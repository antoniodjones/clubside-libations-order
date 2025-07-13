import { useState, useEffect } from "react";
import { MapPin, Star, Phone, Clock, DollarSign, Filter, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  review_count: number;
  price_range: number;
  latitude: number;
  longitude: number;
  cities: {
    name: string;
    state: string;
  };
  venue_categories: {
    name: string;
  };
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

export function VenueSearch() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cities, setCities] = useState<Array<{id: string; name: string; state: string}>>([]);
  const [categories, setCategories] = useState<Array<{id: string; name: string}>>([]);
  const [maxDistance, setMaxDistance] = useState<number>(25); // miles
  const { toast } = useToast();

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast({
            title: "Location found!",
            description: "Showing venues near you",
          });
        },
        (error) => {
          console.error("Location error:", error);
          toast({
            title: "Location access denied",
            description: "Showing all venues",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Fetch venues from database
  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          cities (name, state),
          venue_categories (name)
        `)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      setVenues(data || []);
      setFilteredVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast({
        title: "Error loading venues",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch cities and categories
  const fetchFilters = async () => {
    try {
      const [citiesRes, categoriesRes] = await Promise.all([
        supabase.from('cities').select('id, name, state').order('name'),
        supabase.from('venue_categories').select('id, name').order('name')
      ]);

      if (citiesRes.error) throw citiesRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setCities(citiesRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  // Filter venues based on search criteria
  useEffect(() => {
    let filtered = venues;

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by city
    if (selectedCity !== "all") {
      filtered = filtered.filter(venue => venue.cities.name === selectedCity);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(venue => venue.venue_categories?.name === selectedCategory);
    }

    // Filter by distance if user location is available
    if (userLocation) {
      filtered = filtered.filter(venue => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          venue.latitude,
          venue.longitude
        );
        return distance <= maxDistance;
      });

      // Sort by distance
      filtered.sort((a, b) => {
        const distanceA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distanceB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distanceA - distanceB;
      });
    }

    setFilteredVenues(filtered);
  }, [venues, searchTerm, selectedCity, selectedCategory, userLocation, maxDistance]);

  useEffect(() => {
    fetchVenues();
    fetchFilters();
  }, []);

  const getPriceRangeDisplay = (range: number) => {
    return '$'.repeat(range);
  };

  const getDistanceDisplay = (venue: Venue) => {
    if (!userLocation) return null;
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      venue.latitude,
      venue.longitude
    );
    return `${distance.toFixed(1)} mi`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Find Venues</h1>
          <p className="text-muted-foreground">Discover the best bars and clubs near you</p>
        </div>
        <Button onClick={getUserLocation} variant="outline" className="gap-2">
          <MapPin className="w-4 h-4" />
          Use My Location
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.name}>
                {city.name}, {city.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={maxDistance.toString()} onValueChange={(value) => setMaxDistance(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Within 5 miles</SelectItem>
            <SelectItem value="10">Within 10 miles</SelectItem>
            <SelectItem value="25">Within 25 miles</SelectItem>
            <SelectItem value="50">Within 50 miles</SelectItem>
            <SelectItem value="100">Within 100 miles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Counter */}
      <div className="text-muted-foreground">
        Found {filteredVenues.length} venues
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <Card key={venue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{venue.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {venue.cities.name}, {venue.cities.state}
                  </p>
                </div>
                {getDistanceDisplay(venue) && (
                  <Badge variant="secondary" className="ml-2">
                    {getDistanceDisplay(venue)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {venue.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {venue.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm">
                {venue.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{venue.rating}</span>
                    <span className="text-muted-foreground">({venue.review_count})</span>
                  </div>
                )}
                
                {venue.price_range && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">
                      {getPriceRangeDisplay(venue.price_range)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {venue.venue_categories && (
                  <Badge variant="outline">
                    {venue.venue_categories.name}
                  </Badge>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{venue.address}</span>
                </div>
                {venue.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{venue.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVenues.length === 0 && !loading && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No venues found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or expanding your search area.
          </p>
        </div>
      )}
    </div>
  );
}