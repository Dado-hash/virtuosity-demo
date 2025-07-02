import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Leaf, Users, Building2, MapPin, Activity, Award, TrendingUp, Target, Eye, Settings, User, FileText, Gift, Truck, Heart, ArrowRight, ChevronRight, Star, Zap, Globe, Smartphone, CheckCircle, Clock, Calendar, BarChart3, Recycle, TreePine, Car, Home, Wallet, TestTube } from "lucide-react";
import CircularityIcons from "@/components/CircularityIcons";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Virtuosity - Piattaforma Sostenibilità Aziendale";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/5930bd4d-6869-4b7d-8020-e58372708f8a.png" alt="Virtuosity Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Virtuosity
                </h1>
                <p className="text-xs text-gray-600">Sostenibilità Aziendale</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth-test")}
                className="hidden sm:flex items-center border-green-200 hover:bg-green-50"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Auth
              </Button>
              <Button 
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
              >
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Trasforma le Tue Azioni in Impatto Reale
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Unisciti alla piattaforma che premia la sostenibilità aziendale e personale.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
          >
            Inizia Ora
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Circularity Icons */}
      <CircularityIcons />

      {/* Key Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Come Funziona
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Activity className="mr-2 h-5 w-5 text-green-500" />
                  Monitoraggio Attività
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600">
                  Registra le tue azioni sostenibili e guadagna punti.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Award className="mr-2 h-5 w-5 text-blue-500" />
                  Guadagna Punti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600">
                  Accumula punti per ogni azione eco-friendly completata.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Gift className="mr-2 h-5 w-5 text-purple-500" />
                  Riscatta Premi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600">
                  Scambia i tuoi punti con premi esclusivi e sconti.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Soluzioni per la Tua Azienda
            </h3>
            <p className="text-lg text-gray-700">
              Implementa Virtuosity nella tua azienda e promuovi la sostenibilità tra i tuoi dipendenti.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Solution 1 */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Reportistica ESG
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600">
                  Monitora e comunica l'impatto ambientale della tua azienda.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Solution 2 */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  Coinvolgimento Dipendenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600">
                  Incentiva i tuoi dipendenti a partecipare a iniziative sostenibili.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Solution 3 */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Building2 className="mr-2 h-5 w-5 text-purple-500" />
                  Brand Reputation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600">
                  Migliora la reputazione del tuo brand attraverso azioni concrete.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Inizia Oggi il Tuo Percorso Verso la Sostenibilità
          </h3>
          <p className="text-lg text-gray-700 mb-8">
            Unisciti a Virtuosity e fai la differenza per il nostro pianeta.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
          >
            Iscriviti Ora
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="text-sm">
            © {new Date().getFullYear()} Virtuosity. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
