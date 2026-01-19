import React from 'react';
import { Plus, Download, Bell, AlertTriangle, FileWarning, Scale, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { mockNotices, mockTenants, Notice } from '@/lib/mockData';
import { format } from 'date-fns';
import { toast } from 'sonner';

const AdminNotices: React.FC = () => {
  const columns = [
    {
      key: 'tenantName',
      header: 'Tenant',
      render: (notice: Notice) => (
        <div>
          <p className="font-medium">{notice.tenantName}</p>
          <p className="text-xs text-muted-foreground">{notice.propertyNo}</p>
        </div>
      ),
    },
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
          <Badge variant={config.variant} className="gap-1">
            <config.icon className="w-3 h-3" />
            {config.label}
          </Badge>
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button variant="ghost" size="sm">
            <Send className="w-4 h-4 mr-1" />
            Resend
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notices & Eviction Workflow"
        subtitle="Generate and manage tenant notices"
        breadcrumbs={[
          { label: 'Home', href: '/admin/dashboard' },
          { label: 'Notices & Eviction' },
        ]}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="gov">
                <Plus className="w-4 h-4 mr-2" />
                Generate Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Generate New Notice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Tenant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name} - {tenant.propertyNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notice Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select notice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reminder">Payment Reminder</SelectItem>
                      <SelectItem value="overdue">Overdue Notice</SelectItem>
                      <SelectItem value="final_notice">Final Notice</SelectItem>
                      <SelectItem value="lock_seal">Lock & Seal Warning</SelectItem>
                      <SelectItem value="eviction">Eviction Notice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Additional Remarks</Label>
                  <Textarea placeholder="Enter any additional remarks..." />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="gov" onClick={() => toast.success('Notice generated and sent successfully!')}>
                  Generate & Send
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Notice Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle>Notice Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {[
              { step: 1, label: 'Reminder', icon: Bell, days: 'Day 1' },
              { step: 2, label: 'Overdue', icon: AlertTriangle, days: 'Day 15' },
              { step: 3, label: 'Final Notice', icon: FileWarning, days: 'Day 30' },
              { step: 4, label: 'Lock/Seal', icon: Scale, days: 'Day 45' },
              { step: 5, label: 'Eviction', icon: Mail, days: 'Day 60' },
            ].map((item, idx) => (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center min-w-[100px]">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.days}</p>
                </div>
                {idx < 4 && (
                  <div className="flex-1 h-0.5 bg-border min-w-[40px] mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notice Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reminders Sent</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Bell className="w-8 h-8 text-accent/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Notices</p>
                <p className="text-2xl font-bold text-warning">5</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Final Notices</p>
                <p className="text-2xl font-bold text-destructive">2</p>
              </div>
              <FileWarning className="w-8 h-8 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eviction Pending</p>
                <p className="text-2xl font-bold text-destructive">0</p>
              </div>
              <Mail className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notices Table */}
      <Card>
        <CardHeader className="card-header-gov">
          <CardTitle>All Notices</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockNotices}
            keyExtractor={(notice) => notice.id}
            emptyMessage="No notices found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotices;
