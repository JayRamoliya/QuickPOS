
import React, { useState, useEffect } from 'react';
import { Barcode, Search, ShoppingCart, X, CreditCard, Wallet, DollarSign, QrCode, Receipt } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Mock product data
const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
  id: `prod-${i+1}`,
  name: `Product ${i+1}`,
  price: parseFloat((Math.random() * 50 + 10).toFixed(2)),
  image: `https://source.unsplash.com/100x100/?product&sig=${i}`,
  category: ['Electronics', 'Clothing', 'Food', 'Beverages', 'Other'][Math.floor(Math.random() * 5)],
  stock: Math.floor(Math.random() * 50) + 1
}));

// Mock categories
const productCategories = ['All', 'Electronics', 'Clothing', 'Food', 'Beverages', 'Other'];

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  // Filter products based on search term and active category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.07; // 7% tax rate
  const total = subtotal + tax;

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return currentCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...currentCart, { 
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image
        }];
      }
    });
    
    toast.success(`Added ${product.name} to cart`);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== itemId));
  };

  // Update quantity of item in cart
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(currentCart => 
      currentCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    toast.info('Cart has been cleared');
  };

  // Handle barcode/QR scan
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barcodeInput.trim()) return;
    
    // Mock barcode scan - in reality, this would query a database
    const scannedProduct = products.find(p => p.id === `prod-${barcodeInput}`);
    
    if (scannedProduct) {
      addToCart(scannedProduct);
      toast.success(`Scanned: ${scannedProduct.name}`);
    } else {
      toast.error('Product not found');
    }
    
    setBarcodeInput('');
  };

  // Handle payment processing
  const processPayment = (paymentMethod: string) => {
    if (parseFloat(paymentAmount) < total) {
      toast.error('Payment amount cannot be less than total');
      return;
    }
    
    const change = parseFloat(paymentAmount) - total;
    
    toast.success(`Payment successful! Change: $${change.toFixed(2)}`);
    setShowPaymentModal(false);
    setPaymentAmount('');
    setCart([]);
    
    // In a real app, you'd save the transaction to a database here
  };

  // Handle opening payment modal with validation
  const openPaymentModal = () => {
    if (cart.length === 0) {
      toast.error('Cannot checkout with an empty cart');
      return;
    }
    
    setShowPaymentModal(true);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Products section */}
      <div className="flex-1 flex flex-col overflow-hidden pr-4">
        {/* Search and barcode section */}
        <div className="mb-4 flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text"
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <form onSubmit={handleBarcodeSubmit} className="flex">
            <div className="relative">
              <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="text"
                placeholder="Scan barcode..." 
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="pl-10 w-40"
              />
            </div>
            <Button type="submit" variant="secondary" className="ml-2">
              <QrCode size={18} />
            </Button>
          </form>
        </div>

        {/* Categories */}
        <div className="mb-4 flex overflow-x-auto pb-2">
          {productCategories.map(category => (
            <Button 
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="mr-2 whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => addToCart(product)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="font-bold text-pos-blue">${product.price.toFixed(2)}</p>
                  <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-8">
              <Search size={48} strokeWidth={1.5} />
              <p className="mt-4">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart section */}
      <div className="w-80 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center">
              <ShoppingCart className="mr-2" size={20} />
              Cart
            </h2>
            <Button variant="outline" size="sm" onClick={clearCart}>
              Clear
            </Button>
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart size={48} strokeWidth={1.5} />
              <p className="mt-4">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex border-b pb-3 border-gray-100 relative group">
                  <div className="flex-shrink-0 w-14 h-14 rounded overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium truncate">{item.name}</h3>
                    <p className="text-sm text-pos-blue font-bold">${item.price.toFixed(2)}</p>
                    
                    <div className="mt-1 flex items-center">
                      <button 
                        className="w-6 h-6 flex items-center justify-center rounded border"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button 
                        className="w-6 h-6 flex items-center justify-center rounded border"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart total */}
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax (7%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4"
            onClick={openPaymentModal}
            disabled={cart.length === 0}
          >
            Proceed to Payment
          </Button>
        </div>
      </div>

      {/* Payment modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
            <DialogDescription>
              Total amount: ${total.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="cash">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="cash">
                <DollarSign size={16} className="mr-1" />
                Cash
              </TabsTrigger>
              <TabsTrigger value="card">
                <CreditCard size={16} className="mr-1" />
                Card
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet size={16} className="mr-1" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="upi">
                <QrCode size={16} className="mr-1" />
                UPI
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cash" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Received</label>
                <Input 
                  type="number" 
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[20, 50, 100].map(amount => (
                  <Button 
                    key={amount}
                    variant="outline" 
                    onClick={() => setPaymentAmount(amount.toString())}
                  >
                    ${amount}
                  </Button>
                ))}
                
                {[total, Math.ceil(total)].map((amount, i) => (
                  <Button 
                    key={i}
                    variant="outline" 
                    onClick={() => setPaymentAmount(amount.toFixed(2))}
                  >
                    ${amount.toFixed(2)}
                  </Button>
                ))}
                
                <Button 
                  variant="outline"
                  onClick={() => setPaymentAmount('')}
                >
                  Clear
                </Button>
              </div>
              
              {paymentAmount && parseFloat(paymentAmount) >= total && (
                <div className="p-3 rounded-md bg-green-50 text-green-700 flex justify-between">
                  <span>Change</span>
                  <span>${(parseFloat(paymentAmount) - total).toFixed(2)}</span>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="card">
              <div className="space-y-4 py-4">
                <p className="text-center text-sm text-gray-500">Connect your card reader to proceed with card payment</p>
                <div className="flex justify-center">
                  <CreditCard size={64} strokeWidth={1} className="text-gray-400" />
                </div>
                <p className="text-center text-sm font-medium">Waiting for card payment...</p>
                <div className="flex justify-center">
                  <Button onClick={() => processPayment('Card')}>
                    Simulate Card Payment
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="wallet">
              <div className="space-y-4 py-4">
                <p className="text-center text-sm text-gray-500">Scan the customer's wallet QR code or enter wallet ID</p>
                <Input placeholder="Enter wallet ID" />
                <div className="flex justify-center">
                  <Button onClick={() => processPayment('Wallet')}>
                    Process Wallet Payment
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upi">
              <div className="space-y-4 py-4">
                <p className="text-center text-sm text-gray-500">Scan customer's UPI QR code to collect payment</p>
                <div className="flex justify-center">
                  <QrCode size={150} strokeWidth={1} className="text-gray-800" />
                </div>
                <p className="text-center text-xs text-gray-500">Or ask customer to scan and pay</p>
                <div className="flex justify-center">
                  <Button onClick={() => processPayment('UPI')}>
                    Confirm UPI Payment
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => processPayment('Cash')} disabled={!paymentAmount || parseFloat(paymentAmount) < total}>
              <Receipt className="mr-2 h-4 w-4" />
              Complete Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;
