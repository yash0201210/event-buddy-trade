
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

interface CurrentListingsTabProps {
  tickets: Ticket[];
  onViewListing: (ticketId: string) => void;
}

export const CurrentListingsTab = ({ tickets, onViewListing }: CurrentListingsTabProps) => {
  const navigate = useNavigate();

  if (tickets.length === 0) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No current listings
          </h3>
          <p className="text-gray-600 mb-4">
            You haven't listed any tickets yet. Start selling to reach thousands of potential buyers.
          </p>
          <Button 
            onClick={() => navigate('/sell-tickets')}
            className="bg-[#E8550D] hover:bg-[#D44B0B] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Sell Tickets
          </Button>
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
            onView={() => onViewListing(ticket.id)}
          />
          <Button 
            onClick={() => onViewListing(ticket.id)}
            variant="outline"
            className="w-full"
          >
            View Listing
          </Button>
        </div>
      ))}
    </div>
  );
};
