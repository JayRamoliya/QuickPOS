
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

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  // Load items from localStorage on component mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      try {
        setInventory(JSON.parse(savedInventory));
      } catch (error) {
        console.error('Error loading inventory data:', error);
      }
    } else {
      // Initialize with sample data
      const sampleInventory: InventoryItem[] = [
        {
          id: '1',
          name: 'Widget A',
          category: 'Widgets',
          quantity: 42,
          status: 'In Stock',
          lastUpdated: new Date().toISOString().split('T')[0]
        },
        {
          id: '2',
          name: 'Gadget B',
          category: 'Gadgets',
          quantity: 7,
          status: 'Low Stock',
          lastUpdated: new Date().toISOString().split('T')[0]
        },
        {
          id: '3',
          name: 'Component C',
          category: 'Components',
          quantity: 0,
          status: 'Out of Stock',
          lastUpdated: new Date().toISOString().split('T')[0]
        },
        {
          id: '4',
          name: 'Tool D',
          category: 'Tools',
          quantity: 15,
          status: 'In Stock',
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      ];
      setInventory(sampleInventory);
      localStorage.setItem('inventory', JSON.stringify(sampleInventory));
    }
  }, []);
  
  // Filter inventory based on search term
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get status class for coloring
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'text-green-600 bg-green-100';
      case 'Low Stock':
        return 'text-amber-600 bg-amber-100';
      case 'Out of Stock':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <Button>Add New Item</Button>
      </div>
      
      <div className="mb-6">
        <Input 
          type="text" 
          placeholder="Search inventory by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No inventory items found. Please add some items or adjust your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Inventory;
