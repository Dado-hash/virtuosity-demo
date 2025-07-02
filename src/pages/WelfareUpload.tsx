
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Home, Plus, Gift, Heart, Briefcase, GraduationCap, Car, Coffee, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface WelfareItem {
  id: string;
  title: string;
  description: string;
  category: string;
  value: string;
  requiredCertificates: number;
  provider: string;
  validityPeriod: string;
  maxBeneficiaries: number;
  image?: string;
  status: 'active' | 'pending' | 'inactive';
}

const WelfareUpload = () => {
  const navigate = useNavigate();
  const [welfareItems, setWelfareItems] = useState<WelfareItem[]>([
    {
      id: '1',
      title: 'Buono Pasto Giornaliero',
      description: 'Buono pasto del valore di €8 utilizzabile nelle mense convenzionate',
      category: 'food',
      value: '€8',
      requiredCertificates: 2,
      provider: 'Edenred',
      validityPeriod: '12 mesi',
      maxBeneficiaries: 100,
      status: 'active'
    },
    {
      id: '2',
      title: 'Abbonamento Palestra',
      description: 'Abbonamento trimestrale per centri fitness partner',
      category: 'health',
      value: '€150',
      requiredCertificates: 15,
      provider: 'FitActive',
      validityPeriod: '3 mesi',
      maxBeneficiaries: 25,
      status: 'active'
    }
  ]);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'food',
      value: '',
      requiredCertificates: 1,
      provider: '',
      validityPeriod: '12 mesi',
      maxBeneficiaries: 50
    }
  });

  const categoryIcons = {
    food: Coffee,
    health: Heart,
    education: GraduationCap,
    transport: Car,
    wellness: Dumbbell,
    general: Gift
  };

  const categoryColors = {
    food: 'bg-orange-100 text-orange-800',
    health: 'bg-red-100 text-red-800',
    education: 'bg-blue-100 text-blue-800',
    transport: 'bg-green-100 text-green-800',
    wellness: 'bg-purple-100 text-purple-800',
    general: 'bg-gray-100 text-gray-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-gray-100 text-gray-800'
  };

  const onSubmit = (data: any) => {
    const newWelfareItem: WelfareItem = {
      id: Date.now().toString(),
      ...data,
      status: 'pending' as const
    };
    setWelfareItems([...welfareItems, newWelfareItem]);
    form.reset();
    toast.success('Benefit welfare caricato con successo!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-cyan-600 bg-clip-text text-transparent">
              Carica Welfare Aziendale
            </h1>
            <p className="text-slate-600 text-lg">
              Aggiungi benefit welfare da mettere a disposizione dei dipendenti in cambio di certificati ESG
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard-aziende")} 
              className="px-3 py-1 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Home className="w-4 h-4 mr-1" />
              Dashboard Aziende
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700">Welfare Attivi</p>
                  <p className="text-2xl font-bold text-blue-900">{welfareItems.filter(w => w.status === 'active').length}</p>
                </div>
                <Gift className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-100 to-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">Beneficiari Totali</p>
                  <p className="text-2xl font-bold text-green-900">{welfareItems.reduce((sum, w) => sum + w.maxBeneficiaries, 0)}</p>
                </div>
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700">In Attesa</p>
                  <p className="text-2xl font-bold text-purple-900">{welfareItems.filter(w => w.status === 'pending').length}</p>
                </div>
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-100 to-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-700">Certificati Richiesti</p>
                  <p className="text-2xl font-bold text-orange-900">{welfareItems.reduce((sum, w) => sum + w.requiredCertificates, 0)}</p>
                </div>
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Aggiungi Nuovo Benefit Welfare
            </CardTitle>
            <CardDescription>
              Compila i dettagli del benefit welfare che vuoi mettere a disposizione dei tuoi dipendenti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titolo Benefit</FormLabel>
                        <FormControl>
                          <Input placeholder="es. Buono Pasto Giornaliero" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="food">Food & Beverage</SelectItem>
                            <SelectItem value="health">Salute</SelectItem>
                            <SelectItem value="education">Formazione</SelectItem>
                            <SelectItem value="transport">Trasporti</SelectItem>
                            <SelectItem value="wellness">Benessere</SelectItem>
                            <SelectItem value="general">Generale</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Descrizione</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrivi il benefit welfare, come può essere utilizzato e eventuali condizioni..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valore</FormLabel>
                        <FormControl>
                          <Input placeholder="es. €8 o €150" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiredCertificates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificati Richiesti</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxBeneficiaries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Beneficiari</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornitore/Partner</FormLabel>
                        <FormControl>
                          <Input placeholder="es. Edenred, FitActive..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="validityPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periodo di Validità</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona periodo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1 mese">1 mese</SelectItem>
                            <SelectItem value="3 mesi">3 mesi</SelectItem>
                            <SelectItem value="6 mesi">6 mesi</SelectItem>
                            <SelectItem value="12 mesi">12 mesi</SelectItem>
                            <SelectItem value="24 mesi">24 mesi</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => form.reset()}>
                    Annulla
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Carica Benefit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Welfare Items List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">Benefit Welfare Caricati</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {welfareItems.map((item) => {
              const CategoryIcon = categoryIcons[item.category as keyof typeof categoryIcons] || Gift;
              
              return (
                <Card key={item.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <CategoryIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>{item.category}</Badge>
                            <Badge className={statusColors[item.status]}>{item.status}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">{item.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                        <p className="text-xs text-slate-500">Valore</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-900">{item.requiredCertificates}</p>
                        <p className="text-xs text-slate-500">Certificati</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Fornitore:</span>
                        <span className="font-medium">{item.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Validità:</span>
                        <span className="font-medium">{item.validityPeriod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Beneficiari:</span>
                        <span className="font-medium">{item.maxBeneficiaries}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelfareUpload;
