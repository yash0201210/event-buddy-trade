
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
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BankDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const BankDetailsDialog = ({
  isOpen,
  onClose,
  onSubmit
}: BankDetailsDialogProps) => {
  const { user } = useAuth();
  const [bankDetails, setBankDetails] = useState({
    fullName: '',
    sortCode: '',
    accountNumber: ''
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('bank_account_name, bank_sort_code, bank_account_number')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && isOpen,
  });

  React.useEffect(() => {
    if (profile) {
      setBankDetails({
        fullName: profile.bank_account_name || '',
        sortCode: profile.bank_sort_code || '',
        accountNumber: profile.bank_account_number || ''
      });
    }
  }, [profile]);

  const handleSubmit = async () => {
    // Update profile with bank details if they're not already saved
    if (user && (!profile?.bank_account_name || !profile?.bank_sort_code || !profile?.bank_account_number)) {
      await supabase
        .from('profiles')
        .update({
          bank_account_name: bankDetails.fullName,
          bank_sort_code: bankDetails.sortCode,
          bank_account_number: bankDetails.accountNumber
        })
        .eq('id', user.id);
    }
    
    onSubmit();
  };

  const isComplete = bankDetails.fullName && bankDetails.sortCode && bankDetails.accountNumber;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Bank Details</DialogTitle>
          <DialogDescription>
            Accept the purchase request by sharing your bank details with the buyer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={bankDetails.fullName}
              onChange={(e) => setBankDetails(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Account holder name"
            />
          </div>

          <div>
            <Label htmlFor="sortCode">Sort Code</Label>
            <Input
              id="sortCode"
              value={bankDetails.sortCode}
              onChange={(e) => setBankDetails(prev => ({ ...prev, sortCode: e.target.value }))}
              placeholder="XX-XX-XX"
            />
          </div>

          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="12345678"
            />
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> These details will be shared with the buyer for payment transfer. 
            Make sure they are correct.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={!isComplete}
          >
            Share Bank Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
