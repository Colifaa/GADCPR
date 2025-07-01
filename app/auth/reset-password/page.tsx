import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cambiar Contraseña - GADCPR',
  description: 'Cambia tu contraseña de GADCPR de forma segura',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ResetPasswordForm />
    </div>
  );
} 