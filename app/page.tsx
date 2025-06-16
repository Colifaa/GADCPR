import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, Target, BarChart3, Clock, Users } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Sparkles,
      title: 'Generación con IA',
      description: 'Crea contenido atractivo para todas las principales plataformas de redes sociales utilizando tecnología avanzada de IA.'
    },
    {
      icon: Target,
      title: 'Soporte Multiplataforma',
      description: 'Genera contenido optimizado para Instagram, Twitter, LinkedIn, YouTube, TikTok y Spotify.'
    },
    {
      icon: Clock,
      title: 'Programación Inteligente',
      description: 'Programa tu contenido para los momentos óptimos de interacción en diferentes plataformas.'
    },
    {
      icon: BarChart3,
      title: 'Análisis y Estadísticas',
      description: 'Sigue el rendimiento y las métricas de interacción para optimizar tu estrategia de contenido.'
    },
    {
      icon: Zap,
      title: 'Rápido y Eficiente',
      description: 'Genera contenido de alta calidad en segundos, no en horas. Ahorra tiempo y aumenta la productividad.'
    },
    {
      icon: Users,
      title: 'Colaboración en Equipo',
      description: 'Trabaja junto con tu equipo para crear, revisar y publicar contenido sin problemas.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Encabezado */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ContentAI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Comenzar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sección Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Automatiza tu Creación de Contenido con IA
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Genera publicaciones atractivas para redes sociales, guiones de video y contenido para podcasts en segundos.
            Deja que la IA maneje la creatividad mientras te enfocas en hacer crecer tu audiencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="text-lg px-8 py-4">
                Comienza a Crear Ahora
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Características Potentes para Creadores de Contenido</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Todo lo que necesitas para crear, programar y analizar el rendimiento de tu contenido en todas las plataformas.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm dark:bg-gray-800/60">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sección de Estadísticas */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">10,000+</div>
              <div className="text-blue-100">Piezas de Contenido Generadas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-blue-100">Creadores Satisfechos</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-blue-100">Plataformas Soportadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold">¿Listo para Transformar tu Estrategia de Contenido?</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Únete a miles de creadores de contenido que ya están usando ContentAI para hacer crecer su audiencia y ahorrar tiempo.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="text-lg px-8 py-4">
              Comienza Gratis
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="border-t bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ContentAI
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 ContentAI. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}