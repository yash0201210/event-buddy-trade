
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventCard } from './EventCard';
import { EventCardSkeleton } from './EventCardSkeleton';
import { EmptyEventsState } from './EmptyEventsState';

interface EventWithTicketCount {
  id: string;
  name: string;
  venue: string;
  city: string;
  start_date_time: string;
  category: string;
  description?: string;
  image_url?: string;
  ticket_count?: number;
}

export const SuggestedEvents = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['suggested-events'],
    queryFn: async () => {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date_time', { ascending: true })
        .limit(6);

      if (error) throw error;

      // Get ticket counts for each event
      const eventsWithTicketCounts = await Promise.all(
        eventsData.map(async (event) => {
          const { data: ticketData, error: ticketError } = await supabase
            .from('tickets')
            .select('quantity')
            .eq('event_id', event.id)
            .eq('status', 'available');

          if (ticketError) {
            console.error('Error fetching ticket count:', ticketError);
            return { 
              ...event, 
              ticket_count: 0,
              // Map start_date_time to event_date for compatibility
              event_date: event.start_date_time 
            };
          }

          const totalTickets = ticketData?.reduce((sum, ticket) => sum + ticket.quantity, 0) || 0;
          return { 
            ...event, 
            ticket_count: totalTickets,
            // Map start_date_time to event_date for compatibility
            event_date: event.start_date_time
          };
        })
      );

      return eventsWithTicketCounts as EventWithTicketCount[];
    },
  });

  if (isLoading) {
    return (
      <section className="pt-4 pb-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Suggested Events
            </h2>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="pt-4 pb-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Suggested Events
            </h2>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              View All
            </Button>
          </div>
          
          <EmptyEventsState />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Suggested Events
          </h2>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};
