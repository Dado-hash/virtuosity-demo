
import React from 'react';
import { VirtuosityAuth } from '@/components/VirtuosityAuth';
import { useVirtuosityAuth } from '@/hooks/useVirtuosityAuth';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AuthTest = () => {
  console.log('🎯 AuthTest component rendering');
  
  const navigate = useNavigate();
  const { user } = useVirtuosityAuth();

  console.log('📋 AuthTest - user:', user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alla Home
          </Button>
          <h1 className="text-3xl font-bold text-center mb-2">Test Autenticazione Privy</h1>
          <p className="text-gray-600 text-center">
            Questa è una pagina di test per verificare l'integrazione Privy
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">🔍 Debug Info:</h3>
            <p className="text-sm text-yellow-700">Loading: {user.isLoading ? 'Sì' : 'No'}</p>
            <p className="text-sm text-yellow-700">Authenticated: {user.isAuthenticated ? 'Sì' : 'No'}</p>
            <p className="text-sm text-yellow-700">User ID: {user.id || 'None'}</p>
          </div>
          
          <VirtuosityAuth />
          
          {user.isAuthenticated && (
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Stato Autenticazione</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h3 className="font-semibold text-blue-800">User ID</h3>
                  <p className="text-blue-600 text-sm">{user.id}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <h3 className="font-semibold text-green-800">Email</h3>
                  <p className="text-green-600 text-sm">{user.email || 'Non disponibile'}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <h3 className="font-semibold text-purple-800">Wallet Address</h3>
                  <p className="text-purple-600 text-sm font-mono">{user.walletAddress || 'Caricamento...'}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded">
                  <h3 className="font-semibold text-yellow-800">Status</h3>
                  <p className="text-yellow-600 text-sm">✅ Autenticato e Connesso</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
