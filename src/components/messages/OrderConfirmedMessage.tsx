
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
            
            <div className="bg-gray-50 p-3 rounded text-xs space-y-1 border">
              <div className="text-gray-800"><span className="font-medium text-gray-900">Full Name:</span> Yash Agrawal</div>
              <div className="text-gray-800"><span className="font-medium text-gray-900">Sort Code:</span> XX - XX - XX</div>
              <div className="text-gray-800"><span className="font-medium text-gray-900">Account Number:</span> 12736892</div>
            </div>
            
            <p className="text-xs text-gray-600 mt-2">
              Remember to confirm here once you have sent this money across!
            </p>
          </div>
        </div>

        {!isOwn && isUserBuyer && (
          <div className="mt-3 mb-2">
            <Button
              size="sm"
              onClick={() => onConfirmTransfer(conversationId)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs w-full"
            >
              Confirm Transfer
            </Button>
          </div>
        )}

        <p className={`text-xs ${isOwn ? 'text-red-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};
