import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from '@/providers/SupabaseProvider';
import { useActivities, activityTypes, getActivitySourceInfo } from '@/hooks/useSupabaseData';
import { useActivityCertification } from '@/hooks/useActivityCertification';
import { 
  Activity, 
  Clock, 
  MapPin, 
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Shield,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Wallet,
  ArrowRight,
  TestTube
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Database } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import TestNavigation from './TestNavigation';

type ActivityRow = Database['public']['Tables']['activities']['Row'];

const ActivityList = () => {
  const { activities, loading, refetch } = useActivities();
  const { user } = useSupabase();
  const { toast } = useToast();
  const { certifyActivityBlockchain, certifyingId, isConnected, userAddress } = useActivityCertification();
  const [selectedActivity, setSelectedActivity] = useState<ActivityRow | null>(null);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const navigate = useNavigate();

  // Debug function to check activity status directly from database
  const checkActivityStatus = async (activityId: string) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('id, verified, blockchain_tx_hash')
        .eq('id', activityId)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error(`❌ Error checking activity status:`, error);
        return null;
      }
      
      console.log(`🔍 Activity ${activityId} status:`, {
        verified: data.verified,
        blockchain_tx_hash: data.blockchain_tx_hash
      });
      
      return data;
    } catch (error) {
      console.error(`❌ Error in checkActivityStatus:`, error);
      return null;
    }
  };

  const handleCertifyActivity = async (activityId: string) => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per certificare un'attività",
        variant: "destructive"
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet non connesso",
        description: "Connetti il wallet per certificare on-chain",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // This will handle both blockchain transaction AND database update
      await certifyActivityBlockchain(activityId);
      
      console.log(`🔄 Refreshing activities list...`);
      
      // Add multiple refresh attempts with delays
      let refreshAttempts = 0;
      const maxRefreshAttempts = 3;
      
      while (refreshAttempts < maxRefreshAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (refreshAttempts + 1)));
        
        console.log(`🔄 Refresh attempt ${refreshAttempts + 1}/${maxRefreshAttempts}`);
        
        // Check database directly first
        const dbStatus = await checkActivityStatus(activityId);
        
        // Then refresh the UI
        await refetch();
        
        // Check if the activity is now marked as verified
        if (dbStatus?.verified) {
          console.log(`✅ Activity successfully verified in database and UI updated`);
          break;
        }
        
        refreshAttempts++;
        
        if (refreshAttempts === maxRefreshAttempts) {
          console.warn(`⚠️ Activity not marked as verified after ${maxRefreshAttempts} attempts`);
          console.warn(`⚠️ This might indicate a database update issue`);
        }
      }
      
    } catch (error) {
      console.error('Error in handleCertifyActivity:', error);
      // Error handling is already done in the hook
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityTypeInfo = (type: string) => {
    return activityTypes[type as keyof typeof activityTypes] || activityTypes.other;
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'verified') return activity.verified;
    if (filter === 'pending') return !activity.verified;
    return true;
  });

  const verifiedCount = activities.filter(a => a.verified).length;
  const pendingCount = activities.filter(a => !a.verified).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <div className="max-w-6xl mx-auto p-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Caricamento attività...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <TestNavigation />
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-8 w-8 text-green-600" />
              Certifications center
            </h1>
            <p className="text-gray-600 mt-1">
              Gestisci e certifica le tue attività sostenibili
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Ricarica
            </Button>
          </div>
        </div>

        {/* User Info & Wallet Status */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Stato Connessione
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {isConnected ? (
                <Badge className="bg-green-100 text-green-800 px-3 py-1">
                  <Wallet className="h-3 w-3 mr-1" />
                  Wallet connesso
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600 border-orange-200 px-3 py-1">
                  <Wallet className="h-3 w-3 mr-1" />
                  Wallet non connesso
                </Badge>
              )}
              {userAddress && (
                <span className="text-sm text-gray-500 font-mono">
                  {userAddress.slice(0, 8)}...{userAddress.slice(-6)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-400 to-green-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{verifiedCount}</p>
                  <p className="text-green-100">Certificate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{pendingCount}</p>
                  <p className="text-orange-100">Da Certificare</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{activities.length}</p>
                  <p className="text-blue-100">Totali</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm h-auto p-1 shadow-md">
            <TabsTrigger value="list" className="text-sm px-4 py-2">
              <Search className="h-4 w-4 mr-2" />
              Elenco Attività
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-sm px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Da Certificare ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="verified" className="text-sm px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Certificate ({verifiedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Tutte le Attività
                </CardTitle>
                <CardDescription>
                  Panoramica completa di tutte le tue attività sostenibili
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center p-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Nessuna attività trovata</p>
                    <p className="text-sm text-gray-400">
                      Aggiungi attività manualmente o connetti Google Fit per iniziare
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => {
                      const typeInfo = getActivityTypeInfo(activity.type);
                      const sourceInfo = getActivitySourceInfo(activity.source);
                      const isCertifying = certifyingId === activity.id;
                      
                      return (
                        <div key={activity.id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3 flex-1">
                              <span className="text-2xl">{typeInfo.icon}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}>
                                    {typeInfo.label}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {sourceInfo.icon} {sourceInfo.label}
                                  </Badge>
                                  {activity.verified ? (
                                    <Badge className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Certificata
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="font-medium text-gray-900 mb-2">
                                  {activity.description}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  {activity.distance && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {activity.distance.toFixed(2)} km
                                    </div>
                                  )}
                                  {activity.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {activity.duration} min
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(activity.created_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {/* Rewards Info */}
                              <div className="text-right">
                                <div className="text-lg font-semibold text-green-600">
                                  +{activity.tokens_earned} token
                                </div>
                                <div className="text-sm text-gray-500">
                                  {activity.co2_saved.toFixed(2)} kg CO₂
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                {/* View Details */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedActivity(activity)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Dettagli Attività</DialogTitle>
                                      <DialogDescription>
                                        Informazioni complete sull'attività selezionata
                                      </DialogDescription>
                                    </DialogHeader>
                                    {selectedActivity && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <label className="text-sm font-medium text-gray-500">Tipo</label>
                                            <p>{getActivityTypeInfo(selectedActivity.type).label}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-500">Fonte</label>
                                            <p>{getActivitySourceInfo(selectedActivity.source).label}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-500">Distanza</label>
                                            <p>{selectedActivity.distance?.toFixed(2) || 'N/A'} km</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-500">Durata</label>
                                            <p>{selectedActivity.duration || 'N/A'} min</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-500">Token Guadagnati</label>
                                            <p className="text-green-600 font-semibold">{selectedActivity.tokens_earned}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-500">CO₂ Risparmiata</label>
                                            <p className="text-blue-600 font-semibold">{selectedActivity.co2_saved.toFixed(2)} kg</p>
                                          </div>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-500">Descrizione</label>
                                          <p className="mt-1">{selectedActivity.description}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-500">Data Creazione</label>
                                          <p className="mt-1">{formatDate(selectedActivity.created_at)}</p>
                                        </div>
                                        {selectedActivity.google_fit_session_id && (
                                          <div>
                                            <label className="text-sm font-medium text-gray-500">Session ID Google Fit</label>
                                            <p className="mt-1 text-xs font-mono bg-gray-100 p-2 rounded">
                                              {selectedActivity.google_fit_session_id}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                
                                {/* Certification Button */}
                                {!activity.verified ? (
                                  <Button 
                                    onClick={() => handleCertifyActivity(activity.id)}
                                    disabled={isCertifying || !isConnected}
                                    className={`${
                                      !isConnected 
                                        ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                    size="sm"
                                  >
                                    {isCertifying ? (
                                      <>
                                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                        Certificando...
                                      </>
                                    ) : !isConnected ? (
                                      <>
                                        <Wallet className="h-4 w-4 mr-2" />
                                        Wallet Required
                                      </>
                                    ) : (
                                      <>
                                        <Shield className="h-4 w-4 mr-2" />
                                        Certifica Blockchain
                                      </>
                                    )}
                                  </Button>
                                ) : (
                                  <div className="flex flex-col items-end gap-1">
                                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                                      <Award className="h-3 w-3 mr-1" />
                                      Certificata
                                    </Badge>
                                    {activity.blockchain_tx_hash && (
                                      <span className="text-xs text-gray-500 font-mono">
                                        TX: {activity.blockchain_tx_hash.slice(0, 8)}...
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Attività da Certificare
                </CardTitle>
                <CardDescription>
                  Attività in attesa di certificazione blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.filter(a => !a.verified).length === 0 ? (
                  <div className="text-center p-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Tutte le attività sono già certificate!</p>
                    <p className="text-sm text-gray-400">
                      Ottimo lavoro! Continua ad aggiungere nuove attività sostenibili.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.filter(a => !a.verified).map((activity) => {
                      const typeInfo = getActivityTypeInfo(activity.type);
                      const sourceInfo = getActivitySourceInfo(activity.source);
                      const isCertifying = certifyingId === activity.id;
                      
                      return (
                        <div key={activity.id} className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{typeInfo.icon}</span>
                              <div>
                                <p className="font-medium text-gray-900">{activity.description}</p>
                                <p className="text-sm text-gray-600">
                                  +{activity.tokens_earned} token • {activity.co2_saved.toFixed(2)} kg CO₂
                                </p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleCertifyActivity(activity.id)}
                              disabled={isCertifying || !isConnected}
                              className="bg-orange-600 hover:bg-orange-700"
                              size="sm"
                            >
                              {isCertifying ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                  Certificando...
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Certifica
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verified" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Attività Certificate
                </CardTitle>
                <CardDescription>
                  Attività già certificate sulla blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.filter(a => a.verified).length === 0 ? (
                  <div className="text-center p-8">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Nessuna attività certificata</p>
                    <p className="text-sm text-gray-400">
                      Le attività certificate appariranno qui dopo la certificazione blockchain
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.filter(a => a.verified).map((activity) => {
                      const typeInfo = getActivityTypeInfo(activity.type);
                      const sourceInfo = getActivitySourceInfo(activity.source);
                      
                      return (
                        <div key={activity.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{typeInfo.icon}</span>
                              <div>
                                <p className="font-medium text-gray-900">{activity.description}</p>
                                <p className="text-sm text-gray-600">
                                  +{activity.tokens_earned} token • {activity.co2_saved.toFixed(2)} kg CO₂
                                </p>
                                {activity.blockchain_tx_hash && (
                                  <p className="text-xs text-gray-500 font-mono mt-1">
                                    TX: {activity.blockchain_tx_hash.slice(0, 16)}...
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 px-3 py-1">
                              <Award className="h-3 w-3 mr-1" />
                              Certificata
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info about Certification */}
        {pendingCount > 0 && (
          <Alert className="border-0 shadow-lg bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Certificazione Blockchain:</strong> Ogni attività può essere certificata on-chain usando smart contracts su Polygon. 
              Questo convertirà i token pending in token minted e creerà un certificato blockchain immutabile.
              {pendingCount > 1 && ` Hai ${pendingCount} attività pronte per la certificazione.`}
              {!isConnected && (
                <><br /><strong>Nota:</strong> Devi connettere il wallet per procedere con la certificazione blockchain.</>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
