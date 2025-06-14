
-- Create universities table
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  city TEXT,
  country TEXT DEFAULT 'UK',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create venues table
CREATE TABLE public.venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  capacity INTEGER,
  university_id UUID REFERENCES public.universities(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add university_id and venue_id to events table
ALTER TABLE public.events 
ADD COLUMN university_id UUID REFERENCES public.universities(id),
ADD COLUMN venue_id UUID REFERENCES public.venues(id);

-- Insert some sample universities
INSERT INTO public.universities (name, city) VALUES
('University of Oxford', 'Oxford'),
('University of Cambridge', 'Cambridge'),
('Imperial College London', 'London'),
('University College London', 'London'),
('King''s College London', 'London'),
('University of Edinburgh', 'Edinburgh'),
('University of Manchester', 'Manchester'),
('University of Bristol', 'Bristol'),
('University of Warwick', 'Coventry'),
('London School of Economics', 'London');

-- Insert some sample venues
INSERT INTO public.venues (name, address, city) VALUES
('O2 Arena', 'Peninsula Square', 'London'),
('Manchester Arena', 'Victoria Station', 'Manchester'),
('First Direct Arena', 'Clay Pit Lane', 'Leeds'),
('Motorpoint Arena', 'Bolero Square', 'Cardiff'),
('P&J Live', 'East Burn Road', 'Aberdeen'),
('SEC Armadillo', 'Exhibition Way', 'Glasgow'),
('Motorpoint Arena', 'Redfield Way', 'Nottingham'),
('Resorts World Arena', 'Pendigo Way', 'Birmingham'),
('Plymouth Pavilions', 'Millbay Road', 'Plymouth'),
('Brighton Centre', 'Kings Road', 'Brighton');

-- Enable RLS on new tables
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Create policies for universities (public read access)
CREATE POLICY "Universities are publicly readable" 
  ON public.universities 
  FOR SELECT 
  USING (true);

-- Create policies for venues (public read access)
CREATE POLICY "Venues are publicly readable" 
  ON public.venues 
  FOR SELECT 
  USING (true);
