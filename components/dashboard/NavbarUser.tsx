"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, User, LogOut, Search, FileText, FolderOpen, CheckCircle, AlertCircle, Info } from "lucide-react"
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

export default function NavbarUser() {
  const { user } = useAuthStore()
  const [unreadCount, setUnreadCount] = React.useState(notifications.filter((n) => !n.read).length)

  const handleMarkAsRead = (id: number) => {
    // In a real app, this would update the backend
    const notification = notifications.find((n) => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      setUnreadCount((prev) => prev - 1)
    }
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="flex items-center mr-8">
            <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo_scrito.svg" alt="Logo" width={128} height={128} />
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-8">
              <Link
                href="/selecciones"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
              >
                Selección
              </Link>
              <Link
                href="/historial"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
              >
                Historial
              </Link>
              <Link
                href="/proyectos"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
              >
                Mis proyectos
              </Link>
            </div>
          </div>

          {/* Right side - Notifications, User, Exit */}
          <div className="flex items-center space-x-4 ml-8">
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
                            className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                {notifications.length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">No hay notificaciones</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatar} alt={user?.name || "Usuario"} />
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
                <DropdownMenuItem>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  <span>Mis proyectos</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Documentos</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Exit Link */}
            <Link
              href="/logout"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
            >
              <span>Salir</span>
              <LogOut className="h-4 w-4" />
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Search className="mr-2 h-4 w-4" />
                    <span>Selección</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Historial</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <span>Mis proyectos</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
