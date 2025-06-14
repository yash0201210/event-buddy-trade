
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, GraduationCap } from 'lucide-react';

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

interface University {
  id: string;
  name: string;
  city: string;
  country: string;
}

const University = () => {
  const { id } = useParams<{ id: string }>();

  const { data: university, isLoading: universityLoading, error: universityError } = useQuery({
    queryKey: ['university', id],
    queryFn: async () => {
      if (!id) throw new Error('University ID is required');
      
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as University | null;
    },
    enabled: !!id,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['university-events', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('university_id', id)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!id,
  });

  if (universityLoading || eventsLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">Loading university details...</div>
        </div>
      </Layout>
    );
  }

  if (universityError || !university) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">University Not Found</h1>
            <p className="text-gray-600 mb-4">The university you're looking for doesn't exist or has been removed.</p>
            <Link to="/universities">
              <Button className="bg-red-600 hover:bg-red-700">
                Browse All Universities
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{university.name}</h1>
              <p className="text-gray-600">{university.city}, {university.country}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Events at {university.name}
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No events available at this university yet</p>
            <p className="text-sm text-gray-500">Check back soon for upcoming events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event.id} to={`/event/${event.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="relative">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-t-lg flex items-center justify-center">
                          <span className="text-red-600 font-medium">{event.category}</span>
                        </div>
                      )}
                      <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                        {event.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2" />
                        <span>{event.venue}, {event.city}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        <span>{new Date(event.event_date).toLocaleDateString('en-GB', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        View Details
                      </span>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        View Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default University;
