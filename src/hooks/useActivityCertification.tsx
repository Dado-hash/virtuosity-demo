import { useState } from 'react';
import { useBlockchain } from '@/hooks/useBlockchain';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export const useActivityCertification = () => {
  const blockchain = useBlockchain();
  const { user, createBlockchainTransaction } = useSupabase();
  const { toast } = useToast();
  const [certifyingId, setCertifyingId] = useState<string | null>(null);

  const certifyActivityBlockchain = async (activityId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!blockchain.connected || !blockchain.userAddress) {
      throw new Error('Wallet not connected. Please connect your wallet to proceed.');
    }

    setCertifyingId(activityId);

    try {
      console.log(`🚀 Starting full blockchain certification for activity ${activityId}`);

      // Get activity details from database first
      const { data: activity, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .eq('user_id', user.id)
        .single();

      if (error || !activity) {
        throw new Error('Activity not found');
      }

      if (activity.verified) {
        throw new Error('Activity already certified');
      }

      console.log(`📝 Activity details:`, {
        description: activity.description,
        type: activity.type,
        co2_saved: activity.co2_saved,
        tokens_earned: activity.tokens_earned
      });

      // Show progress toast
      toast({
        title: "🔗 Certificazione Blockchain",
        description: "Iniziando certificazione on-chain...",
      });

      // Step 1: Check if already certified on blockchain
      const isAlreadyCertified = await blockchain.isActivityCertified(activityId);
      if (isAlreadyCertified) {
        throw new Error('Activity already certified on blockchain');
      }

      // Step 2: Certify on blockchain
      console.log(`⛓️ Calling blockchain contract for certification...`);
      const txHash = await blockchain.certifyActivity(
        activityId,
        Math.round(activity.co2_saved * 1000), // Convert to grams
        activity.type,
        activity.description
      );

      console.log(`✅ Blockchain transaction successful: ${txHash}`);

      // Step 3: Create blockchain transaction record
      await createBlockchainTransaction({
        transaction_hash: txHash,
        type: 'activity_certification',
        amount: activity.tokens_earned,
        data: { 
          activityId, 
          co2_saved: activity.co2_saved,
          description: activity.description 
        },
        status: 'completed'
      });

      // Step 4: Update activity in database with blockchain hash
      await supabase
        .from('activities')
        .update({ 
          verified: true,
          blockchain_tx_hash: txHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', activityId);

      // Step 5: Update user token balances
      const newPendingTokens = Math.max(0, user.tokens_pending - activity.tokens_earned);
      const newMintedTokens = user.tokens_minted + activity.tokens_earned;
      
      await supabase
        .from('users')
        .update({
          tokens_pending: newPendingTokens,
          tokens_minted: newMintedTokens,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      console.log(`🎉 Full certification complete!`);
      
      toast({
        title: "🎉 Certificazione Completata!",
        description: `Attività certificata on-chain. TX: ${txHash.slice(0, 10)}...`,
      });

      return txHash;

    } catch (error: any) {
      console.error('💥 Error in blockchain certification:', error);
      
      let errorMessage = "Errore durante la certificazione blockchain";
      if (error.message?.includes('User rejected')) {
        errorMessage = "Transazione rifiutata dall'utente";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Fondi insufficienti per la transazione";
      } else if (error.message?.includes('Wallet not connected')) {
        errorMessage = "Wallet non connesso. Connetti il wallet per procedere.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "❌ Errore Blockchain",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setCertifyingId(null);
    }
  };

  return {
    certifyActivityBlockchain,
    certifyingId,
    isConnected: blockchain.connected,
    userAddress: blockchain.userAddress
  };
};
