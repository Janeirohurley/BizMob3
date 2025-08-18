import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { ArrowLeft, Save, ShoppingCart, CheckCircle, AlertCircle, XCircle, Plus, Minus, Trash2, Package, Calendar } from 'lucide-react';
import { Sale, SaleItem, Product, Client } from '../types/business';
import { useLanguage } from './LanguageContext';
import { formatDateForInput, addDays } from '../utils/dateUtils';

interface AddSaleProps {
  onSave: (sale: Omit<Sale, 'id' | 'date'>) => void;
  onClose: () => void;
  availableProducts: Product[];
  existingClients: Client[];
}

interface CartItem extends SaleItem {
  id: string;
  availableStock: number;
}

export function AddSale({ onSave, onClose, availableProducts, existingClients }: AddSaleProps) {
  const { t } = useLanguage();
  
  const [clientName, setClientName] = useState('');
  const [clientSuggestions, setClientSuggestions] = useState<Client[]>([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'debt'>('paid');
  const [amountPaid, setAmountPaid] = useState('');
  const [saleDate, setSaleDate] = useState(formatDateForInput(new Date()));
  const [expectedPaymentDate, setExpectedPaymentDate] = useState('');
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [error, setError] = useState('');

  // Set default expected payment date when payment status changes
  useEffect(() => {
    if (paymentStatus === 'partial' || paymentStatus === 'debt') {
      const defaultDate = addDays(new Date(), 30); // 30 days from now
      setExpectedPaymentDate(formatDateForInput(defaultDate));
    } else {
      setExpectedPaymentDate('');
    }
  }, [paymentStatus]);

  // Filter client suggestions based on input
  useEffect(() => {
    if (clientName.trim()) {
      const filtered = existingClients.filter(client => 
        client.name.toLowerCase().includes(clientName.toLowerCase())
      ).slice(0, 5);
      setClientSuggestions(filtered);
      setShowClientSuggestions(filtered.length > 0);
    } else {
      setClientSuggestions([]);
      setShowClientSuggestions(false);
    }
  }, [clientName, existingClients]);

  // Calculate totals
  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const remainingDebt = paymentStatus === 'partial' ? 
    Math.max(0, totalAmount - (parseFloat(amountPaid) || 0)) : 0;

  const handleAddProductToCart = () => {
    setError('');
    
    if (!selectedProduct || !selectedQuantity || !selectedPrice) {
      setError(t.pleaseCompleteAllFields);
      return;
    }

    const product = availableProducts.find(p => p.name === selectedProduct);
    const quantity = parseFloat(selectedQuantity);
    const price = parseFloat(selectedPrice);

    if (!product) {
      setError('Product not found');
      return;
    }

    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (quantity > product.currentStock) {
      setError(`${t.insufficientStock}. ${t.availableStock}: ${product.currentStock}`);
      return;
    }

    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.productName === selectedProduct);
    
    if (existingItemIndex >= 0) {
      const newQuantity = cart[existingItemIndex].quantity + quantity;
      if (newQuantity > product.currentStock) {
        setError(`${t.insufficientStock}. ${t.availableStock}: ${product.currentStock}, In cart: ${cart[existingItemIndex].quantity}`);
        return;
      }
      
      // Update existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: newQuantity,
        totalPrice: newQuantity * price
      };
      setCart(updatedCart);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Date.now().toString(),
        productName: selectedProduct,
        quantity,
        unitPrice: price,
        totalPrice: quantity * price,
        availableStock: product.currentStock
      };
      setCart([...cart, newItem]);
    }

    // Reset form
    setSelectedProduct('');
    setSelectedQuantity('');
    setSelectedPrice('');
    setShowAddProductDialog(false);
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === itemId) {
          if (newQuantity > item.availableStock) {
            return item; // Don't update if exceeds stock
          }
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const handleProductSelect = (productName: string) => {
    const product = availableProducts.find(p => p.name === productName);
    if (product) {
      setSelectedProduct(productName);
      // Use initialSalePrice if available, otherwise use lastPurchasePrice with markup
      const suggestedPrice = product.initialSalePrice || product.lastPurchasePrice * 1.2;
      setSelectedPrice(suggestedPrice.toFixed(2));
    }
  };

  const handleSave = () => {
    setError('');
    
    if (!clientName.trim()) {
      setError('Client name is required');
      return;
    }

    if (cart.length === 0) {
      setError('Please add at least one product to the cart');
      return;
    }

    if (paymentStatus === 'partial') {
      const paid = parseFloat(amountPaid) || 0;
      if (paid <= 0 || paid >= totalAmount) {
        setError('Amount paid must be greater than 0 and less than total amount for partial payments');
        return;
      }
    }

    if ((paymentStatus === 'partial' || paymentStatus === 'debt') && !expectedPaymentDate) {
      setError('Expected payment date is required for partial payments and debts');
      return;
    }

    try {
      const saleItems: SaleItem[] = cart.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }));

      const saleData: Omit<Sale, 'id' | 'date'> = {
        saleDate,
        clientName: clientName.trim(),
        items: saleItems,
        totalAmount,
        paymentStatus,
        expectedPaymentDate: expectedPaymentDate || undefined
      };

      if (paymentStatus === 'partial') {
        saleData.amountPaid = parseFloat(amountPaid);
        saleData.remainingDebt = remainingDebt;
      } else if (paymentStatus === 'debt') {
        saleData.remainingDebt = totalAmount;
      }

      onSave(saleData);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'debt':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
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
        <h2 className="text-gray-800">{t.addSale}</h2>
        <div className="w-9" />
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-gray-800">{t.recordNewSale}</h3>
          <p className="text-gray-600">Add multiple products to cart</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Sale Date */}
        <Card className="p-4">
          <Label htmlFor="saleDate" className="mb-2 block flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Sale Date *
          </Label>
          <Input
            id="saleDate"
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            className="w-full"
          />
        </Card>

        {/* Client Selection */}
        <Card className="p-4">
          <Label htmlFor="clientName" className="mb-2 block">{t.clientName} *</Label>
          <div className="relative">
            <Input
              id="clientName"
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              onFocus={() => setShowClientSuggestions(clientSuggestions.length > 0)}
              className="w-full"
            />
            
            {/* Client Suggestions */}
            {showClientSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {clientSuggestions.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setClientName(client.name);
                      setShowClientSuggestions(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800">{client.name}</span>
                      <span className="text-sm text-gray-500">
                        {client.transactionCount} transactions
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Shopping Cart */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-800">Shopping Cart ({cart.length} items)</h4>
            <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Product to Cart</DialogTitle>
                  <DialogDescription>
                    Select a product, enter the quantity and price to add it to your cart.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{t.productName} *</Label>
                    <Select value={selectedProduct} onValueChange={handleProductSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts
                          .filter(product => product.currentStock > 0)
                          .map((product) => (
                            <SelectItem key={product.id} value={product.name}>
                              <div className="flex justify-between items-center w-full">
                                <span>{product.name}</span>
                                <span className="text-sm text-gray-500 ml-4">
                                  Stock: {product.currentStock}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProduct && (
                    <>
                      <div className="space-y-2">
                        <Label>{t.quantity} *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max={availableProducts.find(p => p.name === selectedProduct)?.currentStock || 0}
                          placeholder="Enter quantity"
                          value={selectedQuantity}
                          onChange={(e) => setSelectedQuantity(e.target.value)}
                        />
                        <div className="text-sm text-gray-500">
                          Available: {availableProducts.find(p => p.name === selectedProduct)?.currentStock || 0}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t.unitPrice} *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter unit price"
                          value={selectedPrice}
                          onChange={(e) => setSelectedPrice(e.target.value)}
                        />
                      </div>

                      {selectedQuantity && selectedPrice && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-medium">
                              ${(parseFloat(selectedQuantity) * parseFloat(selectedPrice)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={handleAddProductToCart} className="bg-green-600 hover:bg-green-700 text-white">
                      Add to Cart
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddProductDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Cart Items */}
          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Cart is empty</p>
                <p className="text-sm">Add products to start creating a sale</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-gray-800">{item.productName}</h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.availableStock}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        ${item.unitPrice.toFixed(2)} × {item.quantity}
                      </div>
                      <div className="font-medium">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    Available stock: {item.availableStock}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Total */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-800">Total:</span>
                <span className="text-xl font-medium text-gray-800">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Payment Details */}
        {cart.length > 0 && (
          <Card className="p-4">
            <h4 className="text-gray-800 mb-4">{t.paymentStatus}</h4>
            
            <Select value={paymentStatus} onValueChange={(value: 'paid' | 'partial' | 'debt') => setPaymentStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {t.paidInFull}
                  </div>
                </SelectItem>
                <SelectItem value="partial">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    {t.partialPayment}
                  </div>
                </SelectItem>
                <SelectItem value="debt">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    {t.unpaidDebt}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {paymentStatus === 'partial' && (
              <div className="space-y-4 mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="amountPaid">{t.amountPaid} *</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    step="0.01"
                    min="0"
                    max={totalAmount}
                    placeholder="Enter amount paid"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-orange-700">Remaining Debt:</span>
                  <span className="text-orange-800 font-medium">
                    ${remainingDebt.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Expected Payment Date for partial payments and debts */}
            {(paymentStatus === 'partial' || paymentStatus === 'debt') && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="expectedPaymentDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Expected Payment Date *
                </Label>
                <Input
                  id="expectedPaymentDate"
                  type="date"
                  value={expectedPaymentDate}
                  onChange={(e) => setExpectedPaymentDate(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  You'll receive a notification 3 days before this date to follow up on payment.
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        {cart.length > 0 && (
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
            >
              <Save className="w-4 h-4 mr-2" />
              {t.save} Sale
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 h-12"
            >
              {t.cancel}
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        {availableProducts.length > 0 && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="text-blue-800 mb-2">📦 {t.availableStock}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {availableProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="flex justify-between">
                  <span className="text-blue-700 truncate">{product.name}</span>
                  <span className={`${product.currentStock < 5 ? 'text-red-600' : 'text-blue-800'}`}>
                    {product.currentStock}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}