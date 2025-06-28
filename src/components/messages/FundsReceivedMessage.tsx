
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
      <div className={`max-w-md px-4 py-4 rounded-2xl border ${
        isOwn 
          ? 'bg-blue-600 text-white border-blue-600 ml-4' 
          : 'bg-green-50 border-green-200 text-gray-900 mr-4'
      }`}>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <h4 className="font-semibold text-green-800 text-sm">Transaction Complete!</h4>
            </div>
            <p className="text-xs text-gray-700 mb-2 leading-relaxed">
              Funds have been received. This transaction is now complete, thank you!
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              You can view all your selling activity in your Selling Hub.
            </p>
          </div>
        </div>

        {isOwn && !isUserBuyer && (
          <div className="mt-3 mb-2">
            <Button
              size="sm"
              onClick={onNavigateToSellingHub}
              className="text-xs w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-xl"
            >
              Go to My Selling Hub
            </Button>
          </div>
        )}

        <p className={`text-xs mt-3 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};
