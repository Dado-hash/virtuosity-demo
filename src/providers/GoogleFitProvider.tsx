import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSupabase } from './SupabaseProvider';
import { Database } from '@/lib/supabase';

// Google Fit Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest';
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.location.read'
].join(' ');

// Load Google Identity Services script
const loadGoogleIdentityScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
};

// Load GAPI script
const loadGapiScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.gapi) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load GAPI'));
    document.head.appendChild(script);
  });
};

interface GoogleFitActivity {
  type: string;
  startTime: string;
  endTime: string;
  distance?: number;
  duration: number;
  calories?: number;
  sessionId: string;
}

interface GoogleFitContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  connectGoogleFit: () => Promise<boolean>;
  disconnectGoogleFit: () => Promise<void>;
  syncActivities: (days?: number) => Promise<void>;
  activities: GoogleFitActivity[];
  accessToken: string | null;
}

const GoogleFitContext = createContext<GoogleFitContextType | undefined>(undefined);

export const GoogleFitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addActivity, createOrUpdateUser, checkGoogleFitActivityExists } = useSupabase();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<GoogleFitActivity[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenClient, setTokenClient] = useState<any>(null);

  // Initialize Google APIs
  useEffect(() => {
    const initializeApis = async () => {
      console.log('🔧 Initializing Google APIs with new GIS library...');
      console.log('📋 Environment check:');
      console.log('   - Client ID:', GOOGLE_CLIENT_ID ? 'Set ✅' : 'Missing ❌');
      console.log('   - API Key:', GOOGLE_API_KEY ? 'Set ✅' : 'Missing ❌');
      
      if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
        setError('Google API credentials missing in environment');
        return;
      }
      
      try {
        // Load Google Identity Services
        console.log('📡 Loading Google Identity Services...');
        await loadGoogleIdentityScript();
        console.log('✅ Google Identity Services loaded');

        // Load GAPI for Fitness API calls
        console.log('📡 Loading GAPI...');
        await loadGapiScript();
        console.log('✅ GAPI loaded');

        // Initialize GAPI client
        console.log('🔑 Initializing GAPI client...');
        await new Promise<void>((resolve, reject) => {
          window.gapi.load('client', {
            callback: resolve,
            onerror: reject
          });
        });

        await window.gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          discoveryDocs: [DISCOVERY_DOC]
        });
        console.log('✅ GAPI client initialized');

        // Initialize OAuth2 token client (NEW WAY)
        console.log('🔑 Initializing OAuth2 token client...');
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          callback: async (response: any) => {
            console.log('✅ OAuth2 callback received:', response);
            if (response.access_token) {
              setAccessToken(response.access_token);
              setIsConnected(true);
              setError(null);
              console.log('✅ Access token received and stored');
              
              // Update user in database
              try {
                await createOrUpdateUser();
                console.log('✅ User updated in database');
              } catch (error) {
                console.error('❌ Error updating user in database:', error);
              }
            } else if (response.error) {
              console.error('❌ OAuth2 error:', response.error);
              setError(`OAuth error: ${response.error}`);
            }
            setIsLoading(false);
          },
        });
        setTokenClient(client);
        console.log('✅ OAuth2 token client initialized');
        
        console.log('✅ Google APIs initialization complete');
      } catch (error) {
        console.error('❌ Error initializing Google APIs:', error);
        setError(`Errore nell'inizializzazione Google Fit: ${error}`);
      }
    };

    if (GOOGLE_CLIENT_ID && GOOGLE_API_KEY) {
      console.log('🚀 Starting Google APIs initialization...');
      initializeApis();
    } else {
      console.error('❌ Google API credentials missing');
      setError('Credenziali Google API mancanti');
    }
  }, [user]);

  // Connect to Google Fit using new OAuth2 system
  const connectGoogleFit = async (): Promise<boolean> => {
    console.log('🔗 Attempting to connect Google Fit using new OAuth2...');
    setIsLoading(true);
    setError(null);

    try {
      if (!tokenClient) {
        throw new Error('OAuth2 token client not initialized');
      }
      
      console.log('📝 Requesting OAuth2 token...');
      // Request access token using new OAuth2 flow
      tokenClient.requestAccessToken({
        prompt: 'consent' // Always show consent screen to ensure fresh permissions
      });
      
      // The callback function set in tokenClient initialization will handle the response
      // We return true here as the actual connection status will be set in the callback
      return true;
      
    } catch (error) {
      console.error('❌ Error connecting to Google Fit:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setError(`Errore nella connessione a Google Fit: ${error.message}`);
      setIsLoading(false);
      return false;
    }
  };

  // Disconnect Google Fit using new OAuth2 system
  const disconnectGoogleFit = async (): Promise<void> => {
    try {
      // Revoke the access token if available
      if (accessToken) {
        console.log('🔓 Revoking access token...');
        window.google.accounts.oauth2.revoke(accessToken, () => {
          console.log('✅ Access token revoked');
        });
      }
      
      // Clear local state
      setAccessToken(null);
      setIsConnected(false);
      setActivities([]);
      setError(null);
      
      // Here you would update the user in database to disconnect Google Fit
      
      console.log('✅ Google Fit disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting Google Fit:', error);
      setError('Errore nella disconnessione da Google Fit');
    }
  };

  // Convert Google Fit activity type to our activity type
  const mapGoogleFitActivityType = (activityType: number): string => {
    // Google Fit activity type constants
    const activityMap: { [key: number]: string } = {
      7: 'walking', // Walking
      1: 'cycling', // Biking  
      8: 'running', // Running (fallback to walking if DB not updated)
      72: 'walking', // Walking (alternative)
      // Add more mappings as needed
    };
    
    const mappedType = activityMap[activityType] || 'other';
    console.log(`🏃 Mapping activity type ${activityType} to ${mappedType}`);
    
    // Fallback: if running is not supported in DB yet, use walking
    // TODO: Remove this after database is updated with running type
    if (mappedType === 'running') {
      console.log('⚠️ Running mapped to walking (DB compatibility)');
      return 'walking'; // Temporary fallback
    }
    
    return mappedType;
  };

  // Calculate CO2 and tokens from Google Fit data
  const calculateRewardsFromActivity = (activity: GoogleFitActivity) => {
    const distance = activity.distance || 0; // km
    const duration = activity.duration; // minutes
    
    // CO2 savings calculation (kg)
    let co2Saved = 0;
    let tokensEarned = 0;
    
    if (activity.type === 'walking') {
      co2Saved = distance * 0.12; // 0.12 kg CO2 per km vs car
      tokensEarned = Math.max(1, Math.floor(distance * 2)); // Minimum 1 token, 2 tokens per km
      
      // If no distance but has duration, give minimum tokens
      if (distance === 0 && duration >= 10) {
        tokensEarned = Math.floor(duration / 10); // 1 token per 10 minutes
        co2Saved = (duration / 60) * 0.48; // Estimate: 4 km/h * 0.12 kg/km
      }
    } else if (activity.type === 'cycling') {
      co2Saved = distance * 0.12;
      tokensEarned = Math.max(1, Math.floor(distance * 3)); // Minimum 1 token, 3 tokens per km
      
      // If no distance but has duration, give minimum tokens
      if (distance === 0 && duration >= 10) {
        tokensEarned = Math.floor(duration / 5); // 1 token per 5 minutes
        co2Saved = (duration / 60) * 1.8; // Estimate: 15 km/h * 0.12 kg/km
      }
    } else if (activity.type === 'running') {
      co2Saved = distance * 0.12;
      tokensEarned = Math.max(1, Math.floor(distance * 2.5)); // Minimum 1 token, 2.5 tokens per km
      
      // If no distance but has duration, give minimum tokens
      if (distance === 0 && duration >= 10) {
        tokensEarned = Math.floor(duration / 8); // 1 token per 8 minutes
        co2Saved = (duration / 60) * 0.96; // Estimate: 8 km/h * 0.12 kg/km
      }
    }
    
    return { co2Saved: Math.round(co2Saved * 100) / 100, tokensEarned };
  };

  // Sync activities from Google Fit
  const syncActivities = async (days: number = 7): Promise<void> => {
    if (!isConnected || !user || !accessToken) {
      setError('Google Fit non è connesso o token mancante');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Set the access token for gapi client
      window.gapi.client.setToken({
        access_token: accessToken
      });
      
      const endTime = new Date();
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - days);

      // Convert to nanoseconds (Google Fit uses nanoseconds)
      const startTimeISO = startTime.toISOString();
      const endTimeISO = endTime.toISOString();

      console.log('📊 Fetching Google Fit sessions...');
      console.log('Time range:', {
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        startNanos: startTimeISO,
        endNanos: endTimeISO
      });

      // Get fitness sessions from Google Fit
      const response = await window.gapi.client.request({
        path: 'https://www.googleapis.com/fitness/v1/users/me/sessions',
        params: {
          startTime: startTimeISO,
          endTime: endTimeISO
        }
      });

      const sessions = response.result.session || [];
      console.log(`📊 Found ${sessions.length} sessions from Google Fit`);
      
      const newActivities: GoogleFitActivity[] = [];
      let activitiesSynced = 0;

      for (const session of sessions) {
        console.log('🗓️ Processing session:', session);
        
        const activityType = mapGoogleFitActivityType(session.activityType);
        
        // Skip if not a supported activity type
        if (activityType === 'other') {
          console.log('❌ Skipping unsupported activity type:', session.activityType);
          continue;
        }

        const startTime = new Date(parseInt(session.startTimeMillis));
        const endTime = new Date(parseInt(session.endTimeMillis));
        const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000); // minutes

        console.log(`🕰️ Activity: ${activityType}, Duration: ${duration} min`);

        // Try to get distance data using multiple methods
        let distance = 0;
        
        try {
          // Method 1: Try to get distance from session aggregate data
          console.log('📏 Attempting to fetch distance data...');
          
          const distanceResponse = await window.gapi.client.request({
            path: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
            method: 'POST',
            body: {
              aggregateBy: [{
                dataTypeName: 'com.google.distance.delta',
                dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta'
              }],
              bucketByTime: { 
                durationMillis: endTime.getTime() - startTime.getTime() 
              },
              startTimeMillis: session.startTimeMillis,
              endTimeMillis: session.endTimeMillis
            }
          });

          console.log('📊 Distance response:', distanceResponse.result);
          
          if (distanceResponse.result.bucket && distanceResponse.result.bucket.length > 0) {
            const bucket = distanceResponse.result.bucket[0];
            if (bucket.dataset && bucket.dataset.length > 0) {
              const dataset = bucket.dataset[0];
              if (dataset.point && dataset.point.length > 0) {
                const point = dataset.point[0];
                if (point.value && point.value.length > 0) {
                  const distanceMeters = point.value[0].fpVal || 0;
                  distance = distanceMeters / 1000; // Convert meters to km
                  console.log(`✅ Distance found: ${distance} km`);
                }
              }
            }
          }
          
          // Method 2: Try alternative distance source if no distance found
          if (distance === 0) {
            console.log('🔄 Trying alternative distance source...');
            const altDistanceResponse = await window.gapi.client.request({
              path: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
              method: 'POST',
              body: {
                aggregateBy: [{
                  dataTypeName: 'com.google.distance.delta'
                }],
                bucketByTime: { 
                  durationMillis: endTime.getTime() - startTime.getTime() 
                },
                startTimeMillis: session.startTimeMillis,
                endTimeMillis: session.endTimeMillis
              }
            });
            
            if (altDistanceResponse.result.bucket && altDistanceResponse.result.bucket.length > 0) {
              const bucket = altDistanceResponse.result.bucket[0];
              if (bucket.dataset && bucket.dataset.length > 0) {
                const dataset = bucket.dataset[0];
                if (dataset.point && dataset.point.length > 0) {
                  const point = dataset.point[0];
                  if (point.value && point.value.length > 0) {
                    const distanceMeters = point.value[0].fpVal || 0;
                    distance = distanceMeters / 1000;
                    console.log(`✅ Alternative distance found: ${distance} km`);
                  }
                }
              }
            }
          }
          
          // Method 3: Estimate distance from duration for walking (fallback)
          if (distance === 0 && activityType === 'walking' && duration > 0) {
            // Average walking speed: 5 km/h
            distance = (duration / 60) * 5;
            console.log(`📏 Estimated distance from duration: ${distance} km`);
          }
          
        } catch (error) {
          console.warn('⚠️ Could not fetch distance for session:', session.id, error);
          
          // Fallback: estimate distance from duration if it's a walking activity
          if (activityType === 'walking' && duration > 0) {
            distance = (duration / 60) * 4; // Conservative estimate: 4 km/h
            console.log(`📏 Fallback distance estimate: ${distance} km`);
          }
        }

        const googleFitActivity: GoogleFitActivity = {
          type: activityType,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          distance,
          duration,
          sessionId: session.id
        };

        newActivities.push(googleFitActivity);

        // Add to database if it's a valid activity
        if (distance > 0 || duration > 10) { // Only sync activities with some distance or duration
          // 🔍 Check if activity already exists to prevent duplicates
          const activityExists = await checkGoogleFitActivityExists(session.id);
          
          if (activityExists) {
            console.log(`⏭️ Skipping duplicate activity: session ${session.id}`);
            continue; // Skip this activity as it already exists
          }
          
          const { co2Saved, tokensEarned } = calculateRewardsFromActivity(googleFitActivity);
          
          console.log(`💰 Calculated rewards:`, { distance, co2Saved, tokensEarned });
          
          try {
            await addActivity({
              type: activityType as any,
              source: 'google_fit',
              description: `${activityType} sincronizzata da Google Fit (${distance.toFixed(2)} km)`,
              co2_saved: co2Saved,
              tokens_earned: tokensEarned,
              distance,
              duration,
              verified: false, // 🔴 Activities start as unverified for individual certification
              google_fit_session_id: session.id,
              sync_timestamp: new Date().toISOString()
            });
            
            activitiesSynced++;
            console.log(`✅ New activity saved to database`);
          } catch (error) {
            console.error('❌ Error adding Google Fit activity to database:', error);
          }
        } else {
          console.log(`❌ Skipping activity: distance=${distance}, duration=${duration}`);
        }
      }

      setActivities(newActivities);
      
      console.log(`✅ Sincronizzate ${activitiesSynced} attività da Google Fit`);
      
    } catch (error) {
      console.error('❌ Error syncing Google Fit activities:', error);
      setError('Errore nella sincronizzazione delle attività');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isConnected,
    isLoading,
    error,
    lastSync: user?.last_google_fit_sync || null,
    connectGoogleFit,
    disconnectGoogleFit,
    syncActivities,
    activities,
    accessToken
  };

  return (
    <GoogleFitContext.Provider value={value}>
      {children}
    </GoogleFitContext.Provider>
  );
};

export const useGoogleFit = () => {
  const context = useContext(GoogleFitContext);
  if (context === undefined) {
    throw new Error('useGoogleFit must be used within a GoogleFitProvider');
  }
  return context;
};
