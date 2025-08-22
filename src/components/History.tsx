import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, History as HistoryIcon, TrendingUp, TrendingDown, Search, Filter, Calendar, Download, Edit, FileText } from 'lucide-react';
import { Purchase, Sale, Client } from '../types/business';
import { useLanguage } from './LanguageContext';
import { useBusinessData } from '@/hooks/useBusinessData';

interface HistoryProps {
  purchases: Purchase[];
  sales: Sale[];
  clients: Client[];
  onClose: () => void;
  onEditPurchase?: (purchase: Purchase) => void;
  onEditSale?: (sale: Sale) => void;
}

interface Transaction {
  id: string;
  date?: string;
  type: 'purchase' | 'sale';
  amount: number;
  party: string; // supplier for purchase, client for sale
  description: string;
  paymentStatus?: string;
}

export function History({ purchases, sales, clients, onClose, onEditPurchase, onEditSale }: HistoryProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedParty, setSelectedParty] = useState('');
  const { formatCurrency } = useBusinessData()

  // Convert purchases and sales to unified transaction format
  const getAllTransactions = (): Transaction[] => {

    const purchaseTransactions: Transaction[] = purchases.map(purchase => ({
      id: purchase.id,
      date: purchase.purchaseDate,
      type: 'purchase',
      amount: purchase.totalPrice,
      party: purchase.supplierName,
      description: `${purchase.productName} (${purchase.quantity} units)`
    }));

    const saleTransactions: Transaction[] = sales.map(sale => ({
      id: sale.id,
      date: sale.saleDate,
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
    return date.toLocaleDateString(language) + ' ' + date.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language);
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

  // Export history as CSV
  const handleExportHistory = () => {
    const headers = [
      t.date,
      t.transactionType,
      t.party,
      t.description,
      t.amount,
      t.paymentStatus
    ];

    const rows = filteredTransactions.map(transaction => [
      formatDate(transaction.date),
      transaction.type === 'sale' ? t.saleTo : t.purchaseFrom,
      transaction.party,
      transaction.description,
      transaction.amount.toFixed(2),
      transaction.paymentStatus ? (transaction.paymentStatus === 'paid' ? t.paid :
        transaction.paymentStatus === 'partial' ? t.partial : t.unpaid) : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `bizmob-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <h2 className="text-lg sm:text-xl text-gray-800">{t.history}</h2>
        <Button onClick={handleExportHistory} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t.exportHistory}
        </Button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-base sm:text-lg text-gray-800">{t.transactionHistory}</h3>
          <p className="text-sm text-gray-600">{t.completeBusinessTransactionLog}</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <h3 className="text-base sm:text-lg text-blue-600">{stats.totalTransactions}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{t.totalTransactions}</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className={`text-base sm:text-lg ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`} title={stats.profit.toFixed()}>
              {formatCurrency(stats.profit)}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 " >
              {stats.profit >= 0 ? t.profit : t.loss}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 space-y-4">
          <h4 className="text-base sm:text-lg text-gray-800 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t.filters}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search */}
            <div className="col-span-1 sm:col-span-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t.searchTransactions}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            </div>

            {/* Type Filter */}
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.transactionType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allTypes}</SelectItem>
                <SelectItem value="sale">{t.salesOnly}</SelectItem>
                <SelectItem value="purchase">{t.purchasesOnly}</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.dateRange} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allTime}</SelectItem>
                <SelectItem value="today">{t.today}</SelectItem>
                <SelectItem value="week">{t.last7Days}</SelectItem>
                <SelectItem value="month">{t.last30Days}</SelectItem>
                <SelectItem value="year">{t.lastYear}</SelectItem>
              </SelectContent>
            </Select>

            {/* Party Filter */}
            <div className="col-span-1 sm:col-span-2">
              <Select value={selectedParty} onValueChange={setSelectedParty}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterByParty} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-parties">{t.allParties}</SelectItem>
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
              className="w-full text-sm"
            >
              {t.clearAllFilters}
            </Button>
          )}
        </Card>

        {/* Transaction List */}
        <div className="space-y-4">
          {Object.keys(groupedTransactions).length === 0 ? (
            <Card className="p-8 text-center">
              <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-base sm:text-lg text-gray-800 mb-2">{t.noTransactionsFound}</h4>
              <p className="text-sm text-gray-600">
                {searchTerm || selectedFilter !== 'all' || dateFilter !== 'all' || selectedParty
                  ? t.adjustFilters
                  : t.startTransactions}
              </p>
            </Card>
          ) : (
            Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <Card key={date} className="p-4">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <h4 className="text-base sm:text-lg text-gray-800">{date}</h4>
                  <span className="text-xs sm:text-sm text-gray-500">
                    ({dayTransactions.length} {t.totalTransactions.toLowerCase()})
                  </span>
                </div>

                <div className="space-y-3">
                  {dayTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'sale'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                          }`}>
                          {transaction.type === 'sale' ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>

                        <div className=''>
                          <h5 className="text-sm  text-gray-800 ">
                            {transaction.type === 'sale' ? t.saleTo : t.purchaseFrom} {transaction.party}
                          </h5>
                          <p className="text-xs  text-gray-600 truncate max-w-[150px] sm:max-w-[200px]">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (transaction.type === 'purchase' && onEditPurchase) {
                              const purchase = purchases.find(p => p.id === transaction.id);
                              if (purchase) onEditPurchase(purchase);
                            } else if (transaction.type === 'sale' && onEditSale) {
                              const sale = sales.find(s => s.id === transaction.id);
                              if (sale) onEditSale(sale);
                            }
                          }}
                          className="p-1 h-auto"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <div className="text-right">
                        <div className={`text-sm  font-medium ${transaction.type === 'sale' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                          {transaction.type === 'sale' ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>

                        {transaction.paymentStatus && (
                          <span className={`text-xs px-2 py-1 rounded ${transaction.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            transaction.paymentStatus === 'partial' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {transaction.paymentStatus === 'paid' ? t.paid :
                              transaction.paymentStatus === 'partial' ? t.partial : t.unpaid}
                          </span>
                        )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Daily Summary */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-600">{t.sales}: </span>
                      <span className="text-green-600 font-medium">
                        {formatCurrency(dayTransactions
                          .filter(t => t.type === 'sale')
                          .reduce((sum, t) => sum + t.amount, 0))}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t.purchases}: </span>
                      <span className="text-blue-600 font-medium">
                        {formatCurrency(dayTransactions
                          .filter(t => t.type === 'purchase')
                          .reduce((sum, t) => sum + t.amount, 0))
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t.net}: </span>
                      <span className={`font-medium ${(dayTransactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0) -
                        dayTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0)) >= 0
                        ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {formatCurrency(dayTransactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0) -
                          dayTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0))}
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