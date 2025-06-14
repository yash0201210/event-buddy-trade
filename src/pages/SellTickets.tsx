
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { EventSelector } from '@/components/sell-tickets/EventSelector';
import { TicketDetailsForm } from '@/components/sell-tickets/TicketDetailsForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  ticket_types?: string[];
}

interface TicketFormData {
  ticketType: string;
  quantity: number;
  originalPrice: number;
  sellingPrice: number;
  description: string;
  isNegotiable: boolean;
}

const SellTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketData, setTicketData] = useState<TicketFormData>({
    ticketType: '',
    quantity: 1,
    originalPrice: 0,
    sellingPrice: 0,
    description: '',
    isNegotiable: true,
  });
  const [loading, setLoading] = useState(false);

  // Fetch events from database
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold mb-4">Authentication Required</h1>
              <p className="text-gray-600 mb-4">Please sign in to list your tickets</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleEventSelect = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event || null);
    // Reset ticket type when event changes
    setTicketData({
      ...ticketData,
      ticketType: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent) {
      toast({
        title: "Event required",
        description: "Please select an event",
        variant: "destructive"
      });
      return;
    }

    if (!ticketData.ticketType) {
      toast({
        title: "Ticket type required",
        description: "Please select a ticket type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('tickets')
        .insert({
          event_id: selectedEvent.id,
          seller_id: user.id,
          title: `${selectedEvent.name} - ${ticketData.ticketType}`,
          ticket_type: ticketData.ticketType,
          quantity: ticketData.quantity,
          original_price: ticketData.originalPrice,
          selling_price: ticketData.sellingPrice,
          description: ticketData.description,
          is_negotiable: ticketData.isNegotiable,
          status: 'available'
        });

      if (error) throw error;

      toast({
        title: "Ticket listed successfully!",
        description: "Your tickets are now live and visible to buyers.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error listing ticket:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to list ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Sell Your Tickets</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Select Event</CardTitle>
              </CardHeader>
              <CardContent>
                <EventSelector
                  events={events}
                  selectedEvent={selectedEvent}
                  onEventSelect={handleEventSelect}
                />
              </CardContent>
            </Card>

            {selectedEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <TicketDetailsForm
                    data={ticketData}
                    onChange={setTicketData}
                    selectedEvent={selectedEvent}
                  />
                </CardContent>
              </Card>
            )}

            {selectedEvent && (
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Listing Ticket...' : 'List Ticket for Sale'}
              </Button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default SellTickets;
