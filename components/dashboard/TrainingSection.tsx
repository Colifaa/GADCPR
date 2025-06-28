'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Search, 
  Music, 
  Plus,
  Image as ImageIcon,
  Video,
  FileText,
  BarChart3,
  Presentation,
  Sparkles,
  Upload,
  RefreshCw,
  Wand2,
  BookOpen,
  Lightbulb,
  HelpCircle,
  PlayCircle,
  Users,
  Settings
} from 'lucide-react';

export function TrainingSection() {
  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Primeros Pasos',
      description: 'Aprende lo básico para comenzar a usar la plataforma',
      icon: PlayCircle,
      color: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      items: [
        'Configuración inicial de tu cuenta',
        'Navegación por el dashboard',
        'Personalización de tu perfil',
        'Configuración de preferencias'
      ]
    },
    {
      id: 'content-creation',
      title: 'Creación de Contenido',
      description: 'Consejos para generar contenido efectivo con IA',
      icon: Wand2,
      color: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      items: [
        'Cómo escribir mejores prompts',
        'Selección de tono y estilo adecuado',
        'Optimización de imágenes de referencia',
        'Mejores prácticas para redes sociales'
      ]
    },
    {
      id: 'data-analysis',
      title: 'Análisis y Métricas',
      description: 'Entiende tus datos para mejorar tu estrategia',
      icon: BarChart3,
      color: 'from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      items: [
        'Interpretación de métricas básicas',
        'Análisis de rendimiento de contenido',
        'Seguimiento de engagement',
        'Reportes de actividad'
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Solución de Problemas',
      description: 'Resuelve problemas comunes rápidamente',
      icon: HelpCircle,
      color: 'from-orange-50 to-amber-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      items: [
        'Problemas de carga de imágenes',
        'Errores de generación de contenido',
        'Problemas de conectividad',
        'Recuperación de contenido perdido'
      ]
    },
    {
      id: 'best-practices',
      title: 'Mejores Prácticas',
      description: 'Tips y consejos de expertos para optimizar tu trabajo',
      icon: Lightbulb,
      color: 'from-yellow-50 to-orange-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      items: [
        'Estrategias de contenido efectivas',
        'Organización de proyectos',
        'Colaboración en equipo',
        'Automatización de tareas'
      ]
    },
    {
      id: 'advanced-features',
      title: 'Funciones Avanzadas',
      description: 'Descubre características para usuarios experimentados',
      icon: Settings,
      color: 'from-cyan-50 to-blue-50',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      items: [
        'Integración con APIs externas',
        'Personalización avanzada',
        'Automatización de workflows',
        'Configuración de webhooks'
      ]
    }
  ];

  const quickTips = [
    {
      icon: '💡',
      title: 'Usa prompts específicos',
      description: 'Mientras más detallado sea tu prompt, mejores resultados obtendrás de la IA.'
    },
    {
      icon: '🎨',
      title: 'Experimenta con estilos',
      description: 'Prueba diferentes tonos y estilos para encontrar tu voz única.'
    },
    {
      icon: '📊',
      title: 'Revisa tus métricas',
      description: 'Analiza regularmente el rendimiento para mejorar tu estrategia.'
    },
    {
      icon: '🔄',
      title: 'Itera y mejora',
      description: 'No tengas miedo de regenerar contenido hasta obtener el resultado perfecto.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl mb-4">
          <BookOpen className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Centro de Ayuda
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Consejos, tutoriales y guías para aprovechar al máximo todas las funcionalidades de la plataforma
        </p>
      </div>

      {/* Quick Tips */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-green-600" />
            Consejos Rápidos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {helpCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id}
              className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${category.color} border-0`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${category.iconBg} rounded-xl group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-6 h-6 ${category.iconColor}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.items.length} guías
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                
                <div className="space-y-2 mb-4">
                  {category.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      {item}
                    </div>
                  ))}
                  {category.items.length > 3 && (
                    <div className="text-xs text-gray-500 ml-3.5">
                      +{category.items.length - 3} más...
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-white/80 transition-colors"
                >
                  Ver Guías
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 