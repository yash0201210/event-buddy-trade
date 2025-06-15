
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventCard } from './EventCard';
import { EventCardSkeleton } from './EventCardSkeleton';
import { EmptyEventsState } from './EmptyEventsState';
import { Event } from '@/types/event';

interface SuggestedEventsProps {
  selectedCity?: string;
  selectedCategory?: string;
  searchTerm?: string;
}

export const SuggestedEvents = ({ selectedCity, selectedCategory, searchTerm }: SuggestedEventsProps) => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', selectedCity, selectedCategory, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select(`
          *,
          tickets!left(id)
        `)
        .gte('start_date_time', new Date().toISOString())
        .order('start_date_time', { ascending: true })
        .limit(12);

      if (selectedCity && selectedCity !== 'all') {
        query = query.eq('city', selectedCity);
      }

      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,venue.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data as Event[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyEventsState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  );
};
