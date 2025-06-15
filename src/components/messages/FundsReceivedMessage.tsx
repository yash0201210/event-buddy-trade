
import React from 'react';
import { Button } from '@/components/ui/button';

interface FundsReceivedMessageProps {
  message: {
    id: string;
    content: string;
    created_at: string;
  };
  isOwn: boolean;
  isUserBuyer: boolean;
  onNavigateToSellingHub: () => void;
}

export const FundsReceivedMessage = ({
  message,
  isOwn,
  isUserBuyer,
  onNavigateToSellingHub
}: FundsReceivedMessageProps) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md px-4 py-3 rounded-lg border ${
        isOwn 
          ? 'bg-red-600 text-white border-red-600' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="font-semibold text-green-800 text-sm mb-2">Transaction Complete!</h4>
            <p className="text-xs text-gray-700 mb-2">
              Funds have been received. This transaction is now complete, thank you!
            </p>
            <p className="text-xs text-gray-600">
              You can view all your selling activity in your Selling Hub.
            </p>
          </div>
        </div>

        <p className={`text-xs mt-3 ${isOwn ? 'text-red-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>

        {isOwn && !isUserBuyer && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onNavigateToSellingHub}
              className="text-xs w-full bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
            >
              Go to My Selling Hub
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
