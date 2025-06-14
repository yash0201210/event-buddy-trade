
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EventSelector } from '@/components/sell-tickets/EventSelector';
import { TicketDetailsForm } from '@/components/sell-tickets/TicketDetailsForm';
import { ImageUpload } from '@/components/sell-tickets/ImageUpload';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
}

const SellTickets = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    eventId: '',
    section: '',
    row: '',
    seats: '',
    quantity: 1,
    originalPrice: '',
    sellingPrice: '',
    description: '',
    isNegotiable: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to list tickets",
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive"
      });
    }
  };

  const handleEventSelect = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event || null);
    setFormData(prev => ({ ...prev, eventId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedEvent) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('tickets')
        .insert({
          seller_id: user.id,
          event_id: formData.eventId,
          title: selectedEvent.name,
          section: formData.section || null,
          row_number: formData.row || null,
          seat_numbers: formData.seats || null,
          quantity: formData.quantity,
          original_price: parseFloat(formData.originalPrice),
          selling_price: parseFloat(formData.sellingPrice),
          description: formData.description || null,
          is_negotiable: formData.isNegotiable,
          status: 'available'
        });

      if (error) throw error;
      
      toast({
        title: "Ticket listed successfully!",
        description: "Your ticket is now live on the marketplace.",
      });
      
      // Reset form
      setFormData({
        eventId: '',
        section: '',
        row: '',
        seats: '',
        quantity: 1,
        originalPrice: '',
        sellingPrice: '',
        description: '',
        isNegotiable: true
      });
      setSelectedEvent(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to list your ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Tickets</h1>
            <p className="text-gray-600">List your tickets safely and securely on socialdealr</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <EventSelector 
                  events={events}
                  selectedEvent={selectedEvent}
                  onEventSelect={handleEventSelect}
                />

                {selectedEvent && (
                  <>
                    <TicketDetailsForm 
                      formData={formData}
                      onInputChange={handleInputChange}
                    />

                    <ImageUpload />

                    <div className="flex gap-4 pt-6">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        disabled={loading || !selectedEvent}
                      >
                        {loading ? 'Listing Ticket...' : 'List Ticket'}
                      </Button>
                      <Button type="button" variant="outline" className="flex-1">
                        Save as Draft
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SellTickets;
