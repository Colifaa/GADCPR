'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfileEditor } from '@/components/dashboard/ProfileEditor';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ProfileEditor />
      </div>
    </DashboardLayout>
  );
}
