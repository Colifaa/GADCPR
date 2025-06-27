'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { useSettingsStore } from '@/store/settings';
import {
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Shield,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Panel Principal', href: '/admin', icon: Shield },
  { name: 'Métricas', href: '/admin/metricas', icon: BarChart3 },
  { name: 'Pagos', href: '/admin/pagos', icon: CreditCard },
  { name: 'Gestión', href: '/admin/gestion', icon: Settings },
  { name: 'Mi Perfil', href: '/admin/profile', icon: User },
];

export function SidebarAdmin() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useSettingsStore();

  // Check if user is admin (you can modify this logic based on your needs)
  const isAdmin = user?.email === 'admin@contentai.com' || user?.plan === 'admin';

  const handleLogout = () => {
    logout();
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      default:
        return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* User Profile Section */}
      <div className="flex h-20 items-center px-6 border-b border-gray-200 dark:border-gray-700">
        {user ? (
          <div className="flex items-center space-x-3 w-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400 text-xs rounded-full">
                  Admin
                </span>
              </p>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
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
              scrito Admin
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
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}


      </nav>

      {/* Logout section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className="flex-1"
          >
            <ThemeIcon className="h-4 w-4 mr-2" />
            Tema
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}