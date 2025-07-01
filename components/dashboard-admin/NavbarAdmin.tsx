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
import { useNotificationStore, useNotificationWebSocket } from '@/store/notifications'
import { useRouter } from "next/navigation"

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
  const { user, logout } = useAuthStore()
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, removeDuplicates, resetNotifications } = useNotificationStore()
  const router = useRouter()
  
  // Inicializar el websocket simulado
  useNotificationWebSocket()

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleNotificationClick = (notification: any) => {
    handleMarkAsRead(notification.id)
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
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
                      className="flex items-start space-x-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleNotificationClick(notification)}
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
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                {notifications.length === 0 && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay notificaciones</p>
                    <p className="text-xs mt-1">Las notificaciones aparecerán aquí cuando se realicen acciones del sistema</p>
                  </div>
                )}
                
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-2 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                        disabled={unreadCount === 0}
                      >
                        Marcar leídas
                      </Button>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            notifications.forEach(n => removeNotification(n.id))
                          }}
                          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Limpiar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetNotifications}
                          className="text-xs text-red-700 hover:text-red-800 hover:bg-red-100"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </>
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


          </div>
        </div>
      </div>
    </nav>
  )
}
