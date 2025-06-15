
import { useQuery } from '@tanstack/react-query';
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
  ticket: {
    id: string;
    title: string;
    selling_price: number;
    ticket_type: string;
    event: {
      name: string;
      event_date: string;
    };
  };
  other_user: {
    full_name: string;
    is_verified: boolean;
  };
  latest_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
}

export const useConversations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get conversations where user is buyer or seller
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select(`
          *,
          tickets!inner (
            id,
            title,
            selling_price,
            ticket_type,
            events!inner (
              name,
              event_date
            )
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (convError) {
        console.error('Error fetching conversations:', convError);
        return [];
      }

      if (!conversations) return [];

      // Get the other user profiles
      const conversationsWithDetails = await Promise.all(
        conversations.map(async (conv) => {
          const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
          
          // Get other user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, is_verified')
            .eq('id', otherUserId)
            .single();

          // Get latest message
          const { data: latestMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            ticket: conv.tickets,
            other_user: profile || { full_name: 'Unknown User', is_verified: false },
            latest_message: latestMessage
          };
        })
      );

      return conversationsWithDetails as ConversationWithDetails[];
    },
    enabled: !!user,
  });
};
