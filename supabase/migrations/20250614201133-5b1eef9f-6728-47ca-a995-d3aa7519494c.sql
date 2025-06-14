
-- Create a table to store user university pins
CREATE TABLE public.user_university_pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, university_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_university_pins ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own pins
CREATE POLICY "Users can view their own pins" 
  ON public.user_university_pins 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to create their own pins
CREATE POLICY "Users can create their own pins" 
  ON public.user_university_pins 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to delete their own pins
CREATE POLICY "Users can delete their own pins" 
  ON public.user_university_pins 
  FOR DELETE 
  USING (auth.uid() = user_id);
