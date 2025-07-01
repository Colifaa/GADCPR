"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo a la izquierda */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/">
            <Image src="/images/landing/logo/logo.png" alt="Logo" width={100} height={100} className="h-12 w-auto" />
          </Link>
        </div>

        {/* Enlaces de navegación centrados */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Home
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Sobre nosotros
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Servicios
            </Link>
            <Link
              href="/contacto"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Botón de inicio de sesión a la derecha */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/auth/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200">
              Iniciar sesión
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button (for responsive design) */}
        <button className="md:hidden flex items-center justify-center w-8 h-8 ml-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
