
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User, Star, Edit, MessageSquare, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { EditTicketDialog } from './EditTicketDialog';

interface ListingTicket {
  id: string;
  title: string;
  ticket_type: string;
  quantity: number;
  selling_price: number;
  original_price: number;
  status: string;
  is_negotiable: boolean;
  description?: string;
  created_at: string;
  events: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
  };
  offers?: Array<{
    id: string;
    offered_price: number;
    status: string;
    created_at: string;
    message?: string;
    profiles: {
      full_name: string;
      is_verified: boolean;
    };
  }>;
  conversations?: Array<{
    id: string;
    buyer_id: string;
    status: string;
    profiles: {
      full_name: string;
      is_verified: boolean;
    };
  }>;
}

interface ListingDetailsViewProps {
  ticket: ListingTicket;
  onBack: () => void;
  onUpdate: () => void;
}

export const ListingDetailsView = ({ ticket, onBack, onUpdate }: ListingDetailsViewProps) => {
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const pendingOffers = ticket.offers?.filter(offer => offer.status === 'pending') || [];
  const hasActiveConversations = ticket.conversations && ticket.conversations.length > 0;

  const getListingStatus = () => {
    if (hasActiveConversations) return 'In Progress';
    if (pendingOffers.length > 0) return 'Has Offers';
    return 'Listed';
  };

  const getStatusColor = () => {
    if (hasActiveConversations) return 'bg-blue-100 text-blue-700';
    if (pendingOffers.length > 0) return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          size="sm"
        >
          ← Back to Selling Hub
        </Button>
      </div>

      {/* Listing Status Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{ticket.events.name}</h2>
              <p className="text-gray-600">Listed on {format(new Date(ticket.created_at), 'PPP')}</p>
            </div>
            <Badge className={getStatusColor()}>
              {getListingStatus()}
            </Badge>
          </div>
          
          <div className="bg-white/50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              💰 Current asking price: €{ticket.selling_price}<br/>
              📊 {pendingOffers.length} pending offers<br/>
              💬 {hasActiveConversations ? 'Active conversations' : 'No active conversations'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Listing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Listing Summary
            <Badge variant="outline" className="text-xs">
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Listing ID:</span>
              <p className="font-mono text-xs">{ticket.id}</p>
            </div>
            <div>
              <span className="text-gray-600">Listed Date:</span>
              <p>{format(new Date(ticket.created_at), 'PPP')}</p>
            </div>
            <div>
              <span className="text-gray-600">Asking Price:</span>
              <p className="font-semibold text-lg">€{ticket.selling_price}</p>
            </div>
            <div>
              <span className="text-gray-600">Quantity:</span>
              <p className="font-medium">{ticket.quantity}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className="font-semibold text-lg">{ticket.events.name}</h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{ticket.events.venue}, {ticket.events.city}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(new Date(ticket.events.event_date), 'PPP')}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm"><strong>Ticket Type:</strong> {ticket.ticket_type}</p>
            <p className="text-sm"><strong>Original Price:</strong> €{ticket.original_price}</p>
            <p className="text-sm"><strong>Negotiable:</strong> {ticket.is_negotiable ? 'Yes' : 'No'}</p>
            {ticket.description && (
              <p className="text-sm mt-2"><strong>Description:</strong> {ticket.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offers Section */}
      {pendingOffers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Offers ({pendingOffers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOffers.map((offer) => (
                <div key={offer.id} className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{offer.profiles.full_name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          {offer.profiles.is_verified && (
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          )}
                          <span>{offer.profiles.is_verified ? 'Verified' : 'New'} Buyer</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">€{offer.offered_price}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(offer.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  {offer.message && (
                    <p className="text-sm text-gray-600 mt-2">"{offer.message}"</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1">
                      Accept Offer
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Counter Offer
                    </Button>
                    <Button size="sm" variant="destructive">
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Conversations */}
      {hasActiveConversations && (
        <Card>
          <CardHeader>
            <CardTitle>Active Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ticket.conversations?.map((conversation) => (
                <div key={conversation.id} className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{conversation.profiles.full_name}</p>
                        <Badge variant="outline" className="text-xs">
                          {conversation.status}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/messages')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Messages
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowEditDialog(true)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
            <Button 
              onClick={() => navigate('/messages')}
              variant="outline"
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Messages
            </Button>
          </div>
        </CardContent>
      </Card>

      {showEditDialog && (
        <EditTicketDialog
          ticket={ticket}
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSuccess={() => {
            onUpdate();
            setShowEditDialog(false);
          }}
        />
      )}
    </div>
  );
};
