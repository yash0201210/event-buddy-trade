
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEventTickets } from './useEventTickets';

export const useEventDetails = (eventId?: string) => {
  // Event details query
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }

      return data;
    },
    enabled: !!eventId,
  });

  // Venue details query
  const { data: venue } = useQuery({
    queryKey: ['venue', event?.venue_id],
    queryFn: async () => {
      if (!event?.venue_id) return null;
      
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', event.venue_id)
        .single();

      if (error) {
        console.error('Error fetching venue:', error);
        return null;
      }

      return data;
    },
    enabled: !!event?.venue_id,
  });

  // University details query
  const { data: university } = useQuery({
    queryKey: ['university', event?.university_id],
    queryFn: async () => {
      if (!event?.university_id) return null;
      
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', event.university_id)
        .single();

      if (error) {
        console.error('Error fetching university:', error);
        return null;
      }

      return data;
    },
    enabled: !!event?.university_id,
  });

  // Use the new event tickets hook
  const { data: tickets = [], isLoading: ticketsLoading } = useEventTickets(eventId);

  // Sold tickets count query
  const { data: soldTicketsCount = 0 } = useQuery({
    queryKey: ['event-sold-tickets-count', eventId],
    queryFn: async () => {
      if (!eventId) return 0;
      
      const { count } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'sold');

      return count || 0;
    },
    enabled: !!eventId,
  });

  return {
    event,
    venue,
    university,
    tickets,
    soldTicketsCount,
    eventLoading,
    ticketsLoading,
  };
};
