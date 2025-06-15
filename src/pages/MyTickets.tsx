
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

const MyTickets = () => {
  const { user } = useAuth();
  const { data: tickets = [], isLoading } = usePurchasedTickets();
  const { downloadTicket } = useTicketDownload();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // Filter tickets based on date and status
  const upcomingTickets = tickets.filter(ticket => 
    new Date(ticket.ticket.events?.event_date || '') > new Date() && 
    ticket.status === 'completed'
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">Manage your purchased tickets</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Ticket className="h-5 w-5" />
          <span className="font-medium">{tickets.length} Tickets</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Tickets ({tickets.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingTickets.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events ({pastTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {tickets.length === 0 ? (
            <EmptyTicketsState type="upcoming" />
          ) : (
            tickets.map((ticket) => (
              <PurchasedTicketCard
                key={ticket.id}
                ticket={ticket}
                onDownload={handleDownload}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </TabsContent>

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
  );
};

export default MyTickets;
