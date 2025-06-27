import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-row">
      {/* Lado izquierdo - Imagen */}
      <div className="hidden lg:flex lg:w-1/3 relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-10 z-10"></div>
        <Image src="/img/login/login.png" alt="Register background" fill className="" />
      </div>

      {/* Lado derecho - Navbar + Formulario */}
      <div className="w-full lg:w-2/3 flex flex-col min-h-screen bg-white">
        {/* Navbar superior */}
        <nav className="w-full bg-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/img/landing/logo/logo.png" alt="Logo" width={100} height={100} />
            </Link>
            {/* Regresar Link */}
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              Regresar
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md space-y-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
} 