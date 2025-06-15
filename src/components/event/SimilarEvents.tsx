
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  image_url?: string;
  venue_id?: string;
  university_id?: string;
  ticket_count?: number;
}

interface SimilarEventsProps {
  currentEvent: Event;
}

export const SimilarEvents = ({ currentEvent }: SimilarEventsProps) => {
  const { data: similarEvents = [], isLoading } = useQuery({
    queryKey: ['similar-events', currentEvent.id],
    queryFn: async () => {
      // First try to find events at the same venue or university
      let query = supabase
        .from('events')
        .select('*')
        .neq('id', currentEvent.id)
        .gte('event_date', new Date().toISOString())
        .limit(3);

      if (currentEvent.venue_id) {
        query = query.eq('venue_id', currentEvent.venue_id);
      } else if (currentEvent.university_id) {
        query = query.eq('university_id', currentEvent.university_id);
      } else {
        query = query.eq('city', currentEvent.city);
      }

      const { data: eventsData, error } = await query.order('event_date', { ascending: true });

      if (error) throw error;

      // Get ticket counts for each event
      const eventsWithTicketCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
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

      return eventsWithTicketCounts as Event[];
    },
  });

  if (isLoading) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Events</h2>
        <div className="text-center py-8">Loading similar events...</div>
      </div>
    );
  }

  if (similarEvents.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {similarEvents.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="p-0">
                <div className="relative">
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.name}
                      className="w-full h-36 object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-36 bg-gradient-to-br from-red-100 to-red-200 rounded-t-lg flex items-center justify-center">
                      <span className="text-red-600 font-medium">{event.category}</span>
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                    {event.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-3">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                  {event.name}
                </h3>
                
                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{event.venue}, {event.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(event.event_date).toLocaleDateString('en-GB', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}</span>
                    </div>
                    {event.ticket_count && event.ticket_count > 0 && (
                      <div className="flex items-center text-blue-600">
                        <Ticket className="h-3 w-3 mr-1" />
                        <span className="font-medium">{event.ticket_count}+</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
