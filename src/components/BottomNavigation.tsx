import React, { useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Home, 
  Plus, 
  Users, 
  TrendingUp, 
  Settings,
  Package,
  ShoppingCart,
  FileText,
  CreditCard,
  BarChart3
} from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

export function BottomNavigation({ currentScreen, onScreenChange }: BottomNavigationProps) {
  const [showTransactionsPopover, setShowTransactionsPopover] = useState(false);
  const [showAnalyticsPopover, setShowAnalyticsPopover] = useState(false);

  const isActive = (screen: string) => currentScreen === screen;
  const isTransactionScreen = ['transactions', 'add-purchase', 'add-sale'].includes(currentScreen);
  const isAnalyticsScreen = ['reports', 'products', 'history'].includes(currentScreen);

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around py-2">
        
        {/* Dashboard */}
        <Button
          variant={isActive('dashboard') ? 'default' : 'ghost'}
          onClick={() => onScreenChange('dashboard')}
          className={`flex flex-col items-center gap-1 h-12 px-3 ${
            isActive('dashboard') ? 'bg-blue-600 text-white' : 'text-gray-600'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-xs">Home</span>
        </Button>

        {/* Transactions (Buy/Sell grouped) */}
        <Popover open={showTransactionsPopover} onOpenChange={setShowTransactionsPopover}>
          <PopoverTrigger asChild>
            <Button
              variant={isTransactionScreen ? 'default' : 'ghost'}
              className={`flex flex-col items-center gap-1 h-12 px-3 ${
                isTransactionScreen ? 'bg-green-600 text-white' : 'text-gray-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Add</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="center" side="top">
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => {
                  onScreenChange('add-purchase');
                  setShowTransactionsPopover(false);
                }}
                className="w-full justify-start"
              >
                <Package className="w-4 h-4 mr-2" />
                Add Purchase
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onScreenChange('add-sale');
                  setShowTransactionsPopover(false);
                }}
                className="w-full justify-start"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add Sale
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clients */}
        <Button
          variant={isActive('clients') ? 'default' : 'ghost'}
          onClick={() => onScreenChange('clients')}
          className={`flex flex-col items-center gap-1 h-12 px-3 ${
            isActive('clients') ? 'bg-purple-600 text-white' : 'text-gray-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-xs">Clients</span>
        </Button>

        {/* Analytics (Reports, Products, History grouped) */}
        <Popover open={showAnalyticsPopover} onOpenChange={setShowAnalyticsPopover}>
          <PopoverTrigger asChild>
            <Button
              variant={isAnalyticsScreen ? 'default' : 'ghost'}
              className={`flex flex-col items-center gap-1 h-12 px-3 ${
                isAnalyticsScreen ? 'bg-orange-600 text-white' : 'text-gray-600'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Analytics</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="center" side="top">
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => {
                  onScreenChange('reports');
                  setShowAnalyticsPopover(false);
                }}
                className="w-full justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onScreenChange('products');
                  setShowAnalyticsPopover(false);
                }}
                className="w-full justify-start"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onScreenChange('history');
                  setShowAnalyticsPopover(false);
                }}
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onScreenChange('debts');
                  setShowAnalyticsPopover(false);
                }}
                className="w-full justify-start"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Debts
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Settings */}
        <Button
          variant={isActive('settings') ? 'default' : 'ghost'}
          onClick={() => onScreenChange('settings')}
          className={`flex flex-col items-center gap-1 h-12 px-3 ${
            isActive('settings') ? 'bg-gray-600 text-white' : 'text-gray-600'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-xs">Settings</span>
        </Button>

      </div>
    </div>
  );
}