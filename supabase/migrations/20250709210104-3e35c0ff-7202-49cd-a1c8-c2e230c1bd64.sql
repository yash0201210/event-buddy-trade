-- Update the offer notification trigger to handle status changes
DROP TRIGGER IF EXISTS trigger_notify_new_offer ON public.offers;
DROP FUNCTION IF EXISTS notify_new_offer();

-- Create enhanced offer notification function
CREATE OR REPLACE FUNCTION notify_offer_changes()
RETURNS TRIGGER AS $$
DECLARE
  ticket_title TEXT;
  buyer_name TEXT;
  seller_name TEXT;
BEGIN
  -- Get ticket title and user names for notifications
  SELECT t.title, bp.full_name, sp.full_name 
  INTO ticket_title, buyer_name, seller_name
  FROM public.tickets t
  JOIN public.profiles bp ON bp.id = NEW.buyer_id
  JOIN public.profiles sp ON sp.id = NEW.seller_id
  WHERE t.id = NEW.ticket_id;
  
  -- Handle new offer creation
  IF TG_OP = 'INSERT' THEN
    PERFORM create_notification(
      NEW.seller_id,
      'offer',
      'New Offer Received',
      buyer_name || ' offered £' || NEW.offered_price || ' for ' || COALESCE(ticket_title, 'your ticket'),
      NEW.id,
      jsonb_build_object('buyer_id', NEW.buyer_id, 'ticket_id', NEW.ticket_id, 'amount', NEW.offered_price)
    );
    
  -- Handle offer status updates
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    
    -- Notify buyer when offer is accepted
    IF NEW.status = 'accepted' THEN
      PERFORM create_notification(
        NEW.buyer_id,
        'offer_accepted',
        'Offer Accepted',
        'Great news! Your offer of £' || NEW.offered_price || ' for ' || COALESCE(ticket_title, 'the ticket') || ' has been accepted',
        NEW.id,
        jsonb_build_object('seller_id', NEW.seller_id, 'ticket_id', NEW.ticket_id, 'amount', NEW.offered_price)
      );
      
    -- Notify buyer when offer is rejected
    ELSIF NEW.status = 'rejected' THEN
      PERFORM create_notification(
        NEW.buyer_id,
        'offer_rejected',
        'Offer Declined',
        'Your offer of £' || NEW.offered_price || ' for ' || COALESCE(ticket_title, 'the ticket') || ' was declined',
        NEW.id,
        jsonb_build_object('seller_id', NEW.seller_id, 'ticket_id', NEW.ticket_id, 'amount', NEW.offered_price)
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for offer notifications
CREATE TRIGGER trigger_notify_offer_changes
  AFTER INSERT OR UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION notify_offer_changes();

-- Create table for ticket alerts/watchlist
CREATE TABLE IF NOT EXISTS public.ticket_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, event_id)
);

-- Enable RLS on ticket_alerts
ALTER TABLE public.ticket_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for ticket_alerts
CREATE POLICY "Users can manage their own ticket alerts" 
ON public.ticket_alerts 
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to notify users when new tickets are available for events they're watching
CREATE OR REPLACE FUNCTION notify_ticket_availability()
RETURNS TRIGGER AS $$
DECLARE
  alert_record RECORD;
  event_name TEXT;
BEGIN
  -- Only process when a new ticket becomes available
  IF TG_OP = 'INSERT' AND NEW.status = 'available' THEN
    
    -- Get event name
    SELECT name INTO event_name 
    FROM public.events 
    WHERE id = NEW.event_id;
    
    -- Find all users who have alerts for this event
    FOR alert_record IN 
      SELECT ta.user_id 
      FROM public.ticket_alerts ta
      WHERE ta.event_id = NEW.event_id 
        AND ta.is_active = true
        AND ta.user_id != NEW.seller_id -- Don't notify the seller of their own ticket
    LOOP
      PERFORM create_notification(
        alert_record.user_id,
        'ticket_alert',
        'New Tickets Available',
        'New tickets are now available for ' || COALESCE(event_name, 'an event you''re watching'),
        NEW.event_id,
        jsonb_build_object('ticket_id', NEW.id, 'seller_id', NEW.seller_id)
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ticket availability notifications
CREATE TRIGGER trigger_notify_ticket_availability
  AFTER INSERT ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION notify_ticket_availability();

-- Update notification types to include the new ones
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('message', 'offer', 'offer_accepted', 'offer_rejected', 'ticket_alert', 'system'));

-- Create function to toggle ticket alerts
CREATE OR REPLACE FUNCTION toggle_ticket_alert(event_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  alert_exists BOOLEAN;
  user_uuid UUID := auth.uid();
BEGIN
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Check if alert already exists
  SELECT EXISTS(
    SELECT 1 FROM public.ticket_alerts 
    WHERE user_id = user_uuid AND event_id = event_uuid AND is_active = true
  ) INTO alert_exists;
  
  IF alert_exists THEN
    -- Disable the alert
    UPDATE public.ticket_alerts 
    SET is_active = false, updated_at = now()
    WHERE user_id = user_uuid AND event_id = event_uuid;
    RETURN false;
  ELSE
    -- Create or reactivate the alert
    INSERT INTO public.ticket_alerts (user_id, event_id)
    VALUES (user_uuid, event_uuid)
    ON CONFLICT (user_id, event_id) 
    DO UPDATE SET is_active = true, updated_at = now();
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;