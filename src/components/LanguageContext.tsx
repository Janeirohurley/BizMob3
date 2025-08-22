import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr' | 'es' | 'ar';

export interface Translation {
  // Common
  save: string;
  cancel: string;
  close: string;
  delete: string;
  edit: string;
  add: string;
  loading: string;
  error: string;
  success: string;
  update: string;
  paid: string;
  unpaid: string;
  partial: string;
  due: string;
  outstanding: string;
  tips: string;
  items: string;
  units: string;
  buy: string;
  sell: string;
  products: string;
  
  // App name and tagline
  appName: string;
  tagline: string;
  
  // Welcome/Setup
  welcome: string;
  businessSetup: string;
  businessName: string;
  userName: string;
  password: string;
  confirmPassword: string;
  createPassword: string;
  enterPassword: string;
  login: string;
  logout: string;
  
  // Navigation
  home: string;
  dashboard: string;
  purchases: string;
  sales: string;
  reports: string;
  settings: string;
  clients: string;
  history: string;
  debts: string;
  
  // Dashboard
  quickActions: string;
  addPurchase: string;
  addSale: string;
  viewDebts: string;
  totalSales: string;
  totalPurchases: string;
  profit: string;
  outstandingDebts: string;
  recentActivity: string;
  dailyStatistics: string;
  
  // Sales
  recordNewSale: string;
  clientName: string;
  productSold: string;
  quantity: string;
  unitPrice: string;
  totalAmount: string;
  paymentStatus: string;
  paidInFull: string;
  partialPayment: string;
  unpaidDebt: string;
  amountPaid: string;
  remainingDebt: string;
  
  // Purchases
  recordNewPurchase: string;
  supplierName: string;
  productName: string;
  totalPrice: string;
  
  // Products and Stock
  availableStock: string;
  outOfStock: string;
  lowStock: string;
  insufficientStock: string;
  inStock: string;
  currentStock: string;
  inventory: string;
  productInventory: string;
  manageProductStock: string;
  totalProducts: string;
  totalStockValue: string;
  searchProducts: string;
  sortByName: string;
  sortByStock: string;
  sortByValue: string;
  noProducts: string;
  noProductsFound: string;
  tryDifferentSearch: string;
  startByAddingProducts: string;
  totalPurchased: string;
  totalSold: string;
  avgPurchasePrice: string;
  salePrice: string;
  stockValue: string;
  potentialProfit: string;
  lastPurchasePrice: string;
  lowStockWarning: string;
  outOfStockWarning: string;
  keepTrackOfStock: string;
  reviewPricingRegularly: string;
  monitorSlowMoving: string;
  reorderBeforeEmpty: string;
  
  // Clients
  topClients: string;
  lastTransaction: string;
  transactionCount: string;
  
  // Reports
  businessReports: string;
  netProfit: string;
  profitMargin: string;
  totalTransactions: string;
  trackBusinessPerformance: string;
  salesVsPurchases: string;
  topClientsBySales: string;
  topSuppliersByPurchases: string;
  debtOverview: string;
  quickInsights: string;
  daily: string;
  monthly: string;
  yearly: string;
  exportReport: string;
  salesTooltip: string;
  purchasesTooltip: string;
  profitTooltip: string;
  clientTooltip: string;
  supplierTooltip: string;
  
  // Settings
  businessInformation: string;
  security: string;
  changePassword: string;
  dataManagement: string;
  exportData: string;
  importData: string;
  language: string;
  
  // Debts
  clientDebts: string;
  manageClientPayments: string;
  totalOutstanding: string;
  clientsWithDebt: string;
  noOutstandingDebts: string;
  allClientsHavePaid: string;
  updatePayment: string;
  recordPaymentOrUpdate: string;
  paymentAmount: string;
  enterPaymentAmount: string;
  outstandingDebt: string;
  recordPayment: string;
  markAsPaid: string;
  relatedSales: string;
  pleaseEnterValidPayment: string;
  clickUpdateToRecord: string;
  clickPaidToMark: string;
  keepTrackOfTransactions: string;
  regularFollowUps: string;
  
  // Messages
  dataImportedSuccessfully: string;
  passwordChangedSuccessfully: string;
  pleaseCompleteAllFields: string;
  incorrectPassword: string;
  passwordsDoNotMatch: string;
  businessNameRequired: string;
  passwordLength: string;
  passwordChanged: string;
  
  // Validation
  required: string;
  invalidEmail: string;
  passwordTooShort: string;

  // New keys for Settings
  appPreferences: string;
  saveChanges: string;
  currentPasswordLabel: string;
  enterCurrentPassword: string;
  newPasswordLabel: string;
  enterNewPassword: string;
  confirmNewPasswordLabel: string;
  enterConfirmNewPassword: string;
  updatePassword: string;
  dataStatistics: string;
  dataSize: string;
  exportBackup: string;
  importRestore: string;
  importConfirm: string;
  invalidBackup: string;
  errorReadingBackup: string;
  backupTip1: string;
  backupTip2: string;
  backupTip3: string;
  aboutApp: string;
  appVersionInfo: string;
  localData: string;
  noInternet: string;
  copyright: string;
  selectLanguage: string;
  languageChangeInfo: string;
  namesRequired: string;

// History (nouvelles clés)
  transactionHistory: string;
  completeBusinessTransactionLog: string;
  loss: string;
  filters: string;
  searchTransactions: string;
  transactionType: string;
  allTypes: string;
  salesOnly: string;
  purchasesOnly: string;
  dateRange: string;
  allTime: string;
  today: string;
  last7Days: string;
  last30Days: string;
  lastYear: string;
  filterByParty: string;
  allParties: string;
  clearAllFilters: string;
  noTransactionsFound: string;
  adjustFilters: string;
  startTransactions: string;
  saleTo: string;
  purchaseFrom: string;
  net: string;
  exportHistory: string;

  // CRUD et Audit Trail
  created: string;
  updated: string;
  deleted: string;
  recordedPayment: string;
  auditTrail: string;
  viewAuditTrail: string;
  modifications: string;
  originalValue: string;
  newValue: string;
  modifiedBy: string;
  modifiedOn: string;
  noModifications: string;
  editPurchase: string;
  editSale: string;
  deletePurchase: string;
  deleteSale: string;
  confirmDelete: string;
  deleteConfirmation: string;
  cannotDeleteSale: string;
  saleHasPayments: string;
  field: string;
  oldValue: string;
  newValue: string;
  action: string;
  entityType: string;
  changeHistory: string;
  viewChanges: string;
  noChangesRecorded: string;
  allChanges: string;
  filterByEntity: string;
  filterByAction: string;
  allActions: string;
  allEntities: string;
  paymentHistory: string;
  viewPaymentHistory: string;
  paymentDetails: string;
  previousAmount: string;
  newAmount: string;
  paymentMethod: string;
  cash: string;
  transfer: string;
  check: string;
  other: string;
}

const translations: Record<Language, Translation> = {
  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    update: 'Update',
    paid: 'Paid',
    unpaid: 'Unpaid',
    partial: 'Partial',
    due: 'Due',
    outstanding: 'Outstanding',
    tips: 'Tips',
    items: 'Items',
    units: 'Units',
    buy: 'Buy',
    sell: 'Sell',
    products: 'Products',
    
    // App name and tagline
    appName: 'BizMob',
    tagline: 'Your digital business notebook',
    
    // Welcome/Setup
    welcome: 'Welcome',
    businessSetup: 'Set Up Your Business',
    businessName: 'Business Name',
    userName: 'Your Name',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createPassword: 'Create Password',
    enterPassword: 'Enter Password',
    login: 'Sign In',
    logout: 'Logout',
    
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    purchases: 'Purchases',
    sales: 'Sales',
    reports: 'Reports',
    settings: 'Settings',
    clients: 'Clients',
    history: 'History',
    debts: 'Debts',
    
    // Dashboard
    quickActions: 'Quick Actions',
    addPurchase: 'Add Purchase',
    addSale: 'Add Sale',
    viewDebts: 'View Debts',
    totalSales: 'Total Sales',
    totalPurchases: 'Total Purchases',
    profit: 'Profit',
    outstandingDebts: 'Outstanding Debts',
    recentActivity: 'Recent Activity',
    dailyStatistics: 'Daily Statistics',
    
    // Sales
    recordNewSale: 'Record New Sale',
    clientName: 'Client Name',
    productSold: 'Product Sold',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    totalAmount: 'Total Amount',
    paymentStatus: 'Payment Status',
    paidInFull: 'Paid in Full',
    partialPayment: 'Partial Payment',
    unpaidDebt: 'Unpaid (Debt)',
    amountPaid: 'Amount Paid',
    remainingDebt: 'Remaining Debt',
    
    // Purchases
    recordNewPurchase: 'Record New Purchase',
    supplierName: 'Supplier Name',
    productName: 'Product Name',
    totalPrice: 'Total Price',
    
    // Products and Stock
    availableStock: 'Available Stock',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    insufficientStock: 'Insufficient Stock',
    inStock: 'In Stock',
    currentStock: 'Current Stock',
    inventory: 'Inventory',
    productInventory: 'Product Inventory',
    manageProductStock: 'Manage Product Stock',
    totalProducts: 'Total Products',
    totalStockValue: 'Total Stock Value',
    searchProducts: 'Search Products',
    sortByName: 'Sort by Name',
    sortByStock: 'Sort by Stock',
    sortByValue: 'Sort by Value',
    noProducts: 'No Products',
    noProductsFound: 'No Products Found',
    tryDifferentSearch: 'Try a Different Search',
    startByAddingProducts: 'Start by Adding Products',
    totalPurchased: 'Total Purchased',
    totalSold: 'Total Sold',
    avgPurchasePrice: 'Average Purchase Price',
    salePrice: 'Sale Price',
    stockValue: 'Stock Value',
    potentialProfit: 'Potential Profit',
    lastPurchasePrice: 'Last Purchase Price',
    lowStockWarning: 'Low Stock Warning',
    outOfStockWarning: 'Out of Stock Warning',
    keepTrackOfStock: 'Keep Track of Stock',
    reviewPricingRegularly: 'Review Pricing Regularly',
    monitorSlowMoving: 'Monitor Slow-Moving Products',
    reorderBeforeEmpty: 'Reorder Before Empty',
    
    // Clients
    topClients: 'Top Clients',
    lastTransaction: 'Last Transaction',
    transactionCount: 'Transactions',
    
    // Reports
    businessReports: 'Business Reports',
    netProfit: 'Net Profit',
    profitMargin: 'Profit Margin',
    totalTransactions: 'Total Transactions',
    trackBusinessPerformance: 'Track your business performance',
    salesVsPurchases: 'Sales vs Purchases',
    topClientsBySales: 'Top Clients by Sales',
    topSuppliersByPurchases: 'Top Suppliers by Purchases',
    debtOverview: 'Debt Overview',
    quickInsights: 'Quick Insights',
    daily: 'Daily',
    monthly: 'Monthly',
    yearly: 'Yearly',
    exportReport: 'Export Report as CSV',
    salesTooltip: 'Sales: ${value}',
    purchasesTooltip: 'Purchases: ${value}',
    profitTooltip: 'Profit: ${value}',
    clientTooltip: 'Client: {name}, Sales: ${value}',
    supplierTooltip: 'Supplier: {name}, Purchases: ${value}',
    
    // Settings
    businessInformation: 'Business Information',
    security: 'Security',
    changePassword: 'Change Password',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    importData: 'Import Data',
    language: 'Language',
    
    // Debts
    clientDebts: 'Client Debts',
    manageClientPayments: 'Manage Client Payments',
    totalOutstanding: 'Total Outstanding',
    clientsWithDebt: 'Clients with Debt',
    noOutstandingDebts: 'No Outstanding Debts',
    allClientsHavePaid: 'All Clients Have Paid',
    updatePayment: 'Update Payment',
    recordPaymentOrUpdate: 'Record Payment or Update',
    paymentAmount: 'Payment Amount',
    enterPaymentAmount: 'Enter Payment Amount',
    outstandingDebt: 'Outstanding Debt',
    recordPayment: 'Record Payment',
    markAsPaid: 'Mark as Paid',
    relatedSales: 'Related Sales',
    pleaseEnterValidPayment: 'Please Enter Valid Payment',
    clickUpdateToRecord: 'Click Update to Record',
    clickPaidToMark: 'Click Paid to Mark',
    keepTrackOfTransactions: 'Keep Track of Transactions',
    regularFollowUps: 'Regular Follow-Ups',
    
    // Messages
    dataImportedSuccessfully: 'Data imported successfully',
    passwordChangedSuccessfully: 'Password changed successfully',
    pleaseCompleteAllFields: 'Please complete all fields',
    incorrectPassword: 'Incorrect password',
    passwordsDoNotMatch: 'Passwords do not match',
    businessNameRequired: 'Business name is required',
    passwordLength: 'Password must be at least 4 characters',
    passwordChanged: 'Password changed',
    
    // Validation
    required: 'Required',
    invalidEmail: 'Invalid email address',
    passwordTooShort: 'Password must be at least 4 characters',

    // New keys for Settings
    appPreferences: 'Manage your business and app preferences',
    saveChanges: 'Save Changes',
    currentPasswordLabel: 'Current Password',
    enterCurrentPassword: 'Enter current password',
    newPasswordLabel: 'New Password',
    enterNewPassword: 'Enter new password',
    confirmNewPasswordLabel: 'Confirm New Password',
    enterConfirmNewPassword: 'Confirm new password',
    updatePassword: 'Update Password',
    dataStatistics: 'Data Statistics',
    dataSize: 'Data Size',
    exportBackup: 'Export Data (Backup)',
    importRestore: 'Import Data (Restore)',
    importConfirm: 'This will replace all current data with backup from {date}. Continue?',
    invalidBackup: 'Invalid backup file format',
    errorReadingBackup: 'Error reading backup file',
    backupTip1: '💡 Regular backups help protect your business data',
    backupTip2: '• Backups are saved as JSON files on your device',
    backupTip3: '• No data is sent to external servers',
    aboutApp: 'About BizMob',
    appVersionInfo: 'BizMob v1.0.0 - Offline Business Notebook',
    localData: 'All data is stored locally on your device',
    noInternet: 'No internet connection required',
    copyright: '© 2024 BizMob. Simple business management.',
    selectLanguage: 'Select Language',
    languageChangeInfo: 'Language changes apply immediately and are saved automatically',
    namesRequired: 'Business name and user name are required',

    // historique

    transactionHistory: 'Transaction History',
    completeBusinessTransactionLog: 'Complete business transaction log',
    loss: 'Loss',
    filters: 'Filters',
    searchTransactions: 'Search transactions...',
    transactionType: 'Transaction Type',
    allTypes: 'All Types',
    salesOnly: 'Sales Only',
    purchasesOnly: 'Purchases Only',
    dateRange: 'Date Range',
    allTime: 'All Time',
    today: 'Today',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    lastYear: 'Last Year',
    filterByParty: 'Filter by Client/Supplier',
    allParties: 'All Parties',
    clearAllFilters: 'Clear All Filters',
    noTransactionsFound: 'No transactions found',
    adjustFilters: 'Try adjusting your filters',
    startTransactions: 'Start making purchases and sales to see your transaction history',
    saleTo: 'Sale to',
    purchaseFrom: 'Purchase from',
    net: 'Net',
    exportHistory: 'Export History as CSV'
  },
  
  fr: {
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    update: 'Mettre à jour',
    paid: 'Payé',
    unpaid: 'Non payé',
    partial: 'Partiel',
    due: 'Échu',
    outstanding: 'En attente',
    tips: 'Conseils',
    items: 'Articles',
    units: 'Unités',
    buy: 'Acheter',
    sell: 'Vendre',
    products: 'Produits',
    
    // App name and tagline
    appName: 'BizMob',
    tagline: 'Votre carnet d\'affaires numérique',
    
    // Welcome/Setup
    welcome: 'Bienvenue',
    businessSetup: 'Configurer Votre Entreprise',
    businessName: 'Nom de l\'Entreprise',
    userName: 'Votre Nom',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    createPassword: 'Créer un Mot de Passe',
    enterPassword: 'Entrer le Mot de Passe',
    login: 'Se Connecter',
    logout: 'Se Déconnecter',
    
    // Navigation
    home: 'Accueil',
    dashboard: 'Tableau de Bord',
    purchases: 'Achats',
    sales: 'Ventes',
    reports: 'Rapports',
    settings: 'Paramètres',
    clients: 'Clients',
    history: 'Historique',
    debts: 'Dettes',
    
    // Dashboard
    quickActions: 'Actions Rapides',
    addPurchase: 'Ajouter un Achat',
    addSale: 'Ajouter une Vente',
    viewDebts: 'Voir les Dettes',
    totalSales: 'Total des Ventes',
    totalPurchases: 'Total des Achats',
    profit: 'Profit',
    outstandingDebts: 'Dettes Impayées',
    recentActivity: 'Activité Récente',
    dailyStatistics: 'Statistiques Quotidiennes',
    
    // Sales
    recordNewSale: 'Enregistrer une Nouvelle Vente',
    clientName: 'Nom du Client',
    productSold: 'Produit Vendu',
    quantity: 'Quantité',
    unitPrice: 'Prix Unitaire',
    totalAmount: 'Montant Total',
    paymentStatus: 'Statut de Paiement',
    paidInFull: 'Payé Intégralement',
    partialPayment: 'Paiement Partiel',
    unpaidDebt: 'Impayé (Dette)',
    amountPaid: 'Montant Payé',
    remainingDebt: 'Dette Restante',
    
    // Purchases
    recordNewPurchase: 'Enregistrer un Nouvel Achat',
    supplierName: 'Nom du Fournisseur',
    productName: 'Nom du Produit',
    totalPrice: 'Prix Total',
    
    // Products and Stock
    availableStock: 'Stock Disponible',
    outOfStock: 'Rupture de Stock',
    lowStock: 'Stock Faible',
    insufficientStock: 'Stock Insuffisant',
    inStock: 'En Stock',
    currentStock: 'Stock Actuel',
    inventory: 'Inventaire',
    productInventory: 'Inventaire de Produit',
    manageProductStock: 'Gérer le Stock de Produit',
    totalProducts: 'Total de Produits',
    totalStockValue: 'Valeur Totale du Stock',
    searchProducts: 'Rechercher des Produits',
    sortByName: 'Trier par Nom',
    sortByStock: 'Trier par Stock',
    sortByValue: 'Trier par Valeur',
    noProducts: 'Aucun Produit',
    noProductsFound: 'Aucun Produit Trouvé',
    tryDifferentSearch: 'Essayez une Recherche Différente',
    startByAddingProducts: 'Commencez par Ajouter des Produits',
    totalPurchased: 'Total Acheté',
    totalSold: 'Total Vendus',
    avgPurchasePrice: 'Prix d\'achat moyen',
    salePrice: 'Prix de Vente',
    stockValue: 'Valeur du Stock',
    potentialProfit: 'Profit Potentiel',
    lastPurchasePrice: 'Dernier Prix d\'Achat',
    lowStockWarning: 'Alerte de Stock Bas',
    outOfStockWarning: 'Alerte de Rupture de Stock',
    keepTrackOfStock: 'Suivre le Stock',
    reviewPricingRegularly: 'Réviser régulièrement les tarifs',
    monitorSlowMoving: 'Surveiller les produits à rotation lente',
    reorderBeforeEmpty: 'Réapprovisionner Avant le Vide',
    
    // Clients
    topClients: 'Meilleurs Clients',
    lastTransaction: 'Dernière Transaction',
    transactionCount: 'Transactions',
    
    // Reports
    businessReports: 'Rapports d\'Affaires',
    netProfit: 'Profit Net',
    profitMargin: 'Marge Bénéficiaire',
    totalTransactions: 'Total des Transactions',
    trackBusinessPerformance: 'Suivez les performances de votre entreprise',
    salesVsPurchases: 'Ventes vs Achats',
    topClientsBySales: 'Meilleurs clients par ventes',
    topSuppliersByPurchases: 'Meilleurs fournisseurs par achats',
    debtOverview: 'Aperçu des dettes',
    quickInsights: 'Aperçus rapides',
    daily: 'Quotidien',
    monthly: 'Mensuel',
    yearly: 'Annuel',
    exportReport: 'Exporter le rapport en CSV',
    salesTooltip: 'Ventes : ${value}',
    purchasesTooltip: 'Achats : ${value}',
    profitTooltip: 'Profit : ${value}',
    clientTooltip: 'Client : {name}, Ventes : ${value}',
    supplierTooltip: 'Fournisseur : {name}, Achats : ${value}',
    
    // Settings
    businessInformation: 'Informations de l\'Entreprise',
    security: 'Sécurité',
    changePassword: 'Changer le Mot de Passe',
    dataManagement: 'Gestion des Données',
    exportData: 'Exporter les Données',
    importData: 'Importer les Données',
    language: 'Langue',
    
    // Debts
    clientDebts: 'Dettes des Clients',
    manageClientPayments: 'Gérer les Paiements Clients',
    totalOutstanding: 'Total en Attente',
    clientsWithDebt: 'Clients avec Dette',
    noOutstandingDebts: 'Pas de Dettes en Attente',
    allClientsHavePaid: 'Tous les Clients ont Payé',
    updatePayment: 'Mettre à jour le Paiement',
    recordPaymentOrUpdate: 'Enregistrer Paiement ou Mettre à jour',
    paymentAmount: 'Montant du Paiement',
    enterPaymentAmount: 'Entrer le Montant du Paiement',
    outstandingDebt: 'Dette en Attente',
    recordPayment: 'Enregistrer Paiement',
    markAsPaid: 'Marquer comme Payé',
    relatedSales: 'Ventes Associées',
    pleaseEnterValidPayment: 'Veuillez Entrer un Paiement Valide',
    clickUpdateToRecord: 'Cliquez sur Mettre à jour pour Enregistrer',
    clickPaidToMark: 'Cliquez sur Payé pour Marquer',
    keepTrackOfTransactions: 'Suivre les Transactions',
    regularFollowUps: 'Suivis Réguliers',
    
    // Messages
    dataImportedSuccessfully: 'Données importées avec succès',
    passwordChangedSuccessfully: 'Mot de passe changé avec succès',
    pleaseCompleteAllFields: 'Veuillez remplir tous les champs',
    incorrectPassword: 'Mot de passe incorrect',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
    businessNameRequired: 'Le nom de l\'entreprise est requis',
    passwordLength: 'Le mot de passe doit contenir au moins 4 caractères',
    passwordChanged: 'Mot de passe changé',
    
    // Validation
    required: 'Obligatoire',
    invalidEmail: 'Adresse email invalide',
    passwordTooShort: 'Le mot de passe doit contenir au moins 4 caractères',

    // New keys for Settings
    appPreferences: 'Gérez vos préférences d\'entreprise et d\'application',
    saveChanges: 'Enregistrer les modifications',
    currentPasswordLabel: 'Mot de passe actuel',
    enterCurrentPassword: 'Entrez le mot de passe actuel',
    newPasswordLabel: 'Nouveau mot de passe',
    enterNewPassword: 'Entrez le nouveau mot de passe',
    confirmNewPasswordLabel: 'Confirmer le nouveau mot de passe',
    enterConfirmNewPassword: 'Confirmez le nouveau mot de passe',
    updatePassword: 'Mettre à jour le mot de passe',
    dataStatistics: 'Statistiques des données',
    dataSize: 'Taille des données',
    exportBackup: 'Exporter les données (Sauvegarde)',
    importRestore: 'Importer les données (Restauration)',
    importConfirm: 'Cela remplacera toutes les données actuelles par la sauvegarde du {date}. Continuer ?',
    invalidBackup: 'Format de fichier de sauvegarde invalide',
    errorReadingBackup: 'Erreur lors de la lecture du fichier de sauvegarde',
    backupTip1: '💡 Des sauvegardes régulières aident à protéger vos données d\'entreprise',
    backupTip2: '• Les sauvegardes sont enregistrées sous forme de fichiers JSON sur votre appareil',
    backupTip3: '• Aucune donnée n\'est envoyée vers des serveurs externes',
    aboutApp: 'À propos de BizMob',
    appVersionInfo: 'BizMob v1.0.0 - Carnet d\'affaires hors ligne',
    localData: 'Toutes les données sont stockées localement sur votre appareil',
    noInternet: 'Aucune connexion internet requise',
    copyright: '© 2024 BizMob. Gestion d\'entreprise simple.',
    selectLanguage: 'Sélectionner la langue',
    languageChangeInfo: 'Les changements de langue s\'appliquent immédiatement et sont sauvegardés automatiquement',
    namesRequired: 'Le nom de l\'entreprise et le nom d\'utilisateur sont requis',

    // historique

    transactionHistory: 'Historique des transactions',
    completeBusinessTransactionLog: 'Journal complet des transactions commerciales',
    loss: 'Perte',
    filters: 'Filtres',
    searchTransactions: 'Rechercher des transactions...',
    transactionType: 'Type de transaction',
    allTypes: 'Tous les types',
    salesOnly: 'Ventes uniquement',
    purchasesOnly: 'Achats uniquement',
    dateRange: 'Plage de dates',
    allTime: 'Tout le temps',
    today: 'Aujourd\'hui',
    last7Days: '7 derniers jours',
    last30Days: '30 derniers jours',
    lastYear: 'Dernière année',
    filterByParty: 'Filtrer par client/fournisseur',
    allParties: 'Toutes les parties',
    clearAllFilters: 'Effacer tous les filtres',
    noTransactionsFound: 'Aucune transaction trouvée',
    adjustFilters: 'Essayez d\'ajuster vos filtres',
    startTransactions: 'Commencez à effectuer des achats et des ventes pour voir votre historique de transactions',
    saleTo: 'Vente à',
    purchaseFrom: 'Achat de',
    net: 'Net',
    exportHistory: 'Exporter l\'historique en CSV',

    // CRUD et Audit Trail
    created: 'Créé',
    updated: 'Modifié',
    deleted: 'Supprimé',
    recordedPayment: 'Paiement enregistré de',
    auditTrail: 'Journal d\'audit',
    viewAuditTrail: 'Voir le journal d\'audit',
    modifications: 'Modifications',
    originalValue: 'Valeur originale',
    newValue: 'Nouvelle valeur',
    modifiedBy: 'Modifié par',
    modifiedOn: 'Modifié le',
    noModifications: 'Aucune modification',
    editPurchase: 'Modifier l\'achat',
    editSale: 'Modifier la vente',
    deletePurchase: 'Supprimer l\'achat',
    deleteSale: 'Supprimer la vente',
    confirmDelete: 'Confirmer la suppression',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    cannotDeleteSale: 'Impossible de supprimer la vente',
    saleHasPayments: 'Cette vente a des paiements associés et ne peut pas être supprimée',
    field: 'Champ',
    oldValue: 'Ancienne valeur',
    newValue: 'Nouvelle valeur',
    action: 'Action',
    entityType: 'Type',
    changeHistory: 'Historique des modifications',
    viewChanges: 'Voir les modifications',
    noChangesRecorded: 'Aucune modification enregistrée',
    allChanges: 'Toutes les modifications',
    filterByEntity: 'Filtrer par entité',
    filterByAction: 'Filtrer par action',
    allActions: 'Toutes les actions',
    allEntities: 'Toutes les entités',
    paymentHistory: 'Historique des paiements',
    viewPaymentHistory: 'Voir l\'historique des paiements',
    paymentDetails: 'Détails du paiement',
    previousAmount: 'Montant précédent',
    newAmount: 'Nouveau montant',
    paymentMethod: 'Méthode de paiement',
    cash: 'Espèces',
    transfer: 'Virement',
    check: 'Chèque',
    other: 'Autre'
  },
  
  es: {
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    update: 'Actualizar',
    paid: 'Pagado',
    unpaid: 'No Pagado',
    partial: 'Parcial',
    due: 'Vencido',
    outstanding: 'Pendiente',
    tips: 'Consejos',
    items: 'Artículos',
    units: 'Unidades',
    buy: 'Comprar',
    sell: 'Vender',
    products: 'Productos',
    
    // App name and tagline
    appName: 'BizMob',
    tagline: 'Tu cuaderno de negocios digital',
    
    // Welcome/Setup
    welcome: 'Bienvenido',
    businessSetup: 'Configurar Tu Negocio',
    businessName: 'Nombre del Negocio',
    userName: 'Tu Nombre',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    createPassword: 'Crear Contraseña',
    enterPassword: 'Ingresar Contraseña',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    
    // Navigation
    home: 'Inicio',
    dashboard: 'Panel',
    purchases: 'Compras',
    sales: 'Ventas',
    reports: 'Reportes',
    settings: 'Configuración',
    clients: 'Clientes',
    history: 'Historial',
    debts: 'Deudas',
    
    // Dashboard
    quickActions: 'Acciones Rápidas',
    addPurchase: 'Agregar Compra',
    addSale: 'Agregar Venta',
    viewDebts: 'Ver Deudas',
    totalSales: 'Ventas Totales',
    totalPurchases: 'Compras Totales',
    profit: 'Ganancia',
    outstandingDebts: 'Deudas Pendientes',
    recentActivity: 'Actividad Reciente',
    dailyStatistics: 'Estadísticas Diarias',
    
    // Sales
    recordNewSale: 'Registrar Nueva Venta',
    clientName: 'Nombre del Cliente',
    productSold: 'Producto Vendido',
    quantity: 'Cantidad',
    unitPrice: 'Precio Unitario',
    totalAmount: 'Monto Total',
    paymentStatus: 'Estado de Pago',
    paidInFull: 'Pagado Completo',
    partialPayment: 'Pago Parcial',
    unpaidDebt: 'Sin Pagar (Deuda)',
    amountPaid: 'Monto Pagado',
    remainingDebt: 'Deuda Restante',
    
    // Purchases
    recordNewPurchase: 'Registrar Nueva Compra',
    supplierName: 'Nombre del Proveedor',
    productName: 'Nombre del Producto',
    totalPrice: 'Precio Total',
    
    // Products and Stock
    availableStock: 'Stock Disponible',
    outOfStock: 'Sin Stock',
    lowStock: 'Stock Bajo',
    insufficientStock: 'Stock Insuficiente',
    inStock: 'En Stock',
    currentStock: 'Stock Actual',
    inventory: 'Inventario',
    productInventory: 'Inventario de Producto',
    manageProductStock: 'Gestionar Stock de Producto',
    totalProducts: 'Total de Productos',
    totalStockValue: 'Valor Total del Stock',
    searchProducts: 'Buscar Productos',
    sortByName: 'Ordenar por Nombre',
    sortByStock: 'Ordenar por Stock',
    sortByValue: 'Ordenar por Valor',
    noProducts: 'No Hay Productos',
    noProductsFound: 'No Se Encontraron Productos',
    tryDifferentSearch: 'Prueba una Búsqueda Diferente',
    startByAddingProducts: 'Empieza Agregando Productos',
    totalPurchased: 'Total Comprado',
    totalSold: 'Total Vendido',
    avgPurchasePrice: 'Precio de Compra Promedio',
    salePrice: 'Precio de Venta',
    stockValue: 'Valor del Stock',
    potentialProfit: 'Beneficio Potencial',
    lastPurchasePrice: 'Último Precio de Compra',
    lowStockWarning: 'Advertencia de Stock Bajo',
    outOfStockWarning: 'Advertencia de Ruptura de Stock',
    keepTrackOfStock: 'Mantener un Control del Stock',
    reviewPricingRegularly: 'Revisar Precios Regularmente',
    monitorSlowMoving: 'Monitorear Productos de Baja Rotación',
    reorderBeforeEmpty: 'Reabastecer Antes de que se Agote',
    
    // Clients
    topClients: 'Mejores Clientes',
    lastTransaction: 'Última Transacción',
    transactionCount: 'Transacciones',
    
    // Reports
    businessReports: 'Reportes de Negocio',
    netProfit: 'Ganancia Neta',
    profitMargin: 'Margen de Ganancia',
    totalTransactions: 'Total de Transacciones',
    trackBusinessPerformance: 'Sigue el rendimiento de tu negocio',
    salesVsPurchases: 'Ventas vs Compras',
    topClientsBySales: 'Mejores clientes por ventas',
    topSuppliersByPurchases: 'Mejores proveedores por compras',
    debtOverview: 'Resumen de deudas',
    quickInsights: 'Perspectivas rápidas',
    daily: 'Diario',
    monthly: 'Mensual',
    yearly: 'Anual',
    exportReport: 'Exportar informe como CSV',
    salesTooltip: 'Ventas: ${value}',
    purchasesTooltip: 'Compras: ${value}',
    profitTooltip: 'Ganancia: ${value}',
    clientTooltip: 'Cliente: {name}, Ventas: ${value}',
    supplierTooltip: 'Proveedor: {name}, Compras: ${value}',
    
    // Settings
    businessInformation: 'Información del Negocio',
    security: 'Seguridad',
    changePassword: 'Cambiar Contraseña',
    dataManagement: 'Gestión de Datos',
    exportData: 'Exportar Datos',
    importData: 'Importar Datos',
    language: 'Idioma',
    
    // Debts
    clientDebts: 'Deudas de Clientes',
    manageClientPayments: 'Gestionar Pagos de Clientes',
    totalOutstanding: 'Total Pendiente',
    clientsWithDebt: 'Clientes con Deuda',
    noOutstandingDebts: 'Sin Deudas Pendientes',
    allClientsHavePaid: 'Todos los Clientes Han Pagado',
    updatePayment: 'Actualizar Pago',
    recordPaymentOrUpdate: 'Registrar Pago o Actualizar',
    paymentAmount: 'Monto del Pago',
    enterPaymentAmount: 'Ingresar Monto del Pago',
    outstandingDebt: 'Deuda Pendiente',
    recordPayment: 'Registrar Pago',
    markAsPaid: 'Marcar como Pagado',
    relatedSales: 'Ventas Relacionadas',
    pleaseEnterValidPayment: 'Por favor Ingrese un Pago Válido',
    clickUpdateToRecord: 'Haga clic en Actualizar para Registrar',
    clickPaidToMark: 'Haga clic en Pagado para Marcar',
    keepTrackOfTransactions: 'Mantener Registro de Transacciones',
    regularFollowUps: 'Seguimientos Regulares',
    
    // Messages
    dataImportedSuccessfully: 'Datos importados exitosamente',
    passwordChangedSuccessfully: 'Contraseña cambiada exitosamente',
    pleaseCompleteAllFields: 'Por favor complete todos los campos',
    incorrectPassword: 'Contraseña incorrecta',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
    businessNameRequired: 'El nombre del negocio es requerido',
    passwordLength: 'La contraseña debe tener al menos 4 caracteres',
    passwordChanged: 'Contraseña cambiada',
    
    // Validation
    required: 'Requerido',
    invalidEmail: 'Dirección de email inválida',
    passwordTooShort: 'La contraseña debe tener al menos 4 caracteres',

    // New keys for Settings
    appPreferences: 'Administra las preferencias de tu negocio y aplicación',
    saveChanges: 'Guardar cambios',
    currentPasswordLabel: 'Contraseña actual',
    enterCurrentPassword: 'Ingresa la contraseña actual',
    newPasswordLabel: 'Nueva contraseña',
    enterNewPassword: 'Ingresa la nueva contraseña',
    confirmNewPasswordLabel: 'Confirmar nueva contraseña',
    enterConfirmNewPassword: 'Confirma la nueva contraseña',
    updatePassword: 'Actualizar contraseña',
    dataStatistics: 'Estadísticas de datos',
    dataSize: 'Tamaño de datos',
    exportBackup: 'Exportar datos (Copia de seguridad)',
    importRestore: 'Importar datos (Restaurar)',
    importConfirm: 'Esto reemplazará todos los datos actuales con la copia de seguridad del {date}. ¿Continuar?',
    invalidBackup: 'Formato de archivo de copia de seguridad inválido',
    errorReadingBackup: 'Error al leer el archivo de copia de seguridad',
    backupTip1: '💡 Las copias de seguridad regulares ayudan a proteger tus datos de negocio',
    backupTip2: '• Las copias de seguridad se guardan como archivos JSON en tu dispositivo',
    backupTip3: '• No se envían datos a servidores externos',
    aboutApp: 'Acerca de BizMob',
    appVersionInfo: 'BizMob v1.0.0 - Cuaderno de negocios sin conexión',
    localData: 'Todos los datos se almacenan localmente en tu dispositivo',
    noInternet: 'No se requiere conexión a internet',
    copyright: '© 2024 BizMob. Gestión de negocio simple.',
    selectLanguage: 'Seleccionar idioma',
    languageChangeInfo: 'Los cambios de idioma se aplican inmediatamente y se guardan automáticamente',
    namesRequired: 'El nombre del negocio y el nombre de usuario son requeridos',


    // historique

    transactionHistory: 'Historial de transacciones',
    completeBusinessTransactionLog: 'Registro completo de transacciones comerciales',
    loss: 'Pérdida',
    filters: 'Filtros',
    searchTransactions: 'Buscar transacciones...',
    transactionType: 'Tipo de transacción',
    allTypes: 'Todos los tipos',
    salesOnly: 'Solo ventas',
    purchasesOnly: 'Solo compras',
    dateRange: 'Rango de fechas',
    allTime: 'Todo el tiempo',
    today: 'Hoy',
    last7Days: 'Últimos 7 días',
    last30Days: 'Últimos 30 días',
    lastYear: 'Último año',
    filterByParty: 'Filtrar por cliente/proveedor',
    allParties: 'Todas las partes',
    clearAllFilters: 'Borrar todos los filtros',
    noTransactionsFound: 'No se encontraron transacciones',
    adjustFilters: 'Intenta ajustar tus filtros',
    startTransactions: 'Comienza a realizar compras y ventas para ver tu historial de transacciones',
    saleTo: 'Venta a',
    purchaseFrom: 'Compra de',
    net: 'Neto',
    exportHistory: 'Exportar historial como CSV',

    // CRUD et Audit Trail
    created: 'Creado',
    updated: 'Actualizado',
    deleted: 'Eliminado',
    recordedPayment: 'Pago registrado de',
    auditTrail: 'Registro de auditoría',
    viewAuditTrail: 'Ver registro de auditoría',
    modifications: 'Modificaciones',
    originalValue: 'Valor original',
    newValue: 'Nuevo valor',
    modifiedBy: 'Modificado por',
    modifiedOn: 'Modificado el',
    noModifications: 'Sin modificaciones',
    editPurchase: 'Editar compra',
    editSale: 'Editar venta',
    deletePurchase: 'Eliminar compra',
    deleteSale: 'Eliminar venta',
    confirmDelete: 'Confirmar eliminación',
    deleteConfirmation: '¿Estás seguro de que quieres eliminar este elemento?',
    cannotDeleteSale: 'No se puede eliminar la venta',
    saleHasPayments: 'Esta venta tiene pagos asociados y no se puede eliminar',
    field: 'Campo',
    oldValue: 'Valor anterior',
    newValue: 'Nuevo valor',
    action: 'Acción',
    entityType: 'Tipo',
    changeHistory: 'Historial de cambios',
    viewChanges: 'Ver cambios',
    noChangesRecorded: 'No se registraron cambios',
    allChanges: 'Todos los cambios',
    filterByEntity: 'Filtrar por entidad',
    filterByAction: 'Filtrar por acción',
    allActions: 'Todas las acciones',
    allEntities: 'Todas las entidades',
    paymentHistory: 'Historial de pagos',
    viewPaymentHistory: 'Ver historial de pagos',
    paymentDetails: 'Detalles del pago',
    previousAmount: 'Cantidad anterior',
    newAmount: 'Nueva cantidad',
    paymentMethod: 'Método de pago',
    cash: 'Efectivo',
    transfer: 'Transferencia',
    check: 'Cheque',
    other: 'Otro'
  },
  
  ar: {
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    update: 'تحديث',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    partial: 'جزئي',
    due: 'مستحق',
    outstanding: 'معلق',
    tips: 'نصائح',
    items: 'عناصر',
    units: 'وحدات',
    buy: 'شراء',
    sell: 'بيع',
    products: 'منتجات',
    
    // App name and tagline
    appName: 'بيزموب',
    tagline: 'دفتر الأعمال الرقمي',
    
    // Welcome/Setup
    welcome: 'مرحبا',
    businessSetup: 'إعداد عملك',
    businessName: 'اسم العمل',
    userName: 'اسمك',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    createPassword: 'إنشاء كلمة مرور',
    enterPassword: 'أدخل كلمة المرور',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    
    // Navigation
    home: 'الرئيسية',
    dashboard: 'لوحة التحكم',
    purchases: 'المشتريات',
    sales: 'المبيعات',
    reports: 'التقارير',
    settings: 'الإعدادات',
    clients: 'العملاء',
    history: 'التاريخ',
    debts: 'الديون',
    
    // Dashboard
    quickActions: 'إجراءات سريعة',
    addPurchase: 'إضافة مشترى',
    addSale: 'إضافة مبيع',
    viewDebts: 'عرض الديون',
    totalSales: 'إجمالي المبيعات',
    totalPurchases: 'إجمالي المشتريات',
    profit: 'الربح',
    outstandingDebts: 'الديون المستحقة',
    recentActivity: 'النشاط الأخير',
    dailyStatistics: 'الإحصائيات اليومية',
    
    // Sales
    recordNewSale: 'تسجيل مبيع جديد',
    clientName: 'اسم العميل',
    productSold: 'المنتج المباع',
    quantity: 'الكمية',
    unitPrice: 'السعر للوحدة',
    totalAmount: 'المبلغ الإجمالي',
    paymentStatus: 'حالة الدفع',
    paidInFull: 'مدفوع بالكامل',
    partialPayment: 'دفع جزئي',
    unpaidDebt: 'غير مدفوع (دين)',
    amountPaid: 'المبلغ المدفوع',
    remainingDebt: 'الدين المتبقي',
    
    // Purchases
    recordNewPurchase: 'تسجيل مشترى جديد',
    supplierName: 'اسم المورد',
    productName: 'اسم المنتج',
    totalPrice: 'السعر الإجمالي',
    
    // Products and Stock
    availableStock: 'المخزون المتاح',
    outOfStock: 'نفد المخزون',
    lowStock: 'مخزون منخفض',
    insufficientStock: 'مخزون غير كافي',
    inStock: 'متوفر',
    currentStock: 'المخزون الحالي',
    inventory: 'جرد',
    productInventory: 'جرد المنتج',
    manageProductStock: 'إدارة مخزون المنتج',
    totalProducts: 'إجمالي المنتجات',
    totalStockValue: 'إجمالي قيمة المخزون',
    searchProducts: 'البحث عن المنتجات',
    sortByName: 'ترتيب حسب الاسم',
    sortByStock: 'ترتيب حسب المخزون',
    sortByValue: 'ترتيب حسب القيمة',
    noProducts: 'لا توجد منتجات',
    noProductsFound: 'لم يتم العثور على منتجات',
    tryDifferentSearch: 'حاول بحثًا مختلفًا',
    startByAddingProducts: 'ابدأ بإضافة منتجات',
    totalPurchased: 'إجمالي المشتريات',
    totalSold: 'إجمالي المبيعات',
    avgPurchasePrice: 'متوسط سعر الشراء',
    salePrice: 'سعر البيع',
    stockValue: 'قيمة المخزون',
    potentialProfit: 'الربح المحتمل',
    lastPurchasePrice: 'آخر سعر شراء',
    lowStockWarning: 'تحذير من انخفاض المخزون',
    outOfStockWarning: 'تحذير من نفاد المخزون',
    keepTrackOfStock: 'تتبع المخزون',
    reviewPricingRegularly: 'مراجعة الأسعار بانتظام',
    monitorSlowMoving: 'راقب المنتجات التي تتحرك ببطء',
    reorderBeforeEmpty: 'إعادة الطلب قبل النفاد',
    
    // Clients
    topClients: 'أفضل العملاء',
    lastTransaction: 'آخر معاملة',
    transactionCount: 'المعاملات',
    
    // Reports
    businessReports: 'تقارير الأعمال',
    netProfit: 'صافي الربح',
    profitMargin: 'هامش الربح',
    totalTransactions: 'إجمالي المعاملات',
    trackBusinessPerformance: 'تتبع أداء عملك',
    salesVsPurchases: 'المبيعات مقابل المشتريات',
    topClientsBySales: 'أفضل العملاء حسب المبيعات',
    topSuppliersByPurchases: 'أفضل الموردين حسب المشتريات',
    debtOverview: 'نظرة عامة على الديون',
    quickInsights: 'رؤى سريعة',
    daily: 'يومي',
    monthly: 'شهري',
    yearly: 'سنوي',
    exportReport: 'تصدير التقرير كملف CSV',
    salesTooltip: 'المبيعات: ${value}',
    purchasesTooltip: 'المشتريات: ${value}',
    profitTooltip: 'الربح: ${value}',
    clientTooltip: 'العميل: {name}, المبيعات: ${value}',
    supplierTooltip: 'المورد: {name}, المشتريات: ${value}',
    
    // Settings
    businessInformation: 'معلومات العمل',
    security: 'الأمان',
    changePassword: 'تغيير كلمة المرور',
    dataManagement: 'إدارة البيانات',
    exportData: 'تصدير البيانات',
    importData: 'استيراد البيانات',
    language: 'اللغة',
    
    // Debts
    clientDebts: 'ديون العملاء',
    manageClientPayments: 'إدارة مدفوعات العملاء',
    totalOutstanding: 'إجمالي المعلقة',
    clientsWithDebt: 'عملاء بديون',
    noOutstandingDebts: 'لا توجد ديون معلقة',
    allClientsHavePaid: 'جميع العملاء دفعوا',
    updatePayment: 'تحديث الدفعة',
    recordPaymentOrUpdate: 'تسجيل دفعة أو تحديث',
    paymentAmount: 'مبلغ الدفعة',
    enterPaymentAmount: 'أدخل مبلغ الدفعة',
    outstandingDebt: 'دين معلق',
    recordPayment: 'تسجيل دفعة',
    markAsPaid: 'تسميه كمدفوع',
    relatedSales: 'مبيعات ذات صلة',
    pleaseEnterValidPayment: 'الرجاء إدخال دفعة صالحة',
    clickUpdateToRecord: 'انقر على تحديث للتسجيل',
    clickPaidToMark: 'انقر على مدفوع للتسميه',
    keepTrackOfTransactions: 'تتبع المعاملات',
    regularFollowUps: 'متابعات منتظمة',
    
    // Messages
    dataImportedSuccessfully: 'تم استيراد البيانات بنجاح',
    passwordChangedSuccessfully: 'تم تغيير كلمة المرور بنجاح',
    pleaseCompleteAllFields: 'يرجى ملء جميع الحقول',
    incorrectPassword: 'كلمة مرور خاطئة',
    passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
    businessNameRequired: 'اسم العمل مطلوب',
    passwordLength: 'يجب أن تحتوي كلمة المرور على 4 أحرف على الأقل',
    passwordChanged: 'تم تغيير كلمة المرور',
    
    // Validation
    required: 'مطلوب',
    invalidEmail: 'عنوان بريد إلكتروني غير صحيح',
    passwordTooShort: 'يجب أن تحتوي كلمة المرور على 4 أحرف على الأقل',

    // New keys for Settings
    appPreferences: 'إدارة تفضيلات عملك وتطبيقك',
    saveChanges: 'حفظ التغييرات',
    currentPasswordLabel: 'كلمة المرور الحالية',
    enterCurrentPassword: 'أدخل كلمة المرور الحالية',
    newPasswordLabel: 'كلمة مرور جديدة',
    enterNewPassword: 'أدخل كلمة مرور جديدة',
    confirmNewPasswordLabel: 'تأكيد كلمة المرور الجديدة',
    enterConfirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    updatePassword: 'تحديث كلمة المرور',
    dataStatistics: 'إحصائيات البيانات',
    dataSize: 'حجم البيانات',
    exportBackup: 'تصدير البيانات (نسخ احتياطي)',
    importRestore: 'استيراد البيانات (استعادة)',
    importConfirm: 'سيؤدي هذا إلى استبدال جميع البيانات الحالية بنسخة احتياطية من {date}. هل تريد المتابعة؟',
    invalidBackup: 'تنسيق ملف النسخ الاحتياطي غير صالح',
    errorReadingBackup: 'خطأ في قراءة ملف النسخ الاحتياطي',
    backupTip1: '💡 النسخ الاحتياطي المنتظم يساعد في حماية بيانات عملك',
    backupTip2: '• يتم حفظ النسخ الاحتياطية كملفات JSON على جهازك',
    backupTip3: '• لا يتم إرسال أي بيانات إلى خوادم خارجية',
    aboutApp: 'حول BizMob',
    appVersionInfo: 'BizMob v1.0.0 - دفتر أعمال غير متصل',
    localData: 'يتم تخزين جميع البيانات محليًا على جهازك',
    noInternet: 'لا يتطلب اتصالاً بالإنترنت',
    copyright: '© 2024 BizMob. إدارة أعمال بسيطة.',
    selectLanguage: 'اختر اللغة',
    languageChangeInfo: 'تُطبق تغييرات اللغة فورًا وتُحفظ تلقائيًا',
    namesRequired: 'اسم العمل واسم المستخدم مطلوبان',

    // History
    transactionHistory: 'سجل المعاملات',
    completeBusinessTransactionLog: 'سجل المعاملات التجارية الكامل',
    loss: 'الخسارة',
    filters: 'الفلاتر',
    searchTransactions: 'البحث في المعاملات...',
    transactionType: 'نوع المعاملة',
    allTypes: 'جميع الأنواع',
    salesOnly: 'المبيعات فقط',
    purchasesOnly: 'المشتريات فقط',
    dateRange: 'نطاق التاريخ',
    allTime: 'كل الوقت',
    today: 'اليوم',
    last7Days: 'آخر 7 أيام',
    last30Days: 'آخر 30 يومًا',
    lastYear: 'السنة الماضية',
    filterByParty: 'التصفية حسب العميل/المورد',
    allParties: 'جميع الأطراف',
    clearAllFilters: 'مسح جميع الفلاتر',
    noTransactionsFound: 'لم يتم العثور على معاملات',
    adjustFilters: 'حاول تعديل فلاترك',
    startTransactions: 'ابدأ في إجراء المشتريات والمبيعات لرؤية سجل معاملاتك',
    saleTo: 'البيع إلى',
    purchaseFrom: 'الشراء من',
    net: 'الصافي',
    exportHistory: 'تصدير السجل كملف CSV',

    // CRUD et Audit Trail
    created: 'تم الإنشاء',
    updated: 'تم التحديث',
    deleted: 'تم الحذف',
    recordedPayment: 'تم تسجيل دفعة بقيمة',
    auditTrail: 'سجل المراجعة',
    viewAuditTrail: 'عرض سجل المراجعة',
    modifications: 'التعديلات',
    originalValue: 'القيمة الأصلية',
    newValue: 'القيمة الجديدة',
    modifiedBy: 'تم التعديل بواسطة',
    modifiedOn: 'تم التعديل في',
    noModifications: 'لا توجد تعديلات',
    editPurchase: 'تعديل المشترى',
    editSale: 'تعديل المبيع',
    deletePurchase: 'حذف المشترى',
    deleteSale: 'حذف المبيع',
    confirmDelete: 'تأكيد الحذف',
    deleteConfirmation: 'هل أنت متأكد من أنك تريد حذف هذا العنصر؟',
    cannotDeleteSale: 'لا يمكن حذف المبيع',
    saleHasPayments: 'هذا المبيع له مدفوعات مرتبطة ولا يمكن حذفه',
    field: 'الحقل',
    oldValue: 'القيمة القديمة',
    newValue: 'القيمة الجديدة',
    action: 'الإجراء',
    entityType: 'النوع',
    changeHistory: 'تاريخ التغييرات',
    viewChanges: 'عرض التغييرات',
    noChangesRecorded: 'لم يتم تسجيل تغييرات',
    allChanges: 'جميع التغييرات',
    filterByEntity: 'تصفية حسب الكيان',
    filterByAction: 'تصفية حسب الإجراء',
    allActions: 'جميع الإجراءات',
    allEntities: 'جميع الكيانات',
    paymentHistory: 'تاريخ المدفوعات',
    viewPaymentHistory: 'عرض تاريخ المدفوعات',
    paymentDetails: 'تفاصيل الدفع',
    previousAmount: 'المبلغ السابق',
    newAmount: 'المبلغ الجديد',
    paymentMethod: 'طريقة الدفع',
    cash: 'نقدي',
    transfer: 'تحويل',
    check: 'شيك',
    other: 'أخرى'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('bizmob_language') as Language;
    if (savedLanguage && savedLanguage in translations) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('bizmob_language', newLanguage);
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}