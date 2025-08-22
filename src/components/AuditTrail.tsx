import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ArrowLeft, FileText, Search, Filter, Calendar, User, Edit, Trash2, Plus, CreditCard } from 'lucide-react';
import { AuditLog } from '../types/business';
import { useLanguage } from './LanguageContext';
import { getAuditLogs } from '../utils/auditUtils';

interface AuditTrailProps {
  onClose: () => void;
}

export function AuditTrail({ onClose }: AuditTrailProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const auditLogs = getAuditLogs();

  // Filter logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = !searchTerm ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'UPDATE':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'DELETE':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'PAYMENT':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'PAYMENT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case 'PURCHASE':
        return 'bg-blue-100 text-blue-800';
      case 'SALE':
        return 'bg-green-100 text-green-800';
      case 'DEBT':
        return 'bg-red-100 text-red-800';
      case 'PRODUCT':
        return 'bg-orange-100 text-orange-800';
      case 'CLIENT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language) + ' ' + date.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' });
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  };

  if (selectedLog) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedLog(null)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-gray-800">{t.viewChanges}</h2>
          <div className="w-9" />
        </div>

        <div className="p-6 space-y-6">
          {/* Log Header */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {getActionIcon(selectedLog.action)}
              <div>
                <h3 className="text-gray-800">{selectedLog.entityName}</h3>
                <p className="text-gray-600 text-sm">{selectedLog.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{t.action}:</span>
                <Badge className={`ml-2 ${getActionColor(selectedLog.action)}`}>
                  {t[selectedLog.action.toLowerCase()]}
                </Badge>
              </div>
              <div>
                <span className="text-gray-600">{t.entityType}:</span>
                <Badge className={`ml-2 ${getEntityColor(selectedLog.entityType)}`}>
                  {selectedLog.entityType}
                </Badge>
              </div>
              <div>
                <span className="text-gray-600">{t.modifiedBy}:</span>
                <span className="ml-2 text-gray-800">{selectedLog.userId}</span>
              </div>
              <div>
                <span className="text-gray-600">{t.modifiedOn}:</span>
                <span className="ml-2 text-gray-800">{formatDate(selectedLog.date)}</span>
              </div>
            </div>
          </Card>

          {/* Changes Details */}
          <Card className="p-6">
            <h4 className="text-gray-800 mb-4">{t.modifications}</h4>
            {selectedLog.changes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t.noModifications}</p>
            ) : (
              <div className="space-y-4">
                {selectedLog.changes.map((change, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-gray-800 font-medium">{change.field}</h5>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-red-700 text-sm mb-1">{t.oldValue}:</p>
                        <p className="text-red-800 font-mono text-sm">
                          {formatValue(change.oldValue)}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-green-700 text-sm mb-1">{t.newValue}:</p>
                        <p className="text-green-800 font-mono text-sm">
                          {formatValue(change.newValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Metadata */}
          {selectedLog.metadata && (
            <Card className="p-6">
              <h4 className="text-gray-800 mb-4">Métadonnées</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(selectedLog.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="text-gray-800">{formatValue(value)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onClose}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-gray-800">{t.auditTrail}</h2>
        <div className="w-9" />
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-gray-800">{t.changeHistory}</h3>
          <p className="text-gray-600">Toutes les modifications sont enregistrées</p>
        </div>

        {/* Filters */}
        <Card className="p-4 space-y-4">
          <h4 className="text-gray-800 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t.filters}
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher dans les modifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Action Filter */}
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterByAction} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allActions}</SelectItem>
                  <SelectItem value="CREATE">{t.created}</SelectItem>
                  <SelectItem value="UPDATE">{t.updated}</SelectItem>
                  <SelectItem value="DELETE">{t.deleted}</SelectItem>
                  <SelectItem value="PAYMENT">{t.recordedPayment}</SelectItem>
                </SelectContent>
              </Select>

              {/* Entity Filter */}
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterByEntity} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allEntities}</SelectItem>
                  <SelectItem value="PURCHASE">Achats</SelectItem>
                  <SelectItem value="SALE">Ventes</SelectItem>
                  <SelectItem value="DEBT">Dettes</SelectItem>
                  <SelectItem value="PRODUCT">Produits</SelectItem>
                  <SelectItem value="CLIENT">Clients</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || actionFilter !== 'all' || entityFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setActionFilter('all');
                setEntityFilter('all');
              }}
              className="w-full"
            >
              {t.clearAllFilters}
            </Button>
          )}
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <h3 className="text-blue-600">{filteredLogs.length}</h3>
            <p className="text-gray-600 text-sm">{t.totalTransactions}</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-green-600">
              {filteredLogs.filter(log => log.action === 'CREATE').length}
            </h3>
            <p className="text-gray-600 text-sm">Créations</p>
          </Card>
        </div>

        {/* Audit Logs List */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-gray-800 mb-2">{t.noChangesRecorded}</h4>
              <p className="text-gray-600">
                {searchTerm || actionFilter !== 'all' || entityFilter !== 'all'
                  ? t.adjustFilters
                  : 'Aucune modification enregistrée pour le moment'}
              </p>
            </Card>
          ) : (
            filteredLogs.map((log) => (
              <Card
                key={log.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getActionIcon(log.action)}
                    <div>
                      <h4 className="text-gray-800">{log.entityName}</h4>
                      <p className="text-gray-600 text-sm">{log.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getActionColor(log.action)}>
                      {t[log.action.toLowerCase()]}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(log.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{log.userId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getEntityColor(log.entityType)}>
                      {log.entityType}
                    </Badge>
                    {log.changes.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {log.changes.length} modification{log.changes.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick preview of changes */}
                {log.changes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      Champs modifiés: {log.changes.map(c => c.field).join(', ')}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}