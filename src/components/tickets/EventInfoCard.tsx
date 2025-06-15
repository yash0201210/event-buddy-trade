
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Shield } from 'lucide-react';

interface EventInfoCardProps {
  ticket: {
    events: {
      name: string;
      venue: string;
      city: string;
      event_date: string;
    };
    ticket_type: string;
    quantity: number;
    description?: string;
    is_negotiable: boolean;
    profiles: {
      is_verified: boolean;
    };
  };
}

export const EventInfoCard = ({ ticket }: EventInfoCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{ticket.events.name}</h1>
        
        <div className="space-y-3 text-gray-600 mb-6">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-3" />
            <span>{ticket.events.venue}, {ticket.events.city}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-3" />
            <span>{new Date(ticket.events.event_date).toLocaleDateString('en-GB', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Ticket Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-semibold">{ticket.ticket_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-semibold">{ticket.quantity}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-green-100 text-green-700">
              <Clock className="h-3 w-3 mr-1" />
              Available
            </Badge>
            {ticket.profiles.is_verified && (
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                Verified Seller
              </Badge>
            )}
            {ticket.is_negotiable && (
              <Badge variant="secondary">
                Negotiable
              </Badge>
            )}
          </div>

          {ticket.description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Ticket Description</h4>
              <p className="text-gray-700 text-sm">{ticket.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
