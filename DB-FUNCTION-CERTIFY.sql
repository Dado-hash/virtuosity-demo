-- 🚀 SOLUZIONE ALTERNATIVA: Funzione Database per Certificazione
-- Esegui questo SQL in Supabase > SQL Editor

-- 1. Crea funzione per certificare attività (bypassa RLS)
CREATE OR REPLACE FUNCTION certify_user_activity(
    activity_id_param UUID,
    user_id_param UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Questo esegue con privilegi dell'owner
AS $$
DECLARE
    activity_record RECORD;
    result JSON;
BEGIN
    -- Verifica che l'attività appartenga all'utente
    SELECT * INTO activity_record
    FROM activities 
    WHERE id = activity_id_param 
    AND user_id = user_id_param
    AND verified = false; -- Solo attività non ancora verificate
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Activity not found or already verified or not owned by user'
        );
    END IF;
    
    -- Aggiorna l'attività
    UPDATE activities 
    SET 
        verified = true,
        updated_at = NOW()
    WHERE id = activity_id_param;
    
    -- Aggiorna i token dell'utente
    UPDATE users 
    SET 
        tokens_pending = GREATEST(0, tokens_pending - activity_record.tokens_earned),
        tokens_minted = tokens_minted + activity_record.tokens_earned,
        updated_at = NOW()
    WHERE id = user_id_param;
    
    -- Restituisci il risultato
    RETURN json_build_object(
        'success', true,
        'activity_id', activity_id_param,
        'tokens_converted', activity_record.tokens_earned,
        'message', 'Activity certified successfully'
    );
    
EXCEPTION 
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 2. Concedi permessi di esecuzione
GRANT EXECUTE ON FUNCTION certify_user_activity(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION certify_user_activity(UUID, UUID) TO anon;

-- 3. Test della funzione con i tuoi dati
SELECT certify_user_activity(
    'd69cf470-710e-47f7-919c-31277b44e363'::UUID,
    '24c804a2-694f-4f43-9016-934fef8d4ec'::UUID
);

-- 4. Se il test funziona, esegui questo per verificare il risultato
SELECT 
    id, 
    verified, 
    tokens_earned,
    updated_at
FROM activities 
WHERE id = 'd69cf470-710e-47f7-919c-31277b44e363';

SELECT 
    tokens_pending, 
    tokens_minted,
    updated_at
FROM users 
WHERE id = '24c804a2-694f-4f43-9016-934fef8d4ec';
