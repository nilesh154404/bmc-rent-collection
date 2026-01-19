import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { mockTenants, Tenant } from '@/lib/mockData';
import { toast } from 'sonner';

const TenantManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.propertyNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.eNachStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      header: 'Tenant Name',
      render: (tenant: Tenant) => (
        <div>
          <p className="font-medium">{tenant.name}</p>
          <p className="text-xs text-muted-foreground">{tenant.email}</p>
        </div>
      ),
    },
    {
      key: 'propertyNo',
      header: 'Property No',
      render: (tenant: Tenant) => (
        <div>
          <p className="font-medium text-sm">{tenant.propertyNo}</p>
          <p className="text-xs text-muted-foreground">{tenant.propertyLocation.split(',')[0]}</p>
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
      key: 'eNachStatus',
      header: 'e-NACH Status',
      render: (tenant: Tenant) => (
        <Badge variant={
          tenant.eNachStatus === 'active' ? 'success' :
          tenant.eNachStatus === 'pending' ? 'warning' :
          tenant.eNachStatus === 'rejected' ? 'destructive' : 'inactive'
        }>
          {tenant.eNachStatus === 'not_registered' ? 'Not Registered' : tenant.eNachStatus}
        </Badge>
      ),
    },
    {
      key: 'contractStatus',
      header: 'Contract',
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
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Tenant Management"
        subtitle="Manage all tenants and their property assignments"
        breadcrumbs={[
          { label: 'Home', href: '/admin/dashboard' },
          { label: 'Tenant Management' },
        ]}
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gov">
                <Plus className="w-4 h-4 mr-2" />
                Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Tenant</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Tenant Name</Label>
                  <Input placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="tenant@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="10-digit mobile number" />
                </div>
                <div className="space-y-2">
                  <Label>Assign Property</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p1">BMC/SHOP/2024/006</SelectItem>
                      <SelectItem value="p2">BMC/COMM/2024/007</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contract Start Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Contract End Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Upload Contract Document</Label>
                  <Input type="file" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button variant="gov" onClick={() => { setIsAddDialogOpen(false); toast.success('Tenant added successfully!'); }}>
                  Add Tenant
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">e-NACH Active</SelectItem>
                <SelectItem value="pending">e-NACH Pending</SelectItem>
                <SelectItem value="rejected">e-NACH Rejected</SelectItem>
                <SelectItem value="not_registered">Not Registered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>All Tenants ({filteredTenants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredTenants}
            keyExtractor={(tenant) => tenant.id}
            emptyMessage="No tenants found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantManagement;
