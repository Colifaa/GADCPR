'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Video,
  Search,
  Calendar,
  Clock,
  Eye,
  Copy,
  Download,
  Share2,
  MoreVertical,
  Filter,
  ArrowLeft,
  Edit
} from 'lucide-react';
import { useVideoScriptsStore } from '@/store/video-scripts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';

export default function ScriptsPage() {
  const { scripts } = useVideoScriptsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScript, setSelectedScript] = useState<string | null>(null);

  const filteredScripts = scripts.filter(script => 
    script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    script.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'published': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'draft': return 'Borrador';
      case 'published': return 'Publicado';
      default: return 'Desconocido';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías agregar una notificación de éxito
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
        {/* Header */}
        <div className="px-4 lg:px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/content" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Guiones Generados
                </h1>
                <p className="text-gray-600">
                  Gestiona y organiza todos tus guiones de video
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/content">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Video className="w-4 h-4 mr-2" />
                  Crear Nuevo
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total de Guiones</p>
                    <p className="text-2xl font-bold text-blue-700">{scripts.length}</p>
                  </div>
                  <Video className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Completados</p>
                    <p className="text-2xl font-bold text-green-700">
                      {scripts.filter(s => s.status === 'completed').length}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Borradores</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {scripts.filter(s => s.status === 'draft').length}
                    </p>
                  </div>
                  <Edit className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Publicados</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {scripts.filter(s => s.status === 'published').length}
                    </p>
                  </div>
                  <Share2 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar guiones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>
            <Button variant="outline" className="hover:bg-purple-50 hover:border-purple-300">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Scripts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredScripts.map((script) => (
              <Card 
                key={script.id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {script.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(script.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {script.duration}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      {script.tone}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      {script.style}
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                      {script.focus}
                    </Badge>
                  </div>

                  {/* Content Preview */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {script.content}
                    </p>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <Badge className={`${getStatusColor(script.status)} text-xs`}>
                      {getStatusText(script.status)}
                    </Badge>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(script.content)}
                        className="hover:bg-purple-50"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-purple-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedScript(script.id)}
                        className="hover:bg-purple-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredScripts.length === 0 && (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl mb-4 inline-block">
                <Video className="w-16 h-16 text-purple-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? 'No se encontraron guiones' : 'No tienes guiones aún'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? 'Prueba con diferentes términos de búsqueda'
                  : 'Comienza creando tu primer guión de video con IA'
                }
              </p>
              {!searchQuery && (
                <Link href="/content">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Video className="w-4 h-4 mr-2" />
                    Crear Primer Guión
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
