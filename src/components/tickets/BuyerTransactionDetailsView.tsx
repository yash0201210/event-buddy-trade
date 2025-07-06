
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

  // Get consistent status display that matches the card
  const getStatusDisplay = () => {
    if (ticket.status === 'completed') {
      return { 
        label: 'Transaction Completed', 
        variant: 'default' as const,
        bgColor: 'bg-gradient-to-r from-green-50 to-blue-50',
        borderColor: 'border-green-200'
      };
    } else if (ticket.status === 'confirmed') {
      if (ticket.buyer_confirmed && !ticket.seller_confirmed) {
        return { 
          label: 'Payment Sent - Awaiting Confirmation', 
          variant: 'secondary' as const,
          bgColor: 'bg-gradient-to-r from-orange-50 to-yellow-50',
          borderColor: 'border-orange-200'
        };
      } else {
        return { 
          label: 'Payment Required', 
          variant: 'secondary' as const,
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200'
        };
      }
    } else {
      return { 
        label: 'Awaiting Seller Response', 
        variant: 'outline' as const,
        bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50',
        borderColor: 'border-yellow-200'
      };
    }
  };

  const statusDisplay = getStatusDisplay();

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

      {/* Transaction Status Header */}
      <Card className={`${statusDisplay.bgColor} ${statusDisplay.borderColor}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{statusDisplay.label}</h2>
              <p className="text-sm text-gray-600">
                {ticket.status === 'completed' && 'Your ticket purchase was successful'}
                {ticket.status === 'confirmed' && !ticket.buyer_confirmed && 'Payment details have been shared'}
                {ticket.status === 'confirmed' && ticket.buyer_confirmed && !ticket.seller_confirmed && 'Payment confirmed, waiting for seller'}
                {ticket.status === 'pending' && 'Waiting for seller to confirm your purchase request'}
              </p>
            </div>
          </div>
          <div className="bg-white/50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              {ticket.status === 'completed' && '✅ Payment confirmed and processed\n📧 Seller has acknowledged receipt\n🎫 Your ticket is ready for download'}
              {ticket.status === 'confirmed' && !ticket.buyer_confirmed && '📧 Bank details shared by seller\n💰 Transfer payment to complete purchase\n✉️ Confirm transfer in messages'}
              {ticket.status === 'confirmed' && ticket.buyer_confirmed && !ticket.seller_confirmed && '💰 Payment transfer confirmed\n⏳ Waiting for seller to acknowledge receipt\n📧 Seller will confirm and provide tickets'}
              {ticket.status === 'pending' && '📝 Purchase request sent to seller\n⏳ Awaiting seller response\n📧 You will be notified once accepted'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transaction Summary
            <Badge variant={statusDisplay.variant} className="text-xs">
              {ticket.status === 'completed' ? 'Completed' : 
               ticket.status === 'confirmed' ? 'In Progress' : 
               'Pending'}
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
              <span className="text-gray-600">Amount:</span>
              <p className="font-semibold text-lg">€{ticket.amount_paid}</p>
            </div>
            <div>
              <span className="text-gray-600">Payment Status:</span>
              <p className={`font-medium ${
                ticket.status === 'completed' ? 'text-green-600' : 
                ticket.buyer_confirmed ? 'text-orange-600' : 
                'text-yellow-600'
              }`}>
                {ticket.status === 'completed' ? 'Confirmed' : 
                 ticket.buyer_confirmed ? 'Sent' : 
                 'Pending'}
              </p>
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
            {ticket.status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRatingDialog(true)}
              >
                <Star className="h-4 w-4 mr-2" />
                Rate Seller
              </Button>
            )}
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
            {ticket.status === 'completed' && (
              <Button 
                onClick={handleDownloadTicket}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {ticket.status === 'completed' && (
        <SellerRatingDialog
          isOpen={showRatingDialog}
          onClose={() => setShowRatingDialog(false)}
          sellerName={ticket.seller.full_name}
          transactionId={ticket.id}
        />
      )}
    </div>
  );
};
