
-- Add image_position column to universities table
ALTER TABLE public.universities 
ADD COLUMN image_position TEXT DEFAULT 'center center';
