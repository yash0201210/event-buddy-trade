
-- Create policies for venues table to allow admin operations
-- Allow authenticated users to insert venues (for admin functionality)
CREATE POLICY "Allow authenticated users to insert venues" 
  ON public.venues 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Allow authenticated users to update venues (for admin functionality)
CREATE POLICY "Allow authenticated users to update venues" 
  ON public.venues 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Allow authenticated users to delete venues (for admin functionality)
CREATE POLICY "Allow authenticated users to delete venues" 
  ON public.venues 
  FOR DELETE 
  TO authenticated 
  USING (true);
