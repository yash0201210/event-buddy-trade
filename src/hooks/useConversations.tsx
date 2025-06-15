
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ConversationWithDetails {
  id: string;
  ticket_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  created_at: string;
  updated_at: string;
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

export const useConversations = (userId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      if (!userId) return [];

      // Get conversations where user is buyer or seller
      const { data: conversationsData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (convError) {
        console.error('Error fetching conversations:', convError);
        return [];
      }

      if (!conversationsData) return [];

      // Get additional details for each conversation
      const conversationsWithDetails = await Promise.all(
        conversationsData.map(async (conv) => {
          const otherUserId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id;
          
          // Get ticket details
          const { data: ticket } = await supabase
            .from('tickets')
            .select(`
              title,
              selling_price,
              event_id,
              events!inner(name, venue, start_date_time)
            `)
            .eq('id', conv.ticket_id)
            .single();

          // Get other user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', otherUserId)
            .single();

          // Get messages for this conversation
          const { data: messages = [] } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          return {
            ...conv,
            ticket_title: ticket?.title || 'Unknown Ticket',
            ticket_price: ticket?.selling_price || 0,
            event_name: ticket?.events?.name || 'Unknown Event',
            event_venue: ticket?.events?.venue || 'Unknown Venue',
            event_date: ticket?.events?.start_date_time || '',
            buyer_name: conv.buyer_id === userId ? user?.email : profile?.full_name || 'Unknown User',
            seller_name: conv.seller_id === userId ? user?.email : profile?.full_name || 'Unknown User',
            messages: messages || []
          } as ConversationWithDetails;
        })
      );

      return conversationsWithDetails;
    },
    enabled: !!userId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content, messageType = 'text' }: {
      conversationId: string;
      content: string;
      messageType?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) throw new Error('Conversation not found');

      const receiverId = conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          message_type: messageType
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
    },
  });

  const markTicketAsSold = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const { error } = await supabase
      .from('tickets')
      .update({ status: 'sold' })
      .eq('id', conversation.ticket_id);

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
    }
  };

  return {
    conversations,
    isLoading,
    sendMessageMutation,
    markTicketAsSold
  };
};
