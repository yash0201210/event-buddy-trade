
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket, Download, Star, MessageCircle } from 'lucide-react';
import { usePurchasedTickets } from '@/hooks/usePurchasedTickets';
import { useTicketDownload } from '@/hooks/useTicketDownload';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { EmptyTicketsState } from '@/components/tickets/EmptyTicketsState';
import { PurchasedTicketCard } from '@/components/tickets/PurchasedTicketCard';
import { Layout } from '@/components/layout/Layout';

const MyTickets = () => {
  const { user } = useAuth();
  const { data: tickets = [], isLoading } = usePurchasedTickets();
  const { downloadTicket } = useTicketDownload();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Filter tickets based on date and status
  const upcomingTickets = tickets.filter(ticket => 
    new Date(ticket.ticket.events?.event_date || '') > new Date() && 
    ticket.status === 'completed'
  );

  const pendingTickets = tickets.filter(ticket => 
    ticket.status === 'pending' || 
    (ticket.status === 'confirmed' && !ticket.seller_confirmed)
  );

  const pastTickets = tickets.filter(ticket => 
    new Date(ticket.ticket.events?.event_date || '') <= new Date() && 
    ticket.status === 'completed'
  );

  const handleDownload = (ticket: any) => {
    downloadTicket(ticket);
  };

  const handleViewDetails = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
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

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Events ({upcomingTickets.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Tickets ({pendingTickets.length})</TabsTrigger>
            <TabsTrigger value="past">Past Events ({pastTickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingTickets.length === 0 ? (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No upcoming events
                  </h3>
                  <p className="text-gray-600">
                    You don't have any tickets for upcoming events yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTickets.map((ticket) => (
                  <PurchasedTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onDownload={handleDownload}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingTickets.length === 0 ? (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No pending tickets
                  </h3>
                  <p className="text-gray-600">
                    You don't have any pending ticket transactions.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingTickets.map((ticket) => (
                  <PurchasedTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onDownload={handleDownload}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastTickets.length === 0 ? (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No past events
                  </h3>
                  <p className="text-gray-600">
                    You don't have any tickets for past events yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastTickets.map((ticket) => (
                  <PurchasedTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onDownload={handleDownload}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyTickets;
