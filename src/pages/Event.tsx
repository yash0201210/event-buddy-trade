
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrendingUp } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventHeader } from '@/components/event/EventHeader';
import { TicketAlert } from '@/components/event/TicketAlert';
import { AvailableTickets } from '@/components/event/AvailableTickets';
import { EventInformation } from '@/components/event/EventInformation';
import { SellTicketPrompt } from '@/components/event/SellTicketPrompt';
import { SimilarEvents } from '@/components/event/SimilarEvents';
import { UniTicketingSolution } from '@/components/home/UniTicketingSolution';
import { Card, CardContent } from '@/components/ui/card';

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

const Event = () => {
  const { id } = useParams();

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Event;
    },
    enabled: !!id,
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
    queryKey: ['event-tickets', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          seller:profiles(full_name)
        `)
        .eq('event_id', id)
        .eq('status', 'available');
      
      if (error) throw error;
      return data as Ticket[];
    },
    enabled: !!id,
  });

  // Fetch sold tickets count
  const { data: soldTicketsCount = 0 } = useQuery({
    queryKey: ['event-sold-tickets-count', id],
    queryFn: async () => {
      if (!id) return 0;
      
      const { count, error } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id)
        .eq('status', 'sold');
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!id,
  });

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading event...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Event not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Event Header - Full Width */}
        <EventHeader event={event} venue={venue} university={university} />

        {/* Narrow Content Area */}
        <div className="max-w-4xl mx-auto">
          {/* Available Tickets */}
          <AvailableTickets tickets={tickets} isLoading={ticketsLoading} />

          {/* Ticket Alert */}
          <TicketAlert eventId={event.id} />

          {/* Sold Tickets Counter */}
          {soldTicketsCount > 0 && (
            <div className="mb-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center text-green-700">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    <span className="font-medium">
                      {soldTicketsCount} ticket{soldTicketsCount === 1 ? '' : 's'} sold
                    </span>
                    <span className="ml-2 text-sm text-green-600">
                      - High demand event!
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Event Information */}
          <EventInformation event={event} venue={venue} university={university} />

          {/* Sell Ticket Prompt */}
          <SellTicketPrompt eventId={event.id} />

          {/* Similar Events */}
          <SimilarEvents currentEvent={event} />
        </div>

        {/* University Ticketing Solution Banner - Full Width */}
        <UniTicketingSolution />
      </main>
      
      <Footer />
    </div>
  );
};

export default Event;
