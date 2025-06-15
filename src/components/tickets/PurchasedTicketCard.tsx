
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Download, Star, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PurchasedTicket } from '@/hooks/usePurchasedTickets';

interface PurchasedTicketCardProps {
  ticket: PurchasedTicket;
  onDownload: (ticket: PurchasedTicket) => void;
  onViewDetails: (ticketId: string) => void;
}

export const PurchasedTicketCard = ({ ticket, onDownload, onViewDetails }: PurchasedTicketCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold">
            {ticket.ticket.events.name}
          </CardTitle>
          <Badge 
            variant={
              ticket.status === 'completed' ? 'default' : 
              ticket.status === 'confirmed' ? 'secondary' : 
              'outline'
            }
          >
            {ticket.status === 'completed' ? 'Ready' : 
             ticket.status === 'confirmed' ? 'Pending Transfer' : 
             'Pending Seller'}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{ticket.ticket.events.venue}, {ticket.ticket.events.city}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(ticket.ticket.events.event_date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{ticket.ticket.quantity} x {ticket.ticket.ticket_type}</span>
            <span className="font-semibold">€{ticket.amount_paid}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <span>Seller: {ticket.seller.full_name}</span>
              {ticket.seller.is_verified && (
                <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
              )}
            </div>
          </div>

          {ticket.status === 'pending' && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center text-yellow-800">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Waiting for seller confirmation</span>
              </div>
            </div>
          )}

          {ticket.status === 'confirmed' && !ticket.buyer_confirmed && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                Payment details have been shared. Please transfer funds and confirm in messages.
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate('/messages')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Go to Messages
              </Button>
            </div>
          )}

          {ticket.status === 'confirmed' && ticket.buyer_confirmed && !ticket.seller_confirmed && (
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center text-orange-800">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Transfer confirmed - waiting for seller</span>
              </div>
            </div>
          )}
          
          {ticket.status === 'completed' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => onDownload(ticket)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Ticket
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => onViewDetails(ticket.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
