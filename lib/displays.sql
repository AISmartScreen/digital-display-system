-- Drop the existing table and all its dependencies
DROP TABLE IF EXISTS public.displays CASCADE;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Recreate the function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create displays table with TEXT ID (not UUID)
CREATE TABLE public.displays (
  id text PRIMARY KEY,
  name text NOT NULL,
  template_type text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.displays ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Anyone can do anything"
  ON public.displays
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.displays
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert test display with ID '1'
INSERT INTO public.displays (id, name, template_type, config)
VALUES (
  '1',
  'Test Masjid Display',
  'masjid',
  '{
    "template": "masjid-classic",
    "colors": {
      "primary": "#1e40af",
      "secondary": "#7c3aed",
      "text": "#ffffff",
      "accent": "#f59e0b"
    },
    "masjidName": "Masjid Al-Noor"
  }'::jsonb
);