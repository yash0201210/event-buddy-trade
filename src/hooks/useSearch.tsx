
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SearchResult } from '@/types/event';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      const results: SearchResult[] = [];

      // Search events
      const { data: events } = await supabase
        .from('events')
        .select('id, name, venue, city, start_date_time, image_url, description')
        .ilike('name', `%${searchTerm}%`)
        .limit(5);

      if (events) {
        results.push(...events.map(event => ({
          id: event.id,
          type: 'event' as const,
          title: event.name,
          description: event.description,
          image_url: event.image_url,
          start_date_time: event.start_date_time,
          venue: event.venue,
          city: event.city
        })));
      }

      // Search venues
      const { data: venues } = await supabase
        .from('venues')
        .select('id, name, city, address')
        .ilike('name', `%${searchTerm}%`)
        .limit(3);

      if (venues) {
        results.push(...venues.map(venue => ({
          id: venue.id,
          type: 'venue' as const,
          title: venue.name,
          description: venue.address,
          city: venue.city
        })));
      }

      // Search universities
      const { data: universities } = await supabase
        .from('universities')
        .select('id, name, city, image_url')
        .ilike('name', `%${searchTerm}%`)
        .limit(3);

      if (universities) {
        results.push(...universities.map(university => ({
          id: university.id,
          type: 'university' as const,
          title: university.name,
          image_url: university.image_url,
          city: university.city
        })));
      }

      return results;
    },
    enabled: searchTerm.length > 0,
  });

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    isOpen,
    setIsOpen
  };
};

export { SearchResult };
