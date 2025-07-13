
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

const categoryData = [
  { key: 'alcohol', name: 'Alcohol', icon: Wine, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'food', name: 'Food', icon: Utensils, color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'cannabis', name: 'Cannabis', icon: Leaf, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'merchandise', name: 'Merchandise', icon: ShoppingBag, color: 'bg-blue-50 text-blue-700 border-blue-200' },
];

const Index = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cities, setCities] = useState<Array<{ id: string; name: string; state: string }>>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [venues, searchTerm, selectedCity, selectedCategory]);

  const fetchData = async () => {
    try {
      const [venuesResponse, citiesResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('venues')
          .select(`
            *,
            cities (name, state, country),
            venue_categories (name)
          `)
          .eq('is_active', true),
        supabase.from('cities').select('id, name, state'),
        supabase.from('venue_categories').select('id, name')
      ]);

      setVenues(venuesResponse.data || []);
      setCities(citiesResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

    if (selectedCity !== 'all') {
      filtered = filtered.filter(venue => venue.cities.name === selectedCity);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(venue => venue.venue_categories?.name === selectedCategory);
    }

    setFilteredVenues(filtered);
  };

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleVenueSelect = (venue: Venue) => {
    navigate('/menu', { state: { venue } });
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName.toLowerCase());
    handleSearch();
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
      <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Discover Premium
                <span className="block text-primary mt-2">Venues & Experiences</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Find the perfect spot for drinks, dining, and premium products in your area
              </p>
            </div>

            {/* Search Section */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg max-w-3xl mx-auto border">
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search venues, locations, or experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 md:h-14 text-base border-border bg-background"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-12 border-border bg-background">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select City" />
                      </div>
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
                    <SelectTrigger className="h-12 border-border bg-background">
                      <div className="flex items-center gap-2">
                        <Wine className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Category" />
                      </div>
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
                </div>

                <Button 
                  onClick={handleSearch} 
                  size="lg" 
                  className="w-full h-12 md:h-14 text-base font-semibold"
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
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Explore by Category
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover venues offering premium alcohol, food, cannabis, and merchandise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryData.map(({ key, name, icon: Icon, color }) => (
                <Card 
                  key={key} 
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${color}`}
                  onClick={() => handleCategoryClick(name)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{name}</h3>
                    <p className="text-sm opacity-80">Premium {name.toLowerCase()} experiences</p>
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
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                {filteredVenues.length} venues found
              </h2>
              <p className="text-muted-foreground">
                {searchTerm && `Results for "${searchTerm}"`}
                {selectedCity !== 'all' && ` in ${selectedCity}`}
                {selectedCategory !== 'all' && ` • ${selectedCategory}`}
              </p>
            </div>

            {filteredVenues.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-4">No venues found</h3>
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
                    className="group cursor-pointer transition-all duration-300 hover:shadow-lg border"
                    onClick={() => handleVenueSelect(venue)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
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
                                {'$'.repeat(venue.price_range)}
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
