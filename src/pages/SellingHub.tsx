import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Ticket {
  id: string;
  created_at: string;
  event_id: string;
  seller_id: string;
  price: number;
  quantity: number;
  ticket_type: string;
  is_verified: boolean;
  ticket_details: any;
  events: {
    name: string;
    date: string;
    location: string;
    image_url: string;
  };
  latest_offer: {
    id: string;
    amount: number;
    status: string;
    buyer_id: string;
    buyer_name: string;
    buyer_verified: boolean;
  } | null;
  conversation_updated: string | null;
  conversation: {
    id: string;
    updated_at: string;
    buyer_profile: {
      full_name: string;
      is_verified: boolean;
    };
    seller_profile: {
      full_name: string;
      is_verified: boolean;
    };
  } | null;
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
          events!inner(name, date, location, image_url),
          latest_offer:offers!tickets_latest_offer_id_fkey(
            id,
            amount,
            status,
            buyer_id,
            buyer_profile:profiles!offers_buyer_id_fkey(full_name, is_verified)
          ),
          conversation:conversations!tickets_conversation_id_fkey(
            id,
            updated_at,
            buyer_profile:profiles!conversations_buyer_id_fkey(full_name, is_verified),
            seller_profile:profiles!conversations_seller_id_fkey(full_name, is_verified)
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching seller tickets:', error);
        throw error;
      }

      return data?.map(ticket => {
        const latestOffer = ticket.latest_offer;
        const conversation = ticket.conversation;
        
        // Handle buyer_profile properly - it could be an array or object
        let buyerName = 'Unknown';
        let buyerVerified = false;
        
        if (latestOffer?.buyer_profile) {
          const buyerProfile = Array.isArray(latestOffer.buyer_profile) 
            ? latestOffer.buyer_profile[0] 
            : latestOffer.buyer_profile;
          buyerName = buyerProfile?.full_name || 'Unknown';
          buyerVerified = buyerProfile?.is_verified || false;
        } else if (conversation?.buyer_profile) {
          const buyerProfile = Array.isArray(conversation.buyer_profile) 
            ? conversation.buyer_profile[0] 
            : conversation.buyer_profile;
          buyerName = buyerProfile?.full_name || 'Unknown';
          buyerVerified = buyerProfile?.is_verified || false;
        }

        return {
          ...ticket,
          latest_offer: latestOffer ? {
            ...latestOffer,
            buyer_name: buyerName,
            buyer_verified: buyerVerified
          } : null,
          conversation_updated: conversation?.updated_at || null
        };
      }) || [];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
                  {format(new Date(ticket.events.date), 'PPP')} - {ticket.events.location}
                </p>
                <p className="text-gray-700 mt-2">
                  Price: ${ticket.price} | Quantity: {ticket.quantity}
                </p>

                {ticket.latest_offer && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold">Latest Offer:</h3>
                    <p>Amount: ${ticket.latest_offer.amount}</p>
                    <p>Status: {ticket.latest_offer.status}</p>
                    <div className="flex items-center space-x-2">
                      <span>Buyer: {ticket.latest_offer.buyer_name}</span>
                      {ticket.latest_offer.buyer_verified && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                    </div>
                  </div>
                )}

                {ticket.conversation_updated && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold">Conversation:</h3>
                    <p>Last updated: {format(new Date(ticket.conversation_updated), 'PPP p')}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-between">
                  <Link to={`/ticket/${ticket.id}`}>
                    <Button variant="outline">View Ticket</Button>
                  </Link>
                  <Button>Contact Buyer</Button>
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
  );
}
