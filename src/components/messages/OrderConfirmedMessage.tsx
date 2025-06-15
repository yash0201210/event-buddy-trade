
import React from 'react';
import { Button } from '@/components/ui/button';

interface OrderConfirmedMessageProps {
  message: {
    id: string;
    content: string;
    created_at: string;
  };
  isOwn: boolean;
  isUserBuyer: boolean;
  conversationId: string;
  onConfirmTransfer: (conversationId: string) => void;
}

export const OrderConfirmedMessage = ({
  message,
  isOwn,
  isUserBuyer,
  conversationId,
  onConfirmTransfer
}: OrderConfirmedMessageProps) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md px-4 py-3 rounded-lg border ${
        isOwn 
          ? 'bg-red-600 text-white border-red-600' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="font-semibold text-green-800 text-sm mb-2">Order Confirmed!</h4>
            <p className="text-xs text-gray-700 mb-3">
              The order has now been confirmed. Transfer €9.73 to the seller using the bank details below:
            </p>
            
            <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
              <div><span className="font-medium">Full Name:</span> Yash Agrawal</div>
              <div><span className="font-medium">Sort Code:</span> XX - XX - XX</div>
              <div><span className="font-medium">Account Number:</span> 12736892</div>
            </div>
            
            <p className="text-xs text-gray-600 mt-2">
              Remember to confirm here once you have sent this money across!
            </p>
          </div>
        </div>

        <p className={`text-xs mt-3 ${isOwn ? 'text-red-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>

        {!isOwn && isUserBuyer && (
          <div className="mt-3">
            <Button
              size="sm"
              onClick={() => onConfirmTransfer(conversationId)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs w-full"
            >
              Confirm Transfer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
