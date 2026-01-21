import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Eye, MapPin, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Property } from '@/lib/mockData';
import { toast } from 'sonner';

interface PropertyFormData {
  propertyNo: string;
  location: string;
  area: number;
  category: string;
  rentRate: number;
  escalationRate: number;
  securityDeposit: number;
  status: string;
  propertyType: string;
  zone: string;
  ward: string;
}

const PropertyMaster: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyNo: '',
    location: '',
    area: 0,
    category: '',
    rentRate: 0,
    escalationRate: 0,
    securityDeposit: 0,
    status: 'vacant',
    propertyType: 'rent',
    zone: '',
    ward: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/properties');
      const data = await response.json();
      setProperties(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
      setLoading(false);
    }
  };

  const handleAddProperty = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newProperty = await response.json();
        setProperties([...properties, newProperty]);
        setIsAddDialogOpen(false);
        toast.success('Property added successfully!');
        // Reset form
        setFormData({
          propertyNo: '',
          location: '',
          area: 0,
          category: '',
          rentRate: 0,
          escalationRate: 0,
          securityDeposit: 0,
          status: 'vacant',
          propertyType: 'rent',
          zone: '',
          ward: ''
        });
      } else {
        toast.error('Failed to add property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Error adding property');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProperties(properties.filter(p => p.id !== id));
        toast.success('Property deleted successfully!');
      } else {
        toast.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  const filteredProperties = properties.filter((property) =>
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
      render: (property: Property) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => handleDeleteProperty(property.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

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
                  <Input 
                    placeholder="BMC/SHOP/2024/XXX" 
                    value={formData.propertyNo}
                    onChange={(e) => setFormData({...formData, propertyNo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Commercial Shop">Commercial Shop</SelectItem>
                      <SelectItem value="Commercial Complex">Commercial Complex</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Open Land">Open Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Location / Address</Label>
                  <Input 
                    placeholder="Full address with zone" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zone</Label>
                  <Input 
                    placeholder="Zone 1" 
                    value={formData.zone}
                    onChange={(e) => setFormData({...formData, zone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ward</Label>
                  <Input 
                    placeholder="Ward 45" 
                    value={formData.ward}
                    onChange={(e) => setFormData({...formData, ward: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Area (sq.ft)</Label>
                  <Input 
                    type="number" 
                    placeholder="500" 
                    value={formData.area || ''}
                    onChange={(e) => setFormData({...formData, area: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Rent (₹)</Label>
                  <Input 
                    type="number" 
                    placeholder="25000" 
                    value={formData.rentRate || ''}
                    onChange={(e) => setFormData({...formData, rentRate: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Escalation Rate (%)</Label>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    value={formData.escalationRate || ''}
                    onChange={(e) => setFormData({...formData, escalationRate: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit (₹)</Label>
                  <Input 
                    type="number" 
                    placeholder="150000" 
                    value={formData.securityDeposit || ''}
                    onChange={(e) => setFormData({...formData, securityDeposit: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select 
                    value={formData.propertyType}
                    onValueChange={(value) => setFormData({...formData, propertyType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button variant="gov" onClick={handleAddProperty}>
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
