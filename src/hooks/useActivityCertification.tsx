// src/hooks/useActivityCertification-fixed.tsx
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
      
      // Verify contract connection
      console.log(`🔍 Verifying contract connection...`);
      console.log(`Contract addresses:`, {
        ActivityCertification: blockchain.contracts.ActivityCertification,
        VirtuosityToken: blockchain.contracts.VirtuosityToken,
        userAddress: blockchain.userAddress
      });

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

      // Step 1: Certify on blockchain
      console.log(`⛓️ Calling blockchain contract for certification...`);
      
      // Sanitize and validate parameters before sending to contract
      const sanitizedActivityId = activityId.trim();
      const co2SavedGrams = Math.round(activity.co2_saved * 1000);
      const sanitizedActivityType = activity.type.trim();
      const sanitizedDescription = activity.description.trim();
      
      console.log(`📝 Contract parameters:`, {
        activityId: sanitizedActivityId,
        co2SavedGrams: co2SavedGrams,
        activityType: sanitizedActivityType,
        description: sanitizedDescription
      });
      
      // Validate parameters
      if (!sanitizedActivityId || sanitizedActivityId.length === 0) {
        throw new Error('Invalid activityId: empty or null');
      }
      if (co2SavedGrams <= 0) {
        throw new Error(`Invalid co2SavedGrams: ${co2SavedGrams}`);
      }
      if (!sanitizedActivityType || sanitizedActivityType.length === 0) {
        throw new Error('Invalid activityType: empty or null');
      }
      if (!sanitizedDescription || sanitizedDescription.length === 0) {
        throw new Error('Invalid description: empty or null');
      }
      
      const txHash = await blockchain.certifyActivity(
        sanitizedActivityId,
        co2SavedGrams,
        sanitizedActivityType,
        sanitizedDescription
      );

      console.log(`✅ Blockchain transaction successful: ${txHash}`);

      // Step 2: Create blockchain transaction record
      console.log(`📝 Creating blockchain transaction record...`);
      try {
        await createBlockchainTransaction({
          tx_hash: txHash,
          type: 'token_mint',
          amount: activity.tokens_earned,
          data: JSON.stringify({ 
            activityId, 
            co2_saved: activity.co2_saved,
            description: activity.description 
          }),
          status: 'confirmed'
        });
        console.log(`✅ Blockchain transaction record created`);
      } catch (txRecordError) {
        console.error(`❌ Error creating transaction record:`, txRecordError);
        // Continue anyway - the main transaction succeeded
      }

      // Step 3: Update activity in database (mark as verified)
      console.log(`💾 Updating activity in database...`);
      
      // DEBUGGING: First, let's verify the activity exists and belongs to the user
      console.log(`🔍 Verifying activity exists before update...`);
      const { data: existingActivity, error: checkError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .eq('user_id', user.id)
        .single();
        
      console.log(`🔍 Existing activity check:`, { existingActivity, checkError });
      
      if (checkError || !existingActivity) {
        console.error(`❌ Activity not found for update:`, { activityId, userId: user.id, checkError });
        throw new Error(`Activity not found for update: ${activityId} for user ${user.id}`);
      }
      
      console.log(`✅ Activity exists and belongs to user:`, existingActivity);
      
      console.log(`🔍 Update parameters:`, {
        activityId,
        userId: user.id,
        txHash,
        updateData: {
          verified: true,
          updated_at: new Date().toISOString()
        }
      });
      
      const { data: updateResult, error: updateError } = await supabase
        .from('activities')
        .update({
          blockchain_tx_hash: txHash,
          verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', activityId)
        .eq('user_id', user.id)
        .select(); // Add select to see what was updated

      console.log(`🔍 Update result:`, { updateResult, updateError });

      if (updateError) {
        console.error(`❌ Error updating activity:`, updateError);
        throw new Error(`Failed to update activity in database: ${updateError.message}`);
      }
      
      if (!updateResult || updateResult.length === 0) {
        console.error(`❌ No rows were updated - check activity ID and user permissions`);
        throw new Error(`No activity was updated - check activity ID: ${activityId} and user ID: ${user.id}`);
      }
      
      console.log(`✅ Activity marked as verified in database:`, updateResult[0]);

      // Step 4: Update user token balances
      console.log(`💰 Updating user token balances...`);
      const newPendingTokens = Math.max(0, user.tokens_pending - activity.tokens_earned);
      const newMintedTokens = user.tokens_minted + activity.tokens_earned;
      
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          tokens_pending: newPendingTokens,
          tokens_minted: newMintedTokens,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (userUpdateError) {
        console.error(`❌ Error updating user tokens:`, userUpdateError);
        // This is not critical - activity is still certified
        console.warn(`⚠️ User token update failed, but activity is certified`);
      } else {
        console.log(`✅ User tokens updated: pending ${newPendingTokens}, minted ${newMintedTokens}`);
      }

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