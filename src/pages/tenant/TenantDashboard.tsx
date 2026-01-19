import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, 
  Calendar, 
  Banknote, 
  FileText, 
  CreditCard, 
  Download, 
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { format, addDays } from 'date-fns';

const TenantDashboard: React.FC = () => {
  const { currentTenant } = useAuth();

  if (!currentTenant) {
    return <div>Loading...</div>;
  }

  const getENachStatusBadge = () => {
    switch (currentTenant.eNachStatus) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Bank Approval</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="inactive">Not Registered</Badge>;
    }
  };

  const getContractStatusBadge = () => {
    switch (currentTenant.contractStatus) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'expiring_soon':
        return <Badge variant="warning">Expiring Soon</Badge>;
      default:
        return <Badge variant="destructive">Expired</Badge>;
    }
  };

  const nextDueDate = addDays(new Date(), 15);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${currentTenant.name}`}
        breadcrumbs={[
          { label: 'Home', href: '/tenant/dashboard' },
          { label: 'Dashboard' },
        ]}
      />

      {/* Alert Banner */}
      {currentTenant.outstandingAmount > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-warning flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Outstanding Dues</p>
            <p className="text-sm text-muted-foreground">
              You have ₹{currentTenant.outstandingAmount.toLocaleString()} pending. Please clear dues to avoid penalties.
            </p>
          </div>
          <Button variant="warning" size="sm" asChild>
            <Link to="/tenant/payments">Pay Now</Link>
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Outstanding Rent"
          value={`₹${currentTenant.outstandingAmount.toLocaleString()}`}
          subtitle={currentTenant.outstandingAmount > 0 ? 'Payment due' : 'All clear!'}
          icon={IndianRupee}
          variant={currentTenant.outstandingAmount > 0 ? 'warning' : 'success'}
        />
        <StatCard
          title="Next Due Date"
          value={format(nextDueDate, 'dd MMM yyyy')}
          subtitle={`In ${Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Monthly Rent"
          value={`₹${currentTenant.rentAmount.toLocaleString()}`}
          subtitle="Current rent amount"
          icon={Banknote}
          variant="default"
        />
        <StatCard
          title="Property"
          value={currentTenant.propertyNo.split('/').slice(-1)[0]}
          subtitle={currentTenant.propertyLocation.split(',')[0]}
          icon={FileText}
          variant="default"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* e-NACH Status */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle className="text-lg flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              e-NACH Status
            </CardTitle>
            {getENachStatusBadge()}
          </CardHeader>
          <CardContent>
            {currentTenant.eNachStatus === 'active' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Auto-debit is active</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your rent of ₹{currentTenant.rentAmount.toLocaleString()} will be automatically debited on the 5th of each month.
                </p>
              </div>
            ) : currentTenant.eNachStatus === 'pending' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-warning">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Awaiting bank approval</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your e-NACH mandate is pending approval from your bank. This usually takes 2-3 business days.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Register for e-NACH to enable automatic rent deduction from your bank account.
                </p>
                <Button variant="gov" asChild>
                  <Link to="/tenant/enach">Register e-NACH</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Status */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contract Status
            </CardTitle>
            {getContractStatusBadge()}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{format(new Date(currentTenant.contractStartDate), 'dd MMM yyyy')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{format(new Date(currentTenant.contractEndDate), 'dd MMM yyyy')}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/tenant/property">
                  <Eye className="w-4 h-4 mr-2" />
                  View Contract Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/tenant/payments" className="quick-action">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Pay Rent Online</p>
                <p className="text-xs text-muted-foreground">UPI, Card, Netbanking</p>
              </div>
            </Link>
            
            <Link to="/tenant/enach" className="quick-action">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Banknote className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">e-NACH Mandate</p>
                <p className="text-xs text-muted-foreground">Setup auto-debit</p>
              </div>
            </Link>
            
            <Link to="/tenant/history" className="quick-action">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">Rent Receipts</p>
                <p className="text-xs text-muted-foreground">Download receipts</p>
              </div>
            </Link>
            
            <Link to="/tenant/property" className="quick-action">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">View Contract</p>
                <p className="text-xs text-muted-foreground">Property details</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDashboard;
