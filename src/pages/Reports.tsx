
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 5000 },
  { name: 'Feb', revenue: 6200 },
  { name: 'Mar', revenue: 8100 },
  { name: 'Apr', revenue: 7500 },
  { name: 'May', revenue: 9500 },
  { name: 'Jun', revenue: 11000 },
  { name: 'Jul', revenue: 10200 },
];

const categoryData = [
  { name: 'Electronics', sales: 12500 },
  { name: 'Clothing', sales: 8700 },
  { name: 'Food', sales: 15200 },
  { name: 'Books', sales: 6300 },
  { name: 'Home', sales: 9800 },
];

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('7d');
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export PDF</Button>
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>
      
      <div className="flex justify-end mb-6">
        <Tabs defaultValue="7d" onValueChange={setReportPeriod} value={reportPeriod}>
          <TabsList>
            <TabsTrigger value="7d">Last 7 days</TabsTrigger>
            <TabsTrigger value="30d">Last 30 days</TabsTrigger>
            <TabsTrigger value="3m">Last 3 months</TabsTrigger>
            <TabsTrigger value="12m">Last 12 months</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>For the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$57,500</div>
            <p className="text-sm text-green-600">↑ 12% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Orders Processed</CardTitle>
            <CardDescription>For the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,283</div>
            <p className="text-sm text-green-600">↑ 8% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Order Value</CardTitle>
            <CardDescription>For the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$44.82</div>
            <p className="text-sm text-green-600">↑ 3% from previous period</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue for the last 7 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Top performing categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Legend />
                <Bar dataKey="sales" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Report Notes</h2>
        <p className="mb-4">
          Data is saved for 30 days and is refreshed daily at midnight. Reports can be exported in multiple formats for accounting and analysis purposes.
        </p>
        <p>
          For custom reports, please use the filters above or contact the system administrator for advanced reporting needs.
        </p>
      </div>
    </div>
  );
};

export default Reports;
