
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  university_id?: string;
  ticket_count?: number;
}

interface DiscoverMoreEventsProps {
  selectedCity: string;
}

export const DiscoverMoreEvents = ({ selectedCity }: DiscoverMoreEventsProps) => {
  const navigate = useNavigate();
  const { getCityDistance } = useGeolocation();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['discover-events', selectedCity],
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

      // Sort by location, university, and ticket count
      const sortedEvents = eventsWithTicketCounts.sort((a, b) => {
        // First priority: location proximity
        const distanceA = getCityDistance(a.city);
        const distanceB = getCityDistance(b.city);
        
        if (distanceA !== distanceB) {
          return distanceA - distanceB;
        }
        
        // Second priority: university events (events with university_id)
        if (a.university_id && !b.university_id) return -1;
        if (b.university_id && !a.university_id) return 1;
        
        // Third priority: ticket count (more tickets first)
        return (b.ticket_count || 0) - (a.ticket_count || 0);
      });

      console.log('Total events found:', sortedEvents.length);
      console.log('Events for discover more (6-14):', sortedEvents.slice(6, 14));

      // If we have fewer than 6 events total, show some events anyway
      if (sortedEvents.length <= 6) {
        // Show last 2-4 events if we have them
        const startIndex = Math.max(0, sortedEvents.length - 4);
        return sortedEvents.slice(startIndex) as Event[];
      }

      // Skip first 6 events (as they would be in suggested events) and take next 8
      return sortedEvents.slice(6, 14) as Event[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
            Discover More Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
          Discover More Events
        </h2>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No additional events available at the moment</p>
            <p className="text-sm text-gray-500">Check back soon for more upcoming events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <Card 
                key={event.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border border-gray-200 rounded-2xl overflow-hidden"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center h-24">
                    <div className="w-20 h-20 mx-4 rounded-xl overflow-hidden flex-shrink-0">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=400&fit=crop';
                          }}
                        />
                      ) : (
                        <img 
                          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=400&fit=crop"
                          alt="Event crowd"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 py-4 pr-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center text-orange-500 text-sm mb-1 text-left">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span className="font-medium">
                              {new Date(event.event_date).toLocaleDateString('en-GB', { 
                                month: 'short', 
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 text-left">
                            {event.name}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm text-left">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate">{event.venue}, {event.city}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium ml-2">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{event.ticket_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
