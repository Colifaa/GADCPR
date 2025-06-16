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
  Home,
  BarChart3,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Shield
} from 'lucide-react';

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
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ContentAI
          </span>
        </div>
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
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
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
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
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

      {/* User section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {user && (
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                Plan {user.plan}
                {isAdmin && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                    Admin
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
        
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