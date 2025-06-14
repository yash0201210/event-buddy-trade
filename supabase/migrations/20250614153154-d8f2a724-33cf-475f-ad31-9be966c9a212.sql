
-- Add a sold_at timestamp to track when tickets are sold
ALTER TABLE public.tickets 
ADD COLUMN sold_at TIMESTAMP WITH TIME ZONE;

-- Update the status options to include 'sold'
-- Note: We're not using CHECK constraints as they can cause issues with time-based validations
-- The application will handle status validation

-- Create an index for better performance when querying sold tickets
CREATE INDEX idx_tickets_status_sold_at ON public.tickets(status, sold_at);

-- Add a function to automatically set sold_at when status changes to 'sold'
CREATE OR REPLACE FUNCTION public.update_ticket_sold_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sold' AND OLD.status != 'sold' THEN
    NEW.sold_at = now();
  ELSIF NEW.status != 'sold' THEN
    NEW.sold_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update sold_at timestamp
CREATE TRIGGER trigger_update_ticket_sold_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ticket_sold_at();
