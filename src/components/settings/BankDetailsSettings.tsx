
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const BankDetailsSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    bankName: '',
    sortCode: '',
    accountNumber: ''
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('bank_account_name, bank_name, bank_sort_code, bank_account_number')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  React.useEffect(() => {
    if (profile) {
      setBankDetails({
        accountName: profile.bank_account_name || '',
        bankName: profile.bank_name || '',
        sortCode: profile.bank_sort_code || '',
        accountNumber: profile.bank_account_number || ''
      });
    }
  }, [profile]);

  const updateBankDetailsMutation = useMutation({
    mutationFn: async (data: typeof bankDetails) => {
      if (!user) throw new Error('No user found');
      
      // Call the encryption function through Supabase Edge Function
      const { data: encryptedData, error: encryptError } = await supabase.functions.invoke('encrypt-bank-details', {
        body: {
          accountName: data.accountName,
          bankName: data.bankName,
          sortCode: data.sortCode,
          accountNumber: data.accountNumber
        }
      });

      if (encryptError) throw encryptError;

      const { error } = await supabase
        .from('profiles')
        .update({
          bank_account_name: encryptedData.accountName,
          bank_name: encryptedData.bankName,
          bank_sort_code: encryptedData.sortCode,
          bank_account_number: encryptedData.accountNumber
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bank details updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setShowDetails(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update bank details",
        variant: "destructive",
      });
      console.error('Bank details update error:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateBankDetailsMutation.mutateAsync(bankDetails);
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof typeof bankDetails) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBankDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const hasBankDetails = profile?.bank_account_number;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent>
        {!showDetails && hasBankDetails ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">Bank details saved securely</p>
              <p className="text-green-600 text-sm">Your bank details are encrypted and stored securely.</p>
            </div>
            <Button onClick={() => setShowDetails(true)} variant="outline">
              Update Bank Details
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800 font-medium">🔒 Security Notice</p>
              <p className="text-blue-600 text-sm">
                All bank details are encrypted before storage for your security and privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountName">Account Holder Name</Label>
                <Input
                  id="accountName"
                  value={bankDetails.accountName}
                  onChange={handleInputChange('accountName')}
                  placeholder="Enter account holder name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={bankDetails.bankName}
                  onChange={handleInputChange('bankName')}
                  placeholder="Enter bank name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="sortCode">Sort Code</Label>
                <Input
                  id="sortCode"
                  value={bankDetails.sortCode}
                  onChange={handleInputChange('sortCode')}
                  placeholder="XX-XX-XX"
                  maxLength={8}
                  required
                />
              </div>

              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={handleInputChange('accountNumber')}
                  placeholder="12345678"
                  maxLength={8}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              {hasBankDetails && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDetails(false)}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Bank Details'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
