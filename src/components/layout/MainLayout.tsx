
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { SidebarProvider } from "@/components/ui/sidebar";

const MainLayout = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  // If not logged in and not loading, redirect to login
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  // If loading or not logged in, don't render the layout yet
  if (loading || !currentUser) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <TopBar />
          <main className="flex-1 bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
