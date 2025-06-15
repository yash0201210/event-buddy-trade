
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  description?: string;
  image_url?: string;
}

export const DiscoverMoreEvents = () => {
  const navigate = useNavigate();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['discover-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .limit(8);

      if (error) throw error;
      return data as Event[];
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
            <p className="text-gray-600 mb-4">No events available at the moment</p>
            <p className="text-sm text-gray-500">Check back soon for upcoming events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.slice(0, 8).map((event) => (
              <Card 
                key={event.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border border-gray-200 rounded-2xl overflow-hidden"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center h-24">
                    {/* Event Image/Icon */}
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
                    
                    {/* Event Details */}
                    <div className="flex-1 py-4 pr-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center text-orange-500 text-sm mb-1">
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
                            <span className="truncate">{event.venue}, {event.city}</span>
                          </div>
                        </div>
                        
                        {/* Attendees Badge */}
                        <div className="flex items-center bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium ml-2">
                          <Users className="h-3 w-3 mr-1" />
                          <span>441</span>
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
