
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  hireDate: string;
  lastLogin: string;
}

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Load employees from localStorage on component mount
  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees));
      } catch (error) {
        console.error('Error loading employees data:', error);
      }
    } else {
      // Initialize with sample data
      const sampleEmployees: Employee[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex.johnson@quickpos.com',
          role: 'Manager',
          department: 'Sales',
          status: 'Active',
          hireDate: '2022-03-15',
          lastLogin: '2024-05-14 08:30'
        },
        {
          id: '2',
          name: 'Maria Garcia',
          email: 'maria.garcia@quickpos.com',
          role: 'Cashier',
          department: 'Operations',
          status: 'Active',
          hireDate: '2023-01-10',
          lastLogin: '2024-05-13 17:22'
        },
        {
          id: '3',
          name: 'Samuel Lee',
          email: 'samuel.lee@quickpos.com',
          role: 'Inventory Specialist',
          department: 'Warehouse',
          status: 'On Leave',
          hireDate: '2022-08-05',
          lastLogin: '2024-05-10 12:15'
        },
        {
          id: '4',
          name: 'Taylor Brown',
          email: 'taylor.brown@quickpos.com',
          role: 'Customer Support',
          department: 'Service',
          status: 'Inactive',
          hireDate: '2023-05-22',
          lastLogin: '2024-04-30 09:45'
        },
      ];
      setEmployees(sampleEmployees);
      localStorage.setItem('employees', JSON.stringify(sampleEmployees));
    }
  }, []);
  
  // Filter employees based on search term and status
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-600';
      case 'On Leave':
        return 'bg-amber-100 text-amber-600';
      case 'Inactive':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
        <Button>Add Employee</Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input 
          type="text" 
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on leave">On Leave</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials(employee.name)}`} />
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusClass(employee.status)}`}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.hireDate}</TableCell>
                  <TableCell>{employee.lastLogin}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="mr-1">Edit</Button>
                    <Button variant="ghost" size="sm">Profile</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No employees found. Please add employees or adjust your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Employees;
