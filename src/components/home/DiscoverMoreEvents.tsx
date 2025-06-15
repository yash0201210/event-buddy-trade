
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventCard } from './EventCard';
import { EventCardSkeleton } from './EventCardSkeleton';
import { Event } from '@/types/event';

export const DiscoverMoreEvents = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['discover-more-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(6);

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data as Event[];
    },
  });

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover More Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover More Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}
      </div>
    </div>
  );
};
