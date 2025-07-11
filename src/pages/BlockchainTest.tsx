import React, { useState } from 'react';
import { useBlockchain } from '@/hooks/useBlockchain';
import { useSupabase } from '@/providers/SupabaseProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Activity, 
  ShoppingCart, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const BlockchainTest = () => {
  const blockchain = useBlockchain();
  const { user } = useSupabase();
  const { toast } = useToast();
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const checkBalance = async () => {
    setLoading(true);
    try {
      const balance = await blockchain.getTokenBalance();
      setTokenBalance(balance);
      toast({
        title: "Balance aggiornato",
        description: `Il tuo balance è: ${balance} VRT`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile ottenere il balance",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testCertifyActivity = async () => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Utente non autenticato",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Crea un'attività di test nel database per poterla certificare
      const testActivity = {
        type: 'walking',
        description: 'Test blockchain certification - Passeggiata di 20 minuti',
        distance: 1.5,
        duration: 20,
        tokens_earned: 2,
        co2_saved: 0.8,
        source: 'manual',
        verified: false
      };

      // Aggiungi l'attività usando SupabaseProvider
      await fetch('/api/test-add-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testActivity)
      });

      toast({
        title: "Test completato",
        description: "Attività di test creata. Ora puoi provarla nella pagina Activities!",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante il test",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🔗 Test Blockchain Integration</h1>
      
      {/* Stato Connessione */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Stato Connessione
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {blockchain.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span>Wallet: {blockchain.connected ? 'Connesso' : 'Non connesso'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {user ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span>Utente: {user ? 'Autenticato' : 'Non autenticato'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {blockchain.contracts.VirtuosityToken ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span>Contratti: {blockchain.contracts.VirtuosityToken ? 'Configurati' : 'Non configurati'}</span>
            </div>
          </div>
          
          {blockchain.userAddress && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Indirizzo Wallet:</p>
              <code className="text-xs font-mono break-all">{blockchain.userAddress}</code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Balance Token */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Balance VRT Token
          </CardTitle>
          <CardDescription>
            Controlla il tuo balance di token VRT on-chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{tokenBalance} VRT</p>
              <p className="text-sm text-gray-500">Token nel tuo wallet</p>
            </div>
            <Button 
              onClick={checkBalance} 
              disabled={!blockchain.connected || loading}
              variant="outline"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Aggiorna
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Indirizzi Contratti */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📋 Indirizzi Contratti</CardTitle>
          <CardDescription>
            Contratti deployati su Polygon Amoy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Badge variant="outline" className="mb-2">VirtuosityToken</Badge>
            <code className="block text-xs font-mono bg-gray-100 p-2 rounded break-all">
              {blockchain.contracts.VirtuosityToken || 'Non configurato'}
            </code>
          </div>
          
          <div>
            <Badge variant="outline" className="mb-2">ActivityCertification</Badge>
            <code className="block text-xs font-mono bg-gray-100 p-2 rounded break-all">
              {blockchain.contracts.ActivityCertification || 'Non configurato'}
            </code>
          </div>
          
          <div>
            <Badge variant="outline" className="mb-2">RewardsMarketplace</Badge>
            <code className="block text-xs font-mono bg-gray-100 p-2 rounded break-all">
              {blockchain.contracts.RewardsMarketplace || 'Non configurato'}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Test Azioni
          </CardTitle>
          <CardDescription>
            Testa le funzionalità blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testCertifyActivity}
            disabled={!blockchain.connected || !user || loading}
            className="w-full"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Activity className="h-4 w-4 mr-2" />
            )}
            Crea Attività di Test
          </Button>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p>• ✅ I contratti sono deployati e configurati (NUOVA VERSIONE)</p>
            <p>• ✅ L'hook useBlockchain è integrato</p>
            <p>• ✅ Hook useActivityCertification implementato</p>
            <p>• ✅ ActivityList component aggiornato</p>
            <p>• 🎉 <strong>Auto-certificazione ATTIVA! Vai su /activities!</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainTest;