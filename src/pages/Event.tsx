
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EventHeader } from '@/components/event/EventHeader';
import { EventInformation } from '@/components/event/EventInformation';
import { AvailableTickets } from '@/components/event/AvailableTickets';
import { SimilarEvents } from '@/components/event/SimilarEvents';
import { EventNotFound } from '@/components/event/EventNotFound';
import { EventLoading } from '@/components/event/EventLoading';
import { useEventDetails } from '@/hooks/useEventDetails';

const Event = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    event: dbEvent,
    venue,
    university,
    tickets,
    soldTicketsCount,
    eventLoading,
    ticketsLoading,
  } = useEventDetails(id);

  if (eventLoading) {
    return (
      <Layout>
        <EventLoading />
      </Layout>
    );
  }

  if (!dbEvent) {
    return (
      <Layout>
        <EventNotFound />
      </Layout>
    );
  }

  // Convert database event to frontend Event format
  const event = {
    ...dbEvent,
    event_date: dbEvent.start_date_time
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <EventHeader 
          event={event} 
          venue={venue} 
          university={university}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <EventInformation event={event} venue={venue} university={university} />
          </div>
          
          <div className="lg:col-span-1">
            <AvailableTickets 
              tickets={tickets} 
              isLoading={ticketsLoading}
            />
          </div>
        </div>

        <SimilarEvents currentEvent={event} />
      </div>
    </Layout>
  );
};

export default Event;
