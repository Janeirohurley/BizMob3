import React, { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Purchase, Sale, Debt, Product, Client } from '../types/business';

interface ReportsProps {
  purchases: Purchase[];
  sales: Sale[];
  debts: Debt[];
  products: Product[];
  clients: Client[];
}

export function Reports({ purchases, sales, debts, products, clients }: ReportsProps) {
  const [activeTab, setActiveTab] = useState('daily');

  // Calculate totals
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalDebts = debts.reduce((sum, debt) => sum + debt.totalDebt, 0);
  const totalProfit = totalSales - totalPurchases;

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
          const saleDate = new Date(sale.date);
          return saleDate >= startOfPeriod && saleDate <= endOfPeriod;
        })
        .reduce((sum, sale) => sum + sale.totalAmount, 0);

      const periodPurchases = purchases
        .filter(purchase => {
          const purchaseDate = new Date(purchase.date);
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
      .sort(([,a], [,b]) => b - a)
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
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([supplier, total], index) => ({
        name: supplier,
        value: total,
        color: colors[index]
      }));
  };

  const timeBasedData = generateTimeBasedData(activeTab as 'daily' | 'monthly' | 'yearly');
  const clientDistribution = generateClientDistribution();
  const supplierDistribution = generateSupplierDistribution();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-800">Business Reports</h1>
        <p className="text-gray-600">Track your business performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <h3 className="text-green-600">${totalSales.toLocaleString()}</h3>
          <p className="text-gray-600">Total Sales</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-blue-600">${totalPurchases.toLocaleString()}</h3>
          <p className="text-gray-600">Total Purchases</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className={totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
            ${totalProfit.toLocaleString()}
          </h3>
          <p className="text-gray-600">Net Profit</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-red-600">${totalDebts.toLocaleString()}</h3>
          <p className="text-gray-600">Outstanding Debts</p>
        </Card>
      </div>

      {/* Time-based Analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Sales vs Purchases Chart */}
          <Card className="p-4">
            <h3 className="text-gray-800 mb-4">Sales vs Purchases - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeBasedData}>
                  <XAxis 
                    dataKey="period" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis hide />
                  <Bar dataKey="sales" fill="#10B981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="purchases" fill="#EF4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Sales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Purchases</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Distribution */}
      {clientDistribution.length > 0 && (
        <Card className="p-4">
          <h3 className="text-gray-800 mb-4">Top Clients by Sales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Supplier Distribution */}
      {supplierDistribution.length > 0 && (
        <Card className="p-4">
          <h3 className="text-gray-800 mb-4">Top Suppliers by Purchases</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Debt Overview */}
      {debts.length > 0 && (
        <Card className="p-4">
          <h3 className="text-gray-800 mb-4">Debt Overview</h3>
          <div className="space-y-3">
            {debts.filter(debt => debt.totalDebt > 0).map((debt) => (
              <div key={debt.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-800">{debt.clientName}</span>
                <span className="text-red-600">${debt.totalDebt.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Insights */}
      <Card className="p-4">
        <h3 className="text-gray-800 mb-4">Quick Insights</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Profit Margin</span>
            <span className={totalSales > 0 ? (totalProfit >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-600'}>
              {totalSales > 0 ? `${((totalProfit / totalSales) * 100).toFixed(1)}%` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Transactions</span>
            <span className="text-blue-600">{sales.length + purchases.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Clients with Debt</span>
            <span className="text-red-600">{debts.filter(debt => debt.totalDebt > 0).length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}