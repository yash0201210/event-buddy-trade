
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface BankDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const BankDetailsDialog = ({ isOpen, onClose, onSubmit }: BankDetailsDialogProps) => {
  const [bankDetails, setBankDetails] = useState({
    fullName: '',
    sortCode: '',
    accountNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    setBankDetails({
      fullName: '',
      sortCode: '',
      accountNumber: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Order & Share Bank Details</DialogTitle>
        </DialogHeader>

        {/* Warning Message */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">Important Notice</p>
              <p className="text-amber-700">
                Once you confirm this order, your ticket listing will no longer be visible to other buyers. 
                The buyer will have 48 hours to complete payment. If they don't pay within this time, 
                you'll have the option to cancel the order and make your listing visible again.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={bankDetails.fullName}
              onChange={(e) => setBankDetails({...bankDetails, fullName: e.target.value})}
              placeholder="As it appears on your bank account"
              required
            />
          </div>

          <div>
            <Label htmlFor="sortCode">Sort Code</Label>
            <Input
              id="sortCode"
              value={bankDetails.sortCode}
              onChange={(e) => setBankDetails({...bankDetails, sortCode: e.target.value})}
              placeholder="XX-XX-XX"
              required
            />
          </div>

          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
              placeholder="12345678"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Confirm Order & Share Details
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
