-- Google Fit Database Update - Add Running Activity Type
-- Execute this SQL in your Supabase SQL Editor

-- Add 'running' to the type constraint in activities table
ALTER TABLE public.activities 
DROP CONSTRAINT IF EXISTS activities_type_check;

ALTER TABLE public.activities 
ADD CONSTRAINT activities_type_check 
CHECK (type IN ('walking', 'cycling', 'running', 'public_transport', 'waste_recycling', 'other'));

-- Also add Google Fit specific columns if not already present
ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS google_fit_session_id TEXT;

ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS sync_timestamp TIMESTAMP WITH TIME ZONE;

-- Add index for Google Fit session IDs to prevent duplicates
CREATE INDEX IF NOT EXISTS idx_activities_google_fit_session_id 
ON public.activities(google_fit_session_id) 
WHERE google_fit_session_id IS NOT NULL;

-- Update users table to include Google Fit sync timestamp
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_google_fit_sync TIMESTAMP WITH TIME ZONE;

-- Add composite index for user activities with source
CREATE INDEX IF NOT EXISTS idx_activities_user_source 
ON public.activities(user_id, source, created_at DESC);

COMMENT ON COLUMN public.activities.source IS 'Source of the activity: manual, google_fit, strava, etc.';
COMMENT ON COLUMN public.activities.google_fit_session_id IS 'Google Fit session ID for tracking sync';
COMMENT ON COLUMN public.activities.sync_timestamp IS 'When this activity was synced from external source';
COMMENT ON COLUMN public.users.last_google_fit_sync IS 'Last time Google Fit data was synced';
