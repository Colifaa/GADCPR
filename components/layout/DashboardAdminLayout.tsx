'use client';

import React, { useEffect } from 'react';
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

  // Check if user is admin
  const isAdmin = user?.email === 'admin@contentai.com' || user?.plan === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (!isAdmin) {
      router.push('/dashboard'); // Redirect non-admin users to regular dashboard
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavbarAdmin />
      <div className="flex flex-1">
        <SidebarAdmin />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 