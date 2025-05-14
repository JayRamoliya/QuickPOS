
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, Users, ShoppingBag, CreditCard, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

// Import our charting components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const { currentUser } = useAuth();

  // Sample data for the charts
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 4500 },
    { name: 'Fri', sales: 6000 },
    { name: 'Sat', sales: 7000 },
    { name: 'Sun', sales: 4800 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35 },
    { name: 'Clothing', value: 25 },
    { name: 'Food', value: 20 },
    { name: 'Books', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Welcome message with time-based greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {getGreeting()}, {currentUser?.name.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your store today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Sales" 
          value="$12,426.75"
          description="Daily Sales"
          trend={8.2}
          trendLabel="from yesterday"
          icon={<CreditCard className="h-5 w-5 text-pos-blue" />}
          color="blue"
        />
        
        <StatCard 
          title="Customers"
          value="573" 
          description="Total Customers"
          trend={-2.3}
          trendLabel="from last week" 
          icon={<Users className="h-5 w-5 text-pos-indigo" />}
          color="indigo"
        />
        
        <StatCard 
          title="Products"
          value="248" 
          description="In Stock"
          trend={0}
          trendLabel="no change" 
          icon={<Tag className="h-5 w-5 text-pos-green" />}
          color="green"
        />
        
        <StatCard 
          title="Low Stock"
          value="24" 
          description="Items to reorder"
          trend={12.5}
          trendLabel="since last week" 
          icon={<ShoppingBag className="h-5 w-5 text-red-500" />}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>Sales performance over the past week</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Sales']}
                    contentStyle={{ borderRadius: '6px' }}
                  />
                  <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of sales by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your most recent sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left font-medium text-gray-500 p-2">Transaction ID</th>
                  <th className="text-left font-medium text-gray-500 p-2">Customer</th>
                  <th className="text-left font-medium text-gray-500 p-2">Date</th>
                  <th className="text-left font-medium text-gray-500 p-2">Amount</th>
                  <th className="text-left font-medium text-gray-500 p-2">Status</th>
                  <th className="text-left font-medium text-gray-500 p-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 text-sm text-gray-600">#{tx.id}</td>
                    <td className="p-2 text-sm text-gray-800">{tx.customer}</td>
                    <td className="p-2 text-sm text-gray-600">{tx.date}</td>
                    <td className="p-2 text-sm font-medium">${tx.amount}</td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-2 text-sm text-gray-600">{tx.payment}</td>
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

// Helper function to get time-based greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

// Helper function to render custom labels in pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Helper function for styling status badges
function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'refunded':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Stat card component
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'indigo' | 'red';
}

const StatCard = ({ title, value, description, trend, trendLabel, icon, color }: StatCardProps) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-pos-blue';
      case 'green': return 'bg-green-50 text-pos-green';
      case 'indigo': return 'bg-indigo-50 text-pos-indigo';
      case 'red': return 'bg-red-50 text-red-500';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className={`p-2 rounded-md ${getColorClass()}`}>
            {icon}
          </div>
        </div>
        
        {trend !== 0 && (
          <div className="mt-4 flex items-center text-xs">
            {trend > 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(trend)}%
            </span>
            <span className="ml-1 text-gray-500">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Sample recent transactions data
const recentTransactions = [
  { 
    id: '34523', 
    customer: 'John Smith', 
    date: 'May 14, 2025 09:32 AM', 
    amount: '86.45', 
    status: 'Completed', 
    payment: 'Credit Card' 
  },
  { 
    id: '34522', 
    customer: 'Sarah Johnson', 
    date: 'May 14, 2025 08:47 AM', 
    amount: '124.90', 
    status: 'Completed', 
    payment: 'Cash' 
  },
  { 
    id: '34521', 
    customer: 'Michael Brown', 
    date: 'May 14, 2025 08:12 AM', 
    amount: '42.15', 
    status: 'Pending', 
    payment: 'UPI' 
  },
  { 
    id: '34520', 
    customer: 'Emma Wilson', 
    date: 'May 13, 2025 05:41 PM', 
    amount: '215.00', 
    status: 'Completed', 
    payment: 'Credit Card' 
  },
  { 
    id: '34519', 
    customer: 'Robert Garcia', 
    date: 'May 13, 2025 04:23 PM', 
    amount: '62.30', 
    status: 'Refunded', 
    payment: 'Wallet' 
  },
];

export default Dashboard;
