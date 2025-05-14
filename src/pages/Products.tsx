
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

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  
  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error loading products data:', error);
      }
    } else {
      // Initialize with sample data
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Widget',
          sku: 'WDG-001',
          category: 'Widgets',
          price: 29.99,
          cost: 12.50,
          stock: 42,
        },
        {
          id: '2',
          name: 'Deluxe Gadget',
          sku: 'GDG-002',
          category: 'Gadgets',
          price: 49.99,
          cost: 25.00,
          stock: 7,
        },
        {
          id: '3',
          name: 'Basic Component',
          sku: 'CMP-003',
          category: 'Components',
          price: 9.99,
          cost: 3.25,
          stock: 0,
        },
        {
          id: '4',
          name: 'Pro Tool',
          sku: 'TL-004',
          category: 'Tools',
          price: 79.99,
          cost: 45.00,
          stock: 15,
        },
      ];
      setProducts(sampleProducts);
      localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
  }, []);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate profit margin
  const calculateMargin = (price: number, cost: number) => {
    return ((price - cost) / price * 100).toFixed(2);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Button>Add New Product</Button>
      </div>
      
      <div className="mb-6">
        <Input 
          type="text" 
          placeholder="Search products by name, SKU, or category..."
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
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>${product.cost.toFixed(2)}</TableCell>
                  <TableCell>{calculateMargin(product.price, product.cost)}%</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10 ? 'bg-green-100 text-green-600' : 
                      product.stock > 0 ? 'bg-amber-100 text-amber-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="mr-1">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No products found. Please add some products or adjust your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Products;
