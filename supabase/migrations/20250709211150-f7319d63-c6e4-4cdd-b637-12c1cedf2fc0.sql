-- Temporarily make notifications readable by any authenticated user for debugging
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

CREATE POLICY "Authenticated users can view notifications" 
ON public.notifications 
FOR SELECT 
TO authenticated
USING (true);

-- Also add an INSERT policy for testing
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated users can insert notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (true);