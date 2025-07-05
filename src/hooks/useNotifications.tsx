
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  type: 'message' | 'offer' | 'ticket_alert';
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
  related_id?: string;
}

export const useNotifications = () => {
  const { user } = useAuth();

  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get unread messages count
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id, conversation_id, content, created_at, conversations!inner(*)')
        .eq('receiver_id', user.id)
        .is('read_at', null);

      // Get recent offers
      const { data: recentOffers } = await supabase
        .from('offers')
        .select('*, tickets!inner(title)')
        .eq('seller_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      const notifications: Notification[] = [];

      // Add message notifications
      if (unreadMessages) {
        unreadMessages.forEach(message => {
          notifications.push({
            id: `message-${message.id}`,
            type: 'message',
            title: 'New Message',
            description: message.content.substring(0, 100) + '...',
            is_read: false,
            created_at: message.created_at,
            related_id: message.conversation_id,
          });
        });
      }

      // Add offer notifications
      if (recentOffers) {
        recentOffers.forEach(offer => {
          notifications.push({
            id: `offer-${offer.id}`,
            type: 'offer',
            title: 'New Offer Received',
            description: `£${offer.offered_price} offer for ${offer.tickets?.title}`,
            is_read: false,
            created_at: offer.created_at,
            related_id: offer.id,
          });
        });
      }

      return notifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!user,
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const hasUnreadMessages = notifications.some(n => n.type === 'message' && !n.is_read);

  return {
    notifications,
    unreadCount,
    hasUnreadMessages,
    isLoading,
    refetch,
  };
};
