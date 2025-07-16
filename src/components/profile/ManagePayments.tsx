import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Plus, Edit, Trash2, Shield } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  cardholderName: string;
}

// Mock data - replace with real data from Supabase
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2025',
    isDefault: true,
    cardholderName: 'John Doe'
  },
  {
    id: '2',
    type: 'debit',
    brand: 'Mastercard',
    last4: '5555',
    expiryMonth: '08',
    expiryYear: '2026',
    isDefault: false,
    cardholderName: 'John Doe'
  }
];

const PaymentMethodForm = ({ method, onSave, onCancel }: { 
  method?: PaymentMethod; 
  onSave: (method: PaymentMethod) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState({
    cardholderName: method?.cardholderName || '',
    cardNumber: '',
    expiryMonth: method?.expiryMonth || '',
    expiryYear: method?.expiryYear || '',
    cvv: '',
    type: method?.type || 'credit'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - replace with real API call
    const newMethod: PaymentMethod = {
      id: method?.id || Date.now().toString(),
      type: formData.type as 'credit' | 'debit',
      brand: 'Visa', // Mock - would be determined by card number
      last4: formData.cardNumber.slice(-4),
      expiryMonth: formData.expiryMonth,
      expiryYear: formData.expiryYear,
      isDefault: false,
      cardholderName: formData.cardholderName
    };
    onSave(newMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardholderName" className="text-white">Cardholder Name</Label>
        <Input
          id="cardholderName"
          value={formData.cardholderName}
          onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
          className="bg-black/40 border-purple-500/30 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
        <Input
          id="cardNumber"
          value={formData.cardNumber}
          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
          placeholder="1234 5678 9012 3456"
          className="bg-black/40 border-purple-500/30 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryMonth" className="text-white">Month</Label>
          <Select value={formData.expiryMonth} onValueChange={(value) => setFormData({ ...formData, expiryMonth: value })}>
            <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                  {String(i + 1).padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryYear" className="text-white">Year</Label>
          <Select value={formData.expiryYear} onValueChange={(value) => setFormData({ ...formData, expiryYear: value })}>
            <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
              <SelectValue placeholder="YYYY" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={2024 + i} value={String(2024 + i)}>
                  {2024 + i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv" className="text-white">CVV</Label>
          <Input
            id="cvv"
            value={formData.cvv}
            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
            placeholder="123"
            className="bg-black/40 border-purple-500/30 text-white"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-white">Card Type</Label>
        <Select value={formData.type} onValueChange={(value: 'credit' | 'debit') => setFormData({ ...formData, type: value })}>
          <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit">Credit Card</SelectItem>
            <SelectItem value="debit">Debit Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
          {method ? 'Update' : 'Add'} Payment Method
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export const ManagePayments = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleSaveMethod = (method: PaymentMethod) => {
    if (editingMethod) {
      setPaymentMethods(paymentMethods.map(m => m.id === method.id ? method : m));
      setEditingMethod(null);
    } else {
      setPaymentMethods([...paymentMethods, method]);
      setShowAddDialog(false);
    }
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(m => m.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(m => ({ ...m, isDefault: m.id === id })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Manage Payments</h2>
            <p className="text-gray-400">Add, edit, or remove payment methods</p>
          </div>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Add Payment Method</DialogTitle>
            </DialogHeader>
            <PaymentMethodForm 
              onSave={handleSaveMethod}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">
                        {method.brand} •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {method.cardholderName} • Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    >
                      Set Default
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMethod(method)}
                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-purple-500/30">
                      <DialogHeader>
                        <DialogTitle className="text-white">Edit Payment Method</DialogTitle>
                      </DialogHeader>
                      <PaymentMethodForm 
                        method={editingMethod || undefined}
                        onSave={handleSaveMethod}
                        onCancel={() => setEditingMethod(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMethod(method.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paymentMethods.length === 0 && (
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Payment Methods</h3>
            <p className="text-gray-400 mb-4">Add a payment method to start placing orders.</p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Payment Method
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-green-400" />
            <h3 className="text-white font-semibold">Security Information</h3>
          </div>
          <div className="text-gray-300 space-y-2">
            <p>• Your payment information is encrypted and secure</p>
            <p>• We never store your full card number or CVV</p>
            <p>• All transactions are processed through secure payment gateways</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};