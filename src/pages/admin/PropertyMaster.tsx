import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { mockProperties, Property } from '@/lib/mockData';
import { toast } from 'sonner';

const PropertyMaster: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredProperties = mockProperties.filter((property) =>
    property.propertyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'propertyNo',
      header: 'Property Number',
      render: (property: Property) => (
        <span className="font-medium">{property.propertyNo}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (property: Property) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{property.location}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'area',
      header: 'Area',
      render: (property: Property) => `${property.area} sq.ft`,
    },
    {
      key: 'rentRate',
      header: 'Rent Rate',
      render: (property: Property) => `₹${property.rentRate.toLocaleString()}/month`,
    },
    {
      key: 'escalationRate',
      header: 'Escalation',
      render: (property: Property) => `${property.escalationRate}% p.a.`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (property: Property) => (
        <Badge variant={property.status === 'occupied' ? 'success' : 'pending'}>
          {property.status}
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Property Master"
        subtitle="Manage all BMC properties and their configurations"
        breadcrumbs={[
          { label: 'Home', href: '/admin/dashboard' },
          { label: 'Property Master' },
        ]}
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gov">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Property Number</Label>
                  <Input placeholder="BMC/SHOP/2024/XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shop">Commercial Shop</SelectItem>
                      <SelectItem value="complex">Commercial Complex</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="land">Open Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Location / Address</Label>
                  <Input placeholder="Full address with zone" />
                </div>
                <div className="space-y-2">
                  <Label>Area (sq.ft)</Label>
                  <Input type="number" placeholder="500" />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Rent (₹)</Label>
                  <Input type="number" placeholder="25000" />
                </div>
                <div className="space-y-2">
                  <Label>Escalation Rate (%)</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit (₹)</Label>
                  <Input type="number" placeholder="150000" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button variant="gov" onClick={() => { setIsAddDialogOpen(false); toast.success('Property added successfully!'); }}>
                  Add Property
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by property number or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>All Properties ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredProperties}
            keyExtractor={(property) => property.id}
            emptyMessage="No properties found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyMaster;
