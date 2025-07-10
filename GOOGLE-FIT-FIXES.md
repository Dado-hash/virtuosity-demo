# 🔧 Correzioni Google Fit - Distanza e Token

## ✅ Problemi Risolti

### 1. **Import errato di gapi**
- ❌ Prima: `import { gapi } from 'gapi-script';`
- ✅ Ora: Usa `window.gapi` direttamente

### 2. **Scope insufficienti**
- ❌ Prima: Solo `fitness.activity.read`
- ✅ Ora: Aggiunto `fitness.location.read` per accedere ai dati di distanza

### 3. **Formato timestamp errato**
- ❌ Prima: Usava ISO string invece di nanoseconds
- ✅ Ora: Usa correttamente nanoseconds (`timestamp * 1000000`)

### 4. **Recupero distanza migliorato**
- ✅ **Metodo 1**: Usa data source ID specifico per distanza più accurata
- ✅ **Metodo 2**: Fallback senza data source ID
- ✅ **Metodo 3**: Stima dalla durata se nessun dato di distanza
- ✅ **Logging dettagliato** per debug

### 5. **Calcolo token migliorato**
- ✅ **Token minimi garantiti**: Almeno 1 token per attività valide
- ✅ **Calcolo basato su durata**: Se manca la distanza
- ✅ **Supporto running**: Aggiunto tipo corsa

### 6. **Stato verifica corretto**
- ❌ Prima: `verified: true` (attività subito approvate)
- ✅ Ora: `verified: false` (attività pending per revisione)

### 7. **📊 Tipo 'running' supportato**
- ❌ Prima: 'running' non supportato nel database
- ✅ Ora: Aggiunto supporto completo (richiede aggiornamento DB)
- ✅ **Fallback temporaneo**: 'running' → 'walking' per compatibilità

## 🛠️ **IMPORTANTE: Aggiornamento Database Richiesto**

**Devi eseguire questo SQL nel tuo Supabase SQL Editor:**
```sql
-- Vedi file: google-fit-database-update.sql
ALTER TABLE public.activities 
DROP CONSTRAINT IF EXISTS activities_type_check;

ALTER TABLE public.activities 
ADD CONSTRAINT activities_type_check 
CHECK (type IN ('walking', 'cycling', 'running', 'public_transport', 'waste_recycling', 'other'));
```

**Finché non aggiorni il DB**, le attività 'running' verranno salvate come 'walking'.

## 🎯 Cosa aspettarsi ora

### ✅ **Distanze accurate**:
- Recupero diretto dai sensori Google Fit
- Stima intelligente quando i dati mancano
- Logging per debugging

### ✅ **Token corretti**:
- **Walking**: 2 token/km (min 1 token)
- **Cycling**: 3 token/km (min 1 token)  
- **Running**: 2.5 token/km (min 1 token)
- **Fallback**: Token basati su durata

### ✅ **Flusso corretto**:
- Attività sincronizzate come **non verificate**
- Revisione manuale necessaria per approvazione
- CO₂ calcolato accuratamente

## 🧪 Test consigliati

### 🏗️ **Passo 1: Aggiorna il Database**
1. Apri Supabase SQL Editor
2. Esegui il contenuto di `google-fit-database-update.sql`
3. Verifica che non ci siano errori

### 🔄 **Passo 2: Test dell'App**
1. **Reconnetti Google Fit** per ottenere i nuovi permessi
2. **Sincronizza attività** e controlla la console per log dettagliati
3. **Verifica distanze** nelle attività sincronizzate
4. **Controlla token** che ora dovrebbero essere > 0
5. **Stato pending** delle nuove attività

## 🔍 Debug

Apri la Console del browser per vedere log dettagliati come:
- `📊 Found X sessions from Google Fit`
- `🏃 Mapping activity type X to Y`
- `✅ Distance found: X km`
- `💰 Calculated rewards: {...}`
- `✅ Activity saved to database`

## 📝 Note tecniche

- Le attività senza distanza ora hanno stime basate su velocità medie
- Il sistema è più robusto con fallback multipli
- Logging esteso per facilitare il debugging
- Supporto completo per walking, cycling, running

Se persistono problemi, controlla:
1. Permessi Google Fit (deve includere location.read)
2. Console browser per errori specifici
3. Che l'app Google Fit abbia dati di distanza registrati
