import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useGoogleFit } from '@/providers/GoogleFitProvider';
import { 
  Activity, 
  Clock, 
  MapPin, 
  Zap, 
  RefreshCw, 
  Link, 
  Unlink, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Heart
} from 'lucide-react';

const GoogleFitConnect = () => {
  const { 
    isConnected, 
    isLoading, 
    error, 
    lastSync, 
    connectGoogleFit, 
    disconnectGoogleFit, 
    syncActivities,
    activities
  } = useGoogleFit();
  
  const [syncDays, setSyncDays] = useState(7);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async () => {
    const success = await connectGoogleFit();
    if (success) {
      // Automatically sync activities after connection
      await handleSync();
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncActivities(syncDays);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Sei sicuro di voler disconnettere Google Fit? Dovrai ricollegarlo per sincronizzare nuove attività.')) {
      await disconnectGoogleFit();
    }
  };

  const formatActivityType = (type: string) => {
    const types = {
      walking: { label: 'Camminata', icon: '🚶‍♂️', color: 'bg-green-100 text-green-800' },
      cycling: { label: 'Ciclismo', icon: '🚴‍♂️', color: 'bg-blue-100 text-blue-800' },
      running: { label: 'Corsa', icon: '🏃‍♂️', color: 'bg-red-100 text-red-800' },
      other: { label: 'Altro', icon: '🏃‍♂️', color: 'bg-gray-100 text-gray-800' }
    };
    return types[type as keyof typeof types] || types.other;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Google Fit Integration
          </CardTitle>
          <CardDescription>
            Collega Google Fit per sincronizzare automaticamente le tue attività fisiche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div>
                <p className="font-medium">
                  {isConnected ? 'Google Fit Connesso' : 'Google Fit Non Connesso'}
                </p>
                {lastSync && (
                  <p className="text-sm text-gray-500">
                    Ultima sincronizzazione: {new Date(lastSync).toLocaleString('it-IT')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isConnected ? (
                <Button 
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Connessione...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 mr-2" />
                      Connetti Google Fit
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={handleSync}
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Sincronizzazione...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizza
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleDisconnect}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnetti
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Sync Options */}
          {isConnected && (
            <div className="space-y-3">
              <Separator />
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Sincronizza ultimi:</label>
                <div className="flex gap-2">
                  {[3, 7, 14, 30].map((days) => (
                    <Button
                      key={days}
                      variant={syncDays === days ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSyncDays(days)}
                    >
                      {days} giorni
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Cosa viene sincronizzato:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• Camminate e corsette</li>
                  <li>• Sessioni di ciclismo</li>
                  <li>• Distanze e durate accurate</li>
                  <li>• Calcolo automatico CO₂ e token</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities from Google Fit */}
      {isConnected && activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Attività da Google Fit
            </CardTitle>
            <CardDescription>
              Attività sincronizzate di recente dal tuo Google Fit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity, index) => {
                const activityInfo = formatActivityType(activity.type);
                return (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{activityInfo.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={activityInfo.color}>
                              {activityInfo.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Google Fit
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {activity.distance && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {activity.distance.toFixed(2)} km
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.duration} min
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(activity.startTime).toLocaleDateString('it-IT')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-green-600 font-medium">
                          +{Math.floor((activity.distance || 0) * 2)} token
                        </div>
                        <div className="text-gray-500">
                          {((activity.distance || 0) * 0.12).toFixed(2)} kg CO₂
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {activities.length > 5 && (
                <p className="text-center text-sm text-gray-500 pt-2">
                  e altre {activities.length - 5} attività...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Vantaggi della Sincronizzazione
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-yellow-500 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Tracking Automatico</h4>
                <p className="text-sm text-gray-600">
                  Le tue attività vengono registrate automaticamente senza dover inserire manualmente i dati
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Dati Accurati</h4>
                <p className="text-sm text-gray-600">
                  Distanze e durate precise direttamente dal tuo smartphone o dispositivi wearable
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Token Real-time</h4>
                <p className="text-sm text-gray-600">
                  Guadagna token automaticamente per ogni attività sostenibile registrata
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Sempre Aggiornato</h4>
                <p className="text-sm text-gray-600">
                  I tuoi progressi si aggiornano automaticamente ogni volta che fai attività fisica
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleFitConnect;
