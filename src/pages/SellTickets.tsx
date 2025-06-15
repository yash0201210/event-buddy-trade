import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SellTicketsForm } from '@/components/sell-tickets/SellTicketsForm';
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
  ticket_types?: string[];
}

interface TicketFormData {
  ticketType: string;
  quantity: number;
  originalPrice: number;
  sellingPrice: number;
  description: string;
  isNegotiable: boolean;
  pdfUrl?: string;
  qrCodeHash?: string;
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

  const handleEventSelect = (eventId: string | null) => {
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      setSelectedEvent(event || null);
    } else {
      setSelectedEvent(null);
    }
    // Reset ticket type and PDF data when event changes
    setTicketData({
      ...ticketData,
      ticketType: '',
      pdfUrl: undefined,
      qrCodeHash: undefined
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

    if (!ticketData.pdfUrl || !ticketData.qrCodeHash) {
      toast({
        title: "Ticket verification required",
        description: "Please upload and verify your ticket PDF",
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
          pdf_url: ticketData.pdfUrl,
          qr_code_hash: ticketData.qrCodeHash,
          verification_status: 'verified',
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
      
      <main className="pb-8">
        <SellTicketsForm
          events={events}
          selectedEvent={selectedEvent}
          ticketData={ticketData}
          loading={loading}
          onEventSelect={handleEventSelect}
          onTicketDataChange={setTicketData}
          onSubmitEventRequest={() => navigate('/submit-event')}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
};

export default SellTickets;
