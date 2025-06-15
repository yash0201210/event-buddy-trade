
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  description?: string;
  image_url?: string;
  venue_id?: string;
  university_id?: string;
}

interface Ticket {
  id: string;
  title: string;
  ticket_type: string;
  quantity: number;
  selling_price: number;
  original_price: number;
  description?: string;
  is_negotiable: boolean;
  seller: {
    full_name: string;
  };
}

interface Venue {
  id: string;
  name: string;
  city: string;
  address?: string;
}

interface University {
  id: string;
  name: string;
  city: string;
}

export const useEventData = (eventId: string | undefined) => {
  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is required');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return data as Event;
    },
    enabled: !!eventId,
  });

  // Fetch venue details
  const { data: venue } = useQuery({
    queryKey: ['venue', event?.venue_id],
    queryFn: async () => {
      if (!event?.venue_id) return null;
      
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', event.venue_id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Venue | null;
    },
    enabled: !!event?.venue_id,
  });

  // Fetch university details
  const { data: university } = useQuery({
    queryKey: ['university', event?.university_id],
    queryFn: async () => {
      if (!event?.university_id) return null;
      
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', event.university_id)
        .single();
      
      if (error) throw error;
      return data as University;
    },
    enabled: !!event?.university_id,
  });

  // Fetch available tickets for this event
  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['event-tickets', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          seller:profiles(full_name)
        `)
        .eq('event_id', eventId)
        .eq('status', 'available');
      
      if (error) throw error;
      return data as Ticket[];
    },
    enabled: !!eventId,
  });

  // Fetch sold tickets count
  const { data: soldTicketsCount = 0 } = useQuery({
    queryKey: ['event-sold-tickets-count', eventId],
    queryFn: async () => {
      if (!eventId) return 0;
      
      const { count, error } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'sold');
      
      if (error) throw error;
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
