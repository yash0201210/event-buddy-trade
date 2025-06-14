
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User, Star, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface TransactionDetailsViewProps {
  ticket: SellerTicket;
  onBack: () => void;
}

export const TransactionDetailsView = ({ ticket, onBack }: TransactionDetailsViewProps) => {
  const navigate = useNavigate();

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

      {/* Transaction Completed Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transaction Completed</h2>
              <p className="text-sm text-gray-600">Your ticket has been successfully sold</p>
            </div>
          </div>
          <div className="bg-white/50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              ✅ Payment received and confirmed<br/>
              📧 Ticket delivered to buyer<br/>
              💰 Funds are ready for withdrawal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transaction Status
            <Badge variant="default" className="text-xs bg-green-600">
              Completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Purchase Request Received</span>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              Complete
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Order Confirmed</span>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              Complete
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Payment Received</span>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              Complete
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Funds Confirmed</span>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              Complete
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
            <span>{new Date(ticket.events.event_date).toLocaleDateString()}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm"><strong>Ticket Type:</strong> {ticket.ticket_type}</p>
            <p className="text-sm"><strong>Quantity:</strong> {ticket.quantity}</p>
            <p className="text-sm"><strong>Sale Price:</strong> €{ticket.selling_price}</p>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Information */}
      {ticket.conversation && (
        <Card>
          <CardHeader>
            <CardTitle>Buyer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">{ticket.conversation.buyer.full_name}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>{ticket.conversation.buyer.is_verified ? 'Verified Buyer' : 'New Buyer'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/messages')}
              variant="outline"
              className="flex-1"
            >
              View Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
