
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Plus, Gift, Tag, Home, Percent, ShoppingBag, Coffee, Utensils, Car, Smartphone, Laptop, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'gift' | 'voucher' | 'experience';
  value: string;
  requiredCertificates: number;
  category: string;
  validUntil: string;
  maxUses: number;
  currentUses: number;
  image?: string;
  status: 'active' | 'inactive' | 'expired';
}

const RewardsManagement = () => {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'Sconto 20% Prodotti Eco-Friendly',
      description: 'Sconto del 20% su tutti i prodotti della linea sostenibile',
      type: 'discount',
      value: '20%',
      requiredCertificates: 5,
      category: 'shopping',
      validUntil: '2024-12-31',
      maxUses: 100,
      currentUses: 23,
      status: 'active'
    },
    {
      id: '2',
      title: 'Buono Pranzo €15',
      description: 'Buono pranzo utilizzabile nei ristoranti partner',
      type: 'voucher',
      value: '€15',
      requiredCertificates: 3,
      category: 'food',
      validUntil: '2024-09-30',
      maxUses: 50,
      currentUses: 12,
      status: 'active'
    },
    {
      id: '3',
      title: 'Gadget Aziendale Esclusivo',
      description: 'Borraccia termica in acciaio con logo aziendale',
      type: 'gift',
      value: 'Gadget',
      requiredCertificates: 8,
      category: 'branded',
      validUntil: '2024-11-15',
      maxUses: 25,
      currentUses: 7,
      status: 'active'
    }
  ]);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      type: 'discount' as const,
      value: '',
      requiredCertificates: 1,
      category: 'shopping',
      validUntil: '',
      maxUses: 100
    }
  });

  const categoryIcons = {
    shopping: ShoppingBag,
    food: Utensils,
    transport: Car,
    tech: Smartphone,
    branded: Gift,
    experience: Star
  };

  const typeColors = {
    discount: 'bg-blue-100 text-blue-800',
    gift: 'bg-purple-100 text-purple-800',
    voucher: 'bg-green-100 text-green-800',
    experience: 'bg-orange-100 text-orange-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    expired: 'bg-red-100 text-red-800'
  };

  const onSubmit = (data: any) => {
    const newReward: Reward = {
      id: Date.now().toString(),
      ...data,
      currentUses: 0,
      status: 'active' as const
    };
    setRewards([...rewards, newReward]);
    setShowAddDialog(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-600 bg-clip-text text-transparent">
              Gestione Premi e Sconti
            </h1>
            <p className="text-slate-600 text-lg">
              Crea e gestisci incentivi per i follower che scambiano certificati ESG
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard-aziende")} 
              className="px-3 py-1 border-amber-200 text-amber-700 hover:bg-amber-50"
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
                  <p className="text-sm font-medium text-blue-700">Premi Attivi</p>
                  <p className="text-2xl font-bold text-blue-900">{rewards.filter(r => r.status === 'active').length}</p>
                </div>
                <Star className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-100 to-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">Totale Riscatti</p>
                  <p className="text-2xl font-bold text-green-900">{rewards.reduce((sum, r) => sum + r.currentUses, 0)}</p>
                </div>
                <Gift className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700">Certificati Richiesti</p>
                  <p className="text-2xl font-bold text-purple-900">{rewards.reduce((sum, r) => sum + r.requiredCertificates, 0)}</p>
                </div>
                <Tag className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-100 to-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-700">Tasso Utilizzo</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {Math.round((rewards.reduce((sum, r) => sum + r.currentUses, 0) / rewards.reduce((sum, r) => sum + r.maxUses, 0)) * 100)}%
                  </p>
                </div>
                <Percent className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Reward Button */}
        <div className="flex justify-end">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Nuovo Premio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crea Nuovo Premio</DialogTitle>
                <DialogDescription>
                  Aggiungi un nuovo premio o sconto che i follower possono riscattare con i certificati ESG
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titolo Premio</FormLabel>
                          <FormControl>
                            <Input placeholder="es. Sconto 20% Prodotti Eco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo Premio</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="discount">Sconto</SelectItem>
                              <SelectItem value="gift">Regalo</SelectItem>
                              <SelectItem value="voucher">Buono</SelectItem>
                              <SelectItem value="experience">Esperienza</SelectItem>
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
                            placeholder="Descrivi il premio e come può essere utilizzato..."
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
                            <Input placeholder="es. 20% o €15" {...field} />
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
                      name="maxUses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Utilizzi Massimi</FormLabel>
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
                              <SelectItem value="shopping">Shopping</SelectItem>
                              <SelectItem value="food">Food & Beverage</SelectItem>
                              <SelectItem value="transport">Trasporti</SelectItem>
                              <SelectItem value="tech">Tecnologia</SelectItem>
                              <SelectItem value="branded">Branded</SelectItem>
                              <SelectItem value="experience">Esperienze</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="validUntil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valido Fino Al</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>
                      Annulla
                    </Button>
                    <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
                      Crea Premio
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rewards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const CategoryIcon = categoryIcons[reward.category as keyof typeof categoryIcons] || Gift;
            
            return (
              <Card key={reward.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <CategoryIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={typeColors[reward.type]}>{reward.type}</Badge>
                          <Badge className={statusColors[reward.status]}>{reward.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{reward.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">{reward.value}</p>
                      <p className="text-xs text-slate-500">Valore</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">{reward.requiredCertificates}</p>
                      <p className="text-xs text-slate-500">Certificati</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilizzi</span>
                      <span>{reward.currentUses}/{reward.maxUses}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(reward.currentUses / reward.maxUses) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Valido fino al: {new Date(reward.validUntil).toLocaleDateString('it-IT')}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizza
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Modifica
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardsManagement;
