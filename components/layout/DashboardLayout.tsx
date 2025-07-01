'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useCreditMonitor } from '@/hooks/use-credit-monitor';
import NavbarUser from '../dashboard/NavbarUser';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  
  // Monitorear créditos
  useCreditMonitor();
  
  // Bandera para saber si el store ya se rehidrató (montado en cliente)
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showBannedDialog, setShowBannedDialog] = useState(false);

  // Una vez montado el componente en cliente, la rehidratación de zustand ya debió ocurrir.
  useEffect(() => {
    // Esperamos un tick para asegurar que el persist de Zustand haya restaurado el estado
    const id = setTimeout(() => setHasHydrated(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Check if user is admin
  const isAdmin = user?.email === 'admin@contentai.com' || user?.plan === 'admin';

  // Verificar si el usuario ha sido suspendido mientras usa la aplicación
  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !user) return;

    const checkUserStatus = () => {
      try {
        const users = JSON.parse(localStorage.getItem('users-db') || '[]');
        const currentUser = users.find((u: any) => u.email === user.email);
        
        if (currentUser && currentUser.status === 'suspended') {
          setShowBannedDialog(true);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };

    // Verificar inmediatamente
    checkUserStatus();

    // Verificar cada 30 segundos si el usuario sigue activo
    const interval = setInterval(checkUserStatus, 30000);

    return () => clearInterval(interval);
  }, [hasHydrated, isAuthenticated, user]);

  const handleBannedUser = () => {
    logout();
    setShowBannedDialog(false);
    router.push('/auth/login');
  };

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
    <>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavbarUser />
        
        {/* Contenido principal */}
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>

      {/* Dialog para usuario suspendido */}
      <AlertDialog open={showBannedDialog} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Cuenta Suspendida</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              Tu cuenta ha sido suspendida por el administrador. 
              <br /><br />
              <strong>Para resolver esta situación, por favor contacta al soporte técnico:</strong>
              <br />
              📧 Email: soporte@contentai.com
              <br />
              📞 Teléfono: +1 (555) 123-4567
              <br />
              💬 Chat en vivo: Disponible 24/7
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleBannedUser} className="bg-red-600 hover:bg-red-700">
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}