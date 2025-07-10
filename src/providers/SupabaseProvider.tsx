import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase, Database } from '@/lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
  createOrUpdateUser: () => Promise<void>;
  updateUserTokens: (pendingTokens: number, mintedTokens?: number) => Promise<void>;
  getBlockchainTransactions: () => Promise<Database['public']['Tables']['blockchain_transactions']['Row'][]>;
  createBlockchainTransaction: (transaction: Omit<Database['public']['Tables']['blockchain_transactions']['Insert'], 'user_id'>) => Promise<void>;
  addActivity: (activity: Omit<Database['public']['Tables']['activities']['Insert'], 'user_id'>) => Promise<void>;
  getUserActivities: () => Promise<Database['public']['Tables']['activities']['Row'][]>;
  getRewards: () => Promise<Database['public']['Tables']['rewards']['Row'][]>;
  redeemReward: (rewardId: string, tokenCost: number) => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: privyUser, ready } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create or update user in Supabase when Privy user changes
  const createOrUpdateUser = async () => {
    if (!privyUser) return;

    try {
      const userData = {
        privy_id: privyUser.id,
        wallet_address: privyUser.wallet?.address,
        email: privyUser.email?.address,
        phone: privyUser.phone?.number,
        name: privyUser.email?.address?.split('@')[0] || 'User',
      };

      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('privy_id', privyUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('users')
          .update({
            ...userData,
            updated_at: new Date().toISOString()
          })
          .eq('privy_id', privyUser.id)
          .select()
          .single();

        if (error) throw error;
        setUser(data);
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('users')
          .insert({
            ...userData,
            tokens_pending: 0,
            tokens_minted: 0,
            total_co2_saved: 0,
            total_activities: 0
          })
          .select()
          .single();

        if (error) throw error;
        setUser(data);
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
  };

  // Update user tokens
  const updateUserTokens = async (pendingTokens: number, mintedTokens?: number) => {
    if (!user) return;

    try {
      const updateData: any = {
        tokens_pending: pendingTokens,
        updated_at: new Date().toISOString()
      };

      if (mintedTokens !== undefined) {
        updateData.tokens_minted = mintedTokens;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error updating user tokens:', error);
    }
  };

  // Add activity
  const addActivity = async (activity: Omit<Database['public']['Tables']['activities']['Insert'], 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update user stats
      const newPendingTokens = user.tokens_pending + activity.tokens_earned;
      const newCO2Saved = user.total_co2_saved + activity.co2_saved;
      const newActivityCount = user.total_activities + 1;

      await supabase
        .from('users')
        .update({
          tokens_pending: newPendingTokens,
          total_co2_saved: newCO2Saved,
          total_activities: newActivityCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        tokens_pending: newPendingTokens,
        total_co2_saved: newCO2Saved,
        total_activities: newActivityCount
      } : null);

    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  // Get user activities
  const getUserActivities = async (): Promise<Database['public']['Tables']['activities']['Row'][]> => {
    if (!user) {
      console.log('getUserActivities: No user available');
      return [];
    }

    try {
      console.log('getUserActivities: Querying activities for user', user.id);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('getUserActivities: Supabase error:', error);
        throw error;
      }
      
      console.log('getUserActivities: Retrieved data:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  };

  // Get rewards
  const getRewards = async (): Promise<Database['public']['Tables']['rewards']['Row'][]> => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('token_cost', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return [];
    }
  };

  // Get blockchain transactions
  const getBlockchainTransactions = async (): Promise<Database['public']['Tables']['blockchain_transactions']['Row'][]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blockchain transactions:', error);
      return [];
    }
  };

  // Create blockchain transaction
  const createBlockchainTransaction = async (transaction: Omit<Database['public']['Tables']['blockchain_transactions']['Insert'], 'user_id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('blockchain_transactions')
        .insert({
          ...transaction,
          user_id: user.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating blockchain transaction:', error);
    }
  };

  // Redeem reward
  const redeemReward = async (rewardId: string, tokenCost: number) => {
    if (!user || user.tokens_pending < tokenCost) return;

    try {
      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          tokens_spent: tokenCost,
          status: 'pending',
          redemption_code: `VRT-${Date.now()}`
        });

      if (redemptionError) throw redemptionError;

      // Update user tokens
      await updateUserTokens(user.tokens_pending - tokenCost);

      // Update reward redeemed count
      await supabase
        .from('rewards')
        .update({ 
          total_redeemed: supabase.sql`total_redeemed + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('id', rewardId);

    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  useEffect(() => {
    if (ready) {
      if (privyUser) {
        createOrUpdateUser();
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [privyUser, ready]);

  const value = {
    user,
    loading,
    createOrUpdateUser,
    updateUserTokens,
    addActivity,
    getUserActivities,
    getRewards,
    redeemReward,
    getBlockchainTransactions,
    createBlockchainTransaction
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
