
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TicketWithDetails {
  id: string;
  seller_id: string;
  selling_price: number;
  events: {
    name: string;
  };
  ticket_type: string;
}

export const useTicketActions = (ticket?: TicketWithDetails) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return {
    loading,
    createConversation
  };
};
