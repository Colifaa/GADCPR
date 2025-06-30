'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAdminStore } from '@/store/admin';
import { AdminUser, UserFormData } from '@/store/admin';
import {
  Users,
  Search,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  UserPlus,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

export function UserManagement() {
  const {
    users,
    updateUserStatus,
    deleteUser,
    createUser,
    updateUser,
  } = useAdminStore();

  // Estados para la gestión de usuarios
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // Formulario de usuario
  const [userForm, setUserForm] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    identificationNumber: '',
    identificationType: 'DNI',
    address: '',
    status: 'active',
    plan: 'free',
    credits: 0,
    password: '',
    confirmPassword: ''
  });

  // Filtrar y paginar usuarios
  const { paginatedUsers, totalPages, totalUsers } = useMemo(() => {
    // Filtrar usuarios
    const filtered = users.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });

    // Calcular paginación
    const total = filtered.length;
    const pages = Math.ceil(total / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      paginatedUsers: paginated,
      totalPages: pages,
      totalUsers: total
    };
  }, [users, searchTerm, currentPage, usersPerPage]);

  // Resetear a primera página cuando cambia la búsqueda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Resetear formulario
  const resetForm = () => {
    setUserForm({
      name: '',
      email: '',
      phone: '',
      identificationNumber: '',
      identificationType: 'DNI',
      address: '',
      status: 'active',
      plan: 'free',
      credits: 0,
      password: '',
      confirmPassword: ''
    });
  };

  // Abrir modal para crear usuario
  const handleCreateUser = () => {
    resetForm();
    setShowCreateModal(true);
  };

  // Abrir modal para editar usuario
  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      identificationNumber: user.identificationNumber || '',
      identificationType: user.identificationType || 'DNI',
      address: user.address || '',
      status: user.status,
      plan: user.plan,
      credits: user.credits,
      password: '',
      confirmPassword: ''
    });
    setShowEditModal(true);
  };

  // Confirmar eliminación
  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  // Confirmar eliminación
  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  // Enviar formulario
  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (showCreateModal) {
        await createUser(userForm);
        setShowCreateModal(false);
      } else if (showEditModal && selectedUser) {
        await updateUser(selectedUser.id, userForm);
        setShowEditModal(false);
      }
      resetForm();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cerrar modales
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
  };

  // Paginación
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generar números de página
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'inactive':
        return 'Inactiva';
      case 'suspended':
        return 'Suspendida';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con título y botón de agregar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Usuarios</h2>
          <p className="text-gray-600 dark:text-gray-400">Gestiona todos los usuarios de la plataforma</p>
        </div>
        <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar nuevo usuario
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex justify-between items-center">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {paginatedUsers.length} de {totalUsers} usuarios
        </div>
      </div>

      {/* Grid de usuarios */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">{user.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <Badge className={getStatusColor(user.status)} variant="secondary">
                    {getStatusLabel(user.status)}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    <span>{format(user.registrationDate, 'dd/MM/yyyy')}</span>
                  </div>
                  {user.lastLogin && (
                    <div className="flex items-center justify-center">
                      <Clock className="h-3 w-3 mr-2" />
                      <span>{format(user.lastLogin, 'dd/MM/yyyy')}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditUser(user);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active');
                    }}
                    className={`h-8 w-8 p-0 ${user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                  >
                    {user.status === 'active' ? <Ban className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user);
                    }}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
              disabled={page === '...'}
              className={`h-8 min-w-8 px-2 ${page === currentPage ? 'bg-blue-600 text-white' : ''}`}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modal para Crear/Editar Usuario */}
      <Dialog open={showCreateModal || showEditModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showCreateModal ? 'Usuario' : 'Usuario'}
            </DialogTitle>
            <DialogDescription>
              {showCreateModal ? 'Crear nuevo usuario en el sistema' : 'Editar información del usuario'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitUser} className="space-y-4">
            {/* Avatar placeholder */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
            </div>

            {/* Nombre de usuario */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de usuario</Label>
              <Input
                id="name"
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="@profileexample"
                required
              />
            </div>

            {/* Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="email">Nombre completo</Label>
              <Input
                id="email"
                type="text"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Nombre y apellido"
                required
              />
            </div>

            {/* Número de teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">Número de teléfono</Label>
              <Input
                id="phone"
                value={userForm.phone}
                onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+00 000 000 0000"
              />
            </div>

            {/* Tipo y Número de identificación */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="identificationType">Tipo</Label>
                <Select
                  value={userForm.identificationType}
                  onValueChange={(value) => setUserForm(prev => ({ ...prev, identificationType: value as 'DNI' | 'CC' | 'CE' | 'RUC' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="CC">CC</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="RUC">RUC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="identificationNumber">Número de identificación</Label>
                <Input
                  id="identificationNumber"
                  value={userForm.identificationNumber}
                  onChange={(e) => setUserForm(prev => ({ ...prev, identificationNumber: e.target.value }))}
                  placeholder="0000000"
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={userForm.address}
                onChange={(e) => setUserForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Ciudad, Calle, Residencia, Habitación"
              />
            </div>

            {/* Estado de la cuenta */}
            <div className="space-y-2">
              <Label htmlFor="status">Estado de la cuenta</Label>
              <Select
                value={userForm.status}
                onValueChange={(value) => setUserForm(prev => ({ ...prev, status: value as AdminUser['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="inactive">Inactiva</SelectItem>
                  <SelectItem value="suspended">Suspendida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contraseña (solo para crear) */}
            {showCreateModal && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Lorem"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Repetir contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Lorem"
                  />
                </div>
              </>
            )}

            {/* Fecha de registro (solo mostrar en edición) */}
            {showEditModal && selectedUser && (
              <div className="space-y-2">
                <Label>Fecha de registro</Label>
                <Input
                  value={format(selectedUser.registrationDate, 'dd/MM/yyyy')}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
            )}

            {/* Último inicio de sesión (solo mostrar en edición) */}
            {showEditModal && selectedUser && selectedUser.lastLogin && (
              <div className="space-y-2">
                <Label>Último inicio de sesión</Label>
                <Input
                  value={format(selectedUser.lastLogin, 'dd/MM/yyyy')}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-between pt-4">
              {showEditModal && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (selectedUser) {
                      handleDeleteUser(selectedUser);
                      handleCloseModal();
                    }
                  }}
                >
                  Eliminar Usuario
                </Button>
              )}
              <div className="flex space-x-2 ml-auto">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : (showCreateModal ? 'Crear/Guardar usuario' : 'Actualizar usuario')}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para confirmar eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario {selectedUser?.name} y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 