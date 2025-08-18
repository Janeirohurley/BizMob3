import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Package,
  TrendingUp,
  TrendingDown,
  Search,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { Product, BusinessData } from "../types/business";
import { useLanguage } from './LanguageContext';

interface ProductsProps {
  products: Product[];
  businessData: BusinessData;
  formatCurrency: (amount: number) => string;
  onClose: () => void;
}

export function Products({
  products,
  businessData,
  formatCurrency,
  onClose,
}: ProductsProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "stock" | "value">("name");

  // Filter and sort products
  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "stock":
          return b.currentStock - a.currentStock;
        case "value":
          return (b.currentStock * b.averagePurchasePrice) - (a.currentStock * a.averagePurchasePrice);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Calculate inventory metrics
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, product) => 
    sum + (product.currentStock * product.averagePurchasePrice), 0);
  const lowStockProducts = products.filter(product => product.currentStock <= 10);
  const outOfStockProducts = products.filter(product => product.currentStock === 0);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: t.outOfStock, color: "bg-red-100 text-red-800" };
    if (stock <= 10) return { text: t.lowStock, color: "bg-yellow-100 text-yellow-800" };
    return { text: t.inStock, color: "bg-green-100 text-green-800" };
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
        <h2 className="text-gray-800">{t.inventory}</h2>
        <div className="w-9" />
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-gray-800">{t.productInventory}</h3>
          <p className="text-gray-600">
            {t.manageProductStock}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <h3 className="text-blue-600">
              {totalProducts}
            </h3>
            <p className="text-gray-600">{t.totalProducts}</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-green-600">
              {formatCurrency(totalStockValue)}
            </h3>
            <p className="text-gray-600">{t.totalStockValue}</p>
          </Card>
        </div>

        {/* Alert Cards */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <div className="grid grid-cols-2 gap-4">
            {outOfStockProducts.length > 0 && (
              <Card className="p-4 text-center border-red-200 bg-red-50">
                <h3 className="text-red-600">
                  {outOfStockProducts.length}
                </h3>
                <p className="text-red-700">{t.outOfStock}</p>
              </Card>
            )}
            {lowStockProducts.length > 0 && (
              <Card className="p-4 text-center border-yellow-200 bg-yellow-50">
                <h3 className="text-yellow-600">
                  {lowStockProducts.length}
                </h3>
                <p className="text-yellow-700">{t.lowStock}</p>
              </Card>
            )}
          </div>
        )}

        {/* Search and Sort */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t.searchProducts}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("name")}
            >
              {t.sortByName}
            </Button>
            <Button
              variant={sortBy === "stock" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("stock")}
            >
              {t.sortByStock}
            </Button>
            <Button
              variant={sortBy === "value" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("value")}
            >
              {t.sortByValue}
            </Button>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-800 mb-2">
                {searchTerm ? t.noProductsFound : t.noProducts}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? t.tryDifferentSearch : t.startByAddingProducts}
              </p>
            </Card>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.currentStock);
              const stockValue = product.currentStock * product.averagePurchasePrice;
              const potentialProfit = product.currentStock * (product.initialSalePrice - product.averagePurchasePrice);
              
              return (
                <Card key={product.id} className="p-4">
                  <div className="space-y-4">
                    {/* Product Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-gray-800">{product.name}</h4>
                        <Badge className={`text-xs ${stockStatus.color}`}>
                          {stockStatus.text}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">
                          {product.currentStock} {t.units}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t.currentStock}
                        </p>
                      </div>
                    </div>

                    {/* Stock Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-gray-600">{t.totalPurchased}</p>
                          <p className="text-gray-800">{product.totalPurchased} {t.units}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <div>
                          <p className="text-gray-600">{t.totalSold}</p>
                          <p className="text-gray-800">{product.totalSold} {t.units}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Info */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">{t.avgPurchasePrice}</p>
                          <p className="text-gray-800">
                            {formatCurrency(product.averagePurchasePrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t.salePrice}</p>
                          <p className="text-gray-800">
                            {formatCurrency(product.initialSalePrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t.stockValue}</p>
                          <p className="text-blue-600 font-semibold">
                            {formatCurrency(stockValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t.potentialProfit}</p>
                          <p className={`font-semibold ${potentialProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(potentialProfit)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Last Purchase Info */}
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <BarChart3 className="w-3 h-3" />
                      {t.lastPurchasePrice}: {formatCurrency(product.lastPurchasePrice)}
                    </div>

                    {/* Low stock warning */}
                    {product.currentStock <= 10 && product.currentStock > 0 && (
                      <div className="flex items-center gap-2 text-yellow-600 text-sm bg-yellow-50 p-2 rounded">
                        <AlertTriangle className="w-4 h-4" />
                        {t.lowStockWarning}
                      </div>
                    )}

                    {/* Out of stock warning */}
                    {product.currentStock === 0 && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                        <AlertTriangle className="w-4 h-4" />
                        {t.outOfStockWarning}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Tips */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="text-blue-800 mb-2">💡 {t.tips}</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• {t.keepTrackOfStock}</li>
            <li>• {t.reviewPricingRegularly}</li>
            <li>• {t.monitorSlowMoving}</li>
            <li>• {t.reorderBeforeEmpty}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}