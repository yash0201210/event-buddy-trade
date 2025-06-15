
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Download, Star, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PurchasedTicket } from '@/hooks/usePurchasedTickets';
import { format } from 'date-fns';

interface PurchasedTicketCardProps {
  ticket: PurchasedTicket;
  onDownload: (ticket: PurchasedTicket) => void;
  onViewDetails: (ticketId: string) => void;
}

export const PurchasedTicketCard = ({ ticket, onDownload, onViewDetails }: PurchasedTicketCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <CardHeader className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl font-bold text-gray-900">{ticket.ticket.events?.name || 'Event Name'}</CardTitle>
        <Badge 
          variant={
            ticket.status === 'completed' ? 'default' : 
            ticket.status === 'confirmed' ? 'secondary' : 
            'outline'
          }
          className="w-fit"
        >
          {ticket.status === 'completed' ? 'Ready' : 
           ticket.status === 'confirmed' ? 'Pending Transfer' : 
           'Pending Seller'}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(new Date(ticket.ticket.events?.event_date || ''), 'PPP')}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{ticket.ticket.events?.venue}, {ticket.ticket.events?.city}</span>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Price: €{ticket.amount_paid}</p>
            <p className="text-sm text-gray-600">Quantity: {ticket.ticket.quantity}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t">
          <div className="flex items-center">
            <span>Seller: {ticket.seller?.full_name || 'Unknown'}</span>
            {ticket.seller?.is_verified && (
              <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        </div>

        {ticket.status === 'pending' && (
          <div className="bg-yellow-50 p-3 rounded-lg mt-4">
            <div className="flex items-center text-yellow-800">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">Waiting for seller confirmation</span>
            </div>
          </div>
        )}

        {ticket.status === 'confirmed' && !ticket.buyer_confirmed && (
          <div className="bg-blue-50 p-3 rounded-lg mt-4">
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
          <div className="bg-orange-50 p-3 rounded-lg mt-4">
            <div className="flex items-center text-orange-800">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">Transfer confirmed - waiting for seller</span>
            </div>
          </div>
        )}
        
        {ticket.status === 'completed' && (
          <div className="flex gap-2 mt-4">
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
        )}
      </CardContent>
    </Card>
  );
};
