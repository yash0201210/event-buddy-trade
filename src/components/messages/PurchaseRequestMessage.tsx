
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface PurchaseRequestMessageProps {
  message: {
    id: string;
    content: string;
    created_at: string;
  };
  isOwn: boolean;
  isUserBuyer: boolean;
  conversationId: string;
  onAcceptPurchaseRequest: (conversationId: string) => void;
  onRejectPurchaseRequest: (conversationId: string) => void;
}

export const PurchaseRequestMessage = ({
  message,
  isOwn,
  isUserBuyer,
  conversationId,
  onAcceptPurchaseRequest,
  onRejectPurchaseRequest
}: PurchaseRequestMessageProps) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md px-4 py-3 rounded-lg border ${
        isOwn 
          ? 'bg-red-600 text-white border-red-600' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg border">
            <h4 className="font-semibold text-gray-900 text-sm mb-2">Purchase Request</h4>
            <div className="space-y-1 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>1 X Regular Ticket</span>
                <span className="font-medium">€9.73</span>
              </div>
              <div className="border-t pt-1 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>€9.73</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Awaiting Seller Confirmation
          </p>
        </div>
        
        {!isOwn && !isUserBuyer && (
          <div className="mt-3 mb-2 flex gap-2">
            <Button
              size="sm"
              onClick={() => onAcceptPurchaseRequest(conversationId)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs flex-1"
            >
              <Check className="h-3 w-3 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRejectPurchaseRequest(conversationId)}
              className="text-xs flex-1 border-gray-300"
            >
              <X className="h-3 w-3 mr-1" />
              Counter Offer
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
