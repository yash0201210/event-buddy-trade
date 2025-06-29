
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, AlertTriangle } from 'lucide-react';

interface MakeOfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, message?: string) => void;
  ticketPrice: number;
  quantity: number;
}

export const MakeOfferDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  ticketPrice, 
  quantity 
}: MakeOfferDialogProps) => {
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(offerAmount);
    if (amount > 0) {
      onSubmit(amount, message);
      setOfferAmount('');
      setMessage('');
    }
  };

  const totalOffer = parseFloat(offerAmount) * quantity || 0;
  const savings = (ticketPrice * quantity) - totalOffer;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="offer-amount">Offer per ticket</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="offer-amount"
                type="number"
                placeholder="0.00"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="pl-8"
                min="1"
                step="0.01"
                required
              />
            </div>
            {offerAmount && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Total offer: £{totalOffer.toFixed(2)} for {quantity} ticket{quantity > 1 ? 's' : ''}</p>
                {savings > 0 && (
                  <p className="text-green-600">You save: £{savings.toFixed(2)}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="offer-message">Message (optional)</Label>
            <Textarea
              id="offer-message"
              placeholder="Add a personal message to the seller..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">How it works</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your offer will be sent to the seller for review</li>
                  <li>• The seller can accept, decline, or make a counter-offer</li>
                  <li>• If accepted, you'll receive payment details to complete the transaction</li>
                  <li>• Complete payment outside the platform as instructed</li>
                  <li>• Receive your tickets after payment confirmation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">Important</h4>
                <p className="text-sm text-orange-800">
                  Remember to confirm the transaction once completed. Failure to do so could result in a ban or fine.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
              Send Offer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
