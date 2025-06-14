
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, Star, User, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
}

interface University {
  id: string;
  name: string;
  city: string;
}

const Event = () => {
  const [isFavourite, setIsFavourite] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  // Fetch tickets for this event
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

  const handleViewTicket = (ticketId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view tickets",
      });
      navigate('/auth');
      return;
    }
    navigate(`/ticket/${ticketId}`);
  };

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
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              {event.image_url ? (
                <img 
                  src={event.image_url} 
                  alt={event.name}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop';
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-medium">{event.category}</span>
                </div>
              )}
            </div>
            
            <div className="md:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2 bg-red-100 text-red-700">
                    {event.category}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {event.name}
                  </h1>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsFavourite(!isFavourite)}
                  className={isFavourite ? 'text-red-600' : 'text-gray-400'}
                >
                  <Heart className={`h-5 w-5 ${isFavourite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <div className="space-y-3 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3" />
                  <span>
                    {event.venue_id ? (
                      <Link 
                        to={`/venue/${event.venue_id}`}
                        className="text-red-600 hover:text-red-700 hover:underline"
                      >
                        {venue?.name || event.venue}
                      </Link>
                    ) : (
                      event.venue
                    )}
                    , {event.city}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span>{new Date(event.event_date).toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                {university && event.university_id && (
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-3" />
                    <span>
                      <Link 
                        to={`/university/${event.university_id}`}
                        className="text-red-600 hover:text-red-700 hover:underline"
                      >
                        {university.name}
                      </Link>
                    </span>
                  </div>
                )}
              </div>
              
              {event.description && (
                <p className="text-gray-700 mb-6">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Available Tickets */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Tickets</h2>
          
          {ticketsLoading ? (
            <div className="text-center py-8">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">No tickets available for this event</p>
              <p className="text-sm text-gray-500">Check back later for new listings!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {ticket.ticket_type}
                          </h3>
                          {ticket.is_negotiable && (
                            <Badge className="bg-blue-100 text-blue-700">
                              Negotiable
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2">
                          Quantity: {ticket.quantity}
                        </p>
                        
                        {ticket.description && (
                          <p className="text-gray-600 mb-2 text-sm">
                            {ticket.description}
                          </p>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span>Sold by {ticket.seller?.full_name || 'Unknown'}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          £{ticket.selling_price}
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          per ticket
                        </div>
                        <Button 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleViewTicket(ticket.id)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Event;
