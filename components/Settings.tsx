import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  User, 
  Building2, 
  Lock, 
  Download, 
  Upload, 
  LogOut, 
  Edit,
  Save,
  Shield,
  Database,
  Globe
} from 'lucide-react';
import { BusinessData, Purchase, Sale, Debt, Product, Client } from '../App';
import { useLanguage, Language } from './LanguageContext';

interface SettingsProps {
  businessData: BusinessData;
  onUpdateBusinessData: (data: Partial<BusinessData>) => void;
  onLogout: () => void;
  purchases: Purchase[];
  sales: Sale[];
  debts: Debt[];
  products: Product[];
  clients: Client[];
  onImportData: (data: { purchases: Purchase[], sales: Sale[], debts: Debt[], products: Product[], clients: Client[] }) => void;
}

export function Settings({ 
  businessData, 
  onUpdateBusinessData, 
  onLogout, 
  purchases, 
  sales, 
  debts, 
  products,
  clients,
  onImportData 
}: SettingsProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    businessName: businessData.businessName,
    userName: businessData.userName,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveBusiness = () => {
    if (!formData.businessName.trim() || !formData.userName.trim()) {
      alert(t.businessNameRequired || 'Business name and user name are required');
      return;
    }

    onUpdateBusinessData({
      businessName: formData.businessName.trim(),
      userName: formData.userName.trim()
    });
    setIsEditingBusiness(false);
  };

  const handlePasswordChange = () => {
    if (formData.currentPassword !== businessData.password) {
      alert(t.incorrectPassword || 'Current password is incorrect');
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 4) {
      alert(t.passwordLength || 'New password must be at least 4 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert(t.passwordMismatch || 'New passwords do not match');
      return;
    }

    onUpdateBusinessData({ password: formData.newPassword });
    setIsChangingPassword(false);
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    alert(t.passwordChanged || 'Password changed successfully');
  };

  const handleExportData = () => {
    const exportData = {
      businessData,
      purchases,
      sales,
      debts,
      products,
      clients,
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bizmob-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          if (importedData.purchases && importedData.sales && importedData.debts && importedData.products && importedData.clients) {
            const confirmImport = confirm(
              `This will replace all current data with backup from ${new Date(importedData.exportDate).toLocaleDateString()}. Continue?`
            );
            
            if (confirmImport) {
              onImportData({
                purchases: importedData.purchases,
                sales: importedData.sales,
                debts: importedData.debts,
                products: importedData.products,
                clients: importedData.clients
              });
              alert('Data imported successfully');
            }
          } else {
            alert('Invalid backup file format');
          }
        } catch (error) {
          alert('Error reading backup file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const totalTransactions = purchases.length + sales.length;
  const dataSize = JSON.stringify({ purchases, sales, debts, products, clients }).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your business and app preferences</p>
      </div>

      {/* Business Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800">Business Information</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditingBusiness(!isEditingBusiness)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">{businessData.businessName.charAt(0)}</span>
            </div>
            <div>
              <h4 className="text-gray-800">{businessData.businessName}</h4>
              <p className="text-gray-600">{businessData.userName}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <Label>Business Name</Label>
                {isEditingBusiness ? (
                  <Input 
                    value={formData.businessName} 
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="mt-1" 
                  />
                ) : (
                  <p className="text-gray-800">{businessData.businessName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <Label>User Name</Label>
                {isEditingBusiness ? (
                  <Input 
                    value={formData.userName} 
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="mt-1" 
                  />
                ) : (
                  <p className="text-gray-800">{businessData.userName}</p>
                )}
              </div>
            </div>
          </div>

          {isEditingBusiness && (
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveBusiness} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditingBusiness(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h3 className="text-gray-800 mb-4">Security</h3>
        
        {!isChangingPassword ? (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => setIsChangingPassword(true)}
          >
            <Lock className="w-4 h-4 mr-3" />
            Change Password
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handlePasswordChange} className="bg-green-600 hover:bg-green-700 text-white">
                <Shield className="w-4 h-4 mr-2" />
                Update Password
              </Button>
              <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-gray-800 mb-4">Data Management</h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-blue-800 mb-2">Data Statistics</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Total Transactions: {totalTransactions}</p>
              <p>• Purchases: {purchases.length}</p>
              <p>• Sales: {sales.length}</p>
              <p>• Outstanding Debts: {debts.filter(d => d.totalDebt > 0).length}</p>
              <p>• Data Size: {(dataSize / 1024).toFixed(2)} KB</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleExportData}
              className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
            >
              <Download className="w-4 h-4 mr-3" />
              Export Data (Backup)
            </Button>
            
            <Button 
              onClick={handleImportData}
              variant="outline" 
              className="w-full justify-start"
            >
              <Upload className="w-4 h-4 mr-3" />
              Import Data (Restore)
            </Button>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p>💡 Regular backups help protect your business data</p>
            <p>• Backups are saved as JSON files on your device</p>
            <p>• No data is sent to external servers</p>
          </div>
        </div>
      </Card>

      {/* App Information */}
      <Card className="p-6">
        <h3 className="text-gray-800 mb-4">About BizMob</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>BizMob v1.0.0 - Offline Business Notebook</span>
          </div>
          <p>All data is stored locally on your device</p>
          <p>No internet connection required</p>
          <p>© 2024 BizMob. Simple business management.</p>
        </div>
      </Card>

      {/* Language Settings */}
      <Card className="p-6">
        <h3 className="text-gray-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {t.language}
        </h3>
        
        <div className="space-y-3">
          <Label htmlFor="language">Select Language</Label>
          <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">
                <div className="flex items-center gap-2">
                  <span>🇺🇸</span>
                  <span>English</span>
                </div>
              </SelectItem>
              <SelectItem value="fr">
                <div className="flex items-center gap-2">
                  <span>🇫🇷</span>
                  <span>Français</span>
                </div>
              </SelectItem>
              <SelectItem value="es">
                <div className="flex items-center gap-2">
                  <span>🇪🇸</span>
                  <span>Español</span>
                </div>
              </SelectItem>
              <SelectItem value="ar">
                <div className="flex items-center gap-2">
                  <span>🇸🇦</span>
                  <span>العربية</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-xs text-gray-500">
            Language changes apply immediately and are saved automatically
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Button 
        onClick={onLogout}
        variant="destructive" 
        className="w-full"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}