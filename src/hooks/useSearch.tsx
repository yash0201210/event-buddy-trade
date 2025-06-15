
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  type: 'event' | 'venue' | 'university';
  name: string;
  description?: string;
  image_url?: string;
  start_date_time?: string;
  venue?: string;
  city?: string;
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Search events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('id, name, venue, city, image_url, start_date_time')
          .or(`name.ilike.%${searchQuery}%,venue.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
          .limit(5);

        if (eventsError) throw eventsError;

        const eventResults: SearchResult[] = (events || []).map(event => ({
          id: event.id,
          type: 'event' as const,
          name: event.name,
          description: `${event.venue}, ${event.city}`,
          image_url: event.image_url,
          start_date_time: event.start_date_time,
          venue: event.venue,
          city: event.city
        }));

        // Search venues
        const { data: venues, error: venuesError } = await supabase
          .from('venues')
          .select('id, name, city, address')
          .or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
          .limit(3);

        if (venuesError) throw venuesError;

        const venueResults: SearchResult[] = (venues || []).map(venue => ({
          id: venue.id,
          type: 'venue' as const,
          name: venue.name,
          description: venue.city,
          city: venue.city
        }));

        // Search universities
        const { data: universities, error: universitiesError } = await supabase
          .from('universities')
          .select('id, name, city, image_url')
          .or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
          .limit(3);

        if (universitiesError) throw universitiesError;

        const universityResults: SearchResult[] = (universities || []).map(university => ({
          id: university.id,
          type: 'university' as const,
          name: university.name,
          description: university.city,
          image_url: university.image_url,
          city: university.city
        }));

        setSearchResults([...eventResults, ...venueResults, ...universityResults]);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
  };
};
