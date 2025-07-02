import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Leaf, Gift, Star, ShoppingCart, ArrowLeft, Menu, ExternalLink, Calendar, MapPin, Heart, Building2, HandHeart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const Exchange = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedExchangeType, setSelectedExchangeType] = useState("company-rewards");

  useEffect(() => {
    document.title = "Exchange - Virtuosity";
  }, []);

  const rewards = [{
    id: 1,
    title: "Buono Pasto",
    description: "Buono spendibile in mense aziendali partner",
    cost: 250,
    category: "welfare",
    image: "/lovable-uploads/459d53b2-6725-4ac2-b105-ef9ec469b6ee.png",
    availability: "Disponibile",
    provider: "Corporate Benefits"
  }, {
    id: 2,
    title: "Abbonamento Metro Gratuito",
    description: "Viaggio gratuito su tutta la rete ATM Milano",
    cost: 80,
    category: "transport",
    image: "/lovable-uploads/ac2feaf6-0c76-4bb7-ab58-1faf2c54536b.png",
    availability: "Limitato",
    provider: "ATM Milano"
  }, {
    id: 3,
    title: "Ingresso Museo Gratuito",
    description: "Accesso gratuito ai musei civici di Milano",
    cost: 150,
    category: "culture",
    image: "/lovable-uploads/e4a99bff-4999-4a87-ad15-5840490e22cc.png",
    availability: "Disponibile",
    provider: "Comune di Milano"
  }, {
    id: 4,
    title: "Visita Odontoiatrica",
    description: "Visita dentistica completa presso cliniche convenzionate",
    cost: 500,
    category: "welfare",
    image: "/lovable-uploads/b5488416-c6e5-4aca-ad68-7812221c407e.png",
    availability: "Disponibile",
    provider: "Cliniche Partner"
  }, {
    id: 5,
    title: "Giorno di Permesso Extra",
    description: "Un giorno di permesso aggiuntivo retribuito",
    cost: 800,
    category: "welfare",
    image: "/lovable-uploads/6d33073c-cfa1-4bae-9825-e8418293e92d.png",
    availability: "Limitato",
    provider: "HR Department"
  }, {
    id: 6,
    title: "Bike Sharing Premium",
    description: "30 giorni di bike sharing illimitato",
    cost: 300,
    category: "transport",
    image: "/lovable-uploads/234b99d5-8d1a-4a99-82be-7cc0cb1280fa.png",
    availability: "Disponibile",
    provider: "Mobike"
  }];

  const socialProjects = [{
    id: 1,
    title: "Riforestazione Urbana",
    description: "Piantumazione di alberi nelle aree metropolitane per migliorare la qualità dell'aria",
    certificatesNeeded: 15,
    association: "Green City Milano",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    category: "ambiente",
    impact: "500 alberi piantati",
    location: "Milano, Lombardia"
  }, {
    id: 2,
    title: "Mensa per i Bisognosi",
    description: "Fornitura di pasti caldi per persone in difficoltà economica",
    certificatesNeeded: 25,
    association: "Caritas Milano",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop",
    category: "sociale",
    impact: "1000 pasti serviti",
    location: "Milano Centro"
  }, {
    id: 3,
    title: "Pulizia Fiumi e Laghi",
    description: "Rimozione di rifiuti plastici da corsi d'acqua e zone lacustri",
    certificatesNeeded: 20,
    association: "Plastic Free Lombardia",
    image: "/lovable-uploads/5ae239bd-f754-4970-9792-5591a5b6c34c.png",
    category: "ambiente",
    impact: "2 tonnellate di rifiuti rimossi",
    location: "Navigli Milano"
  }];

  const userPoints = 1275;
  const userCertificates = 45;

  const exchangeTypes = [
    { 
      value: "company-rewards", 
      label: "Premi Aziendali", 
      icon: Building2,
      description: "Scambia i tuoi certificati con welfare aziendale",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    { 
      value: "social-projects", 
      label: "Progetti Sociali", 
      icon: HandHeart,
      description: "Dona certificati per supportare la comunità",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100"
    },
    { 
      value: "partner-offers", 
      label: "Offerte Partner", 
      icon: Users,
      description: "Scopri le proposte sostenibili dei partner",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50"
    }
  ];

  const partnerOffers = [{
    id: 1,
    partner: "ENEL",
    title: "Fotovoltaico Residenziale",
    description: "Installa pannelli solari a casa tua con incentivi esclusivi per utenti Virtuosity",
    discount: "Sconto 15%",
    category: "energia",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
    validUntil: "31 Marzo 2026",
    pointsRequired: 0,
    benefits: ["Consulenza gratuita", "Installazione inclusa", "10 anni di garanzia"],
    websiteUrl: "https://www.enel.it/it/casa/fotovoltaico"
  }, {
    id: 2,
    partner: "GARDALAND",
    title: "Nuove Attrazioni Eco-Friendly",
    description: "Scopri le nuove giostre alimentate da energia rinnovabile nel parco più green d'Italia",
    discount: "Biglietto ridotto",
    category: "intrattenimento",
    image: "/lovable-uploads/77ba3a56-4d7a-4241-b56e-08c75ca1dc37.png",
    validUntil: "30 Giugno 2026",
    pointsRequired: 200,
    benefits: ["Accesso prioritario", "Pranzo sostenibile incluso", "Gadget ecologico"],
    websiteUrl: "https://www.gardaland.it"
  }, {
    id: 3,
    partner: "PAX ITALIA",
    title: "Smartpos per Attività Commerciali",
    description: "Sistema di pagamento intelligente che permette di scambiare certificati Virtuosity con sconti per i clienti",
    discount: "Sconto 25% sul canone",
    category: "tecnologia",
    image: "/lovable-uploads/8bceb592-fe5b-4d95-a7f0-50b9d1e5cf08.png",
    validUntil: "31 Dicembre 2026",
    pointsRequired: 300,
    benefits: ["Integrazione certificati Virtuosity", "Dashboard analytics inclusa", "Supporto tecnico dedicato"],
    websiteUrl: "https://www.pax.it"
  }, {
    id: 4,
    partner: "BANCA GREEN",
    title: "Conto Corrente Green Zero Spese",
    description: "Azzeramento del canone mensile del conto corrente per i clienti che dimostrano comportamenti sostenibili",
    discount: "Canone gratuito",
    category: "bancario",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    validUntil: "31 Dicembre 2026",
    pointsRequired: 500,
    benefits: ["Canone azzerato per 12 mesi", "Carte di debito gratuite", "Consulenza finanziaria ESG"],
    websiteUrl: "https://www.intesasanpaolo.com"
  }, {
    id: 5,
    partner: "SAMSUNG",
    title: "Galaxy Watch Virtuosity Edition",
    description: "L'ultimo smartwatch Samsung ottimizzato per registrare meglio i dati di sostenibilità di Virtuosity rispetto ad altri dispositivi",
    discount: "Sconto 20%",
    category: "tecnologia",
    image: "/lovable-uploads/5bd78591-1131-4fe0-be3f-1f508608b667.png",
    validUntil: "30 Aprile 2026",
    pointsRequired: 400,
    benefits: ["Sensori avanzati per eco-tracking", "App Virtuosity preinstallata", "Cinturino ecologico incluso"],
    websiteUrl: "https://www.samsung.com/it/watches/"
  }, {
    id: 6,
    partner: "COOP",
    title: "Prodotti Biologici Locali",
    description: "Selezione esclusiva di prodotti bio a km zero dai migliori produttori lombardi",
    discount: "Sconto 10%",
    category: "alimentare",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    validUntil: "31 Maggio 2026",
    pointsRequired: 100,
    benefits: ["Spesa a domicilio", "Ricette esclusive", "Degustazioni gratuite"],
    websiteUrl: "https://www.e-coop.it"
  }];

  const getCategoryColor = (category: string) => {
    const colors = {
      corporate: "bg-blue-100 text-blue-800",
      transport: "bg-green-100 text-green-800",
      culture: "bg-purple-100 text-purple-800",
      welfare: "bg-orange-100 text-orange-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getCategoryName = (category: string) => {
    const names = {
      corporate: "Aziendale",
      transport: "Trasporti",
      culture: "Cultura",
      welfare: "Welfare"
    };
    return names[category as keyof typeof names] || category;
  };

  const getSocialCategoryColor = (category: string) => {
    const colors = {
      ambiente: "bg-green-100 text-green-800",
      sociale: "bg-blue-100 text-blue-800",
      educazione: "bg-purple-100 text-purple-800",
      animali: "bg-orange-100 text-orange-800",
      infanzia: "bg-pink-100 text-pink-800",
      disabilità: "bg-cyan-100 text-cyan-800",
      comunità: "bg-yellow-100 text-yellow-800",
      cultura: "bg-indigo-100 text-indigo-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getCategoryColorAd = (category: string) => {
    const colors = {
      energia: "bg-yellow-100 text-yellow-800",
      intrattenimento: "bg-pink-100 text-pink-800",
      cultura: "bg-purple-100 text-purple-800",
      trasporti: "bg-green-100 text-green-800",
      casa: "bg-blue-100 text-blue-800",
      alimentare: "bg-orange-100 text-orange-800",
      automotive: "bg-red-100 text-red-800",
      sport: "bg-cyan-100 text-cyan-800",
      ambiente: "bg-emerald-100 text-emerald-800",
      bancario: "bg-indigo-100 text-indigo-800",
      tecnologia: "bg-slate-100 text-slate-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleRedeem = (reward: any) => {
    if (userPoints >= reward.cost) {
      toast({
        title: "Riscatto Completato! 🎉",
        description: `Hai riscattato: ${reward.title}. Riceverai istruzioni via email.`
      });
    } else {
      toast({
        title: "Punti Insufficienti",
        description: `Ti servono ${reward.cost - userPoints} punti in più per questo premio.`,
        variant: "destructive"
      });
    }
  };

  const handleDonate = (project: any) => {
    if (userCertificates >= project.certificatesNeeded) {
      setSelectedProject(project);
      setShowDonationDialog(true);
    } else {
      toast({
        title: "Certificati Insufficienti",
        description: `Ti servono ${project.certificatesNeeded - userCertificates} certificati in più per supportare questo progetto.`,
        variant: "destructive"
      });
    }
  };

  const handlePartnerOfferClick = (offer: any) => {
    if (offer.pointsRequired > userPoints && offer.pointsRequired > 0) {
      toast({
        title: "Punti Insufficienti",
        description: `Ti servono ${offer.pointsRequired - userPoints} punti in più per accedere a questa offerta.`,
        variant: "destructive"
      });
      return;
    }

    // Open partner website in new tab
    window.open(offer.websiteUrl, '_blank', 'noopener,noreferrer');

    toast({
      title: "Offerta Attivata! 🎉",
      description: `Ti abbiamo reindirizzato al sito di ${offer.partner}. Mostra questo messaggio per ottenere lo sconto.`
    });
  };

  const renderCompanyRewards = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Premi Aziendali 🏢</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
          Utilizza i tuoi punti per ottenere vantaggi esclusivi offerti dalla tua azienda
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm text-xs sm:text-sm shadow-md">
          <TabsTrigger value="all" className="px-2 sm:px-4 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100 hover:text-gray-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-400 data-[state=active]:to-slate-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
            Tutti
          </TabsTrigger>
          <TabsTrigger value="transport" className="px-1 sm:px-4 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:text-green-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
            Trasporti
          </TabsTrigger>
          <TabsTrigger value="culture" className="px-1 sm:px-4 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
            Cultura
          </TabsTrigger>
          <TabsTrigger value="welfare" className="px-1 sm:px-4 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 hover:text-orange-700 active:scale-95 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
            Welfare
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img src={reward.image} alt={reward.title} className="w-full h-40 sm:h-48 object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge className={getCategoryColor(reward.category)}>
                      {getCategoryName(reward.category)}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">{reward.title}</CardTitle>
                  <CardDescription className="text-sm">{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Costo</span>
                      <span className="font-bold text-base sm:text-lg text-blue-600">{reward.cost} punti</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Disponibilità</span>
                      <Badge variant={reward.availability === "Disponibile" ? "default" : "secondary"}>
                        {reward.availability}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Partner: {reward.provider}
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 text-sm sm:text-base" onClick={() => handleRedeem(reward)} disabled={userPoints < reward.cost} size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {userPoints >= reward.cost ? "Riscatta Ora" : "Punti Insufficienti"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["transport", "culture", "welfare"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {rewards
                .filter((reward) => reward.category === category)
                .map((reward) => (
                  <Card key={reward.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img src={reward.image} alt={reward.title} className="w-full h-40 sm:h-48 object-cover" />
                      <div className="absolute top-3 right-3">
                        <Badge className={getCategoryColor(reward.category)}>
                          {getCategoryName(reward.category)}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg">{reward.title}</CardTitle>
                      <CardDescription className="text-sm">{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Costo</span>
                          <span className="font-bold text-base sm:text-lg text-blue-600">{reward.cost} punti</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Disponibilità</span>
                          <Badge variant={reward.availability === "Disponibile" ? "default" : "secondary"}>
                            {reward.availability}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Partner: {reward.provider}
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 text-sm sm:text-base" onClick={() => handleRedeem(reward)} disabled={userPoints < reward.cost} size="sm">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {userPoints >= reward.cost ? "Riscatta Ora" : "Punti Insufficienti"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  const renderSocialProjects = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Progetti Sociali ❤️</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
          Dona i tuoi certificati per supportare progetti sociali delle associazioni e fare la differenza nella comunità
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {socialProjects.map((project) => (
          <Card key={project.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img src={project.image} alt={project.title} className="w-full h-40 sm:h-48 object-cover" />
              <div className="absolute top-3 right-3">
                <Badge className={getSocialCategoryColor(project.category)}>
                  {project.category}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">{project.title}</CardTitle>
              <CardDescription className="text-sm">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Certificati necessari</span>
                  <span className="font-bold text-base sm:text-lg text-red-600">{project.certificatesNeeded}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Associazione</span>
                  <span className="font-semibold text-blue-600">{project.association}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Impatto previsto</span>
                  <span className="font-semibold text-green-600">{project.impact}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{project.location}</span>
                </div>

                <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 text-sm" size="sm" onClick={() => handleDonate(project)} disabled={userCertificates < project.certificatesNeeded}>
                  <Heart className="h-4 w-4 mr-2" />
                  {userCertificates >= project.certificatesNeeded ? "Dona Ora" : "Certificati Insufficienti"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPartnerOffers = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Offerte Partner Esclusive 🤝</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
          Scopri le proposte sostenibili dei nostri partner e approfitta di sconti esclusivi per utenti Virtuosity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {partnerOffers.map((offer) => (
          <Card key={offer.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img src={offer.image} alt={offer.title} className="w-full h-40 sm:h-48 object-cover" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-gray-800 font-bold">
                  {offer.partner}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className={getCategoryColorAd(offer.category)}>
                  {offer.discount}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">{offer.title}</CardTitle>
              <CardDescription className="text-sm">{offer.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Valido fino al</span>
                  </div>
                  <span className="font-semibold">{offer.validUntil}</span>
                </div>

                {offer.pointsRequired > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Punti richiesti</span>
                    <span className="font-bold text-blue-600">{offer.pointsRequired} punti</span>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-2">Benefici inclusi:</p>
                  <div className="space-y-1">
                    {offer.benefits.slice(0, 2).map((benefit, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-700">
                        <Star className="h-3 w-3 text-yellow-500 mr-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                    {offer.benefits.length > 2 && (
                      <div className="flex items-center text-xs text-gray-700">
                        <Star className="h-3 w-3 text-yellow-500 mr-1 flex-shrink-0" />
                        <span>+{offer.benefits.length - 2} altri vantaggi</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 text-sm" size="sm" onClick={() => handlePartnerOfferClick(offer)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {offer.pointsRequired > userPoints && offer.pointsRequired > 0 ? "Punti Insufficienti" : "Scopri l'Offerta"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mr-1 sm:mr-2 p-2 sm:p-3" size="sm">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <img src="/lovable-uploads/5930bd4d-6869-4b7d-8020-e58372708f8a.png" alt="Virtuosity Logo" className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mx-auto object-contain" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Exchange
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-base">
                💎 {userPoints}
              </div>
              <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-base">
                🏆 {userCertificates}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Scambia i Tuoi Punti 🎁</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Hai guadagnato punti con le tue azioni sostenibili. È ora di trasformarli in premi reali!
          </p>
        </div>

        {/* Points Summary - Same as Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-300 to-yellow-500 text-white">
            <CardHeader className="pb-1 px-3 pt-3">
              <CardTitle className="text-xs font-medium text-yellow-100">Punti Disponibili</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold">{userPoints}</div>
              <p className="text-xs text-yellow-100">Guadagnati con 24 attività</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-400 to-green-600 text-white">
            <CardHeader className="pb-1 px-3 pt-3">
              <CardTitle className="text-xs font-medium text-green-100">Certificati Disponibili</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold">{userCertificates}</div>
              <p className="text-xs text-green-100">Per donazioni sociali</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <CardHeader className="pb-1 px-3 pt-3">
              <CardTitle className="text-xs font-medium text-blue-100">Premi Riscattati</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold">8</div>
              <p className="text-xs text-blue-100">Questo mese</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-300 to-purple-500 text-white">
            <CardHeader className="pb-1 px-3 pt-3">
              <CardTitle className="text-xs font-medium text-purple-100">Livello VIP</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-base font-bold">ECO EXPERT</div>
              <p className="text-xs text-purple-100">Bonus del 15%</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Exchange Type Selection - Reduced by 30% */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Scegli il Tipo di Scambio
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Seleziona come utilizzare i tuoi punti e certificati
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {exchangeTypes.map((type) => (
              <Card 
                key={type.value}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 shadow-md backdrop-blur-sm ${
                  selectedExchangeType === type.value 
                    ? `border-transparent bg-gradient-to-br ${type.color.replace('from-', 'from-').replace('to-', 'to-')} text-white shadow-lg transform scale-105` 
                    : `border-gray-200 bg-white/80 hover:border-green-300 ${type.bgColor}`
                }`}
                onClick={() => setSelectedExchangeType(type.value)}
              >
                <CardHeader className="text-center pb-1 sm:pb-2 px-2 pt-2 sm:px-4 sm:pt-4">
                  <div className={`mx-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                    selectedExchangeType === type.value 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : `bg-gradient-to-br ${type.color}`
                  }`}>
                    <type.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      selectedExchangeType === type.value ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  <CardTitle className={`text-sm sm:text-base font-bold ${
                    selectedExchangeType === type.value 
                      ? 'text-white' 
                      : 'text-gray-900'
                  }`}>
                    {type.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-2 pb-2 sm:px-4 sm:pb-4">
                  <p className={`text-xs sm:text-sm ${
                    selectedExchangeType === type.value 
                      ? 'text-white/90' 
                      : 'text-gray-600'
                  }`}>
                    {type.description}
                  </p>
                  {selectedExchangeType === type.value && (
                    <div className="mt-1 sm:mt-2">
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        ✓ Selezionato
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dynamic Content Based on Selection */}
        <div className="mb-8 sm:mb-12">
          {selectedExchangeType === "company-rewards" && renderCompanyRewards()}
          {selectedExchangeType === "social-projects" && renderSocialProjects()}
          {selectedExchangeType === "partner-offers" && renderPartnerOffers()}
        </div>

        {/* Bottom Info */}
        <div className="mt-8 sm:mt-12 bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
          <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">💡 Come Funziona</h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2">
            I punti vengono guadagnati automaticamente attraverso le tue azioni sostenibili. 
            Ogni certificato blockchain validato ti dà diritto a premi esclusivi. 
            Più sei sostenibile, più premi puoi ottenere!
          </p>
          <p className="text-gray-600 text-xs sm:text-sm">
            <strong>Progetti Sociali:</strong> Dona i tuoi certificati per supportare iniziative benefiche delle associazioni. 
            I certificati rappresentano il valore sociale delle tue azioni sostenibili e possono essere convertiti in aiuti concreti per la comunità.
          </p>
        </div>
      </div>

      {/* Donation Success Dialog */}
      <AlertDialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
        <AlertDialogContent className="max-w-md bg-white border-0 shadow-2xl">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Congratulazioni! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 space-y-2">
              <p>Hai donato con successo {selectedProject?.certificatesNeeded} certificati al progetto:</p>
              <p className="font-semibold text-gray-900">"{selectedProject?.title}"</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mt-4">
                <div className="text-4xl mb-2">🏆</div>
                <p className="font-semibold text-green-700">Questo è il tuo badge!</p>
                <p className="text-sm text-green-600">Lo troverai nel tuo wallet come certificato di donazione.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700" onClick={() => setShowDonationDialog(false)}>
              Perfetto! 🚀
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Exchange;
