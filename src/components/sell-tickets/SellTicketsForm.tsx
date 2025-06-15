
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventSelector } from './EventSelector';
import { TicketDetailsForm } from './TicketDetailsForm';

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
  pdfUrl?: string;
  qrCodeHash?: string;
}

interface SellTicketsFormProps {
  events: Event[];
  selectedEvent: Event | null;
  ticketData: TicketFormData;
  loading: boolean;
  onEventSelect: (eventId: string | null) => void;
  onTicketDataChange: (data: TicketFormData) => void;
  onSubmitEventRequest: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SellTicketsForm = ({
  events,
  selectedEvent,
  ticketData,
  loading,
  onEventSelect,
  onTicketDataChange,
  onSubmitEventRequest,
  onSubmit
}: SellTicketsFormProps) => {
  return (
    <div className="space-y-8">
      <EventSelector
        events={events}
        selectedEvent={selectedEvent}
        onEventSelect={onEventSelect}
        onSubmitEventRequest={onSubmitEventRequest}
      />

      {selectedEvent && (
        <form onSubmit={onSubmit} className="space-y-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketDetailsForm
                data={ticketData}
                onChange={onTicketDataChange}
                selectedEvent={selectedEvent}
              />
            </CardContent>
          </Card>

          <div className="max-w-4xl mx-auto px-4">
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Listing Ticket...' : 'List Ticket for Sale'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
