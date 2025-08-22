export interface BusinessData {
  businessName: string;
  userName: string;
  password: string;
  isSetup: boolean;
  currency: string;
  currencySymbol: string;
}

export interface Product {
  id: string;
  name: string;
  currentStock: number;
  totalPurchased: number;
  totalSold: number;
  lastPurchasePrice: number;
  averagePurchasePrice: number;
  initialSalePrice: number;
}

export interface Purchase {
  id: string;
  date: string;
  purchaseDate?: string; // Manual purchase date
  supplierName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  initialSalePrice: number;
  totalPrice: number;
}

export interface SaleItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  date: string;
  saleDate?: string; // Manual sale date
  clientName: string;
  items: SaleItem[];
  totalAmount: number;
  paymentStatus: "paid" | "partial" | "debt";
  amountPaid?: number;
  remainingDebt?: number;
  expectedPaymentDate?: string; // For partial payments and debts
}

export interface Client {
  id: string;
  name: string;
  totalPurchases: number;
  totalDebt: number;
  transactionCount: number;
  lastTransactionDate: string;
  phone?: string;
  email?: string;
}

export interface DebtPayment {
  id: string;
  date: string;
  clientName: string;
  debtId: string;
  amountPaid: number;
  previousDebt: number;
  newDebt: number;
  paymentMethod?: string;
}

export interface AuditLog {
  id: string;
  date: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PAYMENT';
  entityType: 'PURCHASE' | 'SALE' | 'DEBT' | 'PRODUCT' | 'CLIENT';
  entityId: string;
  entityName: string;
  userId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  description: string;
  metadata?: {
    clientName?: string;
    productName?: string;
    amount?: number;
    paymentMethod?: string;
  };
}

export interface Debt {
  id: string;
  clientName: string;
  totalDebt: number;
  salesIds: string[];
}

export interface ImportedData {
  purchases?: Purchase[];
  sales?: Sale[];
  debts?: Debt[];
  products?: Product[];
  clients?: Client[];
}