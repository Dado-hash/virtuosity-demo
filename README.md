# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f2f4a003-3109-4ab3-a63b-0b12ef55a252

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f2f4a003-3109-4ab3-a63b-0b12ef55a252) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Database & Auth)
- Privy (Web3 Wallet)
- Google Fit API (Fitness Tracking)
- Polygon (Blockchain Integration)

## 🚀 Virtuosity Demo Setup

This is a functional demo of a **sustainability platform** that combines blockchain technology with real-world environmental actions.

### 🔧 Quick Setup:
1. Install dependencies: `npm install`
2. Setup Supabase project and add credentials to `.env`
3. Setup Google Fit API and add credentials to `.env`
4. Run database schema: Execute `supabase-schema.sql` + `google-fit-schema-update.sql`
5. Start development: `npm run dev`
6. Test integration: Visit `/supabase-test` (complete) or `/googlefit-test` (Google Fit only)

For detailed setup instructions, see `SETUP-FASE-1.md` and `SETUP-FASE-2.md`.

### ✨ Current Features:
- **🔐 Web3 Authentication** with Privy embedded wallets
- **📊 Activity Tracking** with CO₂ calculation
- **🏃‍♂️ Google Fit Integration** for automatic fitness tracking
- **🪙 Token System** (pending → blockchain conversion)
- **🏆 Rewards Marketplace** with real prizes
- **📱 Mobile-ready** responsive design
- **🌍 Multi-language** support
- **♾️ Hybrid System** (automatic + manual activities)

## ⚠️ Importante: Migrazione Google OAuth2

**Il sistema di autenticazione Google è stato migrato** dalle librerie deprecate (`gapi.auth2`) al nuovo sistema Google Identity Services.

- ✅ **Migrazione completata**: Nessun warning "deprecated libraries"
- ✅ **Compatibilità**: Funziona con le nuove politiche Google
- ✅ **Sicurezza**: Utilizza OAuth2 aggiornato
- ✅ **Correzioni**: Risolti problemi di distanza e token ([`GOOGLE-FIT-COMPLETE.md`](./GOOGLE-FIT-COMPLETE.md))

Per dettagli tecnici e troubleshooting, vedi [`GOOGLE-OAUTH2-MIGRATION.md`](./GOOGLE-OAUTH2-MIGRATION.md).

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f2f4a003-3109-4ab3-a63b-0b12ef55a252) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
