
-- Add ticket_types column to events table to store available ticket types for each event
ALTER TABLE public.events 
ADD COLUMN ticket_types TEXT[] DEFAULT '{}';

-- Update the tickets table to use ticket_type instead of section/row/seat
ALTER TABLE public.tickets 
DROP COLUMN IF EXISTS section,
DROP COLUMN IF EXISTS row_number,
DROP COLUMN IF EXISTS seat_numbers;

-- Make sure ticket_type column exists and is required
ALTER TABLE public.tickets 
ALTER COLUMN ticket_type SET NOT NULL;

-- Add a constraint to ensure ticket_type is not empty
ALTER TABLE public.tickets 
ADD CONSTRAINT ticket_type_not_empty CHECK (ticket_type <> '');
