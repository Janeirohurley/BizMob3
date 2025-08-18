import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Users, Star, Calendar, DollarSign, Search } from 'lucide-react';
import { Client, Sale } from '../types/business';
import { useLanguage } from './LanguageContext';

interface ClientsProps {
  clients: Client[];
  sales: Sale[];
  onClose: () => void;
}

export function Clients({ clients, sales, onClose }: ClientsProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get client sales history
  const getClientSales = (clientName: string) => {
    return sales
      .filter(sale => sale.clientName === clientName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Get client statistics
  const getClientStats = (client: Client) => {
    const clientSales = getClientSales(client.name);
    const totalItems = clientSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageOrderValue = client.transactionCount > 0 ? 
      client.totalPurchases / client.transactionCount : 0;
    
    return {
      totalItems,
      averageOrderValue,
      lastPurchase: clientSales[0]?.date ? new Date(clientSales[0].date) : null
    };
  };

  // Sort clients by different criteria
  const sortClientsByFrequency = () => [...filteredClients].sort((a, b) => b.transactionCount - a.transactionCount);
  const sortClientsByValue = () => [...filteredClients].sort((a, b) => b.totalPurchases - a.totalPurchases);
  const sortClientsByRecent = () => [...filteredClients].sort((a, b) => 
    new Date(b.lastTransactionDate).getTime() - new Date(a.lastTransactionDate).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (selectedClient) {
    const clientSales = getClientSales(selectedClient.name);
    const stats = getClientStats(selectedClient);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedClient(null)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-gray-800">{selectedClient.name}</h2>
          <div className="w-9" />
        </div>

        <div className="p-6 space-y-6">
          {/* Client Summary */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">{selectedClient.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h3 className="text-gray-800">{selectedClient.name}</h3>
                <p className="text-gray-600">
                  {selectedClient.transactionCount} {t.transactionCount.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h4 className="text-green-600">${selectedClient.totalPurchases.toLocaleString()}</h4>
                <p className="text-green-700 text-sm">{t.totalPurchased}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h4 className="text-blue-600">${stats.averageOrderValue.toFixed(2)}</h4>
                <p className="text-blue-700 text-sm">Average Order</p>
              </div>
            </div>

            {selectedClient.totalDebt > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-red-700">Outstanding Debt:</span>
                  <span className="text-red-800 font-medium">${selectedClient.totalDebt.toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Purchase History */}
          <Card className="p-6">
            <h4 className="text-gray-800 mb-4">Purchase History ({clientSales.length} orders)</h4>
            <div className="space-y-4">
              {clientSales.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No purchase history</p>
              ) : (
                clientSales.map((sale) => (
                  <div key={sale.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-gray-600">{formatDate(sale.date)}</p>
                        <p className="text-lg text-gray-800">${sale.totalAmount.toFixed(2)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        sale.paymentStatus === 'partial' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.paymentStatus === 'debt' ? 'Unpaid' : 
                         sale.paymentStatus.charAt(0).toUpperCase() + sale.paymentStatus.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {sale.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="text-gray-800">${item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {sale.paymentStatus === 'partial' && sale.remainingDebt && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-orange-700">Remaining debt:</span>
                          <span className="text-orange-800 font-medium">${sale.remainingDebt.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
        <h2 className="text-gray-800">{t.clients}</h2>
        <div className="w-9" />
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-gray-800">{t.topClients}</h3>
          <p className="text-gray-600">Manage your client relationships</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <h3 className="text-blue-600">{clients.length}</h3>
            <p className="text-gray-600 text-sm">Total Clients</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-green-600">
              {clients.filter(c => c.transactionCount >= 5).length}
            </h3>
            <p className="text-gray-600 text-sm">Loyal Clients</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-red-600">
              {clients.filter(c => c.totalDebt > 0).length}
            </h3>
            <p className="text-gray-600 text-sm">With Debt</p>
          </Card>
        </div>

        {/* Client Lists */}
        <Tabs defaultValue="frequency" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="frequency">By Frequency</TabsTrigger>
            <TabsTrigger value="value">By Value</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frequency" className="space-y-4">
            <div className="space-y-3">
              {sortClientsByFrequency().map((client, index) => (
                <Card 
                  key={client.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">{client.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="text-gray-800 flex items-center gap-2">
                          {client.name}
                          {index < 3 && <Star className="w-4 h-4 text-yellow-500" />}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {client.transactionCount} transactions • ${client.totalPurchases.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {formatDate(client.lastTransactionDate)}
                      </div>
                      {client.totalDebt > 0 && (
                        <div className="text-sm text-red-600">
                          Debt: ${client.totalDebt.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="value" className="space-y-4">
            <div className="space-y-3">
              {sortClientsByValue().map((client, index) => (
                <Card 
                  key={client.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">{client.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="text-gray-800 flex items-center gap-2">
                          {client.name}
                          {index < 3 && <DollarSign className="w-4 h-4 text-green-500" />}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          ${client.totalPurchases.toLocaleString()} • {client.transactionCount} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-green-600 font-medium">
                        ${(client.totalPurchases / client.transactionCount).toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">avg order</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="space-y-3">
              {sortClientsByRecent().map((client) => (
                <Card 
                  key={client.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">{client.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="text-gray-800">{client.name}</h4>
                        <p className="text-gray-600 text-sm">
                          Last order: {formatDate(client.lastTransactionDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800">
                        ${client.totalPurchases.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.transactionCount} orders
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredClients.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-gray-800 mb-2">No clients found</h4>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Start making sales to see your clients here'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}