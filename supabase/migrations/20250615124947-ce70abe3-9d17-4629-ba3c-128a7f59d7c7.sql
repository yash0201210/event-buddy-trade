
-- Update the events table to use start_date_time and end_date_time instead of event_date
ALTER TABLE public.events 
  ADD COLUMN start_date_time timestamp with time zone,
  ADD COLUMN end_date_time timestamp with time zone;

-- Copy existing event_date data to start_date_time
UPDATE public.events 
SET start_date_time = event_date 
WHERE event_date IS NOT NULL;

-- Make start_date_time required for new events
ALTER TABLE public.events 
  ALTER COLUMN start_date_time SET NOT NULL;

-- Drop the old event_date column
ALTER TABLE public.events 
  DROP COLUMN event_date;
