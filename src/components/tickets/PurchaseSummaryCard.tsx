
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PurchaseSummaryCardProps {
  ticket: {
    selling_price: number;
    quantity: number;
    is_negotiable: boolean;
  };
  loading: boolean;
  onBuyNow: () => void;
  onMakeOffer: () => void;
}

export const PurchaseSummaryCard = ({ ticket, loading, onBuyNow, onMakeOffer }: PurchaseSummaryCardProps) => {
  const totalPrice = ticket.selling_price * ticket.quantity;
  const fees = Math.round(totalPrice * 0.05); // 5% fees
  const finalTotal = totalPrice + fees;

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Purchase Summary</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span>Ticket price (x{ticket.quantity})</span>
            <span>£{totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service fee</span>
            <span>£{fees}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>£{finalTotal}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={onBuyNow}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Now'}
          </Button>
          
          {ticket.is_negotiable && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onMakeOffer}
              disabled={loading}
            >
              Make Offer
            </Button>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p className="mb-2">✓ Direct contact with seller</p>
          <p className="mb-2">✓ Secure messaging system</p>
          <p>✓ Payment handled outside platform</p>
        </div>
      </CardContent>
    </Card>
  );
};
