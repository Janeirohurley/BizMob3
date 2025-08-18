import React from 'react';
import { Home, ShoppingCart, TrendingUp, BarChart3, Settings, Users, Package } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface BottomNavigationProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

export function BottomNavigation({ currentScreen, onScreenChange }: BottomNavigationProps) {
  const { t } = useLanguage();
  
  const navItems = [
    { id: 'dashboard', label: t.home, icon: Home },
    { id: 'purchases', label: t.buy, icon: ShoppingCart },
    { id: 'sales', label: t.sell, icon: TrendingUp },
    { id: 'products', label: t.products, icon: Package },
    { id: 'clients', label: t.clients, icon: Users },
    { id: 'reports', label: t.reports, icon: BarChart3 },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-1 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id || 
            (item.id === 'purchases' && currentScreen === 'add-purchase') ||
            (item.id === 'sales' && currentScreen === 'add-sale') ||
            (item.id === 'clients' && (currentScreen === 'clients' || currentScreen === 'history'));
          
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`flex flex-col items-center p-1 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-xs mt-1 truncate ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}