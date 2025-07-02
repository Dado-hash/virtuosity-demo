
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Camera, MapPin, Leaf, Shield, Truck, Wallet, ShoppingBag, Calendar, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DppData {
  id: string;
  name: string;
  brand: string;
  origin: {
    country: string;
    region: string;
    coordinates: [number, number];
  };
  sustainability: {
    score: number;
    certifications: string[];
    carbonFootprint: string;
    recyclable: boolean;
  };
  supply_chain: {
    manufacturer: string;
    production_date: string;
    batch_number: string;
    transport_method: string;
  };
  verified: boolean;
  verification_date: string;
}

interface WalletProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  image: string;
  purchaseDate: string;
  warranty: {
    period: string;
    expires: string;
    coverage: string[];
  };
  sustainability: {
    score: number;
    certifications: string[];
  };
  value: string;
  category: string;
  status: 'active' | 'expired' | 'claimed';
}

export const DppVerification = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [dppData, setDppData] = useState<DppData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock wallet products
  const [walletProducts] = useState<WalletProduct[]>([
    {
      id: "DPP-PRADA-001",
      name: "Borsa Saffiano",
      brand: "PRADA",
      model: "1BA274",
      image: "/lovable-uploads/68f725b5-ee07-4329-b173-31ae580fbafd.png",
      purchaseDate: "2024-01-15",
      warranty: {
        period: "2 anni",
        expires: "2026-01-15",
        coverage: ["Difetti di fabbricazione", "Riparazione pelletteria", "Sostituzione hardware"]
      },
      sustainability: {
        score: 92,
        certifications: ["Made in Italy", "Pelle certificata", "Carbon Neutral"]
      },
      value: "€ 2.850",
      category: "Pelletteria",
      status: 'active'
    },
    {
      id: "DPP-ROLEX-002",
      name: "Submariner Date",
      brand: "ROLEX",
      model: "126610LN",
      image: "/lovable-uploads/7676b5a7-2456-4cc9-ae9c-3e50d71dd284.png",
      purchaseDate: "2023-11-20",
      warranty: {
        period: "5 anni",
        expires: "2028-11-20",
        coverage: ["Movimento", "Cassa e bracciale", "Impermeabilità"]
      },
      sustainability: {
        score: 88,
        certifications: ["Swiss Made", "Oro responsabile", "Packaging eco"]
      },
      value: "€ 9.150",
      category: "Orologeria",
      status: 'active'
    },
    {
      id: "DPP-APPLE-003",
      name: "iPhone 15 Pro",
      brand: "APPLE",
      model: "A3101",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=300&fit=crop",
      purchaseDate: "2023-09-22",
      warranty: {
        period: "1 anno",
        expires: "2024-09-22",
        coverage: ["Hardware", "Batteria", "AppleCare+"]
      },
      sustainability: {
        score: 85,
      certifications: ["Carbon Neutral", "Materiali riciclati", "Packaging plastic-free"]
      },
      value: "€ 1.199",
      category: "Tecnologia",
      status: 'expired'
    }
  ]);

  // Mock DPP data for demonstration
  const mockDppData: DppData = {
    id: "DPP-2024-001234",
    name: "Scarpe da Corsa EcoRun",
    brand: "GreenStep",
    origin: {
      country: "Italia",
      region: "Toscana, Firenze",
      coordinates: [11.2558, 43.7696]
    },
    sustainability: {
      score: 85,
      certifications: ["EU Ecolabel", "OEKO-TEX", "Carbon Neutral"],
      carbonFootprint: "2.3 kg CO₂",
      recyclable: true
    },
    supply_chain: {
      manufacturer: "EcoFootwear S.r.l.",
      production_date: "2024-01-15",
      batch_number: "EF2024-A001",
      transport_method: "Trasporto elettrico"
    },
    verified: true,
    verification_date: "2024-01-15T10:30:00Z"
  };

  const handleScanQR = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setDppData(mockDppData);
      toast({
        title: "QR Code Scansionato!",
        description: "Informazioni del prodotto caricate con successo.",
      });
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      // Simulate QR code reading from image
      setTimeout(() => {
        setIsScanning(false);
        setDppData(mockDppData);
        toast({
          title: "QR Code Riconosciuto!",
          description: "Informazioni del prodotto estratte dall'immagine.",
        });
      }, 1500);
    }
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'claimed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pelletteria': return '👜';
      case 'Orologeria': return '⌚';
      case 'Tecnologia': return '📱';
      default: return '📦';
    }
  };

  return (
    <Tabs defaultValue="scan" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm shadow-md">
        <TabsTrigger value="scan" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Scansiona Prodotto
        </TabsTrigger>
        <TabsTrigger value="wallet" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Le Mie Garanzie
        </TabsTrigger>
      </TabsList>

      <TabsContent value="scan" className="space-y-6">
        {/* Scanning Interface */}
        {!dppData && (
          <div className="text-center space-y-4">
            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              {isScanning ? (
                <div className="animate-pulse">
                  <QrCode className="h-16 w-16 text-green-600" />
                  <p className="text-sm text-gray-600 mt-2">Scansionando...</p>
                </div>
              ) : (
                <div>
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">Inquadra il QR Code</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleScanQR} 
                disabled={isScanning}
                className="bg-green-600 hover:bg-green-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isScanning ? "Scansionando..." : "Scansiona QR Code"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
              >
                <QrCode className="h-4 w-4 mr-2" />
                Carica Immagine
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Product Information */}
        {dppData && (
          <div className="space-y-4">
            {/* Product Header */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                  <div>
                    <CardTitle className="text-xl text-green-800">{dppData.name}</CardTitle>
                    <CardDescription className="text-green-600">
                      {dppData.brand} • ID: {dppData.id}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 w-fit">
                    {dppData.verified ? "✓ Verificato" : "⚠ Non Verificato"}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Origin Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Origine del Prodotto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Paese di Origine</p>
                    <p className="font-semibold">{dppData.origin.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Regione</p>
                    <p className="font-semibold">{dppData.origin.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Produttore</p>
                    <p className="font-semibold">{dppData.supply_chain.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data di Produzione</p>
                    <p className="font-semibold">{new Date(dppData.supply_chain.production_date).toLocaleDateString('it-IT')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Punteggio Sostenibilità
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Punteggio Generale</span>
                    <Badge className={getSustainabilityColor(dppData.sustainability.score)}>
                      {dppData.sustainability.score}/100
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Impronta Carbonica</p>
                      <p className="font-semibold">{dppData.sustainability.carbonFootprint}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Riciclabile</p>
                      <p className="font-semibold">{dppData.sustainability.recyclable ? "Sì" : "No"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Certificazioni</p>
                    <div className="flex flex-wrap gap-2">
                      {dppData.sustainability.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-purple-600" />
                  Filiera Produttiva
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Numero Lotto</p>
                    <p className="font-semibold font-mono">{dppData.supply_chain.batch_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Metodo di Trasporto</p>
                    <p className="font-semibold">{dppData.supply_chain.transport_method}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setDppData(null)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Scansiona Nuovo Prodotto
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Shield className="h-4 w-4 mr-2" />
                Verifica su Blockchain
              </Button>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="wallet" className="space-y-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Il Mio Wallet DPP
            </CardTitle>
            <CardDescription className="text-blue-100">
              Conserva e gestisci le garanzie digitali dei tuoi prodotti di lusso
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {walletProducts.length} Prodotti
              </div>
              <p className="text-gray-600">
                Valore totale: {walletProducts.reduce((sum, product) => sum + parseFloat(product.value.replace(/[€\s.]/g, '').replace(',', '.')), 0).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {walletProducts.map((product) => (
                <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getStatusColor(product.status)}>
                        {product.status === 'active' ? 'Attiva' : product.status === 'expired' ? 'Scaduta' : 'Utilizzata'}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 text-2xl">
                        {getCategoryIcon(product.category)}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{product.brand}</h3>
                        <p className="text-sm text-gray-600">{product.name}</p>
                        <p className="text-xs text-gray-500">Modello: {product.model}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-blue-600">{product.value}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Garanzia:</span>
                        <span className="font-semibold">{product.warranty.period}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Scade:</span>
                        <span className="font-semibold">{new Date(product.warranty.expires).toLocaleDateString('it-IT')}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Sostenibilità:</span>
                        <Badge className={getSustainabilityColor(product.sustainability.score)}>
                          {product.sustainability.score}/100
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-1">Certificazioni:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.sustainability.certifications.slice(0, 2).map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                          {product.sustainability.certifications.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.sustainability.certifications.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Dettagli
                      </Button>
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Garanzia
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Aggiungi Nuovo Prodotto
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
