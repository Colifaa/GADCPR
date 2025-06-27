"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="flex items-start">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-semibold text-white">scrito</span>
            </Link>
          </div>

          {/* Nosotros */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Nosotros</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/plataforma" className="text-gray-300 hover:text-white transition-colors duration-200">
                  La plataforma
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicio */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Servicio</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/funciones" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Funciones
                </Link>
              </li>
              <li>
                <Link href="/beneficios" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Beneficios
                </Link>
              </li>
            </ul>
          </div>

          {/* Legales */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legales</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terminos" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
