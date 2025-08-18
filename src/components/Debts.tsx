import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Edit,
  CheckCircle,
} from "lucide-react";
import { Debt, Sale, BusinessData } from "../types/business";
import { useLanguage } from './LanguageContext';

interface DebtsProps {
  debts: Debt[];
  sales: Sale[];
  businessData: BusinessData;
  formatCurrency: (amount: number) => string;
  onRecordPayment: (debtId: string, amountPaid: number, paymentMethod?: string) => void;
  onClose: () => void;
}

export function Debts({
  debts,
  sales,
  businessData,
  formatCurrency,
  onRecordPayment,
  onClose,
}: DebtsProps) {
  const { t } = useLanguage();
  const [editingDebt, setEditingDebt] = useState<string | null>(
    null,
  );
  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePayment = (debt: Debt) => {
    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > debt.totalDebt) {
      alert(t.pleaseEnterValidPayment);
      return;
    }

    const newDebtAmount = debt.totalDebt - amount;
    onRecordPayment(debt.id, amount, "cash");
    setEditingDebt(null);
    setPaymentAmount("");
  };

  const markAsPaid = (debt: Debt) => {
    onRecordPayment(debt.id, debt.totalDebt, "cash");
  };

  const getClientSales = (clientName: string) => {
    return sales.filter(
      (sale) =>
        sale.clientName === clientName &&
        (sale.paymentStatus === "debt" ||
          sale.paymentStatus === "partial"),
    );
  };

  const totalDebtAmount = debts.reduce(
    (sum, debt) => sum + debt.totalDebt,
    0,
  );
  const activeDebts = debts.filter(
    (debt) => debt.totalDebt > 0,
  );

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
        <h2 className="text-gray-800">{t.clientDebts}</h2>
        <div className="w-9" />
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-gray-800">{t.outstandingDebts}</h3>
          <p className="text-gray-600">
            {t.manageClientPayments}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <h3 className="text-red-600">
              {formatCurrency(totalDebtAmount)}
            </h3>
            <p className="text-gray-600">{t.totalOutstanding}</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-blue-600">
              {activeDebts.length}
            </h3>
            <p className="text-gray-600">{t.clientsWithDebt}</p>
          </Card>
        </div>

        {/* Debts List */}
        <div className="space-y-4">
          {activeDebts.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-gray-800 mb-2">
                {t.noOutstandingDebts}
              </h3>
              <p className="text-gray-600">
                {t.allClientsHavePaid}
              </p>
            </Card>
          ) : (
            activeDebts.map((debt) => {
              const clientSales = getClientSales(
                debt.clientName,
              );
              return (
                <Card key={debt.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-gray-800">
                        {debt.clientName}
                      </h4>
                      <p className="text-red-600">
                        {formatCurrency(debt.totalDebt)} {t.outstanding}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            {t.update}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {t.updatePayment} - {debt.clientName}
                            </DialogTitle>
                            <DialogDescription>
                              {t.recordPaymentOrUpdate}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="paymentAmount">
                                {t.paymentAmount}
                              </Label>
                              <Input
                                id="paymentAmount"
                                type="number"
                                step="0.01"
                                min="0"
                                max={debt.totalDebt}
                                placeholder={t.enterPaymentAmount}
                                value={paymentAmount}
                                onChange={(e) =>
                                  setPaymentAmount(
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              {t.outstandingDebt}: {formatCurrency(debt.totalDebt)}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handlePayment(debt)
                                }
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={!paymentAmount}
                              >
                                {t.recordPayment}
                              </Button>
                              <Button
                                onClick={() => markAsPaid(debt)}
                                variant="outline"
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                {t.markAsPaid}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => markAsPaid(debt)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {t.paid}
                      </Button>
                    </div>
                  </div>

                  {/* Client Sales Details */}
                  <div className="space-y-2">
                    <h5 className="text-sm text-gray-700">
                      {t.relatedSales}:
                    </h5>
                    {clientSales.map((sale) => (
                      <div
                        key={sale.id}
                        className="bg-gray-50 p-3 rounded-lg text-sm"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-800">
                              {sale.items
                                .map((item) => item.productName)
                                .join(", ")}
                            </p>
                            <p className="text-gray-600">
                              {t.items}:{" "}
                              {sale.items
                                .map(
                                  (item) =>
                                    `${item.productName} (${item.quantity})`,
                                )
                                .join(", ")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-800">
                              {formatCurrency(sale.totalAmount)}
                            </p>
                            <p
                              className={`text-xs ${
                                sale.paymentStatus === "debt"
                                  ? "text-red-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {sale.paymentStatus === "debt"
                                ? t.unpaid
                                : `${t.partial}: ${formatCurrency(sale.remainingDebt || 0)} ${t.due}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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
            <li>• {t.clickUpdateToRecord}</li>
            <li>
              • {t.clickPaidToMark}
            </li>
            <li>• {t.keepTrackOfTransactions}</li>
            <li>
              • {t.regularFollowUps}
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}