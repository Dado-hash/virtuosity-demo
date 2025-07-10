import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          privy_id: string
          wallet_address?: string
          email?: string
          phone?: string
          name?: string
          avatar_url?: string
          tokens_pending: number
          tokens_minted: number
          last_mint_tx?: string
          total_co2_saved: number
          total_activities: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          privy_id: string
          wallet_address?: string
          email?: string
          phone?: string
          name?: string
          avatar_url?: string
          tokens_pending?: number
          tokens_minted?: number
          last_mint_tx?: string
          total_co2_saved?: number
          total_activities?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          privy_id?: string
          wallet_address?: string
          email?: string
          phone?: string
          name?: string
          avatar_url?: string
          tokens_pending?: number
          tokens_minted?: number
          last_mint_tx?: string
          total_co2_saved?: number
          total_activities?: number
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          type: 'walking' | 'cycling' | 'public_transport' | 'waste_recycling' | 'other'
          description: string
          co2_saved: number
          tokens_earned: number
          distance?: number
          duration?: number
          verified: boolean
          verification_data?: any
          certificate_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'walking' | 'cycling' | 'public_transport' | 'waste_recycling' | 'other'
          description: string
          co2_saved: number
          tokens_earned: number
          distance?: number
          duration?: number
          verified?: boolean
          verification_data?: any
          certificate_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'walking' | 'cycling' | 'public_transport' | 'waste_recycling' | 'other'
          description?: string
          co2_saved?: number
          tokens_earned?: number
          distance?: number
          duration?: number
          verified?: boolean
          verification_data?: any
          certificate_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          activity_id: string
          certificate_hash: string
          ipfs_url: string
          nft_token_id?: string
          blockchain_tx?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_id: string
          certificate_hash: string
          ipfs_url: string
          nft_token_id?: string
          blockchain_tx?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_id?: string
          certificate_hash?: string
          ipfs_url?: string
          nft_token_id?: string
          blockchain_tx?: string
          created_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          token_cost: number
          category: string
          available_quantity: number
          total_redeemed: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          token_cost: number
          category: string
          available_quantity: number
          total_redeemed?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          token_cost?: number
          category?: string
          available_quantity?: number
          total_redeemed?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blockchain_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'token_mint' | 'certificate_mint' | 'reward_redeem'
          amount?: number
          token_ids?: string[]
          tx_hash?: string
          contract_address?: string
          status: 'pending' | 'confirmed' | 'failed'
          error_message?: string
          gas_used?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'token_mint' | 'certificate_mint' | 'reward_redeem'
          amount?: number
          token_ids?: string[]
          tx_hash?: string
          contract_address?: string
          status?: 'pending' | 'confirmed' | 'failed'
          error_message?: string
          gas_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'token_mint' | 'certificate_mint' | 'reward_redeem'
          amount?: number
          token_ids?: string[]
          tx_hash?: string
          contract_address?: string
          status?: 'pending' | 'confirmed' | 'failed'
          error_message?: string
          gas_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      reward_redemptions: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          tokens_spent: number
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          redemption_code?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          tokens_spent: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          redemption_code?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          tokens_spent?: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          redemption_code?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
