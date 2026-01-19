import React from 'react';
import { Download, BarChart3, PieChart, TrendingUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import { dashboardStats } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const Reports: React.FC = () => {
  const { collectionByZone, monthlyTrend } = dashboardStats;

  const paymentModeData = [
    { name: 'e-NACH', value: 65, color: 'hsl(var(--success))' },
    { name: 'Online', value: 25, color: 'hsl(var(--primary))' },
    { name: 'Cash', value: 8, color: 'hsl(var(--warning))' },
    { name: 'Cheque', value: 2, color: 'hsl(var(--muted-foreground))' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports & Analytics"
        subtitle="View collection reports and analytics"
        breadcrumbs={[
          { label: 'Home', href: '/admin/dashboard' },
          { label: 'Reports' },
        ]}
        actions={
          <Button variant="gov">
            <Download className="w-4 h-4 mr-2" />
            Export All Reports
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Period</label>
              <Select defaultValue="2024">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Zone</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="zone1">Zone 1</SelectItem>
                  <SelectItem value="zone2">Zone 2</SelectItem>
                  <SelectItem value="zone3">Zone 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Report Type</label>
              <Select defaultValue="collection">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collection">Collection Summary</SelectItem>
                  <SelectItem value="arrears">Arrears Report</SelectItem>
                  <SelectItem value="enach">e-NACH Report</SelectItem>
                  <SelectItem value="reconciliation">Reconciliation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="collection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="zone">Zone-wise</TabsTrigger>
          <TabsTrigger value="mode">Payment Mode</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="collection">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="card-header-gov">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Collection Trend
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-80">
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
                      <Line type="monotone" dataKey="collection" stroke="hsl(var(--success))" strokeWidth={2} name="Collection" />
                      <Line type="monotone" dataKey="arrears" stroke="hsl(var(--destructive))" strokeWidth={2} name="Arrears" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="card-header-gov">
                <CardTitle>Collection Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                    <p className="text-sm text-muted-foreground">Total Collected (YTD)</p>
                    <p className="text-3xl font-bold text-success">₹9.5 Cr</p>
                  </div>
                  <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                    <p className="text-sm text-muted-foreground">Total Arrears</p>
                    <p className="text-3xl font-bold text-destructive">₹32.5 L</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground">Collection Rate</p>
                    <p className="text-3xl font-bold text-primary">96.7%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zone">
          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Zone-wise Collection
              </CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Excel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80">
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
        </TabsContent>

        <TabsContent value="mode">
          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Payment Mode Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-12">
                <div className="h-64 w-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={paymentModeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {paymentModeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {paymentModeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium w-20">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation">
          <Card>
            <CardHeader className="card-header-gov">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Daily Reconciliation Report
              </CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total Transactions</th>
                      <th>e-NACH Debits</th>
                      <th>Online Payments</th>
                      <th>Cash/Cheque</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium">11 Dec 2024</td>
                      <td>45</td>
                      <td>32</td>
                      <td>10</td>
                      <td>3</td>
                      <td className="font-bold">₹4,25,000</td>
                      <td><span className="status-badge status-active">Reconciled</span></td>
                    </tr>
                    <tr>
                      <td className="font-medium">10 Dec 2024</td>
                      <td>52</td>
                      <td>38</td>
                      <td>12</td>
                      <td>2</td>
                      <td className="font-bold">₹5,10,000</td>
                      <td><span className="status-badge status-active">Reconciled</span></td>
                    </tr>
                    <tr>
                      <td className="font-medium">09 Dec 2024</td>
                      <td>48</td>
                      <td>35</td>
                      <td>11</td>
                      <td>2</td>
                      <td className="font-bold">₹4,80,000</td>
                      <td><span className="status-badge status-active">Reconciled</span></td>
                    </tr>
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

export default Reports;
