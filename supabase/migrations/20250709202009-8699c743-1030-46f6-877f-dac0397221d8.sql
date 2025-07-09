-- Allow authenticated users to create, update, and delete universities
-- These policies are needed for the admin panel to work

CREATE POLICY "Allow authenticated users to insert universities" 
ON public.universities 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update universities" 
ON public.universities 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to delete universities" 
ON public.universities 
FOR DELETE 
TO authenticated 
USING (true);