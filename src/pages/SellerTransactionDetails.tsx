
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
      
      // First, fetch the ticket with event details
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select(`
          *,
          events!inner(name, event_date, venue, city)
        `)
        .eq('id', ticketId)
        .eq('seller_id', user.id)
        .eq('status', 'sold')
        .single();

      if (ticketError) {
        console.error('Error fetching ticket details:', ticketError);
        throw ticketError;
      }

      // Then, fetch the conversation for this ticket
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select(`
          id,
          buyer_id,
          status,
          created_at,
          updated_at
        `)
        .eq('ticket_id', ticketId)
        .eq('seller_id', user.id)
        .single();

      // If there's a conversation, fetch buyer details
      let buyerData = null;
      if (conversationData && !conversationError) {
        const { data: buyer, error: buyerError } = await supabase
          .from('profiles')
          .select('full_name, is_verified')
          .eq('id', conversationData.buyer_id)
          .single();

        if (!buyerError) {
          buyerData = buyer;
        }
      }

      // Combine the data
      const result = {
        ...ticketData,
        conversation: conversationData ? {
          ...conversationData,
          transaction_status: 'completed',
          buyer_confirmed: true,
          seller_confirmed: true,
          buyer: buyerData
        } : null
      };

      return result;
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
