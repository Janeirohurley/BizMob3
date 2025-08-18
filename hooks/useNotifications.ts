import { useState, useEffect } from 'react';
import { Sale, Debt } from '../types/business';
import { checkDebtNotifications } from '../utils/businessLogic';

export const useNotifications = (debts: Debt[], sales: Sale[]) => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const debtNotifications = checkDebtNotifications(debts, sales);
    setNotifications(debtNotifications);
  }, [debts, sales]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
  };

  return {
    notifications,
    clearNotifications,
    addNotification,
  };
};