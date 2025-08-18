export const STORAGE_KEYS = {
  BUSINESS_DATA: "bizmob_business_data",
  PURCHASES: "bizmob_purchases",
  SALES: "bizmob_sales",
  DEBTS: "bizmob_debts",
  PRODUCTS: "bizmob_products",
  CLIENTS: "bizmob_clients",
  DEBT_PAYMENTS: "bizmob_debt_payments",
  LANGUAGE: "bizmob_language",
} as const;

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

export const clearStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};