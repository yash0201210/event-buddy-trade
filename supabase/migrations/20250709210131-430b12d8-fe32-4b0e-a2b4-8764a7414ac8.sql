-- Add missing updated_at column to ticket_alerts table
ALTER TABLE public.ticket_alerts 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();