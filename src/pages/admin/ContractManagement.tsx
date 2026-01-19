import React from 'react';
import { Download, FileText, Upload, Eye, Edit, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { mockTenants, Tenant } from '@/lib/mockData';
import { format, differenceInDays } from 'date-fns';

const ContractManagement: React.FC = () => {
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
      key: 'contractStartDate',
      header: 'Start Date',
      render: (tenant: Tenant) => format(new Date(tenant.contractStartDate), 'dd MMM yyyy'),
    },
    {
      key: 'contractEndDate',
      header: 'End Date',
      render: (tenant: Tenant) => format(new Date(tenant.contractEndDate), 'dd MMM yyyy'),
    },
    {
      key: 'daysRemaining',
      header: 'Days Remaining',
      render: (tenant: Tenant) => {
        const days = differenceInDays(new Date(tenant.contractEndDate), new Date());
        return (
          <span className={days < 90 ? 'text-warning font-medium' : days < 0 ? 'text-destructive font-medium' : ''}>
            {days > 0 ? `${days} days` : 'Expired'}
          </span>
        );
      },
    },
    {
      key: 'rentAmount',
      header: 'Monthly Rent',
      render: (tenant: Tenant) => `₹${tenant.rentAmount.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (tenant: Tenant) => (
        <Badge variant={
          tenant.contractStatus === 'active' ? 'success' :
          tenant.contractStatus === 'expiring_soon' ? 'warning' : 'destructive'
        }>
          {tenant.contractStatus.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const expiringContracts = mockTenants.filter(t => t.contractStatus === 'expiring_soon' || t.contractStatus === 'expired');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Contract Management"
        subtitle="Manage lease agreements and contract renewals"
        breadcrumbs={[
          { label: 'Home', href: '/admin/dashboard' },
          { label: 'Contract Management' },
        ]}
        actions={
          <Button variant="gov">
            <Upload className="w-4 h-4 mr-2" />
            Upload Contract
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
                <p className="text-2xl font-bold text-success">
                  {mockTenants.filter(t => t.contractStatus === 'active').length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-warning">
                  {mockTenants.filter(t => t.contractStatus === 'expiring_soon').length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-warning/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-destructive">
                  {mockTenants.filter(t => t.contractStatus === 'expired').length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Contracts Alert */}
      {expiringContracts.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="card-header-gov">
            <CardTitle className="text-warning flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Contracts Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={expiringContracts}
              keyExtractor={(tenant) => tenant.id}
              emptyMessage="No contracts expiring soon"
            />
          </CardContent>
        </Card>
      )}

      {/* All Contracts */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockTenants}
            keyExtractor={(tenant) => tenant.id}
            emptyMessage="No contracts found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractManagement;
