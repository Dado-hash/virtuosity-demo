# Migrazione Google OAuth2 - Documentazione

## Cosa è stato fatto

Abbiamo migrato l'autenticazione Google da `gapi.auth2` (deprecato) al nuovo sistema Google Identity Services (OAuth2). Ecco i cambiamenti principali:

### File modificati:

1. **`src/providers/GoogleFitProvider.tsx`**:
   - ✅ Rimosso `gapi.auth2.getAuthInstance()`
   - ✅ Implementato `window.google.accounts.oauth2.initTokenClient()`
   - ✅ Aggiornato `connectGoogleFit()` per usare il nuovo sistema OAuth2
   - ✅ Aggiornato `disconnectGoogleFit()` per revocare token con il nuovo sistema
   - ✅ Migliorato `syncActivities()` per impostare correttamente il token

2. **`package.json`**:
   - ✅ Rimossa dipendenza `gapi-script` (ora carica gapi manualmente)

3. **`src/types/google-identity.d.ts`** (nuovo):
   - ✅ Definizioni TypeScript per Google Identity Services
   - ✅ Tipi per OAuth2 e GAPI client

## Come testare la migrazione

### 1. Installare le dipendenze
```bash
npm install
# oppure
bun install
```

### 2. Verificare le variabili d'ambiente
Assicurati che nel file `.env` siano presenti:
```env
VITE_GOOGLE_CLIENT_ID=155287664742-q3hue50vrb0ap5sunihs9m9nsl37103j.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyAbXHNL7WUOl3cX7C4UwR0OVGBoeo4znGE
```

### 3. Avviare l'applicazione
```bash
npm run dev
# oppure
bun dev
```

### 4. Test dell'autenticazione
1. Naviga alla sezione Google Fit dell'app
2. Clicca su "Connetti Google Fit"
3. Dovrebbe aprirsi il popup di consenso Google
4. Dopo aver autorizzato, l'app dovrebbe mostrare lo stato "connesso"

### 5. Test della sincronizzazione
1. Con Google Fit connesso, prova a sincronizzare le attività
2. Verifica che non ci siano errori nella console del browser
3. Controlla che le attività vengano recuperate correttamente

## Cosa aspettarsi

### ✅ Funzionalità che dovrebbero funzionare:
- Connessione a Google Fit con il nuovo sistema OAuth2
- Sincronizzazione delle attività fitness
- Disconnessione e revoca dei token
- Nessun errore "deprecated libraries" nel browser

### 🔍 Log di debug da controllare:
Apri la console del browser e cerca questi messaggi:
- `🔧 Initializing Google APIs with new GIS library...`
- `✅ OAuth2 token client initialized`
- `🔗 Attempting to connect Google Fit using new OAuth2...`
- `✅ Access token received and stored`

## Differenze principali

### Prima (deprecato):
```javascript
const authInstance = gapi.auth2.getAuthInstance();
const user = await authInstance.signIn();
```

### Dopo (nuovo sistema):
```javascript
const tokenClient = window.google.accounts.oauth2.initTokenClient({
  client_id: GOOGLE_CLIENT_ID,
  scope: SCOPES,
  callback: (response) => {
    // Gestisce il token di accesso
  }
});
tokenClient.requestAccessToken();
```

## Risoluzione problemi comuni

### Errore: "OAuth2 token client not initialized"
- Verificare che le credenziali Google siano configurate correttamente
- Controllare che la console Google Cloud abbia il dominio autorizzato

### Errore: "Failed to load Google Identity Services"
- Verificare la connessione internet
- Controllare che non ci siano ad-blocker che bloccano i script Google

### Token non ricevuto
- Verificare gli scope nel Google Cloud Console
- Assicurarsi che l'API Google Fitness sia abilitata

## Prossimi passi

La migrazione è completa, ma puoi considerare:
1. Aggiungere gestione degli errori più granulare
2. Implementare refresh automatico del token
3. Aggiungere logging più dettagliato per il debugging
4. Test automatizzati per l'autenticazione

## Risorse utili

- [Google Identity Services Migration Guide](https://developers.google.com/identity/gsi/web/guides/gis-migration)
- [OAuth2 TokenClient Reference](https://developers.google.com/identity/oauth2/web/reference/js-reference#TokenClient)
- [Google Fitness API](https://developers.google.com/fit/rest)
