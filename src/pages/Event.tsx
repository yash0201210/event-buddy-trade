
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useParams } from 'react-router-dom';
import { EventHeader } from '@/components/event/EventHeader';
import { TicketAlert } from '@/components/event/TicketAlert';
import { AvailableTickets } from '@/components/event/AvailableTickets';
import { EventInformation } from '@/components/event/EventInformation';
import { SellTicketPrompt } from '@/components/event/SellTicketPrompt';
import { SimilarEvents } from '@/components/event/SimilarEvents';
import { UniTicketingSolution } from '@/components/home/UniTicketingSolution';
import { SoldTicketsCounter } from '@/components/event/SoldTicketsCounter';
import { EventLoading } from '@/components/event/EventLoading';
import { EventNotFound } from '@/components/event/EventNotFound';
import { useEventData } from '@/hooks/useEventData';

const Event = () => {
  const { id } = useParams();
  
  const {
    event,
    venue,
    university,
    tickets,
    soldTicketsCount,
    eventLoading,
    ticketsLoading,
  } = useEventData(id);

  if (eventLoading) {
    return <EventLoading />;
  }

  if (!event) {
    return <EventNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Event Header - Full Width */}
        <EventHeader event={event} venue={venue} university={university} />

        {/* Narrow Content Area */}
        <div className="max-w-4xl mx-auto mt-12">
          {/* Available Tickets */}
          <AvailableTickets tickets={tickets} isLoading={ticketsLoading} />

          {/* Ticket Alert */}
          <TicketAlert eventId={event.id} />

          {/* Sold Tickets Counter */}
          <SoldTicketsCounter count={soldTicketsCount} />

          {/* Event Information */}
          <EventInformation event={event} venue={venue} university={university} />

          {/* Sell Ticket Prompt */}
          <SellTicketPrompt eventId={event.id} />

          {/* Similar Events */}
          <SimilarEvents currentEvent={event} />
        </div>

        {/* University Ticketing Solution Banner - Full Width */}
        <UniTicketingSolution />
      </main>
      
      <Footer />
    </div>
  );
};

export default Event;
