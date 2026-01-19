import React from 'react';
import { Download, Building2, Calendar, IndianRupee, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { mockProperties } from '@/lib/mockData';
import { format, differenceInDays } from 'date-fns';

const PropertyDetails: React.FC = () => {
  const { currentTenant } = useAuth();

  if (!currentTenant) {
    return <div>Loading...</div>;
  }

  const property = mockProperties.find(p => p.id === currentTenant.propertyId);

  const daysUntilExpiry = differenceInDays(new Date(currentTenant.contractEndDate), new Date());

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Property & Contract Details"
        subtitle="View your property information and lease agreement"
        breadcrumbs={[
          { label: 'Home', href: '/tenant/dashboard' },
          { label: 'Property & Contract' },
        ]}
        actions={
          <Button variant="gov">
            <Download className="w-4 h-4 mr-2" />
            Download Contract PDF
          </Button>
        }
      />

      {/* Contract Expiry Warning */}
      {daysUntilExpiry < 90 && daysUntilExpiry > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">Contract Expiring Soon</p>
            <p className="text-sm text-muted-foreground">
              Your lease agreement expires in {daysUntilExpiry} days. Please contact BMC for renewal.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Property Number</p>
                <p className="font-medium">{currentTenant.propertyNo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{property?.category || 'Commercial Shop'}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{currentTenant.propertyLocation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="font-medium">{property?.area || 500} sq.ft</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Property Status</p>
                <Badge variant="success">Occupied</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contract Details
            </CardTitle>
            <Badge 
              variant={currentTenant.contractStatus === 'active' ? 'success' : 
                      currentTenant.contractStatus === 'expiring_soon' ? 'warning' : 'destructive'}
            >
              {currentTenant.contractStatus === 'active' ? 'Active' : 
               currentTenant.contractStatus === 'expiring_soon' ? 'Expiring Soon' : 'Expired'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contract Start</p>
                <p className="font-medium">{format(new Date(currentTenant.contractStartDate), 'dd MMM yyyy')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contract End</p>
                <p className="font-medium">{format(new Date(currentTenant.contractEndDate), 'dd MMM yyyy')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contract Duration</p>
                <p className="font-medium">3 Years</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="font-medium">{daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rent Details */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Rent Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                <p className="font-medium text-lg">₹{currentTenant.rentAmount.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Escalation Rate</p>
                <p className="font-medium">{property?.escalationRate || 10}% per annum</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Security Deposit</p>
                <p className="font-medium">₹{(property?.securityDeposit || 150000).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Billing Frequency</p>
                <p className="font-medium">Monthly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Payment Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">5th of every month</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Grace Period</p>
                <p className="font-medium">10 days</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Late Fee</p>
                <p className="font-medium">2% per month</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Penalty After</p>
                <p className="font-medium">30 days overdue</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Consistent late payments may result in penalty notices and legal action as per BMC guidelines.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Rent Cycle Status */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>Current Rent Cycle Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Current Billing Cycle</p>
              <p className="font-medium text-lg">December 2024</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Amount Due</p>
              <p className="font-medium text-lg text-primary">₹{currentTenant.rentAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={currentTenant.outstandingAmount > 0 ? 'warning' : 'success'}>
                {currentTenant.outstandingAmount > 0 ? 'Pending' : 'Paid'}
              </Badge>
            </div>
            <Button variant="gov">Pay Now</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetails;
