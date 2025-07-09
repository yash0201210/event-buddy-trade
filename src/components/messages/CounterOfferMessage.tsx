import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, TrendingUp } from 'lucide-react';
import { CounterOfferDialog } from './CounterOfferDialog';

interface CounterOfferMessageProps {
  message: {
    id: string;
    content: string;
    created_at: string;
  };
  isOwn: boolean;
  isUserBuyer: boolean;
  conversationId: string;
  counterAmount: number;
  originalAmount: number;
  onAcceptCounterOffer: (conversationId: string) => void;
  onRejectCounterOffer: (conversationId: string, newCounterAmount: number) => void;
}

export const CounterOfferMessage = ({
  message,
  isOwn,
  isUserBuyer,
  conversationId,
  counterAmount,
  originalAmount,
  onAcceptCounterOffer,
  onRejectCounterOffer
}: CounterOfferMessageProps) => {
  const [showCounterDialog, setShowCounterDialog] = useState(false);

  const handleNewCounterOffer = (newAmount: number) => {
    onRejectCounterOffer(conversationId, newAmount);
    setShowCounterDialog(false);
  };

  const canRespond = !isOwn;

  return (
    <>
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-md px-4 py-3 rounded-lg border ${
          isOwn 
            ? 'bg-orange-600 text-white border-orange-600' 
            : 'bg-white border-orange-200 shadow-sm'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`h-4 w-4 ${isOwn ? 'text-orange-200' : 'text-orange-600'}`} />
              <h4 className={`font-semibold text-sm ${isOwn ? 'text-white' : 'text-orange-900'}`}>
                Counter Offer
              </h4>
            </div>
            
            <div className={`p-3 rounded-lg border ${
              isOwn ? 'bg-orange-700 border-orange-500' : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className={isOwn ? 'text-orange-200' : 'text-gray-700'}>
                    Original Price:
                  </span>
                  <span className={`font-medium ${isOwn ? 'text-white' : 'text-gray-900'}`}>
                    £{originalAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isOwn ? 'text-orange-200' : 'text-gray-700'}>
                    Counter Offer:
                  </span>
                  <span className={`font-bold text-lg ${isOwn ? 'text-white' : 'text-orange-900'}`}>
                    £{counterAmount}
                  </span>
                </div>
              </div>
            </div>
            
            <p className={`text-sm ${isOwn ? 'text-orange-100' : 'text-gray-600'}`}>
              {message.content}
            </p>
          </div>
          
          {canRespond && (
            <div className="mt-3 mb-2 flex gap-2">
              <Button
                size="sm"
                onClick={() => onAcceptCounterOffer(conversationId)}
                className="bg-green-600 hover:bg-green-700 text-white text-xs flex-1"
              >
                <Check className="h-3 w-3 mr-1" />
                Accept £{counterAmount}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCounterDialog(true)}
                className="text-xs flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <X className="h-3 w-3 mr-1" />
                Counter
              </Button>
            </div>
          )}

          <p className={`text-xs ${isOwn ? 'text-orange-200' : 'text-gray-500'}`}>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      <CounterOfferDialog
        isOpen={showCounterDialog}
        onClose={() => setShowCounterDialog(false)}
        onSubmit={handleNewCounterOffer}
        originalPrice={counterAmount}
      />
    </>
  );
};