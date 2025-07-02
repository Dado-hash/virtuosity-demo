import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Lightbulb, Trash2, Recycle, ArrowLeft, Activity, Wifi, AlertCircle, CheckCircle, Clock, Settings, MapPin, AlertTriangle, FileText, Gift, Plus, Edit, Trash, Euro, Users, Target, Award, TrendingUp, TrendingDown, Leaf, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";

const Comuni = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showAddReward, setShowAddReward] = useState(false);

  // Mock data for charts
  const environmentalData = [{
    month: "Gen",
    co2: 120,
    energia: 85,
    acqua: 90
  }, {
    month: "Feb",
    co2: 115,
    energia: 82,
    acqua: 88
  }, {
    month: "Mar",
    co2: 108,
    energia: 78,
    acqua: 85
  }, {
    month: "Apr",
    co2: 102,
    energia: 75,
    acqua: 82
  }, {
    month: "Mag",
    co2: 98,
    energia: 73,
    acqua: 80
  }, {
    month: "Giu",
    co2: 95,
    energia: 70,
    acqua: 78
  }];

  const parkingData = [{
    zone: "Centro",
    occupati: 340,
    totali: 400
  }, {
    zone: "Nord",
    occupati: 280,
    totali: 350
  }, {
    zone: "Sud",
    occupati: 220,
    totali: 300
  }, {
    zone: "Est",
    occupati: 190,
    totali: 250
  }, {
    zone: "Ovest",
    occupati: 160,
    totali: 200
  }];

  const waterSavingData = [{
    ora: "06:00",
    risparmio: 15
  }, {
    ora: "08:00",
    risparmio: 25
  }, {
    ora: "10:00",
    risparmio: 35
  }, {
    ora: "12:00",
    risparmio: 45
  }, {
    ora: "14:00",
    risparmio: 40
  }, {
    ora: "16:00",
    risparmio: 30
  }, {
    ora: "18:00",
    risparmio: 20
  }, {
    ora: "20:00",
    risparmio: 18
  }];

  const lightingData = [{
    name: "Funzionanti",
    value: 1245,
    color: "#10B981"
  }, {
    name: "Guasti",
    value: 23,
    color: "#EF4444"
  }, {
    name: "Manutenzione",
    value: 12,
    color: "#F59E0B"
  }];

  const wasteData = [{
    giorno: "Lun",
    raccolto: 450,
    riciclato: 320
  }, {
    giorno: "Mar",
    raccolto: 420,
    riciclato: 295
  }, {
    giorno: "Mer",
    raccolto: 480,
    riciclato: 340
  }, {
    giorno: "Gio",
    raccolto: 460,
    riciclato: 330
  }, {
    giorno: "Ven",
    raccolto: 510,
    riciclato: 380
  }, {
    giorno: "Sab",
    raccolto: 380,
    riciclato: 270
  }, {
    giorno: "Dom",
    raccolto: 320,
    riciclato: 240
  }];

  const communityRewards = [{
    id: 1,
    title: "Sconto Trasporto Pubblico",
    description: "Riduzione del 20% sugli abbonamenti mensili per autobus e metro",
    category: "transport",
    certificatesRequired: 50,
    value: "€15",
    maxUsers: 500,
    currentUsers: 127,
    status: "active",
    icon: Car,
    validUntil: "31/12/2024"
  }, {
    id: 2,
    title: "Parcheggio Gratuito Centro",
    description: "2 ore di parcheggio gratuito nelle zone blu del centro storico",
    category: "parking",
    certificatesRequired: 30,
    value: "€3/uso",
    maxUsers: 200,
    currentUsers: 89,
    status: "active",
    icon: Car,
    validUntil: "30/06/2025"
  }, {
    id: 3,
    title: "Tariffa Agevolata Rifiuti",
    description: "Sconto del 15% sulla TARI per famiglie virtuose",
    category: "waste",
    certificatesRequired: 100,
    value: "€80",
    maxUsers: 1000,
    currentUsers: 234,
    status: "active",
    icon: Trash2,
    validUntil: "31/12/2024"
  }, {
    id: 4,
    title: "Accesso Prioritario Servizi",
    description: "Accesso prioritario agli sportelli comunali e prenotazioni online",
    category: "services",
    certificatesRequired: 75,
    value: "Tempo",
    maxUsers: 300,
    currentUsers: 156,
    status: "active",
    icon: Users,
    validUntil: "31/12/2025"
  }, {
    id: 5,
    title: "Kit Energia Sostenibile",
    description: "Kit gratuito con lampadine LED e dispositivi per il risparmio energetico",
    category: "energy",
    certificatesRequired: 80,
    value: "€45",
    maxUsers: 150,
    currentUsers: 67,
    status: "draft",
    icon: Lightbulb,
    validUntil: "30/09/2024"
  }];

  const mapAlerts = [{
    id: 1,
    type: "alert",
    title: "Contenitore rifiuti pieno",
    location: "Via Roma 45",
    coords: [9.1900, 45.4642] as [number, number],
    severity: "high",
    timestamp: "10 min fa"
  }, {
    id: 2,
    type: "alert",
    title: "Lampione non funzionante",
    location: "Piazza Duomo",
    coords: [9.1916, 45.4640] as [number, number],
    severity: "medium",
    timestamp: "25 min fa"
  }, {
    id: 3,
    type: "resolved",
    title: "Parcheggio riparato",
    location: "Via Brera 12",
    coords: [9.1885, 45.4720] as [number, number],
    timestamp: "2 ore fa"
  }, {
    id: 4,
    type: "resolved",
    title: "Illuminazione ripristinata",
    location: "Corso Buenos Aires",
    coords: [9.2050, 45.4780] as [number, number],
    timestamp: "4 ore fa"
  }];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initializeMap = async () => {
      try {
        const mapboxgl = await import('mapbox-gl');
        mapboxgl.default.accessToken = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';
        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [9.1900, 45.4642],
          zoom: 13
        });

        map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

        mapAlerts.forEach(item => {
          const el = document.createElement('div');
          el.className = `w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer ${item.type === 'alert' ? item.severity === 'high' ? 'bg-red-500' : 'bg-orange-500' : 'bg-green-500'}`;
          const popup = new mapboxgl.default.Popup({
            offset: 25
          }).setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-sm">${item.title}</h3>
                <p class="text-xs text-gray-600">${item.location}</p>
                <p class="text-xs text-gray-500">${item.timestamp}</p>
              </div>
            `);
          new mapboxgl.default.Marker(el).setLngLat(item.coords).setPopup(popup).addTo(map.current);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    initializeMap();
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const integrations = [{
    id: 1,
    name: "Smart Parking",
    description: "Gestione aree parcheggio e monitoraggio occupazione",
    status: "active",
    lastSync: "2 minuti fa",
    dataPoints: 1247,
    icon: Car,
    color: "bg-green-100 text-green-800",
    metrics: {
      parkingSpaces: 850,
      occupied: 634,
      revenue: "€2,340"
    }
  }, {
    id: 2,
    name: "Illuminazione Pubblica",
    description: "Controllo LED e risparmio energetico",
    status: "active",
    lastSync: "5 minuti fa",
    dataPoints: 892,
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-800",
    metrics: {
      lampPosts: 456,
      energySaved: "23%",
      cost: "€890"
    }
  }, {
    id: 3,
    name: "Gestione Rifiuti",
    description: "Monitoraggio raccolta e ottimizzazione percorsi",
    status: "warning",
    lastSync: "15 minuti fa",
    dataPoints: 567,
    icon: Trash2,
    color: "bg-orange-100 text-orange-800",
    metrics: {
      containers: 234,
      fullContainers: 12,
      efficiency: "87%"
    }
  }, {
    id: 4,
    name: "Riciclo e Tracciamento",
    description: "Tracciamento materiali riciclabili e incentivi",
    status: "inactive",
    lastSync: "2 ore fa",
    dataPoints: 0,
    icon: Recycle,
    color: "bg-blue-100 text-blue-800",
    metrics: {
      materials: 0,
      recycled: "0kg",
      citizens: 0
    }
  }];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 text-xs"><CheckCircle className="w-2 h-2 mr-1" />Attivo</Badge>;
      case "warning":
        return <Badge className="bg-orange-100 text-orange-800 text-xs"><AlertCircle className="w-2 h-2 mr-1" />Attenzione</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 text-xs"><Clock className="w-2 h-2 mr-1" />Inattivo</Badge>;
      case "draft":
        return <Badge className="bg-blue-100 text-blue-800 text-xs"><Edit className="w-2 h-2 mr-1" />Bozza</Badge>;
      default:
        return <Badge variant="secondary">Sconosciuto</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "transport":
        return "bg-blue-100 text-blue-800";
      case "parking":
        return "bg-purple-100 text-purple-800";
      case "waste":
        return "bg-green-100 text-green-800";
      case "services":
        return "bg-orange-100 text-orange-800";
      case "energy":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleManageIntegration = (integration: any) => {
    toast({
      title: "Gestione Integrazione",
      description: `Apertura pannello di controllo per ${integration.name}`
    });
  };

  const handleEditReward = (reward: any) => {
    setSelectedReward(reward);
    toast({
      title: "Modifica Incentivo",
      description: `Modifica di ${reward.title}`
    });
  };

  const handleDeleteReward = (rewardId: number) => {
    toast({
      title: "Incentivo Eliminato",
      description: "L'incentivo è stato rimosso con successo"
    });
  };

  const totalDataPoints = integrations.reduce((sum, int) => sum + int.dataPoints, 0);
  const activeIntegrations = integrations.filter(int => int.status === "active").length;
  const totalRewards = communityRewards.length;
  const activeRewards = communityRewards.filter(r => r.status === "active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header - Compact for mobile */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center py-2 sm:py-3">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")} 
                className="p-2 min-h-[36px] min-w-[36px]" 
                size="sm"
              >
                <ArrowLeft className="h-3 w-3" />
              </Button>
              <img 
                src="/lovable-uploads/5930bd4d-6869-4b7d-8020-e58372708f8a.png" 
                alt="Virtuosity Logo" 
                className="h-6 w-6 sm:h-8 sm:w-8 object-contain" 
              />
              <h1 className="text-xs sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard Comuni
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/report")} 
                className="border-green-300 text-green-700 hover:bg-green-50 text-xs px-2 py-1 min-h-[36px]"
              >
                <FileText className="h-3 w-3 mr-1" />
                Report
              </Button>
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-2 py-1 rounded-full font-bold text-xs min-h-[28px] flex items-center">
                <Activity className="h-2 w-2 mr-1" />
                {totalDataPoints}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {/* Welcome Section - Compact */}
        <div className="mb-4 sm:mb-6 text-center px-2">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">Centro di Controllo Integrazioni 🏛️</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm">
            Monitora tutte le integrazioni del comune con Virtuosity. Controlla lo stato dei servizi smart della città.
          </p>
        </div>

        {/* Overview Cards - Smaller for mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-400 to-green-600 text-white">
            <CardHeader className="pb-1 p-2 sm:p-4">
              <CardTitle className="text-xs font-medium text-green-100">Integrazioni Attive</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0">
              <div className="text-sm sm:text-xl font-bold">{activeIntegrations}</div>
              <p className="text-xs text-green-100">di {integrations.length} totali</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-400 to-purple-600 text-white">
            <CardHeader className="pb-1 p-2 sm:p-4">
              <CardTitle className="text-xs font-medium text-violet-100">Certificati ricevuti</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0">
              <div className="text-sm sm:text-xl font-bold">{totalDataPoints.toLocaleString()}</div>
              <p className="text-xs text-violet-100">Oggi</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <CardHeader className="pb-1 p-2 sm:p-4">
              <CardTitle className="text-xs font-medium text-blue-100">Incentivi Attivi</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0">
              <div className="text-sm sm:text-xl font-bold">{activeRewards}</div>
              <p className="text-xs text-blue-100">di {totalRewards} totali</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
            <CardHeader className="pb-1 p-2 sm:p-4">
              <CardTitle className="text-xs font-medium text-yellow-100">Segnalazioni</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0">
              <div className="text-sm sm:text-xl font-bold">2</div>
              <p className="text-xs text-yellow-100">Richiedono attenzione</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Dashboard Monitoring Section - Much smaller blocks */}
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm sm:text-xl font-bold text-gray-900">Dashboard di Monitoraggio 📊</h2>
            <Badge className="bg-blue-100 text-blue-800 py-1 text-xs">
              <Activity className="w-2 h-2 mr-1" />
              <span>Aggiornamento ogni 5 min</span>
            </Badge>
          </div>
          
          {/* Map and Environmental Impact - Reduced height */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            <Card className="lg:col-span-2 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="flex items-center text-sm sm:text-base">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" />
                  Mappa Città
                </CardTitle>
                <CardDescription className="text-xs">
                  Visualizzazione in tempo reale di sensori e infrastrutture
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="h-40 sm:h-64 w-full rounded-lg overflow-hidden bg-gray-50 relative">
                  <img 
                    src="/lovable-uploads/9bea380e-98ea-4b94-a376-e7d9e45cc143.png"
                    alt="Mappa della città con strade e località"
                    className="w-full h-full object-cover"
                  />
                  {/* Sensori - Smaller for mobile */}
                  <div className="absolute top-4 left-6 group">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse cursor-pointer"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Cassonetto pieno - Via Roma
                    </div>
                  </div>

                  <div className="absolute top-8 right-8 group">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-pulse cursor-pointer"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Lampione non funzionante
                    </div>
                  </div>

                  <div className="absolute top-1/3 left-1/4 group">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse cursor-pointer"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Fontana rotta
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 group">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse cursor-pointer"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Parcheggio libero
                    </div>
                  </div>

                  <div className="absolute top-1/2 right-1/4 group">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse cursor-pointer"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Qualità aria OK
                    </div>
                  </div>

                  <div className="absolute bottom-1/4 left-4 group">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-pulse cursor-pointer"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Traffico intenso
                    </div>
                  </div>

                  <div className="absolute top-3/4 right-1/3 group">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse cursor-pointer"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Raccolta completata
                    </div>
                  </div>

                  <div className="absolute top-1/4 right-4 group">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse cursor-pointer"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Semaforo guasto
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Tutto OK</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Attenzione</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Critico</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="flex items-center text-sm sm:text-base">
                  <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-600" />
                  Impatto Ambientale
                </CardTitle>
                <CardDescription className="text-xs">
                  Trend mensile di sostenibilità
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="h-40 sm:h-48 w-full">
                  <ChartContainer config={{
                    co2: {
                      label: "CO2 (ton)",
                      theme: {
                        light: "#EF4444",
                        dark: "#EF4444"
                      }
                    },
                    energia: {
                      label: "Energia (MWh)",
                      theme: {
                        light: "#F59E0B",
                        dark: "#F59E0B"
                      }
                    },
                    acqua: {
                      label: "Acqua (m³x100)",
                      theme: {
                        light: "#3B82F6",
                        dark: "#3B82F6"
                      }
                    }
                  }}>
                    <LineChart data={environmentalData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="co2" stroke="var(--color-co2, #EF4444)" strokeWidth={2} dot={true} />
                      <Line type="monotone" dataKey="energia" stroke="var(--color-energia, #F59E0B)" strokeWidth={2} dot={true} />
                      <Line type="monotone" dataKey="acqua" stroke="var(--color-acqua, #3B82F6)" strokeWidth={2} dot={true} />
                    </LineChart>
                  </ChartContainer>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1 text-center">
                  <div className="bg-red-50 p-1 rounded">
                    <div className="text-red-600 font-bold text-xs flex items-center justify-center">
                      <TrendingDown className="h-2 w-2 mr-1" />-12%
                    </div>
                    <div className="text-xs text-gray-600">CO2</div>
                  </div>
                  <div className="bg-amber-50 p-1 rounded">
                    <div className="text-amber-600 font-bold text-xs flex items-center justify-center">
                      <TrendingDown className="h-2 w-2 mr-1" />-9%
                    </div>
                    <div className="text-xs text-gray-600">Energia</div>
                  </div>
                  <div className="bg-blue-50 p-1 rounded">
                    <div className="text-blue-600 font-bold text-xs flex items-center justify-center">
                      <TrendingDown className="h-2 w-2 mr-1" />-5%
                    </div>
                    <div className="text-xs text-gray-600">Acqua</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Monitoring Charts - Ultra compact blocks */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2">
            {/* Water Saving */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-1 sm:p-2">
                <CardTitle className="flex items-center text-xs">
                  <Droplets className="h-2 w-2 sm:h-3 sm:w-3 mr-1 text-blue-600" />
                  Acqua
                </CardTitle>
                <CardDescription className="text-xs">
                  Risparmio giornaliero
                </CardDescription>
              </CardHeader>
              <CardContent className="p-1 sm:p-2 pt-0">
                <div className="h-16 sm:h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waterSavingData}>
                      <defs>
                        <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="risparmio" stroke="#3B82F6" fill="url(#waterGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1 text-center">
                  <Badge className="bg-blue-100 text-blue-700 text-xs">+8%</Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Parking */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-1 sm:p-2">
                <CardTitle className="flex items-center text-xs">
                  <Car className="h-2 w-2 sm:h-3 sm:w-3 mr-1 text-blue-600" />
                  Parcheggi
                </CardTitle>
                <CardDescription className="text-xs">
                  Occupazione zone
                </CardDescription>
              </CardHeader>
              <CardContent className="p-1 sm:p-2 pt-0">
                <div className="h-16 sm:h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parkingData}>
                      <Bar dataKey="occupati" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1 text-center">
                  <Badge className="bg-blue-100 text-blue-700 text-xs">75%</Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Lighting */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-1 sm:p-2">
                <CardTitle className="flex items-center text-xs">
                  <Lightbulb className="h-2 w-2 sm:h-3 sm:w-3 mr-1 text-yellow-600" />
                  Illuminazione
                </CardTitle>
                <CardDescription className="text-xs">
                  Stato lampioni
                </CardDescription>
              </CardHeader>
              <CardContent className="p-1 sm:p-2 pt-0">
                <div className="h-16 sm:h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={lightingData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={15} 
                        outerRadius={25} 
                        paddingAngle={5} 
                        dataKey="value"
                      >
                        {lightingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1 text-center">
                  <Badge className="bg-green-100 text-green-700 text-xs">97%</Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Waste */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-1 sm:p-2">
                <CardTitle className="flex items-center text-xs">
                  <Recycle className="h-2 w-2 sm:h-3 sm:w-3 mr-1 text-green-600" />
                  Rifiuti
                </CardTitle>
                <CardDescription className="text-xs">
                  Raccolta/Riciclo
                </CardDescription>
              </CardHeader>
              <CardContent className="p-1 sm:p-2 pt-0">
                <div className="h-16 sm:h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wasteData}>
                      <Bar dataKey="raccolto" fill="#94A3B8" />
                      <Bar dataKey="riciclato" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1 text-center">
                  <Badge className="bg-green-100 text-green-700 text-xs">72%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          {/* Compact tabs */}
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm shadow-md p-1 sticky bottom-0 z-40">
            <TabsTrigger 
              value="overview" 
              className="px-1 py-2 text-xs sm:text-sm hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:text-blue-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg min-h-[36px]"
            >
              Panoramica
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="px-1 py-2 text-xs sm:text-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg min-h-[36px]"
            >
              Incentivi al cittadino
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 sm:mt-6">
            <TabsContent value="overview" className="space-y-3 sm:space-y-4 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {integrations.map(integration => {
                  const IconComponent = integration.icon;
                  return (
                    <Card key={integration.id} className="border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                      <CardHeader className="pb-2 p-3 sm:p-4">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1.5 rounded-lg ${integration.color}`}>
                              <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                            <div>
                              <CardTitle className="text-xs sm:text-sm">{integration.name}</CardTitle>
                              <CardDescription className="text-xs">{integration.description}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(integration.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">Ultimo aggiornamento:</span>
                            <span className="font-medium">{integration.lastSync}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">Punti dati:</span>
                            <span className="font-medium">{integration.dataPoints}</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-1 text-xs">
                            {Object.entries(integration.metrics).map(([key, value]) => (
                              <div key={key} className="text-center p-1.5 bg-gray-50 rounded">
                                <div className="font-bold text-gray-900 text-xs">{value}</div>
                                <div className="text-gray-600 capitalize text-xs">{key}</div>
                              </div>
                            ))}
                          </div>
                          
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-xs min-h-[36px]" 
                            onClick={() => handleManageIntegration(integration)} 
                            size="sm"
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Gestisci
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-3 sm:space-y-4 mt-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                <div>
                  <h3 className="text-sm sm:text-lg font-bold text-gray-900">Gestione Incentivi Cittadini 🎁</h3>
                  <p className="text-gray-600 text-xs">Configura i servizi e vantaggi offerti in cambio di certificati ambientali</p>
                </div>
                <Button 
                  onClick={() => setShowAddReward(true)} 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto min-h-[36px] text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nuovo Incentivo
                </Button>
              </div>

              {/* Rewards Stats - Smaller blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex items-center space-x-1">
                      <Gift className="h-3 w-3" />
                      <div>
                        <div className="text-sm sm:text-lg font-bold">{totalRewards}</div>
                        <div className="text-xs text-purple-100">Totali</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm bg-gradient-to-br from-green-400 to-emerald-500 text-white">
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <div>
                        <div className="text-sm sm:text-lg font-bold">{activeRewards}</div>
                        <div className="text-xs text-green-100">Attivi</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-400 to-cyan-500 text-white">
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <div>
                        <div className="text-sm sm:text-lg font-bold">{communityRewards.reduce((sum, r) => sum + r.currentUsers, 0)}</div>
                        <div className="text-xs text-blue-100">Utenti</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-400 to-red-500 text-white">
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex items-center space-x-1">
                      <Award className="h-3 w-3" />
                      <div>
                        <div className="text-sm sm:text-lg font-bold">{communityRewards.reduce((sum, r) => sum + r.certificatesRequired, 0)}</div>
                        <div className="text-xs text-orange-100">Certificati</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rewards List - Compact cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {communityRewards.map(reward => {
                  const IconComponent = reward.icon;
                  const usagePercentage = (reward.currentUsers / reward.maxUsers) * 100;
                  return (
                    <Card key={reward.id} className="border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                      <CardHeader className="pb-2 p-3 sm:p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1.5 rounded-lg ${getCategoryColor(reward.category)}`}>
                              <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                            <div>
                              <CardTitle className="text-xs sm:text-sm">{reward.title}</CardTitle>
                              <CardDescription className="text-xs">{reward.description}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(reward.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-0">
                        <div className="space-y-3">
                          {/* Requirement and Value */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-1">
                              <Target className="h-2 w-2 sm:h-3 sm:w-3 text-blue-600" />
                              <div>
                                <div className="font-medium text-xs">{reward.certificatesRequired} cert.</div>
                                <div className="text-gray-500 text-xs">Richiesti</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Euro className="h-2 w-2 sm:h-3 sm:w-3 text-green-600" />
                              <div>
                                <div className="font-medium text-xs">{reward.value}</div>
                                <div className="text-gray-500 text-xs">Valore</div>
                              </div>
                            </div>
                          </div>

                          {/* Usage Progress */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">Utilizzo</span>
                              <span className="font-medium">{reward.currentUsers}/{reward.maxUsers}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {usagePercentage.toFixed(1)}% utilizzato
                            </div>
                          </div>

                          {/* Validity */}
                          <div className="text-xs text-gray-500">
                            <span>Valido fino al: </span>
                            <span className="font-medium">{reward.validUntil}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 min-h-[32px] text-xs" 
                              onClick={() => handleEditReward(reward)}
                            >
                              <Edit className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                              Modifica
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-300 hover:bg-red-50 min-h-[32px] min-w-[32px]" 
                              onClick={() => handleDeleteReward(reward.id)}
                            >
                              <Trash className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Add New Reward Form - Compact */}
              {showAddReward && (
                <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm border-purple-200">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="flex items-center space-x-2 text-sm">
                      <Plus className="h-4 w-4 text-purple-600" />
                      <span>Crea Nuovo Incentivo</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Configura un nuovo servizio o vantaggio da offrire ai cittadini
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 p-3 sm:p-4 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="title" className="text-xs">Titolo Incentivo</Label>
                        <Input id="title" placeholder="es. Sconto Trasporto Pubblico" className="min-h-[36px] text-xs" />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-xs">Categoria</Label>
                        <Input id="category" placeholder="transport, parking, waste..." className="min-h-[36px] text-xs" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-xs">Descrizione</Label>
                      <Input id="description" placeholder="Descrizione dettagliata del vantaggio offerto" className="min-h-[36px] text-xs" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="certificates" className="text-xs">Certificati Richiesti</Label>
                        <Input id="certificates" type="number" placeholder="50" className="min-h-[36px] text-xs" />
                      </div>
                      <div>
                        <Label htmlFor="value" className="text-xs">Valore</Label>
                        <Input id="value" placeholder="€15" className="min-h-[36px] text-xs" />
                      </div>
                      <div>
                        <Label htmlFor="maxUsers" className="text-xs">Utenti Max</Label>
                        <Input id="maxUsers" type="number" placeholder="500" className="min-h-[36px] text-xs" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex-1 min-h-[36px] text-xs" 
                        onClick={() => {
                          toast({
                            title: "Incentivo Creato",
                            description: "Il nuovo incentivo è stato aggiunto con successo"
                          });
                          setShowAddReward(false);
                        }}
                      >
                        Crea Incentivo
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddReward(false)} 
                        className="min-h-[36px] text-xs"
                      >
                        Annulla
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Bottom Info - Compact */}
        <div className="mt-6 sm:mt-8 bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
          <h3 className="font-bold text-gray-900 mb-1 text-xs sm:text-sm">🏛️ Centro di Controllo Virtuosity</h3>
          <p className="text-gray-600 text-xs">
            Virtuosity funge da collettore centrale per tutte le applicazioni smart del comune. 
            Monitora in tempo reale parking, illuminazione, rifiuti e riciclo per una gestione urbana più efficiente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comuni;
