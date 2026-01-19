import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Eye, RefreshCw, Download, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatCard from '@/components/common/StatCard';
import { mockENachMandates, ENachMandate, dashboardStats } from '@/lib/mockData';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ENachManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { admin } = dashboardStats;

  const filteredMandates = mockENachMandates.filter((mandate) => {
    const matchesSearch = mandate.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandate.propertyNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mandate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingMandates = mockENachMandates.filter(m => m.status === 'pending');
  const activeMandates = mockENachMandates.filter(m => m.status === 'active');
  const failedMandates = mockENachMandates.filter(m => m.status === 'rejected' || m.status === 'cancelled');

  const columns = [
    {
      key: 'mandateId',
      header: 'Mandate ID',
      render: (mandate: ENachMandate) => (
        <span className="font-mono text-sm">{mandate.mandateId}</span>
      ),
    },
    {
      key: 'tenantName',
      header: 'Tenant',
      render: (mandate: ENachMandate) => (
        <div>
          <p className="font-medium">{mandate.tenantName}</p>
          <p className="text-xs text-muted-foreground">{mandate.propertyNo}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (mandate: ENachMandate) => `₹${mandate.amount.toLocaleString()}`,
    },
    {
      key: 'frequency',
      header: 'Frequency',
      render: (mandate: ENachMandate) => (
        <span className="capitalize">{mandate.frequency}</span>
      ),
    },
    {
      key: 'bankName',
      header: 'Bank',
    },
    {
      key: 'registrationDate',
      header: 'Registration Date',
      render: (mandate: ENachMandate) => format(new Date(mandate.registrationDate), 'dd MMM yyyy'),
    },
    {
      key: 'status',
      header: 'Status',
      render: (mandate: ENachMandate) => {
        const statusConfig = {
          active: { variant: 'success' as const, icon: CheckCircle2 },
          pending: { variant: 'warning' as const, icon: Clock },
          rejected: { variant: 'destructive' as const, icon: XCircle },
          cancelled: { variant: 'inactive' as const, icon: XCircle },
        };
        const config = statusConfig[mandate.status];
        return (
          <Badge variant={config.variant} className="gap-1">
            <config.icon className="w-3 h-3" />
            <span className="capitalize">{mandate.status}</span>
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (mandate: ENachMandate) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          {mandate.status === 'rejected' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => toast.info('Retry mandate registration initiated')}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Debit cycle reports data (simulation)
  const debitReports = [
    { date: '2024-12-05', initiated: 98, successful: 92, failed: 6, amount: 2350000, failureReasons: 'Insufficient funds (4), Account blocked (2)' },
    { date: '2024-11-05', initiated: 95, successful: 89, failed: 6, amount: 2180000, failureReasons: 'Insufficient funds (5), Mandate expired (1)' },
    { date: '2024-10-05', initiated: 92, successful: 87, failed: 5, amount: 2100000, failureReasons: 'Insufficient funds (3), Technical error (2)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="e-NACH Management"
        subtitle="Manage e-NACH mandates and debit cycles"
        breadcrumbs={[
          { label: 'Home', href: '/admin/dashboard' },
          { label: 'e-NACH Management' },
        ]}
        actions={
          <Button variant="gov">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Mandates"
          value={admin.activeMandates}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Pending Approval"
          value={admin.pendingMandates}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Failed/Rejected"
          value={admin.failedMandates}
          icon={XCircle}
          variant="destructive"
        />
        <StatCard
          title="Success Rate"
          value={`${admin.eNachSuccessRate}%`}
          subtitle="Last debit cycle"
          icon={RefreshCw}
          variant="primary"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Mandates</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingMandates.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeMandates.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failedMandates.length})</TabsTrigger>
          <TabsTrigger value="reports">Debit Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {/* Filters */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by tenant or property..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle>All Mandates ({filteredMandates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredMandates}
                keyExtractor={(mandate) => mandate.id}
                emptyMessage="No mandates found"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle>Pending Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={pendingMandates}
                keyExtractor={(mandate) => mandate.id}
                emptyMessage="No pending mandates"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle>Active Mandates</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={activeMandates}
                keyExtractor={(mandate) => mandate.id}
                emptyMessage="No active mandates"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle>Failed / Rejected Mandates</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={failedMandates}
                keyExtractor={(mandate) => mandate.id}
                emptyMessage="No failed mandates"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle>e-NACH Debit Cycle Reports</CardTitle>
              <Badge>Simulation Mode</Badge>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Debit Date</th>
                      <th>Initiated</th>
                      <th>Successful</th>
                      <th>Failed</th>
                      <th>Amount Recovered</th>
                      <th>Failure Reasons</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debitReports.map((report, idx) => (
                      <tr key={idx}>
                        <td className="font-medium">{format(new Date(report.date), 'dd MMM yyyy')}</td>
                        <td>{report.initiated}</td>
                        <td className="text-success font-medium">{report.successful}</td>
                        <td className="text-destructive font-medium">{report.failed}</td>
                        <td className="font-medium">₹{report.amount.toLocaleString()}</td>
                        <td className="text-sm text-muted-foreground">{report.failureReasons}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ENachManagement;
