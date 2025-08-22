import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowLeft, Save, ShoppingCart, Calendar, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { Sale } from '../types/business';
import { useLanguage } from './LanguageContext';
import { formatDateForInput } from '../utils/dateUtils';
import { getEntityAuditLogs } from '../utils/auditUtils';

interface EditSaleProps {
  sale: Sale;
  onSave: (saleId: string, updatedData: Partial<Sale>) => void;
  onDelete: (saleId: string) => void;
  onClose: () => void;
  hasAssociatedPayments: boolean;
}

export function EditSale({ sale, onSave, onDelete, onClose, hasAssociatedPayments }: EditSaleProps) {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    clientName: sale.clientName,
    paymentStatus: sale.paymentStatus,
    amountPaid: sale.amountPaid?.toString() || '',
    saleDate: sale.saleDate || formatDateForInput(new Date(sale.date)),
    expectedPaymentDate: sale.expectedPaymentDate || '',
  });
  
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  const auditLogs = getEntityAuditLogs(sale.id);

  const handleSave = () => {
    setError('');
    
    if (!formData.clientName.trim()) {
      setError('Le nom du client est requis');
      return;
    }

    if (formData.paymentStatus === 'partial') {
      const paid = parseFloat(formData.amountPaid) || 0;
      if (paid <= 0 || paid >= sale.totalAmount) {
        setError('Le montant payé doit être supérieur à 0 et inférieur au montant total');
        return;
      }
    }

    const updatedData: Partial<Sale> = {
      clientName: formData.clientName.trim(),
      paymentStatus: formData.paymentStatus,
      saleDate: formData.saleDate,
      expectedPaymentDate: formData.expectedPaymentDate || undefined
    };

    if (formData.paymentStatus === 'partial') {
      updatedData.amountPaid = parseFloat(formData.amountPaid);
      updatedData.remainingDebt = sale.totalAmount - parseFloat(formData.amountPaid);
    } else if (formData.paymentStatus === 'debt') {
      updatedData.remainingDebt = sale.totalAmount;
      updatedData.amountPaid = undefined;
    } else {
      updatedData.amountPaid = undefined;
      updatedData.remainingDebt = undefined;
    }

    onSave(sale.id, updatedData);
    onClose();
  };

  const handleDelete = () => {
    if (hasAssociatedPayments) {
      setError(t.saleHasPayments);
      return;
    }
    
    try {
      onDelete(sale.id);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    }
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
            <h3 className="text-gray-800">Vente à {sale.clientName}</h3>
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
                        log.action === 'PAYMENT' ? 'bg-purple-100' :
                        'bg-red-100'
                      }`}>
                        {log.action === 'CREATE' ? '✓' : 
                         log.action === 'UPDATE' ? '✏️' : 
                         log.action === 'PAYMENT' ? '💳' : '🗑️'}
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
        <h2 className="text-gray-800">{t.editSale}</h2>
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-gray-800">{t.editSale}</h3>
          <p className="text-gray-600">Modifier les détails de la vente</p>
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
            Date de vente *
          </Label>
          <Input
            id="saleDate"
            type="date"
            value={formData.saleDate}
            onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
            className="w-full"
          />
        </Card>

        {/* Client Information */}
        <Card className="p-4">
          <Label htmlFor="clientName" className="mb-2 block">{t.clientName} *</Label>
          <Input
            id="clientName"
            type="text"
            placeholder="Nom du client"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            className="w-full"
          />
        </Card>

        {/* Sale Items (Read-only) */}
        <Card className="p-4">
          <h4 className="text-gray-800 mb-4">Articles vendus</h4>
          <div className="space-y-3">
            {sale.items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-gray-800">{item.productName}</h5>
                    <p className="text-gray-600 text-sm">
                      {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-gray-800 font-medium">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-800">Total:</span>
                <span className="text-xl font-medium text-gray-800">
                  ${sale.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Status */}
        <Card className="p-4">
          <h4 className="text-gray-800 mb-4">{t.paymentStatus}</h4>
          
          <Select 
            value={formData.paymentStatus} 
            onValueChange={(value: 'paid' | 'partial' | 'debt') => 
              setFormData({ ...formData, paymentStatus: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">{t.paidInFull}</SelectItem>
              <SelectItem value="partial">{t.partialPayment}</SelectItem>
              <SelectItem value="debt">{t.unpaidDebt}</SelectItem>
            </SelectContent>
          </Select>

          {formData.paymentStatus === 'partial' && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="amountPaid">{t.amountPaid} *</Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                min="0"
                max={sale.totalAmount}
                placeholder="Montant payé"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
              />
            </div>
          )}

          {(formData.paymentStatus === 'partial' || formData.paymentStatus === 'debt') && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="expectedPaymentDate">Date de paiement prévue</Label>
              <Input
                id="expectedPaymentDate"
                type="date"
                value={formData.expectedPaymentDate}
                onChange={(e) => setFormData({ ...formData, expectedPaymentDate: e.target.value })}
                className="w-full"
              />
            </div>
          )}
        </Card>

        {/* Warning for associated payments */}
        {hasAssociatedPayments && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="text-yellow-800">Attention</h4>
                <p className="text-yellow-700 text-sm">
                  Cette vente a des paiements associés. La suppression n'est pas autorisée.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
          >
            <Save className="w-4 h-4 mr-2" />
            {t.save}
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="px-6 h-12"
            disabled={hasAssociatedPayments}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {hasAssociatedPayments ? t.cannotDeleteSale : t.confirmDelete}
              </DialogTitle>
              <DialogDescription>
                {hasAssociatedPayments 
                  ? t.saleHasPayments
                  : t.deleteConfirmation
                }
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-4">
              {!hasAssociatedPayments && (
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex-1"
                >
                  {t.delete}
                </Button>
              )}
              <Button
                onClick={() => setShowDeleteDialog(false)}
                variant="outline"
                className="flex-1"
              >
                {hasAssociatedPayments ? t.close : t.cancel}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}