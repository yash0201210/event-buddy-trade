
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User, Star, Shield, MessageSquare, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SellerRatingDialog } from './SellerRatingDialog';
import { TransactionStatusCard } from './TransactionStatusCard';
import { useTicketDownload } from '@/hooks/useTicketDownload';
import { PurchasedTicket } from '@/hooks/usePurchasedTickets';

interface BuyerTransactionDetailsViewProps {
  ticket: PurchasedTicket;
  onBack: () => void;
}

export const BuyerTransactionDetailsView = ({ ticket, onBack }: BuyerTransactionDetailsViewProps) => {
  const navigate = useNavigate();
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const { downloadTicket } = useTicketDownload();

  const handleDownloadTicket = () => {
    downloadTicket(ticket);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          size="sm"
        >
          ← Back to My Tickets
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
              <p className="text-sm text-gray-600">Your ticket purchase was successful</p>
            </div>
          </div>
          <div className="bg-white/50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              ✅ Payment confirmed and processed<br/>
              📧 Seller has acknowledged receipt<br/>
              🎫 Your ticket is ready for download
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transaction Summary
            <Badge variant="default" className="text-xs bg-green-600">
              Completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Transaction ID:</span>
              <p className="font-mono text-xs">{ticket.id}</p>
            </div>
            <div>
              <span className="text-gray-600">Purchase Date:</span>
              <p>{new Date(ticket.transaction_date).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Amount Paid:</span>
              <p className="font-semibold text-lg">€{ticket.amount_paid}</p>
            </div>
            <div>
              <span className="text-gray-600">Payment Status:</span>
              <p className="text-green-600 font-medium">Confirmed</p>
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
          <h3 className="font-semibold text-lg">{ticket.ticket.events.name}</h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{ticket.ticket.events.venue}, {ticket.ticket.events.city}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(ticket.ticket.events.event_date).toLocaleDateString()}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm"><strong>Ticket Type:</strong> {ticket.ticket.ticket_type}</p>
            <p className="text-sm"><strong>Quantity:</strong> {ticket.ticket.quantity}</p>
            <p className="text-sm"><strong>Total Paid:</strong> €{ticket.amount_paid}</p>
          </div>
        </CardContent>
      </Card>

      {/* Seller Information */}
      <Card>
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">{ticket.seller.full_name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{ticket.seller.is_verified ? 'Verified Seller' : 'New Seller'}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRatingDialog(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Rate Seller
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/messages')}
              variant="outline"
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Messages
            </Button>
            <Button 
              onClick={handleDownloadTicket}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      <SellerRatingDialog
        isOpen={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        sellerName={ticket.seller.full_name}
        transactionId={ticket.id}
      />
    </div>
  );
};
