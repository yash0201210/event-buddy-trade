
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  type: 'event' | 'university' | 'venue' | 'city';
  title: string;
  subtitle: string;
  image?: string;
  date?: string;
}

export const useSearch = (query: string) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];

      const searchResults: SearchResult[] = [];

      // Search events with date
      const { data: events } = await supabase
        .from('events')
        .select('id, name, venue, city, image_url, event_date')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (events) {
        events.forEach(event => {
          searchResults.push({
            id: event.id,
            type: 'event',
            title: event.name,
            subtitle: `${event.venue}, ${event.city}`,
            image: event.image_url || `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop`,
            date: event.event_date
          });
        });
      }

      // Search universities with better image handling
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
            image: uni.image_url || `https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop`
          });
        });
      }

      // Search venues with location
      const { data: venues } = await supabase
        .from('venues')
        .select('id, name, city, address')
        .ilike('name', `%${query}%`)
        .limit(3);

      if (venues) {
        venues.forEach(venue => {
          searchResults.push({
            id: venue.id,
            type: 'venue',
            title: venue.name,
            subtitle: venue.address ? `${venue.address}, ${venue.city}` : venue.city,
            image: `https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop`
          });
        });
      }

      // Search cities from events
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
            subtitle: 'City',
            image: `https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop`
          });
        });
      }

      return searchResults.slice(0, 12);
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
