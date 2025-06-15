import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { BuyerTransactionDetailsView } from '@/components/tickets/BuyerTransactionDetailsView';
import { PurchasedTicketCard } from '@/components/tickets/PurchasedTicketCard';
import { EmptyTicketsState } from '@/components/tickets/EmptyTicketsState';
import { usePurchasedTickets } from '@/hooks/usePurchasedTickets';
import { useTicketDownload } from '@/hooks/useTicketDownload';
import { PurchasedTicket } from '@/hooks/usePurchasedTickets';
import { TransactionStatusCard } from '@/components/tickets/TransactionStatusCard';
import { MapPin, Calendar, Download, Star, Clock, Shield, User, Eye, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MyTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [viewingDetails, setViewingDetails] = useState<string | null>(null);

  const { data: purchasedTickets = [], isLoading } = usePurchasedTickets();
  const { downloadTicket } = useTicketDownload();

  // Get conversation ID from URL params if present
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const conversationId = urlParams.get('conversation');
    if (conversationId) {
      setSelectedConversation(conversationId);
    }
  }, [location.search]);

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
      <TransactionStatusCard ticket={ticket} />

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
                  <EmptyTicketsState type="upcoming" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingTickets.map((ticket) => (
                      <PurchasedTicketCard 
                        key={ticket.id} 
                        ticket={ticket}
                        onDownload={downloadTicket}
                        onViewDetails={setViewingDetails}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="mt-6">
                {pendingTickets.length === 0 ? (
                  <EmptyTicketsState type="pending" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingTickets.map((ticket) => (
                      <PurchasedTicketCard 
                        key={ticket.id} 
                        ticket={ticket}
                        onDownload={downloadTicket}
                        onViewDetails={setViewingDetails}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-6">
                {pastTickets.length === 0 ? (
                  <EmptyTicketsState type="past" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastTickets.map((ticket) => (
                      <PurchasedTicketCard 
                        key={ticket.id} 
                        ticket={ticket}
                        onDownload={downloadTicket}
                        onViewDetails={setViewingDetails}
                      />
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
