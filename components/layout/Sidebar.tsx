'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import {
  Home,
  BarChart3,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  Shield
} from 'lucide-react';
import Image from 'next/image';

const navigation = [
  { name: 'Panel Principal', href: '/dashboard', icon: Home },
  { name: 'Contenido', href: '/content', icon: FileText },
  { name: 'Análisis', href: '/analytics', icon: BarChart3 },
  { name: 'Facturación', href: '/billing', icon: CreditCard },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

// Admin navigation - only shown to admin users
const adminNavigation = [
  { name: 'Panel de Administración', href: '/admin', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  // Check if user is admin (you can modify this logic based on your needs)
  const isAdmin = user?.email === 'admin@contentai.com' || user?.plan === 'admin';

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
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
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                  Plan {user.plan}
                </span>
                {isAdmin && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                    Admin
                  </span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 w-full justify-center">
            <Image src="/logo_scrito.svg" alt="Logo" width={128} height={128} />
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
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        {/* Admin Navigation */}
        {isAdmin && (
          <>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administración
              </p>
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Action buttons section */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}