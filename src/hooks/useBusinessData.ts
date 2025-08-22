import { useState, useEffect } from 'react';
import { BusinessData, Purchase, Sale, Product, Client, Debt, DebtPayment } from '../types/business';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storageUtils';
import { 
  updateProductsFromPurchases, 
  updateProductsFromSales, 
  updateClientsFromSales,
  checkDebtNotifications,
  formatNumber
} from '../utils/businessLogic';

export const useBusinessData = () => {
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: "",
    userName: "",
    password: "",
    isSetup: false,
    currency: "USD",
    currencySymbol: "$",
  });
  
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Load data from localStorage on startup
  useEffect(() => {
    const savedBusinessData = loadFromStorage(STORAGE_KEYS.BUSINESS_DATA, {
      businessName: "",
      userName: "",
      password: "",
      isSetup: false,
      currency: "USD",
      currencySymbol: "$",
    });
    setBusinessData(savedBusinessData);

    setPurchases(loadFromStorage(STORAGE_KEYS.PURCHASES, []));
    setSales(loadFromStorage(STORAGE_KEYS.SALES, []));
    setDebts(loadFromStorage(STORAGE_KEYS.DEBTS, []));
    setProducts(loadFromStorage(STORAGE_KEYS.PRODUCTS, []));
    setClients(loadFromStorage(STORAGE_KEYS.CLIENTS, []));
    setDebtPayments(loadFromStorage(STORAGE_KEYS.DEBT_PAYMENTS, []));
  }, []);

  // Update products when purchases change
  useEffect(() => {
    if (purchases.length > 0 || products.length > 0) {
      const updatedProducts = updateProductsFromPurchases(products, purchases);
      const finalProducts = updateProductsFromSales(updatedProducts, sales);
      setProducts(finalProducts);
      saveToStorage(STORAGE_KEYS.PRODUCTS, finalProducts);
    }
  }, [purchases]);

  // Update products and clients when sales change
  useEffect(() => {
    if (sales.length > 0) {
      // Update products
      const updatedProducts = updateProductsFromSales(products, sales);
      setProducts(updatedProducts);
      saveToStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);

      // Update clients
      const updatedClients = updateClientsFromSales(clients, sales);
      setClients(updatedClients);
      saveToStorage(STORAGE_KEYS.CLIENTS, updatedClients);
    }
  }, [sales]);

  // Check for debt notifications
  useEffect(() => {
    const debtNotifications = checkDebtNotifications(debts, sales);
    setNotifications(debtNotifications);
  }, [debts, sales]);

  const updateBusinessData = (newData: Partial<BusinessData>) => {
    const updated = { ...businessData, ...newData };
    setBusinessData(updated);
    saveToStorage(STORAGE_KEYS.BUSINESS_DATA, updated);
  };

  const addPurchase = (purchase: Omit<Purchase, "id" | "date">) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updatedPurchases = [...purchases, newPurchase];
    setPurchases(updatedPurchases);
    saveToStorage(STORAGE_KEYS.PURCHASES, updatedPurchases);
  };

  const addSale = (sale: Omit<Sale, "id" | "date">) => {
    // Check stock availability
    for (const item of sale.items) {
      const product = products.find((p) => p.name === item.productName);
      if (!product || product.currentStock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${item.productName}. Available: ${product?.currentStock || 0}, Required: ${item.quantity}`,
        );
      }
    }

    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    saveToStorage(STORAGE_KEYS.SALES, updatedSales);

    // Update debts if needed
    if (sale.paymentStatus === "debt" || (sale.paymentStatus === "partial" && sale.remainingDebt && sale.remainingDebt > 0)) {
      updateDebts(newSale);
    }
  };

  const updateDebts = (sale: Sale) => {
    const debtAmount = sale.paymentStatus === "debt" ? sale.totalAmount : sale.remainingDebt || 0;
    const existingDebtIndex = debts.findIndex((debt) => debt.clientName === sale.clientName);

    let updatedDebts = [...debts];
    if (existingDebtIndex >= 0) {
      updatedDebts[existingDebtIndex] = {
        ...updatedDebts[existingDebtIndex],
        totalDebt: updatedDebts[existingDebtIndex].totalDebt + debtAmount,
        salesIds: [...updatedDebts[existingDebtIndex].salesIds, sale.id],
      };
    } else {
      updatedDebts.push({
        id: Date.now().toString(),
        clientName: sale.clientName,
        totalDebt: debtAmount,
        salesIds: [sale.id],
      });
    }

    setDebts(updatedDebts);
    saveToStorage(STORAGE_KEYS.DEBTS, updatedDebts);
  };

  const recordDebtPayment = (debtId: string, amountPaid: number, paymentMethod?: string) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    const previousDebt = debt.totalDebt;
    const newDebt = Math.max(0, previousDebt - amountPaid);

    const payment: DebtPayment = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      clientName: debt.clientName,
      debtId,
      amountPaid,
      previousDebt,
      newDebt,
      paymentMethod,
    };

    const updatedPayments = [...debtPayments, payment];
    setDebtPayments(updatedPayments);
    saveToStorage(STORAGE_KEYS.DEBT_PAYMENTS, updatedPayments);

    // Update debt
    const updatedDebts = debts.map((d) =>
      d.id === debtId ? { ...d, totalDebt: newDebt } : d,
    );
    setDebts(updatedDebts);
    saveToStorage(STORAGE_KEYS.DEBTS, updatedDebts);

    // Update client debt
    const updatedClients = clients.map(client => 
      client.name === debt.clientName 
        ? { ...client, totalDebt: Math.max(0, client.totalDebt - amountPaid) }
        : client
    );
    setClients(updatedClients);
    saveToStorage(STORAGE_KEYS.CLIENTS, updatedClients);
  };

  const formatCurrency = (amount: number) => {
    return `${amount} ${businessData.currencySymbol}`;
  };

  return {
    businessData,
    purchases,
    sales,
    debts,
    products,
    clients,
    debtPayments,
    notifications,
    updateBusinessData,
    addPurchase,
    addSale,
    recordDebtPayment,
    formatCurrency,
  };
};