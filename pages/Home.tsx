import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

interface HomeProps {
  onNavigate: (screen: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-gray-800 mb-2">BizMob</h1>
        <p className="text-gray-600">Your offline business management companion</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('add-purchase')}>
          <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-gray-800 mb-1">Purchases</h3>
          <p className="text-gray-600 text-sm">Manage inventory</p>
        </Card>

        <Card className="p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('add-sale')}>
          <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-gray-800 mb-1">Sales</h3>
          <p className="text-gray-600 text-sm">Record transactions</p>
        </Card>

        <Card className="p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('clients')}>
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="text-gray-800 mb-1">Clients</h3>
          <p className="text-gray-600 text-sm">Customer management</p>
        </Card>

        <Card className="p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('reports')}>
          <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <h3 className="text-gray-800 mb-1">Reports</h3>
          <p className="text-gray-600 text-sm">Business insights</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-gray-800 mb-3">Quick Start</h3>
        <div className="space-y-2">
          <Button 
            onClick={() => onNavigate('add-purchase')} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Your First Purchase
          </Button>
          <Button 
            onClick={() => onNavigate('add-sale')} 
            variant="outline" 
            className="w-full"
          >
            Record Your First Sale
          </Button>
        </div>
      </Card>
    </div>
  );
}