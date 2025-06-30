"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, User, LogOut, History, FolderOpen, CheckCircle, AlertCircle, Info, Menu, FileText } from "lucide-react"
import { useAuthStore } from '@/store/auth'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "success",
    title: "Proyecto completado",
    message: "Tu proyecto 'Landing Page' ha sido finalizado exitosamente",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "Nueva actualización",
    message: "Hay nuevas funcionalidades disponibles en tu dashboard",
    time: "Hace 1 hora",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Recordatorio",
    message: "Tu suscripción vence en 3 días",
    time: "Hace 2 horas",
    read: true,
  },
  {
    id: 4,
    type: "info",
    title: "Comentario nuevo",
    message: "Alguien comentó en tu proyecto 'E-commerce App'",
    time: "Ayer",
    read: true,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case "info":
    default:
      return <Info className="h-4 w-4 text-blue-500" />
  }
}

interface NavbarUserProps {
  sidebarOpen?: boolean;
  toggleSidebar?: () => void;
  isMobile?: boolean;
}

export default function NavbarUser({ sidebarOpen, toggleSidebar, isMobile }: NavbarUserProps) {
  const [unreadCount, setUnreadCount] = React.useState(notifications.filter((n) => !n.read).length)
  const { user, logout } = useAuthStore()

  const handleMarkAsRead = (id: number) => {
    // In a real app, this would update the backend
    const notification = notifications.find((n) => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      setUnreadCount((prev) => prev - 1)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/selecciones" className="flex items-center space-x-2 flex-shrink-0">
              <Image src="/logo_scrito.svg" alt="Logo" width={120} height={120} />
            </Link>
          </div>

          {/* Navigation Links - Para pantallas grandes, distribuidos mejor */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-6 xl:space-x-8 2xl:space-x-12">
              <Link
                href="/selecciones"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 flex items-center space-x-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
              >
                <FileText className="h-4 w-4" />
                <span>Selección</span>
              </Link>
              <Link
                href="/historial"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md flex items-center space-x-2"
              >
                <History className="h-4 w-4" />
                <span>Historial</span>
              </Link>
              <Link
                href="/proyectos"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md flex items-center space-x-2"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Mis Proyectos</span>
              </Link>
            </div>
          </div>

          {/* Right side - Notificaciones, Perfil, Logout */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notificaciones</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {unreadCount} nuevas
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex items-start space-x-3 p-3 cursor-pointer"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${!notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                {notifications.length === 0 && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">No hay notificaciones</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatar || user?.avatar} alt={user?.name || "Usuario"} />
                    <AvatarFallback>
                      {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Separate Logout Button - Oculto en móvil */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            >
              <span className="hidden lg:inline mr-1">Salir</span>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
