'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

import { SidebarAdmin } from '../dashboard-admin/SidebarAdmin';
import NavbarAdmin from '../dashboard-admin/NavbarAdmin';

interface DashboardAdminLayoutProps {
  children: React.ReactNode;
}

export function DashboardAdminLayout({ children }: DashboardAdminLayoutProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Bandera para saber si el store ya se rehidrató (montado en cliente)
  const [hasHydrated, setHasHydrated] = useState(false);

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

  // Una vez montado el componente en cliente, la rehidratación de zustand ya debió ocurrir.
  useEffect(() => {
    // Esperamos un tick para asegurar que el persist de Zustand haya restaurado el estado
    const id = setTimeout(() => setHasHydrated(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Check if user is admin
  const isAdmin = user?.email === 'admin@contentai.com' || user?.plan === 'admin';

  useEffect(() => {
    if (!hasHydrated) return; // Esperar a que el estado esté listo

    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (!isAdmin) {
      router.push('/dashboard'); // Redirect non-admin users to regular dashboard
    }
  }, [hasHydrated, isAuthenticated, isAdmin, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!hasHydrated) {
    return null; // Evita parpadeos hasta que el estado esté restaurado
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // También podría mostrarse un loader
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <NavbarAdmin 
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
          <SidebarAdmin 
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