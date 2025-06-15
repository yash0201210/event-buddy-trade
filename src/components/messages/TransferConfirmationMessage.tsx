
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TransferConfirmationMessageProps {
  message: {
    id: string;
    content: string;
    created_at: string;
  };
  isOwn: boolean;
  isUserBuyer: boolean;
  selectedConv: {
    id: string;
    event_name?: string;
    ticket_price?: number;
  };
  onViewTransactionDetails: (conversationId: string) => void;
  onFundsReceived: (conversationId: string) => void;
}

export const TransferConfirmationMessage = ({
  message,
  isOwn,
  isUserBuyer,
  selectedConv,
  onViewTransactionDetails,
  onFundsReceived
}: TransferConfirmationMessageProps) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md px-4 py-3 rounded-lg border ${
        isOwn 
          ? 'bg-red-600 text-white border-red-600' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="font-semibold text-blue-800 text-sm mb-2">Funds Transferred!</h4>
            <p className="text-xs text-gray-700 mb-3">
              Payment has been sent. Once the seller confirms they have received the funds, you will be able to view your ticket.
            </p>
          </div>
        </div>

        <p className={`text-xs mt-3 ${isOwn ? 'text-red-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>

        {isOwn && isUserBuyer && (
          <div 
            className="mt-3 p-3 bg-blue-100 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
            onClick={() => onViewTransactionDetails(selectedConv.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-800 text-xs">Transaction Status</h4>
              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
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

        {!isOwn && !isUserBuyer && (
          <div className="mt-3">
            <Button
              size="sm"
              onClick={() => onFundsReceived(selectedConv.id)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs w-full"
            >
              Funds Received
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
