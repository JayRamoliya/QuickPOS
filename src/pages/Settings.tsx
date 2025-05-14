
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxRate: number;
  currency: string;
  timezone: string;
  receiptNote: string;
  logoUrl: string;
  notifications: {
    lowStock: boolean;
    newOrders: boolean;
    customerReturns: boolean;
    employeeActivity: boolean;
  };
  dataRetention: {
    salesHistory: number;
    inventoryChanges: number;
    customerActivity: number;
    employeeRecords: number;
  };
}

const Settings = () => {
  const defaultSettings: StoreSettings = {
    name: "QuickPOS Store",
    address: "123 Main Street, Anytown, USA",
    phone: "(555) 123-4567",
    email: "info@quickposstore.com",
    website: "www.quickposstore.com",
    taxRate: 7.5,
    currency: "USD",
    timezone: "America/New_York",
    receiptNote: "Thank you for shopping with us!",
    logoUrl: "",
    notifications: {
      lowStock: true,
      newOrders: true,
      customerReturns: false,
      employeeActivity: false,
    },
    dataRetention: {
      salesHistory: 30,
      inventoryChanges: 30,
      customerActivity: 30,
      employeeRecords: 30,
    }
  };

  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle notifications toggle
  const handleNotificationToggle = (type: keyof StoreSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  // Handle data retention changes
  const handleDataRetentionChange = (type: keyof StoreSettings['dataRetention'], value: string) => {
    const numValue = parseInt(value, 10) || 30;
    setSettings(prev => ({
      ...prev,
      dataRetention: {
        ...prev.dataRetention,
        [type]: numValue
      }
    }));
  };

  // Save settings to localStorage
  const saveSettings = () => {
    setSaving(true);
    
    try {
      localStorage.setItem('storeSettings', JSON.stringify(settings));
      
      // Simulate a delay to show the saving state
      setTimeout(() => {
        setSaving(false);
        toast({
          title: "Settings saved",
          description: "Your store settings have been updated successfully.",
        });
      }, 800);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaving(false);
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <Badge variant="outline" className="text-blue-600">Data saved for 30 days</Badge>
      </div>
      
      <Tabs defaultValue="store">
        <TabsList className="mb-6">
          <TabsTrigger value="store">Store Information</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your store that will appear on receipts and invoices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={settings.name} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={settings.address} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={settings.phone} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={settings.email} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    value={settings.website} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input 
                    id="taxRate" 
                    name="taxRate" 
                    type="number" 
                    value={settings.taxRate} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="receiptNote">Receipt Footer Note</Label>
                <Input 
                  id="receiptNote" 
                  name="receiptNote" 
                  value={settings.receiptNote} 
                  onChange={handleInputChange} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize how the POS system works for your business.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input 
                    id="currency" 
                    name="currency" 
                    value={settings.currency} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input 
                    id="timezone" 
                    name="timezone" 
                    value={settings.timezone} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Interface Preferences</h3>
                <div className="flex items-center space-x-2 py-2">
                  <Switch id="darkMode" />
                  <Label htmlFor="darkMode">Dark Mode</Label>
                </div>
                
                <div className="flex items-center space-x-2 py-2">
                  <Switch id="compactMode" />
                  <Label htmlFor="compactMode">Compact Mode</Label>
                </div>
                
                <div className="flex items-center space-x-2 py-2">
                  <Switch id="receiptPreview" defaultChecked />
                  <Label htmlFor="receiptPreview">Show Receipt Preview</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure which notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Low Stock Alerts</h3>
                  <p className="text-sm text-gray-500">Notify when inventory items are running low</p>
                </div>
                <Switch 
                  checked={settings.notifications.lowStock} 
                  onCheckedChange={() => handleNotificationToggle('lowStock')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">New Order Notifications</h3>
                  <p className="text-sm text-gray-500">Receive alerts for new orders</p>
                </div>
                <Switch 
                  checked={settings.notifications.newOrders} 
                  onCheckedChange={() => handleNotificationToggle('newOrders')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Customer Returns</h3>
                  <p className="text-sm text-gray-500">Get notified about customer returns and refunds</p>
                </div>
                <Switch 
                  checked={settings.notifications.customerReturns} 
                  onCheckedChange={() => handleNotificationToggle('customerReturns')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Employee Activity</h3>
                  <p className="text-sm text-gray-500">Monitor employee logins and important actions</p>
                </div>
                <Switch 
                  checked={settings.notifications.employeeActivity} 
                  onCheckedChange={() => handleNotificationToggle('employeeActivity')} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy Settings</CardTitle>
              <CardDescription>
                Manage how long your data is retained in the system. All data is saved for at least 30 days.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="salesHistory">Sales History (days)</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="salesHistory" 
                    type="number"
                    min={30}
                    value={settings.dataRetention.salesHistory}
                    onChange={(e) => handleDataRetentionChange('salesHistory', e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">Minimum: 30 days</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="inventoryChanges">Inventory Changes (days)</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="inventoryChanges" 
                    type="number"
                    min={30}
                    value={settings.dataRetention.inventoryChanges}
                    onChange={(e) => handleDataRetentionChange('inventoryChanges', e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">Minimum: 30 days</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="customerActivity">Customer Activity (days)</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="customerActivity" 
                    type="number"
                    min={30}
                    value={settings.dataRetention.customerActivity}
                    onChange={(e) => handleDataRetentionChange('customerActivity', e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">Minimum: 30 days</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="employeeRecords">Employee Records (days)</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="employeeRecords" 
                    type="number"
                    min={30}
                    value={settings.dataRetention.employeeRecords}
                    onChange={(e) => handleDataRetentionChange('employeeRecords', e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">Minimum: 30 days</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Export & Deletion</h3>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button variant="outline">Export All Data</Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Request Data Deletion
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Data deletion requests are processed within 30 days. Some data may be retained for legal purposes.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
