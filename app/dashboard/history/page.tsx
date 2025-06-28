"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Music } from "lucide-react"
import NavbarUser from "@/components/dashboard/NavbarUser"

interface HistoryEntry {
  id: string
  title: string
  date: string
  type: "podcast"
}

const mockHistoryEntries: HistoryEntry[] = [
  {
    id: "1",
    title: "¿Cómo Sabes si Tu Comunidad está Creciendo?",
    date: "15/08/00",
    type: "podcast",
  },
  {
    id: "2",
    title: "Crecimiento en Red",
    date: "15/08/00",
    type: "podcast",
  },
  {
    id: "3",
    title: "Estrategias para Conectar",
    date: "15/08/00",
    type: "podcast",
  },
  {
    id: "4",
    title: "Más Allá del Like",
    date: "15/08/00",
    type: "podcast",
  },
]

export default function HistorialPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const filteredEntries = mockHistoryEntries.filter((entry) =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarUser />
      <div className="max-w-6xl mx-auto mt-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Historial</h1>

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

        {/* History Entries */}
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center gap-4">
              {/* Podcast Icon */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center mb-2">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">Podcast</span>
              </div>

              {/* Entry Info */}
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{entry.title}</h3>
                </div>
                <span className="text-sm text-gray-500 font-medium">{entry.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron entradas que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
