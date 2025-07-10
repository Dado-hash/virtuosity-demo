import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { gapi } from 'gapi-script';

const GoogleSignInTest = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const initGapi = async () => {
      try {
        console.log('🔧 Initializing basic Google Sign-in...');
        
        await new Promise<void>((resolve, reject) => {
          gapi.load('auth2', {
            callback: resolve,
            onerror: reject
          });
        });

        console.log('✅ gapi.auth2 loaded');

        const authInstance = await gapi.auth2.init({
          client_id: CLIENT_ID,
          scope: 'profile email' // Basic scopes only
        });

        console.log('✅ Auth instance initialized');

        const isSignedIn = authInstance.isSignedIn.get();
        setIsSignedIn(isSignedIn);
        
        if (isSignedIn) {
          const currentUser = authInstance.currentUser.get();
          const profile = currentUser.getBasicProfile();
          setUser({
            name: profile.getName(),
            email: profile.getEmail(),
            image: profile.getImageUrl()
          });
        }

      } catch (error) {
        console.error('❌ Error initializing Google Sign-in:', error);
        setError(`Initialization error: ${error}`);
      }
    };

    if (CLIENT_ID) {
      initGapi();
    } else {
      setError('Google Client ID missing');
    }
  }, [CLIENT_ID]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Attempting sign-in...');
      const authInstance = gapi.auth2.getAuthInstance();
      const result = await authInstance.signIn();
      
      console.log('✅ Sign-in successful');
      const profile = result.getBasicProfile();
      
      setUser({
        name: profile.getName(),
        email: profile.getEmail(),
        image: profile.getImageUrl()
      });
      setIsSignedIn(true);
      
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      setError(`Sign-in failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setIsSignedIn(false);
      setUser(null);
      console.log('✅ Signed out');
    } catch (error) {
      console.error('❌ Sign-out error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Google Sign-in Test</CardTitle>
          <CardDescription>
            Test basilare Google OAuth (solo profile/email)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
            <p><strong>Debug:</strong></p>
            <p>Client ID: {CLIENT_ID ? '✅ Set' : '❌ Missing'}</p>
            <p>GAPI: {typeof window !== 'undefined' && window.gapi ? '✅' : '❌'}</p>
            <p>Auth2: {typeof window !== 'undefined' && window.gapi?.auth2 ? '✅' : '❌'}</p>
          </div>

          {!isSignedIn ? (
            <Button 
              onClick={handleSignIn}
              disabled={loading || !CLIENT_ID}
              className="w-full"
            >
              {loading ? 'Signing in...' : '🔐 Sign in with Google'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">✅ Signed in as:</h3>
                {user && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.image} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <p><strong>💡 Questo test usa solo:</strong></p>
            <ul className="list-disc list-inside text-blue-700">
              <li>Google Sign-in di base</li>
              <li>Scopes: profile, email</li>
              <li>NO Fitness API</li>
              <li>NO Client Secret</li>
            </ul>
            <p className="mt-2 text-blue-600">
              Se questo funziona, il problema è nella Fitness API setup.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleSignInTest;
