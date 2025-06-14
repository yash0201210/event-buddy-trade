
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
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
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Discover More Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Discover More Events
        </h2>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No events available at the moment</p>
            <p className="text-sm text-gray-500">Check back soon for upcoming events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <Card 
                key={event.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer bg-gray-50"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Event Image/Icon */}
                    <div className="flex-shrink-0">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=100&h=100&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                          <span className="text-white font-bold text-xs text-center px-1">
                            {event.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg truncate pr-2">
                          {event.name}
                        </h3>
                        <Badge className="bg-orange-500 text-white text-xs flex-shrink-0">
                          {new Date(event.event_date).toLocaleDateString('en-GB', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2 truncate">
                        {event.venue}, {event.city}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(event.event_date).toLocaleDateString('en-GB', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <Badge variant="outline" className="text-xs">
                          441 tickets
                        </Badge>
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
