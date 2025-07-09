
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  type: 'message' | 'offer' | 'offer_accepted' | 'offer_rejected' | 'ticket_alert' | 'system';
  title: string;
  description: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  related_id?: string;
  metadata?: any;
}

export const useNotifications = () => {
  const { user } = useAuth();

  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching notifications for user:', user.id);

      // Get notifications from the notifications table
      const { data: dbNotifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        // If RLS is blocking, try to get session info
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Current session:', sessionData.session?.user?.id);
        return [];
      }

      console.log('Fetched notifications:', dbNotifications);
      return dbNotifications || [];
    },
    enabled: !!user,
    refetchInterval: 10000, // Refetch every 10 seconds instead of real-time
  });

  // Also listen for unread messages for the message icon
  const { data: unreadMessagesCount = 0 } = useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .is('read_at', null);

      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const hasUnreadMessages = unreadMessagesCount > 0;

  const markAsRead = async (notificationIds: string[]) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('mark_notifications_as_read', {
        notification_ids: notificationIds
      });

      if (error) {
        console.error('Error marking notifications as read:', error);
      } else {
        refetch(); // Refetch to update the UI
      }
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('mark_messages_as_read', {
        conversation_uuid: conversationId,
        user_uuid: user.id
      });

      if (error) {
        console.error('Error marking messages as read:', error);
      }
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    hasUnreadMessages,
    unreadMessagesCount,
    isLoading,
    refetch,
    markAsRead,
    markMessagesAsRead,
  };
};
