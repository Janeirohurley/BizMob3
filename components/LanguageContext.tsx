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
    passwordTooShort: 'Password must be at least 4 characters'
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
    
    // Settings
    businessInformation: 'Informations de l\'Entreprise',
    security: 'Sécurité',
    changePassword: 'Changer le Mot de Passe',
    dataManagement: 'Gestion des Données',
    exportData: 'Exporter les Données',
    importData: 'Importer les Données',
    language: 'Langue',
    
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
    passwordTooShort: 'Le mot de passe doit contenir au moins 4 caractères'
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
    
    // Settings
    businessInformation: 'Información del Negocio',
    security: 'Seguridad',
    changePassword: 'Cambiar Contraseña',
    dataManagement: 'Gestión de Datos',
    exportData: 'Exportar Datos',
    importData: 'Importar Datos',
    language: 'Idioma',
    
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
    passwordTooShort: 'La contraseña debe tener al menos 4 caracteres'
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
    
    // Settings
    businessInformation: 'معلومات العمل',
    security: 'الأمان',
    changePassword: 'تغيير كلمة المرور',
    dataManagement: 'إدارة البيانات',
    exportData: 'تصدير البيانات',
    importData: 'استيراد البيانات',
    language: 'اللغة',
    
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
    passwordTooShort: 'يجب أن تحتوي كلمة المرور على 4 أحرف على الأقل'
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