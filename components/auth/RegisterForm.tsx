'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';

interface RegisterData {
  fullName: string;
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
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
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
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
        formData.nickname.trim() || undefined
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
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
        <CardDescription className="text-center">
          Completa la información para registrarte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre Completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Nombre Completo</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Tu nombre completo"
              className={errors.fullName ? 'border-red-500' : ''}
              required
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Correo Electrónico */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Correo Electrónico</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              className={errors.email ? 'border-red-500' : ''}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Nickname (Opcional)</span>
            </Label>
            <Input
              id="nickname"
              type="text"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              placeholder="Tu nombre de usuario"
              className={errors.nickname ? 'border-red-500' : ''}
            />
            {errors.nickname && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.nickname}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Contraseña</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Tu contraseña segura"
                className={errors.password ? 'border-red-500' : ''}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Indicador de fortaleza de contraseña */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Confirmar Contraseña</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirma tu contraseña"
                className={errors.confirmPassword ? 'border-red-500' : ''}
                required
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
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Botón de Registro */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Crear cuenta
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 