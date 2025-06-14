
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, Star } from 'lucide-react';
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
  description?: string;
  image_url?: string;
}

export const SuggestedEvents = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['suggested-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .limit(6);

      if (error) throw error;
      return data as Event[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-4 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Suggested Events
            </h2>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="p-0">
                  <div className="w-full h-36 bg-gray-200 rounded-t-lg"></div>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-4 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Suggested Events
            </h2>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              View All
            </Button>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No events available at the moment</p>
            <p className="text-sm text-gray-500">Check back soon for upcoming events!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Suggested Events
          </h2>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link key={event.id} to={`/event/${event.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
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
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(event.event_date).toLocaleDateString('en-GB', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      View Details
                    </span>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1 h-6">
                      View Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
