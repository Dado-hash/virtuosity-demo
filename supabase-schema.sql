-- Virtuosity Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    privy_id TEXT UNIQUE NOT NULL,
    wallet_address TEXT,
    email TEXT,
    phone TEXT,
    name TEXT,
    avatar_url TEXT,
    tokens_pending INTEGER DEFAULT 0 NOT NULL,
    tokens_minted INTEGER DEFAULT 0 NOT NULL,
    last_mint_tx TEXT,
    total_co2_saved DECIMAL(10,2) DEFAULT 0 NOT NULL,
    total_activities INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activities table
CREATE TABLE public.activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('walking', 'cycling', 'public_transport', 'waste_recycling', 'other')) NOT NULL,
    description TEXT NOT NULL,
    co2_saved DECIMAL(10,2) NOT NULL,
    tokens_earned INTEGER NOT NULL,
    distance DECIMAL(10,2), -- in kilometers
    duration INTEGER, -- in minutes
    verified BOOLEAN DEFAULT false NOT NULL,
    verification_data JSONB,
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Certificates table
CREATE TABLE public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
    certificate_hash TEXT NOT NULL,
    ipfs_url TEXT NOT NULL,
    nft_token_id TEXT,
    blockchain_tx TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Rewards table
CREATE TABLE public.rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    token_cost INTEGER NOT NULL,
    category TEXT NOT NULL,
    available_quantity INTEGER NOT NULL,
    total_redeemed INTEGER DEFAULT 0 NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blockchain transactions table
CREATE TABLE public.blockchain_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('token_mint', 'certificate_mint', 'reward_redeem')) NOT NULL,
    amount INTEGER,
    token_ids TEXT[], -- For NFT certificate IDs
    tx_hash TEXT,
    contract_address TEXT,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'failed')) DEFAULT 'pending' NOT NULL,
    error_message TEXT,
    gas_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reward redemptions table
CREATE TABLE public.reward_redemptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
    tokens_spent INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')) DEFAULT 'pending' NOT NULL,
    redemption_code TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_users_privy_id ON public.users(privy_id);
CREATE INDEX idx_users_wallet_address ON public.users(wallet_address);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_type ON public.activities(type);
CREATE INDEX idx_activities_created_at ON public.activities(created_at);
CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_certificates_activity_id ON public.certificates(activity_id);
CREATE INDEX idx_reward_redemptions_user_id ON public.reward_redemptions(user_id);
CREATE INDEX idx_reward_redemptions_status ON public.reward_redemptions(status);
CREATE INDEX idx_blockchain_transactions_user_id ON public.blockchain_transactions(user_id);
CREATE INDEX idx_blockchain_transactions_type ON public.blockchain_transactions(type);
CREATE INDEX idx_blockchain_transactions_status ON public.blockchain_transactions(status);
CREATE INDEX idx_blockchain_transactions_tx_hash ON public.blockchain_transactions(tx_hash);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (true); -- We'll handle auth in the app layer

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (true);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (true);

-- Activities policies
CREATE POLICY "Users can view own activities" ON public.activities
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own activities" ON public.activities
    FOR INSERT WITH CHECK (true);

-- Certificates policies
CREATE POLICY "Users can view own certificates" ON public.certificates
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own certificates" ON public.certificates
    FOR INSERT WITH CHECK (true);

-- Rewards are public (read-only for users)
CREATE POLICY "Anyone can view active rewards" ON public.rewards
    FOR SELECT USING (active = true);

-- Reward redemptions
CREATE POLICY "Users can view own redemptions" ON public.reward_redemptions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own redemptions" ON public.reward_redemptions
    FOR INSERT WITH CHECK (true);

-- Blockchain transactions policies
CREATE POLICY "Users can view own transactions" ON public.blockchain_transactions
    FOR SELECT USING (true);

CREATE POLICY "System can insert transactions" ON public.blockchain_transactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update transactions" ON public.blockchain_transactions
    FOR UPDATE USING (true);

-- Insert some sample rewards
INSERT INTO public.rewards (title, description, image_url, token_cost, category, available_quantity) VALUES
('Buono Amazon €5', 'Buono sconto Amazon del valore di €5', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400', 50, 'shopping', 100),
('Biglietto Cinema', 'Biglietto per film al cinema', 'https://images.unsplash.com/photo-1489185078817-4dacbf89b90e?w=400', 75, 'entertainment', 50),
('Buono Carburante €10', 'Buono carburante del valore di €10', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 100, 'transport', 25),
('Corso Online Sostenibilità', 'Accesso a corso online sulla sostenibilità', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400', 150, 'education', 30),
('Pianta per Casa', 'Pianta verde per la tua casa', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 30, 'environment', 200),
('Abbonamento Bike Sharing', 'Abbonamento mensile bike sharing', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 120, 'transport', 15);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON public.rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reward_redemptions_updated_at BEFORE UPDATE ON public.reward_redemptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blockchain_transactions_updated_at BEFORE UPDATE ON public.blockchain_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
