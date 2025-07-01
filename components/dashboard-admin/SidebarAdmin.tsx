'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import {
  BarChart3,
  CreditCard,
  Settings,
  Shield,
  User,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Métricas', href: '/admin', icon: BarChart3 },
  { name: 'Pagos', href: '/admin/payments', icon: CreditCard },
  { name: 'Gestión', href: '/admin/management', icon: Settings },
  { name: 'Mi Perfil', href: '/admin/profile', icon: User },
];

interface SidebarAdminProps {
  sidebarOpen?: boolean;
  toggleSidebar?: () => void;
  isMobile?: boolean;
}

export function SidebarAdmin({ sidebarOpen, toggleSidebar, isMobile }: SidebarAdminProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <div className={`
      flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
      ${isMobile ? 'w-64' : 'w-64'}
      transition-all duration-300 ease-in-out
    `}>
      {/* Header con botón de cerrar en móvil */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Admin Panel</span>
          {toggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}

      {/* User Profile Section */}
      <div className="flex h-20 items-center px-6 border-b border-gray-200">
        {user ? (
          <div className="flex items-center space-x-3 w-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500">
                <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                  Admin
                </span>
              </p>
              <p className="text-xs text-cyan-600 mt-1">
                Panel de Administración
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 w-full justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              ContentAI Admin
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
              onClick={() => {
                // Cerrar sidebar en móvil al hacer clic en un enlace
                if (isMobile && toggleSidebar) {
                  toggleSidebar();
                }
              }}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>


    </div>
  );
}