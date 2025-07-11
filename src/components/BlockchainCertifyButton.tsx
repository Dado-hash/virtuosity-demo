import React, { useState } from 'react';
import { useBlockchain } from '@/hooks/useBlockchain';
import { useSupabase } from '@/providers/SupabaseProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface BlockchainCertifyButtonProps {
  activityId: string;
  activityData: {
    description: string;
    type: string;
    co2_saved: number;
    tokens_earned: number;
  };
  onCertified: () => void;
}

const BlockchainCertifyButton: React.FC<BlockchainCertifyButtonProps> = ({ 
  activityId, 
  activityData, 
  onCertified 
}) => {
  const blockchain = useBlockchain();
  const { user, createBlockchainTransaction } = useSupabase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleBlockchainCertify = async () => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Utente non autenticato",
        variant: "destructive"
      });
      return;
    }

    if (!blockchain.connected || !blockchain.userAddress) {
      toast({
        title: "Wallet non connesso",
        description: "Connetti il wallet per certificare on-chain",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`🚀 Starting blockchain certification for activity ${activityId}`);

      // Check if already certified on blockchain
      const isAlreadyCertified = await blockchain.isActivityCertified(activityId);
      if (isAlreadyCertified) {
        toast({
          title: "Già certificata",
          description: "Questa attività è già stata certificata on-chain",
          variant: "destructive"
        });
        return;
      }

      // Show initial confirmation
      toast({
        title: "🔗 Certificazione Blockchain",
        description: "Inizio certificazione on-chain...",
      });

      // Certify on blockchain
      console.log(`📝 Certifying activity on blockchain: ${activityData.description}`);
      const txHash = await blockchain.certifyActivity(
        activityId,
        blockchain.userAddress,
        Math.round(activityData.co2_saved * 1000), // Convert to grams
        activityData.type,
        activityData.description
      );

      console.log(`⛓️ Blockchain transaction: ${txHash}`);

      // Create blockchain transaction record
      await createBlockchainTransaction({
        transaction_hash: txHash,
        type: 'activity_certification',
        amount: activityData.tokens_earned,
        data: { activityId, co2_saved: activityData.co2_saved },
        status: 'completed'
      });

      toast({
        title: "🎉 Certificazione Completata!",
        description: `Attività certificata on-chain. TX: ${txHash.slice(0, 10)}...`,
      });

      // Call parent callback to refresh
      onCertified();

    } catch (error: any) {
      console.error('💥 Error in blockchain certification:', error);
      
      let errorMessage = "Errore durante la certificazione blockchain";
      if (error.message?.includes('User rejected')) {
        errorMessage = "Transazione rifiutata dall'utente";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Fondi insufficienti per la transazione";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "❌ Errore Blockchain",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show different states based on blockchain connection
  if (!blockchain.connected) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        disabled
        className="opacity-50"
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Wallet disconnesso
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleBlockchainCertify}
      disabled={loading}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      size="sm"
    >
      {loading ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          Certificando...
        </>
      ) : (
        <>
          <Shield className="h-4 w-4 mr-2" />
          Certifica Blockchain
        </>
      )}
    </Button>
  );
};

export default BlockchainCertifyButton;