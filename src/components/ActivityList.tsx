import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupabase } from '@/providers/SupabaseProvider';
import { useActivities, activityTypes, getActivitySourceInfo } from '@/hooks/useSupabaseData';
import BlockchainCertifyButton from '@/components/BlockchainCertifyButton';
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
  Eye
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Database } from '@/lib/supabase';

type ActivityRow = Database['public']['Tables']['activities']['Row'];

const ActivityList = () => {
  const { activities, loading, refetch } = useActivities();
  const { certifyActivity, user } = useSupabase();
  const { toast } = useToast();
  const [certifyingId, setCertifyingId] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRow | null>(null);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

  const handleCertifyActivity = async (activityId: string) => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per certificare un'attività",
        variant: "destructive"
      });
      return;
    }

    setCertifyingId(activityId);
    
    try {
      await certifyActivity(activityId);
      
      // Add a small delay to ensure database is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh activities to show updated status
      await refetch();
      
      toast({
        title: "✅ Certificazione Completata",
        description: "L'attività è stata certificata con successo e i token sono stati convertiti!",
      });
      
    } catch (error) {
      console.error('Error certifying activity:', error);
      
      let errorMessage = "Si è verificato un errore durante la certificazione dell'attività";
      
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      toast({
        title: "❌ Errore Certificazione",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setCertifyingId(null);
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Card>
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header with Stats */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6" />
                Le Tue Attività
              </h2>
              <p className="text-gray-600 mt-1">
                Gestisci e certifica le tue attività sostenibili
              </p>
            </div>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Ricarica
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
                    <p className="text-sm text-gray-600">Certificate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                    <p className="text-sm text-gray-600">Da Certificare</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{activities.length}</p>
                    <p className="text-sm text-gray-600">Totali</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Tutte ({activities.length})
            </Button>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Da Certificare ({pendingCount})
            </Button>
            <Button 
              variant={filter === 'verified' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('verified')}
            >
              Certificate ({verifiedCount})
            </Button>
          </div>

          {/* Activities List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Elenco Attività
              </CardTitle>
              <CardDescription>
                {filter === 'all' && 'Tutte le tue attività sostenibili'}
                {filter === 'pending' && 'Attività in attesa di certificazione'}
                {filter === 'verified' && 'Attività già certificate on-chain'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredActivities.length === 0 ? (
                <div className="text-center p-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">
                    {filter === 'all' && 'Nessuna attività trovata'}
                    {filter === 'pending' && 'Nessuna attività da certificare'}
                    {filter === 'verified' && 'Nessuna attività certificata'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {filter === 'all' && 'Aggiungi attività manualmente o connetti Google Fit per iniziare'}
                    {filter === 'pending' && 'Tutte le attività sono già certificate'}
                    {filter === 'verified' && 'Le attività certificate appariranno qui'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActivities.map((activity) => {
                    const typeInfo = getActivityTypeInfo(activity.type);
                    const sourceInfo = getActivitySourceInfo(activity.source);
                    const isCertifying = certifyingId === activity.id;
                    
                    return (
                      <div key={activity.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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
                                  disabled={isCertifying}
                                  className="bg-blue-600 hover:bg-blue-700"
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
                              ) : (
                                <Badge className="bg-green-100 text-green-800 px-3 py-1">
                                  <Award className="h-3 w-3 mr-1" />
                                  Certificata
                                </Badge>
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

          {/* Info about Certification */}
          {pendingCount > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Certificazione Individuale:</strong> Ogni attività può essere certificata singolarmente on-chain. 
                Questo convertirà i token pending in token minted e creerà un certificato blockchain.
                {pendingCount > 1 && ` Hai ${pendingCount} attività pronte per la certificazione.`}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
