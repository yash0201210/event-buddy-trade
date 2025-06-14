import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Calendar, Edit, TrendingUp, DollarSign, Package } from 'lucide-react';
import { EditTicketDialog } from '@/components/selling/EditTicketDialog';

interface SellerTicket {
  id: string;
  title: string;
  ticket_type: string;
  quantity: number;
  selling_price: number;
  original_price: number;
  status: string;
  is_negotiable: boolean;
  created_at: string;
  events: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
  };
  has_offers: boolean;
  latest_offer?: {
    offered_price: number;
    status: string;
  };
}

const SellingHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingTicket, setEditingTicket] = useState<SellerTicket | null>(null);

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['seller-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: ticketsData } = await supabase
        .from('tickets')
        .select(`
          id,
          title,
          ticket_type,
          quantity,
          selling_price,
          original_price,
          status,
          is_negotiable,
          created_at,
          events!tickets_event_id_fkey (
            name,
            venue,
            city,
            event_date
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (!ticketsData) return [];

      // Check for offers on each ticket
      const ticketsWithOffers = await Promise.all(
        ticketsData.map(async (ticket) => {
          const { data: offers } = await supabase
            .from('offers')
            .select('offered_price, status')
            .eq('ticket_id', ticket.id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...ticket,
            has_offers: offers && offers.length > 0,
            latest_offer: offers?.[0],
          };
        })
      );

      return ticketsWithOffers as SellerTicket[];
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ['seller-stats', user?.id],
    queryFn: async () => {
      if (!user) return { totalSold: 0, totalRevenue: 0 };

      // Get completed transactions (where seller confirmed funds received)
      const { data: conversations } = await supabase
        .from('conversations')
        .select(`
          id,
          messages!inner (
            message_type,
            created_at
          ),
          tickets!conversations_ticket_id_fkey (
            selling_price
          )
        `)
        .eq('seller_id', user.id);

      if (!conversations) return { totalSold: 0, totalRevenue: 0 };

      const completedSales = conversations.filter(conv => 
        conv.messages.some(msg => msg.message_type === 'funds_received')
      );

      const totalSold = completedSales.length;
      const totalRevenue = completedSales.reduce((sum, conv) => {
        const ticket = conv.tickets;
        if (Array.isArray(ticket) && ticket.length > 0) {
          return sum + (ticket[0].selling_price || 0);
        }
        return sum;
      }, 0);

      return { totalSold, totalRevenue };
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold mb-4">Authentication Required</h1>
              <p className="text-gray-600 mb-4">Please sign in to view your selling hub</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentListings = tickets.filter(ticket => ticket.status === 'available');
  const sellingHistory = tickets.filter(ticket => ticket.status === 'sold');

  const handleEditTicket = (ticket: SellerTicket) => {
    setEditingTicket(ticket);
  };

  const TicketCard = ({ ticket, showEditButton = false }: { ticket: SellerTicket; showEditButton?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold">
            {ticket.events.name}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={ticket.status === 'available' ? 'default' : 'secondary'}>
              {ticket.status === 'available' ? 'Listed' : 'Sold'}
            </Badge>
            {ticket.has_offers && (
              <Badge variant="outline" className="bg-blue-50">
                Has Offers
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{ticket.events.venue}, {ticket.events.city}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(ticket.events.event_date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{ticket.quantity} x {ticket.ticket_type}</span>
            <span className="font-semibold">€{ticket.selling_price}</span>
          </div>
          
          {ticket.latest_offer && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Latest offer: €{ticket.latest_offer.offered_price}
                <span className="ml-2">
                  <Badge variant="outline" className="text-xs">
                    {ticket.latest_offer.status}
                  </Badge>
                </span>
              </p>
            </div>
          )}

          {showEditButton && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleEditTicket(ticket)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your selling hub...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Selling Hub</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tickets Sold</p>
                  <p className="text-2xl font-bold">{stats?.totalSold || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">€{stats?.totalRevenue || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold">{currentListings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">
              Current Listings ({currentListings.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              Selling History ({sellingHistory.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-6">
            {currentListings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold mb-2">No active listings</h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any tickets currently listed for sale.
                  </p>
                  <Button onClick={() => navigate('/sell-tickets')}>
                    List Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentListings.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} showEditButton />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            {sellingHistory.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold mb-2">No selling history</h3>
                  <p className="text-gray-600">
                    You haven't completed any sales yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellingHistory.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {editingTicket && (
        <EditTicketDialog
          ticket={editingTicket}
          open={!!editingTicket}
          onClose={() => setEditingTicket(null)}
        />
      )}
    </div>
  );
};

export default SellingHub;
