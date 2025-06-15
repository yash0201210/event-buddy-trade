
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  message_type?: string;
}

export interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  ticket_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  ticket: {
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
  other_user: {
    id: string;
    full_name: string;
    email: string;
  };
  latest_message: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  messages: Message[];
}

export const useConversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string>('');

  const { data: conversations = [], isLoading: conversationsLoading, refetch: refetchConversations } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          tickets(
            id,
            title,
            selling_price,
            quantity,
            events(
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

      // Get additional user data and latest messages for each conversation
      const conversationsWithDetails = await Promise.all(
        data.map(async (conversation) => {
          // Get the other user's details
          const otherUserId = conversation.buyer_id === user.id 
            ? conversation.seller_id 
            : conversation.buyer_id;

          const { data: otherUser } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .eq('id', otherUserId)
            .single();

          // Get the latest message
          const { data: latestMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conversation,
            ticket: conversation.tickets,
            other_user: otherUser || { id: otherUserId, full_name: 'Unknown User', email: '' },
            latest_message: latestMessage || { content: '', created_at: conversation.created_at, sender_id: '' },
            messages: []
          };
        })
      );

      return conversationsWithDetails;
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

      return data;
    },
    enabled: !!selectedConversation,
  });

  return {
    conversations,
    conversationsLoading,
    messages,
    messagesLoading,
    selectedConversation,
    setSelectedConversation,
    refetchConversations,
    refetchMessages
  };
};
