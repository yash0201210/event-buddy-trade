
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
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

export const useSellTickets = () => {
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

  // VERIFICATION TEMPORARILY DISABLED FOR TESTING
  const VERIFICATION_DISABLED = true;

  const handleEventSelect = (eventId: string | null) => {
    if (eventId) {
      const events = []; // This will be passed from the component
      const event = events.find((e: Event) => e.id === eventId);
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

  const validateTicketData = () => {
    if (!selectedEvent) {
      toast({
        title: "Event required",
        description: "Please select an event",
        variant: "destructive"
      });
      return false;
    }

    if (!ticketData.ticketType) {
      toast({
        title: "Ticket type required",
        description: "Please select a ticket type",
        variant: "destructive"
      });
      return false;
    }

    // Validate prices
    if (ticketData.originalPrice <= 0 || isNaN(ticketData.originalPrice)) {
      toast({
        title: "Invalid original price",
        description: "Please enter a valid original price greater than 0",
        variant: "destructive"
      });
      return false;
    }

    if (ticketData.sellingPrice <= 0 || isNaN(ticketData.sellingPrice)) {
      toast({
        title: "Invalid selling price",
        description: "Please enter a valid selling price greater than 0",
        variant: "destructive"
      });
      return false;
    }

    // Only require PDF uploads if verification is enabled
    if (!VERIFICATION_DISABLED) {
      if (!ticketData.pdfUploads || ticketData.pdfUploads.length === 0) {
        toast({
          title: "Ticket verification required",
          description: "Please upload and verify your ticket PDFs",
          variant: "destructive"
        });
        return false;
      }

      // Check if total pages match quantity
      const totalPages = ticketData.pdfUploads.reduce((sum, upload) => sum + upload.pages, 0);
      if (totalPages !== ticketData.quantity) {
        toast({
          title: "Quantity mismatch",
          description: `You selected ${totalPages} tickets but specified quantity of ${ticketData.quantity}`,
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const createTicketEntry = async () => {
    if (!user || !selectedEvent) return;

    console.log('Creating ticket entries with prices:', {
      original: ticketData.originalPrice,
      selling: ticketData.sellingPrice,
      type: typeof ticketData.originalPrice,
      isNaN: isNaN(ticketData.originalPrice)
    });

    if (VERIFICATION_DISABLED) {
      // Create a single ticket entry when verification is disabled
      const ticketEntry = {
        event_id: selectedEvent.id,
        seller_id: user.id,
        title: `${selectedEvent.name} - ${ticketData.ticketType}`,
        ticket_type: ticketData.ticketType,
        quantity: ticketData.quantity,
        original_price: Number(ticketData.originalPrice),
        selling_price: Number(ticketData.sellingPrice),
        description: ticketData.description,
        is_negotiable: ticketData.isNegotiable,
        pdf_url: null,
        qr_code_hash: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        verification_status: 'verified',
        status: 'available'
      };
      
      console.log('Inserting ticket entry (verification disabled):', ticketEntry);
      
      const { error } = await supabase
        .from('tickets')
        .insert(ticketEntry);

      if (error) {
        console.error('Database insertion error:', error);
        throw error;
      }
    } else {
      // Original logic for when verification is enabled
      const ticketPromises = ticketData.pdfUploads!.map((upload, index) => {
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', ticketData);
    
    if (!validateTicketData()) return;

    setLoading(true);

    try {
      await createTicketEntry();

      toast({
        title: "Tickets listed successfully!",
        description: `Your ticket listing is now live and visible to buyers.`,
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

  return {
    selectedEvent,
    ticketData,
    loading,
    handleEventSelect: (eventId: string | null, events: Event[]) => {
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
    },
    setTicketData,
    handleSubmit,
  };
};
