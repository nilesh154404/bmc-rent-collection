import React from 'react';
import { 
  Users, 
  Building2, 
  IndianRupee, 
  Banknote, 
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import { dashboardStats, mockTenants, mockENachMandates } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { admin, collectionByZone, monthlyTrend } = dashboardStats;

  const mandateStatusData = [
    { name: 'Active', value: admin.activeMandates, color: 'hsl(var(--success))' },
    { name: 'Pending', value: admin.pendingMandates, color: 'hsl(var(--warning))' },
    { name: 'Failed', value: admin.failedMandates, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of rent collection and tenant management"
        breadcrumbs={[
          { label: 'Home', href: '/admin/dashboard' },
          { label: 'Dashboard' },
        ]}
      />

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Tenants"
          value={admin.totalTenants}
          subtitle="Across all zones"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Today's Collection"
          value={`₹${(admin.totalCollectedToday / 100000).toFixed(1)}L`}
          subtitle={`${new Date().toLocaleDateString()}`}
          icon={IndianRupee}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Monthly Collection"
          value={`₹${(admin.totalCollectedMonth / 100000).toFixed(1)}L`}
          subtitle="December 2024"
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          title="Total Arrears"
          value={`₹${(admin.totalArrears / 100000).toFixed(1)}L`}
          subtitle="Pending recovery"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* e-NACH Status & Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* e-NACH Summary */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              e-NACH Mandates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Active Mandates</span>
                </div>
                <span className="font-bold text-lg">{admin.activeMandates}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-warning" />
                  <span>Pending Approval</span>
                </div>
                <span className="font-bold text-lg">{admin.pendingMandates}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span>Failed/Rejected</span>
                </div>
                <span className="font-bold text-lg">{admin.failedMandates}</span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Debit Success Rate</span>
                  <span className="font-bold text-success">{admin.eNachSuccessRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Expiry */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Expiring Contracts
            </CardTitle>
            <Badge variant="warning">{admin.expiringContracts} This Month</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTenants.filter(t => t.contractStatus === 'expiring_soon').slice(0, 3).map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{tenant.name}</p>
                    <p className="text-xs text-muted-foreground">{tenant.propertyNo}</p>
                  </div>
                  <Badge variant="warning">Expiring</Badge>
                </div>
              ))}
              {mockTenants.filter(t => t.contractStatus === 'expiring_soon').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No contracts expiring soon</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* e-NACH Distribution Chart */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle>Mandate Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mandateStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mandateStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {mandateStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Trend */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle>Collection Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₹${(value / 100000).toFixed(2)}L`, '']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="collection" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Collection"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="arrears" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    name="Arrears"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Zone-wise Collection */}
        <Card>
          <CardHeader className="card-header-gov">
            <CardTitle>Zone-wise Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionByZone}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="zone" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₹${(value / 100000).toFixed(2)}L`, 'Collection']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>Recent Tenant Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Property No</th>
                  <th>Outstanding</th>
                  <th>e-NACH Status</th>
                  <th>Contract Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTenants.slice(0, 5).map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="font-medium">{tenant.name}</td>
                    <td>{tenant.propertyNo}</td>
                    <td className={tenant.outstandingAmount > 0 ? 'text-destructive font-medium' : 'text-success'}>
                      ₹{tenant.outstandingAmount.toLocaleString()}
                    </td>
                    <td>
                      <Badge variant={
                        tenant.eNachStatus === 'active' ? 'success' :
                        tenant.eNachStatus === 'pending' ? 'warning' :
                        tenant.eNachStatus === 'rejected' ? 'destructive' : 'inactive'
                      }>
                        {tenant.eNachStatus === 'not_registered' ? 'Not Registered' : tenant.eNachStatus}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={
                        tenant.contractStatus === 'active' ? 'success' :
                        tenant.contractStatus === 'expiring_soon' ? 'warning' : 'destructive'
                      }>
                        {tenant.contractStatus.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
