
import React from 'react';
import { PurchaseRequestMessage } from './PurchaseRequestMessage';
import { OrderConfirmedMessage } from './OrderConfirmedMessage';
import { TransferConfirmationMessage } from './TransferConfirmationMessage';
import { FundsReceivedMessage } from './FundsReceivedMessage';
import { CounterOfferMessage } from './CounterOfferMessage';
import { RegularMessage } from './RegularMessage';

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
  onAcceptCounterOffer: (conversationId: string) => void;
  onRejectCounterOffer: (conversationId: string, newAmount: number) => void;
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
  onAcceptCounterOffer,
  onRejectCounterOffer,
  onConfirmTransfer,
  onViewTransactionDetails,
  onFundsReceived,
  onNavigateToSellingHub
}: MessageBubbleProps) => {
  const messageProps = {
    message,
    isOwn,
    isUserBuyer,
    conversationId: selectedConv.id
  };

  switch (message.message_type) {
    case 'purchase_request':
      return (
        <PurchaseRequestMessage
          {...messageProps}
          onAcceptPurchaseRequest={onAcceptPurchaseRequest}
          onRejectPurchaseRequest={onRejectPurchaseRequest}
        />
      );
    
    case 'order_confirmed':
      return (
        <OrderConfirmedMessage
          {...messageProps}
          onConfirmTransfer={onConfirmTransfer}
        />
      );
    
    case 'transfer_confirmation':
      return (
        <TransferConfirmationMessage
          {...messageProps}
          selectedConv={selectedConv}
          onViewTransactionDetails={onViewTransactionDetails}
          onFundsReceived={onFundsReceived}
        />
      );
    
    case 'funds_received':
      return (
        <FundsReceivedMessage
          {...messageProps}
          onNavigateToSellingHub={onNavigateToSellingHub}
        />
      );
    
    case 'counter_offer':
      // Extract the amount from the message content
      const counterAmountMatch = message.content.match(/£(\d+(?:\.\d{2})?)/);
      const counterAmount = counterAmountMatch ? parseFloat(counterAmountMatch[1]) : selectedConv.ticket_price || 0;
      
      return (
        <CounterOfferMessage
          {...messageProps}
          counterAmount={counterAmount}
          originalAmount={selectedConv.ticket_price || 0}
          onAcceptCounterOffer={onAcceptCounterOffer}
          onRejectCounterOffer={onRejectCounterOffer}
        />
      );
    
    default:
      return <RegularMessage message={message} isOwn={isOwn} />;
  }
};
