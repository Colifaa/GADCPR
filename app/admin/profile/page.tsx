'use client';

import React from 'react';
import { DashboardAdminLayout } from '@/components/layout/DashboardAdminLayout';
import { ProfileEditorAdmin } from '@/components/dashboard-admin/ProfileEditorAdmin';

export default function AdminProfilePage() {
  return (
    <DashboardAdminLayout>
      <div className="p-6">
        <ProfileEditorAdmin />
      </div>
    </DashboardAdminLayout>
  );
}
