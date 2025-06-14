import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Send, Clock, Check, X, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BankDetailsDialog } from '@/components/messages/BankDetailsDialog';
import { CounterOfferDialog } from '@/components/messages/CounterOfferDialog';

interface Conversation {
  id: string;
  ticket_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  created_at: string;
  ticket_title?: string;
  ticket_price?: number;
  event_name?: string;
  event_venue?: string;
  event_date?: string;
  buyer_name?: string;
  seller_name?: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  message_type: string;
  created_at: string;
}

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [pendingAcceptConversation, setPendingAcceptConversation] = useState<string | null>(null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get conversations with related data
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Get related data for each conversation
      const enrichedConversations = await Promise.all(
        conversationsData.map(async (conv) => {
          // Get ticket data
          const { data: ticketData } = await supabase
            .from('tickets')
            .select(`
              title,
              selling_price,
              events!tickets_event_id_fkey (
                name,
                venue,
                event_date
              )
            `)
            .eq('id', conv.ticket_id)
            .single();

          // Get buyer profile
          const { data: buyerProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', conv.buyer_id)
            .single();

          // Get seller profile
          const { data: sellerProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', conv.seller_id)
            .single();

          // Get messages
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          return {
            ...conv,
            ticket_title: ticketData?.title || 'Unknown Ticket',
            ticket_price: ticketData?.selling_price || 0,
            event_name: ticketData?.events?.name || 'Unknown Event',
            event_venue: ticketData?.events?.venue || 'Unknown Venue',
            event_date: ticketData?.events?.event_date || '',
            buyer_name: buyerProfile?.full_name || 'Unknown User',
            seller_name: sellerProfile?.full_name || 'Unknown User',
            messages: messages || []
          };
        })
      );

      return enrichedConversations as Conversation[];
    },
    enabled: !!user,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content, messageType = 'text' }: {
      conversationId: string;
      content: string;
      messageType?: string;
    }) => {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) throw new Error('Conversation not found');

      const receiverId = conversation.buyer_id === user?.id ? conversation.seller_id : conversation.buyer_id;

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user!.id,
          receiver_id: receiverId,
          content,
          message_type: messageType,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setNewMessage('');
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold mb-4">Authentication Required</h1>
              <p className="text-gray-600 mb-4">Please sign in to view your messages</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const isUserBuyer = selectedConv ? selectedConv.buyer_id === user.id : false;

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      conversationId: selectedConversation,
      content: newMessage.trim(),
    });
  };

  const handleAcceptPurchaseRequest = (conversationId: string) => {
    setPendingAcceptConversation(conversationId);
    setShowBankDetails(true);
  };

  const handleRejectPurchaseRequest = (conversationId: string) => {
    setShowCounterOffer(true);
    setPendingAcceptConversation(conversationId);
  };

  const handleBankDetailsSubmitted = () => {
    if (pendingAcceptConversation) {
      sendMessageMutation.mutate({
        conversationId: pendingAcceptConversation,
        content: "Order Confirmed!\n\nThe order has now been confirmed. Transfer €9.73 to the seller once they share their bank details!\n\nHi, please send me €9.73 on the following bank details:\n\nFull Name: Yash Agrawal\nSort Code: XX - XX - XX\nAccount Number: 12736892\n\nRemember to confirm here once you have sent this money across!",
        messageType: 'order_confirmed',
      });
    }
    setShowBankDetails(false);
    setPendingAcceptConversation(null);
  };

  const handleCounterOfferSubmitted = (amount: number) => {
    if (pendingAcceptConversation) {
      sendMessageMutation.mutate({
        conversationId: pendingAcceptConversation,
        content: `I appreciate your interest, but I'd like to counter with €${amount}. Let me know if this works for you!`,
        messageType: 'counter_offer',
      });
    }
    setShowCounterOffer(false);
    setPendingAcceptConversation(null);
  };

  const handleConfirmTransfer = (conversationId: string) => {
    sendMessageMutation.mutate({
      conversationId,
      content: "Funds Transferred!\n\nNow that you have sent this money across, Once the seller confirms they have received the funds, you will be able to view your ticket. Click below to view your tickets now!",
      messageType: 'transfer_confirmation',
    });
  };

  const handleFundsReceived = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    try {
      // Update ticket status to 'sold'
      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ status: 'sold' })
        .eq('id', conversation.ticket_id);

      if (ticketError) {
        console.error('Error updating ticket status:', ticketError);
        toast({
          title: "Error",
          description: "Failed to update ticket status",
          variant: "destructive"
        });
        return;
      }

      // Send the funds received message
      sendMessageMutation.mutate({
        conversationId,
        content: "Funds Received!\n\nThis transaction is now complete, thank you!\n\nYou can view all your selling activity in your Selling Hub.",
        messageType: 'funds_received',
      });

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['event-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['event-sold-tickets-count'] });

    } catch (error) {
      console.error('Error in handleFundsReceived:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleViewTransactionDetails = (conversationId: string) => {
    navigate(`/my-tickets?conversation=${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No messages yet
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conversation) => {
                    const isCurrentUserBuyer = conversation.buyer_id === user.id;
                    const otherPartyName = isCurrentUserBuyer 
                      ? conversation.seller_name 
                      : conversation.buyer_name;
                    const lastMessage = conversation.messages?.[conversation.messages.length - 1];
                    
                    return (
                      <div
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                          selectedConversation === conversation.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{otherPartyName}</h4>
                          <Badge variant={isCurrentUserBuyer ? "secondary" : "default"}>
                            {isCurrentUserBuyer ? 'Buying' : 'Selling'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">
                          {conversation.ticket_title}
                        </p>
                        {lastMessage && (
                          <p className="text-xs text-gray-500 truncate">
                            {lastMessage.content.split('\n')[0]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedConv ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle className="text-lg">
                        {selectedConv.ticket_title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        €{selectedConv.ticket_price} • {
                          isUserBuyer 
                            ? selectedConv.seller_name
                            : selectedConv.buyer_name
                        }
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col h-[400px]">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 p-4">
                    {selectedConv.messages?.map((message) => {
                      const isOwn = message.sender_id === user.id;
                      const isPurchaseRequest = message.message_type === 'purchase_request';
                      const isOrderConfirmed = message.message_type === 'order_confirmed';
                      const isTransferConfirmation = message.message_type === 'transfer_confirmation';
                      const isFundsReceived = message.message_type === 'funds_received';
                      
                      return (
                        <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            isOwn 
                              ? 'bg-red-600 text-white' 
                              : isPurchaseRequest
                                ? 'bg-gray-100 border'
                                : isOrderConfirmed
                                  ? 'bg-green-100 border border-green-300'
                                  : isTransferConfirmation
                                    ? 'bg-blue-100 border border-blue-300'
                                    : isFundsReceived
                                      ? 'bg-green-100 border border-green-300'
                                      : 'bg-gray-100'
                          }`}>
                            <div className="whitespace-pre-line text-sm">{message.content}</div>
                            <p className={`text-xs mt-2 ${isOwn ? 'text-red-100' : 'text-gray-500'}`}>
                              {new Date(message.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            
                            {/* Purchase Request Actions - only show for sellers */}
                            {isPurchaseRequest && !isOwn && !isUserBuyer && (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptPurchaseRequest(selectedConv.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectPurchaseRequest(selectedConv.id)}
                                  className="text-xs"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Counter Offer
                                </Button>
                              </div>
                            )}

                            {/* Transfer Confirmation Actions - only show for buyers */}
                            {isOrderConfirmed && !isOwn && isUserBuyer && (
                              <div className="mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmTransfer(selectedConv.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs w-full"
                                >
                                  Confirm Transfer
                                </Button>
                              </div>
                            )}

                            {/* Clickable Transaction Details Box - show for buyers after they confirm transfer */}
                            {isTransferConfirmation && isOwn && isUserBuyer && (
                              <div 
                                className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                                onClick={() => handleViewTransactionDetails(selectedConv.id)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-blue-800 text-xs">Transaction Status</h4>
                                  <Badge variant="outline" className="text-xs">
                                    Pending Seller
                                  </Badge>
                                </div>
                                <p className="text-xs text-blue-700 mb-2">
                                  {selectedConv.event_name} • €{selectedConv.ticket_price}
                                </p>
                                <p className="text-xs text-blue-600">
                                  📍 Waiting for seller to confirm receipt
                                </p>
                                <div className="mt-2 text-xs text-blue-500 italic">
                                  Click to view full transaction details →
                                </div>
                              </div>
                            )}

                            {/* Funds Received Action - only show for sellers */}
                            {isTransferConfirmation && !isOwn && !isUserBuyer && (
                              <div className="mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleFundsReceived(selectedConv.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs w-full"
                                >
                                  Funds Received
                                </Button>
                              </div>
                            )}

                            {/* Go to Selling Hub link - show for sellers after funds received */}
                            {isFundsReceived && isOwn && !isUserBuyer && (
                              <div className="mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate('/selling-hub')}
                                  className="text-xs w-full bg-white hover:bg-gray-50"
                                >
                                  Go to My Selling Hub
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Transaction Instructions */}
                  <div className="border-t bg-blue-50 p-3 rounded-lg mb-4">
                    <h4 className="font-semibold text-sm mb-2">Transaction Instructions</h4>
                    <div className="text-xs text-gray-700 space-y-1">
                      {isUserBuyer ? (
                        <>
                          <p>1. Wait for seller to accept your purchase request</p>
                          <p>2. Transfer payment using the provided bank details</p>
                          <p>3. Confirm transfer in the chat</p>
                          <p>4. Receive tickets after seller confirms payment</p>
                        </>
                      ) : (
                        <>
                          <p>1. Accept or counter purchase requests</p>
                          <p>2. Share your bank details for payment</p>
                          <p>3. Wait for payment confirmation from buyer</p>
                          <p>4. Transfer tickets after confirming payment received</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </main>

      <BankDetailsDialog
        isOpen={showBankDetails}
        onClose={() => setShowBankDetails(false)}
        onSubmit={handleBankDetailsSubmitted}
      />

      <CounterOfferDialog
        isOpen={showCounterOffer}
        onClose={() => setShowCounterOffer(false)}
        onSubmit={handleCounterOfferSubmitted}
        originalPrice={selectedConv?.ticket_price || 0}
      />
    </div>
  );
};

export default Messages;
