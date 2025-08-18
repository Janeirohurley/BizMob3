import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Save, X } from 'lucide-react';

interface AddTransactionProps {
  onClose: () => void;
  onSave: () => void;
}

export function AddTransaction({ onClose, onSave }: AddTransactionProps) {
  const [formData, setFormData] = useState({
    amount: '',
    type: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const incomeCategories = ['Sales', 'Services', 'Investment', 'Other Income'];
  const expenseCategories = ['Office Supplies', 'Marketing', 'Rent', 'Utilities', 'Travel', 'Other'];

  const handleSave = () => {
    // Here you would typically validate and save the transaction
    console.log('Transaction saved:', formData);
    onSave();
  };

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
        <h2 className="text-gray-800">New Transaction</h2>
        <div className="w-9" /> {/* Spacer for center alignment */}
      </div>

      <div className="p-6 space-y-6">
        <Card className="p-6 space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="h-12 text-xl text-center"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value, category: '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          {formData.type && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(' ', '_')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note about this transaction..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={!formData.amount || !formData.type || !formData.category}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Transaction
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 h-12"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}