"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ImageIcon, Trash2, Music } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useProjectsStore, Project } from "@/store/projects"
import { useGeneratedContentStore } from "@/store/generated-content"
import { useVideoScriptsStore } from "@/store/video-scripts"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const router = useRouter()

  const { projects, removeProject, migrateProjects } = useProjectsStore()
  const { contents: generatedContents } = useGeneratedContentStore()
  const { scripts: videoScripts } = useVideoScriptsStore()

  // Migrar proyectos existentes una vez
  useEffect(() => {
    migrateProjects()
  }, [])

  const filteredProjects = projects.filter((project: Project) => {
    // Filtro por término de búsqueda
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtro por fecha
    let matchesDate = true
    if (dateFilter) {
      const projectDate = new Date(project.createdAt || project.date)
      const now = new Date()
      
      switch (dateFilter) {
        case "recent":
          // Ordenar por más reciente (esto se manejará en el ordenamiento)
          matchesDate = true
          break
        case "oldest":
          // Ordenar por más antiguo (esto se manejará en el ordenamiento)
          matchesDate = true
          break
        case "this-week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = projectDate >= weekAgo
          break
        case "this-month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = projectDate >= monthAgo
          break
        default:
          matchesDate = true
      }
    }
    
    return matchesSearch && matchesDate
  })

  // Ordenar proyectos según el filtro de fecha
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date)
    const dateB = new Date(b.createdAt || b.date)
    
    switch (dateFilter) {
      case "recent":
        return dateB.getTime() - dateA.getTime() // Más reciente primero
      case "oldest":
        return dateA.getTime() - dateB.getTime() // Más antiguo primero
      default:
        return dateB.getTime() - dateA.getTime() // Por defecto, más reciente primero
    }
  })

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
      removeProject(projectId)
    }
  }

  const handleViewAnalysis = (project: Project) => {
    // Debug: mostrar información del proyecto
    console.log('Proyecto seleccionado:', project.title)
    console.log('Contenido vinculado:', project.linkedContent)
    
    // Verificar si este proyecto tiene un guión vinculado
    if (project.linkedScriptId) {
      router.push(`/generated-content/scripts/${project.linkedScriptId}`)
      return
    }
    
    // Verificar si este proyecto tiene contenido de redes sociales vinculado
    if (project.linkedContent) {
      const params = new URLSearchParams({
        type: project.linkedContent.type,
        tone: project.linkedContent.tone,
        style: project.linkedContent.style
      })
      
      // Agregar música si está disponible
      if (project.linkedContent.music) {
        console.log('Música encontrada:', project.linkedContent.music)
        params.set('music', project.linkedContent.music)
      } else {
        console.log('No se encontró música en el proyecto')
      }
      
      console.log('URL generada:', `/generated-content/social?${params.toString()}`)
      router.push(`/generated-content/social?${params.toString()}`)
      return
    }
    
    // Fallback: buscar contenido más reciente si no hay vinculación específica
    if (videoScripts && videoScripts.length > 0) {
      const latestScript = videoScripts[0]
      router.push(`/generated-content/scripts/${latestScript.id}`)
      return
    }
    
    if (generatedContents && generatedContents.length > 0) {
      const latestContent = generatedContents[0]
      const params = new URLSearchParams({
        type: latestContent.type,
        tone: latestContent.tone || 'amigable',
        style: latestContent.style || 'educativos'
      })
      router.push(`/generated-content/social?${params.toString()}`)
    } else {
      // Si no hay contenido generado real, usar valores por defecto
      const params = new URLSearchParams({
        type: 'texto',
        tone: 'casual',
        style: 'entretenimiento'
      })
      router.push(`/generated-content/social?${params.toString()}`)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis proyectos</h1>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              onClick={() => {
                setSearchTerm("")
                setDateFilter("")
              }}
            >
              Limpiar
            </Button>
          </div>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32 bg-white border-gray-300">
              <SelectValue placeholder="Fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Reciente</SelectItem>
              <SelectItem value="oldest">Más antiguo</SelectItem>
              <SelectItem value="this-week">Esta semana</SelectItem>
              <SelectItem value="this-month">Este mes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {sortedProjects.map((project) => (
            <div key={project.id} className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-center gap-6">
              {/* Project Icon */}
              <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>

              {/* Project Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">{project.episodes} Episodios</p>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{project.date}</span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{project.subtitle}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Duración: {project.duration}</span>
                    <span>Número de oyentes: {project.listeners}</span>
                    {project.linkedContent?.music && (
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <Music className="w-4 h-4" />
                        <span>Con música</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleViewAnalysis(project)}
                    >
                      Visualizar contenido
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron proyectos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 