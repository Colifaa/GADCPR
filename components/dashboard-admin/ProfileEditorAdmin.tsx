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
import { Camera, Save, Eye, EyeOff, Shield, Settings, User, Heart, Headphones } from 'lucide-react';

interface ProfileData {
  name: string;
  lastName: string;
  nickname: string;
  email: string;
  phone: string;
  document: string;
  country: string;
  avatar: string;
}

export function ProfileEditorAdmin() {
  const { user, updateProfile, changePassword } = useAuthStore();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    nickname: user?.nickname || 'Usuario',
    email: user?.email || '',
    phone: user?.phone || '0000000000',
    document: user?.document || '123456',
    country: user?.country || 'Servicio',
    avatar: user?.avatar || '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('**********');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Actualizar perfil
      const profileUpdateSuccess = await updateProfile({
        name: `${profileData.name} ${profileData.lastName}`.trim(),
        nickname: profileData.nickname,
        email: profileData.email,
        phone: profileData.phone,
        document: profileData.document,
        country: profileData.country,
        avatar: profileData.avatar,
      });

      if (!profileUpdateSuccess) {
        throw new Error('Error al actualizar el perfil');
      }

      sonnerToast.success("¡Perfil actualizado!", {
        description: "Tu información ha sido actualizada correctamente.",
      });
      
    } catch (error) {
      sonnerToast.error("Error al actualizar", {
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar tu perfil.",
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
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-6">
      {/* Sidebar izquierdo */}
      <div className="lg:w-1/3">
        <Card className="p-6">
          {/* Avatar y info personal */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <Avatar className="h-32 w-32 border-4 border-blue-100">
                <AvatarImage src={profileImagePreview} alt="Foto de perfil" />
                <AvatarFallback className="text-2xl bg-blue-900 text-white">
                  {getInitials(user?.name || 'Admin')}
                </AvatarFallback>
              </Avatar>
              <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4 text-white" />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {user?.name || 'Andre Carrera'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Administrador
            </p>
          </div>
        </Card>
      </div>

      {/* Contenido principal - Formulario */}
      <div className="lg:w-2/3">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Datos
            </h3>
            <Headphones className="h-6 w-6 text-blue-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombres */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Nombres
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nombre completo"
                  className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                />
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Apellido"
                  className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                />
              </div>

              {/* Número de teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                  Número de teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="0000000000"
                  className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                />
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Correo
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="@gmail.com"
                  className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                />
              </div>

              {/* Usuario */}
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-gray-700 dark:text-gray-300">
                  Usuario
                </Label>
                <Input
                  id="nickname"
                  type="text"
                  value={profileData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  placeholder="Usuario"
                  className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                />
              </div>

              {/* País */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">
                  País
                </Label>
                <Input
                  id="country"
                  type="text"
                  value={profileData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Servicio"
                  className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                />
              </div>

              {/* Documento de identificación */}
              <div className="space-y-2">
                <Label htmlFor="document" className="text-gray-700 dark:text-gray-300">
                  Documento de identificación
                </Label>
                <Input
                  id="document"
                  type="text"
                  value={profileData.document}
                  onChange={(e) => handleInputChange('document', e.target.value)}
                  placeholder="123456"
                  className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Cambiar contraseña
                </button>
              </div>
            </div>

            {/* Botón Actualizar */}
            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Guardando...
                  </>
                ) : (
                  'Actualizar'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 