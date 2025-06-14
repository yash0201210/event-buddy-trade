
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CitySelector } from '@/components/home/CitySelector';
import { EventCategories } from '@/components/home/EventCategories';
import { SuggestedEvents } from '@/components/home/SuggestedEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Star, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface TicketWithEvent {
  id: string;
  title: string;
  selling_price: number;
  original_price: number;
  quantity: number;
  ticket_type: string;
  description: string;
  is_negotiable: boolean;
  seller_id: string;
  events: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
  };
  profiles: {
    full_name: string;
    is_verified: boolean;
  };
}

const Index = () => {
  const navigate = useNavigate();

  const { data: recentTickets = [], isLoading } = useQuery({
    queryKey: ['recent-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          events!tickets_event_id_fkey (
            name,
            venue,
            city,
            event_date
          ),
          profiles!tickets_seller_id_fkey (
            full_name,
            is_verified
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as TicketWithEvent[];
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        <CitySelector />
        <EventCategories />
        <SuggestedEvents />

        {/* Recent Tickets */}
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Latest Tickets
            </h2>
            
            {isLoading ? (
              <div className="text-center">Loading tickets...</div>
            ) : recentTickets.length === 0 ? (
              <div className="text-center text-gray-600">
                No tickets available yet. Be the first to list your tickets!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/ticket/${ticket.id}`)}>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg font-semibold line-clamp-2">
                          {ticket.events.name}
                        </CardTitle>
                        <Badge variant="secondary" className="ml-2">
                          £{ticket.selling_price}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{ticket.events.venue}, {ticket.events.city}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(ticket.events.event_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {ticket.ticket_type} • {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
                        </span>
                        {ticket.is_negotiable && (
                          <Badge variant="outline" className="text-xs">
                            Negotiable
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          <span>{ticket.profiles.full_name}</span>
                          {ticket.profiles.is_verified && (
                            <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
