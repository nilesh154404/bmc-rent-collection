import React from 'react';
import { Download, Bell, AlertTriangle, FileWarning, Scale, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { mockNotices, Notice } from '@/lib/mockData';
import { format } from 'date-fns';

const TenantNotices: React.FC = () => {
  const columns = [
    {
      key: 'type',
      header: 'Notice Type',
      render: (notice: Notice) => {
        const typeConfig = {
          reminder: { icon: Bell, label: 'Reminder', variant: 'pending' as const },
          overdue: { icon: AlertTriangle, label: 'Overdue', variant: 'warning' as const },
          final_notice: { icon: FileWarning, label: 'Final Notice', variant: 'destructive' as const },
          lock_seal: { icon: Scale, label: 'Lock/Seal', variant: 'destructive' as const },
          eviction: { icon: Mail, label: 'Eviction', variant: 'destructive' as const },
        };
        const config = typeConfig[notice.type];
        return (
          <div className="flex items-center gap-2">
            <config.icon className="w-4 h-4" />
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        );
      },
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      render: (notice: Notice) => format(new Date(notice.issueDate), 'dd MMM yyyy'),
    },
    {
      key: 'serveDate',
      header: 'Serve Date',
      render: (notice: Notice) => notice.serveDate ? format(new Date(notice.serveDate), 'dd MMM yyyy') : '-',
    },
    {
      key: 'acknowledged',
      header: 'Status',
      render: (notice: Notice) => (
        <Badge variant={notice.acknowledged ? 'success' : 'warning'}>
          {notice.acknowledged ? 'Acknowledged' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <Button variant="ghost" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
      ),
    },
  ];

  // For demo, show notices for tenant
  const tenantNotices = mockNotices.slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notices & Communications"
        subtitle="View all notices and communications from BMC"
        breadcrumbs={[
          { label: 'Home', href: '/tenant/dashboard' },
          { label: 'Notices' },
        ]}
      />

      {/* Active Notices Alert */}
      {tenantNotices.some(n => !n.acknowledged) && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-foreground">You have pending notices</p>
            <p className="text-sm text-muted-foreground">
              Please review and acknowledge the notices below.
            </p>
          </div>
        </div>
      )}

      {/* Notices Table */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>All Notices</CardTitle>
        </CardHeader>
        <CardContent>
          {tenantNotices.length > 0 ? (
            <DataTable
              columns={columns}
              data={tenantNotices}
              keyExtractor={(notice) => notice.id}
              emptyMessage="No notices found"
            />
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Notices</h3>
              <p className="text-muted-foreground">You don't have any notices at the moment.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notice Types Info */}
      <Card>
        <CardHeader>
          <CardTitle>Notice Types Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-accent" />
                <span className="font-medium">Reminder</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Friendly reminder about upcoming payment due dates.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span className="font-medium">Overdue Notice</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Notice for payments that are past due date.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileWarning className="w-5 h-5 text-destructive" />
                <span className="font-medium">Final Notice</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Last warning before legal action is initiated.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantNotices;
