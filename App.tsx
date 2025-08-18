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
import { LanguageProvider, useLanguage } from "./components/LanguageContext";
import { useBusinessData } from "./hooks/useBusinessData";
import { BusinessData, ImportedData as ImportedBusinessData } from "./types/business";
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from "./utils/storageUtils";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

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
  const [shownNotifications, setShownNotifications] = useState<Set<string>>(new Set());

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

  // Show notifications with toast system
  useEffect(() => {
    if (notifications.length > 0 && isAuthenticated) {
      notifications.forEach((notification, index) => {
        const notificationId = `notification-${index}-${notification}`;
        
        // Only show notification if it hasn't been shown yet
        if (!shownNotifications.has(notificationId)) {
          toast.warning("Debt Reminder", {
            description: notification,
            duration: 8000,
            action: {
              label: "View Debts",
              onClick: () => setCurrentScreen("debts"),
            },
          });
          
          // Mark notification as shown
          setShownNotifications(prev => new Set(prev).add(notificationId));
        }
      });
    }
  }, [notifications, isAuthenticated, shownNotifications]);

  // Reset shown notifications when notifications change significantly
  useEffect(() => {
    if (notifications.length === 0) {
      setShownNotifications(new Set());
    }
  }, [notifications.length]);

  const handleWelcomeComplete = (data: BusinessData) => {
    const newBusinessData = { ...data, isSetup: true };
    updateBusinessData(newBusinessData);
    
    if (pendingImportData) {
      importPendingData(pendingImportData);
      setPendingImportData(null);
    }
    
    setIsAuthenticated(true);
    toast.success("Welcome to BizMob!", {
      description: `Business "${data.businessName}" is ready to use.`,
    });
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
    toast.success("Data Import Complete", {
      description: "All your business data has been imported successfully.",
    });
    window.location.reload();
  };

  const handleLogin = (password: string) => {
    if (password === businessData.password) {
      setIsAuthenticated(true);
      toast.success("Welcome back!", {
        description: `Signed in to ${businessData.businessName}`,
      });
      return true;
    } else {
      toast.error("Authentication Failed", {
        description: "Incorrect password. Please try again.",
      });
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen("dashboard");
    toast.info("Signed Out", {
      description: "You have been signed out successfully.",
    });
  };

  const handleSuccessfulPurchase = () => {
    toast.success("Purchase Added", {
      description: "Purchase has been recorded successfully.",
    });
    setCurrentScreen("dashboard");
  };

  const handleSuccessfulSale = () => {
    toast.success("Sale Recorded", {
      description: "Sale has been processed successfully.",
    });
    setCurrentScreen("dashboard");
  };

  const handlePaymentRecorded = (clientName: string, amount: number) => {
    toast.success("Payment Recorded", {
      description: `Payment of ${formatCurrency(amount)} from ${clientName} has been recorded.`,
    });
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
      case "purchases":
      case "add-purchase":
        return (
          <AddPurchase
            onSave={(purchase) => {
              addPurchase(purchase);
              handleSuccessfulPurchase();
            }}
            onClose={() => setCurrentScreen("dashboard")}
            existingProducts={products}
          />
        );
      case "sales":
      case "add-sale":
        return (
          <AddSale
            onSave={(sale) => {
              try {
                addSale(sale);
                handleSuccessfulSale();
              } catch (error) {
                toast.error("Sale Failed", {
                  description: error instanceof Error ? error.message : "Failed to process sale",
                });
              }
            }}
            onClose={() => setCurrentScreen("dashboard")}
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
            onRecordPayment={(debtId, amount, paymentMethod) => {
              const debt = debts.find(d => d.id === debtId);
              if (debt) {
                recordDebtPayment(debtId, amount, paymentMethod);
                handlePaymentRecorded(debt.clientName, amount);
              }
            }}
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
              toast.success("Data Import Complete", {
                description: "All your business data has been imported successfully.",
              });
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
      <Toaster 
        position="top-center"
        richColors
        closeButton
        theme="light"
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