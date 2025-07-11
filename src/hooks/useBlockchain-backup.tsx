// src/hooks/useBlockchain-fixed.tsx
import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets } from '@privy-io/react-auth';
import { createPublicClient, createWalletClient, custom, formatEther, parseEther, http } from 'viem';
import { polygonAmoy } from 'viem/chains';

// Import contract ABIs
import { VirtuosityTokenABI } from '../contracts/VirtuosityTokenABI';
import { ActivityCertificationABI } from '../contracts/ActivityCertificationABI';
import { RewardsMarketplaceABI } from '../contracts/RewardsMarketplaceABI';
import { formatTokenBalance } from '@/utils/tokenUtils';

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
    transport: http('https://rpc-amoy.polygon.technology'),
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

      // Use our utility to format the balance correctly
      return formatTokenBalance(balance as bigint);
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
      
      // IMPORTANT FIX: Convert parameters to proper types for the smart contract
      // Ensure all strings are properly trimmed and not empty
      const cleanActivityId = activityId.trim();
      const cleanActivityType = activityType.trim();
      const cleanDescription = description.trim();
      
      // Convert co2SavedGrams to BigInt for proper uint256 handling
      const co2SavedGrams = Math.floor(co2SavedGrams);
      
      // Additional validation
      if (!cleanActivityId || cleanActivityId.length === 0) {
        throw new Error('Activity ID cannot be empty');
      }
      if (!cleanActivityType || cleanActivityType.length === 0) {
        throw new Error('Activity type cannot be empty');
      }
      if (!cleanDescription || cleanDescription.length === 0) {
        throw new Error('Description cannot be empty');
      }
      if (co2SavedGrams <= 0n) {
        throw new Error('CO2 saved must be greater than 0');
      }
      
      console.log('📝 Smart contract call parameters:', {
        activityId: cleanActivityId,
        co2SavedGrams: co2SavedGrams,
        activityType: cleanActivityType,
        description: cleanDescription,
        contractAddress: CONTRACTS.ActivityCertification
      });
      
      // Call the smart contract with properly typed parameters
      const txHash = await walletClient.writeContract({
        address: CONTRACTS.ActivityCertification as `0x${string}`,
        abi: ActivityCertificationABI,
        functionName: 'certifyActivity',
        args: [
          cleanActivityId,
          co2SavedGrams,
          cleanActivityType,
          cleanDescription
        ],
      });

      console.log('🎯 Transaction submitted:', txHash);

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: txHash,
        confirmations: 2 // Wait for 2 confirmations for better reliability
      });
      
      console.log('✅ Transaction confirmed:', receipt);
      
      return txHash;
    } catch (error: any) {
      console.error('❌ Error certifying activity:', error);
      
      // Better error handling
      let errorMessage = 'Failed to certify activity';
      
      if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees';
      } else if (error.message?.includes('Activity already certified')) {
        errorMessage = 'This activity has already been certified';
      } else if (error.shortMessage) {
        errorMessage = error.shortMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setState(prev => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
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
        args: [activityId.trim()], // Ensure trimmed here too
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
        args: [BigInt(rewardId)], // Convert to BigInt
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
        args: [CONTRACTS.RewardsMarketplace as `0x${string}`, parseEther(tokenCost)],
      });

      // Wait for approval confirmation
      await publicClient.waitForTransactionReceipt({ hash: approveTxHash });

      // Then purchase the reward
      const purchaseTxHash = await walletClient.writeContract({
        address: CONTRACTS.RewardsMarketplace as `0x${string}`,
        abi: RewardsMarketplaceABI,
        functionName: 'purchaseReward',
        args: [BigInt(rewardId)], // Convert to BigInt
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
        args: [wallet.address, BigInt(offset), BigInt(limit)], // Convert to BigInt
      });

      // Get details for each redemption
      const redemptions = await Promise.all(
        (redemptionIds as bigint[]).map(async (id) => {
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
