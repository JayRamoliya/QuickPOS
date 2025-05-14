
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  BarChart, 
  ShoppingBag, 
  Users, 
  UserCog,
  BarChart2, 
  Settings,
  Receipt,
  Tag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

const Sidebar = () => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Check if the current path starts with the provided path
  const isActive = (path: string) => 
    location.pathname === path || 
    (path !== '/dashboard' && location.pathname.startsWith(path));
  
  // Get the NavLink class name based on active state
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 rounded-md w-full ${
      isActive 
        ? 'bg-pos-blue text-white font-medium' 
        : 'text-gray-600 hover:bg-gray-200 hover:text-pos-gray'
    }`;

  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: <BarChart size={20} /> 
    },
    { 
      label: 'POS', 
      path: '/pos', 
      icon: <CreditCard size={20} /> 
    },
    { 
      label: 'Orders', 
      path: '/orders', 
      icon: <Receipt size={20} /> 
    },
    { 
      label: 'Inventory', 
      path: '/inventory', 
      icon: <ShoppingBag size={20} /> 
    },
    { 
      label: 'Products', 
      path: '/products', 
      icon: <Tag size={20} /> 
    },
    { 
      label: 'Customers', 
      path: '/customers', 
      icon: <Users size={20} /> 
    },
    { 
      label: 'Reports', 
      path: '/reports', 
      icon: <BarChart2 size={20} /> 
    },
    { 
      label: 'Employees', 
      path: '/employees', 
      icon: <UserCog size={20} /> 
    },
    { 
      label: 'Settings', 
      path: '/settings', 
      icon: <Settings size={20} /> 
    }
  ];

  // Filter out restricted sections based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!currentUser) return false;
    
    // Restrict certain pages based on role
    if (currentUser.role === 'cashier') {
      return !['employees', 'reports', 'settings'].some(
        restrictedPath => item.path.includes(restrictedPath)
      );
    }
    
    return true;
  });

  return (
    <SidebarComponent
      className={`${
        collapsed ? 'w-[70px]' : 'w-64'
      } transition-all duration-300 bg-white border-r border-gray-200`}
      collapsible
    >
      <div className={`p-4 border-b border-gray-200 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
        {!collapsed && <h1 className="font-bold text-xl text-pos-blue">QuickPOS</h1>}
        <SidebarTrigger className={collapsed ? 'mx-auto' : ''} />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink to={item.path} className={getLinkClass}>
                      <span className="mr-3">{item.icon}</span>
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
