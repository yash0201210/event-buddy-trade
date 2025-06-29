
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { SellingStats } from '@/components/selling/SellingStats';
import { EditTicketDialog } from '@/components/selling/EditTicketDialog';
import { Plus } from 'lucide-react';

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
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const { data: tickets, isLoading, refetch } = useQuery({
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

  const handleViewSoldTicket = (ticketId: string) => {
    navigate(`/seller-transaction/${ticketId}`);
  };

  const handleViewListing = (ticket: Ticket) => {
    setEditingTicket(ticket);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditingTicket(null);
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
            {currentListings.length === 0 ? (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No current listings
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't listed any tickets yet. Start selling to reach thousands of potential buyers.
                  </p>
                  <Button 
                    onClick={() => navigate('/sell-tickets')}
                    className="bg-[#E8550D] hover:bg-[#D44B0B] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Sell Tickets
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentListings.map((ticket) => (
                  <Card key={ticket.id} className="bg-white shadow-md rounded-md overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg font-semibold">{ticket.events.name}</CardTitle>
                      <Badge variant="secondary" className="w-fit">Available</Badge>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-gray-600">
                        {format(new Date(ticket.events.event_date), 'PPP')} - {ticket.events.venue}, {ticket.events.city}
                      </p>
                      <p className="text-gray-700 mt-2">
                        Price: €{ticket.selling_price} | Quantity: {ticket.quantity}
                      </p>

                      <div className="mt-4">
                        <Button 
                          onClick={() => handleViewListing(ticket)}
                          className="w-full"
                        >
                          View Listing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {sellingHistory.length === 0 ? (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No tickets sold yet
                  </h3>
                  <p className="text-gray-600">
                    Your selling history will appear here once you make your first sale.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellingHistory.map((ticket) => (
                  <Card key={ticket.id} className="bg-green-50 border-green-200 shadow-md rounded-md overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg font-semibold">{ticket.events.name}</CardTitle>
                      <Badge className="w-fit bg-green-100 text-green-700">Sold</Badge>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-gray-600">
                        {format(new Date(ticket.events.event_date), 'PPP')} - {ticket.events.venue}, {ticket.events.city}
                      </p>
                      <p className="text-gray-700 mt-2">
                        Sold Price: €{ticket.selling_price} | Quantity: {ticket.quantity}
                      </p>
                      {ticket.sold_at && (
                        <p className="text-sm text-green-600 mt-2">
                          Sold on: {format(new Date(ticket.sold_at), 'PPP')}
                        </p>
                      )}

                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleViewSoldTicket(ticket.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {editingTicket && (
          <EditTicketDialog
            ticket={editingTicket}
            open={!!editingTicket}
            onClose={() => setEditingTicket(null)}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </Layout>
  );
}
