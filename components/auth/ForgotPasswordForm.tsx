'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ForgotPasswordFormProps {
  onBack?: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<'form' | 'sent'>('form');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 Iniciando cambio de contraseña para:', email);
      
      // Verificar si el email existe en la base de datos
      const users = JSON.parse(localStorage.getItem('users-db') || '[]');
      console.log('📊 Usuarios en base de datos:', users.length);
      
      const userExists = users.find((user: any) => user.email === email);
      console.log('👤 Usuario encontrado:', userExists ? 'Sí' : 'No');

      if (!userExists) {
        setError('No existe una cuenta con este correo electrónico.');
        setIsLoading(false);
        return;
      }

      console.log('🔐 Contraseña anterior:', userExists.password);
      console.log('🔐 Nueva contraseña:', newPassword);

      // Actualizar la contraseña en localStorage
      const updatedUsers = users.map((user: any) => 
        user.email === email 
          ? { ...user, password: newPassword }
          : user
      );
      
      localStorage.setItem('users-db', JSON.stringify(updatedUsers));
      
      // Verificar que se guardó correctamente
      const verifyUsers = JSON.parse(localStorage.getItem('users-db') || '[]');
      const verifyUser = verifyUsers.find((user: any) => user.email === email);
      console.log('✅ Contraseña actualizada verificada:', verifyUser?.password);

      // Simular proceso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('🎉 Cambio de contraseña completado exitosamente');
      setStep('sent');
    } catch (err) {
      console.error('❌ Error al cambiar contraseña:', err);
      setError('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'sent') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Contraseña actualizada!</h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Tu contraseña ha sido cambiada exitosamente para <strong>{email}</strong>. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-green-800">
                <strong>Tip:</strong> Usa tu nueva contraseña para iniciar sesión
              </p>
            </div>
          </div>

          <Link href="/auth/login">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200">
              Volver al login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">¿Olvidaste tu contraseña?</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Ingresa tu correo electrónico y te ayudaremos a recuperar tu cuenta.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Email Field */}
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

          {/* Nueva contraseña */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-600">
              Ingresa nueva contraseña
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          {/* Repetir contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600">
              Repite la contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cambiando contraseña...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 