# 🚀 Virtuosity Smart Contracts - Deployment Guide

## 📋 Panoramica

Questo progetto contiene gli smart contract per Virtuosity, che permette di:
- **Certificare attività sostenibili** on-chain
- **Distribuire token VRT** agli utenti per le attività certificate
- **Acquistare premi** usando i token guadagnati

## 🏗️ Architettura Smart Contracts

### 1. **VirtuosityToken (VRT)** - Token ERC20
- Token principale del sistema
- Viene mintato quando le attività vengono certificate
- Usato per acquistare premi nel marketplace

### 2. **ActivityCertification** - Certificazione Attività
- Certifica le attività sostenibili on-chain
- Calcola e distribuisce token VRT in base alla CO2 risparmiata
- Mantiene un registro di tutte le attività certificate

### 3. **RewardsMarketplace** - Marketplace Premi
- Gestisce l'acquisto di premi con token VRT
- Include premi preconfigurati (piante, buoni Amazon, biglietti cinema, etc.)
- Genera codici di riscatto univoci

## 🛠️ Setup e Deploy

### Prerequisiti
- Node.js v18+
- Un wallet con POL (Polygon tokens) per Amoy testnet
- Account su [Polygon Faucet](https://faucet.polygon.technology/) per ottenere POL testnet

### 1. Installa le dipendenze

```bash
cd smart-contracts
npm install
```

### 2. Configura l'ambiente

```bash
# Copia il file .env di esempio
cp .env.example .env

# Modifica .env con i tuoi dati:
# - PRIVATE_KEY: la chiave privata del tuo wallet (senza 0x)
# - POLYGON_AMOY_RPC_URL: puoi usare quello di default o uno custom
# - POLYGONSCAN_API_KEY: opzionale per la verifica dei contratti
```

### 3. Ottieni POL testnet

1. Vai su [Polygon Faucet](https://faucet.polygon.technology/)
2. Connetti il tuo wallet
3. Seleziona "Amoy Testnet"
4. Richiedi POL tokens (ne servono circa 0.05 POL per il deploy)

### 4. Deploy dei contratti

```bash
# Compila i contratti
npm run compile

# Deploy su Polygon Amoy
npm run deploy

# Se tutto va bene, vedrai output simile a:
# ✅ VirtuosityToken deployed to: 0x...
# ✅ ActivityCertification deployed to: 0x...
# ✅ RewardsMarketplace deployed to: 0x...
```

### 5. Verifica i contratti (opzionale)

```bash
# Verifica su PolygonScan (se hai l'API key)
npx hardhat verify --network polygonAmoy [INDIRIZZO_CONTRATTO]
```

## 🔧 Integrazione nell'App

### 1. Aggiungi le variabili d'ambiente

Dopo il deploy, aggiungi nel `.env` della tua app React:

```bash
VITE_VIRTUOSITY_TOKEN_ADDRESS=0x...
VITE_ACTIVITY_CERTIFICATION_ADDRESS=0x...  
VITE_REWARDS_MARKETPLACE_ADDRESS=0x...
```

### 2. Installa ethers e wagmi (se non già presenti)

```bash
npm install ethers@6 wagmi viem@2
```

### 3. Importa gli ABI

Dopo la compilazione, trova gli ABI in:
- `artifacts/contracts/VirtuosityToken.sol/VirtuosityToken.json`
- `artifacts/contracts/ActivityCertification.sol/ActivityCertification.json`
- `artifacts/contracts/RewardsMarketplace.sol/RewardsMarketplace.json`

Copia la sezione `"abi"` di ciascun file per usarla nell'app.

## 🎯 Funzionalità Principali

### Certificare un'attività
```javascript
const activityContract = useContract({
  address: ACTIVITY_CERTIFICATION_ADDRESS,
  abi: ActivityCertificationABI,
});

// Certifica attività (solo owner del contratto)
await activityContract.certifyActivity(
  "activity-id-123",
  userAddress,
  500, // CO2 saved in grams
  "walking",
  "Camminata di 30 minuti"
);
```

### Comprare un premio
```javascript
const tokenContract = useContract({
  address: VIRTUOSITY_TOKEN_ADDRESS,
  abi: VirtuosityTokenABI,
});

const marketplaceContract = useContract({
  address: REWARDS_MARKETPLACE_ADDRESS,
  abi: RewardsMarketplaceABI,
});

// 1. Approva il marketplace a spendere token
await tokenContract.approve(REWARDS_MARKETPLACE_ADDRESS, tokenAmount);

// 2. Acquista il premio
await marketplaceContract.purchaseReward(rewardId);
```

### Controllare il balance
```javascript
const balance = await tokenContract.balanceOf(userAddress);
console.log("Balance:", ethers.formatEther(balance), "VRT");
```

## 🔍 Indirizzi Testnet

Dopo il deploy, i tuoi contratti saranno visibili su:
- [Amoy PolygonScan](https://amoy.polygonscan.com/)

## 🆘 Risoluzione Problemi

### "Insufficient funds"
- Verifica di avere abbastanza POL nel wallet
- Richiedi più POL dal faucet

### "Nonce too high"
- Resetta l'account nel wallet (Settings > Advanced > Reset Account)

### Contratto non verificato
- Aggiungi POLYGONSCAN_API_KEY nel .env
- Riprova la verifica con `npx hardhat verify`

## 🧪 Test

```bash
# Esegui i test
npm test

# I test coprono:
# - Mint e burn di token VRT
# - Certificazione di attività
# - Acquisto di premi
# - Journey completo utente
```

## 📞 Prossimi Passi

1. **Deploy completato** ✅
2. **Integra nell'app React** - Modifica il SupabaseProvider per chiamare i contratti
3. **Test con attività reali** - Certifica alcune attività e verifica che i token arrivino
4. **Test marketplace** - Prova ad acquistare premi con i token
5. **Frontend miglioramenti** - Mostra transazioni in pending, success, etc.

## 💡 Formula Token

- **1 token VRT = 1000g di CO2 risparmiata**
- **Minimo 1 token** per incentivare anche piccole attività
- **Esempi**:
  - 500g CO2 = 1 VRT
  - 1500g CO2 = 1 VRT
  - 2500g CO2 = 2 VRT

## 🎁 Premi Preconfigurati

Il deploy script aggiunge automaticamente questi premi:

1. **Pianta per Casa** - 30 VRT
2. **Buono Amazon €5** - 50 VRT  
3. **Biglietto Cinema** - 75 VRT
4. **Buono Carburante €10** - 100 VRT
5. **Abbonamento Bike Sharing** - 120 VRT
6. **Corso Online Sostenibilità** - 150 VRT

Hai completato il deploy? Fammi sapere gli indirizzi dei contratti e possiamo procedere con l'integrazione! 🚀