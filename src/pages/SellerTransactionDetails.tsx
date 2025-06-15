
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { TransactionDetailsView } from '@/components/selling/TransactionDetailsView';

export default function SellerTransactionDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['seller-transaction-details', ticketId],
    queryFn: async () => {
      if (!ticketId || !user) return null;
      
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          events!inner(name, event_date, venue, city),
          conversations!inner(
            id,
            buyer_id,
            transaction_status,
            buyer_confirmed,
            seller_confirmed,
            buyer:profiles!conversations_buyer_id_fkey(
              full_name,
              is_verified
            )
          )
        `)
        .eq('id', ticketId)
        .eq('seller_id', user.id)
        .eq('status', 'sold')
        .single();

      if (error) {
        console.error('Error fetching transaction details:', error);
        throw error;
      }

      return data;
    },
    enabled: !!ticketId && !!user,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div>Loading transaction details...</div>
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Transaction not found</h2>
            <p className="text-gray-600 mt-2">This transaction may not exist or you don't have permission to view it.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <TransactionDetailsView 
          ticket={ticket} 
          onBack={() => navigate('/selling-hub')} 
        />
      </div>
    </Layout>
  );
}
