
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventCard } from '@/components/home/EventCard';
import { EventCardSkeleton } from '@/components/home/EventCardSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  description?: string;
  image_url?: string;
  university_id?: string;
  ticket_count?: number;
  min_price?: number;
}

const AllEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Fetch events with ticket data
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['all-events'],
    queryFn: async () => {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          *,
          universities (
            id,
            name
          )
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Get ticket counts and minimum prices for each event
      const eventsWithTicketData = await Promise.all(
        eventsData.map(async (event) => {
          const { data: ticketData, error: ticketError } = await supabase
            .from('tickets')
            .select('quantity, selling_price')
            .eq('event_id', event.id)
            .eq('status', 'available');

          if (ticketError) {
            console.error('Error fetching ticket data:', ticketError);
            return { ...event, ticket_count: 0, min_price: 0 };
          }

          const totalTickets = ticketData?.reduce((sum, ticket) => sum + ticket.quantity, 0) || 0;
          const minPrice = ticketData?.length ? Math.min(...ticketData.map(t => t.selling_price)) : 0;
          
          return { 
            ...event, 
            ticket_count: totalTickets,
            min_price: minPrice
          };
        })
      );

      return eventsWithTicketData as Event[];
    },
  });

  // Fetch unique cities for filter
  const { data: cities = [] } = useQuery({
    queryKey: ['event-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('city')
        .order('city');

      if (error) throw error;
      return [...new Set(data.map(item => item.city))];
    },
  });

  // Fetch universities for filter
  const { data: universities = [] } = useQuery({
    queryKey: ['universities-filter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Filter and sort events
  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = selectedCity === 'all' || event.city === selectedCity;
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesUniversity = selectedUniversity === 'all' || event.university_id === selectedUniversity;

      return matchesSearch && matchesCity && matchesCategory && matchesUniversity;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        case 'price-low':
          return (a.min_price || 0) - (b.min_price || 0);
        case 'price-high':
          return (b.min_price || 0) - (a.min_price || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, selectedCity, selectedCategory, selectedUniversity, sortBy]);

  const categories = ['Music', 'Sports', 'Arts', 'Comedy', 'Business', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">All Events</h1>
          
          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* City Filter */}
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* University Filter */}
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="University" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Universities</SelectItem>
                    {universities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Soonest</SelectItem>
                    <SelectItem value="price-low">Cheapest</SelectItem>
                    <SelectItem value="price-high">Most Expensive</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCity('all');
                    setSelectedCategory('all');
                    setSelectedUniversity('all');
                    setSortBy('date');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `Showing ${filteredAndSortedEvents.length} events`}
            </p>
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to find more events.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCity('all');
                    setSelectedCategory('all');
                    setSelectedUniversity('all');
                    setSortBy('date');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AllEvents;
