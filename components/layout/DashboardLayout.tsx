'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Sidebar } from './Sidebar';
import NavbarUser from '../dashboard/NavbarUser';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Auto-cerrar en móvil
      } else {
        setSidebarOpen(true); // Auto-abrir en desktop
      }
    };

    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <NavbarUser 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'w-64' : ''}
        `}>
          <Sidebar 
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
        </div>

        {/* Overlay para móvil */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main 
          className={`
            flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300
            ${!isMobile && sidebarOpen ? 'ml-0' : ''}
            ${isMobile ? 'w-full' : ''}
          `}
          style={{ 
            paddingTop: isMobile ? '1rem' : '0',
            marginTop: isMobile ? '64px' : '0' 
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}