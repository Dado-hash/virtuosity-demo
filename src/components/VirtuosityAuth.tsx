import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVirtuosityAuth } from '@/hooks/useVirtuosityAuth';
// 1. Importa useCreateWallet da Privy
import { useCreateWallet } from '@privy-io/react-auth';
import { Wallet, LogOut, CheckCircle, Plus } from 'lucide-react';

export const VirtuosityAuth = () => {
  const { user, login, logout, isReady } = useVirtuosityAuth();
  
  // 2. Inizializza l'hook per ottenere la funzione createWallet
  const { createWallet } = useCreateWallet();

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="ml-3 text-gray-600">Caricamento Privy...</p>
      </div>
    );
  }

  if (!user.isAuthenticated) {
    // Questa parte rimane invariata
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold">Benvenuto in Virtuosity</CardTitle>
          <CardDescription>
            Accedi con un click per iniziare il tuo percorso sostenibile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={login}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
            size="lg"
          >
            🚀 Accedi con Privy
          </Button>
        </CardContent>
      </Card>
    );
  }

  // L'utente è autenticato, ora controlliamo se ha un wallet
  if (!user.walletAddress) {
    // 3. Se l'utente è loggato ma non ha un wallet, mostra il pulsante per crearlo
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Un Ultimo Passaggio</CardTitle>
          <CardDescription>
            Crea il tuo wallet sicuro per completare la configurazione.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={createWallet} // Chiama la funzione createWallet al click
            className="w-full"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crea il mio Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  // L'utente è autenticato e ha un wallet, mostra la schermata di successo
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          <CardTitle className="text-lg">Connesso con successo! 🎉</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700"><strong>Email:</strong> {user.email || 'Non disponibile'}</p>
          <p className="text-sm text-gray-700">
            <strong>Wallet:</strong> {`${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`}
          </p>
        </div>
        
        <Button 
          onClick={logout}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnetti
        </Button>
      </CardContent>
    </Card>
  );
};