
import React from 'react';
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

  const handleViewTransactionDetails = (ticketId: string) => {
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

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Selling Hub</h1>
        
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Listings ({currentListings.length})</TabsTrigger>
            <TabsTrigger value="history">Selling History ({sellingHistory.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {currentListings.length > 0 ? (
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

                      <div className="mt-4 flex justify-between">
                        <Link to={`/ticket/${ticket.id}`}>
                          <Button variant="outline">View Ticket</Button>
                        </Link>
                        <Button>Manage Listing</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold">No current listings</h3>
                <p className="text-gray-600 mt-2">List tickets to start selling!</p>
                <Link to="/sell-tickets">
                  <Button className="mt-4">Sell Tickets</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {sellingHistory.length > 0 ? (
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
                          onClick={() => handleViewTransactionDetails(ticket.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold">No selling history yet</h3>
                <p className="text-gray-600 mt-2">Your sold tickets will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Empty State - shown when no tickets at all */}
        {currentListings.length === 0 && sellingHistory.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No tickets listed for sale yet.</h2>
            <p className="text-gray-600 mt-2">List tickets to start selling!</p>
            <Link to="/sell-tickets">
              <Button className="mt-4">Sell Tickets</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
