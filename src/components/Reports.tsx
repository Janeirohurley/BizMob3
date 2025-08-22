
import React, { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { Purchase, Sale, Debt, Product, Client } from '../types/business';
import { useLanguage } from './LanguageContext';
import { useBusinessData } from '@/hooks/useBusinessData';

interface ReportsProps {
  purchases: Purchase[];
  sales: Sale[];
  debts: Debt[];
  products: Product[];
  clients: Client[];
}

export function Reports({ purchases, sales, debts, products, clients }: ReportsProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('daily');

  // Calculate totals
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalDebts = debts.reduce((sum, debt) => sum + debt.totalDebt, 0);
  const totalProfit = totalSales - totalPurchases;
  const { formatCurrency } = useBusinessData()
  // Generate time-based data
  const generateTimeBasedData = (period: 'daily' | 'monthly' | 'yearly') => {
    const now = new Date();
    const data = [];
    let periods = 7; // days
    let dateFormat = { weekday: 'short' } as Intl.DateTimeFormatOptions;

    if (period === 'monthly') {
      periods = 12;
      dateFormat = { month: 'short' };
    } else if (period === 'yearly') {
      periods = 5;
      dateFormat = { year: 'numeric' };
    }

    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(now);

      if (period === 'daily') {
        date.setDate(date.getDate() - i);
      } else if (period === 'monthly') {
        date.setMonth(date.getMonth() - i);
      } else {
        date.setFullYear(date.getFullYear() - i);
      }

      const startOfPeriod = new Date(date);
      const endOfPeriod = new Date(date);

      if (period === 'daily') {
        startOfPeriod.setHours(0, 0, 0, 0);
        endOfPeriod.setHours(23, 59, 59, 999);
      } else if (period === 'monthly') {
        startOfPeriod.setDate(1);
        startOfPeriod.setHours(0, 0, 0, 0);
        endOfPeriod.setMonth(endOfPeriod.getMonth() + 1, 0);
        endOfPeriod.setHours(23, 59, 59, 999);
      } else {
        startOfPeriod.setMonth(0, 1);
        startOfPeriod.setHours(0, 0, 0, 0);
        endOfPeriod.setMonth(11, 31);
        endOfPeriod.setHours(23, 59, 59, 999);
      }

      const periodSales = sales
        .filter(sale => {
          const saleDate = new Date(sale.saleDate);
          return saleDate >= startOfPeriod && saleDate <= endOfPeriod;
        })
        .reduce((sum, sale) => sum + sale.totalAmount, 0);

      const periodPurchases = purchases
        .filter(purchase => {
          const purchaseDate = new Date(purchase.purchaseDate);
          return purchaseDate >= startOfPeriod && purchaseDate <= endOfPeriod;
        })
        .reduce((sum, purchase) => sum + purchase.totalPrice, 0);

      data.push({
        period: date.toLocaleDateString('en-US', dateFormat),
        sales: periodSales,
        purchases: periodPurchases,
        profit: periodSales - periodPurchases
      });
    }

    return data;
  };

  // Generate pie chart data for client distribution
  const generateClientDistribution = () => {
    const clientTotals: { [key: string]: number } = {};

    sales.forEach(sale => {
      if (clientTotals[sale.clientName]) {
        clientTotals[sale.clientName] += sale.totalAmount;
      } else {
        clientTotals[sale.clientName] = sale.totalAmount;
      }
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return Object.entries(clientTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([client, total], index) => ({
        name: client,
        value: total,
        color: colors[index]
      }));
  };

  // Generate supplier distribution
  const generateSupplierDistribution = () => {
    const supplierTotals: { [key: string]: number } = {};

    purchases.forEach(purchase => {
      if (supplierTotals[purchase.supplierName]) {
        supplierTotals[purchase.supplierName] += purchase.totalPrice;
      } else {
        supplierTotals[purchase.supplierName] = purchase.totalPrice;
      }
    });

    const colors = ['#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

    return Object.entries(supplierTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([supplier, total], index) => ({
        name: supplier,
        value: total,
        color: colors[index]
      }));
  };

  // Export report as CSV
  const handleExportReport = () => {
    const headers = [
      t.totalSales,
      t.totalPurchases,
      t.netProfit,
      t.outstandingDebts,
      t.profitMargin,
      t.totalTransactions,
      t.clientsWithDebt
    ];

    const overviewData = [
      totalSales.toFixed(2),
      totalPurchases.toFixed(2),
      totalProfit.toFixed(2),
      totalDebts.toFixed(2),
      totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) + '%' : 'N/A',
      (sales.length + purchases.length).toString(),
      debts.filter(debt => debt.totalDebt > 0).length.toString()
    ];

    const timeBasedHeaders = [t.period, t.sales, t.purchases, t.profit];
    const timeBasedRows = generateTimeBasedData(activeTab as 'daily' | 'monthly' | 'yearly').map(data => [
      data.period,
      data.sales.toFixed(2),
      data.purchases.toFixed(2),
      data.profit.toFixed(2)
    ]);

    const clientHeaders = [t.clientName, t.totalSales];
    const clientRows = generateClientDistribution().map(data => [
      data.name,
      data.value.toFixed(2)
    ]);

    const supplierHeaders = [t.supplierName, t.totalPurchases];
    const supplierRows = generateSupplierDistribution().map(data => [
      data.name,
      data.value.toFixed(2)
    ]);

    const debtHeaders = [t.clientName, t.outstandingDebt];
    const debtRows = debts.filter(debt => debt.totalDebt > 0).map(debt => [
      debt.clientName,
      debt.totalDebt.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      overviewData.join(','),
      '',
      timeBasedHeaders.join(','),
      ...timeBasedRows.map(row => row.join(',')),
      '',
      clientHeaders.join(','),
      ...clientRows.map(row => row.join(',')),
      '',
      supplierHeaders.join(','),
      ...supplierRows.map(row => row.join(',')),
      '',
      debtHeaders.join(','),
      ...debtRows.map(row => row.join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `bizmob-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const timeBasedData = generateTimeBasedData(activeTab as 'daily' | 'monthly' | 'yearly');
  const clientDistribution = generateClientDistribution();
  const supplierDistribution = generateSupplierDistribution();

  // Custom tooltip formatter for BarChart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.fill }}>
              {entry.name === 'sales' ? t.salesTooltip.replace('{value}', entry.value.toFixed(2)) :
                entry.name === 'purchases' ? t.purchasesTooltip.replace('{value}', entry.value.toFixed(2)) :
                  t.profitTooltip.replace('{value}', entry.value.toFixed(2))}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip formatter for PieChart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="text-sm" style={{ color: data.color }}>
            {data.name.includes('Client') ?
              t.clientTooltip.replace('{name}', data.name).replace('{value}', data.value.toFixed(2)) :
              t.supplierTooltip.replace('{name}', data.name).replace('{value}', data.value.toFixed(2))}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg sm:text-xl text-gray-800">{t.businessReports}</h1>
          <p className="text-sm text-gray-600">{t.trackBusinessPerformance}</p>
        </div>
        <Button onClick={handleExportReport} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t.exportReport}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <h3 className="text-base text-green-600">{formatCurrency(totalSales)}</h3>
          <p className="text-xs  text-gray-600">{t.totalSales}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-base  text-blue-600">{formatCurrency(totalPurchases)}</h3>
          <p className="text-xs  text-gray-600">{t.totalPurchases}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className={`text-base   ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(totalProfit)}
          </h3>
          <p className="text-xs  text-gray-600">{t.netProfit}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-base  text-red-600">{formatCurrency(totalDebts)}</h3>
          <p className="text-xs  text-gray-600">{t.outstandingDebts}</p>
        </Card>
      </div>

      {/* Time-based Analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">{t.daily}</TabsTrigger>
          <TabsTrigger value="monthly">{t.monthly}</TabsTrigger>
          <TabsTrigger value="yearly">{t.yearly}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Sales vs Purchases Chart */}
          <Card className="p-4">
            <h3 className="text-base sm:text-lg text-gray-800 mb-4">{t.salesVsPurchases} - {activeTab === 'daily' ? t.daily : activeTab === 'monthly' ? t.monthly : t.yearly}</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <BarChart data={timeBasedData}>
                  <XAxis
                    dataKey="period"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: '10px sm:12px', fill: '#6B7280' }}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" fill="#10B981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="purchases" fill="#EF4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 sm:gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs sm:text-sm text-gray-600">{t.sales}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs sm:text-sm text-gray-600">{t.purchases}</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Distribution */}
      {clientDistribution.length > 0 && (
        <Card className="p-4">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">{t.topClientsBySales}</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <PieChart>
                <Pie
                  data={clientDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {clientDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Supplier Distribution */}
      {supplierDistribution.length > 0 && (
        <Card className="p-4">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">{t.topSuppliersByPurchases}</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <PieChart>
                <Pie
                  data={supplierDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {supplierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Debt Overview */}
      {debts.length > 0 && (
        <Card className="p-4">
          <h3 className="text-base sm:text-lg text-gray-800 mb-4">{t.debtOverview}</h3>
          <div className="space-y-3">
            {debts.filter(debt => debt.totalDebt > 0).map((debt) => (
              <div key={debt.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-800 text-sm sm:text-base">{debt.clientName}</span>
                <span className="text-red-600 text-sm sm:text-base" title={debt.totalDebt.toFixed(2)}>{formatCurrency(debt.totalDebt)}</span>  
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Insights */}
      <Card className="p-4">
        <h3 className="text-base sm:text-lg text-gray-800 mb-4">{t.quickInsights}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm sm:text-base">{t.profitMargin}</span>
            <span className={`text-sm sm:text-base ${totalSales > 0 ? (totalProfit >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-600'}`}>
              {totalSales > 0 ? `${((totalProfit / totalSales) * 100).toFixed(1)}%` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm sm:text-base">{t.totalTransactions}</span>
            <span className="text-blue-600 text-sm sm:text-base">{sales.length + purchases.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm sm:text-base">{t.clientsWithDebt}</span>
            <span className="text-red-600 text-sm sm:text-base">{debts.filter(debt => debt.totalDebt > 0).length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
