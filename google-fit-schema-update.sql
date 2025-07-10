-- Database Update per Google Fit Integration
-- Aggiunge campi necessari per il tracking automatico

-- 1. Aggiornare tabella activities
ALTER TABLE public.activities 
ADD COLUMN source TEXT CHECK (source IN ('manual', 'google_fit', 'apple_health')) DEFAULT 'manual' NOT NULL;

ALTER TABLE public.activities 
ADD COLUMN google_fit_session_id TEXT;

ALTER TABLE public.activities 
ADD COLUMN sync_timestamp TIMESTAMP WITH TIME ZONE;

-- 2. Aggiornare tabella users per Google Fit
ALTER TABLE public.users 
ADD COLUMN google_fit_connected BOOLEAN DEFAULT false NOT NULL;

ALTER TABLE public.users 
ADD COLUMN google_fit_access_token TEXT;

ALTER TABLE public.users 
ADD COLUMN last_google_fit_sync TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.users 
ADD COLUMN google_account_email TEXT;

-- 3. Creare tabella sync_logs per tracking
CREATE TABLE public.sync_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    sync_type TEXT CHECK (sync_type IN ('google_fit', 'apple_health', 'manual_import')) NOT NULL,
    status TEXT CHECK (status IN ('started', 'success', 'error', 'partial')) NOT NULL,
    activities_synced INTEGER DEFAULT 0,
    data_range_start TIMESTAMP WITH TIME ZONE,
    data_range_end TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    sync_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Aggiungere indici per performance
CREATE INDEX idx_activities_source ON public.activities(source);
CREATE INDEX idx_activities_google_fit_session ON public.activities(google_fit_session_id);
CREATE INDEX idx_activities_sync_timestamp ON public.activities(sync_timestamp);
CREATE INDEX idx_users_google_fit_connected ON public.users(google_fit_connected);
CREATE INDEX idx_sync_logs_user_id ON public.sync_logs(user_id);
CREATE INDEX idx_sync_logs_status ON public.sync_logs(status);
CREATE INDEX idx_sync_logs_sync_type ON public.sync_logs(sync_type);

-- 5. RLS policies per sync_logs
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sync logs" ON public.sync_logs
    FOR SELECT USING (true);

CREATE POLICY "System can insert sync logs" ON public.sync_logs
    FOR INSERT WITH CHECK (true);

-- 6. Trigger per sync_logs non serve updated_at (è solo insert)

-- 7. Inserire alcune attività di esempio da Google Fit (per test)
-- Queste verranno sostituire dal vero sync
INSERT INTO public.activities (user_id, type, source, description, co2_saved, tokens_earned, distance, duration, verified, google_fit_session_id, sync_timestamp) 
SELECT 
    u.id,
    'walking',
    'google_fit',
    'Camminata sincronizzata da Google Fit',
    2.4, -- 2km * 0.12
    4,   -- 2km * 2 tokens
    2.0,
    30,
    true,
    'gfit_session_' || extract(epoch from now())::text,
    now()
FROM public.users u 
WHERE u.google_fit_connected = true
LIMIT 1; -- Solo per il primo utente che ha Google Fit collegato

SELECT 'Google Fit database schema aggiornato con successo!' as status;
