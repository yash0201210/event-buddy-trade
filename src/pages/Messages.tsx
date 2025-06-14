
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

interface Conversation {
  id: string;
  ticket_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  created_at: string;
  ticket: {
    title: string;
    selling_price: number;
    event: {
      name: string;
      venue: string;
      event_date: string;
    };
  };
  buyer_profile: {
    full_name: string;
  };
  seller_profile: {
    full_name: string;
  };
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

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          tickets!conversations_ticket_id_fkey (
            title,
            selling_price,
            events!tickets_event_id_fkey (
              name,
              venue,
              event_date
            )
          ),
          profiles!conversations_buyer_id_fkey (
            full_name
          ),
          profiles!conversations_seller_id_fkey (
            full_name
          ),
          messages (
            id,
            content,
            sender_id,
            message_type,
            created_at
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
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

  const handleAcceptOffer = (conversationId: string) => {
    sendMessageMutation.mutate({
      conversationId,
      content: "Great! I accept your offer. Let's proceed with the transaction. Please contact me to arrange the transfer.",
      messageType: 'offer_accepted',
    });
  };

  const handleRejectOffer = (conversationId: string) => {
    sendMessageMutation.mutate({
      conversationId,
      content: "Thank you for your offer, but I'm not able to accept it at this time.",
      messageType: 'offer_rejected',
    });
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
                    const otherParty = isCurrentUserBuyer 
                      ? conversation.seller_profile 
                      : conversation.buyer_profile;
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
                          <h4 className="font-semibold text-sm">{otherParty?.full_name}</h4>
                          <Badge variant={isCurrentUserBuyer ? "secondary" : "default"}>
                            {isCurrentUserBuyer ? 'Buying' : 'Selling'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">
                          {conversation.tickets?.title}
                        </p>
                        {lastMessage && (
                          <p className="text-xs text-gray-500 truncate">
                            {lastMessage.content}
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
                        {selectedConv.tickets?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        £{selectedConv.tickets?.selling_price} • {
                          isUserBuyer 
                            ? selectedConv.seller_profile?.full_name 
                            : selectedConv.buyer_profile?.full_name
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
                      const isOffer = message.message_type === 'offer';
                      const isOfferResponse = ['offer_accepted', 'offer_rejected'].includes(message.message_type);
                      
                      return (
                        <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn 
                              ? 'bg-red-600 text-white' 
                              : isOffer 
                                ? 'bg-yellow-100 border border-yellow-300'
                                : isOfferResponse
                                  ? 'bg-green-100 border border-green-300'
                                  : 'bg-gray-100'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-red-100' : 'text-gray-500'}`}>
                              {new Date(message.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            
                            {/* Offer Actions - only show for sellers receiving offers */}
                            {isOffer && !isOwn && !isUserBuyer && (
                              <div className="mt-2 flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptOffer(selectedConv.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectOffer(selectedConv.id)}
                                  className="text-xs"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
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
                          <p>1. Agree on price and payment method with the seller</p>
                          <p>2. Transfer payment outside this platform (bank transfer, PayPal, etc.)</p>
                          <p>3. Seller will transfer tickets after payment confirmation</p>
                          <p>4. Verify tickets before finalizing</p>
                        </>
                      ) : (
                        <>
                          <p>1. Discuss price and payment method with the buyer</p>
                          <p>2. Wait for payment confirmation outside this platform</p>
                          <p>3. Transfer tickets immediately after receiving payment</p>
                          <p>4. Provide transfer confirmation to buyer</p>
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
    </div>
  );
};

export default Messages;
