import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase } from '@/providers/SupabaseProvider';
import { useActivities, useRewards, calculateCO2Savings, calculateTokenReward, activityTypes } from '@/hooks/useSupabaseData';
import { Loader2, Plus, Coins, Leaf, Activity as ActivityIcon, Trophy, AlertCircle, Blocks, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Database } from '@/lib/supabase';
import { usePrivy } from '@privy-io/react-auth';

const SupabaseTest = () => {
  const { user: privyUser, login, logout, ready } = usePrivy();
  const { user, loading, addActivity, getBlockchainTransactions, createBlockchainTransaction } = useSupabase();
  const { activities, loading: activitiesLoading, refetch: refetchActivities } = useActivities();
  const { rewards, loading: rewardsLoading } = useRewards();
  
  const [testActivity, setTestActivity] = useState({
    type: 'walking' as const,
    distance: '',
    description: ''
  });
  const [addingActivity, setAddingActivity] = useState(false);
  const [blockchainTxs, setBlockchainTxs] = useState<Database['public']['Tables']['blockchain_transactions']['Row'][]>([]);
  const [loadingTxs, setLoadingTxs] = useState(false);
  const [mintingTokens, setMintingTokens] = useState(false);

  const handleAddTestActivity = async () => {
    if (!testActivity.distance || !testActivity.description) return;
    
    setAddingActivity(true);
    try {
      const distance = parseFloat(testActivity.distance);
      const co2Saved = calculateCO2Savings[testActivity.type](distance);
      const tokensEarned = calculateTokenReward[testActivity.type](distance);

      await addActivity({
        type: testActivity.type,
        description: testActivity.description,
        co2_saved: co2Saved,
        tokens_earned: tokensEarned,
        distance: distance,
        verified: true
      });

      setTestActivity({ type: 'walking', distance: '', description: '' });
      refetchActivities();
    } catch (error) {
      console.error('Error adding test activity:', error);
    }
    setAddingActivity(false);
  };

  // Debug: Log activities ogni volta che cambiano
  useEffect(() => {
    console.log('SupabaseTest: Activities updated:', activities);
  }, [activities]);

  // Debug: Log user ogni volta che cambia
  useEffect(() => {
    console.log('SupabaseTest: User updated:', user);
  }, [user]);

  const loadBlockchainTransactions = async () => {
    setLoadingTxs(true);
    try {
      const data = await getBlockchainTransactions();
      setBlockchainTxs(data);
    } catch (error) {
      console.error('Error loading blockchain transactions:', error);
    }
    setLoadingTxs(false);
  };

  const simulateTokenMinting = async () => {
    if (!user || user.tokens_pending === 0) return;
    
    setMintingTokens(true);
    try {
      // Simulate blockchain transaction
      await createBlockchainTransaction({
        type: 'token_mint',
        amount: user.tokens_pending,
        status: 'pending',
        contract_address: '0x...VirtuosityToken' // Placeholder
      });
      
      // Simulate successful minting after 2 seconds
      setTimeout(async () => {
        // This would be done by the blockchain service in real implementation
        console.log('Token minting simulated successfully');
        loadBlockchainTransactions();
      }, 2000);
      
    } catch (error) {
      console.error('Error simulating token minting:', error);
    }
    setMintingTokens(false);
  };

  // Load blockchain transactions when user changes
  useEffect(() => {
    if (user) {
      loadBlockchainTransactions();
    }
  }, [user]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!privyUser) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Supabase + Privy Test</CardTitle>
            <CardDescription>
              Fai login per testare l'integrazione database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full">
              Login con Privy
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Supabase Integration Test</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Informazioni Utente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento dati utente...
            </div>
          ) : user ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <p className="font-medium">{user.name || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="font-medium">{user.email || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <Label>Wallet</Label>
                <p className="font-mono text-sm">{user.wallet_address || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Token Pending
                </Label>
                <Badge variant="outline" className="text-lg text-orange-600">
                  {user.tokens_pending}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-green-600" />
                  Token Blockchain
                </Label>
                <Badge variant="default" className="text-lg bg-green-600">
                  {user.tokens_minted}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  CO₂ Risparmiata
                </Label>
                <Badge variant="outline" className="text-lg">
                  {user.total_co2_saved.toFixed(2)} kg
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Attività Totali</Label>
                <Badge variant="outline" className="text-lg">
                  {user.total_activities}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              Errore nel caricamento dei dati utente
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Test Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Aggiungi Attività Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo Attività</Label>
              <Select 
                value={testActivity.type} 
                onValueChange={(value: any) => setTestActivity(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Distanza (km)</Label>
              <Input
                type="number"
                placeholder="5.0"
                value={testActivity.distance}
                onChange={(e) => setTestActivity(prev => ({ ...prev, distance: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrizione</Label>
              <Input
                placeholder="Camminata nel parco..."
                value={testActivity.description}
                onChange={(e) => setTestActivity(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          
          {testActivity.distance && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <strong>Anteprima:</strong> {calculateCO2Savings[testActivity.type](parseFloat(testActivity.distance) || 0).toFixed(2)} kg CO₂ risparmiata, {calculateTokenReward[testActivity.type](parseFloat(testActivity.distance) || 0)} token guadagnati
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleAddTestActivity}
            disabled={!testActivity.distance || !testActivity.description || addingActivity}
            className="w-full"
          >
            {addingActivity ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Aggiungendo...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Attività
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Token Minting Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Token Blockchain Minting
          </CardTitle>
          <CardDescription>
            Converti i token pending in veri token ERC-20 sulla blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border">
            <div>
              <p className="text-sm text-gray-600">Token da convertire:</p>
              <p className="text-2xl font-bold text-orange-600">
                {user?.tokens_pending || 0} token pending
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">→</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Token blockchain:</p>
              <p className="text-2xl font-bold text-green-600">
                {user?.tokens_minted || 0} token minted
              </p>
            </div>
          </div>
          
          <Button 
            onClick={simulateTokenMinting}
            disabled={!user || user.tokens_pending === 0 || mintingTokens}
            className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600"
          >
            {mintingTokens ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Minting in corso...
              </>
            ) : (
              <>
                <Blocks className="h-4 w-4 mr-2" />
                Converti in Token Blockchain ({user?.tokens_pending || 0})
              </>
            )}
          </Button>
          
          {user?.tokens_pending === 0 && (
            <p className="text-sm text-gray-500 text-center">
              Nessun token pending da convertire. Aggiungi attività per guadagnare token!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Blockchain Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Transazioni Blockchain
          </CardTitle>
          <CardDescription>
            Storico delle transazioni sulla blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTxs ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento transazioni...
            </div>
          ) : blockchainTxs.length > 0 ? (
            <div className="space-y-3">
              {blockchainTxs.map((tx) => (
                <div key={tx.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="capitalize font-medium">
                          {tx.type.replace('_', ' ')}
                        </span>
                        <Badge 
                          variant={tx.status === 'confirmed' ? 'default' : tx.status === 'failed' ? 'destructive' : 'secondary'}
                          className="flex items-center gap-1"
                        >
                          {tx.status === 'confirmed' && <CheckCircle className="h-3 w-3" />}
                          {tx.status === 'failed' && <XCircle className="h-3 w-3" />}
                          {tx.status === 'pending' && <Clock className="h-3 w-3" />}
                          {tx.status}
                        </Badge>
                      </div>
                      {tx.amount && (
                        <p className="text-sm text-gray-600">
                          Quantità: {tx.amount} token
                        </p>
                      )}
                      {tx.contract_address && (
                        <p className="text-xs text-gray-500 font-mono">
                          Contract: {tx.contract_address}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(tx.created_at).toLocaleString('it-IT')}
                      </p>
                    </div>
                    <div className="text-right">
                      {tx.tx_hash ? (
                        <p className="text-xs font-mono text-blue-600">
                          {tx.tx_hash.substring(0, 10)}...
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400">Pending...</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nessuna transazione blockchain registrata. Converti i token pending per vedere le transazioni!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Le Tue Attività
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetchActivities()}
              disabled={activitiesLoading}
              className="ml-auto"
            >
              {activitiesLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "🔄 Ricarica"
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento attività...
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{activityTypes[activity.type]?.icon}</span>
                        <span className="font-medium">{activityTypes[activity.type]?.label}</span>
                        <Badge variant={activity.verified ? "default" : "secondary"}>
                          {activity.verified ? "Verificata" : "Da verificare"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      {activity.distance && (
                        <p className="text-xs text-gray-500 mt-1">
                          Distanza: {activity.distance} km
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="text-green-600">+{activity.tokens_earned} token</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.co2_saved.toFixed(2)} kg CO₂
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nessuna attività registrata. Aggiungi la prima attività sopra!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Rewards List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Premi Disponibili
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rewardsLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento premi...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <div key={reward.id} className="border rounded-lg p-4">
                  <img 
                    src={reward.image_url} 
                    alt={reward.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h4 className="font-medium mb-1">{reward.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      {reward.token_cost} token
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {reward.available_quantity - reward.total_redeemed} disponibili
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseTest;
