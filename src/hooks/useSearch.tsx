
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  type: 'event' | 'venue' | 'university';
  title: string;
  description?: string;
  image_url?: string;
  event_date?: string;
  venue?: string;
  city?: string;
}

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      const results: SearchResult[] = [];

      // Search events
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,venue.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`)
        .limit(5);

      if (events) {
        events.forEach(event => {
          results.push({
            id: event.id,
            type: 'event',
            title: event.name,
            description: event.description,
            image_url: event.image_url,
            event_date: event.event_date,
            venue: event.venue,
            city: event.city
          });
        });
      }

      // Search venues
      const { data: venues } = await supabase
        .from('venues')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`)
        .limit(3);

      if (venues) {
        venues.forEach(venue => {
          results.push({
            id: venue.id,
            type: 'venue',
            title: venue.name,
            description: venue.address,
            city: venue.city
          });
        });
      }

      // Search universities
      const { data: universities } = await supabase
        .from('universities')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(3);

      if (universities) {
        universities.forEach(university => {
          results.push({
            id: university.id,
            type: 'university',
            title: university.name,
            description: university.city,
            image_url: university.image_url,
            city: university.city
          });
        });
      }

      return results;
    },
    enabled: searchTerm.length > 0,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(term.length > 0);
  };

  return {
    searchTerm,
    searchResults,
    isLoading,
    isSearching,
    handleSearch,
    setIsSearching
  };
};
