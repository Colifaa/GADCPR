'use client';

import React from 'react';
import { DashboardAdminLayout } from '@/components/layout/DashboardAdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/dashboard-admin/UserManagement';
import { SubscriptionManagement } from '@/components/dashboard-admin/SubscriptionManagement';
import { FAQManager } from '@/components/dashboard-admin/FAQManager';
import { RequestManagement } from '@/components/dashboard-admin/RequestManagement';
import { Users } from 'lucide-react';

export default function ManagementPage() {
  return (
    <DashboardAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span>Gestión</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Administra y revisa todos los usuarios, suscripciones, servicio técnico y solicitudes
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
            <TabsTrigger value="content">Servicio Técnico</TabsTrigger>
            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
          </TabsList>

          {/* Usuarios */}
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          {/* Suscripciones */}
          <TabsContent value="subscriptions">
            <SubscriptionManagement />
          </TabsContent>

          {/* Servicio Técnico */}
          <TabsContent value="content" className="space-y-6">
            <FAQManager />
          </TabsContent>

          {/* Solicitudes */}
          <TabsContent value="requests">
            <RequestManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardAdminLayout>
  );
}
