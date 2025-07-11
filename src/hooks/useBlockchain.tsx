// src/hooks/useBlockchain.tsx
import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets } from '@privy-io/react-auth';
import { createPublicClient, createWalletClient, custom, formatEther, parseEther } from 'viem';
import { polygonAmoy } from 'viem/chains';

// Import contract ABIs
import { VirtuosityTokenABI } from '../contracts/VirtuosityTokenABI';
import { ActivityCertificationABI } from '../contracts/ActivityCertificationABI';
import { RewardsMarketplaceABI } from '../contracts/RewardsMarketplaceABI';

// Contract addresses (set these after deployment)
const CONTRACTS = {
  VirtuosityToken: import.meta.env.VITE_VIRTUOSITY_TOKEN_ADDRESS,
  ActivityCertification: import.meta.env.VITE_ACTIVITY_CERTIFICATION_ADDRESS,
  RewardsMarketplace: import.meta.env.VITE_REWARDS_MARKETPLACE_ADDRESS,
} as const;

interface BlockchainState {
  loading: boolean;
  error: string | null;
}

export const useBlockchain = () => {
  const { user, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [state, setState] = useState<BlockchainState>({
    loading: false,
    error: null,
  });

  // Get the embedded wallet
  const wallet = wallets.find(w => w.walletClientType === 'privy');
  
  // Create clients
  const publicClient = createPublicClient({
    chain: polygonAmoy,
    transport: custom(window.ethereum),
  });

  const getWalletClient = useCallback(async () => {
    if (!wallet) throw new Error('No wallet connected');
    
    await wallet.switchChain(polygonAmoy.id);
    const provider = await wallet.getEthereumProvider();
    
    return createWalletClient({
      chain: polygonAmoy,
      transport: custom(provider),
      account: wallet.address as `0x${string}`,
    });
  }, [wallet]);

  // Get user's VRT token balance
  const getTokenBalance = useCallback(async (): Promise<string> => {
    if (!wallet?.address) return '0';

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const balance = await publicClient.readContract({
        address: CONTRACTS.VirtuosityToken as `0x${string}`,
        abi: VirtuosityTokenABI,
        functionName: 'balanceOf',
        args: [wallet.address],
      });

      return formatEther(balance as bigint);
    } catch (error) {
      console.error('Error getting token balance:', error);
      setState(prev => ({ ...prev, error: 'Failed to get token balance' }));
      return '0';
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [wallet?.address, publicClient]);

  // Certify an activity (users can now self-certify)
  const certifyActivity = useCallback(async (
    activityId: string,
    co2SavedGrams: number,
    activityType: string,
    description: string
  ): Promise<string | null> => {
    if (!authenticated || !wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const walletClient = await getWalletClient();
      
      const txHash = await walletClient.writeContract({
        address: CONTRACTS.ActivityCertification as `0x${string}`,
        abi: ActivityCertificationABI,
        functionName: 'certifyActivity',
        args: [activityId, co2SavedGrams, activityType, description],
      });

      // Wait for transaction confirmation
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      
      return txHash;
    } catch (error) {
      console.error('Error certifying activity:', error);
      setState(prev => ({ ...prev, error: 'Failed to certify activity' }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [authenticated, wallet, getWalletClient, publicClient]);

  // Check if an activity is already certified
  const isActivityCertified = useCallback(async (activityId: string): Promise<boolean> => {
    try {
      const certified = await publicClient.readContract({
        address: CONTRACTS.ActivityCertification as `0x${string}`,
        abi: ActivityCertificationABI,
        functionName: 'isActivityCertified',
        args: [activityId],
      });

      return certified as boolean;
    } catch (error) {
      console.error('Error checking activity certification:', error);
      return false;
    }
  }, [publicClient]);

  // Get reward details
  const getReward = useCallback(async (rewardId: number) => {
    try {
      const reward = await publicClient.readContract({
        address: CONTRACTS.RewardsMarketplace as `0x${string}`,
        abi: RewardsMarketplaceABI,
        functionName: 'getReward',
        args: [rewardId],
      });

      return reward;
    } catch (error) {
      console.error('Error getting reward:', error);
      return null;
    }
  }, [publicClient]);

  // Purchase a reward
  const purchaseReward = useCallback(async (rewardId: number, tokenCost: string): Promise<string | null> => {
    if (!authenticated || !wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const walletClient = await getWalletClient();
      
      // First, approve the marketplace to spend tokens
      const approveTxHash = await walletClient.writeContract({
        address: CONTRACTS.VirtuosityToken as `0x${string}`,
        abi: VirtuosityTokenABI,
        functionName: 'approve',
        args: [CONTRACTS.RewardsMarketplace, parseEther(tokenCost)],
      });

      // Wait for approval confirmation
      await publicClient.waitForTransactionReceipt({ hash: approveTxHash });

      // Then purchase the reward
      const purchaseTxHash = await walletClient.writeContract({
        address: CONTRACTS.RewardsMarketplace as `0x${string}`,
        abi: RewardsMarketplaceABI,
        functionName: 'purchaseReward',
        args: [rewardId],
      });

      // Wait for purchase confirmation
      await publicClient.waitForTransactionReceipt({ hash: purchaseTxHash });
      
      return purchaseTxHash;
    } catch (error) {
      console.error('Error purchasing reward:', error);
      setState(prev => ({ ...prev, error: 'Failed to purchase reward' }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [authenticated, wallet, getWalletClient, publicClient]);

  // Get user's redemptions
  const getUserRedemptions = useCallback(async (offset = 0, limit = 10) => {
    if (!wallet?.address) return [];

    try {
      const redemptionIds = await publicClient.readContract({
        address: CONTRACTS.RewardsMarketplace as `0x${string}`,
        abi: RewardsMarketplaceABI,
        functionName: 'getUserRedemptions',
        args: [wallet.address, offset, limit],
      });

      // Get details for each redemption
      const redemptions = await Promise.all(
        (redemptionIds as number[]).map(async (id) => {
          return await publicClient.readContract({
            address: CONTRACTS.RewardsMarketplace as `0x${string}`,
            abi: RewardsMarketplaceABI,
            functionName: 'redemptions',
            args: [id],
          });
        })
      );

      return redemptions;
    } catch (error) {
      console.error('Error getting user redemptions:', error);
      return [];
    }
  }, [wallet?.address, publicClient]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    connected: authenticated && !!wallet,
    userAddress: wallet?.address || null,
    
    // Token functions
    getTokenBalance,
    
    // Activity functions
    certifyActivity,
    isActivityCertified,
    
    // Marketplace functions
    getReward,
    purchaseReward,
    getUserRedemptions,
    
    // Contract addresses
    contracts: CONTRACTS,
  };
};

// Example usage in your SupabaseProvider.tsx:
/*
import { useBlockchain } from '@/hooks/useBlockchain';

// In your certifyActivity function:
const { certifyActivity: certifyOnChain, userAddress } = useBlockchain();

const certifyActivity = async (activityId: string): Promise<void> => {
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    console.log(`🏆 Starting certification for activity ${activityId}`);
    
    // Get activity details from database
    const { data: activity, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .eq('user_id', user.id)
      .single();

    if (error || !activity) {
      throw new Error('Activity not found');
    }

    // Certify on blockchain
    const txHash = await certifyOnChain(
      activityId,
      userAddress!,
      activity.co2_saved * 1000, // Convert to grams
      activity.type,
      activity.description
    );

    // Update database with blockchain info
    await supabase
      .from('activities')
      .update({ 
        verified: true,
        blockchain_tx_hash: txHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', activityId);

    // Update user tokens in database (you can fetch from blockchain instead)
    const newMintedTokens = user.tokens_minted + activity.tokens_earned;
    await supabase
      .from('users')
      .update({
        tokens_minted: newMintedTokens,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    console.log(`✅ Activity certified on blockchain! TX: ${txHash}`);
    
  } catch (error) {
    console.error('💥 Error in certifyActivity:', error);
    throw error;
  }
};
*/