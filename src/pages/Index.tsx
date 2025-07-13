
import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Star, Wine, Utensils, Leaf, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Venue {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  price_range: number | null;
  latitude: number;
  longitude: number;
  cities: {
    name: string;
    state: string;
    country: string;
  };
  venue_categories: {
    name: string;
  } | null;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

const categoryIcons = {
  alcohol: Wine,
  food: Utensils,
  cannabis: Leaf,
  merchandise: ShoppingBag,
} as const;

const categoryColors = {
  alcohol: 'category-alcohol',
  food: 'category-food', 
  cannabis: 'category-cannabis',
  merchandise: 'category-merchandise',
} as const;

const Index = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [cities, setCities] = useState<Array<{ id: string; name: string; state: string }>>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
    fetchFilters();
    getUserLocation();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [venues, searchTerm, selectedCity, selectedCategory, userLocation, maxDistance]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  };

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

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          cities (name, state, country),
          venue_categories (name)
        `)
        .eq('is_active', true);

      if (error) throw error;
      setVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [citiesResponse, categoriesResponse] = await Promise.all([
        supabase.from('cities').select('id, name, state'),
        supabase.from('venue_categories').select('id, name')
      ]);

      setCities(citiesResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const filterVenues = () => {
    let filtered = venues;

    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(venue => venue.cities.name === selectedCity);
    }

    if (selectedCategory) {
      filtered = filtered.filter(venue => venue.venue_categories?.name === selectedCategory);
    }

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
    }

    setFilteredVenues(filtered);
  };

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleVenueSelect = (venue: Venue) => {
    navigate('/menu', { state: { venue } });
  };

  const getPriceRangeDisplay = (range: number): string => {
    return '$'.repeat(range);
  };

  const getDistanceDisplay = (venue: Venue): string | null => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-hero font-bold tracking-tight">
                Discover Premium
                <span className="block text-primary">Venues & Experiences</span>
              </h1>
              <p className="text-hero-sm text-muted-foreground max-w-2xl mx-auto">
                Find the perfect spot for drinks, dining, and premium products in your area
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-card rounded-2xl p-8 shadow-hero max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search venues, locations, or experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg border-0 shadow-none bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/20"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-12 border-0 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select City" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Cities</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}, {city.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12 border-0 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Wine className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={maxDistance.toString()} onValueChange={(value) => setMaxDistance(Number(value))}>
                    <SelectTrigger className="h-12 border-0 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Within 5 miles</SelectItem>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="25">Within 25 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSearch} 
                  size="lg" 
                  className="w-full h-14 text-lg font-semibold"
                >
                  Find Venues
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      {!showResults && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4">
                Explore by Category
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover venues offering premium alcohol, food, cannabis, and merchandise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(categoryIcons).map(([category, Icon]) => (
                <Card 
                  key={category} 
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-card-enhanced bg-${categoryColors[category as keyof typeof categoryColors]} border-0`}
                  onClick={() => {
                    setSelectedCategory(category);
                    handleSearch();
                  }}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-${categoryColors[category as keyof typeof categoryColors]}-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-8 w-8 text-${categoryColors[category as keyof typeof categoryColors]}-foreground`} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 text-${categoryColors[category as keyof typeof categoryColors]}-foreground capitalize`}>
                      {category}
                    </h3>
                    <p className={`text-${categoryColors[category as keyof typeof categoryColors]}-foreground/70`}>
                      Premium {category} experiences
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {showResults && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">
                {filteredVenues.length} venues found
              </h2>
              <p className="text-muted-foreground">
                {searchTerm && `Results for "${searchTerm}"`}
                {selectedCity && ` in ${selectedCity}`}
                {selectedCategory && ` • ${selectedCategory}`}
              </p>
            </div>

            {filteredVenues.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-4">No venues found</h3>
                <p className="text-muted-foreground mb-8">
                  Try adjusting your search criteria or expanding your search area.
                </p>
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  Back to Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues.map((venue) => (
                  <Card 
                    key={venue.id} 
                    className="group cursor-pointer transition-all duration-300 hover:shadow-card-enhanced"
                    onClick={() => handleVenueSelect(venue)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            {venue.name}
                          </h3>
                          {venue.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{venue.rating}</span>
                            </div>
                          )}
                        </div>

                        {venue.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {venue.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{venue.cities.name}, {venue.cities.state}</span>
                          {getDistanceDisplay(venue) && (
                            <>
                              <span>•</span>
                              <span>{getDistanceDisplay(venue)}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {venue.venue_categories && (
                              <Badge variant="secondary" className="text-xs">
                                {venue.venue_categories.name}
                              </Badge>
                            )}
                            {venue.price_range && (
                              <Badge variant="outline" className="text-xs">
                                {getPriceRangeDisplay(venue.price_range)}
                              </Badge>
                            )}
                          </div>
                          
                          {venue.review_count && (
                            <span className="text-xs text-muted-foreground">
                              {venue.review_count} reviews
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
