
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventCard } from './EventCard';
import { EventCardSkeleton } from './EventCardSkeleton';
import { EmptyEventsState } from './EmptyEventsState';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  description?: string;
  image_url?: string;
  ticket_count?: number;
}

interface SuggestedEventsProps {
  selectedCity: string;
}

export const SuggestedEvents = ({ selectedCity }: SuggestedEventsProps) => {
  const navigate = useNavigate();
  const { getCityDistance } = useGeolocation();
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['suggested-events', selectedCity],
    queryFn: async () => {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

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
            return { ...event, ticket_count: 0 };
          }

          const totalTickets = ticketData?.reduce((sum, ticket) => sum + ticket.quantity, 0) || 0;
          return { ...event, ticket_count: totalTickets };
        })
      );

      // Sort by location proximity and ticket count
      const sortedEvents = eventsWithTicketCounts.sort((a, b) => {
        // First priority: selected city events
        if (a.city === selectedCity && b.city !== selectedCity) return -1;
        if (b.city === selectedCity && a.city !== selectedCity) return 1;
        
        // Second priority: distance from user location
        const distanceA = getCityDistance(a.city);
        const distanceB = getCityDistance(b.city);
        
        if (distanceA !== distanceB) {
          return distanceA - distanceB;
        }
        
        // Third priority: ticket count (more tickets first)
        return (b.ticket_count || 0) - (a.ticket_count || 0);
      });

      return sortedEvents.slice(0, 6) as Event[];
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
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => navigate('/events')}
            >
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
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => navigate('/events')}
            >
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
          <Button 
            variant="outline" 
            className="border-red-600 text-red-600 hover:bg-red-50"
            onClick={() => navigate('/events')}
          >
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
