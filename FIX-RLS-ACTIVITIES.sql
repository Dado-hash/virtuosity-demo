-- ⚡ FIX RAPIDO: RLS Policies per Activities
-- Esegui questo SQL in Supabase > SQL Editor

-- 1. Controlla policies esistenti
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'activities';

-- 2. Drop e ricrea policies per activities
DROP POLICY IF EXISTS "Users can view own activities" ON activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON activities;
DROP POLICY IF EXISTS "Users can update own activities" ON activities;
DROP POLICY IF EXISTS "Users can delete own activities" ON activities;

-- 3. Crea policies corrette
CREATE POLICY "Users can view own activities" ON activities
    FOR SELECT USING (auth.uid()::text = (
        SELECT privy_id FROM users WHERE users.id = activities.user_id
    ));

CREATE POLICY "Users can insert own activities" ON activities
    FOR INSERT WITH CHECK (auth.uid()::text = (
        SELECT privy_id FROM users WHERE users.id = activities.user_id
    ));

CREATE POLICY "Users can update own activities" ON activities
    FOR UPDATE USING (auth.uid()::text = (
        SELECT privy_id FROM users WHERE users.id = activities.user_id
    )) WITH CHECK (auth.uid()::text = (
        SELECT privy_id FROM users WHERE users.id = activities.user_id
    ));

CREATE POLICY "Users can delete own activities" ON activities
    FOR DELETE USING (auth.uid()::text = (
        SELECT privy_id FROM users WHERE users.id = activities.user_id
    ));

-- 4. Verifica che RLS sia abilitato
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 5. Test rapido: disabilita temporaneamente RLS per test
-- ATTENZIONE: Solo per debugging, riabilita dopo!
-- ALTER TABLE activities DISABLE ROW LEVEL SECURITY;

-- 6. Verifica l'attività specifica che stavi tentando di certificare
SELECT 
    id, 
    user_id, 
    type, 
    description, 
    verified, 
    tokens_earned,
    created_at,
    updated_at
FROM activities 
WHERE id = 'd69cf470-710e-47f7-919c-31277b44e363';

-- 7. Verifica l'utente
SELECT 
    id, 
    privy_id, 
    tokens_pending, 
    tokens_minted,
    name
FROM users 
WHERE id = '24c804a2-694f-4f43-9016-934fef8d4ec';

-- 8. Test UPDATE manuale
UPDATE activities 
SET 
    verified = true, 
    updated_at = NOW()
WHERE 
    id = 'd69cf470-710e-47f7-919c-31277b44e363' 
    AND user_id = '24c804a2-694f-4f43-9016-934fef8d4ec';

-- Mostra quante righe sono state aggiornate
SELECT 'Righe aggiornate: ' || ROW_COUNT();
