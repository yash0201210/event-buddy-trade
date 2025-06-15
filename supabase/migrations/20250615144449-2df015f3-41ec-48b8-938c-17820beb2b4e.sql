
-- First, add the event_date column to the events table
ALTER TABLE public.events 
ADD COLUMN event_date DATE;

-- Copy data from start_date_time to event_date (taking just the date part)
UPDATE public.events 
SET event_date = start_date_time::DATE;

-- Make event_date not null now that we've populated it
ALTER TABLE public.events 
ALTER COLUMN event_date SET NOT NULL;

-- Now remove the start_date_time and end_date_time columns
ALTER TABLE public.events 
DROP COLUMN IF EXISTS start_date_time,
DROP COLUMN IF EXISTS end_date_time;
