'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-row">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/3 relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-10 z-10"></div>
        <Image src="/images/login/login.png" alt="Login background" fill className="" />
      </div>

      {/* Right Side - Navbar + Login Form */}
      <div className="w-full lg:w-2/3 flex flex-col min-h-screen bg-white">
        {/* Login Navbar solo en la mitad derecha */}
        <nav className="w-full bg-white px-6 py-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/landing/logo/logo.png" alt="Logo" width={100} height={100} />
        </Link>

        {/* Regresar Link */}
        <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
          Regresar
        </Link>
      </div>
    </nav>
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md space-y-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
