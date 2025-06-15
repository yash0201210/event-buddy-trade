
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useConversations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          tickets!inner(
            id,
            title,
            selling_price,
            status,
            events(name, venue, city, start_date_time)
          ),
          messages(
            id,
            content,
            created_at,
            sender_id,
            message_type
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data?.map(conversation => {
        const otherUserId = conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id;
        const latestMessage = conversation.messages?.[conversation.messages.length - 1];
        
        return {
          ...conversation,
          other_user_id: otherUserId,
          latest_message: latestMessage,
          ticket: conversation.tickets
        };
      }) || [];
    },
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name),
          receiver:profiles!messages_receiver_id_fkey(full_name)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  return {
    conversations,
    messages,
    refetchConversations,
    refetchMessages
  };
};
