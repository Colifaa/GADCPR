'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        // Obtener el usuario actualizado después del login
        const { user } = useAuthStore.getState();
        
        // Verificar si el usuario es admin
        if (user && (user.email === 'admin@contentai.com' || user.plan === 'admin')) {
          router.push('/admin');
        } else if (user && !user.hasCompletedOnboarding) {
          // Verificar si el usuario ha completado el onboarding
          router.push('/auth/onboarding');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Verificar si el usuario existe pero está baneado
        const users = JSON.parse(localStorage.getItem('users-db') || '[]');
        const user = users.find((u: any) => u.email === email);
        
        if (user) {
          if (user.status === 'suspended') {
            setError('Tu cuenta ha sido suspendida por el administrador. Contacta al soporte para más información.');
          } else if (user.status === 'inactive') {
            setError('Tu cuenta está inactiva. Contacta al administrador para reactivarla.');
          } else if (user.status === 'pending') {
            setError('Tu cuenta está pendiente de aprobación. Por favor espera la confirmación del administrador.');
          } else {
            setError('Contraseña incorrecta. Por favor, verifica tu contraseña.');
          }
        } else {
          setError('No existe una cuenta con este email. Por favor verifica o crea una nueva cuenta.');
        }
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">¡Bienvenido!</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Username Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-600">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-600">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Forgot Password Link */}
          <div className="text-left">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Olvidé contraseña
            </Link>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <Label htmlFor="remember" className="text-sm text-gray-600">
              Recordarme
            </Label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>

          {/* Create Account Link */}
          <div className="text-center">
            <span className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Crear Cuenta
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}