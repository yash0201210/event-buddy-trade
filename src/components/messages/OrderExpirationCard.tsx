
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle } from 'lucide-react';

interface OrderExpirationCardProps {
  conversation: {
    id: string;
    order_confirmed_at?: string;
    order_expires_at?: string;
    seller_id: string;
  };
  currentUserId: string;
  timeRemaining: string | null;
  isExpired: boolean;
  onCancelOrder: (conversationId: string) => void;
  isCancelling: boolean;
}

export const OrderExpirationCard = ({
  conversation,
  currentUserId,
  timeRemaining,
  isExpired,
  onCancelOrder,
  isCancelling
}: OrderExpirationCardProps) => {
  const isUserSeller = conversation.seller_id === currentUserId;
  
  if (!conversation.order_confirmed_at || !isUserSeller) {
    return null;
  }

  return (
    <Card className={`mb-4 border-2 ${isExpired ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isExpired ? 'bg-red-100' : 'bg-orange-100'
          }`}>
            {isExpired ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : (
              <Clock className="h-5 w-5 text-orange-600" />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className={`font-semibold text-sm mb-2 ${
              isExpired ? 'text-red-800' : 'text-orange-800'
            }`}>
              {isExpired ? 'Payment Window Expired' : 'Awaiting Payment'}
            </h4>
            
            <p className={`text-sm mb-3 ${
              isExpired ? 'text-red-700' : 'text-orange-700'
            }`}>
              {isExpired ? (
                'The buyer did not complete payment within 12 hours. You can now cancel this order to make your listing visible again.'
              ) : (
                `The buyer has ${timeRemaining} to complete payment. If they don't pay within this time, you'll be able to cancel the order.`
              )}
            </p>
            
            {isExpired && (
              <Button
                onClick={() => onCancelOrder(conversation.id)}
                disabled={isCancelling}
                variant="destructive"
                size="sm"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order & Relist'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
