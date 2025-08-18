import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, ShoppingCart, Package, Plus } from 'lucide-react';

interface TransactionsViewProps {
  onClose: () => void;
  onAddPurchase: () => void;
  onAddSale: () => void;
}

export function TransactionsView({ onClose, onAddPurchase, onAddSale }: TransactionsViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-gray-800">Transactions</h2>
        <div className="w-9" />
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-gray-800">Choose Transaction Type</h3>
          <p className="text-gray-600">Record a purchase or sale</p>
        </div>

        {/* Transaction Type Cards */}
        <div className="space-y-4">
          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-blue-200"
            onClick={onAddPurchase}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-800 font-medium">Add Purchase</h4>
                <p className="text-gray-600 text-sm">Record inventory purchases from suppliers</p>
              </div>
              <div className="text-blue-600">
                <Plus className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-green-200"
            onClick={onAddSale}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-800 font-medium">Add Sale</h4>
                <p className="text-gray-600 text-sm">Record sales to customers</p>
              </div>
              <div className="text-green-600">
                <Plus className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="text-blue-800 mb-2">💡 Quick Tips</h4>
          <div className="space-y-1 text-sm text-blue-700">
            <p>• Purchases: Add items to your inventory with cost and selling prices</p>
            <p>• Sales: Record customer transactions with multiple products</p>
            <p>• Manual dates: Set custom purchase/sale dates for record keeping</p>
          </div>
        </Card>
      </div>
    </div>
  );
}