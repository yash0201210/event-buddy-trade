
-- Update the events table to use event_date instead of start_date_time and end_date_time
-- First, add the event_date column
ALTER TABLE public.events 
  ADD COLUMN event_date timestamp with time zone;

-- Copy start_date_time data to event_date
UPDATE public.events 
SET event_date = start_date_time 
WHERE start_date_time IS NOT NULL;

-- Make event_date required for new events
ALTER TABLE public.events 
  ALTER COLUMN event_date SET NOT NULL;

-- Drop the start_date_time and end_date_time columns
ALTER TABLE public.events 
  DROP COLUMN start_date_time,
  DROP COLUMN end_date_time;
