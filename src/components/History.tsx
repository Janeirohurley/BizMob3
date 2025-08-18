import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, History as HistoryIcon, TrendingUp, TrendingDown, Search, Filter, Calendar } from 'lucide-react';
import { Purchase, Sale, Client } from '../types/business';
import { useLanguage } from './LanguageContext';

interface HistoryProps {
  purchases: Purchase[];
  sales: Sale[];
  clients: Client[];
  onClose: () => void;
}

interface Transaction {
  id: string;
  date: string;
  type: 'purchase' | 'sale';
  amount: number;
  party: string; // supplier for purchase, client for sale
  description: string;
  paymentStatus?: string;
}

export function History({ purchases, sales, clients, onClose }: HistoryProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedParty, setSelectedParty] = useState('');

  // Convert purchases and sales to unified transaction format
  const getAllTransactions = (): Transaction[] => {
    const purchaseTransactions: Transaction[] = purchases.map(purchase => ({
      id: purchase.id,
      date: purchase.date,
      type: 'purchase',
      amount: purchase.totalPrice,
      party: purchase.supplierName,
      description: `${purchase.productName} (${purchase.quantity} units)`
    }));

    const saleTransactions: Transaction[] = sales.map(sale => ({
      id: sale.id,
      date: sale.date,
      type: 'sale',
      amount: sale.totalAmount,
      party: sale.clientName,
      description: sale.items.map(item => `${item.productName} (${item.quantity})`).join(', '),
      paymentStatus: sale.paymentStatus
    }));

    return [...purchaseTransactions, ...saleTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const transactions = getAllTransactions();

  // Get unique parties (suppliers and clients)
  const getAllParties = () => {
    const suppliers = [...new Set(purchases.map(p => p.supplierName))];
    const clientNames = [...new Set(sales.map(s => s.clientName))];
    return [...suppliers, ...clientNames].sort();
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = !searchTerm || 
      transaction.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchesType = selectedFilter === 'all' || transaction.type === selectedFilter;

    // Party filter
    const matchesParty = !selectedParty || selectedParty === 'all-parties' || transaction.party === selectedParty;

    // Date filter
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return transactionDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return transactionDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return transactionDate >= yearAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesType && matchesParty && matchesDate;
  });

  // Get transaction statistics
  const getStats = () => {
    const totalPurchases = filteredTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalSales = filteredTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalSales - totalPurchases;

    return {
      totalTransactions: filteredTransactions.length,
      totalPurchases,
      totalSales,
      profit
    };
  };

  const stats = getStats();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Group transactions by date
  const groupTransactionsByDate = () => {
    const grouped: { [key: string]: Transaction[] } = {};
    
    filteredTransactions.forEach(transaction => {
      const dateKey = formatDateShort(transaction.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });

    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate();

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
        <h2 className="text-gray-800">{t.history}</h2>
        <div className="w-9" />
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-gray-800">Transaction History</h3>
          <p className="text-gray-600">Complete business transaction log</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <h3 className="text-blue-600">{stats.totalTransactions}</h3>
            <p className="text-gray-600 text-sm">Total Transactions</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className={stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
              ${Math.abs(stats.profit).toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">
              {stats.profit >= 0 ? 'Profit' : 'Loss'}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 space-y-4">
          <h4 className="text-gray-800 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Search */}
            <div className="col-span-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Type Filter */}
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">Sales Only</SelectItem>
                <SelectItem value="purchase">Purchases Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Party Filter */}
            <div className="col-span-2">
              <Select value={selectedParty} onValueChange={setSelectedParty}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by client/supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-parties">All Parties</SelectItem>
                  {getAllParties().map((party) => (
                    <SelectItem key={party} value={party}>{party}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedFilter !== 'all' || dateFilter !== 'all' || (selectedParty && selectedParty !== 'all-parties')) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
                setDateFilter('all');
                setSelectedParty('');
              }}
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}
        </Card>

        {/* Transaction List */}
        <div className="space-y-4">
          {Object.keys(groupedTransactions).length === 0 ? (
            <Card className="p-8 text-center">
              <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-gray-800 mb-2">No transactions found</h4>
              <p className="text-gray-600">
                {searchTerm || selectedFilter !== 'all' || dateFilter !== 'all' || selectedParty
                  ? 'Try adjusting your filters'
                  : 'Start making purchases and sales to see your transaction history'}
              </p>
            </Card>
          ) : (
            Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <Card key={date} className="p-4">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <h4 className="text-gray-800">{date}</h4>
                  <span className="text-sm text-gray-500">
                    ({dayTransactions.length} transactions)
                  </span>
                </div>
                
                <div className="space-y-3">
                  {dayTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'sale' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {transaction.type === 'sale' ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>
                        
                        <div>
                          <h5 className="text-gray-800">
                            {transaction.type === 'sale' ? 'Sale to' : 'Purchase from'} {transaction.party}
                          </h5>
                          <p className="text-sm text-gray-600 truncate max-w-48">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-medium ${
                          transaction.type === 'sale' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {transaction.type === 'sale' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                        
                        {transaction.paymentStatus && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            transaction.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            transaction.paymentStatus === 'partial' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.paymentStatus === 'debt' ? 'Unpaid' : 
                             transaction.paymentStatus.charAt(0).toUpperCase() + transaction.paymentStatus.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Daily Summary */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <span className="text-gray-600">Sales: </span>
                      <span className="text-green-600 font-medium">
                        ${dayTransactions
                          .filter(t => t.type === 'sale')
                          .reduce((sum, t) => sum + t.amount, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Purchases: </span>
                      <span className="text-blue-600 font-medium">
                        ${dayTransactions
                          .filter(t => t.type === 'purchase')
                          .reduce((sum, t) => sum + t.amount, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Net: </span>
                      <span className={`font-medium ${
                        (dayTransactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0) -
                         dayTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0)) >= 0
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${(dayTransactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0) -
                           dayTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}