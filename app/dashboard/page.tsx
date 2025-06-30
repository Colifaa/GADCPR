'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user && !user.hasCompletedOnboarding) {
      router.push('/auth/onboarding');
      return;
    }
    // Redirigir automáticamente a selecciones
    if (isAuthenticated) {
      router.push('/selecciones');
    }
  }, [isAuthenticated, user, router]);

  // Mostrar un loader mientras se redirige
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}
