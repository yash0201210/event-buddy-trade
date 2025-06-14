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

// Mock data - this would come from your database
const ticketData = {
  "1": {
    id: "550e8400-e29b-41d4-a716-446655440001", // Valid UUID format for ticket
    eventTitle: 'Taylor Swift - Eras Tour',
    venue: 'Wembley Stadium',
    location: 'London, UK',
    date: '2024-08-15',
    time: '19:30',
    section: 'Lower Tier',
    row: 'M',
    seats: '12-13',
    price: 89,
    originalPrice: 95,
    quantity: 2,
    seller: 'Sarah M.',
    sellerRating: 4.9,
    sellerReviews: 45,
    sellerId: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
    isInstant: true,
    description: 'Great seats with excellent view of the stage. Tickets will be transferred immediately after payment.',
    transferMethod: 'Mobile transfer via Ticketmaster',
    saleEnds: '2024-08-14',
  }
};

const TicketDetails = () => {
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const ticket = ticketData[id as keyof typeof ticketData];

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  const createConversation = async (type: 'buy_now' | 'offer', offerAmount?: number) => {
    if (!user) return;

    setLoading(true);

    try {
      // Create conversation using the actual ticket UUID, not the URL parameter
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          ticket_id: ticket.id, // Use the UUID from ticket data
          buyer_id: user.id,
          seller_id: ticket.sellerId,
        })
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Create initial message
      let messageContent = '';
      if (type === 'buy_now') {
        messageContent = `Hi! I'd like to buy your tickets for ${ticket.eventTitle} at £${ticket.price} each. Please let me know how we can proceed with the transaction.`;
      } else {
        messageContent = `Hi! I'm interested in your tickets for ${ticket.eventTitle}. I'd like to make an offer of £${offerAmount} per ticket. Let me know if this works for you!`;
      }

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          receiver_id: ticket.sellerId,
          content: messageContent,
          message_type: type === 'offer' ? 'offer' : 'buy_request'
        });

      if (messageError) throw messageError;

      toast({
        title: type === 'buy_now' ? "Purchase request sent!" : "Offer sent!",
        description: "You'll be redirected to your messages.",
      });

      navigate('/messages');

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    createConversation('buy_now');
  };

  const handleMakeOffer = (amount: number) => {
    createConversation('offer', amount);
    setShowOfferDialog(false);
  };

  const totalPrice = ticket.price * ticket.quantity;
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
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{ticket.eventTitle}</h1>
                
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span>{ticket.venue}, {ticket.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3" />
                    <span>{new Date(ticket.date).toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })} at {ticket.time}</span>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Ticket Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Section</p>
                      <p className="font-semibold">{ticket.section}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Row</p>
                      <p className="font-semibold">{ticket.row}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Seats</p>
                      <p className="font-semibold">{ticket.seats}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-semibold">{ticket.quantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {ticket.isInstant && (
                      <Badge className="bg-green-100 text-green-700">
                        <Clock className="h-3 w-3 mr-1" />
                        Instant Download
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Seller
                    </Badge>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Ticket Description</h4>
                    <p className="text-gray-700 text-sm">{ticket.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{ticket.seller}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{ticket.sellerRating} ({ticket.sellerReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Transfer method:</strong> {ticket.transferMethod}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Sale ends:</strong> {new Date(ticket.saleEnds).toLocaleDateString('en-GB')}
                  </p>
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
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowOfferDialog(true)}
                    disabled={loading}
                  >
                    Make Offer
                  </Button>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  <p className="mb-2">✓ 100% money back guarantee</p>
                  <p className="mb-2">✓ Secure payment processing</p>
                  <p>✓ Customer support available 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <MakeOfferDialog 
        isOpen={showOfferDialog}
        onClose={() => setShowOfferDialog(false)}
        onSubmit={handleMakeOffer}
        ticketPrice={ticket.price}
        quantity={ticket.quantity}
      />
    </div>
  );
};

export default TicketDetails;
