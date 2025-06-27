'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ContentGenerator } from '@/components/dashboard/ContentGenerator';
import { RecentContent } from '@/components/dashboard/RecentContent';
import { useDashboardStore } from '@/store/dashboard';
import { useAuthStore } from '@/store/auth';

export default function DashboardPage() {
  const router = useRouter();
  const { fetchDashboardData } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Si el usuario no está autenticado, redirigir al login
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Si el usuario no ha completado el onboarding, redirigir
    if (!user.hasCompletedOnboarding) {
      router.push('/auth/onboarding');
      return;
    }

    fetchDashboardData();
  }, [fetchDashboardData, user, router]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your content today.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Content Generation and Recent Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ContentGenerator />
          </div>
          <div className="lg:col-span-2">
            <RecentContent />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
