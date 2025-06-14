
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  message_type: string;
  created_at: string;
}

interface Conversation {
  id: string;
  ticket_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  created_at: string;
  ticket_title?: string;
  ticket_price?: number;
  event_name?: string;
  event_venue?: string;
  event_date?: string;
  buyer_name?: string;
  seller_name?: string;
  messages: Message[];
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isUserBuyer: boolean;
  selectedConv: Conversation;
  onAcceptPurchaseRequest: (conversationId: string) => void;
  onRejectPurchaseRequest: (conversationId: string) => void;
  onConfirmTransfer: (conversationId: string) => void;
  onViewTransactionDetails: (conversationId: string) => void;
  onFundsReceived: (conversationId: string) => void;
  onNavigateToSellingHub: () => void;
}

export const MessageBubble = ({
  message,
  isOwn,
  isUserBuyer,
  selectedConv,
  onAcceptPurchaseRequest,
  onRejectPurchaseRequest,
  onConfirmTransfer,
  onViewTransactionDetails,
  onFundsReceived,
  onNavigateToSellingHub
}: MessageBubbleProps) => {
  const isPurchaseRequest = message.message_type === 'purchase_request';
  const isOrderConfirmed = message.message_type === 'order_confirmed';
  const isTransferConfirmation = message.message_type === 'transfer_confirmation';
  const isFundsReceived = message.message_type === 'funds_received';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
        isOwn 
          ? 'bg-red-600 text-white' 
          : isPurchaseRequest
            ? 'bg-gray-100 border'
            : isOrderConfirmed
              ? 'bg-green-100 border border-green-300'
              : isTransferConfirmation
                ? 'bg-blue-100 border border-blue-300'
                : isFundsReceived
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-gray-100'
      }`}>
        <div className="whitespace-pre-line text-sm">{message.content}</div>
        <p className={`text-xs mt-2 ${isOwn ? 'text-red-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        
        {/* Purchase Request Actions - only show for sellers */}
        {isPurchaseRequest && !isOwn && !isUserBuyer && (
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => onAcceptPurchaseRequest(selectedConv.id)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRejectPurchaseRequest(selectedConv.id)}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Counter Offer
            </Button>
          </div>
        )}

        {/* Transfer Confirmation Actions - only show for buyers */}
        {isOrderConfirmed && !isOwn && isUserBuyer && (
          <div className="mt-3">
            <Button
              size="sm"
              onClick={() => onConfirmTransfer(selectedConv.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs w-full"
            >
              Confirm Transfer
            </Button>
          </div>
        )}

        {/* Clickable Transaction Details Box - show for buyers after they confirm transfer */}
        {isTransferConfirmation && isOwn && isUserBuyer && (
          <div 
            className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => onViewTransactionDetails(selectedConv.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-800 text-xs">Transaction Status</h4>
              <Badge variant="outline" className="text-xs">
                Pending Seller
              </Badge>
            </div>
            <p className="text-xs text-blue-700 mb-2">
              {selectedConv.event_name} • €{selectedConv.ticket_price}
            </p>
            <p className="text-xs text-blue-600">
              📍 Waiting for seller to confirm receipt
            </p>
            <div className="mt-2 text-xs text-blue-500 italic">
              Click to view full transaction details →
            </div>
          </div>
        )}

        {/* Funds Received Action - only show for sellers */}
        {isTransferConfirmation && !isOwn && !isUserBuyer && (
          <div className="mt-3">
            <Button
              size="sm"
              onClick={() => onFundsReceived(selectedConv.id)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs w-full"
            >
              Funds Received
            </Button>
          </div>
        )}

        {/* Go to Selling Hub link - show for sellers after funds received */}
        {isFundsReceived && isOwn && !isUserBuyer && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onNavigateToSellingHub}
              className="text-xs w-full bg-white hover:bg-gray-50"
            >
              Go to My Selling Hub
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
