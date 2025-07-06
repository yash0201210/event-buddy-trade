
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotificationEmails = () => {
  const sendNotificationEmail = useCallback(async (
    userEmail: string,
    type: 'new_message' | 'offer_response' | 'transaction_update' | 'ticket_available',
    data: {
      userName?: string
      eventName?: string
      ticketTitle?: string
      messagePreview?: string
      offerAmount?: number
      status?: string
    }
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: { to: userEmail, type, data }
      });

      if (error) {
        console.error('Error sending notification email:', error);
      } else {
        console.log('Notification email sent successfully');
      }
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }
  }, []);

  return { sendNotificationEmail };
};
