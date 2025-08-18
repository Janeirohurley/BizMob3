import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookOpen, Lock, User, Building2, DollarSign, Upload, FileUp } from 'lucide-react';
import { BusinessData } from '../types/business';
import { useLanguage } from './LanguageContext';

export interface ImportedData {
  businessData?: BusinessData;
  purchases?: any[];
  sales?: any[];
  debts?: any[];
  products?: any[];
  clients?: any[];
}

interface WelcomeScreenProps {
  onComplete: (data: BusinessData) => void;
  onImportData?: (data: ImportedData) => void;
  isLogin?: boolean;
  onLogin?: (password: string) => boolean;
  businessData?: BusinessData;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham' },
  { code: 'TND', symbol: 'DT', name: 'Tunisian Dinar' },
  { code: 'OTHER', symbol: '', name: 'Other (Manual)' }, // New option
];

export function WelcomeScreen({ onComplete, onImportData, isLogin = false, onLogin, businessData }: WelcomeScreenProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    businessName: businessData?.businessName || '',
    userName: businessData?.userName || '',
    password: '',
    confirmPassword: '',
    currency: businessData?.currency || 'USD',
    currencySymbol: businessData?.currencySymbol || '$',
    customCurrency: '',
    customSymbol: '',
  });
  const [error, setError] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleCurrencyChange = (currencyCode: string) => {
    if (currencyCode === 'OTHER') {
      setFormData({
        ...formData,
        currency: 'OTHER',
        currencySymbol: '',
      });
    } else {
      const selectedCurrency = currencies.find(c => c.code === currencyCode);
      if (selectedCurrency) {
        setFormData({
          ...formData,
          currency: selectedCurrency.code,
          currencySymbol: selectedCurrency.symbol,
          customCurrency: '',
          customSymbol: '',
        });
      }
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate that this is a BizMob export file
        if (!importedData.businessData || !importedData.businessData.businessName) {
          setError('Invalid file format. Please select a valid BizMob export file.');
          return;
        }

        // Extract business data and other data
        const { businessData: importedBusinessData, ...otherData } = importedData;
        
        // Auto-fill form with imported business data
        setFormData({
          businessName: importedBusinessData.businessName || '',
          userName: importedBusinessData.userName || '',
          password: '',
          confirmPassword: '',
          currency: importedBusinessData.currency || 'USD',
          currencySymbol: importedBusinessData.currencySymbol || '$',
          customCurrency: '',
          customSymbol: '',
        });

        // Store imported data for later use
        if (onImportData) {
          onImportData(importedData);
        }

        setError('');
        setShowImport(false);
        
        // Show success message
        alert(`${t.dataImportedSuccessfully || 'Data imported successfully'}! Please set a new password to complete setup.`);
        
      } catch (err) {
        setError('Failed to import file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login mode
      if (!formData.password) {
        setError('Please enter your password');
        return;
      }
      
      if (onLogin && !onLogin(formData.password)) {
        setError('Incorrect password');
        return;
      }
      return;
    }

    // Setup mode
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return;
    }

    if (!formData.userName.trim()) {
      setError('User name is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    // Validate custom currency
    if (formData.currency === 'OTHER') {
      if (!formData.customCurrency.trim()) {
        setError('Please enter a custom currency code');
        return;
      }
      if (!formData.customSymbol.trim()) {
        setError('Please enter a custom currency symbol');
        return;
      }
    }

    const finalCurrency = formData.currency === 'OTHER' ? formData.customCurrency.trim().toUpperCase() : formData.currency;
    const finalSymbol = formData.currency === 'OTHER' ? formData.customSymbol.trim() : formData.currencySymbol;

    onComplete({
      businessName: formData.businessName.trim(),
      userName: formData.userName.trim(),
      password: formData.password,
      currency: finalCurrency,
      currencySymbol: finalSymbol,
      isSetup: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="bg-white rounded-full p-6 mb-6 shadow-lg mx-auto w-24 h-24 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-white mb-2">BizMob</h1>
        <p className="text-blue-100">
          {isLogin ? 'Welcome back!' : 'Your digital business notebook'}
        </p>
      </div>

      <Card className="w-full max-w-sm p-6 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-gray-800 mb-2">
            {isLogin ? 'Enter Password' : 'Set Up Your Business'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Enter your password to access BizMob' : 'Get started with your business management'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Import Data Option */}
              {!showImport ? (
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mb-4"
                    onClick={() => setShowImport(true)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t.importData || 'Import Existing Data'}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center mb-3">
                    <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {t.importData || 'Import your BizMob data file'}
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowImport(false)}
                      className="flex-1"
                    >
                      {t.cancel || 'Cancel'}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Select a JSON file exported from BizMob
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="businessName" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Name
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Currency
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={handleCurrencyChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.name} {currency.symbol && `(${currency.symbol})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Currency Fields */}
              {formData.currency === 'OTHER' && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg border">
                  <div className="space-y-2">
                    <Label htmlFor="customCurrency" className="text-sm">
                      Currency Code (e.g., XAF, CFA)
                    </Label>
                    <Input
                      id="customCurrency"
                      type="text"
                      placeholder="Enter currency code"
                      value={formData.customCurrency}
                      onChange={(e) => setFormData({ ...formData, customCurrency: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customSymbol" className="text-sm">
                      Currency Symbol (e.g., ₣, FCFA)
                    </Label>
                    <Input
                      id="customSymbol"
                      type="text"
                      placeholder="Enter currency symbol"
                      value={formData.customSymbol}
                      onChange={(e) => setFormData({ ...formData, customSymbol: e.target.value })}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Enter your local currency details manually
                  </p>
                </div>
              )}
            </>
          )}

          {isLogin && businessData && (
            <div className="text-center p-4 bg-blue-50 rounded-lg mb-4">
              <p className="text-blue-800 mb-1">{businessData.businessName}</p>
              <p className="text-blue-600 text-sm">{businessData.userName}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {isLogin ? 'Password' : 'Create Password'}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isLogin ? 'Enter your password' : 'Create a secure password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
          >
            {isLogin ? 'Sign In' : 'Complete Setup'}
          </Button>
        </form>

        {!isLogin && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              All data is stored locally on your device. No internet connection required.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}