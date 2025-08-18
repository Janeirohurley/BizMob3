import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, Package, Calendar } from 'lucide-react';
import { Purchase, Product } from '../types/business';
import { useLanguage } from './LanguageContext';
import { formatDateForInput } from '../utils/dateUtils';

interface AddPurchaseProps {
  onSave: (purchase: Omit<Purchase, 'id' | 'date'>) => void;
  onClose: () => void;
  existingProducts: Product[];
}

export function AddPurchase({ onSave, onClose, existingProducts }: AddPurchaseProps) {
  const { t } = useLanguage();
  
  const [supplierName, setSupplierName] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [initialSalePrice, setInitialSalePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(formatDateForInput(new Date()));
  const [error, setError] = useState('');

  // Auto-calculate sale price when unit price changes
  useEffect(() => {
    if (unitPrice && !initialSalePrice) {
      const calculatedPrice = parseFloat(unitPrice) * 1.2; // 20% markup
      setInitialSalePrice(calculatedPrice.toFixed(2));
    }
  }, [unitPrice, initialSalePrice]);

  // Auto-fill data when existing product is selected
  const handleProductSelect = (selectedProductName: string) => {
    setProductName(selectedProductName);
    const existingProduct = existingProducts.find(p => p.name === selectedProductName);
    if (existingProduct) {
      setUnitPrice(existingProduct.lastPurchasePrice.toFixed(2));
      setInitialSalePrice(existingProduct.initialSalePrice.toFixed(2));
    }
  };

  const handleSave = () => {
    setError('');
    
    if (!supplierName.trim()) {
      setError('Supplier name is required');
      return;
    }

    if (!productName.trim()) {
      setError('Product name is required');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (!unitPrice || parseFloat(unitPrice) <= 0) {
      setError('Unit price must be greater than 0');
      return;
    }

    if (!initialSalePrice || parseFloat(initialSalePrice) <= 0) {
      setError('Initial sale price must be greater than 0');
      return;
    }

    if (!purchaseDate) {
      setError('Purchase date is required');
      return;
    }

    const purchaseData: Omit<Purchase, 'id' | 'date'> = {
      purchaseDate,
      supplierName: supplierName.trim(),
      productName: productName.trim(),
      quantity: parseFloat(quantity),
      unitPrice: parseFloat(unitPrice),
      initialSalePrice: parseFloat(initialSalePrice),
      totalPrice: parseFloat(quantity) * parseFloat(unitPrice)
    };

    onSave(purchaseData);
    onClose();
  };

  const calculateTotalPrice = () => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    return (qty * price).toFixed(2);
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
        <h2 className="text-gray-800">{t.addPurchase}</h2>
        <div className="w-9" />
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-gray-800">{t.recordNewPurchase}</h3>
          <p className="text-gray-600">Add inventory with purchase and sale prices</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Purchase Date */}
        <Card className="p-4">
          <Label htmlFor="purchaseDate" className="mb-2 block flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Purchase Date *
          </Label>
          <Input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full"
          />
        </Card>

        {/* Supplier Information */}
        <Card className="p-4">
          <Label htmlFor="supplierName" className="mb-2 block">{t.supplierName} *</Label>
          <Input
            id="supplierName"
            type="text"
            placeholder="Enter supplier name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full"
          />
        </Card>

        {/* Product Information */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">{t.productName} *</Label>
              <div className="flex gap-2">
                <Input
                  id="productName"
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="flex-1"
                />
                {existingProducts.length > 0 && (
                  <Select value={productName} onValueChange={handleProductSelect}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Or select existing" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingProducts.map((product) => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">{t.quantity} *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">{t.unitPrice} *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter unit price"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialSalePrice">
                Initial Sale Price * 
                <span className="text-sm text-gray-500 ml-2">(Suggested selling price)</span>
              </Label>
              <Input
                id="initialSalePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter initial sale price"
                value={initialSalePrice}
                onChange={(e) => setInitialSalePrice(e.target.value)}
              />
              <p className="text-sm text-gray-600">
                This will be used as the default selling price when creating sales
              </p>
            </div>

            {/* Calculation Summary */}
            {quantity && unitPrice && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-blue-800 mb-2">Purchase Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Quantity:</span>
                    <span className="text-blue-800">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Unit Price:</span>
                    <span className="text-blue-800">${parseFloat(unitPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="text-blue-800 font-medium">Total Cost:</span>
                    <span className="text-blue-800 font-medium">${calculateTotalPrice()}</span>
                  </div>
                  {initialSalePrice && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-green-700">Sale Price Each:</span>
                        <span className="text-green-800">${parseFloat(initialSalePrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Potential Revenue:</span>
                        <span className="text-green-800">
                          ${(parseFloat(quantity) * parseFloat(initialSalePrice)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Potential Profit:</span>
                        <span className="text-green-800 font-medium">
                          ${((parseFloat(quantity) * parseFloat(initialSalePrice)) - 
                             (parseFloat(quantity) * parseFloat(unitPrice))).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
          >
            <Save className="w-4 h-4 mr-2" />
            {t.save} Purchase
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 h-12"
          >
            {t.cancel}
          </Button>
        </div>

        {/* Existing Products Quick Reference */}
        {existingProducts.length > 0 && (
          <Card className="p-4 bg-gray-50">
            <h4 className="text-gray-800 mb-3">📦 Existing Products</h4>
            <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
              {existingProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-gray-700 truncate">{product.name}</span>
                  <div className="text-right text-xs">
                    <div className="text-gray-600">Stock: {product.currentStock}</div>
                    <div className="text-blue-600">Last: ${product.lastPurchasePrice.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {existingProducts.length > 5 && (
                <p className="text-gray-500 text-center">
                  ...and {existingProducts.length - 5} more products
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}