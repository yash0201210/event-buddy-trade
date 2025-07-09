
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CounterOfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  originalPrice: number;
}

export const CounterOfferDialog = ({
  isOpen,
  onClose,
  onSubmit,
  originalPrice
}: CounterOfferDialogProps) => {
  const [counterAmount, setCounterAmount] = useState(originalPrice.toString());

  const handleSubmit = () => {
    const amount = parseFloat(counterAmount);
    if (amount > 0) {
      onSubmit(amount);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make Counter Offer</DialogTitle>
          <DialogDescription>
            Enter your counter offer amount for this ticket
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="originalPrice">Original Price</Label>
            <Input
              id="originalPrice"
              value={`£${originalPrice}`}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="counterAmount">Your Counter Offer</Label>
            <Input
              id="counterAmount"
              type="number"
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            The buyer will be notified of your counter offer and can choose to accept or decline it.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-red-600 hover:bg-red-700"
            disabled={!counterAmount || parseFloat(counterAmount) <= 0}
          >
            Send Counter Offer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
