
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Upload, ArrowLeft, Package, Smartphone, Laptop, Monitor, Headphones, Camera, Car, Home, Zap, Shield, Calendar, User, Building, FileText, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DigitalWarrantyUpload = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const form = useForm({
    defaultValues: {
      productName: '',
      brand: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      warrantyPeriod: '',
      retailer: '',
      price: '',
      description: '',
      category: ''
    }
  });

  const productCategories = [
    { id: 'smartphone', name: 'Smartphone', icon: Smartphone, color: 'bg-blue-100 text-blue-800' },
    { id: 'laptop', name: 'Laptop/Computer', icon: Laptop, color: 'bg-purple-100 text-purple-800' },
    { id: 'monitor', name: 'Monitor/TV', icon: Monitor, color: 'bg-green-100 text-green-800' },
    { id: 'audio', name: 'Audio/Cuffie', icon: Headphones, color: 'bg-pink-100 text-pink-800' },
    { id: 'camera', name: 'Fotocamera', icon: Camera, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'automotive', name: 'Automotive', icon: Car, color: 'bg-red-100 text-red-800' },
    { id: 'appliance', name: 'Elettrodomestici', icon: Home, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'software', name: 'Software/Licenze', icon: Zap, color: 'bg-cyan-100 text-cyan-800' }
  ];

  const exampleData = {
    smartphone: {
      productName: 'iPhone 15 Pro',
      brand: 'Apple',
      model: 'A3101',
      serialNumber: 'F2LMKD3Q2P',
      purchaseDate: '2024-03-15',
      warrantyPeriod: '24',
      retailer: 'Apple Store Milano',
      price: '1299',
      description: 'Smartphone premium con tecnologia sostenibile, batteria riciclabile al 100%'
    },
    laptop: {
      productName: 'MacBook Pro 14"',
      brand: 'Apple',
      model: 'M3 Pro',
      serialNumber: 'C02ZJ0XMMD6T',
      purchaseDate: '2024-02-10',
      warrantyPeriod: '36',
      retailer: 'MediaWorld',
      price: '2499',
      description: 'Laptop professionale con certificazione ENERGY STAR e materiali riciclati'
    },
    software: {
      productName: 'Adobe Creative Suite',
      brand: 'Adobe',
      model: 'CC 2024',
      serialNumber: 'ADO-CC24-PRO-001',
      purchaseDate: '2024-01-01',
      warrantyPeriod: '12',
      retailer: 'Adobe Store',
      price: '599',
      description: 'Suite completa per creativi con licenza annuale rinnovabile'
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const example = exampleData[categoryId as keyof typeof exampleData];
    if (example) {
      Object.entries(example).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
      form.setValue('category', categoryId);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const onSubmit = (data: any) => {
    console.log('Digital Warranty Data:', data);
    console.log('Uploaded file:', uploadedFile);
    // Here would be the logic to process and store the warranty data
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard-aziende')}
            className="px-3 py-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
              Caricamento Garanzia Digitale
            </h1>
            <p className="text-slate-600">Registra la garanzia digitale per prodotti fisici e software</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Selection */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Categoria Prodotto
                </CardTitle>
                <CardDescription>Seleziona la categoria del prodotto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {productCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`w-full justify-start ${selectedCategory === category.id ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Upload Documents */}
            <Card className="border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-green-600" />
                  Documenti
                </CardTitle>
                <CardDescription>Carica ricevuta, fattura o documenti</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload">
                    <Button variant="outline" asChild>
                      <span>Seleziona Documenti</span>
                    </Button>
                  </label>
                  <p className="text-sm text-slate-500 mt-2">
                    PDF, JPG, PNG (max 10MB)
                  </p>
                  {uploadedFile && (
                    <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                      <p className="text-sm text-green-800">✓ {uploadedFile.name}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Dettagli Garanzia Digitale
                </CardTitle>
                <CardDescription>
                  Inserisci i dati del prodotto per generare il Digital Product Passport
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Prodotto</FormLabel>
                            <FormControl>
                              <Input placeholder="es. iPhone 15 Pro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marca/Brand</FormLabel>
                            <FormControl>
                              <Input placeholder="es. Apple" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modello</FormLabel>
                            <FormControl>
                              <Input placeholder="es. A3101" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="serialNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numero Seriale</FormLabel>
                            <FormControl>
                              <Input placeholder="es. F2LMKD3Q2P" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="purchaseDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Acquisto</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="warrantyPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Durata Garanzia (mesi)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="es. 24" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="retailer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Venditore/Retailer</FormLabel>
                            <FormControl>
                              <Input placeholder="es. Apple Store Milano" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prezzo (€)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="es. 1299" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrizione & Note ESG</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descrivi il prodotto e le sue caratteristiche di sostenibilità..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Includi informazioni su materiali riciclati, certificazioni ambientali, etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-6 border-t">
                      <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                        <Shield className="w-4 h-4 mr-2" />
                        Genera DPP & Garanzia Digitale
                      </Button>
                      <Button type="button" variant="outline" className="px-8">
                        <QrCode className="w-4 h-4 mr-2" />
                        Anteprima QR
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Preview Section */}
            {selectedCategory && (
              <Card className="border-0 shadow-lg mt-6 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Anteprima Digital Product Passport
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Badge className="bg-green-600">ESG Compliant</Badge>
                      <p className="text-sm text-slate-600">Certificato di sostenibilità</p>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-blue-600">Blockchain Verified</Badge>
                      <p className="text-sm text-slate-600">Garanzia immutabile</p>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-purple-600">EU DPP Ready</Badge>
                      <p className="text-sm text-slate-600">Conforme normative UE</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalWarrantyUpload;
