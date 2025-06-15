
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Conversation {
  id: string;
  ticket_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  ticket?: {
    id: string;
    title: string;
    selling_price: number;
    quantity: number;
    event?: {
      id: string;
      name: string;
      venue: string;
      start_date_time: string;
    };
  };
  other_user?: {
    id: string;
    full_name: string;
    email: string;
  };
  latest_message?: {
    content: string;
    created_at: string;
    message_type: string;
  };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  created_at: string;
}

export const useConversations = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const { data: conversations = [], isLoading: conversationsLoading, refetch: refetchConversations } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select(`
          *,
          tickets (
            id,
            title,
            selling_price,
            quantity,
            events (
              id,
              name,
              venue,
              start_date_time
            )
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      // Get the other user's details and latest message for each conversation
      const conversationsWithDetails = await Promise.all(
        conversationsData.map(async (conv) => {
          const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
          
          // Get other user details
          const { data: otherUser } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .eq('id', otherUserId)
            .single();

          // Get latest message
          const { data: latestMessage } = await supabase
            .from('messages')
            .select('content, created_at, message_type')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            ticket: conv.tickets,
            other_user: otherUser,
            latest_message: latestMessage
          };
        })
      );

      return conversationsWithDetails as Conversation[];
    },
    enabled: !!user?.id,
  });

  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return data as Message[];
    },
    enabled: !!selectedConversation,
  });

  // Listen for new messages
  useEffect(() => {
    if (!user?.id || !selectedConversation) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        () => {
          refetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, selectedConversation, refetchMessages]);

  // Listen for conversation updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          refetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetchConversations]);

  return {
    conversations,
    conversationsLoading,
    messages,
    messagesLoading,
    selectedConversation,
    setSelectedConversation,
    refetchConversations,
    refetchMessages,
  };
};
