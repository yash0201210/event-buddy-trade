import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Star, User, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { MakeOfferDialog } from '@/components/tickets/MakeOfferDialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { PurchaseConfirmationDialog } from '@/components/tickets/PurchaseConfirmationDialog';

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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  // Fetch seller performance data
  const { data: sellerStats } = useQuery({
    queryKey: ['seller-stats', ticket?.seller_id],
    queryFn: async () => {
      if (!ticket?.seller_id) return null;
      
      const { count: totalSold } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', ticket.seller_id)
        .eq('status', 'sold');

      const { count: totalListed } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', ticket.seller_id);

      return {
        totalSold: totalSold || 0,
        totalListed: totalListed || 0,
        rating: 4.8, // Mock rating - in a real app this would come from reviews
        reviewCount: Math.max(1, Math.floor((totalSold || 0) * 0.8)) // Mock review count
      };
    },
    enabled: !!ticket?.seller_id,
  });

  const createConversation = async (type: 'buy_now' | 'offer', offerAmount?: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to contact the seller.",
        variant: "destructive"
      });
      return;
    }

    if (!ticket) return;

    setLoading(true);

    try {
      // Check if we're trying to buy our own ticket
      if (ticket.seller_id === user.id) {
        toast({
          title: "Cannot purchase own ticket",
          description: "You cannot buy your own ticket.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('ticket_id', ticket.id)
        .eq('buyer_id', user.id)
        .eq('seller_id', ticket.seller_id)
        .single();

      let conversationId;

      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        // Create new conversation
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            ticket_id: ticket.id,
            buyer_id: user.id,
            seller_id: ticket.seller_id,
          })
          .select()
          .single();

        if (conversationError) throw conversationError;
        conversationId = conversation.id;
      }

      // Create initial message
      let messageContent = '';
      let messageType = 'text';
      
      if (type === 'buy_now') {
        messageContent = `Order for ${ticket.events.name}\n\n1 X ${ticket.ticket_type}\n€${ticket.selling_price}\n\nConfirmed Amount\n€${ticket.selling_price}\nAwaiting Seller Confirmation`;
        messageType = 'purchase_request';
      } else {
        messageContent = `Hi! I'm interested in your tickets for ${ticket.events.name}. I'd like to make an offer of £${offerAmount} per ticket. Let me know if this works for you!`;
        messageType = 'offer';
      }

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          receiver_id: ticket.seller_id,
          content: messageContent,
          message_type: messageType
        });

      if (messageError) throw messageError;

      toast({
        title: type === 'buy_now' ? "Purchase request sent!" : "Offer sent!",
        description: "You'll be redirected to your messages.",
      });

      navigate('/messages');

    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const totalPrice = ticket.selling_price * ticket.quantity;
  const fees = Math.round(totalPrice * 0.05); // 5% fees
  const finalTotal = totalPrice + fees;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to event
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{ticket.events.name}</h1>
                
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span>{ticket.events.venue}, {ticket.events.city}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3" />
                    <span>{new Date(ticket.events.event_date).toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Ticket Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-semibold">{ticket.ticket_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-semibold">{ticket.quantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-green-100 text-green-700">
                      <Clock className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                    {ticket.profiles.is_verified && (
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified Seller
                      </Badge>
                    )}
                    {ticket.is_negotiable && (
                      <Badge variant="secondary">
                        Negotiable
                      </Badge>
                    )}
                  </div>

                  {ticket.description && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Ticket Description</h4>
                      <p className="text-gray-700 text-sm">{ticket.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{ticket.profiles.full_name}</p>
                        {ticket.profiles.is_verified && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{sellerStats?.rating || 4.8}</span>
                          <span className="ml-1">({sellerStats?.reviewCount || 1} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>{sellerStats?.totalSold || 0} tickets sold • {sellerStats?.totalListed || 1} total listings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing & Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Purchase Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Ticket price (x{ticket.quantity})</span>
                    <span>£{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Service fee</span>
                    <span>£{fees}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>£{finalTotal}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handleBuyNow}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Buy Now'}
                  </Button>
                  
                  {ticket.is_negotiable && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowOfferDialog(true)}
                      disabled={loading}
                    >
                      Make Offer
                    </Button>
                  )}
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  <p className="mb-2">✓ Direct contact with seller</p>
                  <p className="mb-2">✓ Secure messaging system</p>
                  <p>✓ Payment handled outside platform</p>
                </div>
              </CardContent>
            </Card>
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
