
-- Create a table for event requests
CREATE TABLE public.event_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_name TEXT NOT NULL,
  event_hyperlink TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.event_requests ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own event requests
CREATE POLICY "Users can view their own event requests" 
  ON public.event_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to create their own event requests
CREATE POLICY "Users can create their own event requests" 
  ON public.event_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own event requests
CREATE POLICY "Users can update their own event requests" 
  ON public.event_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);
