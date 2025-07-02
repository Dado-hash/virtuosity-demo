
import React from 'react';
import { Building2, Users, Leaf, RefreshCw, ArrowRightLeft, Repeat } from 'lucide-react';

const CircularityIcons = () => {
  return (
    <div className="flex justify-center items-center space-x-8 py-8">
      <div className="flex flex-col items-center text-green-600">
        <Leaf className="w-12 h-12 mb-2" />
        <span className="text-sm font-medium">Sostenibilità</span>
      </div>
      <div className="flex flex-col items-center text-blue-600">
        <RefreshCw className="w-12 h-12 mb-2" />
        <span className="text-sm font-medium">Economia Circolare</span>
      </div>
      <div className="flex flex-col items-center text-emerald-600">
        <ArrowRightLeft className="w-12 h-12 mb-2" />
        <span className="text-sm font-medium">Scambio</span>
      </div>
      <div className="flex flex-col items-center text-cyan-600">
        <Building2 className="w-12 h-12 mb-2" />
        <span className="text-sm font-medium">Aziende</span>
      </div>
      <div className="flex flex-col items-center text-indigo-600">
        <Users className="w-12 h-12 mb-2" />
        <span className="text-sm font-medium">Community</span>
      </div>
      <div className="flex flex-col items-center text-purple-600">
        <Repeat className="w-12 h-12 mb-2" />
        <span className="text-sm font-medium">Riutilizzo</span>
      </div>
    </div>
  );
};

export default CircularityIcons;
