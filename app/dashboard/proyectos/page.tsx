"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ImageIcon } from "lucide-react"
import NavbarUser from "@/components/dashboard/NavbarUser"

interface Project {
  id: string
  title: string
  episodes: number
  subtitle: string
  duration: string
  listeners: number
  date: string
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Creciendo Juntos",
    episodes: 3,
    subtitle: "Subtema principal: Colaboraciones y alianzas estratégicas",
    duration: "25 mins",
    listeners: 158,
    date: "15/08/00",
  },
  {
    id: "2",
    title: "Nexos Digitales",
    episodes: 5,
    subtitle: "Subtema principal: El verdadero valor del engagement",
    duration: "55 mins",
    listeners: 258,
    date: "15/08/00",
  },
  {
    id: "3",
    title: "Redes que Inspiran",
    episodes: 4,
    subtitle: "Subtema principal: Elementos de un contenido inspirador",
    duration: "48 mins",
    listeners: 698,
    date: "15/08/00",
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.subtitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <NavbarUser />
      <div className="max-w-6xl mx-auto mt-10">
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Buscar</Button>
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
          {filteredProjects.map((project) => (
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
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
                      Ver Análisis
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Visualizar contenido</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron proyectos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
