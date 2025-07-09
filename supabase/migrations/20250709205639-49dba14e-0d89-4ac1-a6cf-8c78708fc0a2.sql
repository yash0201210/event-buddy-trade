-- Add read_at column to messages table for tracking read status
ALTER TABLE public.messages 
ADD COLUMN read_at TIMESTAMP WITH TIME ZONE NULL;

-- Create index for faster queries on unread messages
CREATE INDEX idx_messages_read_status ON public.messages (receiver_id, read_at) WHERE read_at IS NULL;

-- Create a function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(conversation_uuid UUID, user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.messages 
  SET read_at = now()
  WHERE conversation_id = conversation_uuid 
    AND receiver_id = user_uuid 
    AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a notifications table for better notification management
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('message', 'offer', 'ticket_alert', 'system')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  related_id UUID NULL,
  metadata JSONB NULL
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for faster notification queries
CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id, is_read, created_at DESC);

-- Create function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
  target_user_id UUID,
  notification_type TEXT,
  notification_title TEXT,
  notification_description TEXT,
  related_record_id UUID DEFAULT NULL,
  notification_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, 
    type, 
    title, 
    description, 
    related_id, 
    metadata
  )
  VALUES (
    target_user_id,
    notification_type,
    notification_title,
    notification_description,
    related_record_id,
    notification_metadata
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create message notifications
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification for regular messages, not system messages
  IF NEW.message_type = 'text' THEN
    PERFORM create_notification(
      NEW.receiver_id,
      'message',
      'New Message',
      CASE 
        WHEN length(NEW.content) > 100 THEN left(NEW.content, 100) || '...'
        ELSE NEW.content
      END,
      NEW.conversation_id,
      jsonb_build_object('sender_id', NEW.sender_id, 'message_id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();

-- Create trigger to automatically create offer notifications
CREATE OR REPLACE FUNCTION notify_new_offer()
RETURNS TRIGGER AS $$
DECLARE
  ticket_title TEXT;
BEGIN
  -- Get ticket title for the notification
  SELECT title INTO ticket_title 
  FROM public.tickets 
  WHERE id = NEW.ticket_id;
  
  PERFORM create_notification(
    NEW.seller_id,
    'offer',
    'New Offer Received',
    'You received a £' || NEW.offered_price || ' offer for ' || COALESCE(ticket_title, 'your ticket'),
    NEW.id,
    jsonb_build_object('buyer_id', NEW.buyer_id, 'ticket_id', NEW.ticket_id, 'amount', NEW.offered_price)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_offer
  AFTER INSERT ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_offer();

-- Create function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_as_read(notification_ids UUID[])
RETURNS void AS $$
BEGIN
  UPDATE public.notifications 
  SET is_read = true, read_at = now(), updated_at = now()
  WHERE id = ANY(notification_ids) 
    AND user_id = auth.uid()
    AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;