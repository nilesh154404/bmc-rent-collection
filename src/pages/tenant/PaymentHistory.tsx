import React from 'react';
import { Download, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { useAuth } from '@/contexts/AuthContext';
import { mockPayments, Payment } from '@/lib/mockData';
import { format } from 'date-fns';

const PaymentHistory: React.FC = () => {
  const { currentTenant } = useAuth();

  if (!currentTenant) {
    return <div>Loading...</div>;
  }

  // Filter payments for current tenant (in real app, would filter by tenantId)
  const tenantPayments = mockPayments;

  const columns = [
    {
      key: 'receiptNo',
      header: 'Receipt No',
      render: (payment: Payment) => (
        <span className="font-medium">{payment.receiptNo || '-'}</span>
      ),
    },
    {
      key: 'paymentDate',
      header: 'Date',
      render: (payment: Payment) => format(new Date(payment.paymentDate), 'dd MMM yyyy'),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (payment: Payment) => (
        <span className="font-medium">₹{payment.amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'paymentMode',
      header: 'Payment Mode',
      render: (payment: Payment) => (
        <span className="capitalize">{payment.paymentMode.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (payment: Payment) => {
        const statusConfig = {
          success: { variant: 'success' as const, icon: CheckCircle2, label: 'Success' },
          failed: { variant: 'destructive' as const, icon: XCircle, label: 'Failed' },
          pending: { variant: 'warning' as const, icon: Clock, label: 'Pending' },
        };
        const config = statusConfig[payment.status];
        return (
          <Badge variant={config.variant} className="gap-1">
            <config.icon className="w-3 h-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (payment: Payment) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          {payment.status === 'success' && (
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const successfulPayments = tenantPayments.filter(p => p.status === 'success');
  const totalPaid = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Payment History"
        subtitle="View all your past payments and download receipts"
        breadcrumbs={[
          { label: 'Home', href: '/tenant/dashboard' },
          { label: 'Payment History' },
        ]}
        actions={
          <Button variant="gov">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid (This Year)</p>
                <p className="text-2xl font-bold text-success">₹{totalPaid.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful Payments</p>
                <p className="text-2xl font-bold">{successfulPayments.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed Transactions</p>
                <p className="text-2xl font-bold">{tenantPayments.filter(p => p.status === 'failed').length}</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={tenantPayments}
            keyExtractor={(payment) => payment.id}
            emptyMessage="No payment records found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
