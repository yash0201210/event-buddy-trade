
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { SellingStats } from '@/components/selling/SellingStats';
import { CurrentListingsTab } from '@/components/selling/CurrentListingsTab';
import { SellingHistoryTab } from '@/components/selling/SellingHistoryTab';

interface Ticket {
  id: string;
  created_at: string;
  event_id: string;
  seller_id: string;
  selling_price: number;
  quantity: number;
  ticket_type: string;
  title: string;
  status: string;
  sold_at?: string;
  original_price: number;
  is_negotiable: boolean;
  description?: string;
  events: {
    name: string;
    event_date: string;
    venue: string;
    city: string;
  };
}

export default function SellingHub() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['seller-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          events!inner(name, event_date, venue, city)
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching seller tickets:', error);
        throw error;
      }

      return data as Ticket[];
    },
    enabled: !!user,
  });

  const handleViewListing = (ticketId: string) => {
    navigate(`/listing-details/${ticketId}`);
  };

  const handleViewSoldTicket = (ticketId: string) => {
    navigate(`/seller-transaction/${ticketId}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  // Filter tickets properly by status
  const currentListings = tickets?.filter(ticket => ticket.status === 'available') || [];
  const sellingHistory = tickets?.filter(ticket => ticket.status === 'sold') || [];

  // Calculate analytics
  const totalSold = sellingHistory.length;
  const totalRevenue = sellingHistory.reduce((sum, ticket) => sum + ticket.selling_price, 0);
  const activeListings = currentListings.length;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Selling Hub</h1>
        
        <SellingStats 
          totalSold={totalSold}
          totalRevenue={totalRevenue}
          activeListings={activeListings}
        />
        
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Listings ({currentListings.length})</TabsTrigger>
            <TabsTrigger value="history">Selling History ({sellingHistory.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <CurrentListingsTab 
              tickets={currentListings}
              onViewListing={handleViewListing}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <SellingHistoryTab 
              tickets={sellingHistory}
              onViewDetails={handleViewSoldTicket}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
