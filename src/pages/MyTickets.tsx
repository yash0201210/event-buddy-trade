
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePurchasedTickets } from '@/hooks/usePurchasedTickets';
import { PurchasedTicketCard } from '@/components/tickets/PurchasedTicketCard';
import { EmptyTicketsState } from '@/components/tickets/EmptyTicketsState';
import { Header } from '@/components/layout/Header';
import { useTicketDownload } from '@/hooks/useTicketDownload';
import { useNavigate } from 'react-router-dom';

const MyTickets = () => {
  const { data: tickets = [], isLoading } = usePurchasedTickets();
  const { downloadTicket } = useTicketDownload();
  const navigate = useNavigate();

  // Filter tickets by status
  const upcomingTickets = tickets.filter(ticket => {
    const eventDate = new Date(ticket.event_date);
    return eventDate > new Date() && ticket.status === 'sold';
  });

  const pendingTickets = tickets.filter(ticket => ticket.status === 'pending');

  const pastTickets = tickets.filter(ticket => {
    const eventDate = new Date(ticket.event_date);
    return eventDate <= new Date() && ticket.status === 'sold';
  });

  const handleDownload = (ticketId: string) => {
    downloadTicket(ticketId);
  };

  const handleViewDetails = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
        
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming ({upcomingTickets.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingTickets.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastTickets.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingTickets.length === 0 ? (
              <EmptyTicketsState type="upcoming" />
            ) : (
              upcomingTickets.map((ticket) => (
                <PurchasedTicketCard 
                  key={ticket.id} 
                  ticket={ticket}
                  onDownload={handleDownload}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingTickets.length === 0 ? (
              <EmptyTicketsState type="pending" />
            ) : (
              pendingTickets.map((ticket) => (
                <PurchasedTicketCard 
                  key={ticket.id} 
                  ticket={ticket}
                  onDownload={handleDownload}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastTickets.length === 0 ? (
              <EmptyTicketsState type="past" />
            ) : (
              pastTickets.map((ticket) => (
                <PurchasedTicketCard 
                  key={ticket.id} 
                  ticket={ticket}
                  onDownload={handleDownload}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyTickets;
