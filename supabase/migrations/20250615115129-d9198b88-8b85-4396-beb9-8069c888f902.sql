
-- Add PDF upload functionality to tickets table (if columns don't exist)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'pdf_url') THEN
        ALTER TABLE public.tickets ADD COLUMN pdf_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'qr_code_hash') THEN
        ALTER TABLE public.tickets ADD COLUMN qr_code_hash TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'verification_status') THEN
        ALTER TABLE public.tickets ADD COLUMN verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'verification_notes') THEN
        ALTER TABLE public.tickets ADD COLUMN verification_notes TEXT;
    END IF;
END $$;

-- Create unique index on qr_code_hash to prevent duplicates (if doesn't exist)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tickets_qr_code_hash') THEN
        CREATE UNIQUE INDEX idx_tickets_qr_code_hash ON public.tickets(qr_code_hash) WHERE qr_code_hash IS NOT NULL;
    END IF;
END $$;

-- Add admin columns to event_requests table for approval workflow (if columns don't exist)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_requests' AND column_name = 'reviewed_by') THEN
        ALTER TABLE public.event_requests ADD COLUMN reviewed_by UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_requests' AND column_name = 'reviewed_at') THEN
        ALTER TABLE public.event_requests ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_requests' AND column_name = 'rejection_reason') THEN
        ALTER TABLE public.event_requests ADD COLUMN rejection_reason TEXT;
    END IF;
END $$;

-- Create storage bucket for PDF uploads (if doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
SELECT 'ticket-pdfs', 'ticket-pdfs', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'ticket-pdfs');

-- Create storage policies for ticket PDFs (drop and recreate to ensure they exist)
DROP POLICY IF EXISTS "Users can upload their own ticket PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own ticket PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all ticket PDFs" ON storage.objects;

CREATE POLICY "Users can upload their own ticket PDFs" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'ticket-pdfs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own ticket PDFs" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'ticket-pdfs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all ticket PDFs" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'ticket-pdfs');
