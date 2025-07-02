import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, ArrowLeft, Shield, Zap, Globe, Award, Users, TrendingUp, CheckCircle, Target, Heart, Lightbulb, Droplets, Recycle, Battery, MapPin, Building, Euro, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CertificateTypeCard = ({
  cert
}) => <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
    <CardHeader className="text-center">
      <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
        <img src={cert.image} alt={cert.title} className="w-full h-full object-contain" />
      </div>
      <CardTitle className="text-lg">{cert.title}</CardTitle>
      <CardDescription className="text-gray-600">
        {cert.description}
      </CardDescription>
    </CardHeader>
  </Card>;
const FeatureCard = ({
  feature
}) => <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
    <CardHeader>
      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white mb-4">
        {feature.icon}
      </div>
      <CardTitle className="text-lg">{feature.title}</CardTitle>
      <CardDescription className="text-gray-600">
        {feature.description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {feature.details.map((detail, idx) => <div key={idx} className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
            {detail}
          </div>)}
      </div>
    </CardContent>
  </Card>;
const BenefitCard = ({
  benefit
}) => <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
    <CardHeader className="text-center">
      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
        {benefit.icon}
      </div>
      <CardTitle className="text-xl">{benefit.title}</CardTitle>
      <CardDescription>{benefit.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {benefit.points.map((point, idx) => <div key={idx} className="flex items-start text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            {point}
          </div>)}
      </div>
    </CardContent>
  </Card>;
const RoadmapCard = ({
  phase
}) => <Card className={`border-0 shadow-lg ${phase.status === 'completed' ? 'bg-green-50' : phase.status === 'current' ? 'bg-blue-50' : 'bg-gray-50'}`}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <Badge variant={phase.status === 'completed' ? 'default' : phase.status === 'current' ? 'secondary' : 'outline'} className={phase.status === 'completed' ? 'bg-green-500' : phase.status === 'current' ? 'bg-blue-500' : ''}>
          {phase.phase}
        </Badge>
        {phase.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
      </div>
      <CardTitle className="text-lg">{phase.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {phase.items.map((item, idx) => <div key={idx} className="flex items-center text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full mr-2 ${phase.status === 'completed' ? 'bg-green-400' : phase.status === 'current' ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
            {item}
          </div>)}
      </div>
    </CardContent>
  </Card>;
const TeamMemberCard = ({
  member
}) => <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center">
    <CardHeader className="text-center">
      <div className="text-6xl mb-4">{member.image}</div>
      <CardTitle className="text-xl text-center">{member.name}</CardTitle>
      <div className="flex justify-center">
        <Badge variant="secondary">{member.role}</Badge>
      </div>
    </CardHeader>
    <CardContent className="text-center">
      <p className="text-sm text-gray-600 text-center">{member.bio}</p>
    </CardContent>
  </Card>;
const IntegrationCard = ({
  integration
}) => <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
    <CardHeader className="text-center">
      <div className="text-4xl mb-2">{integration.icon}</div>
      <CardTitle className="text-lg">{integration.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2 justify-center">
        {integration.providers.map((provider, idx) => <Badge key={idx} variant="secondary" className="text-xs">
            {provider}
          </Badge>)}
      </div>
    </CardContent>
  </Card>;
const PrivacySecurityCard = () => <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 via-blue-50 to-green-50">
    <CardHeader className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
        <Shield className="h-8 w-8" />
      </div>
      <CardTitle className="text-3xl font-bold text-gray-900">
        Privacy e Sicurezza con Zero-Knowledge Proofs
      </CardTitle>
      <CardDescription className="text-lg text-gray-700 max-w-4xl mx-auto">
        La tua privacy è al sicuro grazie alle Zero-Knowledge Proofs (ZKP), 
        che permettono di verificare i tuoi comportamenti sostenibili senza rivelare dati personali sensibili
      </CardDescription>
      
      <div className="mt-8 mb-8">
        <img 
          src="/lovable-uploads/56496a06-43af-4808-b63c-de4e8104341d.png" 
          alt="Dashboard Utente Virtuosity - Tracciamento Sostenibilità Personale" 
          className="mx-auto rounded-lg shadow-2xl max-w-[80%] sm:max-w-[70%] md:max-w-[60%] h-auto border border-gray-200"
        />
        <p className="text-sm text-gray-600 mt-3 italic">
          Dashboard utente: monitora le tue attività sostenibili quotidiane e i certificati blockchain generati
        </p>
      </div>
    </CardHeader>
    <CardContent className="p-8">
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div>
          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 text-purple-500 mr-3" />
            Cosa sono le Zero-Knowledge Proofs
          </h4>
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
              <div>
                <strong>Prova senza Rivelazione:</strong> Le ZKP permettono di dimostrare che hai compiuto un'azione sostenibile senza rivelare dettagli personali come posizione esatta, orari specifici o abitudini
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
              <div>
                <strong>Crittografia Avanzata:</strong> Utilizzano algoritmi matematici complessi per creare prove verificabili senza esporre i dati sottostanti
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
              <div>
                <strong>Standard Industriale:</strong> Tecnologia utilizzata da blockchain leader come Ethereum e protocolli DeFi per garantire privacy e sicurezza
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 text-blue-500 mr-3" />
            Come Funziona in Virtuosity
          </h4>
          <div className="space-y-4">
            <div className="flex items-start">
              <Zap className="w-5 h-5 text-blue-500 mr-3 mt-1" />
              <div>
                <strong>Raccolta Dati Minimale:</strong> L'app rileva solo l'essenziale (es. "hai usato una bici") senza registrare percorsi dettagliati o orari precisi
              </div>
            </div>
            <div className="flex items-start">
              <Award className="w-5 h-5 text-purple-500 mr-3 mt-1" />
              <div>
                <strong>Proof Generation:</strong> I tuoi dispositivi generano localmente prove crittografiche che dimostrano l'azione sostenibile senza inviare dati raw
              </div>
            </div>
            <div className="flex items-start">
              <Globe className="w-5 h-5 text-green-500 mr-3 mt-1" />
              <div>
                <strong>Verifica Blockchain:</strong> Le prove vengono verificate sulla blockchain senza mai esporre i tuoi dati personali, generando certificati anonimi
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="border border-purple-200 bg-white/50">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mb-3 mx-auto">
              <Shield className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg">Anonimato Totale</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              Nessun dato personale identificabile viene mai memorizzato o trasmesso. 
              Solo le prove matematiche delle tue azioni sostenibili.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-white/50">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mb-3 mx-auto">
              <Zap className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg">Elaborazione Locale</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              Le ZKP vengono generate direttamente sul tuo dispositivo. 
              I dati sensibili non lasciano mai il tuo telefono.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-green-200 bg-white/50">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 mx-auto">
              <CheckCircle className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg">Conformità GDPR</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              Privacy by design e conformità totale alle normative europee. 
              I tuoi diritti digitali sono sempre protetti.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white/70 rounded-lg p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Esempio Pratico: Come Funziona</h4>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2 mx-auto text-sm font-bold">1</div>
            <h5 className="font-bold text-sm mb-1">Azione Sostenibile</h5>
            <p className="text-xs text-gray-600">Usi una bici elettrica per 5km</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mb-2 mx-auto text-sm font-bold">2</div>
            <h5 className="font-bold text-sm mb-1">Generazione ZKP</h5>
            <p className="text-xs text-gray-600">Il tuo phone crea una prova: "ho risparmiato CO2" senza rivelare dove/quando</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white mb-2 mx-auto text-sm font-bold">3</div>
            <h5 className="font-bold text-sm mb-1">Verifica Blockchain</h5>
            <p className="text-xs text-gray-600">La rete valida la prova senza accedere ai tuoi dati personali</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white mb-2 mx-auto text-sm font-bold">4</div>
            <h5 className="font-bold text-sm mb-1">Certificato Anonimo</h5>
            <p className="text-xs text-gray-600">Ricevi certificati CO2 verificabili ma completamente anonimi</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-center">
        <h4 className="text-lg font-bold mb-2">Privacy First, Sostenibilità Sempre</h4>
        <p className="text-sm">
          Con Virtuosity, la tua privacy non è negoziabile. Le Zero-Knowledge Proofs garantiscono 
          che puoi dimostrare il tuo impegno per l'ambiente mantenendo il controllo totale sui tuoi dati personali.
        </p>
      </div>
    </CardContent>
  </Card>;
const AdvisorCard = ({
  advisor
}) => <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center">
    <CardHeader>
      <CardTitle className="text-lg">{advisor.name}</CardTitle>
      <Badge variant="secondary" className="text-xs">{advisor.role}</Badge>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{advisor.bio}</p>
    </CardContent>
  </Card>;
const About = () => {
  const navigate = useNavigate();
  const features = [{
    icon: <Zap className="h-6 w-6" />,
    title: "Tracking Automatico",
    description: "Nessun input manuale. Le tue azioni sostenibili vengono rilevate automaticamente tramite sensori del telefono e integrazioni con app esterne.",
    details: ["Accelerometro e GPS", "Integrazione Google Fit/Apple Health", "API Bike/Car Sharing", "Sensori smart city"]
  }, {
    icon: <Shield className="h-6 w-6" />,
    title: "Certificazione Blockchain",
    description: "Ogni azione genera 4 tipologie di certificati digitali verificabili e immutabili su blockchain Ethereum/Polygon: CO2, Rifiuti e Riciclo, Risparmio Energetico e Acqua.",
    details: ["Hash crittografici unici", "Validazione automatica", "Tracciabilità completa", "Standard ESG compliance"]
  }, {
    icon: <Award className="h-6 w-6" />,
    title: "Premi Reali",
    description: "Converti i tuoi certificati in benefit aziendali, sconti sui trasporti, ingressi gratuiti e molto altro tramite il marketplace integrato.",
    details: ["Benefit aziendali", "Sconti trasporti pubblici", "Accessi musei/eventi", "Gift card partner"]
  }, {
    icon: <Users className="h-6 w-6" />,
    title: "Community & Gamification",
    description: "Partecipa a sfide, conquista badge, scala le classifiche e connettiti con altri cittadini virtuosi nella community sostenibile.",
    details: ["Badge achievements", "Classifiche settimanali", "Sfide mensili", "Sistema referral"]
  }];
  const benefits = [{
    icon: <Target className="h-6 w-6" />,
    title: "Per i Cittadini",
    description: "Premi concreti per comportamenti sostenibili quotidiani",
    points: ["Incentivi reali", "Riconoscimento sociale", "Miglioramento qualità vita", "Contributo ambientale misurabile"]
  }, {
    icon: <Heart className="h-6 w-6" />,
    title: "Per le Aziende",
    description: "Strumenti ESG avanzati e coinvolgimento dei dipendenti",
    points: ["Report ESG automatici", "Engagement dei dipendenti", "Riduzione carbon footprint", "Compliance normative"]
  }, {
    icon: <Globe className="h-6 w-6" />,
    title: "Per le Città",
    description: "Dati real-time per politiche di sostenibilità efficaci",
    points: ["Analytics mobilità urbana", "Monitoraggio obiettivi ambientali", "Citizen engagement", "Smart city integration"]
  }];
  const roadmap = [{
    phase: "Gen-Mar 2026",
    title: "MVP & Pilot Cities",
    status: "upcoming",
    items: ["Lancio app mobile", "Prime 5 città pilota", "Integrazione bike sharing", "1000 utenti beta"]
  }, {
    phase: "Apr-Giu 2026",
    title: "Espansione & Partnership",
    status: "upcoming",
    items: ["20 città partner", "Integrazione trasporti pubblici", "10.000 utenti attivi", "Prime aziende B2B"]
  }, {
    phase: "Lug-Dic 2026",
    title: "Marketplace & Blockchain",
    status: "upcoming",
    items: ["Lancio marketplace", "Certificati blockchain", "Integrazione DPP", "100.000 utenti"]
  }, {
    phase: "2027-2028",
    title: "Scala Europea & IA",
    status: "upcoming",
    items: ["Espansione EU", "API pubbliche", "IA predittiva", "1M utenti", "Carbon credit trading"]
  }];
  const integrations = [{
    name: "Bike Sharing",
    providers: ["Mobike", "Lime", "Helbiz"],
    icon: "🚴"
  }, {
    name: "Car Sharing",
    providers: ["Enjoy", "ShareNow", "Car2Go"],
    icon: "🚗"
  }, {
    name: "Trasporti Pubblici",
    providers: ["ATM", "ATAC", "Open Data"],
    icon: "🚌"
  }, {
    name: "Fitness Tracking",
    providers: ["Google Fit", "Apple Health", "Strava"],
    icon: "📱"
  }, {
    name: "Smart Parking",
    providers: ["EasyPark", "ParkMan", "Sensori IoT"],
    icon: "🅿️"
  }, {
    name: "E-Scooters",
    providers: ["Bird", "Voi", "Tier"],
    icon: "🛴"
  }];
  const certificateTypes = [{
    image: "/lovable-uploads/cef6f7ab-d91d-4e9f-8b7e-76e0c1eaa373.png",
    title: "Certificati CO2",
    description: "Riduzione emissioni attraverso mobilità sostenibile",
    color: "from-green-500 to-emerald-600"
  }, {
    image: "/lovable-uploads/9fb70260-01a6-45a7-8a67-f234cf098899.png",
    title: "Rifiuti e Riciclo",
    description: "Gestione responsabile e riciclo dei materiali",
    color: "from-blue-500 to-cyan-600"
  }, {
    image: "/lovable-uploads/16190dbd-ebd1-4b29-968d-8c8f8d26066d.png",
    title: "Risparmio Energetico",
    description: "Ottimizzazione consumi e efficienza energetica",
    color: "from-yellow-500 to-orange-600"
  }, {
    image: "/lovable-uploads/c6969dcf-1661-4aed-966e-43b21ed8f62a.png",
    title: "Certificati Acqua",
    description: "Conservazione e uso responsabile delle risorse idriche",
    color: "from-blue-400 to-blue-600"
  }];
  const team = [{
    name: "Alessio Pagani",
    role: "Research Director and Data Scientist",
    bio: "PhD in Information Technology | Web3, blockchain, AI, DeFi",
    image: "👨‍🔬"
  }, {
    name: "Gianfranco Leone",
    role: "Web3 Expert Marketing Specialist",
    bio: "Esperto in strategie di marketing per tecnologie blockchain e Web3",
    image: "👨‍💼"
  }, {
    name: "Davide Galbiati",
    role: "Computer Engineer",
    bio: "Web and mobile Developer specializzato in soluzioni digitali innovative",
    image: "👨‍💻"
  }];
  const advisors = [{
    name: "Vincenzo Rana",
    role: "Blockchain Expert",
    bio: "Docente e ricercatore dell'Osservatorio Blockchain & DLT al Politecnico di Milano"
  }, {
    name: "Edoardo Degli Innocenti",
    role: "Web3 Industry Leader",
    bio: "CEO e Co-Founder di B3YOND, principale consorzio Web3 italiano, membro Commissione per l'IA della Presidenza del Consiglio"
  }, {
    name: "Emma Zavarrone",
    role: "Social Statistics Expert",
    bio: "Professore associato di statistica sociale presso la facoltà di Comunicazione, Pubbliche Relazioni e Pubblicità presso IULM, Milano"
  }, {
    name: "Laura Iacovone",
    role: "Economics & Management Expert",
    bio: "Docente e ricercatore del Dipartimento di Economia, Management e Metodi Quantitativi dell'Università degli Studi di Milano"
  }, {
    name: "Andrea Grieco",
    role: "Sustainability Expert",
    bio: "Sustainability Expert - LinkedInTopVoices Green & Climate Change"
  }, {
    name: "Vincenzo Pone",
    role: "Business Ethics Expert",
    bio: "Dott. Commercialista e Revisore dei Conti - Studioso di etica di azienda e delle nuove realtà economiche virtuali"
  }, {
    name: "Sara Noggler",
    role: "Web3 Innovation Expert",
    bio: "Building Milano Future Play - Distributed Minds, Public Speaker Web3"
  }, {
    name: "Stefano Capaccioli",
    role: "CSRD & ESRS Expert",
    bio: "Dottore Commercialista esperto della normativa CSRD e degli standard ESRS"
  }, {
    name: "Paola Vinci",
    role: "Sustainability Reporting Expert",
    bio: "Imprenditrice e consulente esperta in bilanci di sostenibilità. Fondatrice di The Sustainable Mag"
  }, {
    name: "Angela Chiara Mollace",
    role: "Legal Compliance Expert",
    bio: "Avvocato e consulente esperta in compliance aziendale & privacy, modello organizzativo 231/01"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/")} className="mr-1 sm:mr-2 p-2 sm:p-3" size="sm">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <img src="/lovable-uploads/5930bd4d-6869-4b7d-8020-e58372708f8a.png" alt="Virtuosity Logo" className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mx-auto object-contain" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Virtuosity
              </h1>
            </div>
            <Button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700">
              Inizia Ora
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Hero Section - Introduzione */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Il valore delle <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">azioni quotidiane</span>
          </h2>
          
          {/* Marketplace Screenshot - Single Image */}
          <div className="mb-8">
            <img src="/lovable-uploads/d0eb56b6-be3f-4087-974f-575b93e35f0f.png" alt="Premi Aziendali - Marketplace Virtuosity" className="mx-auto rounded-lg shadow-2xl max-w-[80%] sm:max-w-[70%] md:max-w-[60%] h-auto" />
          </div>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">Virtuosity è la prima piattaforma europea che trasforma automaticamente i comportamenti sostenibili in certificati verificabili, creando un ecosistema di incentivi concreti per cittadini, aziende e pubbliche amministrazioni.</p>
        </div>

        {/* 2. Mission Statement - Perché esistiamo */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50 mb-16">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">La Nostra Missione</h3>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              Democratizzare la sostenibilità attraverso la tecnologia blockchain, 
              rendendo ogni azione sostenibile misurabile, verificabile e premiabile. 
              Costruiamo un futuro dove fare la scelta giusta per il pianeta 
              diventa anche la scelta più conveniente per le persone.
            </p>
          </CardContent>
        </Card>

        {/* 3. Come Funziona - Il meccanismo base */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Come Funziona Virtuosity
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <FeatureCard key={index} feature={feature} />)}
          </div>
        </div>

        {/* 4. Certificate Types - Cosa genera il sistema */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            I 4 Tipi di Certificati Virtuosity
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Ogni azione sostenibile genera certificati blockchain specifici per categoria ambientale, 
            garantendo tracciabilità e valore misurabile ai tuoi comportamenti virtuosi.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificateTypes.map((cert, index) => <CertificateTypeCard key={index} cert={cert} />)}
          </div>
        </div>

        {/* 5. DPP Integration - Il futuro della tracciabilità */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-green-50 to-purple-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                <Globe className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Integrazione con Digital Product Passports (DPP)
              </CardTitle>
              <CardDescription className="text-lg text-gray-700 max-w-4xl mx-auto">
                Virtuosity sarà tra le prime piattaforme europee ad integrare i Digital Product Passports, 
                rivoluzionando la tracciabilità e sostenibilità dei prodotti secondo la normativa EU 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Cosa sono i DPP</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <strong>Passaporti Digitali Obbligatori:</strong> Dal 2026, ogni prodotto venduto in EU avrà un QR code con informazioni complete su origine, materiali, impatto ambientale e riciclabilità
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <strong>Tracciabilità Completa:</strong> Ogni fase del ciclo di vita del prodotto viene registrata in modo immutabile su blockchain
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <strong>Trasparenza Totale:</strong> Consumatori e aziende possono verificare istantaneamente l'autenticità e sostenibilità di ogni prodotto
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Come Virtuosity Integra i DPP</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Zap className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                      <div>
                        <strong>Scansione Automatica:</strong> L'app rileva automaticamente i QR code DPP durante gli acquisti, calcolando l'impatto ambientale in tempo reale
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Award className="w-5 h-5 text-purple-500 mr-3 mt-1" />
                      <div>
                        <strong>Premi per Scelte Sostenibili:</strong> Acquistare prodotti con DPP ad alto rating di sostenibilità genera certificati e ricompense extra
                      </div>
                    </div>
                    <div className="flex items-start">
                      <TrendingUp className="w-5 h-5 text-orange-500 mr-3 mt-1" />
                      <div>
                        <strong>Analytics Avanzati:</strong> Dashboard personalizzate mostrano l'impatto ambientale dei tuoi acquisti e suggeriscono alternative più sostenibili
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 text-center">
                <img 
                  src="/lovable-uploads/d9ea4e8e-53a1-4a2e-be6c-a037e855fef7.png" 
                  alt="Esempio DPP - Scarpe da Corsa EcoRun" 
                  className="mx-auto rounded-lg shadow-2xl max-w-[80%] sm:max-w-[70%] md:max-w-[60%] h-auto border border-gray-200"
                />
                <p className="text-sm text-gray-600 mt-3 italic">
                  Esempio di Digital Product Passport: ogni prodotto avrà informazioni complete su origine, sostenibilità e filiera produttiva
                </p>
              </div>

              <div className="mt-12 p-6 bg-white/50 rounded-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Il Flusso di Lavoro DPP in Virtuosity</h4>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mb-3 mx-auto">1</div>
                    <h5 className="font-bold text-sm mb-2">Scansione QR</h5>
                    <p className="text-xs text-gray-600">App rileva automaticamente DPP durante acquisti o uso prodotti</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 mx-auto">2</div>
                    <h5 className="font-bold text-sm mb-2">Validazione Blockchain</h5>
                    <p className="text-xs text-gray-600">Verifica autenticità e calcola impact score basato su dati DPP</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mb-3 mx-auto">3</div>
                    <h5 className="font-bold text-sm mb-2">Generazione Certificati</h5>
                    <p className="text-xs text-gray-600">Crea certificati ESG basati su sostenibilità prodotto acquistato</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white mb-3 mx-auto">4</div>
                    <h5 className="font-bold text-sm mb-2">Premi & Insights</h5>
                    <p className="text-xs text-gray-600">Sblocca ricompense e ricevi suggerimenti per scelte più sostenibili</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white text-center">
                <h4 className="text-lg font-bold mb-2">Vantaggi Competitivi</h4>
                <p className="text-sm font-normal">
                  Con l'integrazione DPP, Virtuosity diventa l'unica piattaforma che collega automaticamente 
                  le scelte di consumo sostenibile con un sistema di incentivi concreti, 
                  preparando utenti e aziende alla nuova era della trasparenza ambientale europea.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 6. Privacy & Security - Come proteggiamo i dati */}
        <PrivacySecurityCard />

        {/* 7. Modelli di Scambio - Come si crea valore */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Modelli di Scambio Certificati</h3>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Employee-Company Exchange */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 via-blue-50 to-green-50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                  <Building className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Dipendente ↔ Azienda
                </CardTitle>
                <CardDescription className="text-lg text-gray-700">
                  Scambio di certificati sostenibili in cambio di welfare aziendale
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <Award className="w-5 h-5 text-purple-500 mr-2" />
                      Come Funziona
                    </h4>
                    <p className="text-gray-600 mb-4">
                      I dipendenti accumulano certificati attraverso comportamenti sostenibili e li scambiano 
                      con l'azienda per ottenere benefit welfare personalizzati, migliorando engagement e ESG score aziendale.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Heart className="w-5 h-5 text-red-500 mr-2" />
                      Esempi Pratici di Welfare
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-white/70 rounded-lg p-4 border-l-4 border-purple-400">
                        <h5 className="font-bold text-purple-700 mb-2">🚗 Mobilità Sostenibile</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Certificati richiesti:</strong> 50 certificati CO2 (equivalenti a 100km in bici)
                          <br />
                          <strong>Benefit ottenuto:</strong> Rimborso parcheggio aziendale per 1 mese o abbonamento car sharing
                        </p>
                      </div>
                      
                      <div className="bg-white/70 rounded-lg p-4 border-l-4 border-green-400">
                        <h5 className="font-bold text-green-700 mb-2">🏠 Smart Working Green</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Certificati richiesti:</strong> 30 certificati Energia + 20 certificati CO2
                          <br />
                          <strong>Benefit ottenuto:</strong> Giorni di smart working extra o rimborso bollette per home office sostenibile
                        </p>
                      </div>
                      
                      <div className="bg-white/70 rounded-lg p-4 border-l-4 border-blue-400">
                        <h5 className="font-bold text-blue-700 mb-2">🎯 Formazione & Sviluppo</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Certificati richiesti:</strong> 100 certificati misti (CO2 + Rifiuti + Acqua)
                          <br />
                          <strong>Benefit ottenuto:</strong> Corso di formazione professionale o master in sostenibilità aziendale
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 text-white">
                    <h5 className="font-bold mb-2">Vantaggi per l'Azienda</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Miglioramento ESG score e reporting automatico</li>
                      <li>• Maggiore engagement e retention dei dipendenti</li>
                      <li>• Riduzione carbon footprint aziendale misurabile</li>
                      <li>• Attrazione talenti orientati alla sostenibilità</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Citizen-Municipality Exchange */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 via-emerald-50 to-blue-50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                  <MapPin className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Cittadino ↔ Comune
                </CardTitle>
                <CardDescription className="text-lg text-gray-700">
                  Scambio di certificati sostenibili per servizi e agevolazioni comunali
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <Globe className="w-5 h-5 text-green-500 mr-2" />
                      Come Funziona
                    </h4>
                    <p className="text-gray-600 mb-4">
                      I cittadini virtuosi accumulano certificati attraverso comportamenti sostenibili quotidiani 
                      e li riscattano presso il comune per ottenere servizi, agevolazioni e accessi prioritari, 
                      contribuendo agli obiettivi di sostenibilità urbana.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 text-blue-500 mr-2" />
                      Esempi Pratici di Servizi
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-white/70 rounded-lg p-4 border-l-4 border-green-400">
                        <h5 className="font-bold text-green-700 mb-2">🚌 Trasporti Pubblici</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Certificati richiesti:</strong> 40 certificati CO2 (equivalenti a 80km in mezzi sostenibili)
                          <br />
                          <strong>Servizio ottenuto:</strong> Abbonamento mensile gratuito bus/metro o 20 corse bike sharing
                        </p>
                      </div>
                      
                      <div className="bg-white/70 rounded-lg p-4 border-l-4 border-blue-400">
                        <h5 className="font-bold text-blue-700 mb-2">🎭 Cultura & Tempo Libero</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Certificati richiesti:</strong> 25 certificati Rifiuti + 15 certificati Acqua
                          <br />
                          <strong>Servizio ottenuto:</strong> Ingressi gratuiti a musei comunali, teatro e biblioteche per 1 mese
                        </p>
                      </div>
                      
                      <div className="bg-white/70 rounded-lg p-4 border-l-4 border-purple-400">
                        <h5 className="font-bold text-purple-700 mb-2">🏛️ Agevolazioni Fiscali</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Certificati richiesti:</strong> 80 certificati misti (tutti i tipi)
                          <br />
                          <strong>Servizio ottenuto:</strong> Riduzione 30% TARI o parcheggi gratuiti in centro per 2 mesi
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 text-white py-[12px]">
                    <h5 className="font-bold mb-2">Vantaggi per il Comune</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Dati real-time su comportamenti sostenibili cittadini</li>
                      <li>• Raggiungimento obiettivi climatici EU 2030</li>
                      <li>• Maggiore coinvolgimento e partecipazione civica</li>
                      <li>• Riduzione costi gestione rifiuti e trasporti</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8 text-center">
            <img 
              src="/lovable-uploads/2d7821bc-1566-4343-b88c-a65247d9b8be.png" 
              alt="Spazio Welfare & Premi - Interfaccia di Gestione Aziendale" 
              className="mx-auto rounded-lg shadow-2xl max-w-[80%] h-auto border border-gray-200"
            />
            <p className="text-sm text-gray-600 mt-3 italic">
              Interfaccia di gestione aziendale: le aziende possono configurare criteri di assegnazione automatica e gestire il welfare per i dipendenti
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white text-center">
            <h4 className="text-2xl font-bold mb-2">Ecosistema Virtuosity: Win-Win per Tutti</h4>
            <p className="text-lg">
              Ogni certificato sostenibile genera valore concreto per cittadini, aziende e istituzioni, 
              creando un circolo virtuoso dove la sostenibilità diventa economicamente vantaggiosa per tutti gli attori coinvolti.
            </p>
          </div>
        </div>

        {/* 8. Vantaggi per gli Stakeholder - Chi beneficia e come */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Vantaggi per Tutti gli Stakeholder
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => <BenefitCard key={index} benefit={benefit} />)}
          </div>
        </div>

        {/* 9. Integrazioni Tecnologiche - Come si connette con l'esistente */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Integrazioni & Possibili Partnership
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => <IntegrationCard key={index} integration={integration} />)}
          </div>
        </div>

        {/* Report Screenshot - Above Technology Stack */}
        <div className="mb-16 text-center">
          <img 
            src="/lovable-uploads/73fd355d-6dd7-4294-b693-b245772935e6.png" 
            alt="Report Virtuosity - Interfaccia di Monitoraggio Sostenibilità" 
            className="mx-auto rounded-lg shadow-2xl max-w-[90%] sm:max-w-[80%] md:max-w-[70%] h-auto border border-gray-200"
          />
          <p className="text-sm text-gray-600 mt-3 italic">
            Interfaccia di reporting dettagliato: monitora le tue attività sostenibili e i certificati blockchain generati
          </p>
        </div>

        {/* 10. Technology Stack - Su cosa si basa */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50 mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Stack Tecnologico</CardTitle>
            <CardDescription>Tecnologie all'avanguardia per la sostenibilità del futuro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Frontend</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>React + Next.js</div>
                  <div>Tailwind CSS</div>
                  <div>PWA Ready</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Blockchain</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Ethereum/Polygon</div>
                  <div>Smart Contracts</div>
                  <div>IPFS Storage</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Backend</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Node.js/Python</div>
                  <div>Zero Knowledge Proof</div>
                  <div>API Gateway</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Compliance</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>GDPR Ready</div>
                  <div>ESG Standards</div>
                  <div>CSRD/ESRS</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 11. Roadmap - Quando e come si sviluppa */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            La Nostra Roadmap
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmap.map((phase, index) => <RoadmapCard key={index} phase={phase} />)}
          </div>
        </div>

        {/* 12. Team - Chi c'è dietro */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Il Nostro Team
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => <TeamMemberCard key={index} member={member} />)}
          </div>
        </div>

        {/* 13. Advisors - I nostri consulenti esperti */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">I Nostri Advisors</h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-4xl mx-auto">
            Un team di esperti di livello internazionale che ci guida nell'innovazione sostenibile, 
            dalla blockchain alla compliance, dall'economia all'intelligenza artificiale.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {advisors.map((advisor, index) => <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-center">{advisor.name}</CardTitle>
                  <div className="flex justify-center">
                    <Badge variant="secondary" className="text-xs">{advisor.role}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 text-center">{advisor.bio}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* 14. Offerta Commerciale - Piani di pricing */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Offerta Commerciale
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Scegli il piano più adatto alle tue esigenze e accedi alla piattaforma di sostenibilità più innovativa d'Europa.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Piano Micro */}
            <Card className="border-2 border-green-200 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                  <Euro className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 text-center">Piano Micro</CardTitle>
                <CardDescription className="text-gray-600 text-center">
                  Perfetto per P.IVA e micro aziende
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-green-600">9€</span>
                    <span className="text-lg text-gray-500 ml-2">/mese</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Tracking automatico comportamenti</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Certificati blockchain illimitati</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Dashboard ESG basic</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Accesso Exchange</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700">
                  Inizia Subito
                </Button>
              </CardContent>
            </Card>

            {/* Piano PMI */}
            <Card className="border-2 border-blue-300 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                  <Building className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 text-center">Piano PMI</CardTitle>
                <CardDescription className="text-gray-600 text-center">
                  Ideale per aziende 20-250 dipendenti
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">99€</span>
                    <span className="text-lg text-gray-500 ml-2">/mese</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    Tutto del piano Micro +
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Dashboard ESG avanzata</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Report automatici CSRD/ESRS</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Sistema welfare aziendale</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span>API integration</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                  Inizia Subito
                </Button>
              </CardContent>
            </Card>

            {/* Piano Enterprise */}
            <Card className="border-2 border-purple-200 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                  <Globe className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 text-center">Piano Enterprise</CardTitle>
                <CardDescription className="text-gray-600 text-center">
                  Per aziende +250 dipendenti e Comuni
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-purple-600">999€</span>
                    <span className="text-lg text-gray-500 ml-2">/mese</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                    <span>Tutto del piano PMI +</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                    <span>White label solution</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                    <span>Integrazione DPP completa</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                    <span>Analytics predittive IA</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 justify-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                    <span>Account manager dedicato</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700">
                  Contattaci
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 15. Contact Section - Come contattarci */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Un ecosistema digitale per trasformare la sostenibilità in valore
              </CardTitle>
              <CardDescription className="text-lg text-gray-700">
                Contattaci per iniziare il tuo viaggio verso la sostenibilità digitale
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="border border-green-200 bg-white/50">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                      <Building className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Informazioni Aziendali</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <h4 className="font-bold text-gray-900">Virtuosity Srl</h4>
                      <p className="text-sm text-gray-600">P.iva: 03438420733</p>
                      <p className="text-sm text-gray-600">N.REA 254707</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200 bg-white/50">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Contact Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-600">Via per Avertana, 23</p>
                      <p className="text-sm text-gray-600">Manduria (TA) 74024</p>
                      <p className="text-sm text-gray-600">gianfranco.leone@virtuosity.it</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 16. CTA Section - Call to action finale */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Pronto a Iniziare il Tuo Viaggio Sostenibile?</h3>
          <p className="text-xl mb-8 text-green-100">
            Unisciti a migliaia di cittadini che stanno già facendo la differenza per il pianeta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/dashboard")} className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Inizia Subito
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg">
              Torna alla Home
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

export default About;
