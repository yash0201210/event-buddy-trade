
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useConversations = (userId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations = [], refetch: refetchConversations, isLoading } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          tickets!inner(
            id,
            title,
            selling_price,
            status
          ),
          messages(
            id,
            content,
            created_at,
            sender_id,
            message_type
          )
        `)
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data?.map(conversation => {
        const otherUserId = conversation.buyer_id === userId ? conversation.seller_id : conversation.buyer_id;
        const latestMessage = conversation.messages?.[conversation.messages.length - 1];
        
        return {
          ...conversation,
          other_user_id: otherUserId,
          latest_message: latestMessage,
          ticket: conversation.tickets,
          ticket_price: Array.isArray(conversation.tickets) ? conversation.tickets[0]?.selling_price || 0 : 0
        };
      }) || [];
    },
    enabled: !!userId,
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name),
          receiver:profiles!messages_receiver_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
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
      if (!conversation || !userId) throw new Error('Invalid conversation or user');

      const receiverId = conversation.buyer_id === userId ? conversation.seller_id : conversation.buyer_id;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          receiver_id: receiverId,
          content,
          message_type: messageType
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetchConversations();
      refetchMessages();
    },
  });

  const markTicketAsSold = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    const ticketData = Array.isArray(conversation?.tickets) ? conversation.tickets[0] : conversation?.tickets;
    if (!ticketData?.id) return;

    const { error } = await supabase
      .from('tickets')
      .update({ status: 'sold' })
      .eq('id', ticketData.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark ticket as sold",
        variant: "destructive"
      });
    } else {
      refetchConversations();
    }
  };

  return {
    conversations,
    messages,
    refetchConversations,
    refetchMessages,
    isLoading,
    sendMessageMutation,
    markTicketAsSold
  };
};
