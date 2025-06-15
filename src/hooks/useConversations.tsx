
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useConversations = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Get conversations with related data
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
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
    enabled: !!userId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content, messageType = 'text' }: {
      conversationId: string;
      content: string;
      messageType?: string;
    }) => {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) throw new Error('Conversation not found');

      const receiverId = conversation.buyer_id === userId ? conversation.seller_id : conversation.buyer_id;

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId!,
          receiver_id: receiverId,
          content,
          message_type: messageType,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const markTicketAsSold = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    try {
      console.log('Updating ticket status to sold for ticket:', conversation.ticket_id);
      
      // Update ticket status to 'sold' and set sold_at timestamp
      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ 
          status: 'sold',
          sold_at: new Date().toISOString()
        })
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

      console.log('Ticket status updated successfully to sold');

      // Invalidate all relevant queries to refresh data across the app
      queryClient.invalidateQueries({ queryKey: ['event-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['event-sold-tickets-count'] });
      queryClient.invalidateQueries({ queryKey: ['seller-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      // Also invalidate any event-specific queries
      if (conversation.ticket_id) {
        // Get the event ID from the ticket and invalidate event-specific queries
        const { data: ticketData } = await supabase
          .from('tickets')
          .select('event_id')
          .eq('id', conversation.ticket_id)
          .single();
          
        if (ticketData?.event_id) {
          queryClient.invalidateQueries({ queryKey: ['event-tickets', ticketData.event_id] });
          queryClient.invalidateQueries({ queryKey: ['event-sold-tickets-count', ticketData.event_id] });
        }
      }

      toast({
        title: "Success",
        description: "Transaction completed successfully!",
      });

    } catch (error) {
      console.error('Error in markTicketAsSold:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    }
  };

  return {
    conversations,
    isLoading,
    sendMessageMutation,
    markTicketAsSold
  };
};
