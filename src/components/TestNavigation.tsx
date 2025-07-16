import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Database, ShoppingBag, Home } from 'lucide-react';

const TestNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      color: 'bg-gray-600 hover:bg-gray-700'
    },
    { 
      path: '/supabase-test', 
      label: 'Supabase Test', 
      icon: Database,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    { 
      path: '/activities', 
      label: 'Activities', 
      icon: Activity,
      color: 'bg-green-600 hover:bg-green-700'
    },
    { 
      path: '/marketplace-test', 
      label: 'Marketplace Test', 
      icon: ShoppingBag,
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Card className="p-4 mb-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <div className="flex flex-wrap gap-2 justify-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              variant={isActive(item.path) ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                isActive(item.path) 
                  ? item.color + ' text-white' 
                  : 'hover:scale-105 transition-transform'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default TestNavigation;
