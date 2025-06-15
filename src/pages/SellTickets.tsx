
import React from 'react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SellTicketsForm } from '@/components/sell-tickets/SellTicketsForm';
import { AuthenticationRequired } from '@/components/sell-tickets/AuthenticationRequired';
import { LoadingState } from '@/components/sell-tickets/LoadingState';
import { useSellTickets } from '@/hooks/useSellTickets';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SellTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    selectedEvent,
    ticketData,
    loading,
    handleEventSelect,
    setTicketData,
    handleSubmit,
  } = useSellTickets();

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
    return <AuthenticationRequired />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  const handleEventSelectWrapper = (eventId: string | null) => {
    handleEventSelect(eventId, events);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pb-8">
        <SellTicketsForm
          events={events}
          selectedEvent={selectedEvent}
          ticketData={ticketData}
          loading={loading}
          onEventSelect={handleEventSelectWrapper}
          onTicketDataChange={setTicketData}
          onSubmitEventRequest={() => navigate('/submit-event')}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
};

export default SellTickets;
