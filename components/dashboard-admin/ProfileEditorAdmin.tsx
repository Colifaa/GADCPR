'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { Camera, Save, Eye, EyeOff, Shield, Settings } from 'lucide-react';

interface ProfileData {
  name: string;
  nickname: string;
  email: string;
  avatar: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfileEditorAdmin() {
  const { user, updateProfile, changePassword } = useAuthStore();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    nickname: user?.nickname || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(user?.avatar || '');

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Por favor selecciona un archivo de imagen válido.",
          variant: "destructive",
        });
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImagePreview(result);
        handleInputChange('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    // Validaciones básicas
    if (!profileData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio.",
        variant: "destructive",
      });
      return false;
    }

    if (!profileData.email.trim()) {
      toast({
        title: "Error",
        description: "El correo electrónico es obligatorio.",
        variant: "destructive",
      });
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico válido.",
        variant: "destructive",
      });
      return false;
    }

    // Si se quiere cambiar la contraseña
    if (profileData.newPassword || profileData.confirmPassword) {
      if (!profileData.currentPassword) {
        toast({
          title: "Error",
          description: "Debes ingresar tu contraseña actual para cambiarla.",
          variant: "destructive",
        });
        return false;
      }

      if (profileData.newPassword.length < 6) {
        toast({
          title: "Error",
          description: "La nueva contraseña debe tener al menos 6 caracteres.",
          variant: "destructive",
        });
        return false;
      }

      if (profileData.newPassword !== profileData.confirmPassword) {
        toast({
          title: "Error",
          description: "Las contraseñas no coinciden.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Actualizar perfil
      const profileUpdateSuccess = await updateProfile({
        name: profileData.name,
        nickname: profileData.nickname,
        email: profileData.email,
        avatar: profileData.avatar,
      });

      if (!profileUpdateSuccess) {
        throw new Error('Error al actualizar el perfil');
      }

      // Si hay cambio de contraseña
      if (profileData.newPassword) {
        const passwordChangeSuccess = await changePassword(
          profileData.currentPassword,
          profileData.newPassword
        );

        if (!passwordChangeSuccess) {
          sonnerToast.error("Error al cambiar contraseña", {
            description: "La contraseña actual es incorrecta. Verifica e inténtalo de nuevo.",
          });
          return;
        }
        
        sonnerToast.success("¡Contraseña actualizada!", {
          description: "Tu contraseña ha sido cambiada exitosamente.",
        });
      } else {
        sonnerToast.success("¡Perfil de administrador actualizado!", {
          description: "Tu información personal ha sido actualizada correctamente.",
        });
      }

      // Limpiar campos de contraseña después de actualizar
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
    } catch (error) {
      sonnerToast.error("Error al actualizar", {
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar tu perfil. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Configuración del Perfil de Administrador
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tu información personal y configuración de cuenta como administrador.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Información Personal</span>
              <Badge variant="default" className="ml-2">
                Administrador
              </Badge>
            </CardTitle>
            <CardDescription>
              Esta información será visible para otros administradores de la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Foto de Perfil */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImagePreview} alt="Foto de perfil" />
                  <AvatarFallback className="text-lg">
                    {getInitials(profileData.name || 'Admin')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800">
                    <Camera className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-600 dark:text-blue-400">Cambiar foto</span>
                  </div>
                </Label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-500">
                  JPG, PNG o GIF. Máximo 5MB.
                </p>
              </div>
            </div>

            {/* Nombre Completo */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>

            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname o Alias de Admin</Label>
              <Input
                id="nickname"
                type="text"
                value={profileData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                placeholder="Tu nombre de administrador o apodo"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico Administrativo *</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@empresa.com"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Cambio de Contraseña */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>
              Mantén tu cuenta segura actualizando tu contraseña regularmente. Deja estos campos vacíos si no deseas cambiar tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contraseña Actual */}
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={profileData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={profileData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={profileData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setProfileData({
                name: user?.name || '',
                nickname: user?.nickname || '',
                email: user?.email || '',
                avatar: user?.avatar || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
              setProfileImagePreview(user?.avatar || '');
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 