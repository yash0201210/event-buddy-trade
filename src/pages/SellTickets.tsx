
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
  pdfUploads?: Array<{ pdfUrl: string; qrCodeHash: string; pages: number }>;
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
      pdfUploads: undefined
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', ticketData);
    
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

    // Validate prices
    if (ticketData.originalPrice <= 0 || isNaN(ticketData.originalPrice)) {
      toast({
        title: "Invalid original price",
        description: "Please enter a valid original price greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (ticketData.sellingPrice <= 0 || isNaN(ticketData.sellingPrice)) {
      toast({
        title: "Invalid selling price",
        description: "Please enter a valid selling price greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (!ticketData.pdfUploads || ticketData.pdfUploads.length === 0) {
      toast({
        title: "Ticket verification required",
        description: "Please upload and verify your ticket PDFs",
        variant: "destructive"
      });
      return;
    }

    // Check if total pages match quantity
    const totalPages = ticketData.pdfUploads.reduce((sum, upload) => sum + upload.pages, 0);
    if (totalPages !== ticketData.quantity) {
      toast({
        title: "Quantity mismatch",
        description: `You selected ${totalPages} tickets but specified quantity of ${ticketData.quantity}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Creating ticket entries with prices:', {
        original: ticketData.originalPrice,
        selling: ticketData.sellingPrice,
        type: typeof ticketData.originalPrice,
        isNaN: isNaN(ticketData.originalPrice)
      });

      // Create multiple ticket entries if there are multiple uploads
      const ticketPromises = ticketData.pdfUploads.map((upload, index) => {
        const ticketEntry = {
          event_id: selectedEvent.id,
          seller_id: user.id,
          title: `${selectedEvent.name} - ${ticketData.ticketType}${ticketData.pdfUploads!.length > 1 ? ` (${index + 1})` : ''}`,
          ticket_type: ticketData.ticketType,
          quantity: upload.pages,
          original_price: Number(ticketData.originalPrice),
          selling_price: Number(ticketData.sellingPrice),
          description: ticketData.description,
          is_negotiable: ticketData.isNegotiable,
          pdf_url: upload.pdfUrl,
          qr_code_hash: upload.qrCodeHash,
          verification_status: 'verified',
          status: 'available'
        };
        
        console.log('Inserting ticket entry:', ticketEntry);
        
        return supabase
          .from('tickets')
          .insert(ticketEntry);
      });

      const results = await Promise.all(ticketPromises);
      const hasError = results.some(result => result.error);
      
      if (hasError) {
        const errorDetails = results.filter(r => r.error).map(r => r.error);
        console.error('Database insertion errors:', errorDetails);
        throw new Error('Failed to create some ticket listings');
      }

      toast({
        title: "Tickets listed successfully!",
        description: `Your ${ticketData.pdfUploads.length} ticket listing(s) are now live and visible to buyers.`,
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error listing tickets:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to list tickets. Please try again.",
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
