
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  visits: number;
  joinedDate: string;
  type: 'Regular' | 'VIP' | 'New';
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  // Load customers from localStorage on component mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (error) {
        console.error('Error loading customers data:', error);
      }
    } else {
      // Initialize with sample data
      const sampleCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          totalSpent: 1245.50,
          visits: 12,
          joinedDate: '2023-05-15',
          type: 'VIP'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '(555) 987-6543',
          totalSpent: 450.75,
          visits: 5,
          joinedDate: '2023-08-22',
          type: 'Regular'
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '(555) 555-5555',
          totalSpent: 125.25,
          visits: 2,
          joinedDate: '2024-02-10',
          type: 'New'
        },
        {
          id: '4',
          name: 'Sarah Williams',
          email: 'sarah.williams@example.com',
          phone: '(555) 222-3333',
          totalSpent: 975.00,
          visits: 8,
          joinedDate: '2023-06-30',
          type: 'Regular'
        },
      ];
      setCustomers(sampleCustomers);
      localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    }
  }, []);
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  // Get customer type class for badge
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'bg-purple-100 text-purple-600';
      case 'Regular':
        return 'bg-blue-100 text-blue-600';
      case 'New':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <Button>Add New Customer</Button>
      </div>
      
      <div className="mb-6">
        <Input 
          type="text" 
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>Customer Since</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{customer.visits}</TableCell>
                  <TableCell>{customer.joinedDate}</TableCell>
                  <TableCell>
                    <Badge className={`${getTypeClass(customer.type)}`}>
                      {customer.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="mr-1">Profile</Button>
                    <Button variant="ghost" size="sm">History</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No customers found. Please add some customers or adjust your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;
