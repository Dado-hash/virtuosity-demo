import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useBlockchain } from '@/hooks/useBlockchain';
import { useSupabase } from '@/providers/SupabaseProvider';
import { usePrivy } from '@privy-io/react-auth';
import { 
  Loader2, 
  ShoppingCart, 
  Gift, 
  Coins, 
  Trophy, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Eye,
  Plus,
  RefreshCw,
  Zap,
  Blocks,
  ArrowRight,
  Clock
} from 'lucide-react';
import { formatEther, parseEther } from 'viem';
import TestNavigation from '@/components/TestNavigation';

interface TestReward {
  id: number;
  name: string;
  description: string;
  tokenCost: string;
  category: string;
  provider: string;
  available: number;
  redeemed: number;
  active: boolean;
}

interface RedemptionDetails {
  redemptionId: string;
  rewardId: string;
  user: string;
  timestamp: string;
  redemptionCode: string;
  fulfilled: boolean;
}

// Array indexes for redemption data from smart contract
type RedemptionTuple = [
  rewardId: bigint,
  user: string,
  timestamp: bigint,
  redemptionCode: string,
  fulfilled: boolean,
  redemptionId?: bigint
];

const MarketplaceTest = () => {
  const { user: privyUser, login, logout, ready } = usePrivy();
  const { user } = useSupabase();
  const { toast } = useToast();
  const {
    loading: blockchainLoading,
    error: blockchainError,
    connected,
    userAddress,
    getTokenBalance,
    getReward,
    purchaseReward,
    getUserRedemptions,
    contracts
  } = useBlockchain();

  // State
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [testRewards, setTestRewards] = useState<TestReward[]>([]);
  const [userRedemptions, setUserRedemptions] = useState<RedemptionTuple[]>([]);
  const [loadingRedemptions, setLoadingRedemptions] = useState(false);
  const [purchasingReward, setPurchasingReward] = useState<number | null>(null);
  const [showAddRewardDialog, setShowAddRewardDialog] = useState(false);
  
  // New reward form
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    tokenCost: '',
    category: 'shopping',
    provider: '',
    totalAvailable: '100'
  });

  // Mock test rewards data - aligned with smart contract
  const mockRewards: TestReward[] = [
    {
      id: 1,
      name: "Pianta per Casa",
      description: "Pianta verde per la tua casa",
      tokenCost: "30",
      category: "ambiente",
      provider: "Green Garden",
      available: 200,
      redeemed: 15,
      active: true
    },
    {
      id: 2,
      name: "Buono Amazon €5",
      description: "Buono sconto Amazon del valore di €5",
      tokenCost: "50",
      category: "shopping",
      provider: "Amazon",
      available: 100,
      redeemed: 8,
      active: true
    },
    {
      id: 3,
      name: "Biglietto Cinema",
      description: "Biglietto per film al cinema",
      tokenCost: "75",
      category: "intrattenimento",
      provider: "Cinema Partner",
      available: 50,
      redeemed: 3,
      active: true
    },
    {
      id: 4,
      name: "Buono Carburante €10",
      description: "Buono carburante del valore di €10",
      tokenCost: "100",
      category: "trasporti",
      provider: "Fuel Partner",
      available: 25,
      redeemed: 2,
      active: true
    },
    {
      id: 5,
      name: "Abbonamento Bike Sharing",
      description: "30 giorni di bike sharing illimitato",
      tokenCost: "120",
      category: "trasporti",
      provider: "Mobike",
      available: 15,
      redeemed: 5,
      active: true
    },
    {
      id: 6,
      name: "Corso Online Sostenibilità",
      description: "Accesso a corso online sulla sostenibilità",
      tokenCost: "150",
      category: "educazione",
      provider: "EcoLearning",
      available: 30,
      redeemed: 1,
      active: true
    }
  ];

  // Load token balance
  const loadTokenBalance = async () => {
    if (!connected) return;
    
    setLoadingBalance(true);
    try {
      const balance = await getTokenBalance();
      setTokenBalance(balance);
    } catch (error) {
      console.error('Error loading token balance:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare il saldo token",
        variant: "destructive"
      });
    }
    setLoadingBalance(false);
  };

  // Load user redemptions
  const loadUserRedemptions = async () => {
    if (!connected) return;
    
    setLoadingRedemptions(true);
    try {
      const redemptions = await getUserRedemptions(0, 20);
      setUserRedemptions(redemptions);
    } catch (error) {
      console.error('Error loading redemptions:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i riscatti",
        variant: "destructive"
      });
    }
    setLoadingRedemptions(false);
  };

  // Handle reward purchase
  const handlePurchaseReward = async (reward: TestReward) => {
    if (!connected) {
      toast({
        title: "Wallet non connesso",
        description: "Connetti il wallet per acquistare premi",
        variant: "destructive"
      });
      return;
    }

    const userBalance = parseFloat(tokenBalance);
    const rewardCost = parseFloat(reward.tokenCost);

    if (userBalance < rewardCost) {
      toast({
        title: "Token insufficienti",
        description: `Ti servono ${rewardCost} token, ma ne hai solo ${userBalance.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }

    setPurchasingReward(reward.id);
    
    try {
      const txHash = await purchaseReward(reward.id, reward.tokenCost);
      
      if (txHash) {
        toast({
          title: "✅ Acquisto completato!",
          description: `Hai riscattato: ${reward.name}. TX: ${txHash.slice(0, 10)}...`,
        });
        
        // Reload balance and redemptions
        await loadTokenBalance();
        await loadUserRedemptions();
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Errore nell'acquisto",
        description: error.message || "Transazione fallita",
        variant: "destructive"
      });
    }
    
    setPurchasingReward(null);
  };

  // Get reward details from blockchain
  const loadRewardFromBlockchain = async (rewardId: number) => {
    try {
      const reward = await getReward(rewardId);
      console.log(`Reward ${rewardId} from blockchain:`, reward);
      return reward;
    } catch (error) {
      console.error(`Error loading reward ${rewardId}:`, error);
      return null;
    }
  };

  // Category colors and icons
  const getCategoryColor = (category: string) => {
    const colors = {
      ambiente: "bg-green-100 text-green-800",
      shopping: "bg-blue-100 text-blue-800", 
      intrattenimento: "bg-purple-100 text-purple-800",
      trasporti: "bg-emerald-100 text-emerald-800",
      educazione: "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      ambiente: "🌱",
      shopping: "🛍️",
      intrattenimento: "🎬", 
      trasporti: "🚲",
      educazione: "🎓"
    };
    return icons[category as keyof typeof icons] || "🎁";
  };

  // Load initial data
  useEffect(() => {
    setTestRewards(mockRewards);
  }, []);

  useEffect(() => {
    if (connected) {
      loadTokenBalance();
      loadUserRedemptions();
    }
  }, [connected]);

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
            <CardTitle className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Marketplace Test
            </CardTitle>
            <CardDescription>
              Fai login per testare il marketplace blockchain
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
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <TestNavigation />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🛒 Marketplace Test
          </h1>
          <p className="text-gray-600 mt-1">
            Testa il sistema di ricompense blockchain
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Blockchain Status */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Stato Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[auto_auto_1fr_1fr] gap-2 md:gap-4">
            <div className="space-y-2">
              <Label>Connessione</Label>
              <Badge
                variant={connected ? "default" : "destructive"}
                className="w-fit px-3 py-1 text-sm flex items-center gap-1"
              >
                {connected ? "✅ Connesso" : "❌ Disconnesso"}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Network</Label>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded w-fit px-3">
                Polygon Amoy
              </p>
            </div>
            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                {userAddress ? userAddress : 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Marketplace Contract</Label>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                {contracts.RewardsMarketplace ? 
                contracts.RewardsMarketplace : 'N/A'}
              </p>
            </div>
          </div>
          
          {blockchainError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Errore Blockchain:</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{blockchainError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token Balance */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-600" />
            Il Tuo Saldo VRT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {loadingBalance ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Caricamento...</span>
                </div>
              ) : (
                <div className="text-3xl font-bold text-yellow-700">
                  {parseFloat(tokenBalance).toFixed(2)} VRT
                </div>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Token disponibili per l'acquisto di premi
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={loadTokenBalance}
              disabled={loadingBalance || !connected}
              className="hover:bg-yellow-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingBalance ? 'animate-spin' : ''}`} />
              Aggiorna
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="marketplace">🛍️ Marketplace</TabsTrigger>
          <TabsTrigger value="redemptions">📋 I Miei Riscatti</TabsTrigger>
          <TabsTrigger value="admin">⚙️ Admin Tools</TabsTrigger>
        </TabsList>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Premi Disponibili
              </CardTitle>
              <CardDescription>
                Riscatta i tuoi token VRT per ottenere premi reali
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testRewards.map((reward) => (
                  <Card key={reward.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-4xl">
                          {getCategoryIcon(reward.category)}
                        </div>
                        <Badge className={getCategoryColor(reward.category)}>
                          {reward.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {reward.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Costo</span>
                          <span className="font-bold text-lg text-purple-600">
                            {reward.tokenCost} VRT
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Disponibilità</span>
                          <Badge variant="outline">
                            {reward.available - reward.redeemed} rimasti
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Partner: {reward.provider}
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${((reward.available - reward.redeemed) / reward.available) * 100}%` 
                            }}
                          />
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                          onClick={() => handlePurchaseReward(reward)}
                          disabled={
                            !connected || 
                            purchasingReward === reward.id ||
                            parseFloat(tokenBalance) < parseFloat(reward.tokenCost) ||
                            reward.available <= reward.redeemed
                          }
                        >
                          {purchasingReward === reward.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processando...
                            </>
                          ) : parseFloat(tokenBalance) >= parseFloat(reward.tokenCost) ? (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Riscatta Ora
                            </>
                          ) : (
                            "Token Insufficienti"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redemptions Tab */}
        <TabsContent value="redemptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                I Tuoi Riscatti
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadUserRedemptions}
                  disabled={loadingRedemptions || !connected}
                  className="ml-auto"
                >
                  {loadingRedemptions ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                Storico dei premi che hai riscattato dalla blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!connected ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Connetti il wallet per vedere i tuoi riscatti</p>
                </div>
              ) : loadingRedemptions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Caricamento riscatti...</span>
                </div>
              ) : userRedemptions.length > 0 ? (
                <div className="space-y-4">
                  {[...userRedemptions]
                    .sort((a, b) => Number(b[2]) - Number(a[2])) // Ordina per data decrescente (più recenti prima)
                    .map((redemption, index) => {
                    // Trova il reward corrispondente dai test rewards
                    const matchingReward = testRewards.find(r => r.id === Number(redemption[0]));
                    
                    return (
                      <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Riscatto #{redemption[5]?.toString() || index + 1}</span>
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Confermato
                            </Badge>
                          </div>
                          <div className="text-right">
                            {matchingReward && (
                              <p className="font-medium text-purple-600">
                                {matchingReward.name}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Reward ID: {redemption[0]?.toString() || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Redemption ID: <span className="font-mono text-xs">{redemption[5]?.toString() || 'N/A'}</span></p>
                          <p>Codice Riscatto: <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-yellow-800 font-bold">{redemption[3] || 'N/A'}</span></p>
                          <p>Data: {redemption[2] ? new Date(Number(redemption[2]) * 1000).toLocaleString('it-IT') : 'N/A'}</p>
                          <p>Stato: ✅ Completato</p>
                          <p>Wallet: <span className="font-mono text-xs">{redemption[1] ? `${redemption[1].slice(0, 6)}...${redemption[1].slice(-4)}` : 'N/A'}</span></p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Nessun riscatto ancora. Inizia a guadagnare premi!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tools Tab */}
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Strumenti Admin
              </CardTitle>
              <CardDescription>
                Funzioni avanzate per testing e debugging (solo per sviluppatori)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Contract Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">📋 Informazioni Contratti</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>VirtuosityToken:</span>
                    <span className="font-mono">{contracts.VirtuosityToken || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RewardsMarketplace:</span>
                    <span className="font-mono">{contracts.RewardsMarketplace || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ActivityCertification:</span>
                    <span className="font-mono">{contracts.ActivityCertification || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Test Blockchain Rewards */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-3">🔍 Test Lettura Blockchain</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[1, 2, 3].map(rewardId => (
                    <Button 
                      key={rewardId}
                      variant="outline" 
                      size="sm"
                      onClick={() => loadRewardFromBlockchain(rewardId)}
                      disabled={!connected}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Reward #{rewardId}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Links Utili */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold mb-3">🔗 Link Utili</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => window.open('https://amoy.polygonscan.com/', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Polygon Amoy Explorer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => window.open(`https://amoy.polygonscan.com/address/${contracts.RewardsMarketplace}`, '_blank')}
                    disabled={!contracts.RewardsMarketplace}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contratto Marketplace
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceTest;
