
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TicketCard } from './TicketCard';

interface Ticket {
  id: string;
  created_at: string;
  event_id: string;
  seller_id: string;
  selling_price: number;
  quantity: number;
  ticket_type: string;
  title: string;
  status: string;
  sold_at?: string;
  original_price: number;
  is_negotiable: boolean;
  description?: string;
  events: {
    name: string;
    event_date: string;
    venue: string;
    city: string;
  };
}

interface SellingHistoryTabProps {
  tickets: Ticket[];
  onViewDetails: (ticketId: string) => void;
}

export const SellingHistoryTab = ({ tickets, onViewDetails }: SellingHistoryTabProps) => {
  if (tickets.length === 0) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tickets sold yet
          </h3>
          <p className="text-gray-600">
            Your selling history will appear here once you make your first sale.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="space-y-3">
          <TicketCard
            ticket={{
              ...ticket,
              has_offers: false, // We'll enhance this later with real data
            }}
            onView={() => onViewDetails(ticket.id)}
          />
          <Button 
            onClick={() => onViewDetails(ticket.id)}
            variant="outline"
            className="w-full"
          >
            View Details
          </Button>
        </div>
      ))}
    </div>
  );
};
