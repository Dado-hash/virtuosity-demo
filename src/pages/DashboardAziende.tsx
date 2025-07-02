import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, BarChart3, TrendingUp, Award, Shield, DollarSign, Users, Package, Recycle, Eye, Download, Plus, Calendar, Activity, Filter, Gift, Zap, Droplets, Leaf, QrCode, FileCheck, Target, ChevronDown, Home, ShoppingBag, Wallet, Heart, Sparkles, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
const DashboardAziende = () => {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [timeFilter, setTimeFilter] = useState('month');
  const [showReportDialog, setShowReportDialog] = useState(false);

  // ESG Data for charts
  const co2Data = [{
    name: 'Riduzione Ottenuta',
    value: 2.4,
    color: '#22c55e'
  }, {
    name: 'Obiettivo Rimanente',
    value: 1.6,
    color: '#e5e7eb'
  }];
  const wasteData = [{
    name: 'Riciclato',
    value: 65,
    color: '#3b82f6'
  }, {
    name: 'Compostato',
    value: 20,
    color: '#10b981'
  }, {
    name: 'Smaltito',
    value: 15,
    color: '#f59e0b'
  }];
  const energyData = [{
    name: 'Rinnovabile',
    value: 45,
    color: '#22c55e'
  }, {
    name: 'Tradizionale',
    value: 55,
    color: '#ef4444'
  }];
  const waterData = [{
    name: 'Risparmiata',
    value: 1200,
    color: '#06b6d4'
  }, {
    name: 'Consumata',
    value: 2800,
    color: '#94a3b8'
  }];
  const certificatesData = [{
    name: 'Emessi',
    value: 156,
    color: '#8b5cf6'
  }, {
    name: 'In Elaborazione',
    value: 24,
    color: '#e5e7eb'
  }];
  const monthlyTrend = [{
    month: 'Gen',
    co2: 0.8,
    waste: 45,
    energy: 35,
    water: 200
  }, {
    month: 'Feb',
    co2: 1.2,
    waste: 58,
    energy: 48,
    water: 180
  }, {
    month: 'Mar',
    co2: 0.9,
    waste: 72,
    energy: 62,
    water: 220
  }, {
    month: 'Apr',
    co2: 1.8,
    waste: 68,
    energy: 75,
    water: 190
  }, {
    month: 'Mag',
    co2: 2.1,
    waste: 85,
    energy: 82,
    water: 210
  }];
  const welfareStats = [{
    title: "Premi Disponibili",
    value: "24",
    icon: Gift,
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-100 to-green-200"
  }, {
    title: "Premi Assegnati",
    value: "156",
    icon: Award,
    color: "text-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-100 to-yellow-200"
  }, {
    title: "Dipendenti Attivi",
    value: "89",
    icon: Users,
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-100 to-pink-200"
  }, {
    title: "Utilizzo Benefit",
    value: "67%",
    icon: TrendingUp,
    color: "text-sky-600",
    bgColor: "bg-gradient-to-br from-sky-100 to-sky-200"
  }];
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-sm font-semibold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>;
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-blue-600 bg-clip-text text-transparent">Dashboard Aziendale</h1>
            <p className="text-slate-600 text-lg">
              Gestione aziendale ESG e sostenibilità digitale
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/")} className="px-3 py-1 border-green-200 text-green-700 hover:bg-green-50">
              <Home className="w-4 h-4 mr-1" />
              Dashboard Home
            </Button>
          </div>
        </div>

        {/* Section 1: ESG Monitor */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">Monitor ESG - Grafici e Indicatori</h2>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select value={timeFilter} onChange={e => setTimeFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-1 text-sm">
                <option value="day">Giorno</option>
                <option value="month">Mese</option>
                <option value="quarter">Trimestre</option>
                <option value="year">Anno</option>
              </select>
            </div>
          </div>

          {/* ESG Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* CO2 Reduction Chart */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Riduzione CO₂
                </CardTitle>
                <CardDescription>2.4t / 4.0t obiettivo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={co2Data} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={70} fill="#8884d8" dataKey="value">
                      {co2Data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Progress value={60} className="h-2 mt-2" />
                <p className="text-sm text-center text-slate-600 mt-1">60% obiettivo</p>
              </CardContent>
            </Card>

            {/* Waste & Recycling Chart */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Recycle className="w-5 h-5 text-blue-600" />
                  Rifiuti & Riciclo
                </CardTitle>
                <CardDescription>Gestione sostenibile</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={wasteData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={70} fill="#8884d8" dataKey="value">
                      {wasteData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-sm text-green-600 font-semibold">85% sostenibile</p>
                </div>
              </CardContent>
            </Card>

            {/* Energy Consumption Chart */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Consumo Energia
                </CardTitle>
                <CardDescription>kWh mensili</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={energyData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={70} fill="#8884d8" dataKey="value">
                      {energyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-sm text-green-600 font-semibold">45% rinnovabile</p>
                </div>
              </CardContent>
            </Card>

            {/* Water Consumption Chart */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  Consumo Idrico
                </CardTitle>
                <CardDescription>Litri/mese</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={waterData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={70} fill="#8884d8" dataKey="value">
                      {waterData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-sm text-blue-600 font-semibold">30% risparmiata</p>
                </div>
              </CardContent>
            </Card>

            {/* Certificates Chart */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-purple-600" />
                  Certificati ESG
                </CardTitle>
                <CardDescription>Emessi questo mese</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={certificatesData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={70} fill="#8884d8" dataKey="value">
                      {certificatesData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-sm text-purple-600 font-semibold">156 completati</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Analysis with more dynamic lines */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Trend Mensile ESG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }} />
                  <Legend />
                  <Line type="monotone" dataKey="co2" stroke="#22c55e" strokeWidth={4} dot={{
                  fill: '#22c55e',
                  strokeWidth: 3,
                  r: 6
                }} activeDot={{
                  r: 8,
                  stroke: '#22c55e',
                  strokeWidth: 2,
                  fill: '#ffffff'
                }} name="CO₂ Ridotta (t)" />
                  <Line type="monotone" dataKey="waste" stroke="#3b82f6" strokeWidth={4} dot={{
                  fill: '#3b82f6',
                  strokeWidth: 3,
                  r: 6
                }} activeDot={{
                  r: 8,
                  stroke: '#3b82f6',
                  strokeWidth: 2,
                  fill: '#ffffff'
                }} name="Rifiuti Riciclati (%)" />
                  <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={4} dot={{
                  fill: '#f59e0b',
                  strokeWidth: 3,
                  r: 6
                }} activeDot={{
                  r: 8,
                  stroke: '#f59e0b',
                  strokeWidth: 2,
                  fill: '#ffffff'
                }} name="Energia Rinnovabile (%)" />
                  <Line type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={4} dot={{
                  fill: '#06b6d4',
                  strokeWidth: 3,
                  r: 6
                }} activeDot={{
                  r: 8,
                  stroke: '#06b6d4',
                  strokeWidth: 2,
                  fill: '#ffffff'
                }} name="Acqua Risparmiata (L)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Welfare & Benefits */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900">Spazio Welfare & Premi</h2>
          </div>

          {/* Welfare Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {welfareStats.map((stat, index) => <Card key={index} className={`border-0 shadow-lg ${stat.bgColor} hover:shadow-xl transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-white/70 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {/* Welfare Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100 text-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Carica Nuovi Premi
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Aggiungi gift card, benefit fiscali e tempo libero
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-semibold" onClick={() => navigate('/welfare-upload')}>
                  <Heart className="w-5 h-5 mr-3" />
                  Carica Welfare
                </Button>
                
                <Button className="w-full mb-4 bg-amber-600 hover:bg-amber-700 text-white h-12 text-base font-semibold" onClick={() => navigate('/rewards-management')}>
                  <Star className="w-5 h-5 mr-3" />
                  Premi e Sconti
                </Button>
                
                <div className="grid grid-cols-1 gap-4">
                  
                  
                  
                  
                  
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Criteri di Assegnazione
                </CardTitle>
                <CardDescription>
                  Definisci le regole per l'assegnazione automatica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">10 Certificati = Buono Mensile €50</p>
                    <p className="text-xs text-blue-600">Attivo • 67 dipendenti qualificati</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-900">25 Certificati = Giorno Libero Extra</p>
                    <p className="text-xs text-green-600">Attivo • 23 dipendenti qualificati</p>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi Criterio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 3: Digital Product Passport */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-slate-900">Digital Product Passport (DPP)</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DPP Upload */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Caricamento DPP
                </CardTitle>
                <CardDescription>
                  Drag & drop o carica i Digital Product Passport
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-300 transition-colors duration-200 bg-purple-50/50">
                  <Package className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-slate-700">
                      Trascina i DPP qui o clicca per selezionare
                    </p>
                    <p className="text-sm text-slate-500">
                      Supportati: JSON, XML, PDF (max 10MB)
                    </p>
                  </div>
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".json,.xml,.pdf" id="dpp-upload" />
                  <label htmlFor="dpp-upload">
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/digital-warranty-upload')}>
                      <span>Seleziona DPP</span>
                    </Button>
                  </label>
                </div>

                {/* Recently Uploaded DPPs */}
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">DPP Caricati di Recente</h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {/* DPP Example 1 - Smartphone */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=48&h=48&fit=crop&auto=format" alt="Smartphone DPP" className="w-8 h-8 rounded object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-900 text-sm">Smartphone Eco-Friendly</p>
                        <p className="text-xs text-blue-600">DPP-SPH-2024-001 • Caricato: 2 ore fa</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Verificato</Badge>
                    </div>

                    {/* DPP Example 2 - Laptop */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=48&h=48&fit=crop&auto=format" alt="Laptop DPP" className="w-8 h-8 rounded object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-purple-900 text-sm">Laptop Sostenibile</p>
                        <p className="text-xs text-purple-600">DPP-LPT-2024-002 • Caricato: 5 ore fa</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">In Processo</Badge>
                    </div>

                    {/* DPP Example 3 - Drone */}
                    
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Aziendale */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                  Wallet Aziendale
                </CardTitle>
                <CardDescription className="text-indigo-700">
                  Tutti i certificati digitali ESG e DPP dell'azienda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-green-100 rounded-lg">
                    <p className="text-2xl font-bold text-green-800">156</p>
                    <p className="text-sm text-green-600">Certificati ESG</p>
                  </div>
                  <div className="text-center p-3 bg-purple-100 rounded-lg">
                    <p className="text-2xl font-bold text-purple-800">89</p>
                    <p className="text-sm text-purple-600">DPP Registrati</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* ESG Certificate Example */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 rounded-full">
                        <Leaf className="w-4 h-4 text-green-700" />
                      </div>
                      <div>
                        <p className="font-medium text-green-900">Certificato CO₂ Reduction</p>
                        <p className="text-sm text-green-600">ESG-2024-001 • Emesso: 15/06/2024</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Attivo</Badge>
                  </div>

                  {/* DPP Certificate Example */}
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-200 rounded-full">
                        <Shield className="w-4 h-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-900">DPP Smartphone Eco-Friendly</p>
                        <p className="text-sm text-purple-600">DPP-SPH-2024-001 • 5 certificati collegati</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-600">Verificato</Badge>
                  </div>

                  {/* Water Saving Certificate */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-200 rounded-full">
                        <Droplets className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Certificato Risparmio Idrico</p>
                        <p className="text-sm text-blue-600">ESG-2024-015 • 1,200L risparmiati</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-600">Attivo</Badge>
                  </div>

                  {/* Energy Certificate */}
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-200 rounded-full">
                        <Zap className="w-4 h-4 text-yellow-700" />
                      </div>
                      <div>
                        <p className="font-medium text-yellow-900">Certificato Energia Rinnovabile</p>
                        <p className="text-sm text-yellow-600">ESG-2024-008 • 45% energia green</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-600">Attivo</Badge>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizza Tutti
                    </Button>
                    <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                      <Download className="w-4 h-4 mr-2" />
                      Esporta Wallet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 4: ESG Report Generation */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-100 to-orange-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-orange-800">
              <FileCheck className="w-6 h-6" />
              Generazione Report ESG Certificato
            </CardTitle>
            <CardDescription className="text-orange-600 text-sm md:text-base">
              Report PDF certificato, conforme CSRD, ESRS, ESPR e Digital Product Passport
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              
              
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm py-3">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Genera Report ESG
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <FileCheck className="w-6 h-6 text-orange-600" />
                      Generazione Report ESG & DPP Certificato
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Genera un report dettagliato certificato con tutti i dati ESG e Digital Product Passport, conforme alle normative CSRD, ESRS e ESPR.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Report Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Periodo di riferimento</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white">
                          <option>Ultimo trimestre (Gen-Mar 2024)</option>
                          <option>Ultimo semestre (Set 2023 - Mar 2024)</option>
                          <option>Ultimo anno (Mar 2023 - Mar 2024)</option>
                          <option>Anno solare 2024</option>
                          <option>Personalizzato</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Formato output</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white">
                          <option>PDF Certificato + Blockchain</option>
                          <option>PDF + Excel + JSON</option>
                          <option>Report Completo Multi-formato</option>
                        </select>
                      </div>
                    </div>

                    {/* Report Content Selection */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Contenuti del Report</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">Riduzione CO₂ (2.4t/4.0t)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">Gestione Rifiuti (85% sostenibile)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">Consumo Energia (45% rinnovabile)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">Risparmio Idrico (1,200L)</span>
                          </label>
                        </div>
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">Certificati ESG (156 emessi)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">DPP Registrati (89 prodotti)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">Analisi Trend Mensili</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">Conformità Normative</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Certification Details */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Certificazione e Conformità</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>✓ Conforme CSRD (Corporate Sustainability Reporting Directive)</p>
                        <p>✓ Standard ESRS (European Sustainability Reporting Standards)</p>
                        <p>✓ Regolamento ESPR (Ecodesign for Sustainable Products)</p>
                        <p>✓ Digital Product Passport EU compliant</p>
                        <p>✓ Firma digitale e timestamp blockchain</p>
                      </div>
                    </div>

                    {/* Report Preview */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Anteprima Contenuti Report</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Sezione ESG:</p>
                          <ul className="text-gray-600 space-y-0.5 ml-2">
                            <li>• Executive Summary</li>
                            <li>• Obiettivi vs Risultati</li>
                            <li>• Grafici e Trend Analysis</li>
                            <li>• Certificazioni Ottenute</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Sezione DPP:</p>
                          <ul className="text-gray-600 space-y-0.5 ml-2">
                            <li>• Registro Prodotti Digitali</li>
                            <li>• Tracciabilità Supply Chain</li>
                            <li>• Impatto Ambientale Prodotti</li>
                            <li>• Conformità Normative EU</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1" onClick={() => setShowReportDialog(false)}>
                      Annulla
                    </Button>
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Genera Report Certificato
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default DashboardAziende;
