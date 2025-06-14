
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            Discover More Events
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Check out all the latest on the scene.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Discover More Events
          </h2>
          <p className="text-lg text-gray-600">
            Check out all the latest on the scene.
          </p>
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No events available at the moment</p>
            <p className="text-sm text-gray-500">Check back soon for upcoming events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event) => (
              <Card 
                key={event.id} 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-0 shadow-sm hover:-translate-y-1 overflow-hidden"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center">
                      <span className="text-white font-bold text-lg text-center px-4">
                        {event.category}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900 font-semibold">
                      {new Date(event.event_date).toLocaleDateString('en-GB', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                    {event.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">{event.venue}, {event.city}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(event.event_date).toLocaleDateString('en-GB', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <Badge variant="outline" className="text-xs font-medium">
                      Events
                    </Badge>
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
