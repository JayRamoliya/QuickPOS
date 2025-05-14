
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

// Layout
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SonnerToaster position="top-right" />
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/orders" element={<Orders />} />
              
              {/* Placeholder routes */}
              <Route path="/inventory" element={<div className="p-4"><h1 className="text-2xl font-bold">Inventory</h1><p className="mt-4">Inventory management will be implemented in the next phase.</p></div>} />
              <Route path="/products" element={<div className="p-4"><h1 className="text-2xl font-bold">Products</h1><p className="mt-4">Product management will be implemented in the next phase.</p></div>} />
              <Route path="/customers" element={<div className="p-4"><h1 className="text-2xl font-bold">Customers</h1><p className="mt-4">Customer management will be implemented in the next phase.</p></div>} />
              <Route path="/reports" element={<div className="p-4"><h1 className="text-2xl font-bold">Reports</h1><p className="mt-4">Reports will be implemented in the next phase.</p></div>} />
              <Route path="/employees" element={<div className="p-4"><h1 className="text-2xl font-bold">Employees</h1><p className="mt-4">Employee management will be implemented in the next phase.</p></div>} />
              <Route path="/settings" element={<div className="p-4"><h1 className="text-2xl font-bold">Settings</h1><p className="mt-4">Settings will be implemented in the next phase.</p></div>} />
              <Route path="/profile" element={<div className="p-4"><h1 className="text-2xl font-bold">Profile</h1><p className="mt-4">User profile will be implemented in the next phase.</p></div>} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
