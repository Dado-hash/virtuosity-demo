import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Heart, 
  Eye, 
  Smile, 
  Waves, 
  Calendar, 
  UtensilsCrossed, 
  Gift, 
  Plus, 
  ArrowLeft,
  Stethoscope,
  Sparkles,
  Car,
  ShoppingBag,
  Coffee,
  Plane,
  DollarSign,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelfareManagement = () => {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [welfareTitle, setWelfareTitle] = useState('');
  const [welfareDescription, setWelfareDescription] = useState('');
  const [certificatesRequired, setCertificatesRequired] = useState('');
  const [welfareValue, setWelfareValue] = useState('');

  const welfareCategories = [
    { id: 'medical', name: 'Visite Mediche', icon: Stethoscope, color: 'bg-red-100 text-red-700' },
    { id: 'eye', name: 'Visite Oculistiche', icon: Eye, color: 'bg-blue-100 text-blue-700' },
    { id: 'dental', name: 'Visite Odontoiatriche', icon: Smile, color: 'bg-green-100 text-green-700' },
    { id: 'spa', name: 'Soggiorni Spa', icon: Sparkles, color: 'bg-purple-100 text-purple-700' },
    { id: 'time', name: 'Permessi Extra', icon: Calendar, color: 'bg-orange-100 text-orange-700' },
    { id: 'food', name: 'Buoni Pasto', icon: UtensilsCrossed, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'transport', name: 'Trasporti', icon: Car, color: 'bg-indigo-100 text-indigo-700' },
    { id: 'shopping', name: 'Buoni Shopping', icon: ShoppingBag, color: 'bg-pink-100 text-pink-700' },
    { id: 'travel', name: 'Viaggi', icon: Plane, color: 'bg-cyan-100 text-cyan-700' }
  ];

  const existingWelfares = [
    {
      id: 1,
      title: 'Visita Medica Specialistica',
      description: 'Visita medica completa presso strutture convenzionate',
      category: 'medical',
      certificatesRequired: 10,
      value: '€150',
      active: true,
      used: 23
    },
    {
      id: 2,
      title: 'Controllo Oculistico',
      description: 'Visita oculistica con controllo della vista',
      category: 'eye',
      certificatesRequired: 8,
      value: '€80',
      active: true,
      used: 15
    },
    {
      id: 3,
      title: 'Pulizia Dentale Professionale',
      description: 'Igiene orale presso dentisti convenzionati',
      category: 'dental',
      certificatesRequired: 12,
      value: '€120',
      active: true,
      used: 31
    },
    {
      id: 4,
      title: 'Weekend Spa Relax',
      description: 'Soggiorno di 2 giorni in spa di lusso',
      category: 'spa',
      certificatesRequired: 25,
      value: '€300',
      active: true,
      used: 8
    },
    {
      id: 5,
      title: 'Giorno di Permesso Extra',
      description: 'Giornata di ferie aggiuntiva',
      category: 'time',
      certificatesRequired: 15,
      value: 'Giorno libero',
      active: true,
      used: 42
    },
    {
      id: 6,
      title: 'Buoni Pasto Premium',
      description: 'Buoni pasto da €15 per 20 giorni',
      category: 'food',
      certificatesRequired: 20,
      value: '€300',
      active: true,
      used: 67
    }
  ];

  const getCategoryInfo = (categoryId: string) => {
    return welfareCategories.find(cat => cat.id === categoryId) || welfareCategories[0];
  };

  const handleAddWelfare = () => {
    // Qui si aggiungerebbe la logica per salvare il nuovo welfare
    console.log('Nuovo welfare:', {
      title: welfareTitle,
      description: welfareDescription,
      category: selectedCategory,
      certificatesRequired: parseInt(certificatesRequired),
      value: welfareValue
    });
    setShowAddDialog(false);
    // Reset form
    setWelfareTitle('');
    setWelfareDescription('');
    setSelectedCategory('');
    setCertificatesRequired('');
    setWelfareValue('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard-aziende')}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-blue-600 bg-clip-text text-transparent">
                Gestione Welfare Aziendale
              </h1>
              <p className="text-slate-600 mt-1">
                Configura i benefit in cambio di certificati ESG
              </p>
            </div>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Welfare
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Aggiungi Nuovo Welfare</DialogTitle>
                <DialogDescription>
                  Crea un nuovo benefit da scambiare con certificati ESG
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {welfareCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <category.icon className="w-4 h-4" />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificates">Certificati Richiesti</Label>
                    <Input
                      id="certificates"
                      type="number"
                      placeholder="es. 10"
                      value={certificatesRequired}
                      onChange={(e) => setCertificatesRequired(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Titolo Welfare</Label>
                  <Input
                    id="title"
                    placeholder="es. Visita Medica Specialistica"
                    value={welfareTitle}
                    onChange={(e) => setWelfareTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrizione dettagliata del benefit..."
                    value={welfareDescription}
                    onChange={(e) => setWelfareDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value">Valore</Label>
                  <Input
                    id="value"
                    placeholder="es. €150 oppure Giorno libero"
                    value={welfareValue}
                    onChange={(e) => setWelfareValue(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>
                  Annulla
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleAddWelfare}>
                  Aggiungi Welfare
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {welfareCategories.map((category) => (
            <Card key={category.id} className={`${category.color} border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer`}>
              <CardContent className="p-4 text-center">
                <category.icon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Welfares */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Welfare Attivi</h2>
            <Badge className="bg-green-100 text-green-800">
              {existingWelfares.length} benefit disponibili
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingWelfares.map((welfare) => {
              const categoryInfo = getCategoryInfo(welfare.category);
              return (
                <Card key={welfare.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                        <categoryInfo.icon className="w-5 h-5" />
                      </div>
                      <Badge className={welfare.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {welfare.active ? 'Attivo' : 'Inattivo'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{welfare.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {welfare.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Certificati</p>
                        <p className="text-lg font-bold text-blue-800">{welfare.certificatesRequired}</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Valore</p>
                        <p className="text-lg font-bold text-green-800">{welfare.value}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Utilizzato: {welfare.used} volte</span>
                      <Button size="sm" variant="outline" className="text-xs">
                        Modifica
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-100 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Statistiche Welfare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">€1,250</p>
                <p className="text-sm text-slate-600">Valore Totale Erogato</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <Gift className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">186</p>
                <p className="text-sm text-slate-600">Welfare Utilizzati</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">1,240</p>
                <p className="text-sm text-slate-600">Certificati Scambiati</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">78%</p>
                <p className="text-sm text-slate-600">Soddisfazione</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelfareManagement;
