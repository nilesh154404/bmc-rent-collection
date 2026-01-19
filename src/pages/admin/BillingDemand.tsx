import React from 'react';
import { Play, Download, Calculator, FileSpreadsheet, IndianRupee, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { mockTenants, Tenant } from '@/lib/mockData';
import { toast } from 'sonner';

const BillingDemand: React.FC = () => {
  const columns = [
    {
      key: 'name',
      header: 'Tenant',
      render: (tenant: Tenant) => (
        <div>
          <p className="font-medium">{tenant.name}</p>
          <p className="text-xs text-muted-foreground">{tenant.propertyNo}</p>
        </div>
      ),
    },
    {
      key: 'rentAmount',
      header: 'Monthly Rent',
      render: (tenant: Tenant) => `₹${tenant.rentAmount.toLocaleString()}`,
    },
    {
      key: 'outstandingAmount',
      header: 'Outstanding',
      render: (tenant: Tenant) => (
        <span className={tenant.outstandingAmount > 0 ? 'text-destructive font-medium' : 'text-success'}>
          ₹{tenant.outstandingAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'arrears',
      header: 'Arrears (Months)',
      render: (tenant: Tenant) => {
        const months = Math.floor(tenant.outstandingAmount / tenant.rentAmount);
        return (
          <Badge variant={months > 2 ? 'destructive' : months > 0 ? 'warning' : 'success'}>
            {months} month{months !== 1 ? 's' : ''}
          </Badge>
        );
      },
    },
    {
      key: 'penalty',
      header: 'Penalty (2%)',
      render: (tenant: Tenant) => {
        const penalty = tenant.outstandingAmount > tenant.rentAmount ? Math.round(tenant.outstandingAmount * 0.02) : 0;
        return penalty > 0 ? `₹${penalty.toLocaleString()}` : '-';
      },
    },
    {
      key: 'totalDue',
      header: 'Total Due',
      render: (tenant: Tenant) => {
        const penalty = tenant.outstandingAmount > tenant.rentAmount ? Math.round(tenant.outstandingAmount * 0.02) : 0;
        const total = tenant.outstandingAmount + penalty;
        return <span className="font-bold">₹{total.toLocaleString()}</span>;
      },
    },
  ];

  const totalArrears = mockTenants.reduce((sum, t) => sum + t.outstandingAmount, 0);
  const tenantsWithArrears = mockTenants.filter(t => t.outstandingAmount > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Billing & Demand Generation"
        subtitle="Generate demands and manage arrears"
        breadcrumbs={[
          { label: 'Home', href: '/admin/dashboard' },
          { label: 'Billing & Demand' },
        ]}
        actions={
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Register
            </Button>
            <Button variant="gov" onClick={() => toast.success('Bulk demand generation initiated')}>
              <Play className="w-4 h-4 mr-2" />
              Generate Demands
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Arrears</p>
                <p className="text-2xl font-bold text-destructive">₹{(totalArrears / 100000).toFixed(2)}L</p>
              </div>
              <IndianRupee className="w-10 h-10 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tenants with Arrears</p>
                <p className="text-2xl font-bold text-warning">{tenantsWithArrears.length}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-warning/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Month Demand</p>
                <p className="text-2xl font-bold">₹{(mockTenants.reduce((sum, t) => sum + t.rentAmount, 0) / 100000).toFixed(2)}L</p>
              </div>
              <Calculator className="w-10 h-10 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Penalty</p>
                <p className="text-2xl font-bold">₹{(totalArrears * 0.02 / 1000).toFixed(1)}K</p>
              </div>
              <FileSpreadsheet className="w-10 h-10 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>Bulk Demand Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Billing Period</label>
              <Select defaultValue="dec2024">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dec2024">December 2024</SelectItem>
                  <SelectItem value="jan2025">January 2025</SelectItem>
                  <SelectItem value="feb2025">February 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Zone</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="zone1">Zone 1</SelectItem>
                  <SelectItem value="zone2">Zone 2</SelectItem>
                  <SelectItem value="zone3">Zone 3</SelectItem>
                  <SelectItem value="zone4">Zone 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="gov" onClick={() => toast.success('Demand generation completed for all tenants')}>
              <Play className="w-4 h-4 mr-2" />
              Generate All Demands
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Arrears Table */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>Arrears Summary</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockTenants}
            keyExtractor={(tenant) => tenant.id}
            emptyMessage="No billing data found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingDemand;
