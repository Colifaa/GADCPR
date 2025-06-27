'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface RegisterData {
  fullName: string;
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  nickname?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuthStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState<RegisterData>({
    fullName: '',
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field !== 'role' && errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('al menos 8 caracteres');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('una letra minúscula');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('una letra mayúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('un número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('un carácter especial (!@#$%^&*(),.?":{}|<>)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validar nombre completo
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
    }

    // Validar nickname (opcional, pero si se ingresa debe ser válido)
    if (formData.nickname.trim() && formData.nickname.trim().length < 3) {
      newErrors.nickname = 'El nickname debe tener al menos 3 caracteres';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = `La contraseña debe contener: ${passwordValidation.errors.join(', ')}`;
      }
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleChange = (role: 'user' | 'admin') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(
        formData.fullName.trim(),
        formData.email.trim(),
        formData.password,
        formData.nickname.trim() || undefined,
        formData.role
      );

      if (success) {
        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada correctamente.",
        });
        router.push('/auth/onboarding');
      } else {
        toast({
          title: "Error en el registro",
          description: "Este correo electrónico ya está registrado.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear tu cuenta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    const validation = validatePassword(password);
    const strength = Math.max(0, 5 - validation.errors.length);
    
    if (strength <= 1) return { strength, label: 'Muy débil', color: 'bg-red-500' };
    if (strength <= 2) return { strength, label: 'Débil', color: 'bg-orange-500' };
    if (strength <= 3) return { strength, label: 'Regular', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Fuerte', color: 'bg-blue-500' };
    return { strength, label: 'Muy fuerte', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Registrarse</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inputs de registro */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-600">
              Nombre
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-600">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="E-mail"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-sm font-medium text-gray-600">
              Nickname (opcional)
            </Label>
            <Input
              id="nickname"
              type="text"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              placeholder="Tu nombre de usuario"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-600">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Contraseña"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600">
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirma tu contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
              required
            />
          </div>
          {/* Selección de tipo de cuenta */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cuenta</Label>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('user')}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${formData.role === 'user' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white'} hover:border-blue-400`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <span className="font-semibold text-gray-900">Suscriptor</span>
                  </div>
                  <span className="block text-sm text-gray-600">Accede a contenido exclusivo y conecta con creadores</span>
                </div>
                {formData.role === 'user' && <span className="text-green-500 text-xl ml-4">●</span>}
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${formData.role === 'admin' ? 'border-yellow-500 bg-yellow-50 shadow-sm' : 'border-gray-200 bg-white'} hover:border-yellow-400`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👑</span>
                    <span className="font-semibold text-gray-900">Administrador <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded">Solo Demo</span></span>
                  </div>
                  <span className="block text-sm text-gray-600">Gestiona la plataforma y supervisa usuarios</span>
                  <span className="block text-xs text-orange-600 mt-1">Disponible solo en versión de demostración</span>
                </div>
                {formData.role === 'admin' && <span className="text-yellow-500 text-xl ml-4">●</span>}
              </button>
            </div>
          </div>
          {/* Botón de Registro */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 mt-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </Button>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Iniciar Sesión
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
} 