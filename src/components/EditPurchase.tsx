import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowLeft, Save, Package, Calendar, Trash2, FileText } from 'lucide-react';
import { Purchase } from '../types/business';
import { useLanguage } from './LanguageContext';
import { formatDateForInput } from '../utils/dateUtils';
import { getEntityAuditLogs } from '../utils/auditUtils';

interface EditPurchaseProps {
  purchase: Purchase;
  onSave: (purchaseId: string, updatedData: Partial<Purchase>) => void;
  onDelete: (purchaseId: string) => void;
  onClose: () => void;
}

export function EditPurchase({ purchase, onSave, onDelete, onClose }: EditPurchaseProps) {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    supplierName: purchase.supplierName,
    productName: purchase.productName,
    quantity: purchase.quantity.toString(),
    unitPrice: purchase.unitPrice.toString(),
    initialSalePrice: purchase.initialSalePrice.toString(),
    purchaseDate: purchase.purchaseDate || formatDateForInput(new Date(purchase.date)),
  });
  
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  const auditLogs = getEntityAuditLogs(purchase.id);

  const handleSave = () => {
    setError('');
    
    if (!formData.supplierName.trim()) {
      setError('Le nom du fournisseur est requis');
      return;
    }

    if (!formData.productName.trim()) {
      setError('Le nom du produit est requis');
      return;
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setError('La quantité doit être supérieure à 0');
      return;
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      setError('Le prix unitaire doit être supérieur à 0');
      return;
    }

    if (!formData.initialSalePrice || parseFloat(formData.initialSalePrice) <= 0) {
      setError('Le prix de vente initial doit être supérieur à 0');
      return;
    }

    const updatedData: Partial<Purchase> = {
      supplierName: formData.supplierName.trim(),
      productName: formData.productName.trim(),
      quantity: parseFloat(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      initialSalePrice: parseFloat(formData.initialSalePrice),
      purchaseDate: formData.purchaseDate,
      totalPrice: parseFloat(formData.quantity) * parseFloat(formData.unitPrice)
    };

    onSave(purchase.id, updatedData);
    onClose();
  };

  const handleDelete = () => {
    try {
      onDelete(purchase.id);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    }
  };

  const calculateTotalPrice = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.unitPrice) || 0;
    return (qty * price).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (showAuditTrail) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setShowAuditTrail(false)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-gray-800">{t.auditTrail}</h2>
          <div className="w-9" />
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-gray-800">{purchase.productName}</h3>
            <p className="text-gray-600">Historique des modifications</p>
          </div>

          <div className="space-y-4">
            {auditLogs.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-gray-800 mb-2">{t.noChangesRecorded}</h4>
                <p className="text-gray-600">Aucune modification enregistrée</p>
              </Card>
            ) : (
              auditLogs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        log.action === 'CREATE' ? 'bg-green-100' :
                        log.action === 'UPDATE' ? 'bg-blue-100' :
                        'bg-red-100'
                      }`}>
                        {log.action === 'CREATE' ? '✓' : log.action === 'UPDATE' ? '✏️' : '🗑️'}
                      </div>
                      <div>
                        <h4 className="text-gray-800">{t[log.action.toLowerCase()]}</h4>
                        <p className="text-gray-600 text-sm">{log.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-600">{log.userId}</p>
                      <p className="text-gray-500">{formatDate(log.date)}</p>
                    </div>
                  </div>

                  {log.changes.length > 0 && (
                    <div className="space-y-2">
                      {log.changes.map((change, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">{change.field}:</span>
                          </div>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <div className="text-red-600">
                              Avant: {JSON.stringify(change.oldValue)}
                            </div>
                            <div className="text-green-600">
                              Après: {JSON.stringify(change.newValue)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
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
        <h2 className="text-gray-800">{t.editPurchase}</h2>
        <Button
          variant="ghost"
          onClick={() => setShowAuditTrail(true)}
          className="p-2"
        >
          <FileText className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-gray-800">{t.editPurchase}</h3>
          <p className="text-gray-600">Modifier les détails de l'achat</p>
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
            Date d'achat *
          </Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            className="w-full"
          />
        </Card>

        {/* Supplier Information */}
        <Card className="p-4">
          <Label htmlFor="supplierName" className="mb-2 block">{t.supplierName} *</Label>
          <Input
            id="supplierName"
            type="text"
            placeholder="Nom du fournisseur"
            value={formData.supplierName}
            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
            className="w-full"
          />
        </Card>

        {/* Product Information */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">{t.productName} *</Label>
              <Input
                id="productName"
                type="text"
                placeholder="Nom du produit"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">{t.quantity} *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Quantité"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">{t.unitPrice} *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Prix unitaire"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialSalePrice">Prix de vente initial *</Label>
              <Input
                id="initialSalePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Prix de vente initial"
                value={formData.initialSalePrice}
                onChange={(e) => setFormData({ ...formData, initialSalePrice: e.target.value })}
              />
            </div>

            {/* Calculation Summary */}
            {formData.quantity && formData.unitPrice && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-blue-800 mb-2">Résumé de l'achat</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Quantité:</span>
                    <span className="text-blue-800">{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Prix unitaire:</span>
                    <span className="text-blue-800">${parseFloat(formData.unitPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="text-blue-800 font-medium">Coût total:</span>
                    <span className="text-blue-800 font-medium">${calculateTotalPrice()}</span>
                  </div>
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
            {t.save}
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="px-6 h-12"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.confirmDelete}</DialogTitle>
              <DialogDescription>
                {t.deleteConfirmation}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="flex-1"
              >
                {t.delete}
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(false)}
                variant="outline"
                className="flex-1"
              >
                {t.cancel}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}