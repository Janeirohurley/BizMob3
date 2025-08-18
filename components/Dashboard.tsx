import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Plus, TrendingUp, TrendingDown, DollarSign, Users, AlertTriangle, Calendar, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { BusinessData, Purchase, Sale, Debt } from '../types/business';

interface DashboardProps {
  businessData: BusinessData;
  purchases: Purchase[];
  sales: Sale[];
  debts: Debt[];
  notifications?: string[];
  onAddPurchase: () => void;
  onAddSale: () => void;
  onViewDebts: () => void;
}

export function Dashboard({ 
  businessData, 
  purchases, 
  sales, 
  debts,
  notifications = [],
  onAddPurchase, 
  onAddSale, 
  onViewDebts 
}: DashboardProps) {
  // Calculate totals
  const totalPurchases = purchases && Array.isArray(purchases) ? purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0) : 0;
  const totalSales = sales && Array.isArray(sales) ? sales.reduce((sum, sale) => sum + sale.totalAmount, 0) : 0;
  const totalDebts = debts && Array.isArray(debts) ? debts.reduce((sum, debt) => sum + debt.totalDebt, 0) : 0;
  const profit = totalSales - totalPurchases;

  // Generate daily statistics for the last 7 days
  const generateDailyStats = () => {
    const today = new Date();
    const stats = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySales = sales && Array.isArray(sales) ? sales
        .filter(sale => {
          const saleDate = sale.saleDate || sale.date;
          return saleDate.split('T')[0] === dateStr;
        })
        .reduce((sum, sale) => sum + sale.totalAmount, 0) : 0;
      
      const dayPurchases = purchases && Array.isArray(purchases) ? purchases
        .filter(purchase => {
          const purchaseDate = purchase.purchaseDate || purchase.date;
          return purchaseDate.split('T')[0] === dateStr;
        })
        .reduce((sum, purchase) => sum + purchase.totalPrice, 0) : 0;
      
      stats.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        profit: daySales - dayPurchases,
        sales: daySales,
        purchases: dayPurchases
      });
    }
    
    return stats;
  };

  const dailyStats = generateDailyStats();

  // Check for upcoming payment dates
  const getUpcomingPayments = () => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    return sales
      .filter(sale => 
        (sale.paymentStatus === 'partial' || sale.paymentStatus === 'debt') &&
        sale.expectedPaymentDate &&
        new Date(sale.expectedPaymentDate) <= threeDaysFromNow &&
        new Date(sale.expectedPaymentDate) >= new Date()
      )
      .map(sale => ({
        clientName: sale.clientName,
        amount: sale.remainingDebt || sale.totalAmount,
        date: sale.expectedPaymentDate,
        daysLeft: Math.ceil((new Date(sale.expectedPaymentDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      }));
  };

  const upcomingPayments = getUpcomingPayments();

  // Get overdue debts
  const getOverdueDebts = () => {
    const today = new Date();
    return sales
      .filter(sale => 
        (sale.paymentStatus === 'partial' || sale.paymentStatus === 'debt') &&
        sale.expectedPaymentDate &&
        new Date(sale.expectedPaymentDate) < today
      )
      .map(sale => ({
        clientName: sale.clientName,
        amount: sale.remainingDebt || sale.totalAmount,
        date: sale.expectedPaymentDate,
        daysOverdue: Math.floor((today.getTime() - new Date(sale.expectedPaymentDate!).getTime()) / (1000 * 60 * 60 * 24))
      }));
  };

  const overdueDebts = getOverdueDebts();
  const hasAlerts = notifications.length > 0 || upcomingPayments.length > 0 || overdueDebts.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-gray-800">{businessData.businessName}</h1>
        <p className="text-gray-600">Hello {businessData.userName}!</p>
      </div>

      {/* Alert Notifications */}
      {hasAlerts && (
        <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-orange-800 font-medium">Business Alerts</h4>
                {hasAlerts && (
                  <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">
                    {notifications.length + upcomingPayments.length + overdueDebts.length} alerts
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {/* Overdue debts */}
                {overdueDebts.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h5 className="text-red-800 font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Overdue Payments ({overdueDebts.length})
                    </h5>
                    {overdueDebts.slice(0, 3).map((debt, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        <strong>{debt.clientName}</strong>: {businessData.currencySymbol}{debt.amount.toFixed(2)} 
                        <span className="text-red-600"> ({debt.daysOverdue} days overdue)</span>
                      </div>
                    ))}
                    {overdueDebts.length > 3 && (
                      <p className="text-xs text-red-600 mt-1">
                        +{overdueDebts.length - 3} more overdue
                      </p>
                    )}
                  </div>
                )}

                {/* Upcoming payments */}
                {upcomingPayments.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h5 className="text-yellow-800 font-medium mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Due Soon ({upcomingPayments.length})
                    </h5>
                    {upcomingPayments.slice(0, 3).map((payment, index) => (
                      <div key={index} className="text-sm text-yellow-700 mb-1">
                        <strong>{payment.clientName}</strong>: {businessData.currencySymbol}{payment.amount.toFixed(2)} 
                        <span className="text-yellow-600"> (in {payment.daysLeft} day{payment.daysLeft !== 1 ? 's' : ''})</span>
                      </div>
                    ))}
                    {upcomingPayments.length > 3 && (
                      <p className="text-xs text-yellow-600 mt-1">
                        +{upcomingPayments.length - 3} more due soon
                      </p>
                    )}
                  </div>
                )}

                {/* Other notifications */}
                {notifications.length > 0 && (
                  <div className="space-y-2">
                    {notifications.slice(0, 2).map((notification, index) => (
                      <p key={index} className="text-sm text-orange-700 bg-orange-100 p-2 rounded">
                        {notification}
                      </p>
                    ))}
                    {notifications.length > 2 && (
                      <p className="text-xs text-orange-600">
                        +{notifications.length - 2} more notifications
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={onViewDebts}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Manage Debts
                </Button>
                {overdueDebts.length > 0 && (
                  <Button 
                    onClick={onViewDebts}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Urgent Action
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Purchases</p>
              <h3 className="text-white">{businessData.currencySymbol}{totalPurchases.toLocaleString()}</h3>
            </div>
            <TrendingDown className="w-6 h-6 text-blue-200" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Sales</p>
              <h3 className="text-white">{businessData.currencySymbol}{totalSales.toLocaleString()}</h3>
            </div>
            <TrendingUp className="w-6 h-6 text-green-200" />
          </div>
        </Card>

        <Card className={`p-4 relative ${totalDebts > 0 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={totalDebts > 0 ? 'text-red-100' : 'text-gray-100'}>Debts</p>
              <h3 className="text-white">{businessData.currencySymbol}{totalDebts.toLocaleString()}</h3>
            </div>
            <div className="relative">
              <Users className={`w-6 h-6 ${totalDebts > 0 ? 'text-red-200' : 'text-gray-200'}`} />
              {overdueDebts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </div>
          </div>
          {(debts && debts.length > 0) && (
            <Button 
              onClick={onViewDebts}
              variant="ghost" 
              className={`mt-2 text-white hover:bg-white/20 p-1 h-auto text-xs ${overdueDebts.length > 0 ? 'animate-pulse' : ''}`}
            >
              {overdueDebts.length > 0 ? 'Urgent Action Required' : 'View Details'}
            </Button>
          )}
        </Card>

        <Card className={`p-4 ${profit >= 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={profit >= 0 ? 'text-emerald-100' : 'text-orange-100'}>Profit</p>
              <h3 className="text-white">{businessData.currencySymbol}{profit.toLocaleString()}</h3>
            </div>
            <DollarSign className={`w-6 h-6 ${profit >= 0 ? 'text-emerald-200' : 'text-orange-200'}`} />
          </div>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <Card className="p-4">
        <h3 className="text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <Button 
            onClick={onAddPurchase}
            className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-2 h-20"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">Add Purchase</span>
          </Button>
          <Button 
            onClick={onAddSale}
            className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center gap-2 h-20"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">Add Sale</span>
          </Button>
          <Button 
            onClick={onViewDebts}
            variant="outline"
            className={`border-red-300 text-red-600 hover:bg-red-50 flex flex-col items-center gap-2 h-20 relative ${hasAlerts ? 'animate-pulse border-2' : ''}`}
          >
            <div className="relative">
              <Users className="w-5 h-5" />
              {hasAlerts && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {overdueDebts.length + upcomingPayments.length}
                </span>
              )}
            </div>
            <span className="text-sm">View Debts</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'clients' }))}
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center gap-2 h-12"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">Clients</span>
          </Button>
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'history' }))}
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50 flex items-center gap-2 h-12"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">History</span>
          </Button>
        </div>
      </Card>

      {/* Daily Statistics Chart */}
      <Card className="p-4">
        <div className="mb-4">
          <h3 className="text-gray-800">Daily Statistics (Last 7 Days)</h3>
          <p className="text-gray-600">Profit trend</p>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyStats}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <h3 className="text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {sales && Array.isArray(sales) && sales.slice(-3).reverse().map((sale, index) => (
            <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm text-gray-800">
                  Sale: {sale.items && Array.isArray(sale.items) 
                    ? sale.items.map(item => item.productName).join(', ')
                    : 'Legacy Sale'
                  }
                </p>
                <p className="text-xs text-gray-500">
                  {sale.clientName} • {new Date(sale.saleDate || sale.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">{businessData.currencySymbol}{sale.totalAmount.toFixed(2)}</p>
                <p className={`text-xs ${
                  sale.paymentStatus === 'paid' ? 'text-green-500' : 
                  sale.paymentStatus === 'partial' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {sale.paymentStatus}
                </p>
              </div>
            </div>
          ))}
          {purchases && Array.isArray(purchases) && purchases.slice(-3).reverse().map((purchase, index) => (
            <div key={purchase.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm text-gray-800">Purchase: {purchase.productName}</p>
                <p className="text-xs text-gray-500">
                  {purchase.supplierName} • {new Date(purchase.purchaseDate || purchase.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-600">-{businessData.currencySymbol}{purchase.totalPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Qty: {purchase.quantity}</p>
              </div>
            </div>
          ))}
          {(!sales || sales.length === 0) && (!purchases || purchases.length === 0) && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  );
}