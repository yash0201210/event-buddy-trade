
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Edit, Star } from 'lucide-react';

interface SellerTicket {
  id: string;
  title: string;
  ticket_type: string;
  quantity: number;
  selling_price: number;
  original_price: number;
  status: string;
  is_negotiable: boolean;
  created_at: string;
  events: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
  };
  has_offers: boolean;
  latest_offer?: {
    offered_price: number;
    status: string;
  };
  conversation?: {
    id: string;
    buyer_id: string;
    transaction_status: string;
    buyer_confirmed: boolean;
    seller_confirmed: boolean;
    buyer: {
      full_name: string;
      is_verified: boolean;
    };
  };
}

interface TicketCardProps {
  ticket: SellerTicket;
  showEditButton?: boolean;
  onEdit?: (ticket: SellerTicket) => void;
  onView?: (ticket: SellerTicket) => void;
}

export const TicketCard = ({ ticket, showEditButton = false, onEdit, onView }: TicketCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => ticket.conversation ? onView?.(ticket) : undefined}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold">
            {ticket.events.name}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={
              ticket.conversation?.transaction_status === 'completed' ? 'default' : 
              ticket.status === 'available' ? 'secondary' : 'outline'
            }>
              {ticket.conversation?.transaction_status === 'completed' ? 'Sold' :
               ticket.status === 'available' ? 'Listed' : 'In Progress'}
            </Badge>
            {ticket.has_offers && !ticket.conversation && (
              <Badge variant="outline" className="bg-blue-50">
                Has Offers
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{ticket.events.venue}, {ticket.events.city}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(ticket.events.event_date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{ticket.quantity} x {ticket.ticket_type}</span>
            <span className="font-semibold">€{ticket.selling_price}</span>
          </div>
          
          {ticket.conversation && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Buyer: {ticket.conversation.buyer.full_name}</span>
                {ticket.conversation.buyer.is_verified && (
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">
                  {ticket.conversation.transaction_status === 'completed' ? 'Completed' : 
                   ticket.conversation.buyer_confirmed ? 'Payment Received' : 
                   'Awaiting Payment'}
                </Badge>
              </div>
            </div>
          )}

          {ticket.latest_offer && !ticket.conversation && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Latest offer: €{ticket.latest_offer.offered_price}
                <span className="ml-2">
                  <Badge variant="outline" className="text-xs">
                    {ticket.latest_offer.status}
                  </Badge>
                </span>
              </p>
            </div>
          )}

          {showEditButton && !ticket.conversation && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(ticket);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
