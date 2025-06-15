
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MakeOfferDialog } from '@/components/tickets/MakeOfferDialog';
import { PurchaseConfirmationDialog } from '@/components/tickets/PurchaseConfirmationDialog';
import { TicketDetailsHeader } from '@/components/tickets/TicketDetailsHeader';
import { EventInfoCard } from '@/components/tickets/EventInfoCard';
import { SellerInfoCard } from '@/components/tickets/SellerInfoCard';
import { PurchaseSummaryCard } from '@/components/tickets/PurchaseSummaryCard';
import { useSellerStats } from '@/hooks/useSellerStats';
import { useTicketActions } from '@/hooks/useTicketActions';
import { Button } from '@/components/ui/button';

interface TicketWithDetails {
  id: string;
  title: string;
  selling_price: number;
  original_price: number;
  quantity: number;
  ticket_type: string;
  description: string;
  is_negotiable: boolean;
  seller_id: string;
  events: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
  };
  profiles: {
    full_name: string;
    is_verified: boolean;
  };
}

const TicketDetails = () => {
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
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
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as TicketWithDetails;
    },
    enabled: !!id,
  });

  const { data: sellerStats } = useSellerStats(ticket?.seller_id);
  const { loading, createConversation } = useTicketActions(ticket);

  const handleBuyNow = () => {
    setShowPurchaseDialog(true);
  };

  const handleConfirmPurchase = () => {
    setShowPurchaseDialog(false);
    createConversation('buy_now');
  };

  const handleMakeOffer = (amount: number) => {
    createConversation('offer', amount);
    setShowOfferDialog(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading ticket details...</div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold mb-4">Ticket Not Found</h1>
              <p className="text-gray-600 mb-4">The ticket you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/')}>Browse Tickets</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <TicketDetailsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            <EventInfoCard ticket={ticket} />
            <SellerInfoCard ticket={ticket} sellerStats={sellerStats} />
          </div>

          {/* Right Column - Pricing & Actions */}
          <div className="lg:col-span-1">
            <PurchaseSummaryCard
              ticket={ticket}
              loading={loading}
              onBuyNow={handleBuyNow}
              onMakeOffer={() => setShowOfferDialog(true)}
            />
          </div>
        </div>
      </main>

      {ticket.is_negotiable && (
        <MakeOfferDialog 
          isOpen={showOfferDialog}
          onClose={() => setShowOfferDialog(false)}
          onSubmit={handleMakeOffer}
          ticketPrice={ticket.selling_price}
          quantity={ticket.quantity}
        />
      )}

      <PurchaseConfirmationDialog
        isOpen={showPurchaseDialog}
        onClose={() => setShowPurchaseDialog(false)}
        onConfirm={handleConfirmPurchase}
        ticket={ticket}
      />
    </div>
  );
};

export default TicketDetails;
