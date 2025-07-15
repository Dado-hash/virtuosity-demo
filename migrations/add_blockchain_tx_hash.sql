-- Migrazione per aggiungere la colonna blockchain_tx_hash alla tabella activities
ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS blockchain_tx_hash text;