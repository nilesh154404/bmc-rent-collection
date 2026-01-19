import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet,
  CheckCircle2,
  Copy,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/common/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PaymentMethod = 'upi' | 'netbanking' | 'card' | 'wallet';

const TenantPayments: React.FC = () => {
  const { currentTenant } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  if (!currentTenant) {
    return <div>Loading...</div>;
  }

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      setReceiptId(`RCP/2024/${Date.now().toString().slice(-6)}`);
      toast.success('Payment successful!');
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Payment Successful"
          subtitle="Your rent payment has been processed"
          breadcrumbs={[
            { label: 'Home', href: '/tenant/dashboard' },
            { label: 'Pay Rent', href: '/tenant/payments' },
            { label: 'Success' },
          ]}
        />

        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground">Payment Successful!</h2>
              <p className="text-muted-foreground">
                Your rent payment of ₹{currentTenant.rentAmount.toLocaleString()} has been processed successfully.
              </p>

              <div className="bg-muted rounded-lg p-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receipt No</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{receiptId}</span>
                    <button onClick={() => { navigator.clipboard.writeText(receiptId); toast.success('Copied!'); }}>
                      <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-medium">TXN{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium">₹{currentTenant.rentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Mode</span>
                  <span className="font-medium capitalize">{selectedMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="success">Success</Badge>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="gov" onClick={() => setPaymentComplete(false)}>
                  Make Another Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, Paytm' },
    { id: 'netbanking', label: 'Net Banking', icon: Building, description: 'All major banks' },
    { id: 'card', label: 'Debit/Credit Card', icon: CreditCard, description: 'Visa, MasterCard, RuPay' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Paytm, Amazon Pay' },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Pay Rent Online"
        subtitle="Make secure online rent payment"
        breadcrumbs={[
          { label: 'Home', href: '/tenant/dashboard' },
          { label: 'Pay Rent' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outstanding Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-medium text-sm">{currentTenant.propertyNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Month Rent</span>
                  <span className="font-medium">₹{currentTenant.rentAmount.toLocaleString()}</span>
                </div>
                {currentTenant.outstandingAmount > currentTenant.rentAmount && (
                  <div className="flex justify-between text-warning">
                    <span>Previous Dues</span>
                    <span className="font-medium">₹{(currentTenant.outstandingAmount - currentTenant.rentAmount).toLocaleString()}</span>
                  </div>
                )}
                <hr className="border-border" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Outstanding</span>
                  <span className="font-bold text-primary">₹{currentTenant.outstandingAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <Label>Amount to Pay (₹)</Label>
                <Input 
                  type="number" 
                  defaultValue={currentTenant.rentAmount}
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-muted-foreground">
                  You can pay partial amount or full outstanding
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      selectedMethod === method.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selectedMethod === method.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <method.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Form based on method */}
              <div className="border-t border-border pt-6">
                {selectedMethod === 'upi' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="font-semibold">Pay via UPI</h3>
                    <div className="space-y-2">
                      <Label>Enter UPI ID</Label>
                      <Input placeholder="yourname@upi" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Or scan QR code using any UPI app
                    </p>
                    <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
                      <div className="w-40 h-40 bg-card border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">QR Code</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'netbanking' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="font-semibold">Pay via Net Banking</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Other'].map((bank) => (
                        <Button key={bank} variant="outline" className="h-auto py-3">
                          {bank}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="font-semibold">Pay via Card</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label>Card Number</Label>
                        <Input placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="123" type="password" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Name on Card</Label>
                        <Input placeholder="Enter name as on card" />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'wallet' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="font-semibold">Pay via Wallet</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['Paytm', 'Amazon Pay', 'PhonePe', 'MobiKwik', 'Freecharge', 'Other'].map((wallet) => (
                        <Button key={wallet} variant="outline" className="h-auto py-3">
                          {wallet}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button 
                variant="gov" 
                size="xl" 
                className="w-full" 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : `Pay ₹${currentTenant.rentAmount.toLocaleString()}`}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                🔒 Your payment is secured with 256-bit SSL encryption
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TenantPayments;
