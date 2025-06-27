"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, User, BarChart3, CreditCard, Settings, LogOut, Shield, Users, FileText, Menu, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth"

// Mock notifications data (puedes reemplazarlo por datos reales)
const notifications = [
  {
    id: 1,
    type: "success",
    title: "Sistema actualizado",
    message: "El sistema ha sido actualizado exitosamente a la versión 2.1",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "Nuevo usuario registrado",
    message: "Se ha registrado un nuevo usuario en la plataforma",
    time: "Hace 15 min",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Mantenimiento programado",
    message: "Habrá mantenimiento del servidor mañana a las 2:00 AM",
    time: "Hace 1 hora",
    read: true,
  },
  {
    id: 4,
    type: "info",
    title: "Informe mensual listo",
    message: "El informe mensual de métricas está disponible",
    time: "Hace 2 horas",
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

interface NavbarAdminProps {
  sidebarOpen?: boolean;
  toggleSidebar?: () => void;
  isMobile?: boolean;
}

export default function NavbarAdmin({ sidebarOpen, toggleSidebar, isMobile }: NavbarAdminProps) {
  const [unreadCount, setUnreadCount] = React.useState(notifications.filter((n) => !n.read).length)
  const { user, logout } = useAuthStore()

  const handleMarkAsRead = (id: number) => {
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
          {/* Left side - Logo y Toggle Sidebar */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle solo para móvil */}
            {toggleSidebar && isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <Link href="/admin" className="flex items-center space-x-2 flex-shrink-0">
              <Image src="/logo_scrito.svg" alt="Logo" width={120} height={120} />
            </Link>
          </div>

          {/* Navigation Links - Para pantallas grandes, distribuidos mejor */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-6 xl:space-x-8 2xl:space-x-12">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Métricas</span>
              </Link>
              <Link
                href="/admin/payments"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Pagos</span>
              </Link>
              <Link
                href="/admin/management"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Gestión</span>
              </Link>
            </div>
          </div>

          {/* Right side - Notifications, Profile, Exit */}
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
                    <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt="Admin" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
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
