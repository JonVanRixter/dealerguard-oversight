
-- Create onboarding_applications table
CREATE TABLE public.onboarding_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dealer_name TEXT NOT NULL,
  company_number TEXT,
  stage TEXT NOT NULL DEFAULT 'pre-screening',
  status TEXT NOT NULL DEFAULT 'in_progress',
  segmentation JSONB DEFAULT '{}'::jsonb,
  qualification_notes TEXT,
  screening_results JSONB DEFAULT '{}'::jsonb,
  checklist_progress JSONB DEFAULT '{}'::jsonb,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON public.onboarding_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON public.onboarding_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON public.onboarding_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON public.onboarding_applications FOR DELETE
  USING (auth.uid() = user_id);

-- Create dealer_documents table
CREATE TABLE public.dealer_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dealer_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_type TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Other',
  description TEXT,
  expiry_date DATE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dealer_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON public.dealer_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents"
  ON public.dealer_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents"
  ON public.dealer_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents"
  ON public.dealer_documents FOR DELETE USING (auth.uid() = user_id);

-- Create banned_entities table (DND list)
CREATE TABLE public.banned_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  company_name TEXT,
  reason TEXT NOT NULL,
  failed_checks TEXT[] DEFAULT '{}',
  banned_by UUID NOT NULL,
  banned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.banned_entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own banned entities"
  ON public.banned_entities FOR SELECT USING (auth.uid() = banned_by);
CREATE POLICY "Users can insert banned entities"
  ON public.banned_entities FOR INSERT WITH CHECK (auth.uid() = banned_by);
CREATE POLICY "Users can update own banned entities"
  ON public.banned_entities FOR UPDATE USING (auth.uid() = banned_by);
CREATE POLICY "Users can delete own banned entries"
  ON public.banned_entities FOR DELETE USING (auth.uid() = banned_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_onboarding_applications_updated_at
  BEFORE UPDATE ON public.onboarding_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dealer_documents_updated_at
  BEFORE UPDATE ON public.dealer_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for dealer documents
INSERT INTO storage.buckets (id, name, public) VALUES ('dealer-documents', 'dealer-documents', false);

CREATE POLICY "Users can upload dealer documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'dealer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own dealer documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'dealer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own dealer documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'dealer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
