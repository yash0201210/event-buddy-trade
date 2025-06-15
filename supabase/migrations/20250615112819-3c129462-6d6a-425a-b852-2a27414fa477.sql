
-- Create a table to store user favourite events
CREATE TABLE public.user_event_favourites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_event_favourites ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own favourites
CREATE POLICY "Users can view their own favourites" 
  ON public.user_event_favourites 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to create their own favourites
CREATE POLICY "Users can create their own favourites" 
  ON public.user_event_favourites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to delete their own favourites
CREATE POLICY "Users can delete their own favourites" 
  ON public.user_event_favourites 
  FOR DELETE 
  USING (auth.uid() = user_id);
