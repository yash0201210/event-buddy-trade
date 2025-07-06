
-- Add columns to conversations table to track order confirmation timing
ALTER TABLE public.conversations 
ADD COLUMN order_confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN order_expires_at TIMESTAMP WITH TIME ZONE;

-- Create a function to automatically set expiration time when order is confirmed
CREATE OR REPLACE FUNCTION public.set_order_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- If order_confirmed_at is being set for the first time
  IF NEW.order_confirmed_at IS NOT NULL AND OLD.order_confirmed_at IS NULL THEN
    NEW.order_expires_at = NEW.order_confirmed_at + INTERVAL '12 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set expiration time
CREATE TRIGGER trigger_set_order_expiration
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_expiration();

-- Add index for efficient querying of expired orders
CREATE INDEX idx_conversations_order_expires_at ON public.conversations(order_expires_at);
