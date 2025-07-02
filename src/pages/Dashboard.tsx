import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Award, TrendingUp, MapPin, Clock, QrCode, Camera, Smartphone, Users, Trophy, Target, Zap, Wallet, Eye, Shield, Send, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DppVerification } from "@/components/DppVerification";
import CitizenReporting from "@/components/CitizenReporting";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [transferEmail, setTransferEmail] = useState("");

  const activities = [{
    id: 1,
    type: "bike",
    action: "Pedalata in bicicletta",
    distance: "12.5 km",
    co2Saved: "2.8 kg",
    points: 150,
    time: "45 min",
    timestamp: "2024-01-15T08:30:00",
    location: "Milano Centro",
    source: "Strava"
  }, {
    id: 2,
    type: "public_transport",
    action: "Trasporto pubblico",
    distance: "8.2 km",
    co2Saved: "1.5 kg",
    points: 80,
    time: "25 min",
    timestamp: "2024-01-15T18:15:00",
    location: "Milano - Roma",
    source: "ATM App"
  }, {
    id: 3,
    type: "walk",
    action: "Camminata sostenibile",
    distance: "3.1 km",
    co2Saved: "0.7 kg",
    points: 45,
    time: "32 min",
    timestamp: "2024-01-14T12:20:00",
    location: "Parco Sempione",
    source: "Samsung Health"
  }];
  const certificates = [{
    id: "CERT-001",
    title: "Mobilità Sostenibile",
    co2Saved: "15.2 kg",
    points: 850,
    validatedAt: "2024-01-15",
    blockchainHash: "0x1a2b3c...",
    status: "verified"
  }, {
    id: "CERT-002",
    title: "Trasporto Pubblico",
    co2Saved: "8.7 kg",
    points: 470,
    validatedAt: "2024-01-10",
    blockchainHash: "0x4d5e6f...",
    status: "verified"
  }, {
    id: "CERT-003",
    title: "Riciclo e Smaltimento",
    co2Saved: "12.4 kg",
    points: 620,
    validatedAt: "2024-01-12",
    blockchainHash: "0x7g8h9i...",
    status: "verified"
  }];
  const challenges = [{
    id: 1,
    title: "Settimana della Mobilità Verde",
    description: "Chi percorre più km con mezzi sostenibili questa settimana?",
    type: "weekly",
    participants: 12,
    yourPosition: 3,
    leadingUser: "Anna M.",
    leadingScore: "45.2 km",
    yourScore: "32.7 km",
    timeLeft: "3 giorni",
    category: "Mobilità",
    prize: "Buono spesa €50",
    progress: 73,
    status: "active"
  }, {
    id: 2,
    title: "Challenge CO₂ Aziendale",
    description: "Squadra che risparmia più CO₂ questo mese",
    type: "team",
    participants: 8,
    yourPosition: 1,
    leadingUser: "Il tuo team",
    leadingScore: "128.5 kg CO₂",
    yourScore: "128.5 kg CO₂",
    timeLeft: "12 giorni",
    category: "Riduzione CO₂",
    prize: "Team Building ecologico",
    progress: 85,
    status: "leading"
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'leading':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'active':
        return 'bg-gradient-to-r from-blue-400 to-purple-500 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const getPositionBadge = (position: number) => {
    if (position === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (position <= 3) return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  // Monthly CO2 goal data
  const monthlyGoal = 50; // kg CO2
  const currentSaved = 24.3; // kg CO2
  const progressPercentage = currentSaved / monthlyGoal * 100;
  const chartData = [{
    name: "Risparmiata",
    value: currentSaved,
    fill: "#22c55e"
  }, {
    name: "Rimanente",
    value: monthlyGoal - currentSaved,
    fill: "#e5e7eb"
  }];
  const chartConfig = {
    risparmiata: {
      label: "CO₂ Risparmiata"
    },
    rimanente: {
      label: "Rimanente"
    }
  };

  // Mock DPP products for conservation - Updated with new names
  const conservedDpps = [{
    id: "DPP-PRADA-001",
    name: "Borsa Saffiano",
    brand: "PRADA",
    model: "1BA274",
    image: "/lovable-uploads/68f725b5-ee07-4329-b173-31ae580fbafd.png",
    purchaseDate: "2024-01-15",
    warranty: {
      period: "2 anni",
      expires: "2026-01-15"
    },
    sustainability: {
      score: 92,
      certifications: ["Made in Italy", "Pelle certificata"]
    },
    value: "€ 2.850",
    category: "Pelletteria"
  }, {
    id: "DPP-ROLEX-002",
    name: "Submariner Date",
    brand: "ROLEX",
    model: "126610LN",
    image: "/lovable-uploads/7676b5a7-2456-4cc9-ae9c-3e50d71dd284.png",
    purchaseDate: "2023-11-20",
    warranty: {
      period: "5 anni",
      expires: "2028-11-20"
    },
    sustainability: {
      score: 88,
      certifications: ["Swiss Made", "Oro responsabile"]
    },
    value: "€ 9.150",
    category: "Orologeria"
  }, {
    id: "DPP-ANTINORI-003",
    name: "Vino premium 1976",
    brand: "ANTINORI",
    model: "Annata Storica",
    image: "/lovable-uploads/e6e197da-58a6-4031-8816-149b1b1c4009.png",
    purchaseDate: "2024-02-10",
    warranty: {
      period: "Garanzia autenticità",
      expires: "Permanente"
    },
    sustainability: {
      score: 85,
      certifications: ["Biologico", "DOC", "Carbon Neutral"]
    },
    value: "€ 850",
    category: "Enologia"
  }, {
    id: "DPP-DIOR-004",
    name: "Crema luxury",
    brand: "DIOR",
    model: "Orchidée Impériale",
    image: "/lovable-uploads/eb509000-2638-4dc3-a12a-7e665a749f1e.png",
    purchaseDate: "2024-03-05",
    warranty: {
      period: "6 mesi",
      expires: "2024-09-05"
    },
    sustainability: {
      score: 78,
      certifications: ["Cruelty Free", "Packaging sostenibile"]
    },
    value: "€ 350",
    category: "Cosmetica"
  }];
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pelletteria':
        return '👜';
      case 'Orologeria':
        return '⌚';
      case 'Tecnologia':
        return '📱';
      case 'Enologia':
        return '🍷';
      case 'Cosmetica':
        return '💄';
      default:
        return '📦';
    }
  };
  const handleTransferWarranty = (productId: string) => {
    if (!transferEmail) {
      toast({
        title: "Email richiesta",
        description: "Inserisci l'email del destinatario",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Garanzia trasferita!",
      description: `La garanzia è stata inviata a ${transferEmail}`
    });
    setTransferEmail("");
  };
  return <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 space-y-3 sm:space-y-0">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <img src="/lovable-uploads/5930bd4d-6869-4b7d-8020-e58372708f8a.png" alt="Virtuosity Logo" className="h-10 w-10 sm:h-16 sm:w-16 object-contain" />
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Virtuosity
              </h1>
            </div>
            <div className="flex items-center justify-center space-x-2">
              
              <Button variant="outline" onClick={() => navigate("/marketplace")} className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 hover:scale-105 transition-all duration-200 text-xs px-2 py-1.5 sm:text-sm sm:px-4 sm:py-2 active:scale-95 bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 hover:from-green-600 hover:to-green-700">
                Exchange
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:scale-105 transition-all duration-200 text-xs px-2 py-1.5 sm:text-sm sm:px-4 sm:py-2 active:scale-95">
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-4 sm:mb-8 text-center sm:text-left">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Benvenuto, Marco! 🌱</h2>
          <p className="text-gray-600 text-xs sm:text-base">Ecco il tuo impatto ambientale di oggi</p>
        </div>

        {/* Stats Cards - Reduced sizes for mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-4 sm:mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-300 to-yellow-500 text-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-1 sm:pb-2 px-2 pt-2 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-yellow-100">CO₂ Risparmiata</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-2 pb-2 sm:px-6 sm:pb-6">
              <div className="text-base sm:text-2xl font-bold">24.3 kg</div>
              <p className="text-xs text-yellow-100 hidden sm:block">+12% questa settimana</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-400 to-green-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-1 sm:pb-2 px-2 pt-2 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-green-100">Punti Totali</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-2 pb-2 sm:px-6 sm:pb-6">
              <div className="text-base sm:text-2xl font-bold">1,275</div>
              <p className="text-xs text-green-100 hidden sm:block">+85 punti oggi</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-1 sm:pb-2 px-2 pt-2 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-100">Certificati</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-2 pb-2 sm:px-6 sm:pb-6">
              <div className="text-base sm:text-2xl font-bold">12</div>
              <p className="text-xs text-blue-100 hidden sm:block">2 nuovi certificati</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-300 to-purple-500 text-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-1 sm:pb-2 px-2 pt-2 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-purple-100">Livello</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-2 pb-2 sm:px-6 sm:pb-6">
              <div className="text-xs sm:text-2xl font-bold">ECO EXPERT</div>
              <Progress value={75} className="h-1.5 sm:h-2 bg-purple-200 [&>div]:bg-green-500" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activities" className="space-y-3 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm h-auto p-1 shadow-md">
            <TabsTrigger value="activities" className="text-[10px] sm:text-sm px-1 py-2 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:text-green-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg">Le Mie Attività</TabsTrigger>
            <TabsTrigger value="certificates" className="text-[10px] sm:text-sm px-1 py-2 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 hover:text-blue-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg">Il Mio Wallet</TabsTrigger>
            <TabsTrigger value="reporting" className="text-[10px] sm:text-sm px-1 py-2 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 hover:text-orange-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg">Segnala </TabsTrigger>
            <TabsTrigger value="dpp" className="text-[10px] sm:text-sm px-1 py-2 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 hover:text-cyan-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg">Riscatta DPP</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-3 sm:space-y-6">
            {/* Activities and Goal Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
              {/* Recent Activities - Takes 2 columns */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      Attività Recenti
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Tracciamento automatico delle tue azioni sostenibili
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 sm:space-y-4">
                      {activities.map(activity => <div key={activity.id} className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-[0.98]">
                          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-sm sm:text-xl flex-shrink-0">
                              {activity.type === 'bike' && '🚴'}
                              {activity.type === 'public_transport' && '🚌'}
                              {activity.type === 'walk' && '🚶'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-xs sm:text-base truncate">{activity.action}</h3>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Smartphone className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate max-w-20 sm:max-w-none">{activity.source}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 flex-shrink-0" />
                                  {activity.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="font-bold text-green-600 text-xs sm:text-base">+{activity.points}</div>
                            <div className="text-xs text-gray-600">{activity.co2Saved}</div>
                          </div>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Goal Chart - Takes 1 column */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      Obiettivo Mensile
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      La tua sfida personale di gennaio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4">
                      <ChartContainer config={chartConfig} className="w-full h-full">
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} startAngle={90} endAngle={450} dataKey="value">
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ChartContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                          {Math.round(progressPercentage)}%
                        </div>
                        <div className="text-xs text-gray-500">completato</div>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2 w-full">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Risparmiata:</span>
                        <span className="font-semibold text-green-600">{currentSaved} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Obiettivo:</span>
                        <span className="font-semibold text-blue-600">{monthlyGoal} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mancano:</span>
                        <span className="font-semibold text-orange-600">{(monthlyGoal - currentSaved).toFixed(1)} kg</span>
                      </div>
                      
                      <Progress value={progressPercentage} className="h-2 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-500" />
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Hai {31 - new Date().getDate()} giorni per raggiungere l'obiettivo! 🌱
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Gamification Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  Le Mie Sfide!
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Compete con altri utenti e dipendenti per essere più sostenibili
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {/* Horizontal grid for challenges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {challenges.map(challenge => <div key={challenge.id} className={`p-3 sm:p-4 rounded-lg border-2 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer ${getStatusColor(challenge.status)}`}>
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-sm sm:text-base truncate">{challenge.title}</h3>
                              <Badge className={`text-xs ${getPositionBadge(challenge.yourPosition)}`}>
                                #{challenge.yourPosition}
                              </Badge>
                            </div>
                            <p className="text-xs opacity-90">{challenge.description}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            <Users className="h-3 w-3" />
                            <span className="text-xs">{challenge.participants}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-3">
                          <div>
                            <p className="text-xs opacity-75">🥇 In testa</p>
                            <p className="font-semibold text-xs sm:text-sm">{challenge.leadingUser}</p>
                            <p className="text-xs opacity-90">{challenge.leadingScore}</p>
                          </div>
                          <div>
                            <p className="text-xs opacity-75">🎯 Il tuo punteggio</p>
                            <p className="font-semibold text-xs sm:text-sm">{challenge.yourScore}</p>
                            <p className="text-xs opacity-90">Categoria: {challenge.category}</p>
                          </div>
                        </div>

                        <div className="mb-2 sm:mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progresso</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} className="h-1.5 sm:h-2 bg-white/20 [&>div]:bg-white" />
                        </div>
                        
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Tempo rimanente: {challenge.timeLeft}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            <span>{challenge.prize}</span>
                          </div>
                        </div>
                      </div>)}
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg text-xs sm:text-sm py-2 sm:py-3">
                      <Target className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Partecipa a Nuove Sfide
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-3 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
              {/* Blockchain Certificates - Left Column */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    Certificati Blockchain
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    I tuoi certificati digitali verificati e tracciabili
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {certificates.map(cert => <div key={cert.id} className="p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                        <div className="flex justify-between items-start mb-2 sm:mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm sm:text-lg text-gray-900 truncate">{cert.title}</h3>
                            <p className="text-xs text-gray-600">ID: {cert.id}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 text-xs ml-2 flex-shrink-0">
                            {cert.status === 'verified' ? 'Verificato' : 'In verifica'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                          <div>
                            <p className="text-xs text-gray-600">CO₂ Risparmiata</p>
                            <p className="font-bold text-green-600 text-sm">{cert.co2Saved}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Punti</p>
                            <p className="font-bold text-blue-600 text-sm">{cert.points}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Data</p>
                            <p className="font-bold text-gray-900 text-sm">{cert.validatedAt}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <p className="text-xs text-gray-500 font-mono truncate">
                            Hash: {cert.blockchainHash}
                          </p>
                          <Button size="sm" variant="outline" className="text-xs self-start sm:self-auto hover:bg-blue-50 hover:border-blue-300 hover:scale-105 active:scale-95 transition-all duration-200">
                            Visualizza in Blockchain
                          </Button>
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>

              {/* DPP Conservation - Right Column */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                    <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    I Miei DPP
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Conserva e gestisci i passaporti digitali dei tuoi prodotti
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {conservedDpps.map(dpp => <div key={dpp.id} className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <img src={dpp.image} alt={dpp.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-gray-900 truncate">{dpp.brand}</h3>
                            <p className="text-xs text-gray-600 truncate">{dpp.name}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-semibold text-green-600">{dpp.value}</span>
                              <Badge className="text-xs bg-green-100 text-green-800">
                                Score: {dpp.sustainability.score}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 text-xs hover:bg-green-50 hover:border-green-300">
                            <Eye className="h-3 w-3 mr-1" />
                            Dettagli
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="flex-1 text-xs bg-green-600 hover:bg-green-700">
                                <Shield className="h-3 w-3 mr-1" />
                                Garanzia
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Shield className="h-5 w-5 text-green-600" />
                                  Garanzia Digitale
                                </DialogTitle>
                                <DialogDescription>
                                  Passaporto digitale e garanzia del prodotto
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                {/* Product Info */}
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <img src={dpp.image} alt={dpp.name} className="w-16 h-16 object-cover rounded-lg" />
                                  <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{dpp.brand}</h3>
                                    <p className="text-sm text-gray-600">{dpp.name}</p>
                                    <p className="text-xs text-gray-500">Modello: {dpp.model}</p>
                                    <Badge className="mt-1 text-xs bg-green-100 text-green-800">
                                      {dpp.category}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Warranty Details */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-gray-600">Acquisto</Label>
                                    <p className="font-semibold text-sm">{new Date(dpp.purchaseDate).toLocaleDateString('it-IT')}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-600">Valore</Label>
                                    <p className="font-semibold text-sm text-green-600">{dpp.value}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-600">Garanzia</Label>
                                    <p className="font-semibold text-sm">{dpp.warranty.period}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-600">Scadenza</Label>
                                    <p className="font-semibold text-sm text-orange-600">{new Date(dpp.warranty.expires).toLocaleDateString('it-IT')}</p>
                                  </div>
                                </div>

                                {/* Transfer Section */}
                                <div className="border-t pt-4">
                                  <Label className="text-sm font-medium mb-2 block">Trasferisci Garanzia</Label>
                                  <div className="flex gap-2">
                                    <div className="flex-1">
                                      <Input type="email" placeholder="Email destinatario" value={transferEmail} onChange={e => setTransferEmail(e.target.value)} className="text-sm" />
                                    </div>
                                    <Button size="sm" onClick={() => handleTransferWarranty(dpp.id)} className="bg-blue-600 hover:bg-blue-700">
                                      <Send className="h-4 w-4 mr-1" />
                                      Invia
                                    </Button>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    La garanzia sarà trasferita al nuovo proprietario
                                  </p>
                                </div>

                                {/* Sustainability Score */}
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <Label className="text-sm font-medium">Punteggio Sostenibilità</Label>
                                    <Badge className="bg-green-100 text-green-800">
                                      {dpp.sustainability.score}/100
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {dpp.sustainability.certifications.map((cert, index) => <Badge key={index} variant="outline" className="text-xs">
                                        {cert}
                                      </Badge>)}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>)}
                    
                    <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-xs">
                      <QrCode className="mr-2 h-3 w-3" />
                      Aggiungi Nuovo DPP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reporting" className="space-y-3 sm:space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  Segnala Problema al Comune
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Contribuisci al miglioramento della tua città segnalando problemi urbani
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CitizenReporting />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dpp" className="space-y-3 sm:space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                  <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  Verifica Passaporto Digitale del Prodotto
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Scansiona il QR code per verificare l'origine e la sostenibilità del prodotto
                </CardDescription>
              </CardHeader>
              <CardContent id="dpp-wallet-section">
                <DppVerification />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};

export default Dashboard;
