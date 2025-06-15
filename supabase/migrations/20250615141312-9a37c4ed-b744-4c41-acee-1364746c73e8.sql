
-- First, drop the existing events table and recreate it from scratch
DROP TABLE IF EXISTS public.events CASCADE;

-- Create a fresh events table with all necessary attributes
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  start_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date_time TIMESTAMP WITH TIME ZONE,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  ticket_types TEXT[] DEFAULT '{}',
  university_id UUID REFERENCES public.universities(id),
  venue_id UUID REFERENCES public.venues(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (though we'll keep it permissive for now)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows everyone to read events
CREATE POLICY "Anyone can view events" 
  ON public.events 
  FOR SELECT 
  USING (true);

-- Create policy for authenticated users to insert/update/delete events
CREATE POLICY "Authenticated users can manage events" 
  ON public.events 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Add some indexes for performance
CREATE INDEX events_start_date_time_idx ON public.events(start_date_time);
CREATE INDEX events_city_idx ON public.events(city);
CREATE INDEX events_category_idx ON public.events(category);
CREATE INDEX events_university_id_idx ON public.events(university_id);
CREATE INDEX events_venue_id_idx ON public.events(venue_id);
