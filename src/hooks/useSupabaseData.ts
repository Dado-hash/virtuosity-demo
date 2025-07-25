import { useSupabase } from '@/providers/SupabaseProvider';
import { useState, useEffect } from 'react';
import { Database } from '@/lib/supabase';

type Activity = Database['public']['Tables']['activities']['Row'];
type Reward = Database['public']['Tables']['rewards']['Row'];

export const useActivities = () => {
  const { getUserActivities, user } = useSupabase();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!user) {
      console.log('useActivities: No user available');
      setActivities([]);
      setLoading(false);
      return;
    }
    
    console.log('useActivities: Fetching activities for user', user.id);
    setLoading(true);
    try {
      const data = await getUserActivities();
      console.log('useActivities: Fetched activities:', data);
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [user]); // Aggiunta dipendenza user

  return { activities, loading, refetch: fetchActivities };
};

export const useRewards = () => {
  const { getRewards, user } = useSupabase();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const data = await getRewards();
      setRewards(data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      setRewards([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchRewards();
    }
  }, [user]); // Aggiunta dipendenza user

  return { rewards, loading, refetch: fetchRewards };
};

// CO2 Calculation Utilities
export const calculateCO2Savings = {
  walking: (distance: number) => distance * 0.12, // kg CO2 saved per km vs car
  cycling: (distance: number) => distance * 0.12, // kg CO2 saved per km vs car
  publicTransport: (distance: number) => distance * 0.08, // kg CO2 saved per km vs car
  wasteRecycling: (weight: number) => weight * 0.5 // kg CO2 saved per kg recycled
};

// Token Calculation Utilities
// Updated to match smart contract formula: 1 token = 1000 grams CO2
export const calculateTokenReward = {
  walking: (distance: number) => {
    const co2SavedKg = calculateCO2Savings.walking(distance);
    const co2SavedGrams = co2SavedKg * 1000;
    const tokens = Math.floor(co2SavedGrams / 1000);
    return tokens > 0 ? tokens : 1; // Minimum 1 token
  },
  cycling: (distance: number) => {
    const co2SavedKg = calculateCO2Savings.cycling(distance);
    const co2SavedGrams = co2SavedKg * 1000;
    const tokens = Math.floor(co2SavedGrams / 1000);
    return tokens > 0 ? tokens : 1; // Minimum 1 token
  },
  publicTransport: (distance: number) => {
    const co2SavedKg = calculateCO2Savings.publicTransport(distance);
    const co2SavedGrams = co2SavedKg * 1000;
    const tokens = Math.floor(co2SavedGrams / 1000);
    return tokens > 0 ? tokens : 1; // Minimum 1 token
  },
  wasteRecycling: (weight: number) => {
    const co2SavedKg = calculateCO2Savings.wasteRecycling(weight);
    const co2SavedGrams = co2SavedKg * 1000;
    const tokens = Math.floor(co2SavedGrams / 1000);
    return tokens > 0 ? tokens : 1; // Minimum 1 token
  }
};

// Activity type mappings
export const activityTypes = {
  walking: {
    label: 'Camminata',
    icon: '🚶‍♂️',
    color: 'green'
  },
  cycling: {
    label: 'Ciclismo', 
    icon: '🚴‍♂️',
    color: 'blue'
  },
  other: {
    label: 'Altro',
    icon: '🌱',
    color: 'gray'
  }
};

// Activity source mappings
export const activitySources = {
  manual: {
    label: 'Manuale',
    icon: '✋',
    color: 'blue'
  },
  google_fit: {
    label: 'Google Fit',
    icon: '💚',
    color: 'green'
  },
  apple_health: {
    label: 'Apple Health',
    icon: '🍎',
    color: 'red'
  }
};

// Helper functions
export const isAutomaticActivity = (activity: Activity): boolean => {
  return activity.source === 'google_fit' || activity.source === 'apple_health';
};

export const getActivitySourceInfo = (source?: string) => {
  if (!source || source === 'manual') return activitySources.manual;
  return activitySources[source as keyof typeof activitySources] || activitySources.manual;
};
