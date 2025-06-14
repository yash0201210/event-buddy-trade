
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  events: {
    name: string;
    event_date: string;
    venue: string;
    city: string;
  };
}

export default function SellingHub() {
  const { user } = useAuth();

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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Selling Hub</h1>
        
        {tickets?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="bg-white shadow-md rounded-md overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-semibold">{ticket.events.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-600">
                    {format(new Date(ticket.events.event_date), 'PPP')} - {ticket.events.venue}, {ticket.events.city}
                  </p>
                  <p className="text-gray-700 mt-2">
                    Price: £{ticket.selling_price} | Quantity: {ticket.quantity}
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
          <div className="text-center">
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
