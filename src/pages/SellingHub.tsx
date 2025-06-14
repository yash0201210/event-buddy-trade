import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EditTicketDialog } from '@/components/selling/EditTicketDialog';
import { TransactionDetailsView } from '@/components/selling/TransactionDetailsView';
import { TicketCard } from '@/components/selling/TicketCard';
import { SellingStats } from '@/components/selling/SellingStats';

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
  conversation?: {
    id: string;
    buyer_id: string;
    transaction_status: string;
    buyer_confirmed: boolean;
    seller_confirmed: boolean;
    buyer: {
      full_name: string;
      is_verified: boolean;
    };
  };
}

const SellingHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingTicket, setEditingTicket] = useState<SellerTicket | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<SellerTicket | null>(null);

  const { data: tickets = [], isLoading, refetch } = useQuery({
    queryKey: ['seller-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching tickets for user:', user.id);
      
      const { data: ticketsData, error } = await supabase
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

      if (error) {
        console.error('Error fetching tickets:', error);
        return [];
      }

      if (!ticketsData) {
        console.log('No tickets found');
        return [];
      }

      console.log('Raw tickets data:', ticketsData);

      // Check for offers and conversations on each ticket
      const ticketsWithDetails = await Promise.all(
        ticketsData.map(async (ticket) => {
          // Check for offers
          const { data: offers } = await supabase
            .from('offers')
            .select('offered_price, status')
            .eq('ticket_id', ticket.id)
            .order('created_at', { ascending: false })
            .limit(1);

          // Get conversation details
          const { data: conversation } = await supabase
            .from('conversations')
            .select(`
              id,
              buyer_id,
              status,
              messages (
                message_type,
                created_at
              ),
              profiles!conversations_buyer_id_fkey (
                full_name,
                is_verified
              )
            `)
            .eq('ticket_id', ticket.id)
            .eq('seller_id', user.id)
            .maybeSingle();

          let transactionStatus = 'pending';
          let buyerConfirmed = false;
          let sellerConfirmed = false;

          if (conversation && conversation.messages) {
            const messages = conversation.messages.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            
            for (const msg of messages) {
              if (msg.message_type === 'order_confirmed') {
                transactionStatus = 'confirmed';
              } else if (msg.message_type === 'transfer_confirmation') {
                buyerConfirmed = true;
              } else if (msg.message_type === 'funds_received') {
                sellerConfirmed = true;
                transactionStatus = 'completed';
              }
            }
          }

          // Handle buyer profile properly
          const buyerProfile = conversation?.profiles && Array.isArray(conversation.profiles) 
            ? conversation.profiles[0] 
            : conversation?.profiles;

          const ticketWithDetails = {
            ...ticket,
            has_offers: offers && offers.length > 0,
            latest_offer: offers && offers.length > 0 ? offers[0] : undefined,
            conversation: conversation ? {
              id: conversation.id,
              buyer_id: conversation.buyer_id,
              transaction_status: transactionStatus,
              buyer_confirmed: buyerConfirmed,
              seller_confirmed: sellerConfirmed,
              buyer: buyerProfile || { full_name: 'Unknown', is_verified: false },
            } : undefined,
          };

          console.log('Ticket with details:', ticketWithDetails);
          return ticketWithDetails;
        })
      );

      console.log('Final tickets with details:', ticketsWithDetails);
      return ticketsWithDetails as SellerTicket[];
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
        // Properly handle the ticket object with correct type checking
        if (conv.tickets) {
          const tickets = conv.tickets as any;
          if (Array.isArray(tickets) && tickets.length > 0 && tickets[0]?.selling_price) {
            return sum + Number(tickets[0].selling_price);
          } else if (!Array.isArray(tickets) && tickets.selling_price) {
            return sum + Number(tickets.selling_price);
          }
        }
        return sum;
      }, 0);

      console.log('Stats calculated:', { totalSold, totalRevenue });
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

  // Filter tickets based on actual transaction status - completed transactions go to history
  const currentListings = tickets.filter(ticket => 
    !ticket.conversation || ticket.conversation.transaction_status !== 'completed'
  );
  
  const sellingHistory = tickets.filter(ticket => 
    ticket.conversation && ticket.conversation.transaction_status === 'completed'
  );

  const handleEditTicket = (ticket: SellerTicket) => {
    console.log('Editing ticket:', ticket);
    setEditingTicket(ticket);
  };

  const handleViewTransaction = (ticket: SellerTicket) => {
    console.log('Viewing transaction for ticket:', ticket);
    setSelectedTransaction(ticket);
  };

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

  console.log('Rendering with:', { tickets, currentListings, sellingHistory });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {selectedTransaction ? (
          <TransactionDetailsView 
            ticket={selectedTransaction} 
            onBack={() => setSelectedTransaction(null)}
          />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Selling Hub</h1>
            
            <SellingStats 
              totalSold={sellingHistory.length}
              totalRevenue={sellingHistory.reduce((sum, ticket) => sum + Number(ticket.selling_price), 0)}
              activeListings={currentListings.length}
            />
            
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
                      <TicketCard 
                        key={ticket.id} 
                        ticket={ticket} 
                        showEditButton={!ticket.conversation && !ticket.has_offers}
                        onEdit={handleEditTicket}
                        onView={handleViewTransaction}
                      />
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
                      <TicketCard 
                        key={ticket.id} 
                        ticket={ticket}
                        onView={handleViewTransaction}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      {editingTicket && (
        <EditTicketDialog
          ticket={editingTicket}
          open={!!editingTicket}
          onClose={() => setEditingTicket(null)}
          onSuccess={() => {
            setEditingTicket(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default SellingHub;
