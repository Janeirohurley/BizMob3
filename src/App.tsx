import React, { useState, useEffect } from "react";
import { WelcomeScreen, ImportedData } from "./components/WelcomeScreen";
import { Dashboard } from "./components/Dashboard";
import { AddPurchase } from "./components/AddPurchase";
import { AddSale } from "./components/AddSale";
import { Debts } from "./components/Debts";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { BottomNavigation } from "./components/BottomNavigation";
import { Clients } from "./components/Clients";
import { History } from "./components/History";
import { Products } from "./components/Products";
import { TransactionsView } from "./components/TransactionsView";
import { LanguageProvider, useLanguage } from "./components/LanguageContext";
import { useBusinessData } from "./hooks/useBusinessData";
import { BusinessData, ImportedData as ImportedBusinessData } from "./types/business";
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from "./utils/storageUtils";

function AppContent() {
  const { language } = useLanguage();
  const {
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
  } = useBusinessData();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [pendingImportData, setPendingImportData] = useState<ImportedBusinessData | null>(null);

  // Listen for navigation events from Dashboard
  useEffect(() => {
    const handleNavigateEvent = (event: CustomEvent) => {
      setCurrentScreen(event.detail);
    };

    window.addEventListener(
      "navigate",
      handleNavigateEvent as EventListener,
    );

    return () => {
      window.removeEventListener(
        "navigate",
        handleNavigateEvent as EventListener,
      );
    };
  }, []);

  // Show notifications
  useEffect(() => {
    if (notifications.length > 0 && isAuthenticated) {
      console.log('Debt notifications:', notifications);
    }
  }, [notifications, isAuthenticated]);

  const handleWelcomeComplete = (data: BusinessData) => {
    const newBusinessData = { ...data, isSetup: true };
    updateBusinessData(newBusinessData);
    
    if (pendingImportData) {
      importPendingData(pendingImportData);
      setPendingImportData(null);
    }
    
    setIsAuthenticated(true);
  };

  const handleImportData = (importedData: ImportedBusinessData) => {
    setPendingImportData(importedData);
  };

  const importPendingData = (data: ImportedBusinessData) => {
    if (data.purchases) {
      saveToStorage(STORAGE_KEYS.PURCHASES, data.purchases);
    }
    if (data.sales) {
      saveToStorage(STORAGE_KEYS.SALES, data.sales);
    }
    if (data.debts) {
      saveToStorage(STORAGE_KEYS.DEBTS, data.debts);
    }
    if (data.products) {
      saveToStorage(STORAGE_KEYS.PRODUCTS, data.products);
    }
    if (data.clients) {
      saveToStorage(STORAGE_KEYS.CLIENTS, data.clients);
    }
    window.location.reload();
  };

  const handleLogin = (password: string) => {
    if (password === businessData.password) {
      setIsAuthenticated(true);
    }
    return password === businessData.password;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen("dashboard");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return (
          <Dashboard
            businessData={businessData}
            purchases={purchases}
            sales={sales}
            debts={debts}
            notifications={notifications}
            onAddPurchase={() => setCurrentScreen("add-purchase")}
            onAddSale={() => setCurrentScreen("add-sale")}
            onViewDebts={() => setCurrentScreen("debts")}
          />
        );
      case "transactions":
        return (
          <TransactionsView
            onClose={() => setCurrentScreen("dashboard")}
            onAddPurchase={() => setCurrentScreen("add-purchase")}
            onAddSale={() => setCurrentScreen("add-sale")}
          />
        );
      case "add-purchase":
        return (
          <AddPurchase
            onSave={addPurchase}
            onClose={() => setCurrentScreen("transactions")}
            existingProducts={products}
          />
        );
      case "add-sale":
        return (
          <AddSale
            onSave={addSale}
            onClose={() => setCurrentScreen("transactions")}
            availableProducts={products}
            existingClients={clients}
          />
        );
      case "clients":
        return (
          <Clients
            clients={clients}
            sales={sales}
            onClose={() => setCurrentScreen("dashboard")}
          />
        );
      case "history":
        return (
          <History
            purchases={purchases}
            sales={sales}
            clients={clients}
            onClose={() => setCurrentScreen("dashboard")}
          />
        );
      case "debts":
        return (
          <Debts
            debts={debts}
            sales={sales}
            businessData={businessData}
            formatCurrency={formatCurrency}
            onRecordPayment={recordDebtPayment}
            onClose={() => setCurrentScreen("dashboard")}
          />
        );
      case "products":
        return (
          <Products
            products={products}
            businessData={businessData}
            formatCurrency={formatCurrency}
            onClose={() => setCurrentScreen("dashboard")}
          />
        );
      case "reports":
        return (
          <Reports
            purchases={purchases}
            sales={sales}
            debts={debts}
            products={products}
            clients={clients}
          />
        );
      case "settings":
        return (
          <Settings
            businessData={businessData}
            onUpdateBusinessData={updateBusinessData}
            onLogout={handleLogout}
            purchases={purchases}
            sales={sales}
            debts={debts}
            products={products}
            clients={clients}
            onImportData={(data) => {
              saveToStorage(STORAGE_KEYS.PURCHASES, data.purchases || []);
              saveToStorage(STORAGE_KEYS.SALES, data.sales || []);
              saveToStorage(STORAGE_KEYS.DEBTS, data.debts || []);
              saveToStorage(STORAGE_KEYS.PRODUCTS, data.products || []);
              saveToStorage(STORAGE_KEYS.CLIENTS, data.clients || []);
              window.location.reload();
            }}
          />
        );
      default:
        return (
          <Dashboard
            businessData={businessData}
            purchases={purchases}
            sales={sales}
            debts={debts}
            notifications={notifications}
            onAddPurchase={() => setCurrentScreen("add-purchase")}
            onAddSale={() => setCurrentScreen("add-sale")}
            onViewDebts={() => setCurrentScreen("debts")}
          />
        );
    }
  };

  if (!businessData.isSetup) {
    return (
      <WelcomeScreen 
        onComplete={handleWelcomeComplete} 
        onImportData={handleImportData}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <WelcomeScreen
        onComplete={handleWelcomeComplete}
        onImportData={handleImportData}
        isLogin
        onLogin={handleLogin}
        businessData={businessData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      <div className="pb-20">{renderScreen()}</div>
      <BottomNavigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}