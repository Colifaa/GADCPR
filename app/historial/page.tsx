"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Music, Calendar, User, Clock, ChevronRight, BarChart3, CheckCircle, AlertCircle, Loader } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useHistoryStore, HistoryEntry } from "@/store/history"

export default function HistorialPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const { entries, removeEntry } = useHistoryStore()

  // Filtrar entradas
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.podcastTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.podcastAuthor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter
    
    // Filtro de fecha (simplificado)
    let matchesDate = true
    if (dateFilter !== "all") {
      const entryDate = new Date(entry.date)
      const now = new Date()
      
      switch (dateFilter) {
        case "today":
          matchesDate = entryDate.toDateString() === now.toDateString()
          break
        case "this-week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = entryDate >= weekAgo
          break
        case "this-month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = entryDate >= monthAgo
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Ordenar por fecha (más recientes primero)
  const sortedEntries = filteredEntries.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const getStatusIcon = (status: HistoryEntry['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'analyzing':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: HistoryEntry['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'analyzing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Historial de Análisis</h1>
          <Badge variant="outline" className="text-sm">
            {sortedEntries.length} análisis
          </Badge>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="flex-1 flex items-center gap-2 w-full">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por título, podcast o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>
            <Button 
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="px-4"
            >
              Limpiar
            </Button>
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white border-gray-300">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="analyzing">Analizando</SelectItem>
                <SelectItem value="failed">Fallido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40 bg-white border-gray-300">
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fechas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="this-week">Esta semana</SelectItem>
                <SelectItem value="this-month">Este mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de Entradas */}
        <div className="space-y-4">
          {sortedEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icono del Podcast */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <Badge className={`text-xs ${getStatusColor(entry.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(entry.status)}
                        {entry.status === 'completed' ? 'Completado' : 
                         entry.status === 'analyzing' ? 'Analizando' : 'Fallido'}
                      </div>
                    </Badge>
                  </div>

                  {/* Información Principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {entry.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Music className="w-4 h-4" />
                            <span className="font-medium">{entry.podcastTitle}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{entry.podcastAuthor}</span>
                          </div>
                          {entry.analysisData?.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{entry.analysisData.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(entry.date)}</span>
                          </div>
                        </div>

                        {entry.episodeTitle && (
                          <p className="text-sm text-gray-500 mb-2">
                            Episodio: {entry.episodeTitle}
                          </p>
                        )}

                        {entry.analysisData?.summary && (
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {entry.analysisData.summary}
                          </p>
                        )}

                        {entry.analysisData?.keyPoints && entry.analysisData.keyPoints.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-500 mb-1">Puntos clave:</p>
                            <div className="flex flex-wrap gap-1">
                              {entry.analysisData.keyPoints.slice(0, 3).map((point, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {point}
                                </Badge>
                              ))}
                              {entry.analysisData.keyPoints.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{entry.analysisData.keyPoints.length - 3} más
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeEntry(entry.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado Vacío */}
        {sortedEntries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all" 
                ? "No se encontraron análisis" 
                : "Aún no has analizado ningún podcast"
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                ? "Intenta ajustar tus filtros de búsqueda."
                : "Ve a la sección de Selecciones para analizar tu primer podcast."}
            </p>
            {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDateFilter("all")
                }}
                className="border-gray-300 hover:bg-gray-50"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 