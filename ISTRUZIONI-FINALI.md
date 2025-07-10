# 🚀 ISTRUZIONI FINALI - Completamento Setup

## ⚠️ Passi Obbligatori per Completare

### 1. 🗄️ **Aggiorna Database Supabase**
```sql
-- Vai su Supabase > SQL Editor e esegui:

-- Add 'running' type support
ALTER TABLE public.activities 
DROP CONSTRAINT IF EXISTS activities_type_check;

ALTER TABLE public.activities 
ADD CONSTRAINT activities_type_check 
CHECK (type IN ('walking', 'cycling', 'running', 'public_transport', 'waste_recycling', 'other'));

-- Add Google Fit columns
ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS google_fit_session_id TEXT;

ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS sync_timestamp TIMESTAMP WITH TIME ZONE;

-- Add index for session IDs
CREATE INDEX IF NOT EXISTS idx_activities_google_fit_session_id 
ON public.activities(google_fit_session_id) 
WHERE google_fit_session_id IS NOT NULL;

-- Add Google Fit sync timestamp to users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_google_fit_sync TIMESTAMP WITH TIME ZONE;
```

### 2. 🔄 **Reinstalla Dipendenze**
```bash
# Rimuovi node_modules e cache per pulire gapi-script
rm -rf node_modules
rm -rf .vite

# Reinstalla con package.json aggiornato
npm install
# oppure
bun install
```

### 3. 🔧 **Testa Funzionalità**
```bash
# Avvia app
npm run dev

# Nel browser:
# 1. Vai a Google Fit section
# 2. Disconnetti e riconnetti Google Fit (per nuovi permessi)
# 3. Sincronizza attività
# 4. Apri Console del browser e verifica log
# 5. Controlla che distanze e token siano > 0
```

### 4. 🔍 **Cosa Verificare**

#### ✅ Console Browser deve mostrare:
- `📊 Found X sessions from Google Fit`
- `✅ Distance found: X.XX km` (o stima)
- `💰 Calculated rewards: {distance, co2Saved, tokensEarned}`
- `✅ Activity saved to database`

#### ✅ App deve mostrare:
- Distanze diverse da 0 km
- Token earned > 0
- Attività con badge "Google Fit" e stato "non verificata"

#### ❌ Errori da NON vedere:
- `access_denied` o "deprecated libraries"
- `OAuth2 token client not initialized`
- Database constraint errors
- Sempre 0 km di distanza

## 🚨 Se hai problemi

### **Distanza sempre 0:**
1. Verifica che Google Fit abbia dati di localizzazione
2. Controlla permessi app Google Fit sul telefono
3. Sincronizza manualmente Google Fit app

### **Token sempre 0:**
1. Controlla console per errori di calcolo
2. Verifica che calculateRewardsFromActivity funzioni

### **Errori database:**
1. Assicurati di aver eseguito tutto l'SQL update
2. Verifica che non ci siano errori in Supabase

### **OAuth errors:**
1. Verifica credenziali in `.env`
2. Controlla Google Cloud Console settings

## ✅ Quando tutto funziona

Le attività da Google Fit dovrebbero essere:
- 📍 **Con distanza** accurata o stimata
- 🪙 **Con token** > 0 calcolati correttamente
- ⏳ **Non verificate** (pending per approvazione)
- 🏷️ **Con badge** "Google Fit"
- 📊 **Con CO₂** calcolato

**Il sistema è ora completamente aggiornato e funzionale! 🎉**
