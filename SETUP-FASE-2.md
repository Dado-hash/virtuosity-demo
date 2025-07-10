# 🏃‍♂️ Virtuosity - Setup Fase 2: Google Fit Integration

## ✅ Completato - Integrazione Codice

Ho completato l'integrazione Google Fit nel tuo progetto Virtuosity! Ecco cosa è stato implementato:

### 📁 File Aggiunti/Modificati:
- ✅ `package.json` - Aggiunto `gapi-script` per Google API
- ✅ `src/lib/supabase.ts` - Nuovi tipi per Google Fit
- ✅ `src/providers/GoogleFitProvider.tsx` - Provider completo Google Fit
- ✅ `src/components/GoogleFitConnect.tsx` - UI per connessione e sync
- ✅ `src/hooks/useSupabaseData.ts` - Support per activity source
- ✅ `src/components/SupabaseTest.tsx` - Tabs per testing completo
- ✅ `google-fit-schema-update.sql` - Update database schema
- ✅ `.env` - Nuove variabili Google Fit

## 🔧 Setup Google Cloud Console

### 1. Crea Progetto Google Cloud
1. Vai su [Google Cloud Console](https://console.cloud.google.com)
2. Crea nuovo progetto o seleziona esistente
3. Abilita la **Google Fitness API**

### 2. Configura OAuth 2.0
1. Vai su **API & Services → Credentials**
2. Clicca **Create Credentials → OAuth client ID**
3. Tipo applicazione: **Web application**
4. Authorized JavaScript origins: `http://localhost:5173`
5. Salva **Client ID** (client secret: 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)

### 3. Crea API Key
1. In **Credentials**, clicca **Create Credentials → API Key**
2. (Opzionale) Restringi la chiave alla Fitness API
3. Salva **API Key** (AIzaSyAsGRMdRfBZMX3GFfX5fli118-sdtscoEE)

## 🗄️ Setup Database

### 1. Esegui Update Schema
Esegui `google-fit-schema-update.sql` nel SQL Editor di Supabase:

```sql
-- Aggiunge campi Google Fit alle tabelle esistenti
ALTER TABLE public.activities 
ADD COLUMN source TEXT CHECK (source IN ('manual', 'google_fit', 'apple_health')) DEFAULT 'manual' NOT NULL;

ALTER TABLE public.users 
ADD COLUMN google_fit_connected BOOLEAN DEFAULT false NOT NULL;
-- ... (resto dello schema)
```

### 2. Verifica Tabelle
Controlla che siano state aggiunte:
- ✅ `activities.source` - Fonte dell'attività  
- ✅ `activities.google_fit_session_id` - ID sessione Google Fit
- ✅ `users.google_fit_connected` - Stato connessione
- ✅ `sync_logs` - Storico sincronizzazioni

## ⚙️ Configurazione Ambiente

### 1. Aggiorna `.env`
```env
# Google Fit API (for Phase 2)
VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here
VITE_GOOGLE_API_KEY=your-actual-api-key-here
```

### 2. Installa Dipendenze
```bash
npm install
# oppure
bun install
```

## 🧪 Test Google Fit Integration

### 1. Avvia App
```bash
npm run dev
```

### 2. Vai su Test Page
Visita: `http://localhost:5173/supabase-test`

### 3. Test Flow Completo
1. **Login con Privy** (tab qualsiasi)
2. **Vai su tab "Google Fit"**
3. **Clicca "Connetti Google Fit"**
4. **Autorizza l'accesso** (popup Google)
5. **Clicca "Sincronizza"** per importare attività

## 🎯 Funzionalità Implementate

### **🔄 Sistema Ibrido**
- **Automatico**: Google Fit sincronizza passi, corsa, ciclismo
- **Manuale**: Input per trasporto pubblico, riciclo, altre attività
- **Unified Dashboard**: Visualizzazione combinata con distinzione source

### **📊 Tracking Automatico**
- **Camminate e Corse**: Distanza e durata precise
- **Ciclismo**: Tracciamento sessioni bike
- **Calcoli Real-time**: CO₂ e token automatici
- **Evita Duplicati**: Controllo session ID Google Fit

### **💾 Database Robusto**
- **Source Tracking**: Distingue manual vs google_fit
- **Sync Logs**: Storico completo sincronizzazioni
- **Conflict Resolution**: Gestione intelligente duplicati
- **Backwards Compatible**: Funziona con dati esistenti

## 🔍 Architettura Google Fit

### **Flow di Sincronizzazione:**
```mermaid
graph LR
    A[Google Fit] --> B[API Request]
    B --> C[Process Sessions]
    C --> D[Calculate CO₂ & Tokens]
    D --> E[Save to Database]
    E --> F[Update User Stats]
```

### **Mapping Attività:**
- **Walking (7)** → `walking` (2 token/km)
- **Cycling (1)** → `cycling` (3 token/km)  
- **Running (8)** → `walking` (2 token/km)
- **Altri tipi** → Ignorati per ora

## 📋 Risoluzione Problemi

### **Errore OAuth**
- Verifica `VITE_GOOGLE_CLIENT_ID` corretto
- Controlla authorized origins in Google Console
- Prova in incognito per cache pulita

### **API Non Funziona**
- Verifica che Fitness API sia abilitata
- Controlla `VITE_GOOGLE_API_KEY` valida
- Guarda console browser per errori dettagliati

### **Nessuna Attività**
- Google Fit deve avere dati reali nel periodo
- Prova ad allungare range sincronizzazione (14-30 giorni)
- Controlla permessi app Google Fit sul telefono

### **Duplicati**
- Il sistema usa `google_fit_session_id` per evitare duplicati
- Se vedi duplicati, segnala il session ID problematico

## 🎨 Personalizzazioni

### **Aggiungere Nuovi Tipi Attività:**
1. Update `mapGoogleFitActivityType()` in `GoogleFitProvider.tsx`
2. Aggiungi mapping in `activityTypes` in `useSupabaseData.ts`
3. Update calcoli CO₂ se necessario

### **Modificare Calcoli Reward:**
```typescript
// In GoogleFitProvider.tsx
const calculateRewardsFromActivity = (activity: GoogleFitActivity) => {
  // Modifica qui i calcoli di CO₂ e token
  if (activity.type === 'walking') {
    co2Saved = distance * 0.15; // Aumenta CO₂ saving
    tokensEarned = Math.floor(distance * 3); // Aumenta token reward
  }
}
```

## 🚀 Stato Fase 2: COMPLETATA ✅

### ✨ **Nuove Funzionalità Aggiunte:**
- ✅ **Google Fit Integration**: Connessione e sync automatico
- ✅ **Activity Source Tracking**: Manual vs automatic
- ✅ **Unified Dashboard**: Visualizzazione combinata
- ✅ **Real-time Sync**: Importazione dati fitness
- ✅ **Robust Database**: Schema esteso per tracking

### 🔄 **Flow Aggiornato:**
1. **Connetti Google Fit** → Autorizza accesso fitness data
2. **Sync Automatico** → Importa attività recenti  
3. **Calcoli Real-time** → CO₂ e token automatici
4. **Dashboard Unificato** → Vedi tutto in un posto
5. **Input Manuale** → Per attività non trackate

**Pronto per Fase 3: Smart Contracts Deployment**

### Prossimi obiettivi:
- [ ] Deploy VirtuosityToken.sol (ERC-20) su Polygon
- [ ] Deploy VirtuosityCertificates.sol per NFT certificati  
- [ ] Integrazione con Privy wallet per transazioni gasless
- [ ] Testing distribuzione automatica token

Vuoi procedere con la Fase 3?
