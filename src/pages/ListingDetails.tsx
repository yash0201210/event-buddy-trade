
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { ListingDetailsView } from '@/components/selling/ListingDetailsView';

export default function ListingDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: ticket, isLoading, refetch } = useQuery({
    queryKey: ['listing-details', ticketId],
    queryFn: async () => {
      if (!ticketId || !user) return null;
      
      // Fetch the ticket with event details
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select(`
          *,
          events!inner(name, event_date, venue, city)
        `)
        .eq('id', ticketId)
        .eq('seller_id', user.id)
        .single();

      if (ticketError) {
        console.error('Error fetching ticket details:', ticketError);
        throw ticketError;
      }

      // Fetch offers for this ticket
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select(`
          *,
          profiles!buyer_id(full_name, is_verified)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: false });

      if (offersError) {
        console.error('Error fetching offers:', offersError);
      }

      // Fetch conversations for this ticket
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          profiles!buyer_id(full_name, is_verified)
        `)
        .eq('ticket_id', ticketId)
        .eq('seller_id', user.id);

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
      }

      // Transform the data to match our interface
      const transformedConversations = conversationsData?.map(conv => ({
        id: conv.id,
        buyer_id: conv.buyer_id,
        status: conv.status,
        profiles: Array.isArray(conv.profiles) ? conv.profiles[0] : conv.profiles
      })) || [];

      return {
        ...ticketData,
        offers: offersData || [],
        conversations: transformedConversations
      };
    },
    enabled: !!ticketId && !!user,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div>Loading listing details...</div>
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Listing not found</h2>
            <p className="text-gray-600 mt-2">This listing may not exist or you don't have permission to view it.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <ListingDetailsView 
          ticket={ticket} 
          onBack={() => navigate('/selling-hub')}
          onUpdate={() => refetch()}
        />
      </div>
    </Layout>
  );
}
