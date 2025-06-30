'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import NavbarUser from '../dashboard/NavbarUser';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  
  // Bandera para saber si el store ya se rehidrató (montado en cliente)
  const [hasHydrated, setHasHydrated] = useState(false);

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
    } else if (isAdmin) {
      // Si el usuario es administrador, redirigir al panel de administración
      router.push('/admin');
    }
  }, [hasHydrated, isAuthenticated, isAdmin, router]);

  if (!hasHydrated) {
    return null; // Evita parpadeos hasta que el estado esté restaurado
  }

  if (!isAuthenticated || isAdmin) {
    return null; // También podría mostrarse un loader
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavbarUser />
      
      {/* Contenido principal */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}