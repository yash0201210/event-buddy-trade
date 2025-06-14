
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  type: 'event' | 'university' | 'venue' | 'city';
  title: string;
  subtitle: string;
  image?: string;
}

export const useSearch = (query: string) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];

      const searchResults: SearchResult[] = [];

      // Search events
      const { data: events } = await supabase
        .from('events')
        .select('id, name, venue, city, image_url')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (events) {
        events.forEach(event => {
          searchResults.push({
            id: event.id,
            type: 'event',
            title: event.name,
            subtitle: `${event.venue}, ${event.city}`,
            image: event.image_url
          });
        });
      }

      // Search universities
      const { data: universities } = await supabase
        .from('universities')
        .select('id, name, city, image_url')
        .ilike('name', `%${query}%`)
        .limit(3);

      if (universities) {
        universities.forEach(uni => {
          searchResults.push({
            id: uni.id,
            type: 'university',
            title: uni.name,
            subtitle: uni.city || 'University',
            image: uni.image_url
          });
        });
      }

      // Search venues (from events)
      const { data: venues } = await supabase
        .from('events')
        .select('venue, city')
        .ilike('venue', `%${query}%`)
        .limit(3);

      if (venues) {
        const uniqueVenues = [...new Set(venues.map(v => `${v.venue}, ${v.city}`))];
        uniqueVenues.forEach((venue, index) => {
          searchResults.push({
            id: `venue-${index}`,
            type: 'venue',
            title: venue.split(', ')[0],
            subtitle: venue.split(', ')[1] || 'Venue'
          });
        });
      }

      // Search cities (from events)
      const { data: cities } = await supabase
        .from('events')
        .select('city')
        .ilike('city', `%${query}%`)
        .limit(3);

      if (cities) {
        const uniqueCities = [...new Set(cities.map(c => c.city))];
        uniqueCities.forEach((city, index) => {
          searchResults.push({
            id: `city-${index}`,
            type: 'city',
            title: city,
            subtitle: 'City'
          });
        });
      }

      return searchResults.slice(0, 10);
    },
    enabled: query.length >= 2,
  });

  return {
    results,
    isLoading,
    isOpen,
    setIsOpen
  };
};
