import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Calendar, Download, Star, Clock, Shield, User, Eye } from 'lucide-react';
import { BuyerTransactionDetailsView } from '@/components/tickets/BuyerTransactionDetailsView';

interface PurchasedTicket {
  id: string;
  ticket_id: string;
  status: 'pending' | 'confirmed' | 'completed';
  amount_paid: number;
  transaction_date: string;
  seller_confirmed: boolean;
  buyer_confirmed: boolean;
  ticket: {
    title: string;
    ticket_type: string;
    quantity: number;
    events: {
      name: string;
      venue: string;
      city: string;
      event_date: string;
    };
  };
  seller: {
    full_name: string;
    is_verified: boolean;
  };
}

const MyTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [viewingDetails, setViewingDetails] = useState<string | null>(null);

  // Get conversation ID from URL params if present
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const conversationId = urlParams.get('conversation');
    if (conversationId) {
      setSelectedConversation(conversationId);
    }
  }, [location.search]);

  const { data: purchasedTickets = [], isLoading } = useQuery({
    queryKey: ['purchased-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get conversations where user is buyer and has purchase requests
      const { data: conversations } = await supabase
        .from('conversations')
        .select(`
          id,
          ticket_id,
          status,
          created_at,
          messages!inner (
            message_type,
            content,
            created_at
          )
        `)
        .eq('buyer_id', user.id);

      if (!conversations) return [];

      // Filter conversations that have purchase requests and get ticket details
      const purchasedTickets = await Promise.all(
        conversations
          .filter(conv => conv.messages.some(msg => msg.message_type === 'purchase_request'))
          .map(async (conv) => {
            // Get ticket details
            const { data: ticket } = await supabase
              .from('tickets')
              .select(`
                title,
                ticket_type,
                quantity,
                selling_price,
                events!tickets_event_id_fkey (
                  name,
                  venue,
                  city,
                  event_date
                ),
                profiles!tickets_seller_id_fkey (
                  full_name,
                  is_verified
                )
              `)
              .eq('id', conv.ticket_id)
              .single();

            if (!ticket) return null;

            // Determine status based on messages
            const messages = conv.messages.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            
            let status = 'pending';
            let buyerConfirmed = false;
            let sellerConfirmed = false;
            
            for (const msg of messages) {
              if (msg.message_type === 'order_confirmed') {
                status = 'confirmed';
              } else if (msg.message_type === 'transfer_confirmation') {
                buyerConfirmed = true;
              } else if (msg.message_type === 'funds_received') {
                sellerConfirmed = true;
                status = 'completed';
              }
            }

            return {
              id: conv.id,
              ticket_id: conv.ticket_id,
              status,
              amount_paid: ticket.selling_price,
              transaction_date: conv.created_at,
              seller_confirmed: sellerConfirmed,
              buyer_confirmed: buyerConfirmed,
              ticket: {
                title: ticket.title,
                ticket_type: ticket.ticket_type,
                quantity: ticket.quantity,
                events: ticket.events,
              },
              seller: ticket.profiles,
            };
          })
      );

      return purchasedTickets.filter(Boolean) as PurchasedTicket[];
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
              <p className="text-gray-600 mb-4">Please sign in to view your tickets</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const now = new Date();
  const upcomingTickets = purchasedTickets.filter(ticket => 
    new Date(ticket.ticket.events.event_date) > now && ticket.status === 'completed'
  );
  const pendingTickets = purchasedTickets.filter(ticket => 
    ticket.status !== 'completed'
  );
  const pastTickets = purchasedTickets.filter(ticket => 
    new Date(ticket.ticket.events.event_date) <= now && ticket.status === 'completed'
  );

  // Find the selected conversation details if viewing transaction details
  const selectedTicket = selectedConversation 
    ? purchasedTickets.find(ticket => ticket.id === selectedConversation)
    : null;

  // Find the ticket for viewing details
  const detailsTicket = viewingDetails 
    ? purchasedTickets.find(ticket => ticket.id === viewingDetails)
    : null;

  const handleDownloadTicket = async (ticket: PurchasedTicket) => {
    try {
      // Get the actual ticket details to find the PDF URL
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('pdf_url, title')
        .eq('id', ticket.ticket_id)
        .single();

      if (ticketData?.pdf_url) {
        // Create a download link
        const link = document.createElement('a');
        link.href = ticketData.pdf_url;
        link.download = `${ticketData.title || 'ticket'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For testing purposes when no PDF exists, generate a dummy PDF download
        const dummyContent = `
Ticket for ${ticket.ticket.events.name}
Event: ${ticket.ticket.events.name}
Venue: ${ticket.ticket.events.venue}, ${ticket.ticket.events.city}
Date: ${new Date(ticket.ticket.events.event_date).toLocaleDateString()}
Ticket Type: ${ticket.ticket.ticket_type}
Quantity: ${ticket.ticket.quantity}
Price Paid: €${ticket.amount_paid}
Transaction ID: ${ticket.id}
        `;
        
        const blob = new Blob([dummyContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${ticket.ticket.events.name}-ticket.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  const TransactionDetailsView = ({ ticket }: { ticket: PurchasedTicket }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedConversation(null)}
          size="sm"
        >
          ← Back to My Tickets
        </Button>
      </div>

      {/* Reassuring Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Purchase is Secure</h2>
              <p className="text-sm text-gray-600">We're processing your transaction safely</p>
            </div>
          </div>
          <div className="bg-white/50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              ✅ Your payment has been confirmed<br/>
              🔄 Waiting for seller to acknowledge receipt<br/>
              📧 You'll be notified as soon as your tickets are ready
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transaction Status
            <Badge 
              variant={ticket.status === 'completed' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {ticket.status === 'completed' ? 'Completed' : 
               ticket.buyer_confirmed ? 'Awaiting Seller Confirmation' : 
               'Payment Pending'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Purchase Request Sent</span>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              Complete
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Seller Accepted</span>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              Complete
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Payment Transferred</span>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              Complete
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Seller Confirms Receipt</span>
            <div className="flex items-center text-yellow-600">
              <Clock className="w-4 h-4 mr-2" />
              {ticket.seller_confirmed ? 'Complete' : 'Pending'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className="font-semibold text-lg">{ticket.ticket.events.name}</h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{ticket.ticket.events.venue}, {ticket.ticket.events.city}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(ticket.ticket.events.event_date).toLocaleDateString()}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm"><strong>Ticket Type:</strong> {ticket.ticket.ticket_type}</p>
            <p className="text-sm"><strong>Quantity:</strong> {ticket.ticket.quantity}</p>
            <p className="text-sm"><strong>Total Paid:</strong> €{ticket.amount_paid}</p>
          </div>
        </CardContent>
      </Card>

      {/* Seller Information */}
      <Card>
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="font-semibold">{ticket.seller.full_name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{ticket.seller.is_verified ? 'Verified Seller' : 'New Seller'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/messages')}
              variant="outline"
              className="flex-1"
            >
              Message Seller
            </Button>
            {ticket.status === 'completed' && (
              <Button 
                onClick={() => navigate(`/ticket-view/${ticket.ticket_id}`)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                View Ticket
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TicketCard = ({ ticket }: { ticket: PurchasedTicket }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold">
            {ticket.ticket.events.name}
          </CardTitle>
          <Badge 
            variant={
              ticket.status === 'completed' ? 'default' : 
              ticket.status === 'confirmed' ? 'secondary' : 
              'outline'
            }
          >
            {ticket.status === 'completed' ? 'Ready' : 
             ticket.status === 'confirmed' ? 'Pending Transfer' : 
             'Pending Seller'}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{ticket.ticket.events.venue}, {ticket.ticket.events.city}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(ticket.ticket.events.event_date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{ticket.ticket.quantity} x {ticket.ticket.ticket_type}</span>
            <span className="font-semibold">€{ticket.amount_paid}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <span>Seller: {ticket.seller.full_name}</span>
              {ticket.seller.is_verified && (
                <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
              )}
            </div>
          </div>

          {ticket.status === 'pending' && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center text-yellow-800">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Waiting for seller confirmation</span>
              </div>
            </div>
          )}

          {ticket.status === 'confirmed' && !ticket.buyer_confirmed && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                Payment details have been shared. Please transfer funds and confirm in messages.
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate('/messages')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Go to Messages
              </Button>
            </div>
          )}

          {ticket.status === 'confirmed' && ticket.buyer_confirmed && !ticket.seller_confirmed && (
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center text-orange-800">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Transfer confirmed - waiting for seller</span>
              </div>
            </div>
          )}
          
          {ticket.status === 'completed' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleDownloadTicket(ticket)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Ticket
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setViewingDetails(ticket.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
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
          <div className="text-center">Loading your tickets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {selectedTicket ? (
          <TransactionDetailsView ticket={selectedTicket} />
        ) : detailsTicket ? (
          <BuyerTransactionDetailsView 
            ticket={detailsTicket} 
            onBack={() => setViewingDetails(null)} 
          />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h1>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingTickets.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingTickets.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past Events ({pastTickets.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-6">
                {upcomingTickets.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-semibold mb-2">No upcoming tickets</h3>
                      <p className="text-gray-600 mb-4">
                        You don't have any confirmed tickets for upcoming events.
                      </p>
                      <Button onClick={() => navigate('/')}>
                        Browse Events
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingTickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="mt-6">
                {pendingTickets.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-semibold mb-2">No pending tickets</h3>
                      <p className="text-gray-600">
                        All your ticket purchases have been completed.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingTickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-6">
                {pastTickets.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-semibold mb-2">No past events</h3>
                      <p className="text-gray-600">
                        You haven't attended any events yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastTickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default MyTickets;
